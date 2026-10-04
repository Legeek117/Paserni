# Guide de Dépannage OneSignal

## 🐛 Erreurs Communes et Solutions

### ❌ Erreur: "getNotificationPermission is not a function"

**Problème :** L'API OneSignal v16 a changé et certaines méthodes ne sont plus disponibles.

**Solution :** ✅ **RÉSOLU**
- Remplacé `getNotificationPermission()` par `isPushNotificationsEnabled()`
- Ajout de la compatibilité avec l'ancienne API
- Mode simulation pour le développement

### ❌ Erreur: "Can only be used on: https://espacepaserni.org"

**Problème :** OneSignal ne fonctionne que sur le domaine de production configuré.

**Solution :** ✅ **RÉSOLU**
- Détection automatique du mode (développement/production)
- Simulation OneSignal en localhost
- Configuration conditionnelle selon l'environnement

## 🔧 Configuration Actuelle

### Mode Développement (localhost)
```javascript
// OneSignal simulé
window.OneSignal = {
  init: () => Promise.resolve(),
  getUserId: () => Promise.resolve('dev-user-id'),
  isPushNotificationsEnabled: () => Promise.resolve(true),
  showNativePrompt: () => Promise.resolve(),
  getNotificationPermission: () => Promise.resolve('granted') // Compatibilité
};
```

### Mode Production (espacepaserni.org)
```javascript
// OneSignal réel avec votre App ID
await OneSignal.init({
  appId: "ab687135-df2c-4911-9bc2-002528d7f561",
  safari_web_id: "web.onesignal.auto.2487def5-35e2-42f0-bbb7-1e786c35cbb1",
  notifyButton: { enable: false },
  promptOptions: { /* ... */ }
});
```

## 📊 Vérifications

### 1. Console du Navigateur
Vérifiez que vous voyez :
```
✅ OneSignal initialisé avec succès
🔧 Mode développement : Permission simulée accordée
🔧 Mode développement : Notification simulée envoyée: {...}
```

### 2. Pas d'Erreurs
Ne devrait plus voir :
```
❌ getNotificationPermission is not a function
❌ Can only be used on: https://espacepaserni.org
```

## 🚀 Tests

### Test en Développement
```bash
npm run dev
# Ouvrir http://localhost:3000
# Aller sur /galeries
# Cliquer "Commander" sur un article
# Vérifier la console
```

**Résultat attendu :**
```
🔧 Mode développement : OneSignal simulé
🔧 Mode développement : Permission simulée accordée
🔧 Mode développement : Notification simulée envoyée: {
  title: 'Article ajouté au panier',
  message: 'Puzzle Chien Numérique a été ajouté à votre panier. Voir.',
  url: '/galeries'
}
```

### Test en Production
```bash
npm run build:lws
# Uploader sur LWS
# Ouvrir https://www.espacepaserni.org
# Tester les notifications réelles
```

**Résultat attendu :**
```
✅ OneSignal initialisé avec succès
📱 Notification prête à être envoyée: {...}
```

## 🔍 Dépannage Avancé

### Si les notifications ne fonctionnent toujours pas :

1. **Vérifier la console :**
   ```javascript
   // Dans la console du navigateur
   console.log('OneSignal disponible:', typeof window.OneSignal !== 'undefined');
   console.log('Mode production:', window.location.hostname === 'espacepaserni.org');
   ```

2. **Vérifier les permissions :**
   - Chrome : `chrome://settings/content/notifications`
   - Firefox : `about:preferences#privacy`
   - Safari : `Préférences > Sites web > Notifications`

3. **Vérifier HTTPS :**
   - Les notifications push nécessitent HTTPS
   - Vérifier que le site est bien en `https://`

4. **Vérifier OneSignal Dashboard :**
   - Se connecter sur [OneSignal.com](https://onesignal.com)
   - Vérifier les statistiques des notifications
   - Vérifier les abonnés

## 📱 API OneSignal v16

### Méthodes Disponibles
```javascript
// Vérifier si les notifications sont activées
await OneSignal.isPushNotificationsEnabled()

// Obtenir l'ID utilisateur (peut varier selon la version)
await OneSignal.getUserId()

// Demander la permission
await OneSignal.showNativePrompt()

// Initialiser OneSignal
await OneSignal.init({ appId: '...' })
```

### Méthodes Dépréciées
```javascript
// ❌ Plus disponible dans v16
OneSignal.getNotificationPermission()

// ✅ Utiliser à la place
OneSignal.isPushNotificationsEnabled()
```

## 🎯 Prochaines Étapes

### Pour des Notifications Réelles
1. **Implémenter un webhook backend** pour envoyer des notifications via l'API REST
2. **Configurer les segments** d'utilisateurs
3. **Ajouter des analytics** avancées

### Exemple de Webhook (Node.js)
```javascript
app.post('/webhook/order', async (req, res) => {
  const { orderNumber, customerName } = req.body;
  
  await fetch('https://onesignal.com/api/v1/notifications', {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${process.env.ONESIGNAL_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      app_id: 'ab687135-df2c-4911-9bc2-002528d7f561',
      included_segments: ['Subscribed Users'],
      headings: { en: 'Nouvelle commande !' },
      contents: { en: `Commande ${orderNumber} de ${customerName}` }
    })
  });
});
```

## 📞 Support

Si vous rencontrez encore des problèmes :
1. Vérifiez les logs de la console
2. Testez en mode incognito
3. Vérifiez les permissions du navigateur
4. Consultez la [documentation OneSignal](https://documentation.onesignal.com/)
