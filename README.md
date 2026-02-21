# 🚀 EVOLUTICS — Plateforme d'Opportunités & Coach Carrière IA

<div align="center">
  <img src="https://img.shields.io/badge/HACKBYIFRI-2026-FF6600?style=for-the-badge&logo=target&logoColor=white" alt="Hackathon">
  <img src="https://img.shields.io/badge/Thème-Insertion_Pro-blue?style=for-the-badge" alt="Thème">
  <br/>
  <p><strong>La plateforme intelligente qui connecte les étudiants aux opportunités et les prépare à réussir grâce à l'IA.</strong></p>

  <p>
    <img src="https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=black" alt="React">
    <img src="https://img.shields.io/badge/TypeScript-5.5-3178C6?logo=typescript&logoColor=white" alt="TypeScript">
    <img src="https://img.shields.io/badge/Gemini-Flash_2.5-8E75B2?logo=google-gemini&logoColor=white" alt="Gemini AI">
    <img src="https://img.shields.io/badge/Supabase-Auth_&_DB-3ECF8E?logo=supabase&logoColor=white" alt="Supabase">
    <img src="https://img.shields.io/badge/Tailwind-CSS-06B6D4?logo=tailwindcss&logoColor=white" alt="Tailwind">
  </p>
</div>

---

## 💡 Le Projet

**EVOLUTICS** est une solution complète pour l'insertion professionnelle des étudiants. Elle combine un hub d'opportunités centralisé avec un assistant IA personnel qui connaît le contexte de chaque offre pour coacher l'étudiant.

### ✨ Fonctionnalités Clés

- **🔐 Authentification Complète** : Inscription/Connexion par Email ou Google OAuth.
- **👤 Profil Utilisateur Riche** : Gestion de l'identité, parcours académique, expériences et préférences.
- **🎓 Hub d'Opportunités** : Emplois, Stages, Bourses, Concours, Conférences avec filtres avancés.
- **🤖 Coach Carrière IA** : Assistant contextuel (Gemini 2.5) pour rédiger CV/Lettres et simuler des entretiens. Historique de chat persistant et synchronisé sur le cloud.
- **📱 Interface Mobile-First** : Navigation fluide par onglets (Explorer, Assistant, Profil).
- **🎨 Design Moderne** : Mode sombre/clair, animations fluides, composants personnalisés et UX soignée (Sticky Scroll, Loaders custom).

---

## 🛠️ Installation & Démarrage

### Prérequis
- Node.js (v18+)
- NPM ou Yarn
- Un compte [Supabase](https://supabase.com/)
- Une clé API [Google Gemini](https://aistudio.google.com/)

### 1. Cloner le projet
```bash
git clone https://github.com/Bsh54/EVOLUTICS_HACKBYIFRI_2026.git
cd EVOLUTICS_HACKBYIFRI_2026/all-model-chat
```

### 2. Installer les dépendances
```bash
npm install
```

### 3. Configurer l'environnement
Créez un fichier `.env.local` à la racine du dossier `all-model-chat` :

```env
VITE_SUPABASE_URL=votre_url_supabase
VITE_SUPABASE_ANON_KEY=votre_cle_anon_supabase
VITE_GEMINI_API_KEY=votre_cle_api_gemini
```

### 4. Lancer le serveur de développement
```bash
npm run dev
```
L'application sera accessible sur `http://localhost:5173`.

---

## 📚 Configuration Base de Données (Supabase)

Afin que l'application fonctionne de bout en bout (profils utilisateurs, annonces et historique de chat IA), la structure de la base de données doit être créée sur votre instance Supabase.

Toutes les instructions et requêtes SQL se trouvent dans le fichier **`supabase_schema.sql`** situé à la racine du projet.

**Étapes :**
1. Ouvrez votre dashboard Supabase > section **SQL Editor**.
2. Cliquez sur **New query**.
3. Copiez le contenu entier du fichier `supabase_schema.sql` et exécutez-le (`Run`).

### Configuration du Stockage (Storage)

Vous devrez également créer deux buckets publics manuellement dans la section "Storage" de Supabase :
1. **`avatars`** : Pour les photos de profil.
2. **`cvs`** : Pour les CVs des utilisateurs.

(N'oubliez pas d'autoriser l'insertion de fichiers pour les utilisateurs authentifiés via les Policies du Storage).

### Problèmes fréquents en production
- **Erreur RLS lors de l'inscription :** Si Supabase requiert une confirmation par email, le compte est créé mais la connexion est différée. L'application gère cela proprement désormais en invitant l'utilisateur à vérifier sa boîte de réception.
- **Redirection Google OAuth erronée (`localhost` au lieu du site) :** Assurez-vous d'avoir bien renseigné l'URL de votre site en production dans le dashboard Supabase (`Authentication` > `URL Configuration` > `Site URL` & `Redirect URLs`).

---

## 👥 Équipe & Contribution

Projet réalisé pour le hackathon **HACKBYIFRI 2026**.

- **Shadrac** (Bsh54)
- **X045-lyse** (Marlyse Boukari)
- **Othniel-Ken** (Othniel Guidi)

---

<div align="center">
  <p>Fait avec ❤️ par l'équipe EVOLUTICS</p>
</div>
