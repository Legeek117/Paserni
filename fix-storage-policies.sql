-- Script pour corriger les politiques RLS existantes
-- À exécuter dans Supabase SQL Editor

-- Supprimer et recréer les politiques pour éviter les conflits
DROP POLICY IF EXISTS "Public can view banner images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload banner images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update banner images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete banner images" ON storage.objects;

-- Recréer les politiques
CREATE POLICY "Public can view banner images" ON storage.objects
FOR SELECT USING (bucket_id = 'banner-images');

CREATE POLICY "Authenticated users can upload banner images" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'banner-images' 
  AND auth.role() = 'authenticated'
);

CREATE POLICY "Authenticated users can update banner images" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'banner-images' 
  AND auth.role() = 'authenticated'
);

CREATE POLICY "Authenticated users can delete banner images" ON storage.objects
FOR DELETE USING (
  bucket_id = 'banner-images' 
  AND auth.role() = 'authenticated'
);

-- Vérifier que le bucket existe
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM storage.buckets WHERE name = 'banner-images') THEN
    INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
    VALUES (
      'banner-images',
      'banner-images',
      true,
      5242880, -- 5MB
      ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
    );
  END IF;
END $$;
