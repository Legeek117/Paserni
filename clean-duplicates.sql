-- Script SQL pour nettoyer les doublons dans department_images
-- Ce script doit être exécuté dans votre base de données Supabase

-- Supprimer les doublons en gardant le plus récent
WITH duplicates AS (
  SELECT 
    id,
    ROW_NUMBER() OVER (
      PARTITION BY department, country 
      ORDER BY created_at DESC
    ) as rn
  FROM public.department_images
)
DELETE FROM public.department_images 
WHERE id IN (
  SELECT id FROM duplicates WHERE rn > 1
);

-- Vérifier le résultat
SELECT 
  department, 
  country, 
  COUNT(*) as count
FROM public.department_images 
GROUP BY department, country 
ORDER BY department, country;
