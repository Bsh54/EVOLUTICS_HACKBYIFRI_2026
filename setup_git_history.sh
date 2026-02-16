#!/bin/bash

# Reset history (keep files, remove git history)
git update-ref -d HEAD
git reset

# 1. Init
git add .gitignore LICENSE README.md TDR_HACK_BY_IFRI_2026.pdf
git commit -m "Initialisation du projet avec documentation et licence"

# 2. Config files
git add all-model-chat/package.json all-model-chat/package-lock.json all-model-chat/tsconfig.json all-model-chat/vite.config.ts all-model-chat/vercel.json all-model-chat/manifest.json all-model-chat/sw.js all-model-chat/index.html all-model-chat/.gitignore
git commit -m "Ajout des fichiers de configuration et setup du build"

# 3. Documentation
git add "all-model-chat/*.md"
git commit -m "Ajout de la documentation technique et guides du projet"

# 4. Types
git add all-model-chat/types/
git commit -m "Définition des interfaces et types TypeScript principaux"

# 5. Styles
git add all-model-chat/styles/
git commit -m "Mise en place des styles globaux, animations et config Tailwind"

# 6. Constants
git add all-model-chat/constants/
git commit -m "Ajout des constantes, prompts et données de scénarios"

# 7. Utils - Core
git add all-model-chat/utils/apiUtils.ts all-model-chat/utils/appUtils.ts all-model-chat/utils/codeUtils.ts all-model-chat/utils/dateHelpers.ts all-model-chat/utils/db.ts
git commit -m "Implémentation des utilitaires core pour l'API et la logique App"

# 8. Utils - Domain
git add all-model-chat/utils/domainUtils.ts all-model-chat/utils/fileHelpers.ts all-model-chat/utils/folderImportUtils.ts all-model-chat/utils/modelHelpers.ts all-model-chat/utils/shortcutUtils.ts
git commit -m "Ajout des utilitaires et helpers spécifiques au domaine"

# 9. Utils - Media & Markdown
git add all-model-chat/utils/audio/ all-model-chat/utils/mediaUtils.ts all-model-chat/utils/markdownConfig.ts all-model-chat/utils/htmlToMarkdown.ts
git commit -m "Ajout du traitement média et utilitaires markdown"

# 10. Utils - Chat & Export
git add all-model-chat/utils/chat/ all-model-chat/utils/export/ all-model-chat/utils/clipboardUtils.ts
git commit -m "Implémentation du parsing chat et utilitaires d'export"

# 11. Utils - Translations
git add all-model-chat/utils/translations/
git commit -m "Ajout du support internationalisation et traductions"

# 12. Services - Base & Logs
git add all-model-chat/services/api/baseApi.ts all-model-chat/services/logService.ts all-model-chat/services/networkInterceptor.ts
git commit -m "Setup de la couche API de base et service de logging"

# 13. Services - Generation API
git add all-model-chat/services/api/generation/
git commit -m "Implémentation des endpoints API de génération IA"

# 14. Services - Chat & File API
git add all-model-chat/services/api/chatApi.ts all-model-chat/services/api/fileApi.ts
git commit -m "Implémentation des services API Chat et Fichiers"

# 15. Services - Core Services
git add all-model-chat/services/geminiService.ts all-model-chat/services/pyodideService.ts all-model-chat/services/streamingStore.ts
git commit -m "Ajout du service Gemini, Pyodide et store de streaming"

# 16. Contexts
git add all-model-chat/contexts/
git commit -m "Setup des providers React Context"

# 17. Icons
git add all-model-chat/components/icons/
git commit -m "Ajout du système d'icônes et composants SVG"

# 18. Shared Components - Basic
git add all-model-chat/components/shared/LoadingDots.tsx all-model-chat/components/shared/Modal.tsx all-model-chat/components/shared/Select.tsx all-model-chat/components/shared/Toggle.tsx all-model-chat/components/shared/ToggleItem.tsx all-model-chat/components/shared/Tooltip.tsx
git commit -m "Création des composants UI partagés basiques"

# 19. Shared Components - Complex
git add all-model-chat/components/shared/AudioPlayer.tsx all-model-chat/components/shared/CodeEditor.tsx all-model-chat/components/shared/ModelPicker.tsx
git commit -m "Ajout composants partagés complexes (AudioPlayer, CodeEditor)"

# 20. Shared Components - File Preview
git add all-model-chat/components/shared/file-preview/
git commit -m "Implémentation prévisualisation fichiers PDF et Images"

# 21. Hooks - Core
git add all-model-chat/hooks/core/
git commit -m "Implémentation des hooks core de l'application"

# 22. Hooks - App
git add all-model-chat/hooks/app/
git commit -m "Implémentation des hooks de logique application"

# 23. Hooks - Files
git add all-model-chat/hooks/files/ all-model-chat/hooks/file-upload/
git commit -m "Implémentation des hooks de gestion et upload fichiers"

# 24. Hooks - Chat State
git add all-model-chat/hooks/chat/state/ all-model-chat/hooks/chat/*.ts
git commit -m "Implémentation des hooks de gestion d'état du chat"

# 25. Hooks - Chat History
git add all-model-chat/hooks/chat/history/
git commit -m "Implémentation historique chat et gestion sessions"

# 26. Hooks - Chat Actions
git add all-model-chat/hooks/chat/actions/
git commit -m "Implémentation des hooks d'actions chat"

# 27. Hooks - Message Sender
git add all-model-chat/hooks/message-sender/
git commit -m "Implémentation logique d'envoi et streaming messages"

# 28. Hooks - Live API
git add all-model-chat/hooks/live-api/
git commit -m "Ajout hooks Live API pour interaction temps réel"

# 29. Hooks - Text Selection & Chat Stream
git add all-model-chat/hooks/text-selection/ all-model-chat/hooks/chat-stream/
git commit -m "Implémentation sélection texte et traitement flux"

# 30. Hooks - UI & Input
git add all-model-chat/hooks/ui/ all-model-chat/hooks/chat-input/
git commit -m "Ajout hooks UI et contrôleur Chat Input"

# 31. Hooks - Misc
git add all-model-chat/hooks/*.ts
git commit -m "Ajout des derniers hooks racine"

# 32. Settings Components - Controls
git add all-model-chat/components/settings/controls/
git commit -m "Création composants contrôles paramètres"

# 33. Settings Components - Sections
git add all-model-chat/components/settings/sections/
git commit -m "Implémentation des sections de paramètres"

# 34. Settings Components - Main
git add all-model-chat/components/settings/*.tsx
git commit -m "Assemblage modal et sidebar paramètres"

# 35. Modals - File Config
git add all-model-chat/components/modals/file-config/ all-model-chat/components/modals/create-file/
git commit -m "Ajout modales configuration et création fichiers"

# 36. Modals - Preview & Token
git add all-model-chat/components/modals/html-preview/ all-model-chat/components/modals/token-count/
git commit -m "Ajout modales preview HTML et compte tokens"

# 37. Modals - Main
git add all-model-chat/components/modals/*.tsx
git commit -m "Finalisation des modales de l'application"

# 38. Message Components - Content
git add all-model-chat/components/message/content/
git commit -m "Implémentation rendu contenu messages"

# 39. Message Components - Blocks
git add all-model-chat/components/message/blocks/ all-model-chat/components/message/code-block/
git commit -m "Ajout blocs code et blocs message spécialisés"

# 40. Message Components - Buttons & Grounding
git add all-model-chat/components/message/buttons/ all-model-chat/components/message/grounded-response/
git commit -m "Ajout actions messages et affichage sources"

# 41. Message Components - Main
git add all-model-chat/components/message/*.tsx
git commit -m "Assemblage composant Message principal"

# 42. Chat Input - Toolbar & Actions
git add all-model-chat/components/chat/input/toolbar/ all-model-chat/components/chat/input/actions/
git commit -m "Création barre outils et contrôles actions chat"

# 43. Chat Input - Area & Overlay
git add all-model-chat/components/chat/input/area/ all-model-chat/components/chat/overlays/
git commit -m "Implémentation zone texte chat et overlays"

# 44. Chat Input - Main
git add all-model-chat/components/chat/input/*.tsx
git commit -m "Assemblage composant Chat Input"

# 45. Message List
git add all-model-chat/components/chat/message-list/
git commit -m "Implémentation Message List et logique scroll"

# 46. Sidebar & Header
git add all-model-chat/components/sidebar/ all-model-chat/components/header/
git commit -m "Création composants Sidebar App et Header"

# 47. Specialized Components
git add all-model-chat/components/recorder/ all-model-chat/components/log-viewer/ all-model-chat/components/scenarios/
git commit -m "Ajout composants Recorder, Log Viewer et Scenarios"

# 48. Layout Components
git add all-model-chat/components/layout/chat-area/ all-model-chat/components/layout/*.tsx
git commit -m "Implémentation layout principal et Chat Area"

# 49. Opportunities Hub
git add all-model-chat/components/layout/ShadsAIHub.tsx all-model-chat/components/layout/AddOpportunityForm.tsx
git commit -m "Ajout Hub Opportunités et Portail Admin"

# 50. Final Assembly
git add .
git commit -m "Finalisation point d'entrée application et assets publics"
