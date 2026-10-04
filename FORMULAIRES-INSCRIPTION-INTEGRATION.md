# 📝 **INTÉGRATION FORMULAIRES GOOGLE FORMS**

## **✅ FORMULAIRES INTÉGRÉS**

J'ai intégré tous les formulaires Google Forms pour les inscriptions aux différentes formations et programmes d'Espace Paserni.

### **🎯 CORRESPONDANCES DES FORMULAIRES**

| **Programme/Formation** | **Lien Google Forms** | **Page** |
|------------------------|----------------------|----------|
| **Bricol'Art** | [Formulaire d'inscription](https://docs.google.com/forms/d/e/1FAIpQLSeWRTizrqUy5IK5OOUvjqVegaUu0EA1cOatfc4hEmPFGUK7nw/viewform) | `/programmes` |
| **Après-midi Co-créatif** | [Formulaire d'inscription](https://docs.google.com/forms/d/e/1FAIpQLSf_un_sboZUO52YC2Hobl6Fcd0pnEyAZdbf8_cNBy7j40MQ2Q/viewform) | `/programmes` |
| **Formation Global Design** | [Formulaire d'inscription](https://docs.google.com/forms/d/e/1FAIpQLScASDqZn59iH_HMRWD3sFM8cQXMDSTqL_N3tUUVYkroUs-8xg/viewform) | `/programmes` |
| **Programme ALONUZO** | [Formulaire d'inscription](https://docs.google.com/forms/d/e/1FAIpQLSez1GuaklLy7Aa1nmZ3YMpki2PdhaBQKjtwOVaNLeqPnZD5VQ/viewform) | `/programmes` |
| **Championnat de Puzzles** | [Formulaire d'inscription](https://docs.google.com/forms/d/e/1FAIpQLSc4Hi040jfcGC--fUh9SV0DJzXeOfRGHLFnxJ3dEktUbz2hZw/viewform) | `/projet` |

## **🔧 MODIFICATIONS APPORTÉES**

### **📄 Page Programmes (`src/pages/Programs.tsx`)**

#### **Nouvelle fonction `getRegistrationUrl()`:**
```typescript
const getRegistrationUrl = (programTitle: string) => {
  switch (programTitle) {
    case "Bricol'Art":
      return "https://docs.google.com/forms/d/e/1FAIpQLSeWRTizrqUy5IK5OOUvjqVegaUu0EA1cOatfc4hEmPFGUK7nw/viewform";
    case "Après-midi Co-créatif":
      return "https://docs.google.com/forms/d/e/1FAIpQLSf_un_sboZUO52YC2Hobl6Fcd0pnEyAZdbf8_cNBy7j40MQ2Q/viewform";
    case "Formation Global Design":
      return "https://docs.google.com/forms/d/e/1FAIpQLScASDqZn59iH_HMRWD3sFM8cQXMDSTqL_N3tUUVYkroUs-8xg/viewform";
    case "Programme ALONUZO":
      return "https://docs.google.com/forms/d/e/1FAIpQLSez1GuaklLy7Aa1nmZ3YMpki2PdhaBQKjtwOVaNLeqPnZD5VQ/viewform";
    default:
      return buildWhatsapp(programTitle); // Fallback vers WhatsApp
  }
};
```

#### **Boutons d'inscription modifiés :**
- **Programmes hebdomadaires** : Bouton principal "S'inscrire" redirige vers Google Forms
- **Formations** : Bouton "S'inscrire" redirige vers Google Forms correspondant

### **📄 Page Projets (`src/pages/Projects.tsx`)**

#### **Nouvelle fonction `getProjectRegistrationUrl()`:**
```typescript
const getProjectRegistrationUrl = (projectTitle: string) => {
  switch (projectTitle) {
    case "Championnat de Puzzles":
      return "https://docs.google.com/forms/d/e/1FAIpQLSc4Hi040jfcGC--fUh9SV0DJzXeOfRGHLFnxJ3dEktUbz2hZw/viewform";
    default:
      return buildEmail(projectTitle); // Fallback vers email
  }
};
```

#### **Bouton modifié :**
- **Championnat de Puzzles** : "Participer au Projet" redirige vers le formulaire Google Forms

## **🎯 FONCTIONNEMENT**

### **🔄 Logique de Redirection :**
1. **Match exact** : Si le titre correspond à un programme/formation connu → Google Forms
2. **Fallback** : Sinon → WhatsApp pour programmes, Email pour projets

### **📱 Expérience Utilisateur :**
- **Clic sur "S'inscrire"** → Ouverture directe du formulaire Google Forms
- **Nouvel onglet** : Les formulaires s'ouvrent dans un nouvel onglet
- **Accessibilité** : Liens avec `target="_blank"` et `rel="noopener noreferrer"`

## **📋 FORMULAIRES INTÉGRÉS**

### **🎨 Programmes Créatifs :**
1. **[Bricol'Art](https://docs.google.com/forms/d/e/1FAIpQLSeWRTizrqUy5IK5OOUvjqVegaUu0EA1cOatfc4hEmPFGUK7nw/viewform)**
   - Mercredis 15h-17h, 5-15 ans
   - Informations : Nom, âge, école, santé, contacts parents

2. **[Après-midi Co-créatif](https://docs.google.com/forms/d/e/1FAIpQLSf_un_sboZUO52YC2Hobl6Fcd0pnEyAZdbf8_cNBy7j40MQ2Q/viewform)**
   - Samedis 15h-17h, adolescents/adultes
   - Informations : Niveau d'étude, activité pro, contacts

### **🎓 Formations :**
3. **[Formation Global Design](https://docs.google.com/forms/d/e/1FAIpQLScASDqZn59iH_HMRWD3sFM8cQXMDSTqL_N3tUUVYkroUs-8xg/viewform)**
   - 9 mois, 300 000 F CFA
   - Informations : Niveau d'étude (BEPC/BAC/LICENCE), activité pro

4. **[Programme ALONUZO](https://docs.google.com/forms/d/e/1FAIpQLSez1GuaklLy7Aa1nmZ3YMpki2PdhaBQKjtwOVaNLeqPnZD5VQ/viewform)**
   - 1 mois, 50 000 F CFA
   - Modules : Graphisme, Sérigraphie, Peinture, etc.

### **🏆 Projets :**
5. **[Championnat de Puzzles](https://docs.google.com/forms/d/e/1FAIpQLSc4Hi040jfcGC--fUh9SV0DJzXeOfRGHLFnxJ3dEktUbz2hZw/viewform)**
   - Concours créatif
   - Informations : École/collège, contacts parents

## **✅ RÉSULTAT**

**Les utilisateurs sont maintenant redirigés automatiquement vers les bons formulaires Google Forms selon le programme choisi :**
- 🎯 **Ciblage précis** : Chaque programme a son formulaire dédié
- 📝 **Collecte structurée** : Informations spécifiques selon le type de programme
- 🚀 **Expérience optimisée** : Inscription directe sans redirection manuelle
- 📱 **Responsive** : Fonctionne sur tous les appareils

**🎉 Inscriptions simplifiées et centralisées via Google Forms !**
