import React from 'react'
import { getTransactionStatus } from '../lib/feexpay'
import { supabase } from '../lib/supabase'

import { CheckCircle2, XCircle, Loader2, ArrowRight, Copy, Check } from 'lucide-react'

const PaymentReturn: React.FC = () => {
  const [status, setStatus] = React.useState<'loading'|'success'|'failed'|'unknown'>('loading')
  const [orderNumber, setOrderNumber] = React.useState<string>('')
  const [message, setMessage] = React.useState<string>('')
  const [txId, setTxId] = React.useState<string>('')
  const [retrying, setRetrying] = React.useState<boolean>(false)
  const [copied, setCopied] = React.useState<boolean>(false)
  React.useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const params = new URLSearchParams(window.location.search)
        const tx = params.get('transaction_id') || ''
        const ref = params.get('reference') || params.get('order') || ''
        setTxId(tx)
        setOrderNumber(ref)
        if (!tx) {
          setStatus('unknown'); setMessage('Transaction introuvable'); return
        }
        const s = await getTransactionStatus(tx)
        if (cancelled) return
        if (s === 'SUCCESSFUL') {
          setStatus('success'); setMessage('Paiement réussi')
          if (ref) {
            await supabase.from('orders').update({ status: 'confirmed' }).eq('order_number', ref)
          }
        } else if (s === 'FAILED') {
          setStatus('failed'); setMessage('Paiement échoué')
          if (ref) {
            await supabase.from('orders').update({ status: 'failed' }).eq('order_number', ref)
          }
        } else {
          setStatus('unknown'); setMessage('Paiement en attente de confirmation')
        }
      } catch (e) {
        setStatus('unknown'); setMessage('Erreur lors de la vérification du paiement')
      }
    })()
    return () => { cancelled = true }
  }, [])
  const retry = async () => {
    if (!txId) return
    setRetrying(true)
    try {
      const s = await getTransactionStatus(txId)
      if (s === 'SUCCESSFUL') {
        setStatus('success'); setMessage('Paiement réussi')
        if (orderNumber) await supabase.from('orders').update({ status: 'confirmed' }).eq('order_number', orderNumber)
      } else if (s === 'FAILED') {
        setStatus('failed'); setMessage('Paiement échoué')
        if (orderNumber) await supabase.from('orders').update({ status: 'failed' }).eq('order_number', orderNumber)
      } else {
        setStatus('unknown'); setMessage('Paiement en attente de confirmation')
      }
    } catch {
      setStatus('unknown'); setMessage('Erreur lors de la vérification du paiement')
    } finally {
      setRetrying(false)
    }
  }

  const copyOrderNumber = async () => {
    if (!orderNumber) return
    try {
      await navigator.clipboard.writeText(orderNumber)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      }
  }

  const Icon = status === 'success' ? CheckCircle2 : status === 'failed' ? XCircle : Loader2
  const iconClass = status === 'success' ? 'text-green-600' : status === 'failed' ? 'text-red-600' : 'text-gray-500 animate-spin'
  return (
    <div className="min-h-screen py-16">
      <div className="max-w-lg mx-auto px-4">
        <div className="bg-white border rounded-xl shadow-sm p-6 text-center">
          <div className="flex items-center justify-center mb-3">
            <Icon className={`w-12 h-12 ${iconClass}`} />
          </div>
          <h1 className="text-2xl font-semibold mb-2">Retour de paiement</h1>
          <p className="text-gray-600 mb-4">{message}</p>
          
          {orderNumber && status === 'success' && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
              <div className="flex items-center gap-2 mb-3">
                <CheckCircle2 className="w-5 h-5 text-green-600" />
                <h3 className="font-semibold text-green-800">Paiement effectué avec succès !</h3>
              </div>
              
              <div className="bg-white border border-green-200 rounded-lg p-3 mb-4">
                <div className="text-xs text-gray-500 mb-1">Code de suivi de votre commande</div>
                <div className="flex items-center gap-2">
                  <div className="font-mono text-sm bg-gray-100 px-2 py-1 rounded flex-1 text-center">
                    {orderNumber}
                  </div>
                  <button
                    onClick={copyOrderNumber}
                    className="flex items-center gap-1 px-3 py-1 bg-orange-600 hover:bg-orange-700 text-white text-xs rounded transition-colors"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3 h-3" />
                        Copié !
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        Copier
                      </>
                    )}
                  </button>
                </div>
              </div>
              
              <div className="text-xs text-gray-600 bg-blue-50 border border-blue-200 rounded p-2">
                <p className="font-medium text-blue-800 mb-1">💡 Comment suivre votre commande :</p>
                <p>1. Allez dans la section "Mes Commandes"</p>
                <p>2. Collez ce code dans le champ de recherche</p>
                <p>3. Consultez le statut et les détails de votre commande</p>
              </div>
            </div>
          )}
          
          {orderNumber && status !== 'success' && (
            <div className="bg-gray-50 border rounded-lg p-3 text-left mb-4">
              <div className="text-xs text-gray-500">Identifiant de commande</div>
              <div className="font-mono text-sm">{orderNumber}</div>
            </div>
          )}
          <div className="flex gap-2 justify-center">
            <a href={orderNumber ? `/mes-commandes?order=${encodeURIComponent(orderNumber)}` : '/mes-commandes'} className="inline-flex items-center gap-2 px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded">
            Voir ma commande <ArrowRight className="w-4 h-4" />
            </a>
            <button onClick={retry} disabled={retrying || !txId} className="px-4 py-2 border rounded disabled:opacity-50">{retrying ? 'Vérification…' : 'Réessayer'}</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PaymentReturn
