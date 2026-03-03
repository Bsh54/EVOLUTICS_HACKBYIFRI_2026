/**
 * Utilitaires de diagnostic pour déboguer les problèmes de sessions
 */

import { dbService } from './db';

export const diagnostics = {
  /**
   * Affiche toutes les sessions stockées dans IndexedDB
   */
  async listAllSessions() {
    try {
      const sessions = await dbService.getAllSessions();
      console.log('=== DIAGNOSTIC: Sessions dans IndexedDB ===');
      console.log(`Nombre total de sessions: ${sessions.length}`);
      console.log('\nDétails des sessions:');
      sessions.forEach((session, index) => {
        console.log(`\n${index + 1}. ${session.title}`);
        console.log(`   ID: ${session.id}`);
        console.log(`   Messages: ${session.messages?.length || 0}`);
        console.log(`   Date: ${new Date(session.timestamp).toLocaleString()}`);
        console.log(`   Épinglée: ${session.isPinned ? 'Oui' : 'Non'}`);
      });
      console.log('\n=== FIN DU DIAGNOSTIC ===');
      return sessions;
    } catch (error) {
      console.error('Erreur lors du diagnostic:', error);
      return [];
    }
  },

  /**
   * Vérifie s'il y a des sessions dupliquées
   */
  async checkDuplicates() {
    const sessions = await dbService.getAllSessions();
    const ids = sessions.map(s => s.id);
    const duplicates = ids.filter((id, index) => ids.indexOf(id) !== index);
    
    if (duplicates.length > 0) {
      console.warn('⚠️ Sessions dupliquées détectées:', duplicates);
    } else {
      console.log('✅ Aucune session dupliquée');
    }
    
    return duplicates;
  },

  /**
   * Compte les sessions par type
   */
  async countSessionTypes() {
    const sessions = await dbService.getAllSessions();
    const empty = sessions.filter(s => !s.messages || s.messages.length === 0);
    const withMessages = sessions.filter(s => s.messages && s.messages.length > 0);
    const pinned = sessions.filter(s => s.isPinned);
    
    console.log('=== STATISTIQUES DES SESSIONS ===');
    console.log(`Total: ${sessions.length}`);
    console.log(`Vides: ${empty.length}`);
    console.log(`Avec messages: ${withMessages.length}`);
    console.log(`Épinglées: ${pinned.length}`);
    console.log('=================================');
    
    return { total: sessions.length, empty: empty.length, withMessages: withMessages.length, pinned: pinned.length };
  }
};

// Exposer globalement pour utilisation dans la console
if (typeof window !== 'undefined') {
  (window as any).chatDiagnostics = diagnostics;
}
