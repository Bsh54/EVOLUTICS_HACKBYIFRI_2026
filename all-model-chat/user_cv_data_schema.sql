-- ==========================================
-- TABLE POUR SAUVEGARDER LES CV UTILISATEURS
-- ==========================================

-- Table pour stocker les données CV complètes des utilisateurs
CREATE TABLE user_cv_data (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  cv_data JSONB NOT NULL,
  template_id TEXT DEFAULT 'moderne-01',
  is_default BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Index pour optimiser la recherche par utilisateur
CREATE INDEX idx_user_cv_data_user_id ON user_cv_data(user_id);
CREATE INDEX idx_user_cv_data_updated_at ON user_cv_data(updated_at DESC);

-- Sécurité RLS
ALTER TABLE user_cv_data ENABLE ROW LEVEL SECURITY;

-- Politiques : L'utilisateur ne peut voir/modifier que SES propres CV
CREATE POLICY "Users can view their own CV data"
  ON user_cv_data FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own CV data"
  ON user_cv_data FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own CV data"
  ON user_cv_data FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own CV data"
  ON user_cv_data FOR DELETE
  USING (auth.uid() = user_id);

-- Trigger pour mettre à jour automatiquement "updated_at"
CREATE TRIGGER handle_user_cv_data_updated_at
  BEFORE UPDATE ON user_cv_data
  FOR EACH ROW EXECUTE PROCEDURE moddatetime (updated_at);

-- Contrainte pour s'assurer qu'un utilisateur n'a qu'un seul CV par défaut
CREATE UNIQUE INDEX idx_user_cv_data_default_unique
  ON user_cv_data(user_id)
  WHERE is_default = true;