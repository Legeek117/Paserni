-- Tables pour le système de commande PDG
-- À exécuter dans l'éditeur SQL de Supabase

-- Table des commandes
CREATE TABLE orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_number VARCHAR(20) UNIQUE NOT NULL,
  payment_provider VARCHAR(30) DEFAULT 'feexpay',
  transaction_id TEXT,
  payment_reference TEXT,
  customer_name VARCHAR(100) NOT NULL,
  customer_phone VARCHAR(20) NOT NULL,
  customer_email VARCHAR(100),
  customer_address TEXT NOT NULL,
  customer_city VARCHAR(50) NOT NULL,
  total_amount DECIMAL(10,2) NOT NULL,
  status VARCHAR(20) DEFAULT 'pending',
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table des articles commandés
CREATE TABLE order_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  item_name VARCHAR(200) NOT NULL,
  item_type VARCHAR(50) NOT NULL, -- 'restaurant' ou 'gallery'
  quantity INTEGER NOT NULL,
  unit_price DECIMAL(10,2) NOT NULL,
  total_price DECIMAL(10,2) NOT NULL,
  item_image TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table des produits (optionnel, pour une gestion plus avancée)
CREATE TABLE products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(200) NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  image TEXT,
  category VARCHAR(50) NOT NULL, -- 'restaurant', 'gallery', 'mobilier'
  subcategory VARCHAR(50), -- 'plats', 'jus', 'bières', etc.
  quantity INTEGER NOT NULL DEFAULT 0,
  is_available BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table des admins (optionnel)
CREATE TABLE admins (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email VARCHAR(100) UNIQUE NOT NULL,
  name VARCHAR(100) NOT NULL,
  role VARCHAR(20) DEFAULT 'admin',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index pour améliorer les performances
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_created_at ON orders(created_at);
CREATE INDEX idx_order_items_order_id ON order_items(order_id);

-- RLS (Row Level Security) - Optionnel
-- ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- Storage bucket for product images (run in Supabase SQL editor)
-- SELECT storage.create_bucket('product-images', public := true);
-- Grant public read access policy
-- CREATE POLICY "Public read product images" ON storage.objects
-- FOR SELECT TO public USING (bucket_id = 'product-images');

-- Politiques RLS (à adapter selon vos besoins)
-- CREATE POLICY "Tout le monde peut lire les commandes" ON orders FOR SELECT USING (true);
-- CREATE POLICY "Tout le monde peut créer des commandes" ON orders FOR INSERT WITH CHECK (true);
-- CREATE POLICY "Tout le monde peut modifier les commandes" ON orders FOR UPDATE USING (true);

-- À exécuter dans l'éditeur SQL de Supabase

-- Table des commandes
CREATE TABLE orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_number VARCHAR(20) UNIQUE NOT NULL,
  payment_provider VARCHAR(30) DEFAULT 'feexpay',
  transaction_id TEXT,
  payment_reference TEXT,
  customer_name VARCHAR(100) NOT NULL,
  customer_phone VARCHAR(20) NOT NULL,
  customer_email VARCHAR(100),
  customer_address TEXT NOT NULL,
  customer_city VARCHAR(50) NOT NULL,
  total_amount DECIMAL(10,2) NOT NULL,
  status VARCHAR(20) DEFAULT 'pending',
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table des articles commandés
CREATE TABLE order_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  item_name VARCHAR(200) NOT NULL,
  item_type VARCHAR(50) NOT NULL, -- 'restaurant' ou 'gallery'
  quantity INTEGER NOT NULL,
  unit_price DECIMAL(10,2) NOT NULL,
  total_price DECIMAL(10,2) NOT NULL,
  item_image TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table des produits (optionnel, pour une gestion plus avancée)
CREATE TABLE products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(200) NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  image TEXT,
  category VARCHAR(50) NOT NULL, -- 'restaurant', 'gallery', 'mobilier'
  subcategory VARCHAR(50), -- 'plats', 'jus', 'bières', etc.
  quantity INTEGER NOT NULL DEFAULT 0,
  is_available BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table des admins (optionnel)
CREATE TABLE admins (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email VARCHAR(100) UNIQUE NOT NULL,
  name VARCHAR(100) NOT NULL,
  role VARCHAR(20) DEFAULT 'admin',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index pour améliorer les performances
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_created_at ON orders(created_at);
CREATE INDEX idx_order_items_order_id ON order_items(order_id);

-- RLS (Row Level Security) - Optionnel
-- ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- Storage bucket for product images (run in Supabase SQL editor)
-- SELECT storage.create_bucket('product-images', public := true);
-- Grant public read access policy
-- CREATE POLICY "Public read product images" ON storage.objects
-- FOR SELECT TO public USING (bucket_id = 'product-images');

-- Politiques RLS (à adapter selon vos besoins)
-- CREATE POLICY "Tout le monde peut lire les commandes" ON orders FOR SELECT USING (true);
-- CREATE POLICY "Tout le monde peut créer des commandes" ON orders FOR INSERT WITH CHECK (true);
-- CREATE POLICY "Tout le monde peut modifier les commandes" ON orders FOR UPDATE USING (true);
