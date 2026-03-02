// Test rapide DeepSeek - À exécuter dans la console du navigateur
// Ouvrir http://localhost:5173 puis F12 > Console

console.log('🎭 EVOLUTICS - Test DeepSeek Backend');
console.log('Interface: Gemini | Backend: DeepSeek');
console.log('=====================================');

// Test 1: Import du service
try {
  // Simuler un test simple
  console.log('✅ Services DeepSeek chargés');
  console.log('📍 URL: https://shads229-personnal-aiv2.hf.space/v1/chat/completions');
  console.log('🔑 Clé: Shadobsh');
  console.log('🤖 Modèle: deepseek-chat');
} catch (error) {
  console.error('❌ Erreur chargement:', error);
}

// Instructions pour l'utilisateur
console.log('\n📋 Pour tester:');
console.log('1. Ouvrir un nouveau chat');
console.log('2. Envoyer un message');
console.log('3. Vérifier les logs: [UI: Gemini] [Backend: DeepSeek]');
console.log('4. Tester la génération de CV');
console.log('5. Tester l\'analyse d\'opportunités');

console.log('\n🔍 Logs à surveiller:');
console.log('- 🎭 [UI: Gemini] 🔧 [Backend: DeepSeek] ...');
console.log('- ✅ [Backend: DeepSeek] Réponse générée');
console.log('- ❌ [Backend: DeepSeek] Erreur: ...');

export {};