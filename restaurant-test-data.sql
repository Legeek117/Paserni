-- Script SQL pour ajouter des produits de test pour le restaurant
-- À exécuter dans l'éditeur SQL de Supabase

-- Supprimer les anciens produits restaurant s'ils existent
DELETE FROM products WHERE category = 'restaurant';

-- Ajouter des produits de test pour chaque catégorie
INSERT INTO products (name, description, price, image, category, subcategory, is_available) VALUES

-- PLATS
('Attiéké au Poisson', 'Plat traditionnel ivoirien avec attiéké et poisson grillé', 3500, '/galerie/attieke-poisson.jpg', 'restaurant', 'plats', true),
('Riz Sauce Arachide', 'Riz blanc accompagné de sauce arachide et légumes', 2800, '/galerie/riz-arakide.jpg', 'restaurant', 'plats', true),
('Poulet Braisé', 'Poulet mariné et grillé aux épices locales', 4500, '/galerie/poulet-braise.jpg', 'restaurant', 'plats', true),
('Foutou Banane', 'Foutou de banane plantain avec sauce tomate', 3200, '/galerie/foutou-banane.jpg', 'restaurant', 'plats', true),

-- ACCOMPAGNEMENTS
('Alloco', 'Bananes plantains frites servies avec sauce piment', 1500, '/galerie/alloco.jpg', 'restaurant', 'accompagnements', true),
('Ignames Frites', 'Ignames coupées et frites dorées', 1200, '/galerie/ignames-frites.jpg', 'restaurant', 'accompagnements', true),
('Patates Douces', 'Patates douces grillées au four', 1000, '/galerie/patates-douces.jpg', 'restaurant', 'accompagnements', true),
('Salade Verte', 'Salade de laitue, tomates et concombres', 800, '/galerie/salade-verte.jpg', 'restaurant', 'accompagnements', true),

-- JUS
('Jus de Bissap', 'Jus rouge de fleurs d\'hibiscus', 1500, '/galerie/jus-bissap.jpg', 'restaurant', 'jus', true),
('Jus de Gingembre', 'Jus de gingembre frais et épicé', 1800, '/galerie/jus-gingembre.jpg', 'restaurant', 'jus', true),
('Jus de Mangue', 'Jus de mangue fraîche et sucrée', 2000, '/galerie/jus-mangue.jpg', 'restaurant', 'jus', true),
('Jus d\'Ananas', 'Jus d\'ananas naturel et rafraîchissant', 1700, '/galerie/jus-ananas.jpg', 'restaurant', 'jus', true),

-- BIÈRES
('Bière Flag', 'Bière blonde locale rafraîchissante', 2500, '/galerie/biere-flag.jpg', 'restaurant', 'bieres', true),
('Bière Castel', 'Bière blonde importée', 3000, '/galerie/biere-castel.jpg', 'restaurant', 'bieres', true),
('Bière Beaufort', 'Bière blonde premium', 3500, '/galerie/biere-beaufort.jpg', 'restaurant', 'bieres', true),

-- LIQUEURS
('Rhum Local', 'Rhum artisanal de canne à sucre', 4000, '/galerie/rhum-local.jpg', 'restaurant', 'liqueur', true),
('Palm Wine', 'Vin de palme traditionnel', 2500, '/galerie/vin-palme.jpg', 'restaurant', 'liqueur', true),
('Cognac VSOP', 'Cognac vieilli en fût de chêne', 8000, '/galerie/cognac-vsop.jpg', 'restaurant', 'liqueur', true);

-- Vérifier que les données ont été insérées
SELECT category, subcategory, COUNT(*) as nombre_produits 
FROM products 
WHERE category = 'restaurant' 
GROUP BY category, subcategory 
ORDER BY subcategory;

