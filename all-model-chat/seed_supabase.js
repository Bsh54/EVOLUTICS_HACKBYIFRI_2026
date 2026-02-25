
import { createClient } from '@supabase/supabase-js';

// Charger les variables d'environnement si on exécute en local avec Node
// Note: Dans un contexte Vite, on utiliserait import.meta.env, mais ici c'est un script standalone
const supabaseUrl = "https://bzcmpulivznmzbjggbyh.supabase.co";
// REMPLACEZ CECI PAR VOTRE VRAIE CLÉ "ANON" (publique) QUI COMMENCE PAR "ey..."
const supabaseKey = "sb_publishable_RvZZojymg2-eFROVdVT2-Q_E4MvbH1v";

const supabase = createClient(supabaseUrl, supabaseKey);

const TEST_DATA = [
  {
    id: 'opp-seed-1',
    type: 'Stage',
    title: 'Développeur React Junior',
    organization: 'Tech Bénin',
    description: 'Stage de pré-embauche pour développer des interfaces modernes.',
    full_content: '# Stage Développeur React\n\nNous cherchons un passionné pour rejoindre notre équipe.\n\n**Missions:**\n- Création de composants.\n- Intégration de maquettes Figma.\n\n**Stack:** React, Tailwind, Supabase.',
    deadline: '2026-04-01',
    location: 'Cotonou, Bénin',
    image: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=1000',
    link: 'https://tech.bj/jobs',
    status: 'Ouvert',
    reward: '150.000 FCFA / mois',
    tags: ['React', 'Frontend', 'Stage'],
    duration: '6 MOIS',
    level: 'Licence 3',
    ai_greeting: 'Salut ! 👋\n\nPrêt à coder en React chez Tech Bénin ? 🚀\n\nJe peux t\'aider à :\n* 🎨 Mettre en avant tes projets GitHub.\n* 📝 Rédiger une lettre de motivation punchy.\n* ❓ Préparer les questions techniques sur les Hooks.'
  },
  {
    id: 'opp-seed-2',
    type: 'Bourse',
    title: 'Bourse d\'Excellence Numérique',
    organization: 'Fondation Moov',
    description: 'Financement complet de votre Master en Data Science.',
    full_content: '# Bourse Moov Africa\n\nLa fondation soutient les meilleurs talents.\n\n**Avantages:**\n- Frais de scolarité (100%)\n- Ordinateur portable offert.\n\n**Conditions:**\n- Avoir plus de 16/20 de moyenne.',
    deadline: '2026-05-20',
    location: 'Bénin',
    image: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=1000',
    link: 'https://moov-africa.bj/foundation',
    status: 'Ouvert',
    reward: '2.000.000 FCFA',
    tags: ['Data Science', 'Excellence', 'Finance'],
    ai_greeting: 'Bonjour ! 👋\n\nCette bourse Moov est une opportunité en or ! 💎\n\nTravaillons sur ton dossier :\n* 📊 Mettre en valeur tes relevés de notes.\n* ✍️ Rédiger ton projet professionnel.\n* 🎯 Préparer l\'entretien de motivation.'
  }
];

async function seed() {
  console.log("Début de l'injection des données...");

  const { error } = await supabase
    .from('opportunities')
    .upsert(TEST_DATA);

  if (error) {
    console.error("Erreur lors de l'injection:", error);
  } else {
    console.log("Succès ! Données de test injectées.");
  }
}

seed();
