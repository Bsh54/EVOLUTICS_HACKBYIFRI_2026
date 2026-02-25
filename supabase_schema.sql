
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
