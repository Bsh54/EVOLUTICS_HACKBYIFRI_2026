-- =====================================================
-- CORRECTION POLITIQUE RLS POUR GOOGLE APPS SCRIPT
-- =====================================================

-- Supprimer les anciennes politiques
DROP POLICY IF EXISTS "Admins can manage pending opportunities" ON pending_opportunities;
DROP POLICY IF EXISTS "Users can view approved opportunities" ON pending_opportunities;

-- Nouvelle politique pour permettre l'insertion depuis l'API de service
-- (Google Apps Script utilise une clé de service, pas un utilisateur authentifié)
CREATE POLICY "Service can insert pending opportunities" ON pending_opportunities
  FOR INSERT WITH CHECK (true);

-- Politique pour les admins (lecture et mise à jour)
CREATE POLICY "Admins can manage pending opportunities" ON pending_opportunities
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
    )
  );

-- Politique pour la lecture publique des opportunités approuvées
CREATE POLICY "Public can view approved opportunities" ON pending_opportunities
  FOR SELECT USING (
    status = 'approved'
  );

-- Vérification des politiques
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
FROM pg_policies
WHERE tablename = 'pending_opportunities';