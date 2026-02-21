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

## 📚 Guide de Configuration Supabase (Backend)

Pour que l'application fonctionne parfaitement avec la base de données distante, vous devez exécuter les scripts SQL suivants dans l'éditeur SQL de votre dashboard Supabase.

<details>
<summary><b>1. Table <code>profiles</code> (Profils utilisateurs)</b></summary>

```sql
create table public.profiles (
  id uuid references auth.users not null primary key,
  email text,
  display_name text,
  avatar_url text,
  bio text,
  university text,
  field_of_study text,
  education_level text,
  graduation_year integer,
  skills text[],
  experience_years integer,
  current_position text,
  linkedin_url text,
  portfolio_url text,
  preferred_types text[],
  preferred_locations text[],
  availability_date text,
  salary_expectation text,
  onboarding_completed boolean default false,
  last_login_at timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.profiles enable row level security;
create policy "Public profiles are viewable by everyone." on profiles for select using (true);
create policy "Users can insert their own profile." on profiles for insert with check (auth.uid() = id);
create policy "Users can update own profile." on profiles for update using (auth.uid() = id);
```
</details>

<details>
<summary><b>2. Table <code>opportunities</code> (Hub des offres)</b></summary>

```sql
create table public.opportunities (
  id text primary key,
  type text not null,
  title text,
  organization text,
  description text,
  full_content text, 
  deadline text,
  location text,
  image text,
  link text,
  contact_email text, 
  apply_method text, 
  status text,
  reward text,
  tags text[], 
  salary text,
  contract_type text, 
  duration text,
  level text,
  prizes text,
  speakers text,
  schedule text,
  ai_greeting text, 
  is_partner boolean default false, 
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.opportunities enable row level security;
create policy "Public opportunities are viewable by everyone" on opportunities for select using (true);
create policy "Enable insert for everyone" on opportunities for insert with check (true);
create policy "Enable update for everyone" on opportunities for update using (true);
create policy "Enable delete for everyone" on opportunities for delete using (true);
```
</details>

<details>
<summary><b>3. Table <code>chat_sessions</code> (Historique des conversations IA)</b></summary>

```sql
create table chat_sessions (
  id text primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  title text not null default 'Nouvelle conversation',
  messages jsonb default '[]'::jsonb not null,
  settings jsonb default '{}'::jsonb not null,
  is_pinned boolean default false not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create index idx_chat_sessions_user_id on chat_sessions(user_id);
create index idx_chat_sessions_updated_at on chat_sessions(updated_at desc);

alter table chat_sessions enable row level security;

create policy "Users can view their own chat sessions" on chat_sessions for select using (auth.uid() = user_id);
create policy "Users can insert their own chat sessions" on chat_sessions for insert with check (auth.uid() = user_id);
create policy "Users can update their own chat sessions" on chat_sessions for update using (auth.uid() = user_id);
create policy "Users can delete their own chat sessions" on chat_sessions for delete using (auth.uid() = user_id);

create extension if not exists moddatetime schema extensions;
create trigger handle_updated_at before update on chat_sessions
  for each row execute procedure moddatetime (updated_at);
```
</details>

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
