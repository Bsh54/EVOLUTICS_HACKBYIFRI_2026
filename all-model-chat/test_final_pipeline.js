/**
 * Test final de l'endpoint pending_opportunities
 */
function testerEndpointFinal() {
  console.log('🎯 Test final de l\'endpoint pending_opportunities...');

  try {
    // Test 1: Lecture de la table
    console.log('📖 Test lecture table...');
    const readResponse = UrlFetchApp.fetch(`${CONFIG.supabaseUrl}/rest/v1/pending_opportunities?limit=3`, {
      method: 'GET',
      headers: {
        'apikey': CONFIG.supabaseKey,
        'Authorization': `Bearer ${CONFIG.supabaseKey}`,
        'Content-Type': 'application/json'
      },
      muteHttpExceptions: true,
      timeout: 15000
    });

    console.log(`Lecture: HTTP ${readResponse.getResponseCode()}`);
    console.log(`Réponse: ${readResponse.getContentText()}`);

    if (readResponse.getResponseCode() === 200) {
      const data = JSON.parse(readResponse.getContentText());
      console.log(`✅ Table accessible - ${Array.isArray(data) ? data.length : 0} enregistrements`);

      // Test 2: Insertion test
      console.log('📝 Test insertion...');
      const testData = {
        type: 'Stage',
        title: 'Test Final EVOLUTICS',
        organization: 'Test Organization',
        description: 'Test final de connexion',
        source_url: 'https://test.evolutics.com',
        ai_confidence: 0.95,
        ai_processed: true,
        status: 'pending'
      };

      const insertResponse = UrlFetchApp.fetch(`${CONFIG.supabaseUrl}/rest/v1/pending_opportunities`, {
        method: 'POST',
        headers: {
          'apikey': CONFIG.supabaseKey,
          'Authorization': `Bearer ${CONFIG.supabaseKey}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=minimal'
        },
        payload: JSON.stringify(testData),
        muteHttpExceptions: true
      });

      console.log(`Insertion: HTTP ${insertResponse.getResponseCode()}`);

      if (insertResponse.getResponseCode() === 201) {
        console.log('✅ INSERTION RÉUSSIE !');
        console.log('🎉 PIPELINE EVOLUTICS COMPLÈTEMENT FONCTIONNEL !');
        console.log('');
        console.log('🚀 VOUS POUVEZ MAINTENANT LANCER:');
        console.log('   - executionAutomatique() pour un test complet');
        console.log('   - demarrerVeilleAvecDeepSeek() pour activer le système');
        return true;
      } else {
        console.log(`❌ Erreur insertion: ${insertResponse.getContentText()}`);
        return false;
      }

    } else if (readResponse.getResponseCode() === 404) {
      console.log('❌ Table pending_opportunities n\'existe pas');
      console.log('💡 Vous devez exécuter le script SQL supabase_pending_opportunities_schema.sql');
      return false;
    } else {
      console.log(`❌ Erreur lecture: ${readResponse.getContentText()}`);
      return false;
    }

  } catch (error) {
    console.log('❌ Erreur test final:', error.toString());
    return false;
  }
}

/**
 * Lancement du pipeline complet
 */
function lancerPipelineComplet() {
  console.log('🚀 LANCEMENT DU PIPELINE EVOLUTICS COMPLET');
  console.log('==========================================');

  try {
    // Test final
    const testOK = testerEndpointFinal();

    if (testOK) {
      console.log('');
      console.log('🎯 Lancement de l\'exécution automatique...');
      const resultat = executionAutomatique();

      console.log('');
      console.log('📊 RÉSULTAT FINAL:');
      console.log(JSON.stringify(resultat, null, 2));

      if (resultat.success) {
        console.log('');
        console.log('🎉 SUCCÈS TOTAL ! PIPELINE EVOLUTICS OPÉRATIONNEL !');
        console.log('✅ Le système peut maintenant fonctionner automatiquement');
        console.log('⏰ Prochaine exécution dans 2 heures');
      }

      return resultat;
    } else {
      console.log('❌ Tests préliminaires échoués');
      return { success: false, error: 'Tests préliminaires échoués' };
    }

  } catch (error) {
    console.error('❌ Erreur pipeline complet:', error);
    return { success: false, error: error.toString() };
  }
}