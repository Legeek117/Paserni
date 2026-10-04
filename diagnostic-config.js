// Script de diagnostic pour vérifier la configuration FeeXPay et Supabase
import { supabase } from './src/lib/supabase.js';
import { FEEXPAY_CONFIG } from './src/config/feexpay.js';

console.log('🔍 DIAGNOSTIC DE CONFIGURATION');
console.log('================================\n');

// 1. Vérification des variables d'environnement
console.log('📋 VARIABLES D\'ENVIRONNEMENT:');
console.log('VITE_FEEXPAY_API_KEY:', import.meta.env?.VITE_FEEXPAY_API_KEY ? '✅ Définie' : '❌ Manquante');
console.log('VITE_FEEXPAY_MERCHANT_ID:', import.meta.env?.VITE_FEEXPAY_MERCHANT_ID ? '✅ Définie' : '❌ Manquante');
console.log('VITE_FEEXPAY_MODE:', import.meta.env?.VITE_FEEXPAY_MODE || 'LIVE (défaut)');
console.log('VITE_SUPABASE_URL:', import.meta.env?.VITE_SUPABASE_URL ? '✅ Définie' : '❌ Manquante');
console.log('VITE_SUPABASE_ANON_KEY:', import.meta.env?.VITE_SUPABASE_ANON_KEY ? '✅ Définie' : '❌ Manquante');
console.log('');

// 2. Configuration FeeXPay
console.log('💳 CONFIGURATION FEEXPAY:');
console.log('Token:', FEEXPAY_CONFIG.token ? '✅ Défini' : '❌ Undefined');
console.log('Shop ID:', FEEXPAY_CONFIG.shopId ? '✅ Défini' : '❌ Undefined');
console.log('Mode:', FEEXPAY_CONFIG.mode);
console.log('Currency:', FEEXPAY_CONFIG.currency);
console.log('Callback Server:', FEEXPAY_CONFIG.callbackServer ? '✅ Défini' : '❌ Undefined');
console.log('');

// 3. Test de connexion Supabase
console.log('🗄️ TEST DE CONNEXION SUPABASE:');
try {
  const { data, error } = await supabase
    .from('site_settings')
    .select('*')
    .limit(1);
  
  if (error) {
    console.log('❌ Erreur Supabase:', error.message);
  } else {
    console.log('✅ Connexion Supabase réussie');
    console.log('📊 Données récupérées:', data?.length || 0, 'enregistrements');
  }
} catch (err) {
  console.log('❌ Erreur de connexion Supabase:', err.message);
}
console.log('');

// 4. Diagnostic du problème FeeXPay
console.log('🔧 DIAGNOSTIC FEEXPAY:');
if (!FEEXPAY_CONFIG.shopId) {
  console.log('❌ PROBLÈME IDENTIFIÉ: shopId est undefined');
  console.log('   → VITE_FEEXPAY_MERCHANT_ID n\'est pas définie');
  console.log('   → L\'URL devient: api.feexpay.me/api/shop/undefined/get_shop');
  console.log('');
  console.log('💡 SOLUTIONS:');
  console.log('   1. Créer un fichier .env.local avec:');
  console.log('      VITE_FEEXPAY_MERCHANT_ID=votre_merchant_id');
  console.log('   2. Ou définir la variable dans votre hébergeur');
  console.log('   3. Ou utiliser les valeurs par défaut dans src/lib/feexpay.ts');
} else {
  console.log('✅ Shop ID correctement configuré');
}

console.log('\n🎯 RÉSUMÉ:');
console.log('- Variables d\'environnement:', import.meta.env?.VITE_FEEXPAY_MERCHANT_ID ? 'OK' : 'MANQUANTES');
console.log('- Configuration FeeXPay:', FEEXPAY_CONFIG.shopId ? 'OK' : 'PROBLÈME');
console.log('- Connexion Supabase:', 'À tester manuellement');



