# 🔧 **CONFIGURATION MANUELLE - SUPABASE STORAGE**

## **📋 ÉTAPES OBLIGATOIRES**

### **1. Créer le Bucket dans Supabase Dashboard :**

1. **Aller dans Supabase Dashboard** → Votre projet → **Storage**
2. **Cliquer sur "New bucket"**
3. **Configurer le bucket :**
   - **Name** : `banner-images`
   - **Public bucket** : ✅ **Activé**
   - **File size limit** : `5 MB`
   - **Allowed MIME types** : `image/jpeg,image/jpg,image/png,image/webp`

### **2. Configurer les Politiques RLS :**

Dans **Storage** → **Policies** → **banner-images** :

#### **Politique 1 - Lecture publique :**
```sql
CREATE POLICY "Public can view banner images" ON storage.objects
FOR SELECT USING (bucket_id = 'banner-images');
```

#### **Politique 2 - Upload pour utilisateurs authentifiés :**
```sql
CREATE POLICY "Authenticated users can upload banner images" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'banner-images' 
  AND auth.role() = 'authenticated'
);
```

#### **Politique 3 - Mise à jour pour utilisateurs authentifiés :**
```sql
CREATE POLICY "Authenticated users can update banner images" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'banner-images' 
  AND auth.role() = 'authenticated'
);
```

#### **Politique 4 - Suppression pour utilisateurs authentifiés :**
```sql
CREATE POLICY "Authenticated users can delete banner images" ON storage.objects
FOR DELETE USING (
  bucket_id = 'banner-images' 
  AND auth.role() = 'authenticated'
);
```

### **3. Vérifier la Configuration :**

- ✅ Bucket `banner-images` créé
- ✅ Bucket public activé
- ✅ Politiques RLS configurées
- ✅ Taille limitée à 5MB
- ✅ Types MIME autorisés

## **🎯 ALTERNATIVE : UPLOAD VIA URL EXTERNE**

Si vous préférez éviter Supabase Storage, vous pouvez utiliser des URLs externes :

### **Modifier le composant ImageUpload :**
```typescript
// Dans src/components/ImageUpload.tsx
// Remplacer l'upload par un simple input URL
<input
  type="url"
  value={value}
  onChange={(e) => onChange(e.target.value)}
  placeholder="https://exemple.com/image.jpg"
  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
/>
```

## **✅ VÉRIFICATION FINALE**

### **Checklist :**
- [ ] Bucket `banner-images` créé dans Supabase
- [ ] Bucket configuré comme public
- [ ] Politiques RLS appliquées
- [ ] Test d'upload d'image réussi
- [ ] Interface admin fonctionnelle

**🎉 Une fois configuré, votre système de bannières sera pleinement opérationnel !**
