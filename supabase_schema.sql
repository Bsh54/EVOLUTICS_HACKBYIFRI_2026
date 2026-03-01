
-- Création de la table 'opportunities'
create table opportunities (
  id text primary key,
  type text not null,
  title text,
  organization text,
  description text,
  full_content text, -- snake_case pour SQL (mappé vers fullContent en JS)
  deadline text,
  location text,
  image text,
  link text,
  contact_email text, -- mappé vers contactEmail
  apply_method text, -- mappé vers applyMethod
  status text,
  reward text,
  tags text[], -- Tableau de texte
  salary text,
  contract_type text, -- mappé vers contractType
  duration text,
  level text,
  prizes text,
  speakers text,
  schedule text,
  ai_greeting text, -- mappé vers aiGreeting
  is_partner boolean default false, -- mappé vers isPartner
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Activer Row Level Security (RLS) pour la sécurité
alter table opportunities enable row level security;

-- Créer une politique pour permettre la lecture publique (tout le monde peut voir les offres)
create policy "Public opportunities are viewable by everyone"
  on opportunities for select
  using ( true );

-- Créer une politique pour permettre l'insertion/modification (pour l'instant ouvert à tous pour le hackathon, à restreindre plus tard)
create policy "Enable insert for everyone"
  on opportunities for insert
  with check ( true );

create policy "Enable update for everyone"
  on opportunities for update
  using ( true );

create policy "Enable delete for everyone"
  on opportunities for delete
  using ( true );

-- ==========================================
-- GESTION DES CONVERSATIONS IA (CHAT HISTORY)
-- ==========================================

create table chat_sessions (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete cascade not null,
  title text not null default 'Nouvelle conversation',
  messages jsonb default '[]'::jsonb not null,
  settings jsonb default '{}'::jsonb not null,
  is_pinned boolean default false not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Index pour optimiser la recherche par utilisateur
create index idx_chat_sessions_user_id on chat_sessions(user_id);
create index idx_chat_sessions_updated_at on chat_sessions(updated_at desc);

-- Sécurité RLS
alter table chat_sessions enable row level security;

-- Politiques : L'utilisateur ne peut voir/modifier/supprimer que SES propres conversations
create policy "Users can view their own chat sessions"
  on chat_sessions for select
  using (auth.uid() = user_id);

create policy "Users can insert their own chat sessions"
  on chat_sessions for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own chat sessions"
  on chat_sessions for update
  using (auth.uid() = user_id);

create policy "Users can delete their own chat sessions"
  on chat_sessions for delete
  using (auth.uid() = user_id);

-- Fonction pour mettre à jour automatiquement "updated_at"
create extension if not exists moddatetime schema extensions;
create trigger handle_updated_at before update on chat_sessions
  for each row execute procedure moddatetime (updated_at);
-- Correction du type d'ID pour correspondre aux ID générés par le frontend (pas forcément des UUID)
-- S'exécuter dans l'éditeur SQL de Supabase

drop table if exists chat_sessions cascade;

create table chat_sessions (
  id text primary key, -- Text au lieu de UUID car le frontend génère des ID courts
  user_id uuid references auth.users(id) on delete cascade not null,
  title text not null default 'Nouvelle conversation',
  messages jsonb default '[]'::jsonb not null,
  settings jsonb default '{}'::jsonb not null,
  is_pinned boolean default false not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Index pour optimiser la recherche par utilisateur
create index idx_chat_sessions_user_id on chat_sessions(user_id);
create index idx_chat_sessions_updated_at on chat_sessions(updated_at desc);

-- Sécurité RLS
alter table chat_sessions enable row level security;

-- Politiques
create policy "Users can view their own chat sessions" on chat_sessions for select using (auth.uid() = user_id);
create policy "Users can insert their own chat sessions" on chat_sessions for insert with check (auth.uid() = user_id);
create policy "Users can update their own chat sessions" on chat_sessions for update using (auth.uid() = user_id);
create policy "Users can delete their own chat sessions" on chat_sessions for delete using (auth.uid() = user_id);

-- Fonction pour update_at
create extension if not exists moddatetime schema extensions;
create trigger handle_updated_at before update on chat_sessions
  for each row execute procedure moddatetime (updated_at);

-- ==========================================
-- GESTION DES DONNÉES CV UTILISATEUR
-- ==========================================

-- Table pour stocker les données CV complètes des utilisateurs
CREATE TABLE user_cv_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  experiences JSONB DEFAULT '[]'::jsonb NOT NULL,
  education JSONB DEFAULT '[]'::jsonb NOT NULL,
  skills JSONB DEFAULT '[]'::jsonb NOT NULL,
  languages TEXT[] DEFAULT '{}',
  cv_references JSONB DEFAULT '[]'::jsonb NOT NULL,
  tools JSONB DEFAULT '[]'::jsonb NOT NULL,
  certifications JSONB DEFAULT '[]'::jsonb NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Index pour optimiser la recherche par utilisateur
CREATE INDEX idx_user_cv_profiles_user_id ON user_cv_profiles(user_id);

-- Sécurité RLS
ALTER TABLE user_cv_profiles ENABLE ROW LEVEL SECURITY;

-- Politiques : L'utilisateur ne peut voir/modifier que SES propres données CV
CREATE POLICY "Users can view their own CV profiles"
  ON user_cv_profiles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own CV profiles"
  ON user_cv_profiles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own CV profiles"
  ON user_cv_profiles FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own CV profiles"
  ON user_cv_profiles FOR DELETE
  USING (auth.uid() = user_id);

-- Trigger pour mettre à jour automatiquement "updated_at"
CREATE TRIGGER handle_user_cv_profiles_updated_at
  BEFORE UPDATE ON user_cv_profiles
  FOR EACH ROW EXECUTE PROCEDURE moddatetime (updated_at);

-- ==========================================
-- HISTORIQUE DES CV GÉNÉRÉS
-- ==========================================

-- Table pour l'historique des CV générés par opportunité
CREATE TABLE generated_cvs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  opportunity_id TEXT REFERENCES opportunities(id) ON DELETE CASCADE,
  cv_data JSONB NOT NULL,
  pdf_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Index pour optimiser les requêtes
CREATE INDEX idx_generated_cvs_user_id ON generated_cvs(user_id);
CREATE INDEX idx_generated_cvs_opportunity_id ON generated_cvs(opportunity_id);
CREATE INDEX idx_generated_cvs_created_at ON generated_cvs(created_at DESC);

-- Sécurité RLS
ALTER TABLE generated_cvs ENABLE ROW LEVEL SECURITY;

-- Politiques : L'utilisateur ne peut voir que SES propres CV générés
CREATE POLICY "Users can view their own generated CVs"
  ON generated_cvs FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own generated CVs"
  ON generated_cvs FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own generated CVs"
  ON generated_cvs FOR DELETE
  USING (auth.uid() = user_id);
