# Guide d'Implémentation des Notifications Push

## 🚀 Configuration OneSignal

### 1. Créer un compte OneSignal
1. Allez sur [OneSignal.com](https://onesignal.com)
2. Créez un compte gratuit
3. Créez une nouvelle application web

### 2. Configuration de l'application
1. **App ID** : Copiez l'App ID depuis votre dashboard OneSignal
2. **REST API Key** : Générez une clé API depuis les paramètres
3. **Web Push Certificates** : Configurez les certificats pour HTTPS

### 3. Variables d'environnement
Ajoutez dans votre fichier `.env.local` :
```env
VITE_ONESIGNAL_APP_ID=your-onesignal-app-id-here
```

## 📱 Fonctionnalités Implémentées

### ✅ Notifications Client
- **Ajout au panier** : Notification automatique lors de l'ajout d'un article
- **Confirmation de commande** : Notification après paiement réussi
- **Permission** : Demande automatique de permission au premier usage

### ✅ Alertes Admin
- **Nouvelle commande** : Alerte sonore et visuelle pour l'admin
- **Paiement reçu** : Notification de confirmation de paiement
- **Interface** : Panel d'alertes avec gestion des notifications

## 🔧 Code Implémenté

### Service de Notifications (`src/services/notificationService.ts`)
```typescript
// Initialisation OneSignal
await notificationService.initialize();

// Notification ajout au panier
await notificationService.notifyAddToCart(itemName);

// Notification confirmation commande
await notificationService.notifyOrderConfirmation(orderNumber);
```

### Service d'Alertes Admin (`src/services/adminAlertService.ts`)
```typescript
// Alerte nouvelle commande
adminAlertService.alertNewOrder(orderId, orderNumber, customerName, total);

// Alerte paiement reçu
adminAlertService.alertPaymentReceived(orderId, orderNumber, amount);
```

### Composant AdminAlertPanel (`src/components/AdminAlertPanel.tsx`)
- Interface utilisateur pour les alertes admin
- Gestion des notifications (marquer comme lu, supprimer)
- Contrôle du son d'alerte

## 🎯 Utilisation

### Pour les Clients
1. Les notifications s'activent automatiquement
2. Permission demandée au premier ajout au panier
3. Notifications pour ajout au panier et confirmation de commande

### Pour les Administrateurs
1. Alertes automatiques lors de nouvelles commandes
2. Son d'alerte configurable
3. Interface de gestion des alertes dans l'admin

## 🔧 Configuration Backend (Optionnel)

Pour des notifications plus avancées, vous pouvez implémenter un webhook backend :

```javascript
// Exemple de webhook Node.js
app.post('/webhook/order', async (req, res) => {
  const { orderId, orderNumber, customerName, total } = req.body;
  
  // Envoyer notification OneSignal
  await fetch('https://onesignal.com/api/v1/notifications', {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${process.env.ONESIGNAL_REST_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      app_id: process.env.ONESIGNAL_APP_ID,
      included_segments: ['Subscribed Users'],
      headings: { en: 'Nouvelle commande !' },
      contents: { en: `Commande ${orderNumber} de ${customerName}` }
    })
  });
});
```

## 📊 Monitoring

### OneSignal Dashboard
- Statistiques des notifications
- Taux de délivrance
- Engagement des utilisateurs

### Logs de l'Application
- Erreurs de notification dans la console
- Statut d'initialisation OneSignal
- Alertes admin dans les logs

## 🚨 Dépannage

### Notifications ne fonctionnent pas
1. Vérifiez l'App ID OneSignal
2. Vérifiez que le site est en HTTPS
3. Vérifiez les permissions du navigateur

### Alertes admin ne s'affichent pas
1. Vérifiez que l'admin est connecté
2. Vérifiez les logs de la console
3. Testez le son d'alerte

## 📈 Améliorations Futures

- [ ] Notifications programmées
- [ ] Segmentation des utilisateurs
- [ ] Analytics avancées
- [ ] Notifications par email
- [ ] Intégration SMS
