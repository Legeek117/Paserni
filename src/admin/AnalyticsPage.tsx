import React from 'react'

import { supabase, Order, OrderItem } from '../lib/supabase'
import { useCountry } from '../contexts/CountryContext'





const AnalyticsPage: React.FC = () => {
  const { selectedCountry } = useCountry()
  const [loading, setLoading] = React.useState(true)
  const [orders, setOrders] = React.useState<Order[]>([])
  const [orderItems, setOrderItems] = React.useState<OrderItem[]>([])
  const [error, setError] = React.useState<string | null>(null)
  React.useEffect(() => {
    (async () => {
      setLoading(true)
      setError(null)
      const [{ data: o, error: eo }, { data: oi, error: eoi }] = await Promise.all([
        supabase.from('orders').select('*').eq('country', selectedCountry),
        supabase.from('order_items').select('*')
      ])
      if (eo) setError(eo.message)
      if (eoi) setError(eoi.message)
      setOrders(o || [])
      setOrderItems(oi || [])
      setLoading(false)
    })()
  }, [selectedCountry])
  const totalOrders = orders.length
  const revenue = orders.reduce((s, o) => s + Number(o.total_amount || 0), 0)
  const byStatus: Record<string, number> = orders.reduce((acc, o) => { acc[o.status] = (acc[o.status] || 0) + 1; return acc }, {} as Record<string, number>)
  const topItems = Object.values(orderItems.reduce((acc: Record<string, { name: string, qty: number }>, it) => {
    const key = it.item_name
    if (!acc[key]) acc[key] = { name: key, qty: 0 }
    acc[key].qty += Number(it.quantity)
    return acc
  }, {})).sort((a,b)=>b.qty-a.qty).slice(0,5)
  return (
    <div className="p-3 sm:p-4 md:p-6 lg:p-8 animate-fadeIn">
      <h2 className="text-xl font-semibold mb-3">Analytics</h2>
      {error && <div className="text-red-600 text-sm mb-3">{error}</div>}
      {loading ? (
        <div className="py-12 text-center text-gray-600">Chargement…</div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-4">
            <div className="border rounded-lg p-4">
              <div className="text-gray-500 text-sm">Commandes</div>
              <div className="text-2xl font-bold">{totalOrders}</div>
            </div>
            <div className="border rounded-lg p-4">
              <div className="text-gray-500 text-sm">Revenus (F CFA)</div>
              <div className="text-2xl font-bold text-orange-700">{revenue.toLocaleString('fr-FR')}</div>
            </div>
            <div className="border rounded-lg p-4">
              <div className="text-gray-500 text-sm">Prêtes</div>
              <div className="text-2xl font-bold">{byStatus['ready'] || 0}</div>
            </div>
            <div className="border rounded-lg p-4">
              <div className="text-gray-500 text-sm">Livrées</div>
              <div className="text-2xl font-bold">{byStatus['delivered'] || 0}</div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border rounded-lg p-4">
              <div className="font-semibold mb-2">Répartition par statut</div>
              <ul className="text-sm text-gray-700 space-y-1">
                {Object.entries(byStatus).map(([k,v]) => (
                  <li key={k} className="flex justify-between"><span>{k}</span><span className="font-semibold">{v}</span></li>
                ))}
                {Object.keys(byStatus).length===0 && <li className="text-gray-500">Aucune donnée</li>}
              </ul>
            </div>
            <div className="border rounded-lg p-4">
              <div className="font-semibold mb-2">Top 5 articles</div>
              <ul className="text-sm text-gray-700 space-y-1">
                {topItems.map(it => (
                  <li key={it.name} className="flex justify-between"><span className="truncate mr-2">{it.name}</span><span className="font-semibold">x{it.qty}</span></li>
                ))}
                {topItems.length===0 && <li className="text-gray-500">Aucune donnée</li>}
              </ul>
            </div>
          </div>
        </>
      )}
    </div>
  )
}


export default AnalyticsPage
