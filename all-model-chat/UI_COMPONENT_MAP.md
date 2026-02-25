# 🎨 Carte des Composants UI - My AI Front

Ce guide vous permet de localiser instantanément le fichier responsable d'un élément visuel précis que vous voyez à l'écran.

---

## 🔝 Barre du Haut (Header)
| Élément Visuel | Fichier source |
| :--- | :--- |
| **Logo de l'application** | `components/icons/AppLogo.tsx` |
| **Nom du modèle (Gemini 2.5 Flash)** | `components/header/HeaderModelSelector.tsx` |
| **Bouton "Nouveau Chat" (+)** | `components/sidebar/SidebarActions.tsx` |
| **Icône des paramètres (Roue dentée)** | `components/sidebar/SidebarActions.tsx` |

---

## 💬 Zone de Conversation (Message Area)
| Élément Visuel | Fichier source |
| :--- | :--- |
| **Fond d'écran / Arrière-plan** | `styles/main.css` (chercher `.chat-area-container`) |
| **Bulles des messages (User/IA)** | `components/message/Message.tsx` |
| **Texte des messages (Markdown)** | `components/message/MarkdownRenderer.tsx` |
| **Blocs de code (Syntaxe)** | `components/message/blocks/CodeBlock.tsx` |
| **Boutons sous le message (Copier, etc)** | `components/message/MessageActions.tsx` |
| **Bloc "Pensées" (Thinking)** | `components/message/content/MessageThoughts.tsx` |
| **Affichage des images envoyées** | `components/message/FileDisplay.tsx` |

---

## ⌨️ Barre de Saisie (Chat Input)
| Élément Visuel | Fichier source |
| :--- | :--- |
| **La zone de texte (Input)** | `components/chat/input/area/ChatTextArea.tsx` |
| **Bouton d'envoi (Flèche)** | `components/chat/input/actions/SendControls.tsx` |
| **Bouton Trombone (Fichiers)** | `components/chat/input/AttachmentMenu.tsx` |
| **Affichage du fichier sélectionné** | `components/chat/input/SelectedFileDisplay.tsx` |
| **Le menu qui s'ouvre avec `/`** | `components/chat/input/SlashCommandMenu.tsx` |

---

## ⬅️ Barre Latérale (History Sidebar)
| Élément Visuel | Fichier source |
| :--- | :--- |
| **Largeur et Fond de la barre** | `components/layout/SidePanel.tsx` |
| **Liste des titres des chats** | `components/sidebar/SessionItem.tsx` |
| **Menu contextuel (Clic droit/3 points)** | `components/sidebar/SessionItemMenu.tsx` |
| **Groupes de sessions (Dossiers)** | `components/sidebar/GroupItem.tsx` |

---

## ⚙️ Fenêtres Modales (Modals)
| Élément Visuel | Fichier source |
| :--- | :--- |
| **Conteneur des paramètres** | `components/settings/SettingsModal.tsx` |
| **Sélecteur de langue / Thème** | `components/settings/sections/AppearanceSection.tsx` |
| **Boutons de réglages (Sliders)** | `components/settings/ModelVoiceSettings.tsx` |
| **Prévisualisation des fichiers (PDF)** | `components/shared/file-preview/PdfViewer.tsx` |

---

## 🎨 Styles Globaux et Thèmes
Si vous voulez changer l'esthétique générale sans toucher au code React :

1.  **Fichier `my-ai-front/styles/main.css`** :
    *   C'est ici que sont définies les polices, les arrondis des boutons (`border-radius`), et les ombres.
2.  **Fichier `my-ai-front/constants/themeConstants.ts`** :
    *   Cherchez l'objet `themes`. Vous pouvez créer votre propre thème en copiant un objet existant (ex: `pearl` ou `dark`).
    *   **Couleur principale (Accent) :** Changez `bgAccent`.
    *   **Couleur du texte :** Changez `textPrimary`.

---

## 🔧 Exemples de modifications fréquentes

### Je veux changer l'arrondi de toutes les bulles de message
*   Allez dans `my-ai-front/styles/main.css`.
*   Cherchez `--theme-border-radius`.

### Je veux supprimer l'effet de clignotement du texte pendant qu'il s'écrit
*   Allez dans `my-ai-front/styles/animations.css`.
*   Cherchez `.animate-cursor-blink`.

### Je veux traduire une étiquette ou un bouton
*   Allez dans `my-ai-front/utils/translations/`.
*   Choisissez le fichier correspondant au domaine (ex: `chatInput.ts` pour la barre du bas).

---
*Ce document est votre guide visuel pour My AI Front.*
