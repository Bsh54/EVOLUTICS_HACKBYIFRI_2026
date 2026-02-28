/**
 * Test simple pour diagnostiquer le problème de permissions Supabase
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://bzcmpulivznmzbjggbyh.supabase.co';
const supabaseAnonKey = 'sb_publishable_RvZZojymg2-eFROVdVT2-Q_E4MvbH1v';

console.log('🔍 Diagnostic des permissions Supabase...');

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testPermissions() {
  try {
    console.log('\n📡 Test 1: Lecture avec clé anonyme...');

    const { data: anonData, error: anonError } = await supabase
      .from('pending_opportunities')
      .select('*');

    if (anonError) {
      console.log('❌ Erreur avec clé anonyme:', anonError.message);
      console.log('🔍 Code erreur:', anonError.code);
      console.log('🔍 Détails:', anonError.details);
    } else {
      console.log('✅ Lecture réussie avec clé anonyme');
      console.log('📊 Nombre d\'opportunités:', anonData?.length || 0);
    }

    console.log('\n📡 Test 2: Test des politiques RLS...');

    // Test avec différentes requêtes pour identifier le problème
    const tests = [
      { name: 'Count total', query: () => supabase.from('pending_opportunities').select('*', { count: 'exact', head: true }) },
      { name: 'Select ID seulement', query: () => supabase.from('pending_opportunities').select('id') },
      { name: 'Select avec limit', query: () => supabase.from('pending_opportunities').select('*').limit(1) },
      { name: 'Select status pending', query: () => supabase.from('pending_opportunities').select('*').eq('status', 'pending') }
    ];

    for (const test of tests) {
      try {
        const { data, error } = await test.query();
        if (error) {
          console.log(`❌ ${test.name}: ${error.message}`);
        } else {
          console.log(`✅ ${test.name}: ${Array.isArray(data) ? data.length : 'OK'} résultats`);
        }
      } catch (e) {
        console.log(`💥 ${test.name}: ${e.message}`);
      }
    }

    console.log('\n📡 Test 3: Vérification de la table opportunities...');

    const { data: oppData, error: oppError } = await supabase
      .from('opportunities')
      .select('*')
      .limit(3);

    if (oppError) {
      console.log('❌ Erreur table opportunities:', oppError.message);
    } else {
      console.log('✅ Table opportunities accessible');
      console.log('📊 Nombre d\'opportunités:', oppData?.length || 0);
      if (oppData && oppData.length > 0) {
        console.log('📋 Exemple:', oppData[0].title);
      }
    }

    console.log('\n📡 Test 4: Test d\'insertion (pour vérifier les permissions d\'écriture)...');

    const testInsert = {
      id: 'test-' + Date.now(),
      type: 'Stage',
      title: 'Test Permission',
      organization: 'Test Org',
      description: 'Test de permissions',
      status: 'pending',
      ai_processed: false,
      ai_confidence: 0.5,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    const { data: insertData, error: insertError } = await supabase
      .from('pending_opportunities')
      .insert([testInsert])
      .select();

    if (insertError) {
      console.log('❌ Erreur insertion:', insertError.message);
      console.log('🔍 Code:', insertError.code);

      if (insertError.code === '42501') {
        console.log('🚨 PROBLÈME IDENTIFIÉ: Politiques RLS trop restrictives !');
        console.log('💡 Solution: Ajuster les politiques RLS dans Supabase');
      }
    } else {
      console.log('✅ Insertion réussie');

      // Nettoyer le test
      await supabase
        .from('pending_opportunities')
        .delete()
        .eq('id', testInsert.id);

      console.log('🧹 Test nettoyé');
    }

  } catch (error) {
    console.error('💥 Erreur générale:', error.message);
  }
}

testPermissions().then(() => {
  console.log('\n🏁 Diagnostic terminé');
}).catch(error => {
  console.error('💥 Erreur fatale:', error);
});