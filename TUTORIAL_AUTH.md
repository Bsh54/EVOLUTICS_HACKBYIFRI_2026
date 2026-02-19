# 🔐 Tutoriel : Configuration Complète de l'Authentification (Supabase + Google OAuth) en Production

Ce guide vous accompagne étape par étape pour configurer l'authentification de **EVOLUTICS** en production. Suivez scrupuleusement chaque étape pour garantir un fonctionnement optimal.

---

## 🏗️ Partie 1 : Création du Projet Supabase

1.  Rendez-vous sur [database.new](https://database.new) et connectez-vous avec votre compte GitHub.
2.  Cliquez sur **"New Project"**.
3.  Remplissez le formulaire :
    *   **Organization** : Sélectionnez votre organisation.
    *   **Name** : `evolutics-prod` (ou le nom de votre choix).
    *   **Database Password** : Générez un mot de passe fort et **sauvegardez-le** (vous ne le verrez plus).
    *   **Region** : Choisissez la région la plus proche de vos utilisateurs (ex: `eu-west-3` pour Paris).
4.  Cliquez sur **"Create new project"** et attendez quelques minutes que la base de données soit prête.

---

## 🗄️ Partie 2 : Configuration de la Base de Données

Une fois le projet prêt, allez dans l'onglet **SQL Editor** (icône terminal à gauche) et exécutez le script suivant pour créer la table `profiles` indispensable à l'auth :

```sql
-- 1. Création de la table profiles
create table public.profiles (
  id uuid references auth.users not null primary key,
  email text,
  display_name text,
  avatar_url text,
  bio text,

  -- Champs Académiques
  university text,
  field_of_study text,
  education_level text,
  graduation_year integer,

  -- Champs Professionnels
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

-- 2. Activer la sécurité RLS (Row Level Security)
alter table public.profiles enable row level security;

-- 3. Créer les politiques de sécurité (Qui peut voir/modifier quoi ?)
-- Tout le monde peut voir les profils (public)
create policy "Public profiles are viewable by everyone."
  on profiles for select
  using ( true );

-- L'utilisateur peut insérer son PROPRE profil
create policy "Users can insert their own profile."
  on profiles for insert
  with check ( auth.uid() = id );

-- L'utilisateur peut modifier son PROPRE profil
create policy "Users can update own profile."
  on profiles for update
  using ( auth.uid() = id );
```

Cliquez sur **RUN** pour exécuter le script.

---

## 🌐 Partie 3 : Configuration Google OAuth (Google Cloud Console)

Pour que le bouton "Continuer avec Google" fonctionne, vous devez créer une application OAuth chez Google.

1.  Allez sur la [Google Cloud Console](https://console.cloud.google.com/).
2.  Créez un **Nouveau Projet** nommé `Evolutics Auth`.
3.  Dans le menu de gauche, allez dans **APIs & Services > OAuth consent screen**.
    *   Choisissez **External** (Externe).
    *   Remplissez les champs obligatoires (Nom de l'app, email support, email développeur).
    *   Cliquez sur **Save and Continue** (vous pouvez passer les étapes Scopes et Test Users).
    *   Une fois créé, cliquez sur **"Publish App"** pour la rendre accessible à tous (sinon seuls les testeurs pourront se connecter).

4.  Allez dans **APIs & Services > Credentials**.
    *   Cliquez sur **+ CREATE CREDENTIALS** > **OAuth client ID**.
    *   **Application type** : `Web application`.
    *   **Name** : `Evolutics Web Client`.

5.  **Configuration des URLs (CRUCIAL)** :
    *   **Authorized JavaScript origins** :
        *   `http://localhost:5173` (Pour vos tests locaux)
        *   `https://votre-domaine-prod.com` (Votre URL de production Vercel/Netlify)

    *   **Authorized redirect URIs** :
        *   Allez dans votre dashboard Supabase > **Authentication > Providers > Google**.
        *   Copiez l'URL affichée sous **"Callback URL (for OAuth)"** (ex: `https://xyz.supabase.co/auth/v1/callback`).
        *   Collez cette URL dans le champ Google Cloud Console.

6.  Cliquez sur **Create**.
7.  Une fenêtre s'ouvre avec votre **Client ID** et **Client Secret**. Copiez-les.

---

## 🔗 Partie 4 : Lier Google à Supabase

1.  Retournez sur votre dashboard Supabase.
2.  Allez dans **Authentication > Providers**.
3.  Cliquez sur **Google** pour le déplier.
4.  Activez l'interrupteur **Enable Sign in with Google**.
5.  Collez votre **Client ID** et **Client Secret** (récupérés à l'étape précédente).
6.  Cliquez sur **Save**.

---

## 📧 Partie 5 : Configuration des Emails (Optionnel mais recommandé)

Par défaut, Supabase envoie des emails de confirmation limités (3 par heure). Pour la production :

1.  Allez dans **Authentication > Email Templates**.
2.  Personnalisez le sujet et le contenu des emails (Confirmation, Magic Link, Reset Password).
3.  Pour augmenter les quotas, vous devrez configurer votre propre serveur SMTP (ex: SendGrid, Resend, AWS SES) dans **Settings > SMTP Settings**.

---

## 🚀 Partie 6 : Connexion au Code (Environment Variables)

Dernière étape : connecter votre code React à ce nouveau projet Supabase.

1.  Dans Supabase, allez dans **Project Settings > API**.
2.  Récupérez :
    *   **Project URL** (`https://xyz.supabase.co`)
    *   **anon public key** (`eyJh...`)
3.  Dans votre projet local, ouvrez (ou créez) le fichier `.env.local` :

```env
VITE_SUPABASE_URL=votre_project_url
VITE_SUPABASE_ANON_KEY=votre_anon_key
```

4.  Si vous déployez sur Vercel/Netlify, ajoutez ces mêmes variables dans les réglages de déploiement (**Environment Variables**).

---

## ✅ Checklist de Vérification

- [ ] Table `profiles` créée avec RLS activé ?
- [ ] Google OAuth activé dans Supabase ?
- [ ] Client ID / Secret collés dans Supabase ?
- [ ] URL de callback Supabase collée dans Google Cloud ?
- [ ] Variables d'environnement mises à jour dans le code (`.env.local`) ?

🎉 **Félicitations ! Votre authentification est prête pour la production.**
