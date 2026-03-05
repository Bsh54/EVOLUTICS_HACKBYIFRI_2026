
import { AppSettings, FilesApiConfig } from '../types';
import { HarmCategory, HarmBlockThreshold, SafetySetting, MediaResolution } from '../types/settings';

// Re-exporting from new modules
export * from './modelConstants';
export * from './promptConstants';
export * from './shortcuts';

export const APP_LOGO_SVG_DATA_URI = '/assets/evolutics-logo.png';

// Import specific constants needed to build the default objects
import { 
    DEFAULT_MODEL_ID,
    DEFAULT_TEMPERATURE,
    DEFAULT_TOP_P,
    DEFAULT_SHOW_THOUGHTS,
    DEFAULT_TTS_VOICE,
    DEFAULT_THINKING_BUDGET,
    DEFAULT_THINKING_LEVEL,
    DEFAULT_TRANSCRIPTION_MODEL_ID
} from './modelConstants';
import { DEFAULT_SYSTEM_INSTRUCTION } from './promptConstants';

// Define constants that are truly app-level
export const DEFAULT_IS_STREAMING_ENABLED = true; 
export const DEFAULT_BASE_FONT_SIZE = 16; 
export const DEFAULT_IS_AUDIO_COMPRESSION_ENABLED = true;

// localStorage keys
export const APP_SETTINGS_KEY = 'chatAppSettings';
export const PRELOADED_SCENARIO_KEY = 'chatPreloadedScenario';
export const CHAT_HISTORY_SESSIONS_KEY = 'chatHistorySessions';
export const CHAT_HISTORY_GROUPS_KEY = 'chatHistoryGroups';
export const ACTIVE_CHAT_SESSION_ID_KEY = 'activeChatSessionId';
export const API_KEY_LAST_USED_INDEX_KEY = 'chatApiKeyLastUsedIndex';

// Shared UI Styles
export const MESSAGE_BLOCK_BUTTON_CLASS = "p-1.5 rounded-md text-[var(--theme-text-tertiary)] hover:text-[var(--theme-text-primary)] hover:bg-[var(--theme-bg-tertiary)]/50 transition-all duration-200 focus:outline-none opacity-70 hover:opacity-100";
export const CHAT_INPUT_BUTTON_CLASS = "h-8 w-8 sm:h-9 sm:w-9 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--theme-border-focus)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--theme-bg-input)] p-0 m-0 border-0 leading-none active:scale-90 hover:scale-105";
export const SETTINGS_INPUT_CLASS = "bg-[var(--theme-bg-input)] border-[var(--theme-border-secondary)] focus:border-[var(--theme-border-focus)] focus:ring-[var(--theme-border-focus)]/20 text-[var(--theme-text-primary)] placeholder-[var(--theme-text-tertiary)]";

export const DEFAULT_SAFETY_SETTINGS: SafetySetting[] = [
    { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_NONE },
    { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_NONE },
    { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_NONE },
    { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_NONE },
    { category: HarmCategory.HARM_CATEGORY_CIVIC_INTEGRITY, threshold: HarmBlockThreshold.BLOCK_NONE },
];

export const DEFAULT_FILES_API_CONFIG: FilesApiConfig = {
    images: false,
    pdfs: true,
    audio: true,
    video: true,
    text: false,
};

export const DEFAULT_MEDIA_RESOLUTION = MediaResolution.MEDIA_RESOLUTION_UNSPECIFIED;

// Composite default objects
export const DEFAULT_CHAT_SETTINGS = {
  modelId: DEFAULT_MODEL_ID,
  temperature: DEFAULT_TEMPERATURE,
  topP: DEFAULT_TOP_P,
  showThoughts: DEFAULT_SHOW_THOUGHTS,
  systemInstruction: DEFAULT_SYSTEM_INSTRUCTION,
  ttsVoice: DEFAULT_TTS_VOICE,
  thinkingBudget: DEFAULT_THINKING_BUDGET,
  thinkingLevel: DEFAULT_THINKING_LEVEL as 'LOW' | 'HIGH',
  lockedApiKey: null,
  isGoogleSearchEnabled: false,
  isCodeExecutionEnabled: false,
  isUrlContextEnabled: false,
  isDeepSearchEnabled: false,
  isRawModeEnabled: false,
  hideThinkingInContext: false,
  safetySettings: DEFAULT_SAFETY_SETTINGS,
  mediaResolution: DEFAULT_MEDIA_RESOLUTION,
};

export const DEFAULT_APP_SETTINGS: AppSettings = {
  ...DEFAULT_CHAT_SETTINGS,
  themeId: 'pearl', 
  baseFontSize: DEFAULT_BASE_FONT_SIZE,
  useCustomApiConfig: false,
  apiKey: "sk-dummy",
  apiProxyUrl: "https://shadsai1api.shadobsh.workers.dev/v1",
  useApiProxy: true,
  language: 'system',
  isStreamingEnabled: DEFAULT_IS_STREAMING_ENABLED,
  transcriptionModelId: DEFAULT_TRANSCRIPTION_MODEL_ID,
  filesApiConfig: DEFAULT_FILES_API_CONFIG,
  expandCodeBlocksByDefault: false,
  isAutoTitleEnabled: true,
  isMermaidRenderingEnabled: true,
  isGraphvizRenderingEnabled: true,
  isCompletionNotificationEnabled: false,
  isCompletionSoundEnabled: false,
  isSuggestionsEnabled: true,
  isAutoScrollOnSendEnabled: true,
  isAutoSendOnSuggestionClick: true,
  generateQuadImages: false,
  autoFullscreenHtml: true,
  showWelcomeSuggestions: true,
  isAudioCompressionEnabled: DEFAULT_IS_AUDIO_COMPRESSION_ENABLED,
  autoCanvasVisualization: false,
  autoCanvasModelId: 'gemini-2.5-flash',
  isPasteRichTextAsMarkdownEnabled: true,
  isPasteAsTextFileEnabled: true,
  isSystemAudioRecordingEnabled: false,
  customShortcuts: {}, // Empty object implies using defaults
};

export const SUGGESTIONS_KEYS = [];

export const BBOX_SYSTEM_PROMPT = `**Tâche :** En tant qu'expert en vision par ordinateur, effectuez une détection d'objets générique sur cette image et générez un résultat de visualisation annoté à l'aide de code Python.

**Première étape : Identification des objets et construction de la structure de données**
Veuillez identifier tous les objets, personnes, composants ou éléments d'arrière-plan clairement visibles et indépendants dans l'image (détection à grain fin). Construisez une liste nommée \`detections\`, contenant plusieurs dictionnaires, chacun au format suivant :
*   \`'box_2d'\`: Liste de 4 entiers \`[ymin, xmin, ymax, xmax]\`. **Attention : les coordonnées doivent être normalisées sur une échelle de 0-1000** (c'est-à-dire 0 représente 0%, 1000 représente 100%).
*   \`'label'\`: Chaîne de caractères, au format \`"Nom anglais (Nom français)"\`.

**Deuxième étape : Visualisation (doit strictement réutiliser la logique de code suivante)**
Veuillez écrire et exécuter du code Python pour dessiner les résultats de détection. Dans la fonction de dessin, vous devez inclure les styles et la logique spécifiques suivants :

1.  **Configuration des couleurs :** Définir la liste de couleurs \`colors = ['#FF0000', '#0000FF', '#00FF00', '#FFFF00', '#00FFFF', '#FF00FF', '#FFA500', '#800080', '#00FF00', '#FFC0CB', '#FFFFFF']\`. Lors du parcours des résultats de détection, utilisez le modulo d'index \`i % len(colors)\` pour utiliser ces couleurs de manière cyclique.
2.  **Conversion de coordonnées :** Convertir les coordonnées détectées à l'échelle \`0-1000\` en coordonnées de pixels réelles :
    *   \`left = xmin * width / 1000\`
    *   \`top = ymin * height / 1000\`
    *   (Et ainsi de suite pour les coordonnées en bas à droite)
3.  **Style de boîte englobante :** Utilisez \`PIL.ImageDraw\` pour dessiner des rectangles, avec une largeur de ligne de **4 pixels** (\`width=4\`).
4.  **Style d'étiquette et optimisation de la visibilité :**
    *   **Police :** Essayez de charger \`LiberationSans-Bold.ttf\` (taille 24), utilisez la police par défaut en cas d'échec.
    *   **Arrière-plan du texte :** Avant de dessiner le texte, vous devez d'abord dessiner un rectangle rempli de couleur comme arrière-plan (\`text_bbox\`), la couleur de remplissage étant cohérente avec la couleur de la boîte englobante.
    *   **Couleur de texte intelligente :** Pour garantir le contraste de lecture, veuillez appliquer la logique suivante :
        *   Si la couleur d'arrière-plan est l'une de \`['#FFFF00', '#00FFFF', '#FFFFFF', '#FFC0CB', '#FFA500']\` (c'est-à-dire jaune, cyan, blanc, rose, orange), la couleur du texte est définie sur **noir ('black')**.
        *   Sinon, la couleur du texte est définie sur **blanc ('white')**.
    *   **Position :** L'étiquette est dessinée dans le coin supérieur gauche de la boîte englobante.

**Exigences de sortie :**
Veuillez sortir directement le fichier image généré par le code traité.`;

export const HD_GUIDE_SYSTEM_PROMPT = `### Prompt système : Expert en annotation de guidage haute définition

**Définition du rôle :** Vous êtes un expert en guidage d'image. Votre tâche est de recevoir l'image de l'utilisateur et d'ajouter des flèches de guidage **haute définition, sans crénelage** à des positions spécifiées à l'aide de Python.

**Logique de base du dessin (doit être exécutée) :**
1. **Traitement anti-crénelage :** Adoptez la technique de "suréchantillonnage". Dessinez d'abord sur un canevas **4 fois plus grand** que l'image originale, puis réduisez et fusionnez en utilisant \`Resampling.LANCZOS\`.
2. **Conception visuelle :** 
   - **Style de flèche :** Rouge vif comme couleur principale, doit avoir un **contour blanc de 1 pixel** (pour assurer la clarité sur n'importe quel arrière-plan).
   - **Système de coordonnées :** Utilisez uniformément des coordonnées normalisées de 0-1000 pour le positionnement.
3. **Étapes d'exécution Python :**
   - Créez un calque transparent (RGBA).
   - Dessinez le corps de la flèche et le contour à 4 fois sa taille.
   - Redimensionnez et \`paste\` sur l'image originale.

**Exigences d'interaction :**
- Identifiez la cible décrite par l'utilisateur (comme "bouton de connexion", "barre de recherche").
- Exécutez directement le code et sortez l'image haute définition annotée.
- Expliquez brièvement la fonction ou les étapes d'opération vers lesquelles pointe la flèche.

**Référence de fragment de code (implémentation de base) :**
\`\`\`python
# Logique clé : suréchantillonnage 4x + mise à l'échelle Lanczos
scale = 4
overlay = Image.new('RGBA', (w*scale, h*scale), (0,0,0,0))
# Dessinez une flèche agrandie 4 fois sur overlay...
overlay = overlay.resize((w, h), resample=Image.Resampling.LANCZOS)
img.paste(overlay, (0, 0), overlay)
\`\`\``;