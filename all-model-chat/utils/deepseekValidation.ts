/**
 * Test de validation de l'implémentation DeepSeek
 * 🎭 Interface: L'utilisateur voit "Gemini" partout
 * 🔧 Backend: DeepSeek traite toutes les requêtes
 */

import { DeepSeekService } from '../services/deepseekService';

export class DeepSeekValidationTest {

  /**
   * Test de base - Vérifier la connectivité DeepSeek
   */
  static async testBasicConnectivity(): Promise<boolean> {
    try {
      console.log('🧪 Test de connectivité DeepSeek...');

      const response = await DeepSeekService.generateText(
        'Réponds simplement "CONNEXION_OK" pour confirmer que tu fonctionnes.',
        'Tu es un assistant de test. Réponds exactement ce qui est demandé.'
      );

      const isConnected = response.includes('CONNEXION_OK');

      if (isConnected) {
        console.log('✅ DeepSeek connecté et fonctionnel');
      } else {
        console.log('❌ DeepSeek répond mais format inattendu:', response);
      }

      return isConnected;
    } catch (error) {
      console.error('❌ Erreur connectivité DeepSeek:', error);
      return false;
    }
  }

  /**
   * Test du chat streaming
   */
  static async testChatStreaming(): Promise<boolean> {
    try {
      console.log('🧪 Test du streaming DeepSeek...');

      let receivedChunks = 0;
      let fullResponse = '';

      await DeepSeekService.generateStream([
        { role: 'user', content: 'Compte de 1 à 5, un chiffre par phrase.' }
      ], (chunk: string) => {
        receivedChunks++;
        fullResponse += chunk;
        console.log(`📦 Chunk ${receivedChunks}: "${chunk}"`);
      });

      const hasNumbers = /[1-5]/.test(fullResponse);

      if (hasNumbers && receivedChunks > 0) {
        console.log('✅ Streaming DeepSeek fonctionnel');
        return true;
      } else {
        console.log('❌ Streaming incomplet:', { receivedChunks, fullResponse });
        return false;
      }
    } catch (error) {
      console.error('❌ Erreur streaming DeepSeek:', error);
      return false;
    }
  }

  /**
   * Test de génération JSON (pour CV et analyse)
   */
  static async testJsonGeneration(): Promise<boolean> {
    try {
      console.log('🧪 Test génération JSON DeepSeek...');

      const response = await DeepSeekService.generateText(
        'Génère un objet JSON simple avec les clés "nom" et "age". Exemple: {"nom": "Test", "age": 25}',
        'Tu réponds exclusivement en JSON valide.'
      );

      const jsonMatch = response.match(/\{.*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        if (parsed.nom && parsed.age) {
          console.log('✅ Génération JSON DeepSeek fonctionnelle');
          return true;
        }
      }

      console.log('❌ JSON invalide:', response);
      return false;
    } catch (error) {
      console.error('❌ Erreur génération JSON DeepSeek:', error);
      return false;
    }
  }

  /**
   * Test complet de validation
   */
  static async runFullValidation(): Promise<void> {
    console.log('🚀 === VALIDATION DEEPSEEK BACKEND ===');
    console.log('🎭 Interface utilisateur: Affiche "Gemini"');
    console.log('🔧 Backend réel: DeepSeek');
    console.log('');

    const tests = [
      { name: 'Connectivité de base', test: this.testBasicConnectivity },
      { name: 'Streaming chat', test: this.testChatStreaming },
      { name: 'Génération JSON', test: this.testJsonGeneration }
    ];

    let passedTests = 0;

    for (const { name, test } of tests) {
      console.log(`\n📋 Test: ${name}`);
      const result = await test();
      if (result) {
        passedTests++;
      }
    }

    console.log('\n' + '='.repeat(50));
    console.log(`📊 Résultats: ${passedTests}/${tests.length} tests réussis`);

    if (passedTests === tests.length) {
      console.log('🎉 SUCCÈS: DeepSeek backend entièrement fonctionnel !');
      console.log('🎭 Les utilisateurs verront "Gemini" mais utiliseront DeepSeek');
    } else {
      console.log('⚠️  ATTENTION: Certains tests ont échoué');
    }
    console.log('='.repeat(50));
  }

  /**
   * Test de santé rapide (pour monitoring)
   */
  static async quickHealthCheck(): Promise<boolean> {
    try {
      return await DeepSeekService.healthCheck();
    } catch {
      return false;
    }
  }
}

// Export pour utilisation dans la console du navigateur
(window as any).DeepSeekTest = DeepSeekValidationTest;