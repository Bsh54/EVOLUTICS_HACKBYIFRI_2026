# CAHIER DES CHARGES - PROJET EVOLUTICS

## 1. Présentation de l'équipe

**Nom de l'équipe :** EVOLUTICS

**Membre 1 (Chef de groupe) :**
- **Nom :** BESSANH
- **Prénom(s) :** Shadrak
- **Ecole :** IFRI
- **Filière :** SEIOT ( Systèmes Embarqués et Internet des Objets )
- **Année :** Licence 2 
- **Email :** shadrakbsh@gmail.com

**Membre 2 :**
- **Nom :** BOUKARI
- **Prénom(s) :** Marlyse
- **Ecole :** IFRI
- **Filière :** SI (Sécurité Informatique)
- **Année :** Licence 2
- **Email :** marlyseboukari@gmail.com

**Membre 3 :**
- **Nom :** AGUIDI
- **Prénom(s) :** Othniel
- **Ecole :** IFRI
- **Filière :** IA  (Intelligence Artificielle)
- **Année :** Licence 2
- **Email :** aguidiothiniel17@gmail.com

---


## 2. Problèmes identifiés

### Le problème principal
L'incapacité des étudiants à s'insérer efficacement dans le monde professionnel, causée par une difficulté à trouver des opportunités (stages, emplois) centralisées et adaptées à leur profil, ainsi qu'un manque de préparation pratique (rédaction de CV, lettres de motivation, entraînement aux entretiens ... ).

### Le contexte du problème
Dans un marché de l'emploi de plus en plus compétitif, le parcours académique seul ne suffit plus. Les étudiants se perdent dans une multitude de plateformes d'offres non ciblées et n'ont souvent pas les ressources nécessaires pour se préparer aux exigences spécifiques des recruteurs modernes.

### Catégorie d’étudiants touchée
- Les étudiants en fin de cycle (Licence, Master) en recherche de stage de fin d'études ou de premier emploi.
- Les étudiants à la recherche  d'opportunités de bourses et concours.

---

## 3. Description de la solution

**Nom de la solution :** EVOLUTICS

### Description claire et concise
EVOLUTICS est une plateforme  qui connecte directement les étudiants aux opportunités professionnelles pertinentes, tout en intégrant un Coach Carrière basé sur l'IA pour les accompagner de A à Z dans leur processus de candidature.

### Comment votre solution répond au problème identifié
1. **Centralisation :** Fini la recherche sur des dizaines de sites. EVOLUTICS rassemble et filtre les offres  adaptées au profil de l'étudiant.
2. **Préparation active :** L'Assistant IA ne se contente pas de répondre à des questions. Il aide concrètement l'étudiant à adapter son CV à une offre précise, rédige des trames de lettres de motivation, et simule des entretiens d'embauche interactifs.

### Valeur ajoutée par rapport aux solutions existantes
Contrairement aux job-boards classiques (LinkedIn) qui sont passifs, EVOLUTICS est **proactif**. L'intégration d'une IA conversationnelle  transforme la plateforme en un véritable mentor personnel disponible 24/7, spécifiquement calibré pour les besoins des étudiants.

---

## 4. Exigences fonctionnelles

1. **Gestion des Utilisateurs :**
   - Création de compte et système d'authentification sécurisé (Email/Mot de passe et Google OAuth).
   - Profil étudiant riche (parcours académique, compétences, préférences).

2. **Hub d'Opportunités :**
   - Affichage dynamique des opportunités (Emplois, Stages, Bourses, Concours).
   - Système de filtrage et recherche sémantique.

3. **Assistant Carrière Intelligent (IA) :**
   - Chat interactif basé sur Gemini 2.5 Flash.
   - Génération de documents de candidature (CV, Lettre de motivation) au format Markdown ou HTML visuel.
   - Simulation d'entretiens techniques et RH.


4. **Interface et Expérience Utilisateur (UI/UX) :**
   - Interface "Glassmorphism" moderne, responsive (Mobile-first).
   - Thèmes personnalisables (Onyx sombre, Pearl clair).


---

## 5. Technologies utilisées

### Langages de programmation
- **TypeScript :** Pour un code robuste, typé statiquement, réduisant les erreurs d'exécution et facilitant la maintenance en équipe.
- **CSS / HTML :** Structuration et style de base.

### Frameworks et Bibliothèques
- **React 18 :** Framework frontend principal, choisi pour sa composabilité, sa réactivité et son écosystème riche.
- **Vite :** Outil de build ultra-rapide pour une expérience de développement optimale.
- **Tailwind CSS :** Framework utilitaire pour concevoir une interface moderne (Glassmorphism) rapidement et de manière responsive.
- **Lucide React :** Pour des icônes légères et modernes.

### Base de données et Backend
- **Supabase :** Utilisé comme Backend-as-a-Service (BaaS). Choisi pour sa base de données PostgreSQL puissante, son système d'authentification clé en main, et sa facilité d'intégration avec React.

### Outils IA
- **Google Gemini API (gemini-2.5-flash) :** Choisi pour sa rapidité d'exécution, sa fenêtre de contexte large (parfait pour analyser de longs textes d'offres), et sa capacité à générer des formats structurés (Markdown, HTML, Code).

---

## 6. Architecture et faisabilité technique

### Architecture de la solution
L'architecture suit un modèle **Serverless** :
- **Frontend (Client) :** Application React/TypeScript hébergée (potentiellement sur Vercel/Netlify), gérant l'interface utilisateur, l'état local (hooks personnalisés complexes), et la logique de rendu visuel (Markdown, Canvas).
- **Backend (BaaS) :** Supabase gère l'authentification des utilisateurs, le stockage sécurisé des profils, des offres d'emploi et de l'historique complet des conversations avec l'IA.
- **Service IA (API Externe) :** Le frontend communique directement et de manière sécurisée avec l'API Google Gemini via des promps contextuels pré-établis.

### Flux de fonctionnement général
1. L'étudiant se connecte via Supabase Auth.
2. Il accède au Hub et sélectionne une offre intéressante.
3. Il clique sur "Se préparer avec l'IA". Le frontend envoie le contexte de l'offre (titre, description, compétences requises) et le profil de l'étudiant à l'API Gemini.
4. Gemini retourne des conseils, génère des lettres ou lance une simulation d'entretien en mode *streaming* (les mots apparaissent en temps réel).
5. L'historique de la conversation est sauvegardé de manière asynchrone dans la base PostgreSQL de Supabase.

### Principales contraintes techniques
- **Gestion du contexte IA :** Les modèles IA ont une limite de tokens. Il faut optimiser les prompts pour ne pas dépasser cette limite tout en gardant l'historique pertinent.
- **Performance du rendu :** Le rendu en direct de Markdown complexe, de blocs de code et de visualisations HTML (Canvas) exige une gestion d'état React très rigoureuse pour éviter les ralentissements (d'où l'utilisation de `react-virtuoso` pour le virtual scroll).

### Risques techniques éventuels
- **Dépendance à l'API Gemini :** En cas de panne de l'API Google ou de dépassement de quotas (rate limits), le système d'assistant devient indisponible.
- **Latence réseau :** La génération de réponses très longues par l'IA peut causer de la latence, atténuée par l'utilisation du *Server-Sent Events* (Streaming).

---

## 7. Perspectives et évolutions futures

### Fonctionnalités prévues mais non implémentées (MVP)
- Parsing automatique des CV en PDF pour pré-remplir le profil de l'étudiant.
- Espace "Recruteur" complet permettant aux entreprises de publier directement leurs offres.

### Améliorations futures
- **Voice-to-Text & Text-to-Voice :** Permettre des simulations d'entretiens oraux complets où l'étudiant parle à son téléphone et l'IA lui répond avec une voix naturelle.
- **Système de matching algorithmique :** Recommandation automatique d'offres basée sur un score de compatibilité calculé par l'IA entre le CV et l'offre.

### Évolutions possibles du produit
- Extension de la plateforme aux universités partenaires pour y intégrer directement leurs propres offres de stages et suivre l'insertion de leurs alumni via un tableau de bord analytique.
