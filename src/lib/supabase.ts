import { createClient } from '@supabase/supabase-js'

// Configuration Supabase (variables d'environnement uniquement)
//
// Aucune clé en dur ici : ce module est inclus dans le bundle navigateur.
// Seule la clé ANON doit être utilisée côté client — la clé service_role
// contourne le RLS et ne doit jamais y figurer.
const supabaseUrl = import.meta.env?.VITE_SUPABASE_URL
const supabaseKey = import.meta.env?.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  throw new Error(
    '[Supabase] Variables manquantes: VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY. ' +
      'Définis-les dans .env avant de builder.'
  )
}

export const supabase = createClient(supabaseUrl, supabaseKey)

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
  country?: string | null
  created_at: string
}