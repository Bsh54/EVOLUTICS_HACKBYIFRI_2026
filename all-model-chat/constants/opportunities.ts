import { Opportunity } from '../types/opportunity';

export const OPPORTUNITIES_DATA: Opportunity[] = [
  {
    id: 'opp-benin-1',
    type: 'Emploi',
    title: 'Ingénieur DevOps Junior',
    organization: 'Isocel Bénin',
    description: 'Participez à la maintenance et à l\'évolution des infrastructures réseau du premier fournisseur internet au Bénin.',
    fullContent: 'Isocel recrute un profil passionné par les infrastructures et l\'automatisation.\n\n**Missions :**\n- Administration de serveurs Linux.\n- Monitoring des services critiques.\n- Automatisation des déploiements.\n\n**Profil :**\n- Bac+3/5 en Informatique (IFRI, Epitech, UAC).\n- Connaissances en Docker et scripting Bash/Python.\n- Rigueur et réactivité.',
    deadline: '2026-03-25',
    location: 'Cotonou, Bénin',
    image: 'https://images.unsplash.com/photo-1614064641938-3bbee52942c7?auto=format&fit=crop&q=80&w=1200',
    link: 'https://isocel.bj/recrutement',
    status: 'Ouvert',
    reward: 'CDI + Avantages',
    salary: '300.000 FCFA',
    contractType: 'CDI'
  },
  {
    id: 'opp-benin-2',
    type: 'Stage',
    title: 'Stage Développeur Mobile Flutter',
    organization: 'Gozem Bénin',
    description: 'Intégrez la "Super App" africaine pour un stage pratique sur des fonctionnalités réelles utilisées par des milliers de personnes.',
    fullContent: 'Gozem ouvre ses portes aux stagiaires motivés pour sa branche tech à Cotonou.\n\n**Missions :**\n- Développement de nouveaux modules sur l\'application chauffeur.\n- Correction de bugs et optimisation de performance.\n- Tests unitaires et intégration continue.\n\n**Profil :**\n- Étudiant en Licence ou Master (GL).\n- Portfolio avec au moins un projet Flutter.\n- Esprit startup.',
    deadline: '2026-03-15',
    location: 'Cotonou, Fidjrossè',
    image: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&q=80&w=1200',
    link: 'https://gozem.co/careers',
    status: 'Bientôt fini',
    reward: 'Stage rémunéré',
    duration: '3 MOIS'
  },
  {
    id: 'opp-benin-3',
    type: 'Bourse',
    title: 'Bourse d\'Excellence "Femmes en Tech"',
    organization: 'Sèmè City',
    description: 'Une bourse dédiée aux étudiantes béninoises pour encourager la parité dans les métiers du numérique.',
    fullContent: 'Sèmè City soutient les parcours féminins dans les filières technologiques.\n\n**Critères d\'éligibilité :**\n- Être de nationalité béninoise.\n- Être inscrite en filière tech (IA, Sécurité, GL).\n- Excellents résultats académiques.\n\n**Avantages :**\n- Prise en charge des frais de scolarité.\n- Allocation mensuelle d\'équipement.',
    deadline: '2026-05-30',
    location: 'Bénin',
    image: 'https://images.unsplash.com/photo-1573164773714-d97e4466fbda?auto=format&fit=crop&q=80&w=1200',
    link: 'https://semecity.bj/bourses',
    status: 'Ouvert',
    reward: '500.000 FCFA'
  },
  {
    id: 'opp-benin-4',
    type: 'Concours',
    title: 'Capture The Flag (CTF) - JEI 2026',
    organization: 'Association des Étudiants de l\'IFRI',
    description: 'Compétition de cybersécurité durant la Journée de l\'Étudiant Informaticien.',
    fullContent: 'Prêt à tester vos compétences en hacking éthique ? Le CTF de la JEI revient avec des challenges inédits.\n\n**Catégories :**\n- Web exploitation.\n- Reverse Engineering.\n- Cryptographie.\n- Forensics.\n\n**Prix :**\n- Cash prizes, abonnements TryHackMe et goodies.',
    deadline: '2026-03-01',
    location: 'IFRI (Amphi I)',
    image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=1200',
    link: 'https://jei-ifri.bj/ctf',
    status: 'Ouvert',
    reward: '75.000 FCFA + Lot technique',
    prizes: '75.000 FCFA'
  },
  {
    id: 'opp-benin-5',
    type: 'Conférences',
    title: 'Sommet de l\'Intelligence Artificielle au Bénin',
    organization: 'Fondation Odon Vallet',
    description: 'Une journée de conférences avec des experts mondiaux pour discuter du futur de l\'IA en Afrique de l\'Ouest.',
    fullContent: 'Le Sommet IA Bénin est le point de rencontre entre académie et industrie.\n\n**Points forts :**\n- Keynote sur les LLM et langues locales.\n- Panel sur l\'éthique de l\'IA.\n- Atelier pratique sur la data science.\n\n**Cible :** Étudiants, chercheurs et entrepreneurs.',
    deadline: '2026-04-20',
    location: 'Palais des Congrès, Cotonou',
    image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&q=80&w=1200',
    link: 'https://ai-summit.bj',
    status: 'Ouvert',
    reward: 'Certificat de participation',
    schedule: '09:00 - 18:00'
  }
];
