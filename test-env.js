// Test des variables d'environnement
console.log('🔍 TEST DES VARIABLES D\'ENVIRONNEMENT');
console.log('=====================================\n');

// Variables FeeXPay
console.log('💳 FEEXPAY:');
console.log('VITE_FEEXPAY_API_KEY:', process.env.VITE_FEEXPAY_API_KEY ? '✅ Définie' : '❌ Manquante');
console.log('VITE_FEEXPAY_MERCHANT_ID:', process.env.VITE_FEEXPAY_MERCHANT_ID ? '✅ Définie' : '❌ Manquante');
console.log('VITE_FEEXPAY_MODE:', process.env.VITE_FEEXPAY_MODE || 'LIVE (défaut)');

// Variables Supabase
console.log('\n🗄️ SUPABASE:');
console.log('VITE_SUPABASE_URL:', process.env.VITE_SUPABASE_URL ? '✅ Définie' : '❌ Manquante');
console.log('VITE_SUPABASE_ANON_KEY:', process.env.VITE_SUPABASE_ANON_KEY ? '✅ Définie' : '❌ Manquante');

// Variables d'application
console.log('\n🌐 APPLICATION:');
console.log('VITE_APP_URL:', process.env.VITE_APP_URL ? '✅ Définie' : '❌ Manquante');

console.log('\n📋 TOUTES LES VARIABLES D\'ENVIRONNEMENT:');
Object.keys(process.env)
  .filter(key => key.startsWith('VITE_'))
  .forEach(key => {
    console.log(`${key}: ${process.env[key] ? '✅' : '❌'}`);
  });
