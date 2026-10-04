-- Script pour configurer Supabase Storage pour les bannières
-- À exécuter dans Supabase SQL Editor après avoir créé les tables

-- 1. Créer le bucket pour les images de bannières
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'banner-images',
  'banner-images',
  true,
  5242880, -- 5MB en bytes
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
) ON CONFLICT (id) DO NOTHING;

-- 2. Politique RLS pour permettre la lecture publique des images
CREATE POLICY "Public can view banner images" ON storage.objects
FOR SELECT USING (bucket_id = 'banner-images');

-- 3. Politique RLS pour permettre l'upload aux utilisateurs authentifiés
CREATE POLICY "Authenticated users can upload banner images" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'banner-images' 
  AND auth.role() = 'authenticated'
);

-- 4. Politique RLS pour permettre la mise à jour aux utilisateurs authentifiés
CREATE POLICY "Authenticated users can update banner images" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'banner-images' 
  AND auth.role() = 'authenticated'
);

-- 5. Politique RLS pour permettre la suppression aux utilisateurs authentifiés
CREATE POLICY "Authenticated users can delete banner images" ON storage.objects
FOR DELETE USING (
  bucket_id = 'banner-images' 
  AND auth.role() = 'authenticated'
);

-- 6. Créer un dossier par défaut pour les bannières
-- (Ceci sera fait automatiquement lors du premier upload)

-- 7. Fonction pour nettoyer les images orphelines
CREATE OR REPLACE FUNCTION cleanup_orphaned_banner_images()
RETURNS void AS $$
BEGIN
  -- Supprimer les images qui ne sont plus référencées dans la table banners
  DELETE FROM storage.objects 
  WHERE bucket_id = 'banner-images'
  AND name NOT IN (
    SELECT DISTINCT 
      CASE 
        WHEN image LIKE '%/banner-images/%' 
        THEN substring(image from 'banner-images/(.*)')
        ELSE NULL 
      END
    FROM banners 
    WHERE image IS NOT NULL
  );
END;
$$ LANGUAGE plpgsql;

-- 8. Fonction pour obtenir l'URL publique d'une image
CREATE OR REPLACE FUNCTION get_banner_image_url(image_path TEXT)
RETURNS TEXT AS $$
BEGIN
  IF image_path IS NULL OR image_path = '' THEN
    RETURN NULL;
  END IF;
  
  -- Si c'est déjà une URL complète, la retourner
  IF image_path LIKE 'http%' THEN
    RETURN image_path;
  END IF;
  
  -- Sinon, construire l'URL Supabase
  RETURN 'https://' || current_setting('app.settings.supabase_url') || '/storage/v1/object/public/banner-images/' || image_path;
END;
$$ LANGUAGE plpgsql;

-- 9. Vue pour les bannières avec URLs complètes
CREATE OR REPLACE VIEW banners_with_urls AS
SELECT 
  b.*,
  CASE 
    WHEN b.image IS NOT NULL AND b.image != '' THEN
      CASE 
        WHEN b.image LIKE 'http%' THEN b.image
        ELSE 'https://erbnlextswbgtzztsxbf.supabase.co/storage/v1/object/public/banner-images/' || b.image
      END
    ELSE NULL
  END as image_url
FROM banners b;

-- 10. Index pour optimiser les requêtes sur les bannières actives
CREATE INDEX IF NOT EXISTS idx_banners_active_priority 
ON banners(is_active, priority DESC) 
WHERE is_active = true;

-- 11. Index pour les requêtes par date
CREATE INDEX IF NOT EXISTS idx_banners_dates_active 
ON banners(start_date, end_date, is_active) 
WHERE is_active = true;

-- 12. Fonction pour obtenir les statistiques d'une bannière
CREATE OR REPLACE FUNCTION get_banner_stats(banner_id UUID)
RETURNS TABLE(
  total_views BIGINT,
  total_clicks BIGINT,
  total_conversions BIGINT,
  click_rate NUMERIC,
  conversion_rate NUMERIC
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COALESCE(SUM(bs.views), 0) as total_views,
    COALESCE(SUM(bs.clicks), 0) as total_clicks,
    COALESCE(SUM(bs.conversions), 0) as total_conversions,
    CASE 
      WHEN COALESCE(SUM(bs.views), 0) > 0 
      THEN ROUND((COALESCE(SUM(bs.clicks), 0)::NUMERIC / SUM(bs.views)) * 100, 2)
      ELSE 0 
    END as click_rate,
    CASE 
      WHEN COALESCE(SUM(bs.clicks), 0) > 0 
      THEN ROUND((COALESCE(SUM(bs.conversions), 0)::NUMERIC / SUM(bs.clicks)) * 100, 2)
      ELSE 0 
    END as conversion_rate
  FROM banner_stats bs
  WHERE bs.banner_id = get_banner_stats.banner_id;
END;
$$ LANGUAGE plpgsql;

-- 13. Trigger pour nettoyer les images lors de la suppression d'une bannière
CREATE OR REPLACE FUNCTION cleanup_banner_image_on_delete()
RETURNS TRIGGER AS $$
BEGIN
  -- Supprimer l'image du storage si elle existe
  IF OLD.image IS NOT NULL AND OLD.image != '' AND OLD.image NOT LIKE 'http%' THEN
    DELETE FROM storage.objects 
    WHERE bucket_id = 'banner-images' 
    AND name = OLD.image;
  END IF;
  
  RETURN OLD;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER cleanup_banner_image_trigger
  AFTER DELETE ON banners
  FOR EACH ROW
  EXECUTE FUNCTION cleanup_banner_image_on_delete();

-- 14. Commentaires sur les nouvelles fonctions
COMMENT ON FUNCTION cleanup_orphaned_banner_images() IS 'Nettoie les images orphelines du storage';
COMMENT ON FUNCTION get_banner_image_url(TEXT) IS 'Retourne l''URL complète d''une image de bannière';
COMMENT ON FUNCTION get_banner_stats(UUID) IS 'Retourne les statistiques d''une bannière';
COMMENT ON VIEW banners_with_urls IS 'Vue des bannières avec URLs d''images complètes';

-- 15. Exemple d'utilisation des nouvelles fonctions
-- SELECT * FROM get_banner_stats('banner-id-here');
-- SELECT * FROM banners_with_urls WHERE is_active = true;
-- SELECT get_banner_image_url('banners/example.jpg');
