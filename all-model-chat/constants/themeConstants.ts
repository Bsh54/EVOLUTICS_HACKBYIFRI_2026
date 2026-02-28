
import { Theme, ThemeColors } from '../types/theme';

// Nouveau thème sombre élégant inspiré du Cyberpunk UI mais plus doux
export const MIDNIGHT_THEME_COLORS: ThemeColors = {
  // Backgrounds - Plus doux que le full noir
  bgPrimary: '#0f1419', // Bleu-gris très sombre mais pas noir
  bgSecondary: '#1a1f2e', // Bleu-gris sombre pour sidebar/header
  bgTertiary: '#252a3a', // Hover states plus visibles
  bgAccent: '#22c55e', // Vert néon comme recommandé par le skill
  bgAccentHover: '#16a34a', // Vert plus foncé au hover
  bgDanger: '#ef4444',
  bgDangerHover: '#dc2626',
  bgInput: '#1e2532', // Input avec fond légèrement plus clair
  bgCodeBlock: '#161b22', // Code block avec teinte bleutée
  bgCodeBlockHeader: '#21262d',
  bgUserMessage: '#22c55e', // Message utilisateur en vert néon
  bgModelMessage: 'rgba(30, 37, 50, 0.3)', // Fond transparent léger
  bgErrorMessage: 'rgba(239, 68, 68, 0.15)',
  bgSuccess: 'rgba(34, 197, 94, 0.15)',
  textSuccess: '#4ade80',
  bgInfo: 'rgba(56, 189, 248, 0.15)',
  textInfo: '#38bdf8',
  bgWarning: 'rgba(245, 158, 11, 0.15)',
  textWarning: '#fbbf24',

  // Text - Contraste élevé mais pas éblouissant
  textPrimary: '#e6edf3', // Blanc cassé pour moins de fatigue oculaire
  textSecondary: '#8b949e', // Gris moyen bien visible
  textTertiary: '#6e7681', // Gris plus foncé mais lisible
  textAccent: '#ffffff',
  textDanger: '#ff7b7b',
  textLink: '#58a6ff', // Bleu néon doux
  textCode: '#e6edf3',
  bgUserMessageText: '#ffffff',
  bgModelMessageText: '#e6edf3',
  bgErrorMessageText: '#ff7b7b',

  // Borders - Visibles mais subtiles
  borderPrimary: '#30363d', // Bordures principales visibles
  borderSecondary: '#21262d', // Bordures secondaires plus subtiles
  borderFocus: '#22c55e', // Focus en vert néon

  // Scrollbar
  scrollbarThumb: '#484f58',
  scrollbarTrack: '#21262d',

  // Icons - Bien visibles avec effet néon subtil
  iconUser: '#ffffff',
  iconModel: '#58a6ff', // Bleu néon
  iconError: '#ff7b7b',
  iconThought: '#8b949e',
  iconSettings: '#8b949e',
  iconClearChat: '#e6edf3',
  iconSend: '#ffffff',
  iconAttach: '#8b949e',
  iconStop: '#ffffff',
  iconEdit: '#8b949e',
  iconHistory: '#8b949e',
};

export const ONYX_THEME_COLORS: ThemeColors = {
  // Backgrounds
  bgPrimary: '#09090b', // Zinc 950 - Main Content
  bgSecondary: '#000000', // True Black - Sidebar/Header (Framing effect)
  bgTertiary: '#18181b', // Zinc 900 - Hover states
  bgAccent: '#6366f1', // Indigo 500 - Vibrant Accent (Modern)
  bgAccentHover: '#4f46e5', // Indigo 600
  bgDanger: '#ef4444', // Red 500
  bgDangerHover: '#dc2626',
  bgInput: '#18181b', // Zinc 900 - Deep input area
  bgCodeBlock: '#121214', // Deep subtle grey for code
  bgCodeBlockHeader: '#1a1a1c', // Slightly lighter header
  bgUserMessage: '#4f46e5', // Indigo 600 - Modern user bubble
  bgModelMessage: 'transparent',
  bgErrorMessage: 'rgba(239, 68, 68, 0.1)',
  bgSuccess: 'rgba(34, 197, 94, 0.1)',
  textSuccess: '#4ade80',
  bgInfo: 'rgba(56, 189, 248, 0.1)',
  textInfo: '#38bdf8',
  bgWarning: 'rgba(245, 158, 11, 0.1)',
  textWarning: '#fbbf24',

  // Text
  textPrimary: '#f8fafc', // Slate 50 - High contrast text
  textSecondary: '#94a3b8', // Slate 400
  textTertiary: '#64748b', // Slate 500
  textAccent: '#ffffff',
  textDanger: '#fca5a5', // Light Red
  textLink: '#818cf8', // Indigo 400
  textCode: '#e2e8f0', // Slate 200
  bgUserMessageText: '#ffffff',
  bgModelMessageText: '#f8fafc',
  bgErrorMessageText: '#fca5a5',

  // Borders
  borderPrimary: '#27272a', // Zinc 800 - blending more with tertiary
  borderSecondary: '#3f3f46', // Zinc 700 - Slightly lighter for visible borders
  borderFocus: '#6366f1', // Indigo 500

  // Scrollbar
  scrollbarThumb: '#52525b', // Zinc 600 - plus visible
  scrollbarTrack: '#18181b', // Zinc 900 - léger fond

  // Icons
  iconUser: '#ffffff',
  iconModel: '#818cf8', // Indigo 400
  iconError: '#ef4444',
  iconThought: '#71717a',
  iconSettings: '#94a3b8',
  iconClearChat: '#f8fafc',
  iconSend: '#ffffff',
  iconAttach: '#94a3b8',
  iconStop: '#ffffff',
  iconEdit: '#94a3b8',
  iconHistory: '#94a3b8',
};

export const PEARL_THEME_COLORS: ThemeColors = {
  // Backgrounds - Couleurs plus douces et moins éblouissantes
  bgPrimary: '#fefefe', // Blanc cassé très subtil au lieu du blanc pur
  bgSecondary: '#f6f8fa', // Gris très clair avec une pointe de bleu
  bgTertiary: '#eef2f5', // Gris clair plus doux
  bgAccent: '#4f46e5', // Indigo 600
  bgAccentHover: '#4338ca', // Indigo 700
  bgDanger: '#ef4444',
  bgDangerHover: '#dc2626',
  bgInput: '#f9fafb', // Fond input légèrement grisé pour moins de contraste
  bgCodeBlock: '#f6f8fa', // Code block avec fond très doux
  bgCodeBlockHeader: 'rgba(241, 245, 249, 0.9)',
  bgUserMessage: '#4f46e5', // Indigo 600 - Modern sleek bubble
  bgModelMessage: 'transparent',
  bgErrorMessage: 'rgba(239, 68, 68, 0.1)',
  bgSuccess: 'rgba(34, 197, 94, 0.1)',
  textSuccess: '#16a34a',
  bgInfo: 'rgba(56, 189, 248, 0.1)',
  textInfo: '#0284c7',
  bgWarning: 'rgba(245, 158, 11, 0.1)',
  textWarning: '#b45309',

  // Text - Contraste réduit pour plus de confort
  textPrimary: '#1a202c', // Gris très foncé au lieu du noir pur
  textSecondary: '#4a5568', // Gris moyen plus doux
  textTertiary: '#718096', // Gris clair mais lisible
  textAccent: '#ffffff',
  textDanger: '#dc2626',
  textLink: '#4f46e5', // Indigo 600
  textCode: '#2d3748', // Code avec couleur plus douce
  bgUserMessageText: '#ffffff',
  bgModelMessageText: '#1a202c',
  bgErrorMessageText: '#dc2626',

  // Borders - Plus subtiles et douces
  borderPrimary: '#e5e7eb', // Bordures très douces
  borderSecondary: '#d1d5db', // Bordures secondaires subtiles
  borderFocus: '#4f46e5',

  // Scrollbar
  scrollbarThumb: '#9ca3af', // Scrollbar plus visible mais douce
  scrollbarTrack: '#f3f4f6', // Track très subtile

  // Icons - Couleurs adoucies
  iconUser: '#ffffff',
  iconModel: '#4f46e5',
  iconError: '#dc2626',
  iconThought: '#6b7280',
  iconSettings: '#4a5568',
  iconClearChat: '#ffffff',
  iconSend: '#ffffff',
  iconAttach: '#6b7280',
  iconStop: '#ffffff',
  iconEdit: '#6b7280',
  iconHistory: '#1a202c',
};

export const AVAILABLE_THEMES: Theme[] = [
  { id: 'midnight', name: 'Midnight (Élégant)', colors: MIDNIGHT_THEME_COLORS },
  { id: 'pearl', name: 'Pearl (Clair)', colors: PEARL_THEME_COLORS },
  { id: 'onyx', name: 'Onyx (Très Sombre)', colors: ONYX_THEME_COLORS },
];

export const DEFAULT_THEME_ID = 'midnight';
