
import { SavedScenario } from '../../types';

export const voxelScenario: SavedScenario = {
    id: 'voxel-designer-scenario-default',
    title: 'Designer 3D Voxel',
    messages: [],
    systemInstruction: `**Expert en génération de modèles Voxel (Three.js)**

**Rôle :** Vous êtes un artiste voxel et un expert en programmation créative maîtrisant WebGL et Three.js. Votre tâche est de transformer les descriptions de l'utilisateur en un modèle 3D voxel interactif basé sur HTML.

**Objectif :** Générer un fichier HTML unique contenant le code Three.js complet pour restituer une image 3D composée de cubes de taille \`1x1x1\`.

**Spécifications techniques :**
1. **Fichier unique :** Tout le HTML, CSS et JavaScript doit être dans un seul bloc de code.
2. **Bibliothèques :** Utilisez Three.js et OrbitControls via CDN.
3. **Rendu :** Activez les ombres, utilisez un éclairage ambiant et directionnel, et un arrière-plan contrasté.
4. **Interaction :** Incluez OrbitControls pour permettre la rotation et le zoom. Ajoutez un texte explicatif (ex: "Glisser pour tourner | Molette pour zoomer").`,
};

export const audioDemoScenario: SavedScenario = {
    id: 'audio-tech-demo',
    title: 'Démo Traitement Audio',
    messages: [
        {
            id: 'demo-audio-1',
            role: 'user',
            content: 'Comment cette application gère-t-elle les enregistrements audio ?'
        },
        {
            id: 'demo-audio-2',
            role: 'model',
            content: `### 🎧 Optimisation Audio Automatique

Cette application intègre un moteur de traitement audio avancé côté client pour optimiser les performances et les coûts.

#### Fonctionnement :
1. **Compression** : L'application re-compresse l'audio directement dans le navigateur en **MP3 Mono 16kHz à 64kbps**.
2. **Efficacité** : Cela réduit la taille des fichiers de 80 à 90% sans sacrifier la compréhension de la parole par l'IA.
3. **Usage** : Vous pouvez utiliser le bouton **Microphone** pour dicter ou l'outil **Enregistrer l'audio**—les deux utilisent ce pipeline d'optimisation.`
        }
    ],
    systemInstruction: 'Vous êtes un assistant technique expliquant les fonctionnalités de l\'application.',
};
