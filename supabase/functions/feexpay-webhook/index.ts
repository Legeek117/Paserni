// Supabase Edge Function - Webhook FeeXPay
// URL: https://ukfljeermkhproggliae.supabase.co/functions/v1/feexpay-webhook
// Appelée par FeeXPay après chaque paiement (succès ou échec)

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-feexpay-signature, x-signature',
}

// Convertit le statut FeeXPay vers le statut interne
function mapPaymentStatus(providerStatus: string): string {
  const s = (providerStatus || '').toUpperCase()
  if (['SUCCESS', 'SUCCESSFUL', 'COMPLETED', 'APPROVED'].includes(s)) return 'confirmed'
  if (['FAIL', 'FAILED', 'CANCELED', 'CANCELLED', 'REJECTED'].includes(s)) return 'failed'
  return 'pending'
}

serve(async (req: Request) => {
  // Gérer les preflight CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  // Route health check
  if (req.method === 'GET') {
    return new Response(
      JSON.stringify({ ok: true, service: 'feexpay-webhook', version: '2.0.0' }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }

  // Accepter seulement les POST pour le webhook
  if (req.method !== 'POST') {
    return new Response(
      JSON.stringify({ error: 'Method Not Allowed' }),
      { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }

  // Lire le body
  let payload: Record<string, unknown>
  try {
    payload = await req.json()
  } catch {
    return new Response(
      JSON.stringify({ error: 'Invalid JSON' }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }

  // Extraire les champs — FeeXPay peut utiliser différents noms de champs
  const transactionId = (payload.transaction_id || payload.reference || '') as string
  const orderRef = (payload.order_number || payload.reference || '') as string
  const providerStatus = (payload.status || payload.payment_status || '') as string
  const providerName = (payload.payment_provider || 'feexpay') as string
  const amount = payload.amount as number | undefined

  console.log('FeeXPay webhook reçu:', { transactionId, orderRef, providerStatus })

  // Vérifier qu'on a au moins un identifiant
  if (!transactionId && !orderRef) {
    return new Response(
      JSON.stringify({ error: 'transaction_id ou order_number requis' }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }

  // Créer le client Supabase avec la clé service_role (bypass RLS)
  const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? ''
  const supabaseServiceKey = Deno.env.get('SERVICE_ROLE_KEY') ?? ''

  if (!supabaseUrl || !supabaseServiceKey) {
    console.error('Variables Supabase manquantes')
    return new Response(
      JSON.stringify({ error: 'Configuration serveur manquante' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey)
  const statusApp = mapPaymentStatus(providerStatus)
  const updateData = {
    transaction_id: transactionId || null,
    payment_reference: orderRef || null,
    payment_provider: providerName,
    payment_status: providerStatus,
    status: statusApp,
    updated_at: new Date().toISOString(),
  }

  try {
    // 1. Chercher et mettre à jour par order_number
    if (orderRef) {
      const { data: existing } = await supabase
        .from('orders')
        .select('id')
        .eq('order_number', orderRef)
        .limit(1)

      if (existing && existing.length > 0) {
        const { error } = await supabase
          .from('orders')
          .update(updateData)
          .eq('order_number', orderRef)

        if (error) console.error('Erreur update order_number:', error)
        else console.log(`✅ Commande ${orderRef} → ${statusApp}`)

        return new Response(
          JSON.stringify({ ok: true }),
          { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }
    }

    // 2. Chercher par transaction_id
    if (transactionId) {
      const { data: existingTx } = await supabase
        .from('orders')
        .select('id')
        .eq('transaction_id', transactionId)
        .limit(1)

      if (existingTx && existingTx.length > 0) {
        const { error } = await supabase
          .from('orders')
          .update(updateData)
          .eq('transaction_id', transactionId)

        if (error) console.error('Erreur update transaction_id:', error)
        else console.log(`✅ Transaction ${transactionId} → ${statusApp}`)

        return new Response(
          JSON.stringify({ ok: true }),
          { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }
    }

    // 3. Insérer si la commande n'existe pas encore
    const { error: insertError } = await supabase.from('orders').insert({
      order_number: orderRef || null,
      transaction_id: transactionId || null,
      payment_reference: orderRef || null,
      payment_provider: providerName,
      payment_status: providerStatus,
      status: statusApp,
      total_amount: amount || null,
      notes: 'Créé automatiquement par webhook FeeXPay',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })

    if (insertError) console.error('Erreur insert:', insertError)
    else console.log(`✅ Nouvelle commande insérée ${orderRef || transactionId} → ${statusApp}`)

  } catch (err) {
    console.error('Erreur inattendue:', err)
    return new Response(
      JSON.stringify({ error: 'Erreur serveur' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }

  return new Response(
    JSON.stringify({ ok: true }),
    { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  )
})
