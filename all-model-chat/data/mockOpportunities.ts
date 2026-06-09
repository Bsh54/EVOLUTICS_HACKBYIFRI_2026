import { Opportunity } from '../types/opportunity';

const today = new Date();
const inDays = (n: number) => {
  const d = new Date(today);
  d.setDate(d.getDate() + n);
  return d.toISOString().split('T')[0];
};

export const mockOpportunities: Opportunity[] = [
  {
    id: 'mock-1',
    type: 'Concours',
    title: 'Hackathon IA & Innovation Sociale 2026',
    organization: 'IFRI / Université d\'Abomey-Calavi',
    description: 'Relevez le défi : concevez une solution IA pour résoudre un problème de développement local en 48h.',
    fullContent: `## À propos du Hackathon

Le **Hackathon IA & Innovation Sociale 2026** est la compétition phare organisée par l'IFRI en partenariat avec l'Université d'Abomey-Calavi. Cette édition met le focus sur l'intelligence artificielle au service du développement durable en Afrique.

## Thème
**"L'IA comme levier de transformation sociale"**

## Qui peut participer ?
- Étudiants en informatique, mathématiques, sciences de l'ingénieur
- Équipes de 2 à 4 personnes
- Toute nationalité bienvenue

## Déroulement
- **J1** : Présentation des thèmes, formation des équipes, début du développement
- **J2** : Finalisation des projets, pitches devant le jury
- **Remise des prix** : Cérémonie de clôture

## Critères d'évaluation
- **Innovation** : Originalité de la solution proposée
- **Impact social** : Potentiel de transformation réel
- **Faisabilité technique** : Qualité du prototype
- **Pitch** : Clarté et conviction de la présentation

## Comment postuler ?
Inscris ton équipe via le formulaire en ligne avant la date limite. Un email de confirmation vous sera envoyé sous 48h.`,
    deadline: inDays(21),
    location: 'Cotonou, Bénin',
    image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=2070',
    link: 'https://ifri-uac.bj',
    status: 'Ouvert',
    prizes: '500 000 FCFA + Incubation',
    reward: '500 000 FCFA + Incubation',
    tags: ['IA', 'Innovation', 'Développement', 'Hackathon'],
    aiGreeting: `Bonjour ! 👋\n\nJe suis ton coach dédié pour le **Hackathon IA & Innovation Sociale 2026** organisé par l'IFRI.\n\nJ'ai analysé le règlement, les critères de notation et les thèmes proposés. Voici comment je peux t'aider :\n\n*   💡 **Brainstormer des idées** de projets IA à fort impact social\n*   🚀 **Structurer ton pitch** pour convaincre le jury en 5 minutes\n*   📋 **Planifier ta roadmap** technique sur 48h\n*   ⚖️ **Analyser les critères** de notation pour maximiser ton score\n\nPar où veux-tu commencer ?`,
  },
  {
    id: 'mock-2',
    type: 'Bourse',
    title: 'Bourse d\'Excellence Master 2026 — Afrique Francophone',
    organization: 'Fondation Orange Digital Center',
    description: 'Financement intégral pour un Master en Informatique, Data Science ou Télécommunications dans une université partenaire.',
    fullContent: `## Présentation de la Bourse

La **Fondation Orange Digital Center** offre chaque année des bourses d'excellence destinées aux meilleurs étudiants africains francophones souhaitant poursuivre un Master dans les filières numériques.

## Domaines couverts
- **Informatique & Génie Logiciel**
- **Data Science & Intelligence Artificielle**
- **Cybersécurité**
- **Télécommunications & Réseaux**

## Ce que couvre la bourse
- Frais de scolarité intégraux (jusqu'à 15 000 €/an)
- Billet d'avion aller-retour
- Allocation mensuelle de 800 €
- Assurance santé internationale
- Accès au réseau alumni Orange

## Conditions d'éligibilité
- Nationalité d'un pays d'Afrique francophone subsaharienne
- Licence (Bac+3) obtenue avec mention **Bien ou Très Bien**
- Âge maximum : 28 ans à la date de candidature
- Maîtrise du français (niveau C1 minimum)
- Pas d'autres bourses en cours

## Dossier de candidature
- Relevés de notes des 3 dernières années
- Lettre de motivation (2 pages max)
- Deux lettres de recommandation académiques
- CV détaillé
- Projet d'étude et plan de retour au pays`,
    deadline: inDays(35),
    location: 'Europe / Afrique (mobilité internationale)',
    image: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=2070',
    link: 'https://orange.com/fr/fondation',
    status: 'Ouvert',
    reward: '15 000 €/an + allocation',
    tags: ['Bourse', 'Master', 'Numérique', 'International'],
  },
  {
    id: 'mock-3',
    type: 'Stage',
    title: 'Stage Développeur Full-Stack (React / Node.js)',
    organization: 'Tech4Africa — Cotonou',
    description: 'Rejoins notre équipe produit pour développer des fonctionnalités sur notre plateforme de e-commerce destinée aux PME africaines.',
    fullContent: `## À propos de Tech4Africa

**Tech4Africa** est une startup béninoise en forte croissance qui développe des solutions digitales pour accompagner la transformation numérique des PME en Afrique de l'Ouest. Notre plateforme compte aujourd'hui plus de 2 000 marchands actifs.

## Missions du stage

En tant que **Développeur Full-Stack stagiaire**, tu seras intégré(e) directement dans l'équipe produit de 6 développeurs. Tu travailleras sur :

- Développement de nouvelles fonctionnalités (frontend React + backend Node.js)
- Optimisation des performances et de l'expérience utilisateur
- Participation aux code reviews et aux sprints Agile
- Rédaction de documentation technique
- Intégration d'APIs tierces (paiement mobile money, SMS)

## Profil recherché
- Étudiant(e) en Bac+3 minimum (Licence Informatique, IUT, École d'Ingénieur)
- Bonne maîtrise de **React.js** et **Node.js/Express**
- Connaissance de Git et des bases de données (PostgreSQL ou MongoDB)
- Esprit d'équipe, curiosité et autonomie
- La connaissance de TypeScript est un plus

## Conditions
- **Durée** : 3 à 6 mois
- **Gratification** : 80 000 à 120 000 FCFA/mois selon profil
- **Lieu** : Cotonou (présentiel) avec flexibilité remote 2j/semaine
- **Début** : Dès que possible`,
    deadline: inDays(14),
    location: 'Cotonou, Bénin',
    image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=2070',
    contactEmail: 'careers@tech4africa.bj',
    status: 'Ouvert',
    duration: '3 à 6 mois',
    level: 'Bac+3 minimum',
    tags: ['React', 'Node.js', 'Full-Stack', 'Startup'],
  },
  {
    id: 'mock-4',
    type: 'Emploi',
    title: 'Data Analyst — Business Intelligence',
    organization: 'BCEAO — Banque Centrale des États de l\'Afrique de l\'Ouest',
    description: 'Analyse des données économiques et financières de la zone UEMOA. Poste en CDI à Dakar, ouvert aux profils juniors.',
    fullContent: `## Le poste

La **BCEAO** recrute un(e) **Data Analyst** pour renforcer son département de Business Intelligence. Vous serez chargé(e) d'analyser les flux de données économiques et financières des 8 pays membres de l'UEMOA.

## Responsabilités principales
- Collecte, nettoyage et structuration des données économiques
- Création de tableaux de bord et rapports interactifs (Power BI / Tableau)
- Développement de modèles prédictifs pour l'analyse conjoncturelle
- Collaboration avec les équipes des statistiques nationales
- Présentation des résultats aux décideurs

## Compétences requises
- **Formation** : Bac+4/5 en Statistiques, Économétrie, Data Science ou équivalent
- **Technique** : Maîtrise de SQL, Python (pandas, scikit-learn) ou R
- **Visualisation** : Power BI, Tableau ou similaire
- **Langues** : Français courant, anglais professionnel apprécié
- **Expérience** : 0 à 2 ans (profil junior accepté)

## Ce que nous offrons
- CDI avec période d'essai de 6 mois
- Salaire compétitif selon grille BCEAO
- Formation continue et certifications prises en charge
- Couverture santé étendue pour le salarié et sa famille
- Cadre de travail international et stimulant`,
    deadline: inDays(28),
    location: 'Dakar, Sénégal',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2015',
    link: 'https://bceao.int/recrutement',
    status: 'Ouvert',
    salary: 'Grille BCEAO',
    contractType: 'CDI',
    tags: ['Data', 'Finance', 'UEMOA', 'Junior'],
  },
  {
    id: 'mock-5',
    type: 'Conférences',
    title: 'AfricaTech Summit 2026 — IA & Souveraineté Numérique',
    organization: 'AfricaTech Foundation',
    description: 'Le rendez-vous annuel incontournable des acteurs du numérique africain. 2 jours de conférences, workshops et networking.',
    fullContent: `## AfricaTech Summit 2026

L'**AfricaTech Summit** est le sommet technologique annuel dédié à l'innovation numérique en Afrique. Cette 5ème édition explore le thème central : **"IA & Souveraineté Numérique : Construire l'Afrique de Demain"**.

## Programme (aperçu)

### Jour 1 — L'IA en contexte africain
- **09:00** : Keynote d'ouverture — "Pourquoi l'Afrique doit écrire ses propres algorithmes"
- **10:30** : Panel — "Données locales, modèles locaux : le défi de la souveraineté IA"
- **14:00** : Workshop — Développer avec les LLMs open-source (Llama, Mistral)
- **16:00** : Startup Pitch — 10 startups IA sélectionnées pitchent devant des investisseurs

### Jour 2 — Financement & Écosystème
- **09:00** : "Comment lever des fonds pour sa startup tech en Afrique"
- **11:00** : Table ronde — "Éducation numérique et formation aux métiers de l'IA"
- **15:00** : Networking session & Demo Day
- **17:00** : Cérémonie de clôture et remise des prix Innovation

## Intervenants confirmés
- CTO de MTN Digital, CEO de Wave Africa, chercheurs de l'AIMS et du LISN (Paris-Saclay)

## Inscription
Gratuite pour les étudiants sur présentation de la carte universitaire. Places limitées.`,
    deadline: inDays(10),
    location: 'Abidjan, Côte d\'Ivoire',
    image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=2070',
    link: 'https://africatech-summit.org',
    status: 'Ouvert',
    schedule: '09:00',
    speakers: 'MTN Digital CTO, Wave Africa CEO, AIMS',
    tags: ['IA', 'Tech', 'Networking', 'Startup'],
  },
  {
    id: 'mock-6',
    type: 'Bourse',
    title: 'Programme STEM Women Africa — Bourse Doctorat',
    organization: 'UNESCO & Académie des Sciences d\'Afrique',
    description: 'Programme de soutien aux femmes africaines souhaitant poursuivre un doctorat en STEM. 12 bourses disponibles pour 2026.',
    fullContent: `## À propos du Programme

Le programme **STEM Women Africa** est une initiative conjointe de l'UNESCO et de l'Académie des Sciences d'Afrique visant à augmenter la représentation des femmes dans les sciences, technologies, ingénierie et mathématiques sur le continent.

## Disciplines éligibles
- Mathématiques et Informatique
- Physique et Chimie
- Biologie, Biotechnologie et Sciences de la Vie
- Ingénierie (toutes branches)
- Sciences de l'Environnement et Changement Climatique

## Avantages de la bourse
- Financement intégral des frais de thèse (3 ans)
- Allocation mensuelle de 1 200 USD
- Budget de mobilité internationale (conférences, laboratoires partenaires)
- Mentorat par une chercheuse senior du réseau UNESCO
- Accès à la bibliothèque numérique mondiale de l'UNESCO

## Critères d'éligibilité
- **Genre** : Femmes uniquement
- **Nationalité** : Ressortissante d'un pays africain
- **Diplôme** : Master (Bac+5) obtenu avec mention
- **Projet** : Avoir un projet de recherche défini et un directeur de thèse pressenti
- **Engagement** : Engagement à exercer en Afrique après la thèse

## Constitution du dossier
1. Formulaire de candidature en ligne
2. Projet de recherche (10 pages max)
3. Lettre d'engagement du directeur de thèse pressenti
4. Relevés de notes Master complets
5. Deux lettres de recommandation (dont une internationale)
6. Lettre de motivation personnelle`,
    deadline: inDays(45),
    location: 'Afrique (mobilité internationale)',
    image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=2070',
    link: 'https://unesco.org/stem-women-africa',
    status: 'Ouvert',
    reward: '1 200 USD/mois + frais de thèse',
    tags: ['Femmes', 'STEM', 'Doctorat', 'UNESCO'],
  },
  {
    id: 'mock-7',
    type: 'Stage',
    title: 'Stage Marketing Digital & Growth Hacking',
    organization: 'Jumia Bénin',
    description: 'Intègre l\'équipe Growth de Jumia pour piloter des campagnes d\'acquisition et analyser les performances marketing.',
    fullContent: `## Présentation

**Jumia** est la première plateforme de e-commerce en Afrique, présente dans 11 pays. Notre équipe Bénin recrute un(e) stagiaire passionné(e) par le marketing digital pour contribuer à notre stratégie de croissance.

## Tes missions
- Gestion et optimisation des campagnes Google Ads et Meta Ads
- Analyse des KPIs marketing (CAC, LTV, ROAS, taux de conversion)
- A/B testing sur les pages produits et les emailings
- Rédaction de contenus pour les réseaux sociaux
- Veille concurrentielle et tendances e-commerce Afrique

## Profil idéal
- Étudiant(e) en Marketing Digital, Communication, Business ou Commerce
- Curiosité pour les données et à l'aise avec les tableurs (Excel/Sheets)
- Connaissance des outils : Google Analytics, Meta Business Suite
- Créatif(ve), rigoureux(se) et orienté résultats
- La connaissance de SQL ou Python est un vrai plus

## Conditions du stage
- **Durée** : 4 à 6 mois
- **Gratification** : 70 000 FCFA/mois
- **Lieu** : Cotonou, siège Jumia Bénin
- **Avantages** : Accès aux formations Jumia Academy, réductions employé`,
    deadline: inDays(7),
    location: 'Cotonou, Bénin',
    image: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?q=80&w=2074',
    contactEmail: 'stage.benin@jumia.com',
    status: 'Bientôt fini',
    duration: '4 à 6 mois',
    level: 'Bac+2 minimum',
    tags: ['Marketing', 'E-commerce', 'Growth', 'Digital'],
  },
  {
    id: 'mock-8',
    type: 'Emploi',
    title: 'Ingénieur Cybersécurité — SOC Analyst (N1/N2)',
    organization: 'Ecobank Group — Direction Digitale',
    description: 'Rejoignez le Security Operations Center d\'Ecobank pour surveiller, détecter et répondre aux incidents de sécurité sur l\'ensemble du groupe.',
    fullContent: `## Le Groupe Ecobank

**Ecobank** est la banque panafricaine indépendante de référence, présente dans 33 pays africains. Notre Direction Digitale basée à Lomé recrute un(e) **Ingénieur Cybersécurité SOC** pour renforcer notre capacité de détection et réponse aux incidents.

## Vos missions au SOC

- **Surveillance continue** : Monitoring des alertes SIEM (Splunk/QRadar) 24/7
- **Analyse** : Qualification et investigation des incidents de sécurité (N1 → N2)
- **Réponse** : Confinement, éradication et remédiation des incidents
- **Threat Intelligence** : Veille sur les menaces ciblant le secteur bancaire africain
- **Reporting** : Rédaction des rapports d'incidents et indicateurs de sécurité

## Compétences requises
- **Formation** : Bac+4/5 en Cybersécurité, Réseaux ou Informatique
- **Certifications** : CompTIA Security+, CEH ou équivalent (appréciée)
- **Technique** : Maîtrise des outils SIEM, IDS/IPS, EDR
- **Protocoles** : TCP/IP, DNS, HTTP/S, Active Directory
- **Expérience** : 1 à 3 ans en SOC ou sécurité opérationnelle

## Package proposé
- CDI avec statut cadre
- Rémunération attractive selon profil (+ variable)
- Formations certifiantes annuelles (SANS, EC-Council)
- Mobilité panafricaine possible après 2 ans`,
    deadline: inDays(18),
    location: 'Lomé, Togo (Groupe panafricain)',
    image: 'https://images.unsplash.com/photo-1563986768494-4dee2763ff3f?q=80&w=2070',
    link: 'https://ecobank.com/careers',
    status: 'Ouvert',
    salary: 'Selon profil',
    contractType: 'CDI Cadre',
    tags: ['Cybersécurité', 'SOC', 'Banque', 'Panafricain'],
  },
];
