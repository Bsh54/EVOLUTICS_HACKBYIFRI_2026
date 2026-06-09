/**
 * Utilitaires pour la gestion des dates et des opportunités expirées
 */

/**
 * Vérifie si une opportunité est expirée
 * @param deadline - Date limite au format YYYY-MM-DD ou null
 * @returns true si l'opportunité est expirée, false sinon
 */
export const isOpportunityExpired = (deadline: string | null): boolean => {
  if (!deadline) return false; // Pas de deadline = jamais expirée

  const today = new Date();
  const deadlineDate = new Date(deadline);

  // Comparer seulement les dates (ignorer l'heure)
  today.setHours(0, 0, 0, 0);
  deadlineDate.setHours(0, 0, 0, 0);

  return deadlineDate < today;
};

/**
 * Filtre les opportunités non expirées
 * @param opportunities - Liste des opportunités
 * @returns Liste filtrée sans les opportunités expirées
 */
export const filterActiveOpportunities = <T extends { deadline: string | null }>(
  opportunities: T[]
): T[] => {
  return opportunities.filter(opp => !isOpportunityExpired(opp.deadline));
};

/**
 * Obtient la date d'aujourd'hui au format YYYY-MM-DD
 * @returns Date d'aujourd'hui formatée
 */
export const getTodayString = (): string => {
  return new Date().toISOString().split('T')[0];
};

/**
 * Calcule le nombre de jours restants avant la deadline
 * @param deadline - Date limite au format YYYY-MM-DD
 * @returns Nombre de jours restants (négatif si expiré)
 */
export const getDaysUntilDeadline = (deadline: string | null): number | null => {
  if (!deadline) return null;

  const today = new Date();
  const deadlineDate = new Date(deadline);

  today.setHours(0, 0, 0, 0);
  deadlineDate.setHours(0, 0, 0, 0);

  const diffTime = deadlineDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  return diffDays;
};