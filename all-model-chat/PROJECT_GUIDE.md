# 🗺️ Guide de Structure - My AI Front (Version ShadsAI)

Ce document explique le rôle de chaque dossier et fichier important pour vous permettre de modifier rapidement l'interface visuelle ou le comportement de l'application.

---

## 📂 Architecture Globale

### 1. `components/` (Le cœur de l'UI)
C'est ici que se trouve tout ce qui est visible à l'écran. Le code est très modulaire.

*   **`chat/`** : Gère l'ossature du chat.
    *   `MessageList.tsx` : La liste infinie des messages. C'est ici qu'on gère le défilement et le rendu global de la conversation.
    *   **`input/`** : La barre d'écriture en bas.
        *   `ChatInput.tsx` : Composant principal de saisie.
        *   `ChatTextArea.tsx` : La zone de texte qui s'agrandit toute seule.
        *   `AttachmentMenu.tsx` : Le menu qui s'ouvre pour ajouter des fichiers.
*   **`message/`** : Comment un message individuel est affiché.
    *   `Message.tsx` : Le conteneur d'un message (bulles, avatar).
    *   `MarkdownRenderer.tsx` : Transforme le texte de l'IA en joli HTML (gras, listes, etc.).
    *   `blocks/` : Les éléments complexes dans les messages (Code, Tableaux, Diagrammes Mermaid).
    *   `content/MessageThoughts.tsx` : Affiche le processus de réflexion (Thinking) du modèle.
*   **`settings/`** : Toute l'interface des réglages.
    *   `SettingsModal.tsx` : La fenêtre modale principale des paramètres.
    *   `sections/` : Chaque onglet des réglages (Apparence, Comportement, etc.).
*   **`shared/`** : Composants réutilisables (Boutons, Toggles, Tooltips, Modales de base).
*   **`sidebar/`** : La barre latérale gauche (Historique des discussions).

### 2. `hooks/` (La logique métier)
Si vous voulez changer *comment* les choses fonctionnent plutôt que leur apparence.

*   `useChat.ts` : Le "cerveau" du chat. Il orchestre l'envoi, la réception, l'historique et les fichiers.
*   `useMessageSender.ts` : Prépare les données avant de les envoyer à l'API.
*   `useModels.ts` : Gère la liste des modèles (désormais verrouillée sur Gemini 2.5 Flash).
*   `ui/` : Hooks spécifiques à l'interface (gestion du plein écran, thèmes, défilement).

### 3. `services/` (La communication API)
C'est ici que nous avons fait les plus grosses modifications techniques.

*   **`api/chatApi.ts`** : **CRUCIAL.** Contient la logique d'appel à votre Worker Cloudflare. C'est ici qu'on a configuré le format OpenAI et le streaming.
*   `api/baseApi.ts` : Configure le client HTTP et force l'URL de votre point d'accès.
*   `geminiService.ts` : L'interface unifiée pour tous les services de l'application.

### 4. `constants/` (La configuration statique)
C'est ici qu'on change les valeurs "en dur".

*   **`modelConstants.ts`** : Contient l'ID de votre modèle (`gemini-2.5-flash`).
*   **`appConstants.ts`** : Contient votre URL Cloudflare par défaut et la clé `sk-dummy`.
*   `themeConstants.ts` : Si vous voulez changer les couleurs des thèmes (Pearl, Dark, etc.).

### 5. `utils/` (Les outils secondaires)
*   `apiUtils.ts` : Gestion des clés API et de la rotation (modifié pour forcer votre clé).
*   `modelHelpers.ts` : Fonctions d'aide pour identifier les capacités des modèles.
*   `markdownConfig.ts` : Configuration du rendu visuel du texte.

---

## 🛠️ Ce que vous pouvez faire (Guide Rapide)

### Modifier les couleurs ou le style
1.  Allez dans `my-ai-front/styles/main.css` pour les variables globales.
2.  Regardez `my-ai-front/constants/themeConstants.ts` pour modifier les thèmes prédéfinis.
3.  L'application utilise **Tailwind CSS**, vous pouvez donc ajouter des classes directement dans les fichiers `.tsx`.

### Changer le message d'accueil
*   Modifiez `my-ai-front/utils/translations/app.ts` (recherchez la clé `welcome_greeting`).

### Modifier le format des messages envoyés à l'IA
*   Tout se passe dans `my-ai-front/services/api/chatApi.ts`, dans la fonction `convertToOpenAIHistory`.

### Ajouter un nouveau composant visuel dans le chat
*   Créez votre composant dans `components/message/blocks/`.
*   Enregistrez-le dans `components/message/MessageContent.tsx`.

---

## 📦 Dépendances et Support

| Fonctionnalité | Supporté | Fichier Clé |
| :--- | :--- | :--- |
| **Chat Texte** | ✅ Oui | `chatApi.ts` |
| **Streaming** | ✅ Oui | `chatApi.ts` |
| **Images (Vision)** | ✅ Oui (Base64) | `chatApi.ts` |
| **PDF / Fichiers** | ✅ Oui (Local) | `fileApi.ts` |
| **Thinking (Pensées)** | ✅ Oui | `MessageThoughts.tsx` |
| **Audio (Vocal)** | ❌ Non (Désactivé) | `audioApi.ts` |
| **Génération Image** | ❌ Non (Désactivé) | `imageApi.ts` |

---

## 🚀 Comment lancer les modifications
Après chaque modification de code :
1.  Le serveur Vite (lancé par `npm run dev`) se rafraîchit automatiquement.
2.  Si vous ajoutez une icône ou une bibliothèque, faites un `npm install`.

---
*Guide généré pour l'infrastructure ShadsAI.*
