# 🚀 EVOLUTICS — Votre tremplin vers le monde professionnel

<div align="center">
  <img src="./EVOLUTICS WITH NAME.png" alt="EVOLUTICS Logo" width="250" />
  <br/><br/>
  <img src="https://img.shields.io/badge/HACKBYIFRI-2026-FF6600?style=for-the-badge&logo=target&logoColor=white" alt="Hackathon">
  <img src="https://img.shields.io/badge/Thème-Insertion_Pro-blue?style=for-the-badge" alt="Thème">
  <br/>
  <p><strong>La plateforme intelligente qui connecte les étudiants aux opportunités et les prépare à réussir grâce à l'Intelligence Artificielle.</strong></p>
</div>

---

## 💡 Présentation du Projet

**EVOLUTICS** est née d'un constat simple : les étudiants ont souvent du mal à trouver des offres qui leur correspondent et se sentent parfois démunis face aux recruteurs.

Notre solution est un véritable **compagnon de carrière**. Elle ne se contente pas d'afficher des offres (stages, emplois, bourses, concours, conférences), elle intègre un **Coach IA personnel** basé sur Google Gemini 2.5 Flash. Cet assistant aide l'étudiant à rédiger son CV, préparer ses lettres de motivation, et même simuler des entretiens en se basant spécifiquement sur l'offre qui l'intéresse.

### ✨ Ce que propose EVOLUTICS :

- 🎓 **Un hub d'opportunités intelligent** : Trouvez facilement des stages, emplois, bourses, concours et conférences adaptés à votre profil
- 🤖 **Un Coach Carrière IA disponible 24/7** : Assistant conversationnel qui génère CV, lettres de motivation et simule des entretiens
- 🎨 **Une expérience moderne et fluide** : Interface glassmorphism responsive avec animations soignées et navigation intuitive
- 👤 **Profil personnalisé complet** : Onboarding guidé en 4 étapes pour un accompagnement sur-mesure
- 🔐 **Authentification sécurisée** : Connexion par email/mot de passe ou Google OAuth

---

## 🛠️ Technologies utilisées

- **Frontend :** React 18 + TypeScript + Tailwind CSS + Vite
- **Backend :** Supabase (PostgreSQL + Auth + Storage)
- **Intelligence Artificielle :** Google Gemini 2.5 Flash API
- **Design :** Glassmorphism, thèmes Pearl/Onyx, responsive mobile-first
- **Outils :** ESLint, Git, Claude Code pour le développement

---

## 🚀 Guide d'Installation

### 1. Préparer le terrain
Assurez-vous d'avoir installé sur votre ordinateur :
- **Node.js 18+**
- Un compte **Supabase** (gratuit)
- Une clé **Google Gemini API** (gratuite)

### 2. Récupérer le projet
Ouvrez votre terminal (ou invite de commande) et tapez :
```bash
git clone https://github.com/Bsh54/EVOLUTICS_HACKBYIFRI_2026.git
cd EVOLUTICS_HACKBYIFRI_2026/all-model-chat
```

### 3. Installer les composants
Lancez l'installation des éléments nécessaires au projet :
```bash
npm install
```

### 4. Connecter vos services (Base de données & IA)
Dans le dossier `all-model-chat`, créez un fichier nommé `.env.local` et collez-y vos liens et clés API :
```env
VITE_SUPABASE_URL=votre_lien_supabase_ici
VITE_SUPABASE_ANON_KEY=votre_cle_supabase_ici
VITE_GEMINI_API_KEY=votre_cle_gemini_ici
```

*Note : Pour que tout fonctionne, n'oubliez pas de configurer votre base de données Supabase en copiant/collant le contenu du fichier `supabase_schema.sql` dans l'éditeur SQL de votre tableau de bord Supabase.*

### 5. Démarrer l'application !
Il ne vous reste plus qu'à lancer le site avec cette commande :
```bash
npm run dev
```
🎉 Et voilà ! Ouvrez votre navigateur internet et tapez l'adresse indiquée dans la console (généralement `http://localhost:5173`) pour découvrir EVOLUTICS.

---

## 🎯 Fonctionnalités principales

### 🏠 **Landing Page attractive**
- Design glassmorphism avec animations fluides
- Présentation claire de la valeur ajoutée
- Transition élégante vers l'authentification

### 🔐 **Système d'authentification complet**
- Inscription/connexion par email + mot de passe
- Authentification Google OAuth
- Onboarding guidé en 4 étapes (Identité, Formation, Expérience, Préférences)

### 🎯 **Hub d'opportunités intelligent**
- Affichage de 5 types d'opportunités : Emplois, Stages, Bourses, Concours, Conférences
- Système de filtrage par type et recherche sémantique
- Cartes interactives avec favoris et détails complets
- Animations de chargement innovantes (cartes squelettes)

### 🤖 **Coach Carrière IA (Gemini 2.5 Flash)**
- Chat conversationnel en temps réel avec streaming
- Génération automatique de CV adaptés aux offres
- Rédaction de lettres de motivation personnalisées
- Simulation d'entretiens techniques et RH
- Historique des conversations sauvegardé

### 📱 **Interface responsive moderne**
- Navigation mobile optimisée avec 3 onglets
- Thèmes Pearl (clair) et Onyx (sombre)
- Animations et micro-interactions soignées
- Design mobile-first avec adaptation desktop

---

## 👥 L'équipe EVOLUTICS (HACKBYIFRI 2026)

- **Shadrak BESSANH** - Chef d'équipe - SEIOT Licence 2 - shadrakbsh@gmail.com
- **Marlyse BOUKARI** - Sécurité Informatique Licence 2 - marlyseboukari@gmail.com
- **Othniel AGUIDI** - Intelligence Artificielle Licence 2 - aguidiothiniel17@gmail.com

**École :** Institut de Formation et de Recherche en Informatique (IFRI)

---

## 🎯 Impact et Vision

### **Problème résolu**
L'incapacité des étudiants à s'insérer efficacement dans le monde professionnel, causée par :
- Difficulté à trouver des opportunités centralisées et adaptées
- Manque de préparation pratique (CV, lettres, entretiens)
- Dispersion sur de multiples plateformes non ciblées

### **Notre solution**
EVOLUTICS centralise et filtre les opportunités tout en intégrant un Coach IA proactif qui transforme la plateforme en véritable mentor personnel disponible 24/7.

### **Vision future**
- Extension aux universités partenaires africaines
- Intégration voice-to-text pour entretiens oraux
- Système de matching algorithmique avancé
- Tableau de bord analytique pour universités

---

## 📊 Métriques attendues

- **Temps de recherche** réduit de 70%
- **Taux de préparation** aux entretiens +80%
- **Satisfaction utilisateur** cible 4.8/5
- **Adoption** dans 3+ universités pilotes

---

## 🔗 Liens utiles

- [Cahier des charges complet](./EVOLUTICS_CAHIER_DE_CHARGES.md)
- [Guide d'authentification](./TUTORIAL_AUTH.md)
- [TDR du concours](./TDR_HACK_BY_IFRI_2026.pdf)
- [IFRI - Notre école](https://ifri.edu.sn)

---

<div align="center">
  <br/>
  <h3>🚀 Propulsé par l'innovation étudiante africaine</h3>
  <p><strong>HACK BY IFRI 2026 - L'IA au service de l'insertion professionnelle</strong></p>
  <br/>
  <p>Fait avec ❤️ par l'équipe EVOLUTICS</p>

  ⭐ **N'oubliez pas de mettre une étoile si ce projet vous plaît !** ⭐
</div>
