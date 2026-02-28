/**
 * Script pour créer des données de test dans pending_opportunities
 */

import { createClient } from '@supabase/supabase-js';
import { randomUUID } from 'crypto';

const supabaseUrl = 'https://bzcmpulivznmzbjggbyh.supabase.co';
const supabaseAnonKey = 'sb_publishable_RvZZojymg2-eFROVdVT2-Q_E4MvbH1v';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

console.log('🔧 Création de données de test pour pending_opportunities...');

// Données de test réalistes
const testOpportunities = [
  {
    id: randomUUID(),
    type: 'Stage',
    title: 'Stage Développeur Frontend React',
    organization: 'Digital Solutions Bénin',
    description: 'Rejoignez notre équipe pour développer des interfaces utilisateur modernes avec React et TypeScript.',
    full_content: '## Stage Développeur Frontend\n\nNous recherchons un stagiaire motivé pour rejoindre notre équipe de développement...',
    deadline: '2026-03-15',
    location: 'Cotonou, Bénin',
    image: null,
    link: 'https://example.com/stage-react',
    contact_email: 'recrutement@digitalsolutions.bj',
    apply_method: 'email',
    reward: null,
    tags: ['Stage', 'React', 'Frontend', 'JavaScript'],
    salary: null,
    contract_type: null,
    duration: '6 MOIS',
    level: 'Licence 3',
    prizes: null,
    speakers: null,
    schedule: null,
    ai_greeting: 'Découvrez cette opportunité de stage en développement React chez Digital Solutions !',
    source_url: 'https://example.com/stage-react',
    ai_confidence: 0.85,
    ai_processed: true,
    status: 'pending',
    admin_notes: null,
    reviewed_by: null,
    reviewed_at: null,
    original_content: 'Contenu HTML original...',
    extracted_data: {
      title: 'Stage Développeur Frontend React',
      organization: 'Digital Solutions Bénin',
      type: 'Stage',
      confidence: 0.85
    },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: randomUUID(),
    type: 'Bourse',
    title: 'Bourse d\'Excellence en Intelligence Artificielle',
    organization: 'Fondation Tech Afrique',
    description: 'Bourse complète pour étudiants africains souhaitant se spécialiser en IA et Machine Learning.',
    full_content: '## Bourse IA Excellence\n\nLa Fondation Tech Afrique offre une bourse complète...',
    deadline: '2026-04-30',
    location: 'International',
    image: null,
    link: 'https://example.com/bourse-ia',
    contact_email: 'bourses@techafrique.org',
    apply_method: 'link',
    reward: '500.000 FCFA/an + Formation',
    tags: ['Bourse', 'IA', 'Machine Learning', 'International'],
    salary: null,
    contract_type: null,
    duration: null,
    level: 'Master 1',
    prizes: null,
    speakers: null,
    schedule: null,
    ai_greeting: 'Une opportunité unique de bourse en Intelligence Artificielle vous attend !',
    source_url: 'https://example.com/bourse-ia',
    ai_confidence: 0.92,
    ai_processed: true,
    status: 'pending',
    admin_notes: null,
    reviewed_by: null,
    reviewed_at: null,
    original_content: 'Contenu HTML original...',
    extracted_data: {
      title: 'Bourse d\'Excellence en Intelligence Artificielle',
      organization: 'Fondation Tech Afrique',
      type: 'Bourse',
      confidence: 0.92
    },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: randomUUID(),
    type: 'Emploi',
    title: 'Développeur Full-Stack Junior',
    organization: 'StartupLab Cotonou',
    description: 'Poste de développeur full-stack pour startup en croissance. Stack moderne : React, Node.js, PostgreSQL.',
    full_content: '## Développeur Full-Stack\n\nStartupLab recherche un développeur passionné...',
    deadline: '2026-03-20',
    location: 'Cotonou, Bénin',
    image: null,
    link: 'https://example.com/job-fullstack',
    contact_email: 'jobs@startuplab.bj',
    apply_method: 'email',
    reward: null,
    tags: ['Emploi', 'Full-Stack', 'React', 'Node.js'],
    salary: '180.000 FCFA/mois',
    contract_type: 'CDI',
    duration: null,
    level: 'Licence 3',
    prizes: null,
    speakers: null,
    schedule: null,
    ai_greeting: 'Rejoignez StartupLab comme développeur full-stack et participez à l\'innovation !',
    source_url: 'https://example.com/job-fullstack',
    ai_confidence: 0.88,
    ai_processed: true,
    status: 'pending',
    admin_notes: null,
    reviewed_by: null,
    reviewed_at: null,
    original_content: 'Contenu HTML original...',
    extracted_data: {
      title: 'Développeur Full-Stack Junior',
      organization: 'StartupLab Cotonou',
      type: 'Emploi',
      confidence: 0.88
    },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

async function createTestData() {
  try {
    console.log(`📝 Insertion de ${testOpportunities.length} opportunités de test...`);

    const { data, error } = await supabase
      .from('pending_opportunities')
      .insert(testOpportunities)
      .select();

    if (error) {
      console.error('❌ Erreur insertion:', error.message);
      console.error('🔍 Code:', error.code);
      console.error('🔍 Détails:', error.details);
      return;
    }

    console.log(`✅ ${data?.length || 0} opportunités créées avec succès !`);

    // Vérification
    const { data: verification, error: verifyError } = await supabase
      .from('pending_opportunities')
      .select('id, title, organization, status, ai_confidence')
      .order('created_at', { ascending: false });

    if (verifyError) {
      console.error('❌ Erreur vérification:', verifyError.message);
      return;
    }

    console.log('\n📊 Opportunités dans pending_opportunities:');
    verification?.forEach((opp, i) => {
      console.log(`${i + 1}. ${opp.title} - ${opp.organization} (${opp.status}, ${Math.round(opp.ai_confidence * 100)}%)`);
    });

    console.log('\n🎯 L\'interface admin devrait maintenant afficher ces opportunités !');

  } catch (error) {
    console.error('💥 Erreur générale:', error.message);
  }
}

createTestData();