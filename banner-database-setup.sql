-- Script SQL pour créer les tables des bannières publicitaires
-- À exécuter dans Supabase SQL Editor

-- Table des bannières
CREATE TABLE IF NOT EXISTS banners (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  image TEXT,
  link TEXT,
  link_text VARCHAR(100) DEFAULT 'En savoir plus',
  start_date TIMESTAMP WITH TIME ZONE,
  end_date TIMESTAMP WITH TIME ZONE,
  countries TEXT[],
  pages TEXT[],
  priority INTEGER DEFAULT 1 CHECK (priority >= 1 AND priority <= 10),
  is_active BOOLEAN DEFAULT true,
  background_color VARCHAR(7) DEFAULT '#ffffff',
  text_color VARCHAR(7) DEFAULT '#000000',
  position VARCHAR(10) DEFAULT 'center' CHECK (position IN ('top', 'center', 'bottom')),
  size VARCHAR(10) DEFAULT 'medium' CHECK (size IN ('small', 'medium', 'large')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table des statistiques des bannières
CREATE TABLE IF NOT EXISTS banner_stats (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  banner_id UUID REFERENCES banners(id) ON DELETE CASCADE,
  views INTEGER DEFAULT 0,
  clicks INTEGER DEFAULT 0,
  conversions INTEGER DEFAULT 0,
  date DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(banner_id, date)
);

-- Index pour optimiser les requêtes
CREATE INDEX IF NOT EXISTS idx_banners_active ON banners(is_active);
CREATE INDEX IF NOT EXISTS idx_banners_dates ON banners(start_date, end_date);
CREATE INDEX IF NOT EXISTS idx_banners_priority ON banners(priority DESC);
CREATE INDEX IF NOT EXISTS idx_banner_stats_banner_id ON banner_stats(banner_id);
CREATE INDEX IF NOT EXISTS idx_banner_stats_date ON banner_stats(date);

-- Fonction pour mettre à jour updated_at automatiquement
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger pour mettre à jour updated_at
CREATE TRIGGER update_banners_updated_at 
  BEFORE UPDATE ON banners 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

-- RLS (Row Level Security) - Optionnel selon vos besoins
-- ALTER TABLE banners ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE banner_stats ENABLE ROW LEVEL SECURITY;

-- Politique pour permettre la lecture publique des bannières actives
-- CREATE POLICY "Public can view active banners" ON banners
--   FOR SELECT USING (is_active = true);

-- Politique pour permettre l'écriture aux admins seulement
-- CREATE POLICY "Admins can manage banners" ON banners
--   FOR ALL USING (auth.role() = 'authenticated');

-- Exemple de données de test (optionnel)
INSERT INTO banners (
  title, 
  description, 
  image, 
  link, 
  link_text,
  start_date,
  end_date,
  countries,
  pages,
  priority,
  is_active,
  background_color,
  text_color,
  position,
  size
) VALUES (
  'Nouvel Événement - Championnat de Puzzles',
  'Participez à notre championnat de puzzles et gagnez des prix fantastiques !',
  'https://images.pexels.com/photos/3943716/pexels-photo-3943716.jpeg',
  '/projet',
  'Découvrir',
  NOW(),
  NOW() + INTERVAL '30 days',
  ARRAY['cote-ivoire', 'benin'],
  ARRAY['/home', '/projet'],
  5,
  true,
  '#f97316',
  '#ffffff',
  'center',
  'large'
) ON CONFLICT DO NOTHING;

-- Vue pour les statistiques agrégées
CREATE OR REPLACE VIEW banner_analytics AS
SELECT 
  b.id,
  b.title,
  b.is_active,
  COALESCE(SUM(bs.views), 0) as total_views,
  COALESCE(SUM(bs.clicks), 0) as total_clicks,
  COALESCE(SUM(bs.conversions), 0) as total_conversions,
  CASE 
    WHEN COALESCE(SUM(bs.views), 0) > 0 
    THEN ROUND((COALESCE(SUM(bs.clicks), 0)::DECIMAL / SUM(bs.views)) * 100, 2)
    ELSE 0 
  END as click_rate,
  CASE 
    WHEN COALESCE(SUM(bs.clicks), 0) > 0 
    THEN ROUND((COALESCE(SUM(bs.conversions), 0)::DECIMAL / SUM(bs.clicks)) * 100, 2)
    ELSE 0 
  END as conversion_rate
FROM banners b
LEFT JOIN banner_stats bs ON b.id = bs.banner_id
GROUP BY b.id, b.title, b.is_active
ORDER BY total_views DESC;

-- Commentaires sur les tables
COMMENT ON TABLE banners IS 'Table des bannières publicitaires et événements';
COMMENT ON TABLE banner_stats IS 'Statistiques des bannières (vues, clics, conversions)';
COMMENT ON VIEW banner_analytics IS 'Vue agrégée des statistiques des bannières';

-- Commentaires sur les colonnes importantes
COMMENT ON COLUMN banners.priority IS 'Priorité d''affichage (1-10, 10 = plus haute priorité)';
COMMENT ON COLUMN banners.countries IS 'Pays ciblés (NULL = tous les pays)';
COMMENT ON COLUMN banners.pages IS 'Pages ciblées (NULL = toutes les pages)';
COMMENT ON COLUMN banner_stats.date IS 'Date des statistiques (pour agrégation quotidienne)';
