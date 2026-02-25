// Avatars par défaut — SVG data URI intégrés (aucun chargement externe)
// Chaque avatar : fond gradient + silhouette personne blanche

const GRADIENTS: [string, string][] = [
  ['%23667eea', '%23764ba2'], // Indigo → Violet
  ['%23f093fb', '%23f5576c'], // Rose → Rouge
  ['%234facfe', '%2300f2fe'], // Bleu → Cyan
  ['%2343e97b', '%2338f9d7'], // Vert → Turquoise
  ['%23fa709a', '%23fee140'], // Rose → Jaune
  ['%23a18cd1', '%23fbc2eb'], // Lavande → Rose
  ['%23fccb90', '%23d57eeb'], // Orange → Violet
  ['%2330cfd0', '%23330867'], // Cyan → Indigo foncé
];

// SVG pré-encodés (le %23 remplace # pour les couleurs dans les data URI)
const AVATARS: string[] = GRADIENTS.map(([from, to]) =>
  `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0' y1='0' x2='1' y2='1'%3E%3Cstop offset='0%25' stop-color='${from}'/%3E%3Cstop offset='100%25' stop-color='${to}'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='100' height='100' fill='url(%23g)'/%3E%3Ccircle cx='50' cy='36' r='14' fill='white' opacity='.85'/%3E%3Cpath d='M50 54C33 54 25 67 25 82L75 82C75 67 67 54 50 54Z' fill='white' opacity='.85'/%3E%3C/svg%3E`
);

/**
 * Retourne un avatar par défaut déterministe basé sur un seed (userId, email, etc.)
 * Le même seed retourne toujours le même avatar.
 */
export function getDefaultAvatar(seed: string): string {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = ((hash << 5) - hash) + seed.charCodeAt(i);
    hash |= 0;
  }
  return AVATARS[Math.abs(hash) % AVATARS.length];
}
