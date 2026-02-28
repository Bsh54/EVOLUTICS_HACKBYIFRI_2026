/**
 * Script de test pour diagnostiquer la connexion Supabase
 * et vérifier la récupération des opportunités en attente
 */

import { createClient } from '@supabase/supabase-js';

// Configuration Supabase
const supabaseUrl = 'https://bzcmpulivznmzbjggbyh.supabase.co';
const supabaseAnonKey = 'sb_publishable_RvZZojymg2-eFROVdVT2-Q_E4MvbH1v';

console.log('🔍 Test de connexion Supabase...');
console.log('URL:', supabaseUrl);
console.log('Clé (tronquée):', supabaseAnonKey.substring(0, 20) + '...');

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testConnection() {
  try {
    console.log('\n📡 Test 1: Connexion de base...');

    // Test de connexion simple
    const { data: healthCheck, error: healthError } = await supabase
      .from('pending_opportunities')
      .select('count', { count: 'exact', head: true });

    if (healthError) {
      console.error('❌ Erreur de connexion:', healthError);
      return;
    }

    console.log('✅ Connexion réussie');
    console.log('📊 Nombre total d\'opportunités:', healthCheck);

    console.log('\n📡 Test 2: Récupération des données...');

    // Test de récupération des données
    const { data: opportunities, error: fetchError } = await supabase
      .from('pending_opportunities')
      .select('*')
      .limit(5);

    if (fetchError) {
      console.error('❌ Erreur récupération:', fetchError);
      return;
    }

    console.log('✅ Récupération réussie');
    console.log('📋 Opportunités trouvées:', opportunities?.length || 0);

    if (opportunities && opportunities.length > 0) {
      console.log('\n📄 Exemple d\'opportunité:');
      const example = opportunities[0];
      console.log('- ID:', example.id);
      console.log('- Titre:', example.title);
      console.log('- Organisation:', example.organization);
      console.log('- Statut:', example.status);
      console.log('- Créé le:', example.created_at);
    }

    console.log('\n📡 Test 3: Filtrage par statut...');

    // Test avec filtre status = 'pending'
    const { data: pendingOnly, error: filterError } = await supabase
      .from('pending_opportunities')
      .select('*')
      .eq('status', 'pending')
      .order('created_at', { ascending: false });

    if (filterError) {
      console.error('❌ Erreur filtrage:', filterError);
      return;
    }

    console.log('✅ Filtrage réussi');
    console.log('⏳ Opportunités en attente:', pendingOnly?.length || 0);

    console.log('\n📡 Test 4: Statistiques...');

    // Test des statistiques
    const { data: allData, error: statsError } = await supabase
      .from('pending_opportunities')
      .select('status, ai_confidence, created_at');

    if (statsError) {
      console.error('❌ Erreur statistiques:', statsError);
      return;
    }

    const stats = allData?.reduce((acc, item) => {
      acc.total++;
      acc[item.status] = (acc[item.status] || 0) + 1;
      return acc;
    }, { total: 0 });

    console.log('✅ Statistiques calculées');
    console.log('📊 Répartition par statut:', stats);

  } catch (error) {
    console.error('💥 Erreur générale:', error);
  }
}

// Exécuter le test
testConnection().then(() => {
  console.log('\n🏁 Test terminé');
}).catch(error => {
  console.error('💥 Erreur fatale:', error);
});