-- =====================================================
-- EVOLUTICS - PIPELINE INTELLIGENT IA
-- Script de création de la table pending_opportunities
-- =====================================================

-- Table pour la file d'attente des opportunités analysées par l'IA
CREATE TABLE IF NOT EXISTS pending_opportunities (
  -- Identifiants
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Champs de base (identiques à opportunities)
  type TEXT NOT NULL CHECK (type IN ('Emploi', 'Stage', 'Bourse', 'Concours', 'Conférences')),
  title TEXT,
  organization TEXT,
  description TEXT,
  full_content TEXT,
  deadline DATE,
  location TEXT,
  image TEXT,
  link TEXT,
  contact_email TEXT,
  apply_method TEXT DEFAULT 'link' CHECK (apply_method IN ('link', 'email')),
  reward TEXT,
  tags TEXT[],

  -- Champs dynamiques par type
  salary TEXT,
  contract_type TEXT,
  duration TEXT,
  level TEXT,
  prizes TEXT,
  speakers TEXT,
  schedule TEXT,

  -- Champ IA pré-généré
  ai_greeting TEXT,

  -- Métadonnées IA
  source_url TEXT NOT NULL,
  ai_confidence DECIMAL(3,2) DEFAULT 0.0 CHECK (ai_confidence >= 0.0 AND ai_confidence <= 1.0),
  ai_processed BOOLEAN DEFAULT false,
  original_content TEXT, -- Contenu HTML original pour référence
  extracted_data JSONB, -- Données extraites par l'IA pour comparaison

  -- Statut de validation admin
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'processing')),
  admin_notes TEXT,
  reviewed_by UUID REFERENCES profiles(id),
  reviewed_at TIMESTAMP WITH TIME ZONE,

  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- INDEX POUR PERFORMANCE
-- =====================================================

-- Index principal sur le statut (pour les requêtes de file d'attente)
CREATE INDEX IF NOT EXISTS idx_pending_opportunities_status
ON pending_opportunities(status);

-- Index sur la date de création (pour l'ordre chronologique)
CREATE INDEX IF NOT EXISTS idx_pending_opportunities_created_at
ON pending_opportunities(created_at DESC);

-- Index sur la confiance IA (pour les statistiques)
CREATE INDEX IF NOT EXISTS idx_pending_opportunities_ai_confidence
ON pending_opportunities(ai_confidence DESC)
WHERE ai_processed = true;

-- Index sur le type (pour les filtres)
CREATE INDEX IF NOT EXISTS idx_pending_opportunities_type
ON pending_opportunities(type);

-- Index sur l'URL source (pour éviter les doublons)
CREATE INDEX IF NOT EXISTS idx_pending_opportunities_source_url
ON pending_opportunities(source_url);

-- Index composé pour les requêtes admin
CREATE INDEX IF NOT EXISTS idx_pending_opportunities_admin_queries
ON pending_opportunities(status, created_at DESC, ai_confidence DESC);

-- =====================================================
-- TRIGGERS POUR MISE À JOUR AUTOMATIQUE
-- =====================================================

-- Fonction pour mettre à jour updated_at automatiquement
CREATE OR REPLACE FUNCTION update_pending_opportunities_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger pour updated_at
DROP TRIGGER IF EXISTS trigger_pending_opportunities_updated_at ON pending_opportunities;
CREATE TRIGGER trigger_pending_opportunities_updated_at
  BEFORE UPDATE ON pending_opportunities
  FOR EACH ROW
  EXECUTE FUNCTION update_pending_opportunities_updated_at();

-- =====================================================
-- POLITIQUES RLS (ROW LEVEL SECURITY)
-- =====================================================

-- Activer RLS sur la table
ALTER TABLE pending_opportunities ENABLE ROW LEVEL SECURITY;

-- Politique pour les admins (accès complet)
CREATE POLICY "Admins can manage pending opportunities" ON pending_opportunities
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Politique pour les utilisateurs authentifiés (lecture seule des approuvées)
CREATE POLICY "Users can view approved opportunities" ON pending_opportunities
  FOR SELECT USING (
    status = 'approved' AND auth.role() = 'authenticated'
  );

-- =====================================================
-- FONCTIONS UTILITAIRES
-- =====================================================

-- Fonction pour obtenir les statistiques de la file d'attente
CREATE OR REPLACE FUNCTION get_pending_opportunities_stats()
RETURNS JSON AS $$
DECLARE
  result JSON;
BEGIN
  SELECT json_build_object(
    'total', COUNT(*),
    'pending', COUNT(*) FILTER (WHERE status = 'pending'),
    'approved', COUNT(*) FILTER (WHERE status = 'approved'),
    'rejected', COUNT(*) FILTER (WHERE status = 'rejected'),
    'processing', COUNT(*) FILTER (WHERE status = 'processing'),
    'average_confidence', COALESCE(AVG(ai_confidence) FILTER (WHERE ai_processed = true), 0),
    'recent_activity', json_build_object(
      'last_24h', COUNT(*) FILTER (WHERE created_at > NOW() - INTERVAL '24 hours'),
      'approved_today', COUNT(*) FILTER (WHERE status = 'approved' AND DATE(reviewed_at) = CURRENT_DATE),
      'rejected_today', COUNT(*) FILTER (WHERE status = 'rejected' AND DATE(reviewed_at) = CURRENT_DATE)
    )
  ) INTO result
  FROM pending_opportunities;

  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Fonction pour nettoyer les anciennes entrées rejetées (optionnel)
CREATE OR REPLACE FUNCTION cleanup_old_rejected_opportunities(days_old INTEGER DEFAULT 30)
RETURNS INTEGER AS $$
DECLARE
  deleted_count INTEGER;
BEGIN
  DELETE FROM pending_opportunities
  WHERE status = 'rejected'
    AND reviewed_at < NOW() - (days_old || ' days')::INTERVAL;

  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  RETURN deleted_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- DONNÉES DE TEST (OPTIONNEL)
-- =====================================================

-- Insérer quelques exemples pour tester
INSERT INTO pending_opportunities (
  type, title, organization, description, source_url, ai_confidence, ai_processed, status
) VALUES
(
  'Stage',
  'Stage Développeur Full-Stack',
  'TechCorp Innovation',
  'Opportunité de stage de 6 mois dans une startup technologique en pleine croissance.',
  'https://example.com/stage-dev-fullstack',
  0.92,
  true,
  'pending'
),
(
  'Bourse',
  'Bourse d\'Excellence Académique 2026',
  'Fondation Éducation Plus',
  'Bourse destinée aux étudiants méritants pour poursuivre leurs études supérieures.',
  'https://example.com/bourse-excellence-2026',
  0.88,
  true,
  'pending'
),
(
  'Concours',
  'Concours Innovation Numérique',
  'Digital Africa Hub',
  'Concours ouvert aux jeunes entrepreneurs du numérique avec prix de 50 000€.',
  'https://example.com/concours-innovation-numerique',
  0.95,
  true,
  'pending'
)
ON CONFLICT DO NOTHING;

-- =====================================================
-- COMMENTAIRES ET DOCUMENTATION
-- =====================================================

COMMENT ON TABLE pending_opportunities IS 'File d''attente des opportunités analysées par l''IA en attente de validation admin';
COMMENT ON COLUMN pending_opportunities.source_url IS 'URL d''origine de l''opportunité analysée';
COMMENT ON COLUMN pending_opportunities.ai_confidence IS 'Score de confiance de l''analyse IA (0.0 à 1.0)';
COMMENT ON COLUMN pending_opportunities.ai_processed IS 'Indique si l''opportunité a été traitée par l''IA';
COMMENT ON COLUMN pending_opportunities.original_content IS 'Contenu HTML original pour référence';
COMMENT ON COLUMN pending_opportunities.extracted_data IS 'Données JSON extraites par l''IA pour comparaison';
COMMENT ON COLUMN pending_opportunities.status IS 'Statut de validation: pending, approved, rejected, processing';
COMMENT ON COLUMN pending_opportunities.admin_notes IS 'Notes de l''administrateur lors de la validation';
COMMENT ON COLUMN pending_opportunities.reviewed_by IS 'ID de l''admin qui a validé/rejeté';
COMMENT ON COLUMN pending_opportunities.reviewed_at IS 'Date et heure de la validation/rejet';

-- =====================================================
-- VÉRIFICATIONS FINALES
-- =====================================================

-- Vérifier que la table a été créée correctement
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'pending_opportunities') THEN
    RAISE NOTICE '✅ Table pending_opportunities créée avec succès';
  ELSE
    RAISE EXCEPTION '❌ Erreur: Table pending_opportunities non créée';
  END IF;
END $$;

-- Afficher le nombre d'index créés
SELECT
  schemaname,
  tablename,
  indexname,
  indexdef
FROM pg_indexes
WHERE tablename = 'pending_opportunities'
ORDER BY indexname;