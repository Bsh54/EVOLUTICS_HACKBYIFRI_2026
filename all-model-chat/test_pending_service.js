/**
 * Test simple pour vérifier si l'interface admin récupère les données
 */

import { pendingOpportunityService } from './services/pendingOpportunityService.js';

console.log('🔍 Test direct du service pendingOpportunityService');
console.log('='.repeat(50));

async function testPendingService() {
  try {
    console.log('📡 Appel de pendingOpportunityService.getAll()...');

    const opportunities = await pendingOpportunityService.getAll();

    console.log(`✅ Service fonctionne: ${opportunities.length} opportunités récupérées`);

    if (opportunities.length > 0) {
      console.log('\n📋 Première opportunité:');
      const first = opportunities[0];
      console.log(`   - ID: ${first.id}`);
      console.log(`   - Titre: ${first.title}`);
      console.log(`   - Type: ${first.type}`);
      console.log(`   - Status: ${first.status}`);
      console.log(`   - Organisation: ${first.organization}`);
    }

    // Test avec filtre status = 'pending'
    console.log('\n📡 Test avec filtre status="pending"...');
    const pendingOnly = await pendingOpportunityService.getAll('pending');
    console.log(`✅ Opportunités pending: ${pendingOnly.length}`);

    // Test des stats
    console.log('\n📊 Test des statistiques...');
    const stats = await pendingOpportunityService.getStats();
    console.log('Stats:', stats);

  } catch (error) {
    console.error('❌ Erreur dans le service:', error.message);
    console.error('Stack:', error.stack);
  }
}

testPendingService();