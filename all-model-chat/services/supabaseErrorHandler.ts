// Utilitaire pour gérer les erreurs Supabase récurrentes
export const handleSupabaseError = (error: any, operation: string) => {
  console.error(`Erreur Supabase (${operation}):`, error);

  // Gestion spécifique des erreurs AbortError
  if (error?.message?.includes('AbortError') || error?.message?.includes('signal is aborted')) {
    console.warn('Conflit de session Supabase détecté - tentative de récupération...');

    // Nettoyer le localStorage pour éviter les conflits futurs
    try {
      localStorage.removeItem('evolutics-auth-token');
      localStorage.removeItem('evolutics-admin-token');
      localStorage.removeItem('sb-bzcmpulivznmzbjggbyh-auth-token');
    } catch (e) {
      console.warn('Impossible de nettoyer le localStorage:', e);
    }

    // Suggérer à l'utilisateur de rafraîchir la page
    const shouldRefresh = confirm(
      'Un conflit de session a été détecté. Voulez-vous rafraîchir la page pour résoudre le problème ?'
    );

    if (shouldRefresh) {
      window.location.reload();
    }

    return;
  }

  // Autres erreurs Supabase
  throw error;
};

// Wrapper pour les opérations Supabase avec retry automatique
export const withSupabaseRetry = async (operation: () => Promise<any>, operationName: string, maxRetries = 2) => {
  let lastError;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;

      // Si c'est une AbortError, essayer de récupérer
      if (error?.message?.includes('AbortError') && attempt < maxRetries) {
        console.warn(`Tentative ${attempt + 1}/${maxRetries + 1} échouée pour ${operationName}, retry...`);

        // Attendre un peu avant de retry
        await new Promise(resolve => setTimeout(resolve, 1000 * (attempt + 1)));
        continue;
      }

      // Si ce n'est pas une AbortError ou si on a épuisé les tentatives
      handleSupabaseError(error, operationName);
      break;
    }
  }

  throw lastError;
};