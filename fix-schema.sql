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
