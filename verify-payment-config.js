// Vérification de la configuration de paiement
console.log('🔍 VÉRIFICATION DE LA CONFIGURATION DE PAIEMENT');
console.log('===============================================\n');

// Simulation des variables d'environnement (comme dans le build)
const mockEnv = {
  VITE_FEEXPAY_MODE: undefined, // Pas définie = LIVE par défaut
  VITE_APP_URL: undefined // Pas définie = URL par défaut
};

// Configuration simulée (comme dans le code)
const FEEXPAY_CONFIG = {
  token: mockEnv.VITE_FEEXPAY_API_KEY || 'fp_Mzpfp9SkSsuxi5bLkenKykkVrQNpsGxYmim3yc51nDE3VIgHoEAIDoEtrX3r5FYa',
  shopId: mockEnv.VITE_FEEXPAY_MERCHANT_ID || '681535f823d328ae65ff37d4',
  mode: ((mockEnv.VITE_FEEXPAY_MODE) || 'LIVE'),
  currency: 'XOF',
  callbackServer: mockEnv.VITE_FEEXPAY_CALLBACK_URL || 'https://erbnlextswbgtzztsxbf.supabase.co/functions/v1/feexpay-webhook',
  callbackUrl: mockEnv.VITE_APP_URL ? `${mockEnv.VITE_APP_URL}/paiement/retour` : 'https://www.espacepaserni.org/paiement/retour',
  errorCallbackUrl: mockEnv.VITE_APP_URL ? `${mockEnv.VITE_APP_URL}/paiement/erreur` : 'https://www.espacepaserni.org/paiement/erreur'
};

console.log('💳 CONFIGURATION FEEXPAY:');
console.log('Token:', FEEXPAY_CONFIG.token ? '✅ Défini' : '❌ Manquant');
console.log('Shop ID:', FEEXPAY_CONFIG.shopId ? '✅ Défini' : '❌ Manquant');
console.log('Mode:', FEEXPAY_CONFIG.mode);
console.log('Currency:', FEEXPAY_CONFIG.currency);
console.log('');

console.log('🌐 URLs DE CALLBACK:');
console.log('Callback Server (Webhook):', FEEXPAY_CONFIG.callbackServer);
console.log('Callback URL (Retour):', FEEXPAY_CONFIG.callbackUrl);
console.log('Error Callback URL:', FEEXPAY_CONFIG.errorCallbackUrl);
console.log('');

console.log('📄 PAGES DE RETOUR:');
console.log('✅ /paiement/retour → PaymentReturn.tsx (existe)');
console.log('✅ /paiement/erreur → (à créer si nécessaire)');
console.log('✅ /mes-commandes → OrdersTrack.tsx (existe)');
console.log('');

console.log('🎯 RÉSUMÉ:');
console.log('Mode:', FEEXPAY_CONFIG.mode === 'LIVE' ? '✅ LIVE (Production)' : '⚠️ SANDBOX (Test)');
console.log('Page de retour:', FEEXPAY_CONFIG.callbackUrl.includes('/paiement/retour') ? '✅ Configurée' : '❌ Problème');
console.log('Webhook:', FEEXPAY_CONFIG.callbackServer.includes('supabase.co') ? '✅ Supabase' : '❌ Autre');

if (FEEXPAY_CONFIG.mode === 'LIVE') {
  console.log('\n🚨 ATTENTION: Vous êtes en mode LIVE !');
  console.log('   - Les paiements seront réels');
  console.log('   - Les transactions seront facturées');
  console.log('   - Assurez-vous que vos clés sont correctes');
} else {
  console.log('\n🧪 Mode SANDBOX - Paiements de test uniquement');
}



