/**
 * Script de migration des opportunités existantes vers pending_opportunities
 * pour qu'elles apparaissent dans l'interface admin
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://bzcmpulivznmzbjggbyh.supabase.co';
const supabaseAnonKey = 'sb_publishable_RvZZojymg2-eFROVdVT2-Q_E4MvbH1v';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function migrateOpportunities() {
  try {
    console.log('🔄 Migration des opportunités vers pending_opportunities...');

    // 1. Récupérer toutes les opportunités existantes
    const { data: opportunities, error: fetchError } = await supabase
      .from('opportunities')
      .select('*');

    if (fetchError) {
      console.error('❌ Erreur récupération opportunities:', fetchError);
      return;
    }

    console.log(`📋 ${opportunities?.length || 0} opportunités trouvées à migrer`);

    if (!opportunities || opportunities.length === 0) {
      console.log('ℹ️ Aucune opportunité à migrer');
      return;
    }

    // 2. Transformer les données pour pending_opportunities
    const pendingOpportunities = opportunities.map(opp => ({
      id: crypto.randomUUID(), // Générer un nouvel UUID
      type: opp.type,
      title: opp.title,
      organization: opp.organization,
      description: opp.description,
      full_content: opp.full_content,
      deadline: opp.deadline,
      location: opp.location,
      image: opp.image,
      link: opp.link,
      contact_email: opp.contact_email,
      apply_method: opp.apply_method,
      reward: opp.reward,
      tags: opp.tags || [],
      salary: opp.salary,
      contract_type: opp.contract_type,
      duration: opp.duration,
      level: opp.level,
      prizes: opp.prizes,
      speakers: opp.speakers,
      schedule: opp.schedule,
      ai_greeting: opp.ai_greeting,

      // Métadonnées pour pending_opportunities
      source_url: opp.link || '',
      ai_confidence: 0.8, // Confiance par défaut pour les données existantes
      ai_processed: true,
      status: 'pending', // Mettre en pending pour validation admin
      admin_notes: null,
      reviewed_by: null,
      reviewed_at: null,
      original_content: `Données migrées depuis opportunities (ID original: ${opp.id})`,
      extracted_data: {
        title: opp.title,
        organization: opp.organization,
        type: opp.type,
        confidence: 0.8,
        original_id: opp.id // Garder une trace de l'ID original
      },

      created_at: opp.created_at || new Date().toISOString(),
      updated_at: new Date().toISOString()
    }));

    console.log('🔄 Insertion dans pending_opportunities...');

    // 3. Insérer dans pending_opportunities
    const { data: insertedData, error: insertError } = await supabase
      .from('pending_opportunities')
      .insert(pendingOpportunities)
      .select();

    if (insertError) {
      console.error('❌ Erreur insertion:', insertError);
      return;
    }

    console.log(`✅ ${insertedData?.length || 0} opportunités migrées avec succès`);

    // 4. Vérification
    const { data: verification, error: verifyError } = await supabase
      .from('pending_opportunities')
      .select('count', { count: 'exact', head: true });

    if (verifyError) {
      console.error('❌ Erreur vérification:', verifyError);
      return;
    }

    console.log(`📊 Total dans pending_opportunities: ${verification || 0}`);

    // 5. Afficher quelques exemples
    const { data: examples, error: exampleError } = await supabase
      .from('pending_opportunities')
      .select('id, title, organization, status, ai_confidence')
      .limit(3);

    if (!exampleError && examples) {
      console.log('\n📄 Exemples migrés:');
      examples.forEach((ex, i) => {
        console.log(`${i + 1}. ${ex.title} - ${ex.organization} (${ex.status}, confiance: ${ex.ai_confidence})`);
      });
    }

    console.log('\n✅ Migration terminée avec succès !');
    console.log('🎯 Les opportunités devraient maintenant apparaître dans l\'interface admin');

  } catch (error) {
    console.error('💥 Erreur générale:', error);
  }
}

migrateOpportunities();