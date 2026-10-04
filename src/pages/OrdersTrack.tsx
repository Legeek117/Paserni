import React from 'react'
import { supabase } from '../lib/supabase'
import { motion } from 'framer-motion'

import { Search, Clipboard as ClipboardIcon, User, Receipt, CalendarClock, CheckCircle2, Package, CookingPot, UtensilsCrossed, Truck } from 'lucide-react'

const OrdersTrack: React.FC = () => {
  const [orderId, setOrderId] = React.useState('')
  type OrderItem = { id?: string; item_name: string; item_type: string; quantity: number; unit_price: number; total_price: number; item_image?: string }
  type OrderResult = { order_number: string; status: string; total_amount: number; customer_name: string; created_at: string; order_items?: OrderItem[] }
  const [result, setResult] = React.useState<OrderResult | null>(null)
  const [loading, setLoading] = React.useState(false)
  const [copied, setCopied] = React.useState(false)
  const copyToClipboard = async (text: string) => {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text)
      } else {
        const ta = document.createElement('textarea')
        ta.value = text
        ta.style.position = 'fixed'
        ta.style.left = '-9999px'
        document.body.appendChild(ta)
        ta.focus()
        ta.select()
        document.execCommand('copy')
        document.body.removeChild(ta)
      }
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
  } catch (e) { }
  }
  const search = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!orderId.trim()) return
    setLoading(true)
    setResult(null)
    const { data, error } = await supabase
      .from('orders')
      .select(`
        id, 
        order_number, 
        status, 
        total_amount, 
        customer_name, 
        created_at, 
        order_items(
          id, 
          item_name, 
          item_type, 
          quantity, 
          unit_price, 
          total_price, 
          item_image
        )
      `)
      .eq('order_number', orderId.trim())
      .single()
    if (!error) setResult(data)
    setLoading(false)
  }
  const statusSteps = [
    { id: 'pending', label: 'Reçue', icon: Receipt },
    { id: 'confirmed', label: 'Confirmée', icon: CheckCircle2 },
    { id: 'preparing', label: 'En préparation', icon: CookingPot },
    { id: 'ready', label: 'Prête', icon: UtensilsCrossed },
    { id: 'delivered', label: 'Livrée', icon: Truck }
  ] as const
  const currentIndex = result ? statusSteps.findIndex(s => s.id === result.status) : -1
  const badgeClasses = (status?: string) => {
    switch (status) {
      case 'pending': return 'border-amber-500 text-amber-700'
      case 'confirmed': return 'border-blue-500 text-blue-700'
      case 'preparing': return 'border-purple-500 text-purple-700'
      case 'ready': return 'border-green-600 text-green-700'
      case 'delivered': return 'border-emerald-600 text-emerald-700'
      default: return 'border-gray-400 text-gray-600'
    }
  }
  return (
    <div className="min-h-screen py-8 pt-6 md:pt-8">
      <div className="max-w-4xl mx-auto px-4">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }} className="text-center mb-6">
          <h1 className="text-3xl font-serif font-bold">Mes commandes</h1>
          <p className="text-gray-600 mt-1">Recherchez le statut de votre commande avec votre identifiant.</p>
        </motion.div>
        <motion.form initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.05 }} onSubmit={search} className="flex flex-col sm:flex-row gap-2 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input value={orderId} onChange={(e)=>setOrderId(e.target.value)} placeholder="Ex: CMD-ABCDEFG" className="w-full pl-10 p-3 border rounded" />
          </div>
          <button type="submit" disabled={loading} className="px-4 py-3 bg-orange-600 hover:bg-orange-700 text-white rounded">{loading ? 'Recherche…' : 'Rechercher'}</button>
        </motion.form>
        {result ? (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="bg-white border rounded-xl shadow-sm overflow-hidden">
            <div className="bg-gray-50 px-4 py-3 border-b flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ClipboardIcon className="w-5 h-5 text-gray-500" />
                <div>
                  <div className="text-xs text-gray-500">Identifiant de commande</div>
                  <div className="font-semibold tracking-wide">{result.order_number}</div>
                </div>
              </div>
              <button onClick={() => copyToClipboard(result.order_number)} className="px-3 py-1.5 border rounded text-sm hover:bg-gray-100">{copied ? 'Copié' : 'Copier'}</button>
            </div>
            <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-start gap-3">
                <User className="w-5 h-5 text-gray-500 mt-0.5" />
                <div>
                  <div className="text-xs text-gray-500 mb-1">Client</div>
                  <div className="text-gray-900">{result.customer_name}</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Package className="w-5 h-5 text-gray-500 mt-0.5" />
                <div>
                  <div className="text-xs text-gray-500 mb-1">Montant</div>
                  <div className="text-gray-900 font-semibold">{Number(result.total_amount).toLocaleString('fr-FR')} F CFA</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-gray-500 mt-0.5" />
                <div>
                  <div className="text-xs text-gray-500 mb-1">Statut</div>
                  <span className={`inline-block text-sm px-2 py-0.5 rounded border ${badgeClasses(result.status)}`}>{result.status}</span>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CalendarClock className="w-5 h-5 text-gray-500 mt-0.5" />
                <div>
                  <div className="text-xs text-gray-500 mb-1">Date de création</div>
                  <div className="text-gray-900">{new Date(result.created_at).toLocaleString()}</div>
                </div>
              </div>
            </div>
            {/* Articles */}
            <div className="px-4 pb-5">
              <div className="text-xs text-gray-500 mb-2">Articles commandés</div>
              {Array.isArray(result.order_items) && result.order_items.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {(result.order_items || []).map((it, idx) => (
                    <div key={it.id || idx} className="border rounded-lg p-3 flex gap-3">
                      <div className="w-16 h-16 bg-gray-100 rounded overflow-hidden flex-shrink-0">
                        {it.item_image ? (
                          <img src={it.item_image} alt={it.item_name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">Image</div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-gray-900 truncate">{it.item_name}</div>
                        <div className="text-xs text-gray-500 mb-1">{it.item_type === 'restaurant' ? 'Restaurant' : 'Galerie d\'Art'}</div>
                        <div className="text-sm text-gray-800">x{it.quantity} • {Number(it.unit_price).toLocaleString('fr-FR')} F</div>
                      </div>
                      <div className="text-sm font-semibold text-gray-900">{Number(it.total_price).toLocaleString('fr-FR')} F</div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-sm text-gray-600">Aucun article trouvé pour cette commande.</div>
              )}
            </div>
            {/* Progression */}
            <div className="px-4 pb-5">
              <div className="text-xs text-gray-500 mb-2">Progression</div>
              <div className="flex items-center justify-between">
                {statusSteps.map((step, idx) => {
                  const active = currentIndex >= idx
                  const Icon = step.icon
                  return (
                    <div key={step.id} className="flex-1 flex items-center">
                      <div className={`flex flex-col items-center ${idx !== 0 ? 'ml-2' : ''}`}>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white ${active ? 'bg-orange-600' : 'bg-gray-300'}`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <div className="mt-1 text-[11px] text-gray-600 text-center whitespace-nowrap">{step.label}</div>
                      </div>
                      {idx < statusSteps.length - 1 && (
                        <div className={`h-1 flex-1 mx-2 rounded ${currentIndex > idx ? 'bg-orange-500' : 'bg-gray-200'}`} />
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }} className="text-gray-600">
            Saisissez votre identifiant de commande pour voir son statut.
          </motion.div>
        )}
      </div>
    </div>
  )
}

export default OrdersTrack
