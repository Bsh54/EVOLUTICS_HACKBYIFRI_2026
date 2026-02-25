# 📖 Dictionnaire des Fichiers - My AI Front

Ce document liste chaque fichier important du projet et explique son rôle précis pour vous aider dans vos modifications.

---

## 📂 Racine du projet (`my-ai-front/`)
| Fichier | Rôle |
| :--- | :--- |
| `App.tsx` | Point d'entrée React. Assemble le Layout global et les fournisseurs de contexte. |
| `index.tsx` | Initialise React et attache l'application au DOM (HTML). |
| `vite.config.ts` | Configuration du build. Gère les alias de dossiers et les plugins (React, PWA). |
| `tsconfig.json` | Configuration de TypeScript (règles de typage et compilation). |
| `package.json` | Liste les dépendances (React, Lucide, etc.) et les commandes (npm run dev). |
| `sw.js` | Service Worker. Gère le cache pour que l'app fonctionne hors-ligne. |

---

## 📂 `components/` (Interface Utilisateur)

### 📂 `chat/`
- `MessageList.tsx` : Gère le rendu de la conversation et le défilement automatique.
- `ChatInput.tsx` : Conteneur principal de la barre de saisie en bas.
- `AttachmentMenu.tsx` : Menu contextuel pour uploader des fichiers/photos.
- `LiveStatusBanner.tsx` : Petite bannière affichant l'état de la connexion.

### 📂 `message/`
- `Message.tsx` : Structure d'une bulle de message (Header, Contenu, Actions).
- `MarkdownRenderer.tsx` : Le moteur qui transforme le texte en HTML riche.
- `FileDisplay.tsx` : Affiche les miniatures des images ou documents dans le chat.
- `MessageActions.tsx` : Boutons de copie, régénération et suppression sous les messages.
- `ThinkingTimer.tsx` : Affiche le temps que le modèle a passé à "réfléchir".

### 📂 `settings/`
- `SettingsModal.tsx` : La fenêtre surgissante des paramètres.
- `SettingsSidebar.tsx` : Le menu de navigation à gauche dans les paramètres.
- `ModelVoiceSettings.tsx` : Réglages de la température, du Top-P et du système de prompt.
- `sections/AppearanceSection.tsx` : Choix du thème, de la langue et de la taille de police.
- `sections/ApiConfigSection.tsx` : (Verrouillé) Information sur votre point d'accès ShadsAI.

---

## 📂 `hooks/` (Logique et État)

### 📂 `chat/`
- `useChat.ts` : Crochet principal coordonnant l'historique et les messages.
- `useChatState.ts` : Définition de l'état réactif (variables `messages`, `isLoading`, etc.).
- `useChatHistory.ts` : Sauvegarde et chargement depuis la base de données locale.
- `useAutoTitling.ts` : Demande au modèle de générer un titre court après les premiers messages.

### 📂 `message-sender/`
- `useStandardChat.ts` : Prépare l'objet de requête final avant l'envoi à l'API.
- `useChatStreamHandler.ts` : Gère la réception du flux de texte en temps réel.
- `useApiErrorHandler.ts` : Intercepte les erreurs réseau et les affiche joliment.

### 📂 `ui/`
- `useSmoothStreaming.ts` : Algorithme pour rendre l'apparition du texte plus fluide.
- `useCodeBlock.ts` : Logique pour copier le code ou détecter le langage de programmation.

---

## 📂 `services/` (Communication)

### 📂 `api/`
- `chatApi.ts` : **Le moteur OpenAI/Cloudflare.** Transforme vos messages pour votre Worker.
- `baseApi.ts` : Initialisation du client HTTP et forçage de l'URL ShadsAI.
- `generation/textApi.ts` : Fonctions pour les titres et les suggestions automatiques.
- `generation/tokenApi.ts` : Estimateur de consommation de tokens.

---

## 📂 `utils/` (Utilitaires)

- `db.ts` : Configuration de la base de données IndexedDB (sessions et messages).
- `apiUtils.ts` : (Modifié) Force l'usage de votre clé API `sk-dummy`.
- `modelHelpers.ts` : (Modifié) Définit Gemini 2.5 Flash comme modèle par défaut unique.
- `markdownConfig.ts` : Configuration des plug-ins de rendu (KaTeX, GFM).
- `translations/` : Dossier contenant tous les textes de l'app (Français, Anglais, Chinois).

---

## 📂 `constants/` (Valeurs Fixes)

- `modelConstants.ts` : Liste des modèles supportés (désormais limitée à ShadsAI).
- `appConstants.ts` : Configuration par défaut (URL, thèmes, comportements).
- `themeConstants.ts` : Définition des couleurs de chaque thème (Pearl, Dark, Midnight).

---

## 📂 `styles/` (Design)

- `main.css` : Styles globaux, variables CSS et design des thèmes.
- `animations.css` : Toutes les transitions fluides et effets visuels.
- `markdown.css` : Styles spécifiques pour le rendu du texte généré par l'IA.

---
**Note :** Les fichiers se terminant par `.tsx` contiennent du visuel (HTML/React), tandis que les fichiers `.ts` contiennent uniquement de la logique mathématique ou technique.
