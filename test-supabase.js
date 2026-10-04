// Test de connexion Supabase
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://erbnlextswbgtzztsxbf.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVyYm5sZXh0c3diZ3R6enRzeGJmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkyNTI0NTEsImV4cCI6MjA3NDgyODQ1MX0.rM8FAq5xG3-nvsLf5PpiA4h3Jh7jDj7mtteW8RSPL-8';

const supabase = createClient(supabaseUrl, supabaseKey);

console.log('🗄️ TEST DE CONNEXION SUPABASE');
console.log('==============================\n');

console.log('URL:', supabaseUrl);
console.log('Clé:', supabaseKey.substring(0, 20) + '...');

async function testSupabase() {
  try {
    console.log('\n🔄 Test de connexion...');
    
    // Test 1: Récupérer les paramètres du site
    const { data: settings, error: settingsError } = await supabase
      .from('site_settings')
      .select('*')
      .limit(1);
    
    if (settingsError) {
      console.log('❌ Erreur site_settings:', settingsError.message);
    } else {
      console.log('✅ site_settings:', settings?.length || 0, 'enregistrements');
    }
    
    // Test 2: Récupérer les départements
    const { data: departments, error: deptError } = await supabase
      .from('departments')
      .select('*')
      .limit(5);
    
    if (deptError) {
      console.log('❌ Erreur departments:', deptError.message);
    } else {
      console.log('✅ departments:', departments?.length || 0, 'enregistrements');
    }
    
    // Test 3: Récupérer les commandes
    const { data: orders, error: ordersError } = await supabase
      .from('orders')
      .select('*')
      .limit(5);
    
    if (ordersError) {
      console.log('❌ Erreur orders:', ordersError.message);
    } else {
      console.log('✅ orders:', orders?.length || 0, 'enregistrements');
    }
    
    console.log('\n🎉 CONNEXION SUPABASE RÉUSSIE !');
    
  } catch (error) {
    console.log('❌ Erreur de connexion:', error.message);
  }
}

testSupabase();
