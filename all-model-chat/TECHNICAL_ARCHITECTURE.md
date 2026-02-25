# 🏗️ Architecture Technique - My AI Front (ShadsAI)

Ce document offre une analyse profonde de la structure du code pour faciliter les modifications complexes et la compréhension du flux de données.

---

## 🌊 Flux de Données Principal (Data Flow)

Voici comment une action utilisateur (taper un message) se transforme en réponse à l'écran :

1.  **Saisie :** `ChatTextArea.tsx` capte le texte.
2.  **Validation :** `useChatInputLogic.ts` vérifie si le message peut être envoyé.
3.  **Envoi :** `useMessageHandler.ts` appelle `handleSendMessage`.
4.  **Préparation :** `useStandardChat.ts` transforme les fichiers et le texte en "Parts" Gemini.
5.  **Service :** `geminiService.ts` appelle `sendMessageStream`.
6.  **API :** `chatApi.ts` convertit le tout au format OpenAI et lance le `fetch` vers votre Worker Cloudflare.
7.  **Réception :** Le flux (stream) est lu ligne par ligne dans `chatApi.ts`, les morceaux de texte et de pensées sont renvoyés aux hooks.
8.  **Affichage :** `streamingStore.ts` met à jour l'état en temps réel, et `MessageList.tsx` rafraîchit l'interface.

---

## 📁 Analyse Détaillée par Dossier

### 📂 `my-ai-front/services/`
C'est la couche d'abstraction réseau.
*   **`api/chatApi.ts`** : Le fichier le plus important pour votre configuration.
    *   `convertToOpenAIHistory` : Traduit le format Google (rôles `user`/`model`) vers le format OpenAI (rôles `user`/`assistant`). Gère aussi la conversion des images en `image_url`.
    *   `sendStatelessMessageStreamApi` : Gère la connexion HTTP POST, les headers d'autorisation, et le parsing du flux SSE (Server-Sent Events).
*   **`api/baseApi.ts`** :
    *   `getConfiguredApiClient` : Nous l'avons modifié pour qu'il renvoie toujours votre URL Worker, bypassant les réglages utilisateur.
*   **`logService.ts`** : Centralise tous les logs de l'application (erreurs, infos, debug) dans la console et dans l'onglet "Logs" de l'interface.

### 📂 `my-ai-front/hooks/`
C'est ici que réside la "mémoire vive" et la logique réactive de l'app.
*   **`chat/useChatState.ts`** : Définit l'état global (messages, sessions actives, fichiers sélectionnés). Si vous voulez ajouter une nouvelle variable globale, c'est ici.
*   **`chat/useChatHistory.ts`** : Gère la persistance dans `IndexedDB`. C'est ce qui fait que vos conversations sont sauvegardées quand vous rafraîchissez la page.
*   **`ui/useSmoothStreaming.ts`** : Une pépite technique. Il lisse l'affichage du texte qui arrive de l'IA pour éviter les saccades visuelles et donner un effet d'écriture naturelle.
*   **`core/useModels.ts`** : Désormais verrouillé. Il assure que l'application ne "voit" que votre modèle Gemini 2.5 Flash.

### 📂 `my-ai-front/components/`
La partie visuelle (React + Tailwind).
*   **`message/MarkdownRenderer.tsx`** : Utilise `react-markdown`. Il contient les règles de transformation pour le code (syntax highlighting), les formules mathématiques (KaTeX) et les liens.
*   **`message/content/MessageThoughts.tsx`** : Spécifique aux modèles de raisonnement. Il affiche le bloc escamotable "Pensées" quand le modèle utilise `reasoning_content`.
*   **`layout/ChatArea.tsx`** : Le conteneur principal qui assemble la barre latérale, l'en-tête et la zone de chat.
*   **`shared/ModelPicker.tsx`** : Bien que nous l'ayons désactivé visuellement, il reste dans le code. C'est le composant qui gérait les listes déroulantes de modèles.

### 📂 `my-ai-front/utils/`
Les boîtes à outils.
*   **`db.ts`** : Configuration de `Dexie.js` (IndexedDB). Définit les tables `sessions`, `messages` et `settings`.
*   **`apiUtils.ts`** : Contient la logique de nettoyage des clés API. Nous l'avons forcé pour toujours renvoyer votre clé.
*   **`uiUtils.ts`** : Petites fonctions pour gérer les classes CSS, les dates et le formatage des noms de fichiers.

### 📂 `my-ai-front/styles/`
*   **`main.css`** : Contient les variables de thèmes (couleurs, arrondis, ombres).
*   **`animations.css`** : Définit les effets de transition (fondu, glissement, clignotement du curseur).

---

## 🛠️ Guide de Modification Visuelle Rapide

### Changer une couleur de thème
Allez dans `constants/themeConstants.ts`. Chaque thème est un objet JS. Modifiez `bgPrimary`, `textPrimary`, ou `bgAccent` (la couleur des boutons/liens).

### Modifier la largeur de la barre latérale
Cherchez `SidePanel.tsx` dans `components/layout/`. La largeur est gérée par des classes Tailwind comme `w-64` ou `w-72`.

### Changer l'icône de l'application
Remplacez le contenu de `components/icons/AppLogo.tsx`. C'est un composant SVG.

### Modifier le comportement de la touche Entrée
Tout se passe dans `hooks/chat-input/handlers/useKeyboardHandlers.ts`. Vous pouvez y configurer si Entrée envoie le message ou crée une nouvelle ligne.

---

## ⚠️ Points d'attention pour vos futurs développements
1.  **Multimodal :** Si vous ajoutez le support d'autres fichiers (ex: Vidéo), vous devrez mettre à jour `convertToOpenAIHistory` dans `chatApi.ts` pour gérer le nouveau type MIME.
2.  **Streaming :** Votre Worker Cloudflare **doit** renvoyer des données au format `data: {...}` pour que le streaming fonctionne. S'il change de format, le parsing dans `chatApi.ts` devra être ajusté.
3.  **Local Storage :** L'application stocke les réglages de thème et de langue dans le `localStorage`. Si l'interface ne se met pas à jour, videz le cache de votre navigateur.

---
*Documentation technique générée le 11 février 2026.*
