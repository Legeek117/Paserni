-- Script SQL pour créer la table departments
-- Ce script doit être exécuté dans votre base de données Supabase

-- Créer la table departments
CREATE TABLE IF NOT EXISTS public.departments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    description TEXT,
    image_url TEXT,
    country VARCHAR(2) NOT NULL,
    whatsapp_link TEXT,
    "order" INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Créer un index sur le slug pour les recherches rapides
CREATE INDEX IF NOT EXISTS idx_departments_slug ON public.departments(slug);

-- Créer un index sur le pays pour filtrer par pays
CREATE INDEX IF NOT EXISTS idx_departments_country ON public.departments(country);

-- Créer un index sur l'ordre pour trier les départements
CREATE INDEX IF NOT EXISTS idx_departments_order ON public.departments("order");

-- Créer un index sur is_active pour filtrer les départements actifs
CREATE INDEX IF NOT EXISTS idx_departments_is_active ON public.departments(is_active);

-- Insérer quelques départements de base pour le Bénin
INSERT INTO public.departments (name, slug, description, country, "order", is_active) VALUES
('PDG Building', 'pdg-building', 'Construction et aménagement de bâtiments', 'BJ', 1, true),
('PDG Com & Events', 'pdg-com-events', 'Communication et organisation d''événements', 'BJ', 2, true),
('PDG Digital Solutions', 'pdg-digital-solutions', 'Solutions numériques et technologies', 'BJ', 3, true),
('PDG Galerie', 'pdg-galerie', 'Galerie d''art et expositions', 'BJ', 4, true),
('PDG Learning', 'pdg-learning', 'Formation et apprentissage', 'BJ', 5, true),
('PDG Mobilier', 'pdg-mobilier', 'Fabrication et vente de mobilier', 'BJ', 6, true),
('PDG Projects', 'pdg-projects', 'Gestion de projets divers', 'BJ', 7, true),
('PDG Puzzles', 'pdg-puzzles', 'Création et vente de puzzles', 'BJ', 8, true),
('CAFÉ B''ART PDG', 'cafe-bart-pdg', 'Café et restaurant artistique', 'BJ', 9, true)
ON CONFLICT (slug) DO NOTHING;

-- Insérer quelques départements de base pour la Côte d'Ivoire
INSERT INTO public.departments (name, slug, description, country, "order", is_active) VALUES
('PDG Building', 'pdg-building-ci', 'Construction et aménagement de bâtiments', 'CI', 1, true),
('PDG Com & Events', 'pdg-com-events-ci', 'Communication et organisation d''événements', 'CI', 2, true),
('PDG Digital Solutions', 'pdg-digital-solutions-ci', 'Solutions numériques et technologies', 'CI', 3, true),
('PDG Galerie', 'pdg-galerie-ci', 'Galerie d''art et expositions', 'CI', 4, true),
('PDG Learning', 'pdg-learning-ci', 'Formation et apprentissage', 'CI', 5, true),
('PDG Mobilier', 'pdg-mobilier-ci', 'Fabrication et vente de mobilier', 'CI', 6, true),
('PDG Projects', 'pdg-projects-ci', 'Gestion de projets divers', 'CI', 7, true),
('PDG Puzzles', 'pdg-puzzles-ci', 'Création et vente de puzzles', 'CI', 8, true),
('CAFÉ B''ART PDG', 'cafe-bart-pdg-ci', 'Café et restaurant artistique', 'CI', 9, true)
ON CONFLICT (slug) DO NOTHING;

-- Activer RLS (Row Level Security) pour la sécurité
ALTER TABLE public.departments ENABLE ROW LEVEL SECURITY;

-- Créer une politique pour permettre la lecture à tous les utilisateurs authentifiés
CREATE POLICY "Allow read access for authenticated users" ON public.departments
    FOR SELECT USING (auth.role() = 'authenticated');

-- Créer une politique pour permettre l'insertion, mise à jour et suppression aux admins
CREATE POLICY "Allow full access for admins" ON public.departments
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.admins 
            WHERE admins.email = auth.jwt() ->> 'email'
        )
    );

-- Créer une fonction pour mettre à jour automatiquement updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Créer un trigger pour mettre à jour automatiquement updated_at
CREATE TRIGGER update_departments_updated_at 
    BEFORE UPDATE ON public.departments 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();
