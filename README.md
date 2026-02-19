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
- **🤖 Coach Carrière IA** : Assistant contextuel (Gemini 2.5) pour rédiger CV/Lettres et simuler des entretiens.
- **📱 Interface Mobile-First** : Navigation fluide par onglets (Explorer, Assistant, Profil).
- **🎨 Design Moderne** : Mode sombre/clair, animations fluides, UX soignée.

---

## 🛠️ Installation & Démarrage

### Prérequis
- Node.js (v18+)
- NPM ou Yarn
- Un compte [Supabase](https://supabase.com/)
- Une clé API [Google Gemini](https://aistudio.google.com/)

### 1. Cloner le projet
```bash
git clone https://github.com/votre-username/evolutics.git
cd evolutics/all-model-chat
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

## 📚 Guide de Configuration Supabase (Production)

Pour que l'application fonctionne, vous devez configurer votre projet Supabase. Exécutez les scripts SQL suivants dans l'éditeur SQL de votre dashboard Supabase.

### 1. Création des Tables

#### Table `profiles`
Stocke les informations détaillées des utilisateurs.

```sql
-- Création de la table profiles
create table public.profiles (
  id uuid references auth.users not null primary key,
  email text,
  display_name text,
  avatar_url text,
  bio text,

  -- Académique
  university text,
  field_of_study text,
  education_level text,
  graduation_year integer,

  -- Professionnel
  skills text[],
  experience_years integer,
  current_position text,
  linkedin_url text,
  portfolio_url text,

  -- Préférences
  preferred_types text[],
  preferred_locations text[],
  availability_date text,
  salary_expectation text,

  -- Système
  onboarding_completed boolean default false,
  last_login_at timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Activer RLS (Row Level Security)
alter table public.profiles enable row level security;

-- Politiques de sécurité
create policy "Public profiles are viewable by everyone."
  on profiles for select
  using ( true );

create policy "Users can insert their own profile."
  on profiles for insert
  with check ( auth.uid() = id );

create policy "Users can update own profile."
  on profiles for update
  using ( auth.uid() = id );
```

#### Table `opportunities`
Stocke les offres affichées sur la plateforme.

```sql
create table public.opportunities (
  id uuid default gen_random_uuid() primary key,
  type text not null, -- 'Emploi', 'Stage', 'Bourse', etc.
  title text not null,
  organization text,
  description text,
  full_content text, -- Contenu Markdown complet
  deadline timestamp with time zone,
  location text,
  image text,
  link text,
  contact_email text,
  apply_method text, -- 'link' ou 'email'
  status text default 'Ouvert',
  reward text,
  tags text[],

  -- Champs spécifiques
  salary text,
  contract_type text,
  duration text,
  level text,
  prizes text,
  speakers text,
  schedule text,

  -- IA
  ai_greeting text, -- Message d'intro personnalisé pour l'IA
  is_partner boolean default false,

  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Activer RLS
alter table public.opportunities enable row level security;

-- Tout le monde peut lire les opportunités
create policy "Opportunities are viewable by everyone."
  on opportunities for select
  using ( true );

-- Seuls les admins peuvent modifier (à adapter selon vos rôles)
-- Pour le développement, permettre l'écriture authentifiée :
create policy "Authenticated users can insert opportunities."
  on opportunities for insert
  with check ( auth.role() = 'authenticated' );
```

### 2. Configuration du Stockage (Storage)

Créez deux buckets publics dans le menu "Storage" de Supabase :

1.  **`avatars`** : Pour les photos de profil
    *   **Public**: Oui
    *   **Policy**: Give users access to insert/update their own files (`auth.uid() = (storage.foldername(name))[1]`).

2.  **`cvs`** : Pour les CVs des utilisateurs
    *   **Public**: Oui
    *   **Policy**: Give users access to insert/update their own files.

### 3. Authentification Google (OAuth)

Pour activer le bouton "Continuer avec Google" :

1.  Allez dans **Authentication > Providers** sur Supabase.
2.  Activez **Google**.
3.  Obtenez vos identifiants sur la [Google Cloud Console](https://console.cloud.google.com/) :
    *   Créez un projet > **APIs & Services** > **Credentials** > **Create Credentials** > **OAuth client ID**.
    *   Type : **Web application**.
    *   **Authorized JavaScript origins** : `http://localhost:5173` (et votre URL de prod).
    *   **Authorized redirect URIs** : Ajoutez l'URL de callback fournie par Supabase (ex: `https://votre-project.supabase.co/auth/v1/callback`).
4.  Copiez le *Client ID* et *Client Secret* dans Supabase.

---

## 👥 Équipe & Contribution

Projet réalisé pour le hackathon **HACKBYIFRI 2026**.

- **X045-lyse** (Marlyse Boukari) - *Co-Author*
- **Othniel-Ken** (Othniel Guidi) - *Co-Author*

---

<div align="center">
  <p>Fait avec ❤️ par l'équipe EVOLUTICS</p>
</div>
