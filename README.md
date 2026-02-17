# 🚀 EVOLUTICS — HACKBYIFRI 2026

<div align="center">
  <img src="https://img.shields.io/badge/HACKBYIFRI-2026-FF6600?style=for-the-badge&logo=target&logoColor=white" alt="Hackathon">
  <img src="https://img.shields.io/badge/Thème-Insertion_Pro-blue?style=for-the-badge" alt="Thème">
  <br/>
  <p><strong>La plateforme intelligente qui connecte les étudiants aux opportunités et les prépare à réussir grâce à l'IA.</strong></p>

  <p>
    <img src="https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=black" alt="React">
    <img src="https://img.shields.io/badge/TypeScript-5.5-3178C6?logo=typescript&logoColor=white" alt="TypeScript">
    <img src="https://img.shields.io/badge/Gemini-Flash_2.5-8E75B2?logo=google-gemini&logoColor=white" alt="Gemini AI">
    <img src="https://img.shields.io/badge/Supabase-Database-3ECF8E?logo=supabase&logoColor=white" alt="Supabase">
    <img src="https://img.shields.io/badge/Vite-Fast-646CFF?logo=vite&logoColor=white" alt="Vite">
  </p>
</div>

---

## 💡 Le Problème & La Solution

Dans le cadre du thème **"Intégration efficace du numérique dans l'apprentissage"**, EVOLUTICS répond aux défis de l'**Orientation académique & insertion professionnelle** (Axe 6) et de l'**Inclusion financière** (Axe 3).

Les étudiants manquent souvent d'accès centralisé aux opportunités (stages, bourses) et d'accompagnement personnalisé pour y postuler. **EVOLUTICS** comble ce fossé en combinant :
1.  Un **Hub d'Opportunités** centralisé et collaboratif.
2.  Un **Assistant IA Contextuel** qui connaît le contenu de chaque offre pour coacher l'étudiant.

---

## ✨ Fonctionnalités Clés

### 🎓 Hub d'Opportunités (Étudiants)
*   **Centralisation** : Accès unique aux offres d'emploi, stages, bourses d'études et concours (Hackathons, CTF).
*   **Filtrage Intelligent** : Recherche instantanée et tri par catégories ou favoris.
*   **Vue Immersive** : Détails complets des offres avec rendu Markdown riche.

### 🤖 Assistant IA "Coach Carrière"
*   **Préparation Contextuelle** : En un clic sur "PRÉPARER AVEC L'IA", l'assistant reçoit tout le contexte de l'offre.
*   **Rédaction Assistée** : Aide à la rédaction de CV et lettres de motivation sur-mesure pour l'offre sélectionnée.
*   **Simulation d'Entretien** : L'IA génère des questions techniques spécifiques à l'entreprise et au poste.

### 🛠️ Portail Administrateur
*   **Gestion Cloud (CRUD)** : Interface dédiée (`/admin-portal`) connectée à **Supabase** pour gérer les opportunités en temps réel.
*   **IA Générative Admin** : L'IA aide les administrateurs à rédiger des messages d'accueil engageants pour chaque offre.
*   **Synchronisation Immédiate** : Les nouvelles offres sont instantanément visibles par tous les utilisateurs connectés.

---

## 💻 Guide d'Exécution

Suivez ces étapes pour lancer le projet localement.

### Prérequis
*   **Node.js** (version 18 ou supérieure recommandée)
*   **npm** (inclus avec Node.js)
*   **Git**

### Installation

1.  **Cloner le dépôt :**
    ```bash
    git clone https://github.com/Bsh54/EVOLUTICS_HACKBYIFRI_2026.git
    cd EVOLUTICS_HACKBYIFRI_2026
    ```

2.  **Installer les dépendances :**
    Accédez au dossier du code source (`all-model-chat`) et installez les paquets :
    ```bash
    cd all-model-chat
    npm install
    ```

3.  **Configuration Environnement (.env) :**
    Créez un fichier `.env` à la racine de `all-model-chat` avec vos clés Supabase :
    ```env
    VITE_SUPABASE_URL=votre_url_supabase
    VITE_SUPABASE_ANON_KEY=votre_cle_anon
    ```

### Lancement

1.  **Démarrer le serveur de développement :**
    Assurez-vous d'être dans le dossier `all-model-chat` :
    ```bash
    npm run dev
    ```

2.  **Accéder à l'application :**
    Ouvrez votre navigateur sur `http://localhost:5173/`

### Accès Admin
Pour gérer les offres, accédez à : `http://localhost:5173/admin-portal`

---

## 🏗️ Architecture Technique

*   **Frontend** : React 18 + Vite pour une performance optimale.
*   **Design** : Tailwind CSS avec une approche "Mobile First".
*   **IA** : Intégration de Google Gemini 2.5 Flash via un proxy sécurisé.
*   **Données** :
    *   *Backend* : **Supabase (PostgreSQL)** pour le stockage et la diffusion temps réel des opportunités.
    *   *Local* : **IndexedDB** pour la persistance locale des conversations privées (confidentialité totale).

---

<div align="center">
  <p>Développé pour <strong>HACKBYIFRI 2026</strong></p>
</div>
