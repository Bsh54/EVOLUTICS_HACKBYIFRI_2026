-- ==========================================
-- TABLE POUR SAUVEGARDER LES LETTRES DE MOTIVATION
-- ==========================================

-- Table pour stocker les lettres de motivation des utilisateurs
CREATE TABLE user_cover_letters (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  opportunity_id TEXT,
  opportunity_title TEXT,
  opportunity_organization TEXT,
  
  -- Contenu de la lettre
  content TEXT NOT NULL,
  tone TEXT DEFAULT 'formal', -- formal, dynamic, creative
  
  -- Métadonnées
  title TEXT DEFAULT 'Ma Lettre de Motivation',
  is_favorite BOOLEAN DEFAULT false,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Index pour optimiser la recherche par utilisateur
CREATE INDEX idx_user_cover_letters_user_id ON user_cover_letters(user_id);
CREATE INDEX idx_user_cover_letters_updated_at ON user_cover_letters(updated_at DESC);
CREATE INDEX idx_user_cover_letters_opportunity_id ON user_cover_letters(opportunity_id);

-- Sécurité RLS
ALTER TABLE user_cover_letters ENABLE ROW LEVEL SECURITY;

-- Politiques : L'utilisateur ne peut voir/modifier que SES propres lettres
CREATE POLICY "Users can view their own cover letters"
  ON user_cover_letters FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own cover letters"
  ON user_cover_letters FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own cover letters"
  ON user_cover_letters FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own cover letters"
  ON user_cover_letters FOR DELETE
  USING (auth.uid() = user_id);

-- Trigger pour mettre à jour automatiquement "updated_at"
CREATE OR REPLACE FUNCTION update_cover_letters_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER handle_user_cover_letters_updated_at
  BEFORE UPDATE ON user_cover_letters
  FOR EACH ROW EXECUTE FUNCTION update_cover_letters_updated_at();

-- Commentaires
COMMENT ON TABLE user_cover_letters IS 'Lettres de motivation générées et sauvegardées par les utilisateurs';
COMMENT ON COLUMN user_cover_letters.tone IS 'Ton de la lettre: formal, dynamic, creative';
COMMENT ON COLUMN user_cover_letters.opportunity_id IS 'ID de l''opportunité ciblée (optionnel)';
