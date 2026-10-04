-- Script SQL simple pour créer la table departments
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

-- Créer les index
CREATE INDEX IF NOT EXISTS idx_departments_slug ON public.departments(slug);
CREATE INDEX IF NOT EXISTS idx_departments_country ON public.departments(country);
CREATE INDEX IF NOT EXISTS idx_departments_order ON public.departments("order");
CREATE INDEX IF NOT EXISTS idx_departments_is_active ON public.departments(is_active);

-- Insérer les départements pour le Bénin
INSERT INTO public.departments (name, slug, description, country, "order", is_active) VALUES
('PDG Building', 'pdg-building', 'Construction et amenagement de batiments', 'BJ', 1, true),
('PDG Com & Events', 'pdg-com-events', 'Communication et organisation d evenements', 'BJ', 2, true),
('PDG Digital Solutions', 'pdg-digital-solutions', 'Solutions numeriques et technologies', 'BJ', 3, true),
('PDG Galerie', 'pdg-galerie', 'Galerie d art et expositions', 'BJ', 4, true),
('PDG Learning', 'pdg-learning', 'Formation et apprentissage', 'BJ', 5, true),
('PDG Mobilier', 'pdg-mobilier', 'Fabrication et vente de mobilier', 'BJ', 6, true),
('PDG Projects', 'pdg-projects', 'Gestion de projets divers', 'BJ', 7, true),
('PDG Puzzles', 'pdg-puzzles', 'Creation et vente de puzzles', 'BJ', 8, true),
('CAFE B ART PDG', 'cafe-bart-pdg', 'Cafe et restaurant artistique', 'BJ', 9, true)
ON CONFLICT (slug) DO NOTHING;

-- Insérer les départements pour la Côte d'Ivoire
INSERT INTO public.departments (name, slug, description, country, "order", is_active) VALUES
('PDG Building', 'pdg-building-ci', 'Construction et amenagement de batiments', 'CI', 1, true),
('PDG Com & Events', 'pdg-com-events-ci', 'Communication et organisation d evenements', 'CI', 2, true),
('PDG Digital Solutions', 'pdg-digital-solutions-ci', 'Solutions numeriques et technologies', 'CI', 3, true),
('PDG Galerie', 'pdg-galerie-ci', 'Galerie d art et expositions', 'CI', 4, true),
('PDG Learning', 'pdg-learning-ci', 'Formation et apprentissage', 'CI', 5, true),
('PDG Mobilier', 'pdg-mobilier-ci', 'Fabrication et vente de mobilier', 'CI', 6, true),
('PDG Projects', 'pdg-projects-ci', 'Gestion de projets divers', 'CI', 7, true),
('PDG Puzzles', 'pdg-puzzles-ci', 'Creation et vente de puzzles', 'CI', 8, true),
('CAFE B ART PDG', 'cafe-bart-pdg-ci', 'Cafe et restaurant artistique', 'CI', 9, true)
ON CONFLICT (slug) DO NOTHING;

-- Activer RLS
ALTER TABLE public.departments ENABLE ROW LEVEL SECURITY;

-- Politique de lecture pour tous les utilisateurs authentifiés
CREATE POLICY "Allow read access for authenticated users" ON public.departments
    FOR SELECT USING (auth.role() = 'authenticated');

-- Politique d'écriture pour les admins
CREATE POLICY "Allow full access for admins" ON public.departments
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.admins 
            WHERE admins.email = auth.jwt() ->> 'email'
        )
    );
