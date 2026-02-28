/**
 * Script de diagnostic pour l'interface admin
 * Teste la connexion et la récupération des données pending_opportunities
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://bzcmpulivznmzbjggbyh.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ6Y21wdWxpdnpubXpiamdnYnloIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTIyODk3NSwiZXhwIjoyMDg2ODA0OTc1fQ.JqXTPVBvlDRPVnIuyU2xo7IDQAKtPLgm8BJpbsWOOQY';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ6Y21wdWxpdnpubXpiamdnYnloIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzEyMjg5NzUsImV4cCI6MjA4NjgwNDk3NX0.sb_publishable_RvZZojymg2-eFROVdVT2-Q_E4MvbH1v';

console.log('🔍 Diagnostic de l\'interface admin EVOLUTICS');
console.log('='.repeat(50));

async function testAdminInterface() {
  // Test 1: Connexion avec clé de service (comme dans le code)
  console.log('\n1️⃣ Test avec clé de service (supabaseAdmin)');
  const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

  try {
    const { data: adminData, error: adminError } = await supabaseAdmin
      .from('pending_opportunities')
      .select('*')
      .order('created_at', { ascending: false });

    if (adminError) {
      console.error('❌ Erreur avec clé de service:', adminError.message);
      console.error('🔍 Code:', adminError.code);
    } else {
      console.log(`✅ Succès avec clé de service: ${adminData?.length || 0} opportunités trouvées`);
      if (adminData && adminData.length > 0) {
        console.log('📋 Première opportunité:');
        console.log(`   - ID: ${adminData[0].id}`);
        console.log(`   - Titre: ${adminData[0].title}`);
        console.log(`   - Type: ${adminData[0].type}`);
        console.log(`   - Status: ${adminData[0].status}`);
        console.log(`   - Organisation: ${adminData[0].organization}`);
      }
    }
  } catch (error) {
    console.error('💥 Erreur générale avec clé de service:', error.message);
  }

  // Test 2: Connexion avec clé anonyme (comme l'interface pourrait utiliser)
  console.log('\n2️⃣ Test avec clé anonyme');
  const supabaseAnon = createClient(supabaseUrl, supabaseAnonKey);

  try {
    const { data: anonData, error: anonError } = await supabaseAnon
      .from('pending_opportunities')
      .select('*')
      .order('created_at', { ascending: false });

    if (anonError) {
      console.error('❌ Erreur avec clé anonyme:', anonError.message);
      console.error('🔍 Code:', anonError.code);
      console.log('🚨 L\'interface admin utilise peut-être la mauvaise clé !');
    } else {
      console.log(`✅ Succès avec clé anonyme: ${anonData?.length || 0} opportunités trouvées`);
    }
  } catch (error) {
    console.error('💥 Erreur générale avec clé anonyme:', error.message);
  }

  // Test 3: Vérifier les variables d'environnement
  console.log('\n3️⃣ Test des variables d\'environnement');
  console.log('VITE_SUPABASE_URL:', process.env.VITE_SUPABASE_URL || 'NON DÉFINIE');
  console.log('VITE_SUPABASE_ANON_KEY:', process.env.VITE_SUPABASE_ANON_KEY ? 'DÉFINIE' : 'NON DÉFINIE');

  // Test 4: Simuler exactement ce que fait pendingOpportunityService
  console.log('\n4️⃣ Test du service pendingOpportunityService');
  try {
    // Simuler la fonction getAll du service
    let query = supabaseAdmin
      .from('pending_opportunities')
      .select('*')
      .order('created_at', { ascending: false });

    // Avec filtre status = 'pending' (par défaut dans l'interface)
    query = query.eq('status', 'pending');

    const { data: serviceData, error: serviceError } = await query;

    if (serviceError) {
      console.error('❌ Erreur simulation service:', serviceError.message);
    } else {
      console.log(`✅ Simulation service réussie: ${serviceData?.length || 0} opportunités pending`);

      // Compter par status
      const allData = await supabaseAdmin.from('pending_opportunities').select('status');
      if (allData.data) {
        const statusCount = allData.data.reduce((acc, item) => {
          acc[item.status] = (acc[item.status] || 0) + 1;
          return acc;
        }, {});
        console.log('📊 Répartition par status:', statusCount);
      }
    }
  } catch (error) {
    console.error('💥 Erreur simulation service:', error.message);
  }

  // Test 5: Vérifier la structure des données
  console.log('\n5️⃣ Test de la structure des données');
  try {
    const { data: structureData, error: structureError } = await supabaseAdmin
      .from('pending_opportunities')
      .select('id, type, title, organization, status, created_at')
      .limit(1);

    if (structureError) {
      console.error('❌ Erreur structure:', structureError.message);
    } else if (structureData && structureData.length > 0) {
      console.log('✅ Structure des données:');
      console.log(JSON.stringify(structureData[0], null, 2));
    }
  } catch (error) {
    console.error('💥 Erreur test structure:', error.message);
  }

  console.log('\n' + '='.repeat(50));
  console.log('🎯 DIAGNOSTIC TERMINÉ');
  console.log('💡 Si les données existent avec la clé de service mais pas avec la clé anonyme,');
  console.log('   vérifiez que l\'interface admin utilise bien supabaseAdmin et non supabase');
}

testAdminInterface();