import React from 'react'
import { ShoppingCart } from 'lucide-react'
import { useCart } from '../contexts/CartContext'

export const CartFab: React.FC<{ onClick: () => void }> = ({ onClick }) => {
  const { state } = useCart()
  
  return (
    <button
      onClick={onClick}
      className="fixed bottom-6 right-6 z-[40] sm:bottom-6 sm:right-6 rounded-full bg-orange-600 hover:bg-orange-700 text-white shadow-lg w-14 h-14 flex items-center justify-center"
      aria-label="Ouvrir le panier"
    >
      <ShoppingCart className="w-6 h-6" />
      {state.itemCount > 0 && (
        <span className="absolute -top-1 -right-1 bg-white text-orange-700 text-xs font-bold rounded-full px-2 py-0.5 border border-orange-700">
          {state.itemCount}
        </span>
      )}
    </button>
  )
}

export default CartFab