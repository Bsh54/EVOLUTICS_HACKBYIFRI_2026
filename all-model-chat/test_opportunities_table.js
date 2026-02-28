/**
 * Test pour vérifier les données dans la table opportunities
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://bzcmpulivznmzbjggbyh.supabase.co';
const supabaseAnonKey = 'sb_publishable_RvZZojymg2-eFROVdVT2-Q_E4MvbH1v';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkOpportunitiesTable() {
  try {
    console.log('🔍 Vérification de la table opportunities...');

    // Test de la table opportunities
    const { data: opportunities, error } = await supabase
      .from('opportunities')
      .select('*')
      .limit(10);

    if (error) {
      console.error('❌ Erreur table opportunities:', error);
      return;
    }

    console.log('✅ Table opportunities accessible');
    console.log('📋 Opportunités trouvées:', opportunities?.length || 0);

    if (opportunities && opportunities.length > 0) {
      console.log('\n📄 Exemples d\'opportunités:');
      opportunities.slice(0, 3).forEach((opp, i) => {
        console.log(`${i + 1}. ${opp.title} - ${opp.organization} (${opp.type})`);
      });

      console.log('\n📊 Structure de la première opportunité:');
      const first = opportunities[0];
      Object.keys(first).forEach(key => {
        console.log(`  - ${key}: ${typeof first[key]}`);
      });
    }

    // Vérifier les tables disponibles
    console.log('\n🗂️ Test des tables disponibles...');

    const tables = ['opportunities', 'pending_opportunities', 'users', 'profiles'];

    for (const table of tables) {
      try {
        const { data, error } = await supabase
          .from(table)
          .select('count', { count: 'exact', head: true });

        if (error) {
          console.log(`❌ ${table}: ${error.message}`);
        } else {
          console.log(`✅ ${table}: accessible`);
        }
      } catch (e) {
        console.log(`❌ ${table}: ${e.message}`);
      }
    }

  } catch (error) {
    console.error('💥 Erreur générale:', error);
  }
}

checkOpportunitiesTable();