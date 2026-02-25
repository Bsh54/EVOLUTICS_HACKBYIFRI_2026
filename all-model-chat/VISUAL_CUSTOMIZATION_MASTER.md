# 🎨 Master Guide : Personnalisation Visuelle de My AI Front

Ce document est conçu pour vous permettre de modifier l'interface (UI) de l'application sans avoir à chercher pendant des heures dans le code. Chaque élément visuel est répertorié ici avec son fichier source et des exemples de modifications.

---

## 🛠️ 1. Les Fondations (CSS et Thèmes)

Tout le style repose sur des variables CSS injectées dynamiquement.

### **Les Styles Globaux (`my-ai-front/styles/main.css`)**
C'est le fichier le plus important pour l'esthétique globale.
- **Ce que vous pouvez y faire :**
    - Changer les polices (`font-family`).
    - Modifier l'arrondi universel (`--theme-border-radius`).
    - Ajuster les ombres portées (`box-shadow`).
    - Modifier la barre de défilement (chercher `::-webkit-scrollbar`).

### **Les Thèmes (`my-ai-front/constants/themeConstants.ts`)**
L'application propose plusieurs thèmes (Pearl, Onyx, etc.).
- **Structure d'un thème :**
    ```typescript
    {
      id: 'mon-theme',
      bgPrimary: '#ffffff',    // Fond principal
      textPrimary: '#000000',  // Texte principal
      bgAccent: '#007bff',     // Couleur des boutons et liens
      // ...
    }
    ```
- **Astuce :** Pour créer votre propre design, copiez un objet existant et changez les codes couleur hexadécimaux.

---

## 🏗️ 2. Structure de l'Écran (Layout)

L'écran est divisé en trois zones principales gérées dans `components/layout/`.

1.  **Barre Latérale (Sidebar) :** `components/layout/SidePanel.tsx`
    - Modifiez ici la largeur (`w-64`, `w-72` en classes Tailwind).
2.  **Zone de Chat :** `components/layout/ChatArea.tsx`
    - Gère l'espacement entre la sidebar et les messages.
3.  **En-tête (Header) :** `components/header/Header.tsx`
    - Gère la barre du haut qui contient le nom du modèle.

---

## 💬 3. La Bulle de Message (`components/message/`)

C'est l'élément le plus complexe visuellement.

- **`Message.tsx`** : Le squelette. C'est ici que l'on définit si le message de l'utilisateur est à droite ou à gauche, et l'espacement entre les bulles.
- **`MarkdownRenderer.tsx`** : Comment le texte est formaté.
    - Pour changer la taille du texte de l'IA, cherchez la classe `prose` ou `markdown-body`.
- **`blocks/CodeBlock.tsx`** : L'apparence des blocs de code.
    - Vous pouvez y changer la couleur de fond du code ou l'icône de copie.
- **`content/MessageThoughts.tsx`** : Le bloc "Pensées" (Thinking).
    - Modifiez ici la bordure pointillée ou la couleur de fond grise spécifique aux réflexions de l'IA.

---

## ⌨️ 4. La Barre de Saisie (`components/chat/input/`)

- **`ChatInputArea.tsx`** : Le conteneur blanc (ou sombre) en bas de l'écran.
- **`area/ChatTextArea.tsx`** : La zone où l'on tape.
    - Modifiez ici le `placeholder` ("Tapez votre message...") ou la hauteur maximale.
- **`actions/SendControls.tsx`** : Le bouton d'envoi (la flèche).
    - C'est ici que vous pouvez changer l'icône ou ajouter un effet de surbrillance quand on peut envoyer.
- **`AttachmentMenu.tsx`** : Le menu qui surgit pour ajouter une photo.
    - Modifiez ici l'ordre des icônes de fichiers.

---

## ⚙️ 5. Paramètres et Modales (`components/settings/` et `modals/`)

- **`SettingsModal.tsx`** : La fenêtre des réglages.
- **`sections/AppearanceSection.tsx`** : Le visuel pour choisir les thèmes.
- **`shared/Modal.tsx`** : Le composant de base de toutes les fenêtres surgissantes. Si vous voulez que toutes les fenêtres aient un fond flou (blur), c'est ici.

---

## 🪄 6. Animations (`my-ai-front/styles/animations.css`)

L'application utilise beaucoup d'animations pour paraître fluide.
- **`animate-pulse`** : Utilisé pour les messages en cours de chargement.
- **`animate-in` / `fade-in`** : Utilisé pour l'apparition des messages.
- **`TypewriterEffect`** : Dans `components/chat/message-list/WelcomeScreen.tsx`, gère l'effet d'écriture au démarrage.

---

## 📝 7. Dictionnaire de modification rapide (Cheat Sheet)

| Je veux changer... | Fichier à ouvrir |
| :--- | :--- |
| **La couleur de l'IA** | `constants/themeConstants.ts` (champ `bgMessageModel`) |
| **La taille de la police** | `components/settings/sections/AppearanceSection.tsx` |
| **L'icône de l'app** | `components/icons/AppLogo.tsx` |
| **Le texte de bienvenue** | `utils/translations/app.ts` (clé `welcome_greeting`) |
| **Le bouton "Nouveau Chat"** | `components/sidebar/SidebarActions.tsx` |
| **Le style des tableaux** | `components/message/blocks/TableBlock.tsx` |
| **Le défilement automatique** | `hooks/chat/useChatScroll.ts` |

---

## 🚀 Conseils pour vos modifications

1.  **Utilisez l'Inspecteur (F12) :** Trouvez la classe CSS de l'élément que vous voulez changer (ex: `chat-bubble`).
2.  **Tailwind CSS :** L'application utilise Tailwind. Pour changer une couleur de fond rapidement, cherchez `className="bg-blue-500"` et remplacez par `bg-red-500`.
3.  **Hot Reload :** Laissez le terminal ouvert avec `npm run dev`. Chaque fois que vous sauvegardez un fichier, le changement apparaîtra instantanément dans votre navigateur.

---
*Ce guide est votre outil principal pour faire évoluer l'identité visuelle de votre ShadsAI Chat.*
