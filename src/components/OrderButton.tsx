import React from 'react'
import { ShoppingCart } from 'lucide-react'
import { useCart } from '../contexts/CartContext'
import { simpleNotificationService } from '../services/simpleNotificationService'
import { CartItem } from '../lib/supabase'

interface OrderButtonProps {
  item: {
    id: string
    name: string
    price: number
    image: string
    type: 'restaurant' | 'gallery'
    category?: string
  }
}

export const OrderButton: React.FC<OrderButtonProps> = ({ item }) => {
  const { addItem } = useCart()
  
  const handleAddToCart = async () => {
    // Ajouter l'article au panier
    addItem({
      ...item,
      quantity: 1
    })
    
    // Envoyer notification simple
    try {
      await simpleNotificationService.notifyAddToCart(item.name)
    } catch (error) {
      }
  }
  
  return (
    <button
      onClick={handleAddToCart}
      className="flex items-center gap-2 bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg transition-colors duration-200"
    >
      <ShoppingCart className="w-4 h-4" />
      Commander
    </button>
  )
}

    // Notification simple
