import React, { useState } from 'react'
import { useCart } from '../contexts/CartContext'
import { supabase, CartItem } from '../lib/supabase'
import { CheckoutForm } from './CheckoutForm'

export const Cart: React.FC = () => {
  const { state, updateQuantity, removeItem, clearCart } = useCart()
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false)

  if (state.items.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Votre panier est vide</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 h-full flex flex-col">
      <h2 className="text-lg sm:text-xl font-semibold mb-4">Votre Panier <span className="text-gray-500 font-normal">({state.itemCount} articles)</span></h2>

      <div className="-mx-2 sm:mx-0 flex-1 overflow-y-auto">
        {state.items.map(item => (
          <div key={item.id} className="grid grid-cols-[64px,1fr,auto] sm:grid-cols-[72px,1fr,auto] items-center gap-3 sm:gap-4 py-3 border-b px-2 sm:px-0">
            <img src={item.image} alt={item.name} className="w-16 h-16 sm:w-18 sm:h-18 object-cover rounded" />
            <div className="min-w-0">
              <h3 className="font-medium truncate">{item.name}</h3>
              <p className="text-gray-600 text-sm">{item.price} F CFA</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                className="w-8 h-8 rounded bg-gray-200 flex items-center justify-center hover:bg-gray-300"
                aria-label="Diminuer la quantité"
              >
                -
              </button>
              <span className="w-8 text-center select-none">{item.quantity}</span>
              <button
                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                className="w-8 h-8 rounded bg-gray-200 flex items-center justify-center hover:bg-gray-300"
                aria-label="Augmenter la quantité"
              >
                +
              </button>
              <button
                onClick={() => removeItem(item.id)}
                className="ml-2 text-red-500 hover:text-red-700 text-sm"
              >
                Supprimer
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="pt-4 sm:pt-5 border-t mt-4">
        <div className="flex justify-between items-center mb-3">
          <span className="text-base sm:text-lg font-semibold">Total:</span>
          <span className="text-base sm:text-lg font-semibold">{state.total} F CFA</span>
        </div>
        <button
          onClick={() => setIsCheckoutOpen(true)}
          className="w-full bg-orange-600 hover:bg-orange-700 text-white py-2.5 sm:py-3 rounded-lg font-semibold"
        >
          Passer la commande
        </button>
      </div>

      {isCheckoutOpen && (
        <CheckoutForm 
          items={state.items}
          total={state.total}
          onClose={() => setIsCheckoutOpen(false)}
          onSuccess={() => {
            clearCart()
            setIsCheckoutOpen(false)
          }}
        />
      )}
    </div>
  )
}