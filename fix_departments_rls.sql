-- ============================================================================
-- Réparation des politiques RLS — Espace Paserni (projet ferumuzfwegshuezfdbq)
-- ============================================================================
-- À exécuter dans l'éditeur SQL du dashboard Supabase :
--   https://supabase.com/dashboard/project/ferumuzfwegshuezfdbq/sql
--
-- CONSTAT
--   products            : 54 lignes en service_role, 54 en anon  -> OK
--   department_images   : 22 lignes en service_role,  0 en anon  -> BLOQUÉ
--   departments         : 19 lignes en service_role,  0 en anon  -> BLOQUÉ
--   banners             :  1 ligne  en service_role,  0 en anon  -> BLOQUÉ
--   site_settings       :  1 ligne  en service_role,  0 en anon  -> BLOQUÉ
--
--   Les données sont bien présentes. C'est la politique RLS qui masque tout
--   au navigateur : les galeries de départements s'affichent donc vides, sans
--   message d'erreur.
--
-- PRINCIPE
--   Lecture publique (anon + authenticated) : les visitors doivent voir les
--   départements et leurs images. Écriture réservée à authenticated.
-- ============================================================================

-- ---------------------------------------------------------------------------
-- 1. department_images
-- ---------------------------------------------------------------------------
ALTER TABLE public.department_images ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can read department_images" ON public.department_images;

CREATE POLICY "Public can read department_images"
ON public.department_images
FOR SELECT
TO anon, authenticated
USING (true);

-- Pas de policy INSERT/UPDATE/DELETE : l'écriture reste interdite à anon
-- et n'est ouverte qu'aux utilisateurs authentifiés (via une policy dédiée
-- ci-dessous si nécessaire).

DROP POLICY IF EXISTS "Authenticated can manage department_images" ON public.department_images;

CREATE POLICY "Authenticated can manage department_images"
ON public.department_images
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);


-- ---------------------------------------------------------------------------
-- 2. departments
-- ---------------------------------------------------------------------------
ALTER TABLE public.departments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can read departments" ON public.departments;

CREATE POLICY "Public can read departments"
ON public.departments
FOR SELECT
TO anon, authenticated
USING (true);

DROP POLICY IF EXISTS "Authenticated can manage departments" ON public.departments;

CREATE POLICY "Authenticated can manage departments"
ON public.departments
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);


-- ---------------------------------------------------------------------------
-- 3. banners
-- ---------------------------------------------------------------------------
ALTER TABLE public.banners ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can read banners" ON public.banners;

CREATE POLICY "Public can read banners"
ON public.banners
FOR SELECT
TO anon, authenticated
USING (true);

DROP POLICY IF EXISTS "Authenticated can manage banners" ON public.banners;

CREATE POLICY "Authenticated can manage banners"
ON public.banners
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);


-- ---------------------------------------------------------------------------
-- 4. site_settings
-- ---------------------------------------------------------------------------
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can read site_settings" ON public.site_settings;

CREATE POLICY "Public can read site_settings"
ON public.site_settings
FOR SELECT
TO anon, authenticated
USING (true);

DROP POLICY IF EXISTS "Authenticated can manage site_settings" ON public.site_settings;

CREATE POLICY "Authenticated can manage site_settings"
ON public.site_settings
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);


-- ---------------------------------------------------------------------------
-- 5. products — vérifier que la lecture reste publique
-- ---------------------------------------------------------------------------
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can read products" ON public.products;

CREATE POLICY "Public can read products"
ON public.products
FOR SELECT
TO anon, authenticated
USING (true);


-- ============================================================================
-- VÉRIFICATION (à exécuter après)
-- ============================================================================
-- SELECT 'anon voit ' || count(*) FROM department_images;
-- doit renvoyer 22
--
-- SELECT 'anon voit ' || count(*) FROM departments;
-- doit renvoyer 19
-- ============================================================================