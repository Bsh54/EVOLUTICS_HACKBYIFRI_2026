/**
 * Script pour créer des données de test avec la clé de service Supabase
 * Cette clé contourne les politiques RLS
 */

import { createClient } from '@supabase/supabase-js';
import { randomUUID } from 'crypto';

const supabaseUrl = 'https://bzcmpulivznmzbjggbyh.supabase.co';
// Clé de service - contourne RLS
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ6Y21wdWxpdnpubXpiamdnYnloIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTIyODk3NSwiZXhwIjoyMDg2ODA0OTc1fQ.JqXTPVBvlDRPVnIuyU2xo7IDQAKtPLgm8BJpbsWOOQY';

console.log('🔧 Création de données de test avec clé de service...');

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Données de test réalistes pour l'interface admin
const testOpportunities = [
  {
    id: randomUUID(),
    type: 'Stage',
    title: 'Stage Développeur Frontend React',
    organization: 'Digital Solutions Bénin',
    description: 'Rejoignez notre équipe pour développer des interfaces utilisateur modernes avec React et TypeScript.',
    full_content: '## Stage Développeur Frontend React\n\n**Entreprise:** Digital Solutions Bénin\n**Durée:** 6 mois\n**Lieu:** Cotonou, Bénin\n\n### Description du poste\nNous recherchons un stagiaire motivé pour rejoindre notre équipe de développement frontend. Vous travaillerez sur des projets clients variés en utilisant les technologies modernes.\n\n### Compétences requises\n- React.js et TypeScript\n- HTML5, CSS3, JavaScript ES6+\n- Git et méthodologies agiles\n- Bon niveau en français et anglais\n\n### Ce que nous offrons\n- Encadrement par des développeurs seniors\n- Formation aux bonnes pratiques\n- Possibilité d\'embauche à l\'issue du stage\n- Environnement de travail moderne',
    deadline: '2026-03-15',
    location: 'Cotonou, Bénin',
    image: null,
    link: 'https://digitalsolutions.bj/careers/stage-frontend',
    contact_email: 'recrutement@digitalsolutions.bj',
    apply_method: 'email',
    reward: null,
    tags: ['Stage', 'React', 'Frontend', 'JavaScript', 'TypeScript'],
    salary: null,
    contract_type: null,
    duration: '6 MOIS',
    level: 'Licence 3',
    prizes: null,
    speakers: null,
    schedule: null,
    ai_greeting: 'Découvrez cette opportunité de stage en développement React chez Digital Solutions ! Une excellente occasion de développer vos compétences frontend dans un environnement professionnel.',
    source_url: 'https://digitalsolutions.bj/careers/stage-frontend',
    ai_confidence: 0.85,
    ai_processed: true,
    status: 'pending',
    admin_notes: null,
    reviewed_by: null,
    reviewed_at: null,
    original_content: 'Contenu HTML original de la page web...',
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
    full_content: '## Bourse d\'Excellence en Intelligence Artificielle\n\n**Organisme:** Fondation Tech Afrique\n**Montant:** 500.000 FCFA/an + Formation\n**Durée:** 2 ans\n\n### Objectifs\nCette bourse vise à former la prochaine génération d\'experts en IA en Afrique. Les bénéficiaires auront accès à:\n\n- Formation complète en Machine Learning\n- Mentorat par des experts internationaux\n- Accès aux ressources de calcul haute performance\n- Participation à des conférences internationales\n\n### Critères d\'éligibilité\n- Être étudiant africain en Master 1 ou 2\n- Spécialisation en informatique, mathématiques ou ingénierie\n- Excellent dossier académique (moyenne ≥ 14/20)\n- Projet de recherche en IA\n\n### Dossier de candidature\n- CV détaillé\n- Relevés de notes\n- Lettre de motivation\n- Projet de recherche (5 pages max)',
    deadline: '2026-04-30',
    location: 'International',
    image: null,
    link: 'https://techafrique.org/bourses/ia-excellence',
    contact_email: 'bourses@techafrique.org',
    apply_method: 'link',
    reward: '500.000 FCFA/an + Formation complète',
    tags: ['Bourse', 'IA', 'Machine Learning', 'International', 'Recherche'],
    salary: null,
    contract_type: null,
    duration: null,
    level: 'Master 1',
    prizes: null,
    speakers: null,
    schedule: null,
    ai_greeting: 'Une opportunité unique de bourse en Intelligence Artificielle vous attend ! Développez votre expertise en IA avec le soutien de la Fondation Tech Afrique.',
    source_url: 'https://techafrique.org/bourses/ia-excellence',
    ai_confidence: 0.92,
    ai_processed: true,
    status: 'pending',
    admin_notes: null,
    reviewed_by: null,
    reviewed_at: null,
    original_content: 'Contenu HTML original de la page web...',
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
    full_content: '## Développeur Full-Stack Junior\n\n**Entreprise:** StartupLab Cotonou\n**Type:** CDI\n**Salaire:** 180.000 FCFA/mois\n**Lieu:** Cotonou, Bénin\n\n### À propos de StartupLab\nStartupLab est une startup en forte croissance spécialisée dans les solutions digitales pour les PME africaines. Nous développons des outils SaaS innovants.\n\n### Le poste\nNous recherchons un développeur full-stack passionné pour rejoindre notre équipe technique. Vous participerez au développement de nos produits phares.\n\n### Stack technique\n- **Frontend:** React.js, TypeScript, Tailwind CSS\n- **Backend:** Node.js, Express, PostgreSQL\n- **DevOps:** Docker, AWS, CI/CD\n- **Outils:** Git, Jira, Slack\n\n### Responsabilités\n- Développement de nouvelles fonctionnalités\n- Maintenance et optimisation du code existant\n- Participation aux décisions techniques\n- Collaboration avec l\'équipe produit\n\n### Profil recherché\n- Licence 3 en informatique minimum\n- 1-2 ans d\'expérience en développement web\n- Maîtrise de JavaScript/TypeScript\n- Connaissance des bases de données relationnelles\n- Esprit d\'équipe et autonomie',
    deadline: '2026-03-20',
    location: 'Cotonou, Bénin',
    image: null,
    link: 'https://startuplab.bj/careers/fullstack-junior',
    contact_email: 'jobs@startuplab.bj',
    apply_method: 'email',
    reward: null,
    tags: ['Emploi', 'Full-Stack', 'React', 'Node.js', 'CDI'],
    salary: '180.000 FCFA/mois',
    contract_type: 'CDI',
    duration: null,
    level: 'Licence 3',
    prizes: null,
    speakers: null,
    schedule: null,
    ai_greeting: 'Rejoignez StartupLab comme développeur full-stack et participez à l\'innovation technologique en Afrique ! Une opportunité de croissance dans une startup dynamique.',
    source_url: 'https://startuplab.bj/careers/fullstack-junior',
    ai_confidence: 0.88,
    ai_processed: true,
    status: 'pending',
    admin_notes: null,
    reviewed_by: null,
    reviewed_at: null,
    original_content: 'Contenu HTML original de la page web...',
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

async function createTestDataWithServiceKey() {
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

    // Vérification avec la clé anonyme (comme l'interface admin)
    console.log('\n🔍 Vérification avec clé anonyme (simulation interface admin)...');

    const supabaseAnon = createClient(supabaseUrl, 'sb_publishable_RvZZojymg2-eFROVdVT2-Q_E4MvbH1v');

    const { data: verification, error: verifyError } = await supabaseAnon
      .from('pending_opportunities')
      .select('id, title, organization, status, ai_confidence, created_at')
      .order('created_at', { ascending: false });

    if (verifyError) {
      console.error('❌ Erreur lecture avec clé anonyme:', verifyError.message);
      console.log('🚨 L\'interface admin ne pourra pas lire les données !');
      return;
    }

    console.log('✅ Lecture réussie avec clé anonyme');
    console.log(`📊 ${verification?.length || 0} opportunités visibles pour l'interface admin:`);

    verification?.forEach((opp, i) => {
      const confidence = Math.round(opp.ai_confidence * 100);
      console.log(`${i + 1}. ${opp.title} - ${opp.organization} (${opp.status}, ${confidence}%)`);
    });

    console.log('\n🎯 SUCCÈS ! L\'interface admin devrait maintenant afficher ces opportunités !');
    console.log('💡 Testez sur: http://localhost:5173/admin-portal');
    console.log('🔑 Mot de passe admin: admin2026');

  } catch (error) {
    console.error('💥 Erreur générale:', error.message);
  }
}

createTestDataWithServiceKey();