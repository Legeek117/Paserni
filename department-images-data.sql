-- Script SQL pour insérer les images des départements existantes
-- Ce script doit être exécuté dans votre base de données Supabase

-- Insérer les images des départements pour le Bénin (BJ)
INSERT INTO public.department_images (department, country, image_url, title, description) VALUES
('building', 'BJ', '/galerie/PDG%20building.jpg.jpeg', 'PDG BUILDING', 'Construction et aménagement de bâtiments'),
('com-events', 'BJ', '/galerie/PDG COM & EVENTS.jpg', 'PDG COM & EVENTS', 'Communication et organisation d''événements'),
('digital', 'BJ', '/galerie/PDG Digital solutions.jpg.jpeg', 'PDG DIGITAL SOLUTIONS', 'Solutions numériques et technologies'),
('galerie', 'BJ', '/galerie/PDG galerie.jpg.jpeg', 'PDG GALERIE', 'Galerie d''art et expositions'),
('learning', 'BJ', '/galerie/PDG learning.jpg.jpeg', 'PDG LEARNING', 'Formation et apprentissage'),
('mobilier', 'BJ', '/galerie/PDG mobilier.jpg.jpeg', 'PDG MOBILIER', 'Fabrication et vente de mobilier'),
('projects', 'BJ', '/galerie/PDG projects.jpg.jpeg', 'PDG PROJECTS', 'Gestion de projets divers'),
('puzzles', 'BJ', '/galerie/PDG puzzles.jpg.jpeg', 'PDG PUZZLES', 'Création et vente de puzzles'),
('cafe-bart', 'BJ', '/galerie/Café b''art pdg .jpg.jpeg', 'CAFÉ B''ART PDG', 'Café et restaurant artistique')
ON CONFLICT DO NOTHING;

-- Insérer les images des départements pour la Côte d'Ivoire (CI)
INSERT INTO public.department_images (department, country, image_url, title, description) VALUES
('building', 'CI', '/galerie/PDG%20building.jpg.jpeg', 'PDG BUILDING', 'Construction et aménagement de bâtiments'),
('com-events', 'CI', '/galerie/PDG COM & EVENTS.jpg', 'PDG COM & EVENTS', 'Communication et organisation d''événements'),
('digital', 'CI', '/galerie/PDG Digital solutions.jpg.jpeg', 'PDG DIGITAL SOLUTIONS', 'Solutions numériques et technologies'),
('galerie', 'CI', '/galerie/PDG galerie.jpg.jpeg', 'PDG GALERIE', 'Galerie d''art et expositions'),
('learning', 'CI', '/galerie/PDG learning.jpg.jpeg', 'PDG LEARNING', 'Formation et apprentissage'),
('mobilier', 'CI', '/galerie/PDG mobilier.jpg.jpeg', 'PDG MOBILIER', 'Fabrication et vente de mobilier'),
('projects', 'CI', '/galerie/PDG projects.jpg.jpeg', 'PDG PROJECTS', 'Gestion de projets divers'),
('puzzles', 'CI', '/galerie/PDG puzzles.jpg.jpeg', 'PDG PUZZLES', 'Création et vente de puzzles'),
('cafe-bart', 'CI', '/galerie/Café b''art pdg .jpg.jpeg', 'CAFÉ B''ART PDG', 'Café et restaurant artistique')
ON CONFLICT DO NOTHING;
