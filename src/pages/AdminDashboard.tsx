import React, { useState, useEffect } from 'react'
import { supabase, Order, OrderItem } from '../lib/supabase'
import { useCountry } from '../contexts/CountryContext'
import { Clock, CheckCircle, Package, Truck, User, Phone, MapPin } from 'lucide-react'

interface OrderWithItems extends Order {
  order_items: OrderItem[]
}

const AdminDashboard: React.FC = () => {
  const { selectedCountry } = useCountry()
  const [orders, setOrders] = useState<OrderWithItems[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'pending' | 'confirmed' | 'preparing' | 'ready' | 'delivered'>('all')
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState<'all' | 'restaurant' | 'gallery' | 'mobilier'>('all')
  const [startDate, setStartDate] = useState<string>('')
  const [endDate, setEndDate] = useState<string>('')
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [totalCount, setTotalCount] = useState(0)

  // Ensure top-of-page on mount to avoid landing mid-screen
  useEffect(() => {
    try {
      window.scrollTo(0, 0)
      document.documentElement.scrollTop = 0
      ;(document.scrollingElement || document.body).scrollTop = 0
    } catch {}
  }, [])

  useEffect(() => {
    fetchOrders()
  }, [filter, page, pageSize, startDate, endDate, selectedCountry])

  const fetchOrders = async () => {
    setLoading(true)
    // Count total first for pagination (respecting server-side filters)
    let countQuery = supabase
      .from('orders')
      .select('*', { count: 'exact', head: true })

    // Pays courant
    countQuery = countQuery.eq('country', selectedCountry)

    if (filter !== 'all') {
      countQuery = countQuery.eq('status', filter)
    }
    if (startDate) {
      countQuery = countQuery.gte('created_at', new Date(startDate).toISOString())
    }
    if (endDate) {
      const end = new Date(endDate)
      end.setHours(23,59,59,999)
      countQuery = countQuery.lte('created_at', end.toISOString())
    }

    const { count } = await countQuery
    if (typeof count === 'number') setTotalCount(count)

    let query = supabase
      .from('orders')
      .select(`
        *,
        order_items:order_items(*)
      `)
      .order('created_at', { ascending: false })

    // Pays courant
    query = query.eq('country', selectedCountry)

    if (filter !== 'all') {
      query = query.eq('status', filter)
    }
    if (startDate) {
      query = query.gte('created_at', new Date(startDate).toISOString())
    }
    if (endDate) {
      const end = new Date(endDate)
      end.setHours(23,59,59,999)
      query = query.lte('created_at', end.toISOString())
    }

    const from = (page - 1) * pageSize
    const to = from + pageSize - 1
    query = query.range(from, to)

    const { data, error } = await query
    if (error) {
      alert('Erreur lors du chargement des commandes')
    } else {
      // Client-side search and type filtering (on joined items)
      let result = (data || []) as OrderWithItems[]
      if (search.trim()) {
        const q = search.trim().toLowerCase()
        result = result.filter(o =>
          (o.order_number?.toLowerCase().includes(q)) ||
          (o.customer_name?.toLowerCase().includes(q)) ||
          (o.customer_phone?.toLowerCase().includes(q))
        )
      }
      if (typeFilter !== 'all') {
        result = result.filter(o => (o.order_items || []).some(oi => oi.item_type === typeFilter))
      }
      setOrders(result)
    }
    setLoading(false)
  }

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    const { error } = await supabase
      .from('orders')
      .update({ status: newStatus, updated_at: new Date().toISOString() })
      .eq('id', orderId)

    if (error) {
      alert('Erreur lors de la mise à jour')
    } else {
      fetchOrders()
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'confirmed': return 'bg-blue-100 text-blue-800'
      case 'preparing': return 'bg-purple-100 text-purple-800'
      case 'ready': return 'bg-green-100 text-green-800'
      case 'delivered': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="w-4 h-4" />
      case 'confirmed': return <CheckCircle className="w-4 h-4" />
      case 'preparing': return <Package className="w-4 h-4" />
      case 'ready': return <Truck className="w-4 h-4" />
      case 'delivered': return <CheckCircle className="w-4 h-4" />
      default: return <Clock className="w-4 h-4" />
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pending': return 'En attente'
      case 'confirmed': return 'Confirmée'
      case 'preparing': return 'En préparation'
      case 'ready': return 'Prête'
      case 'delivered': return 'Livrée'
      default: return status
    }
  }

  const exportCsv = () => {
    const rows = [
      ['Numéro', 'Date', 'Client', 'Téléphone', 'Statut', 'Total', 'Articles'] as string[]
    ]
    orders.forEach(o => {
      const items = (o.order_items || []).map(i => `${i.item_name} x${i.quantity}`).join(' | ')
      rows.push([
        o.order_number,
        new Date(o.created_at).toLocaleString('fr-FR'),
        o.customer_name,
        o.customer_phone,
        getStatusLabel(o.status),
        String(o.total_amount),
        items
      ])
    })
    const csv = rows.map(r => r.map(v => '"' + (v ?? '').replace(/"/g, '""') + '"').join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `commandes_${new Date().toISOString().slice(0,10)}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="p-3 sm:p-4 md:p-6 lg:p-8 animate-fadeIn">
      <div className="w-full">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2 transition-all duration-300">Dashboard Admin</h1>
          <p className="text-sm sm:text-base text-gray-600 transition-all duration-300">Gérez les commandes de votre restaurant et galerie</p>
        </div>

        {/* Filtres Ultra Responsive */}
        <div className="mb-6 space-y-4">
          {/* Barre de recherche principale */}
          <div className="relative">
            <input
              type="text"
              placeholder="🔍 Recherche (numéro, client, téléphone)"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full px-4 py-3 sm:py-4 text-sm sm:text-base border border-gray-300 rounded-xl bg-white/80 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all duration-300 hover:bg-white hover:shadow-md"
            />
          </div>

          {/* Filtres en grille responsive */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
            <select 
              value={filter} 
              onChange={(e) => setFilter(e.target.value as any)} 
              className="px-3 py-2.5 sm:py-3 text-sm border border-gray-300 rounded-xl bg-white/80 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all duration-300 hover:bg-white hover:shadow-sm"
            >
              <option value="all">📊 Statut: Tous</option>
              <option value="pending">⏳ En attente</option>
              <option value="confirmed">✅ Confirmées</option>
              <option value="preparing">👨‍🍳 En préparation</option>
              <option value="ready">🚚 Prêtes</option>
              <option value="delivered">🎉 Livrées</option>
            </select>
            
            <select 
              value={typeFilter} 
              onChange={(e) => setTypeFilter(e.target.value as any)} 
              className="px-3 py-2.5 sm:py-3 text-sm border border-gray-300 rounded-xl bg-white/80 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all duration-300 hover:bg-white hover:shadow-sm"
            >
              <option value="all">🏪 Type: Tous</option>
              <option value="restaurant">🍽️ Restaurant</option>
              <option value="gallery">🎨 Galerie</option>
              <option value="mobilier">🪑 Mobilier</option>
            </select>
            
            <input 
              type="date" 
              value={startDate} 
              onChange={(e) => setStartDate(e.target.value)} 
              className="px-3 py-2.5 sm:py-3 text-sm border border-gray-300 rounded-xl bg-white/80 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all duration-300 hover:bg-white hover:shadow-sm" 
            />
            
            <input 
              type="date" 
              value={endDate} 
              onChange={(e) => setEndDate(e.target.value)} 
              className="px-3 py-2.5 sm:py-3 text-sm border border-gray-300 rounded-xl bg-white/80 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all duration-300 hover:bg-white hover:shadow-sm" 
            />
            
            <div className="sm:col-span-2 lg:col-span-1 flex items-center justify-between sm:justify-end gap-3">
              <div className="flex items-center gap-2">
                <label className="text-xs sm:text-sm text-gray-600 font-medium">Par page:</label>
                <select 
                  value={pageSize} 
                  onChange={(e) => { setPage(1); setPageSize(parseInt(e.target.value || '10', 10)) }} 
                  className="px-2 py-1.5 text-xs sm:text-sm border border-gray-300 rounded-lg bg-white/80 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all duration-300"
                >
                  <option value="10">10</option>
                  <option value="20">20</option>
                  <option value="50">50</option>
                </select>
              </div>
            </div>
          </div>

          {/* Actions principales */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 sm:justify-between sm:items-center">
            <div className="flex flex-wrap gap-2 sm:gap-3">
              <button 
                onClick={exportCsv} 
                className="flex items-center gap-2 px-4 py-2.5 sm:py-3 bg-gradient-to-r from-gray-700 to-gray-800 text-white rounded-xl hover:from-gray-800 hover:to-gray-900 transition-all duration-300 shadow-sm hover:shadow-lg transform hover:scale-105 active:scale-95 text-sm sm:text-base font-medium"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span className="hidden xs:inline">Exporter CSV</span>
                <span className="xs:hidden">Export</span>
              </button>
              
              <button 
                onClick={() => {
                  setSearch('')
                  setFilter('all')
                  setTypeFilter('all')
                  setStartDate('')
                  setEndDate('')
                  setPage(1)
                }}
                className="flex items-center gap-2 px-4 py-2.5 sm:py-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-xl hover:from-orange-600 hover:to-amber-600 transition-all duration-300 shadow-sm hover:shadow-lg transform hover:scale-105 active:scale-95 text-sm sm:text-base font-medium"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                <span className="hidden xs:inline">Réinitialiser</span>
                <span className="xs:hidden">Reset</span>
              </button>
            </div>
            
            <div className="text-xs sm:text-sm text-gray-500 bg-gray-100 px-3 py-2 rounded-lg">
              {totalCount} commande{totalCount > 1 ? 's' : ''} trouvée{totalCount > 1 ? 's' : ''}
            </div>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Chargement des commandes...</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">Aucune commande trouvée</p>
          </div>
        ) : (
          <div className="grid gap-3 md:gap-4">
            {orders.map(order => (
              <div key={order.id} className="bg-white rounded-lg shadow p-3 md:p-4">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      Commande {order.order_number}
                    </h3>
                    <p className="text-gray-600 text-sm">
                      {new Date(order.created_at).toLocaleDateString('fr-FR', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                    <div className="mt-1 flex flex-wrap gap-2 text-xs">
                      {order.payment_provider && (
                        <span className="px-2 py-0.5 rounded border border-gray-300 text-gray-700">{order.payment_provider}</span>
                      )}
                      {order.transaction_id && (
                        <span className="px-2 py-0.5 rounded border border-gray-300 text-gray-700">TX: {order.transaction_id.slice(0,8)}…</span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${getStatusColor(order.status)}`}>
                      {getStatusIcon(order.status)}
                      {getStatusLabel(order.status)}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  {/* Informations client */}
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2 text-sm md:text-base">
                      <User className="w-5 h-5" />
                      Informations client
                    </h4>
                    <div className="space-y-1.5 text-sm">
                      <p><span className="font-medium">Nom:</span> {order.customer_name}</p>
                      <p className="flex items-center gap-2">
                        <Phone className="w-4 h-4" />
                        <span>{order.customer_phone}</span>
                      </p>
                      {order.customer_email && (
                        <p><span className="font-medium">Email:</span> {order.customer_email}</p>
                      )}
                      <p className="flex items-start gap-2">
                        <MapPin className="w-4 h-4 mt-0.5" />
                        <span>{order.customer_address}, {order.customer_city}</span>
                      </p>
                    </div>
                  </div>

                  {/* Articles commandés */}
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2 text-sm md:text-base">Articles commandés</h4>
                    <div className="space-y-1.5">
                      {order.order_items?.map(item => (
                        <div key={item.id} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                          <div className="flex items-center gap-3">
                            <img src={item.item_image} alt={item.item_name} className="w-10 h-10 object-cover rounded" />
                            <div>
                              <p className="font-medium text-sm leading-tight">{item.item_name}</p>
                              <p className="text-xs text-gray-600 leading-tight">x{item.quantity}</p>
                            </div>
                          </div>
                          <span className="font-semibold text-xs md:text-sm">{item.total_price} F CFA</span>
                        </div>
                      ))}
                    </div>
                    <div className="mt-2 pt-2 border-t">
                      <div className="flex justify-between items-center text-sm md:text-base">
                        <span className="font-bold">Total:</span>
                        <span className="font-bold text-orange-600">{order.total_amount} F CFA</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Notes */}
                {order.notes && (
                  <div className="mb-3">
                    <h4 className="font-semibold text-gray-900 mb-1 text-sm md:text-base">Notes</h4>
                    <p className="text-gray-600 bg-gray-50 p-2 rounded text-sm">{order.notes}</p>
                  </div>
                )}

                {/* Actions Ultra Responsive */}
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                  {order.status !== 'delivered' && (
                    <select
                      value={order.status}
                      onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                      className="px-3 py-2 sm:py-2.5 border border-gray-300 rounded-xl bg-white/80 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all duration-300 hover:bg-white hover:shadow-sm text-sm font-medium"
                    >
                      <option value="pending">⏳ En attente</option>
                      <option value="confirmed">✅ Confirmée</option>
                      <option value="preparing">👨‍🍳 En préparation</option>
                      <option value="ready">🚚 Prête</option>
                      <option value="delivered">🎉 Livrée</option>
                    </select>
                  )}
                  
                  <a
                    href={`https://wa.me/${order.customer_phone.replace(/\D/g, '')}?text=Bonjour ${order.customer_name}, concernant votre commande ${order.order_number}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 px-4 py-2 sm:py-2.5 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:from-green-600 hover:to-green-700 transition-all duration-300 shadow-sm hover:shadow-lg transform hover:scale-105 active:scale-95 text-sm font-medium"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                    </svg>
                    <span className="hidden xs:inline">WhatsApp</span>
                    <span className="xs:hidden">WA</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
        {/* Pagination Ultra Responsive */}
        <div className="mt-6 sm:mt-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-white/50 backdrop-blur-sm rounded-xl border border-gray-200/50">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page === 1}
                className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 rounded-xl hover:from-gray-200 hover:to-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-sm hover:shadow-md transform hover:scale-105 active:scale-95 text-sm font-medium"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                <span className="hidden xs:inline">Précédent</span>
                <span className="xs:hidden">Préc</span>
              </button>
              
              <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-100 to-amber-100 text-orange-700 rounded-xl border border-orange-200">
                <span className="text-sm font-medium">Page</span>
                <span className="text-lg font-bold">{page}</span>
                <span className="text-sm font-medium">sur</span>
                <span className="text-lg font-bold">{Math.max(1, Math.ceil(totalCount / pageSize))}</span>
              </div>
              
              <button
                onClick={() => setPage(page + 1)}
                disabled={(page * pageSize) >= totalCount}
                className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 rounded-xl hover:from-gray-200 hover:to-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-sm hover:shadow-md transform hover:scale-105 active:scale-95 text-sm font-medium"
              >
                <span className="hidden xs:inline">Suivant</span>
                <span className="xs:hidden">Suiv</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
            
            <div className="text-xs sm:text-sm text-gray-500 bg-gray-100 px-3 py-2 rounded-lg font-medium">
              {((page - 1) * pageSize) + 1}-{Math.min(page * pageSize, totalCount)} sur {totalCount}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard