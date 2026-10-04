# Guide de Test des Notifications

## 🔧 Configuration Actuelle

### ✅ OneSignal Configuré
- **App ID** : `ab687135-df2c-4911-9bc2-002528d7f561`
- **Safari Web ID** : `web.onesignal.auto.2487def5-35e2-42f0-bbb7-1e786c35cbb1`
- **Mode** : Production uniquement sur `espacepaserni.org`

### 🔧 Mode Développement
- OneSignal est **simulé** en localhost
- Les notifications fonctionnent sans erreur
- Logs dans la console pour debugging

## 🧪 Tests à Effectuer

### 1. Test en Développement Local
```bash
# Démarrer le serveur de développement
npm run dev

# Ouvrir http://localhost:3000
# Vérifier dans la console :
# ✅ "🔧 Mode développement : OneSignal simulé"
# ✅ Pas d'erreurs OneSignal
```

### 2. Test Ajout au Panier
1. Aller sur `/galeries`
2. Cliquer sur "Commander" sur un article
3. Vérifier dans la console :
   ```
   🔧 Mode développement : Notification simulée envoyée: {
     title: 'Article ajouté au panier',
     message: '[Nom] a été ajouté à votre panier. Voir.',
     url: '/galeries'
   }
   ```

### 3. Test Confirmation de Commande
1. Aller sur `/galeries`
2. Ajouter un article au panier
3. Procéder au checkout
4. Compléter le paiement
5. Vérifier dans la console :
   ```
   🔧 Mode développement : Notification simulée envoyée: {
     title: 'Commande confirmée !',
     message: 'Félicitations ! Votre commande [N°] est confirmée et payée.',
     url: '/mes-commandes'
   }
   ```

### 4. Test Alertes Admin
1. Se connecter à l'admin (`/admin/login`)
2. Aller sur `/galeries`
3. Effectuer une commande (simulation)
4. Vérifier dans l'admin :
   - ✅ Badge d'alerte avec compteur
   - ✅ Son d'alerte (si activé)
   - ✅ Message d'alerte dans le panel

## 🚀 Test en Production

### 1. Déploiement
```bash
# Build pour production
npm run build:lws

# Uploader sur LWS
# Vérifier que le site est accessible en HTTPS
```

### 2. Test OneSignal Réel
1. Ouvrir `https://www.espacepaserni.org`
2. Vérifier dans la console :
   ```
   ✅ OneSignal initialisé avec succès
   ```
3. Accepter les permissions de notification
4. Tester les notifications réelles

## 🐛 Dépannage

### Erreur "Can only be used on: https://espacepaserni.org"
- ✅ **Résolu** : OneSignal est maintenant simulé en développement
- Vérifier que le mode développement est actif

### Notifications ne s'affichent pas
1. Vérifier les permissions du navigateur
2. Vérifier que le site est en HTTPS (production)
3. Vérifier les logs de la console

### Alertes admin ne fonctionnent pas
1. Vérifier que l'admin est connecté
2. Vérifier les logs de la console
3. Tester le son d'alerte manuellement

## 📊 Vérifications

### Console du Navigateur
```javascript
// Vérifier OneSignal
console.log('OneSignal disponible:', typeof window.OneSignal !== 'undefined');

// Tester une notification
notificationService.notifyAddToCart('Test Article');

// Vérifier les alertes admin
adminAlertService.alertNewOrder('test-order', 'CMD-TEST', 'Client Test', 5000);
```

### Dashboard OneSignal
1. Se connecter sur [OneSignal.com](https://onesignal.com)
2. Vérifier les statistiques des notifications
3. Vérifier les abonnés

## 🎯 Résultats Attendus

### En Développement
- ✅ Pas d'erreurs OneSignal
- ✅ Notifications simulées dans la console
- ✅ Alertes admin fonctionnelles
- ✅ Son d'alerte opérationnel

### En Production
- ✅ OneSignal initialisé correctement
- ✅ Notifications push réelles
- ✅ Permissions demandées automatiquement
- ✅ Alertes admin temps réel

## 📝 Notes Importantes

1. **OneSignal ne fonctionne qu'en HTTPS** en production
2. **Les notifications push nécessitent une permission utilisateur**
3. **L'envoi de notifications depuis le client est limité**
4. **Pour des notifications avancées, utiliser l'API REST serveur**

