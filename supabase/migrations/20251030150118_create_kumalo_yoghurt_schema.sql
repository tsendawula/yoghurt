/*
  # Kumalo Quality Yoghurt Database Schema

  ## Overview
  This migration sets up the complete database structure for the Kumalo Quality Yoghurt website,
  including product management, order processing, and contact submissions.

  ## New Tables
  
  ### 1. `products`
  Stores yoghurt product information
  - `id` (uuid, primary key) - Unique product identifier
  - `name` (text) - Product name (e.g., "Strawberry Yoghurt")
  - `flavor` (text) - Flavor category
  - `description` (text) - Product description
  - `price` (decimal) - Price per unit
  - `image_url` (text) - Product image URL
  - `stock_status` (text) - Availability status (in_stock, low_stock, out_of_stock)
  - `is_featured` (boolean) - Whether to feature on homepage
  - `created_at` (timestamptz) - Record creation timestamp
  - `updated_at` (timestamptz) - Last update timestamp

  ### 2. `orders`
  Manages customer orders
  - `id` (uuid, primary key) - Unique order identifier
  - `customer_name` (text) - Customer's full name
  - `customer_email` (text) - Customer's email
  - `customer_phone` (text) - Customer's phone number
  - `delivery_address` (text) - Delivery location
  - `order_items` (jsonb) - Array of ordered products with quantities
  - `total_amount` (decimal) - Total order value
  - `status` (text) - Order status (pending, confirmed, preparing, delivered, cancelled)
  - `notes` (text) - Additional order notes from customer
  - `created_at` (timestamptz) - Order placement time
  - `updated_at` (timestamptz) - Last status update time

  ### 3. `contact_submissions`
  Stores general inquiries and messages
  - `id` (uuid, primary key) - Unique submission identifier
  - `name` (text) - Contact person's name
  - `email` (text) - Contact email
  - `phone` (text) - Contact phone (optional)
  - `message` (text) - Inquiry message
  - `is_read` (boolean) - Whether admin has read the message
  - `created_at` (timestamptz) - Submission timestamp

  ## Security
  - Row Level Security (RLS) enabled on all tables
  - Public can INSERT orders and contact submissions
  - Public can SELECT products (view catalog)
  - Only authenticated admins can SELECT orders and contact submissions
  - Only authenticated admins can UPDATE/DELETE any records

  ## Indexes
  - Index on orders.status for efficient filtering
  - Index on orders.created_at for chronological queries
  - Index on products.is_featured for homepage queries
*/

-- Create products table
CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  flavor text NOT NULL,
  description text NOT NULL,
  price decimal(10,2) NOT NULL CHECK (price >= 0),
  image_url text NOT NULL,
  stock_status text NOT NULL DEFAULT 'in_stock' CHECK (stock_status IN ('in_stock', 'low_stock', 'out_of_stock')),
  is_featured boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create orders table
CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name text NOT NULL,
  customer_email text NOT NULL,
  customer_phone text NOT NULL,
  delivery_address text NOT NULL,
  order_items jsonb NOT NULL,
  total_amount decimal(10,2) NOT NULL CHECK (total_amount >= 0),
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'preparing', 'delivered', 'cancelled')),
  notes text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create contact submissions table
CREATE TABLE IF NOT EXISTS contact_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  phone text DEFAULT '',
  message text NOT NULL,
  is_read boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_products_featured ON products(is_featured) WHERE is_featured = true;

-- Enable Row Level Security
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;

-- Products policies
CREATE POLICY "Anyone can view products"
  ON products FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert products"
  ON products FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update products"
  ON products FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete products"
  ON products FOR DELETE
  TO authenticated
  USING (true);

-- Orders policies
CREATE POLICY "Anyone can create orders"
  ON orders FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can view all orders"
  ON orders FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can update orders"
  ON orders FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete orders"
  ON orders FOR DELETE
  TO authenticated
  USING (true);

-- Contact submissions policies
CREATE POLICY "Anyone can submit contact forms"
  ON contact_submissions FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can view contact submissions"
  ON contact_submissions FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can update contact submissions"
  ON contact_submissions FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete contact submissions"
  ON contact_submissions FOR DELETE
  TO authenticated
  USING (true);