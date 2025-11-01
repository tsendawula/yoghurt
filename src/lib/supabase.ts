import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Product = {
  id: string
  name: string
  flavor: string
  description: string
  price: number
  image_url: string
  stock_status: 'in_stock' | 'low_stock' | 'out_of_stock'
  is_featured: boolean
  created_at: string
  updated_at: string
}

export type Order = {
  id: string
  customer_name: string
  customer_email: string
  customer_phone: string
  delivery_address: string
  order_items: Array<{ product_id: string; product_name: string; quantity: number; price: number }>
  total_amount: number
  status: 'pending' | 'confirmed' | 'preparing' | 'delivered' | 'cancelled'
  notes: string
  created_at: string
  updated_at: string
}

export type ContactSubmission = {
  id: string
  name: string
  email: string
  phone: string
  message: string
  is_read: boolean
  created_at: string
}
