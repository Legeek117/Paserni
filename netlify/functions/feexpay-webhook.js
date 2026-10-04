// Netlify Function - Webhook FeeXPay
// Remplace le serveur Python Render (POST /webhooks/feexpay)

const { createClient } = require('@supabase/supabase-js');

exports.handler = async (event) => {
  // Accepter seulement les POST
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ error: 'Method Not Allowed' }) };
  }

  let payload;
  try {
    payload = JSON.parse(event.body || '{}');
  } catch {
    return { statusCode: 400, body: JSON.stringify({ error: 'Invalid JSON' }) };
  }

  const { transaction_id, status, order_number } = payload;

  console.log('FeeXPay webhook reçu:', { transaction_id, status, order_number });

  // Mettre à jour Supabase si les infos sont présentes
  if (order_number && status) {
    try {
      const supabaseUrl = process.env.VITE_SUPABASE_URL;
      const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

      if (supabaseUrl && supabaseKey) {
        const supabase = createClient(supabaseUrl, supabaseKey);

        const paymentStatus = status === 'SUCCESSFUL' || status === 'SUCCESS' || status === 'COMPLETED'
          ? 'paid'
          : status === 'FAILED' || status === 'CANCELLED'
          ? 'failed'
          : 'pending';

        // Mise à jour de la commande
        const { error } = await supabase
          .from('orders')
          .update({
            payment_status: paymentStatus,
            payment_transaction_id: transaction_id,
            updated_at: new Date().toISOString(),
          })
          .eq('order_number', order_number);

        if (error) {
          console.error('Erreur Supabase:', error);
        } else {
          console.log(`Commande ${order_number} mise à jour → ${paymentStatus}`);
        }

        // Log dans payment_logs si la table existe
        await supabase.from('payment_logs').insert({
          transaction_id,
          order_number,
          status,
          raw_payload: payload,
          created_at: new Date().toISOString(),
        }).then(() => {}).catch(() => {}); // silencieux si table inexistante
      }
    } catch (err) {
      console.error('Erreur webhook:', err);
    }
  }

  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ok: true }),
  };
};
