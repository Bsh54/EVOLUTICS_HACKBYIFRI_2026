/**
 * Script de test pour l'endpoint API pending-opportunities
 * Simule l'envoi de données depuis Google Apps Script
 */

// Données de test simulant ce que Google Apps Script enverrait
const testOpportunity = {
  type: "Stage",
  title: "Stage Développeur Full-Stack - Test API",
  organization: "TechCorp Test",
  description: "Stage de développement web pour tester l'API EVOLUTICS",
  fullContent: "## Stage Développeur Full-Stack\n\nNous recherchons un stagiaire motivé...",
  deadline: "2026-04-15",
  location: "Cotonou, Bénin",
  image: "https://example.com/logo.png",
  link: "https://example.com/stage-test",
  contactEmail: "recrutement@techcorp-test.com",
  applyMethod: "email",
  tags: ["Stage", "Développement", "JavaScript", "React"],
  level: "Licence 3",
  duration: "6 MOIS",
  aiGreeting: "Découvrez cette opportunité de stage chez TechCorp Test !",
  confidence: 0.9,
  sourceUrl: "https://example.com/stage-test",
  originalContent: "Contenu HTML original de la page...",
  extractedData: {
    title: "Stage Développeur Full-Stack - Test API",
    organization: "TechCorp Test",
    type: "Stage",
    confidence: 0.9
  }
};

async function testAPI() {
  const API_URL = 'http://localhost:3001/api/pending-opportunities';

  console.log('🧪 Test de l\'API EVOLUTICS...');
  console.log('📡 URL:', API_URL);
  console.log('');

  try {
    // Test 1: Health check
    console.log('🏥 Test 1: Health check...');
    const healthResponse = await fetch('http://localhost:3001/api/health');

    if (healthResponse.ok) {
      const healthData = await healthResponse.json();
      console.log('✅ Health check OK:', healthData.message);
    } else {
      console.log('❌ Health check échoué');
      return;
    }

    console.log('');

    // Test 2: Envoi d'une opportunité
    console.log('📤 Test 2: Envoi d\'une opportunité...');
    console.log('📋 Données envoyées:');
    console.log(`  - Titre: ${testOpportunity.title}`);
    console.log(`  - Organisation: ${testOpportunity.organization}`);
    console.log(`  - Type: ${testOpportunity.type}`);
    console.log(`  - Confiance IA: ${testOpportunity.confidence}`);

    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testOpportunity)
    });

    console.log('📡 Statut de la réponse:', response.status);

    const responseData = await response.json();

    if (response.ok) {
      console.log('✅ Opportunité créée avec succès !');
      console.log('🆔 ID généré:', responseData.id);
      console.log('📊 Statut:', responseData.status);
      console.log('💬 Message:', responseData.message);
    } else {
      console.log('❌ Erreur lors de la création:');
      console.log('📝 Détails:', responseData.error);
      if (responseData.details) {
        console.log('🔍 Plus d\'infos:', responseData.details);
      }
    }

    console.log('');

    // Test 3: Vérification dans Supabase
    console.log('🔍 Test 3: Vérification dans Supabase...');

    // Utiliser notre script de test existant pour vérifier
    const { createClient } = await import('@supabase/supabase-js');

    const supabase = createClient(
      'https://bzcmpulivznmzbjggbyh.supabase.co',
      'sb_publishable_RvZZojymg2-eFROVdVT2-Q_E4MvbH1v'
    );

    const { data: pendingOpps, error } = await supabase
      .from('pending_opportunities')
      .select('id, title, organization, status, created_at')
      .order('created_at', { ascending: false })
      .limit(3);

    if (error) {
      console.log('❌ Erreur vérification Supabase:', error.message);
    } else {
      console.log('✅ Vérification Supabase réussie');
      console.log(`📊 ${pendingOpps?.length || 0} opportunités en attente trouvées`);

      if (pendingOpps && pendingOpps.length > 0) {
        console.log('📋 Dernières opportunités:');
        pendingOpps.forEach((opp, i) => {
          console.log(`  ${i + 1}. ${opp.title} - ${opp.organization} (${opp.status})`);
        });
      }
    }

  } catch (error) {
    console.error('💥 Erreur lors du test:', error.message);

    if (error.code === 'ECONNREFUSED') {
      console.log('');
      console.log('🚨 Le serveur API n\'est pas démarré !');
      console.log('💡 Lancez d\'abord: node server.js');
    }
  }

  console.log('');
  console.log('🏁 Test terminé');
}

// Exécuter le test
testAPI();