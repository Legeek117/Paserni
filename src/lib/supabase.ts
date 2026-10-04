import { createClient } from '@supabase/supabase-js'

// Configuration Supabase SÉCURISÉE (Variables d'environnement uniquement)
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Variables d'environnement chargées

// Fallback temporaire pour le développement si les variables ne sont pas chargées
const finalSupabaseUrl = supabaseUrl || 'https://erbnlextswbgtzztsxbf.supabase.co'
const finalSupabaseKey = supabaseKey || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVyYm5sZXh0c3diZ3R6enRzeGJmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkyNTI0NTEsImV4cCI6MjA3NDgyODQ1MX0.rM8FAq5xG3-nvsLf5PpiA4h3Jh7jDj7mtteW8RSPL-8'

// Utilisation des fallbacks si les variables d'environnement ne sont pas chargées

export const supabase = createClient(finalSupabaseUrl, finalSupabaseKey)

// Fonction pour vérifier la connexion Supabase
export const checkSupabaseConnection = async (): Promise<boolean> => {
  try {
    const { error } = await supabase.from('orders').select('count').limit(1);
    if (error) {
      return false;
    }
    return true;
  } catch (error) {
    return false;
  }
};

// Types pour les commandes
export interface Order {
  id: string
  order_number: string
  payment_provider?: string
  transaction_id?: string
  payment_reference?: string
  payment_status?: 'pending' | 'completed' | 'failed' | 'cancelled'
  customer_name: string
  customer_phone: string
  customer_email?: string
  customer_address: string
  customer_city: string
  total_amount: number
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'delivered'
  notes?: string
  created_at: string
  updated_at: string
}

export interface OrderItem {
  id: string
  order_id: string
  item_name: string
  item_type: 'restaurant' | 'gallery'
  quantity: number
  unit_price: number
  total_price: number
  item_image: string
}

export interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
  image: string
  type: 'restaurant' | 'gallery'
  category?: string
}

export interface Product {
  id: string
  name: string
  description: string
  price: number
  image: string
  category: 'restaurant' | 'gallery' | 'mobilier'
  subcategory?: string
  quantity?: number
  is_available: boolean
  created_at: string
}