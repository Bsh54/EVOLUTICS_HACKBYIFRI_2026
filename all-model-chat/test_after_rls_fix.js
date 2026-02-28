/**
 * Script pour tester avec une clé de service ou désactiver RLS temporairement
 * IMPORTANT: Vous devez exécuter le SQL fix_rls_policies.sql dans Supabase d'abord
 */

import { createClient } from '@supabase/supabase-js';
import { randomUUID } from 'crypto';

const supabaseUrl = 'https://bzcmpulivznmzbjggbyh.supabase.co';

// Essayons d'abord avec la clé anonyme après correction RLS
const supabaseAnonKey = 'sb_publishable_RvZZojymg2-eFROVdVT2-Q_E4MvbH1v';

console.log('🔧 Test après correction des politiques RLS...');
console.log('');
console.log('⚠️  IMPORTANT: Vous devez d\'abord exécuter le fichier fix_rls_policies.sql dans Supabase !');
console.log('');
console.log('📋 Instructions:');
console.log('1. Ouvrez https://supabase.com/dashboard/project/bzcmpulivznmzbjggbyh/sql');
console.log('2. Copiez le contenu de fix_rls_policies.sql');
console.log('3. Exécutez le script SQL');
console.log('4. Relancez ce test');
console.log('');

const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Données de test simple
const testOpportunity = {
  id: randomUUID(),
  type: 'Stage',
  title: 'Test RLS - Stage Développeur',
  organization: 'Test Company',
  description: 'Test après correction RLS',
  full_content: 'Contenu de test',
  deadline: '2026-04-15',
  location: 'Cotonou, Bénin',
  image: null,
  link: 'https://example.com/test',
  contact_email: 'test@example.com',
  apply_method: 'email',
  reward: null,
  tags: ['Test', 'Stage'],
  salary: null,
  contract_type: null,
  duration: '3 MOIS',
  level: 'Licence 3',
  prizes: null,
  speakers: null,
  schedule: null,
  ai_greeting: 'Test de l\'interface admin',
  source_url: 'https://example.com/test',
  ai_confidence: 0.9,
  ai_processed: true,
  status: 'pending',
  admin_notes: null,
  reviewed_by: null,
  reviewed_at: null,
  original_content: 'Test content',
  extracted_data: {
    title: 'Test RLS - Stage Développeur',
    organization: 'Test Company',
    type: 'Stage',
    confidence: 0.9
  },
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString()
};

async function testAfterRLSFix() {
  try {
    console.log('🧪 Test d\'insertion après correction RLS...');

    const { data, error } = await supabase
      .from('pending_opportunities')
      .insert([testOpportunity])
      .select();

    if (error) {
      console.log('❌ Erreur persiste:', error.message);
      console.log('🔍 Code:', error.code);

      if (error.code === '42501') {
        console.log('');
        console.log('🚨 Les politiques RLS n\'ont pas été corrigées !');
        console.log('');
        console.log('📝 Exécutez ce SQL dans Supabase:');
        console.log('');
        console.log('-- Désactiver RLS temporairement pour les tests');
        console.log('ALTER TABLE pending_opportunities DISABLE ROW LEVEL SECURITY;');
        console.log('');
        console.log('-- OU créer une politique permissive:');
        console.log('CREATE POLICY "Allow all for testing" ON pending_opportunities FOR ALL USING (true) WITH CHECK (true);');
      }
      return;
    }

    console.log('✅ Insertion réussie !');
    console.log('🆔 ID créé:', data[0].id);

    // Vérifier la lecture
    const { data: readData, error: readError } = await supabase
      .from('pending_opportunities')
      .select('id, title, organization, status')
      .order('created_at', { ascending: false })
      .limit(5);

    if (readError) {
      console.log('❌ Erreur lecture:', readError.message);
    } else {
      console.log('✅ Lecture réussie !');
      console.log(`📊 ${readData?.length || 0} opportunités trouvées:`);

      readData?.forEach((opp, i) => {
        console.log(`  ${i + 1}. ${opp.title} - ${opp.organization} (${opp.status})`);
      });
    }

    // Nettoyer le test
    await supabase
      .from('pending_opportunities')
      .delete()
      .eq('id', testOpportunity.id);

    console.log('🧹 Test nettoyé');

    console.log('');
    console.log('🎯 SUCCÈS ! L\'interface admin devrait maintenant fonctionner.');
    console.log('💡 Vous pouvez maintenant tester l\'interface admin sur http://localhost:5173/admin-portal');

  } catch (error) {
    console.error('💥 Erreur:', error.message);
  }
}

testAfterRLSFix();