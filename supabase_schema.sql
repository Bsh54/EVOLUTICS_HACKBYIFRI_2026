
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
