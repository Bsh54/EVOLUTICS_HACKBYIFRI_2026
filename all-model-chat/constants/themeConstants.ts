
import { Theme, ThemeColors } from '../types/theme';

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
  scrollbarThumb: '#3f3f46',
  scrollbarTrack: 'transparent',

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
  // Backgrounds
  bgPrimary: '#ffffff',
  bgSecondary: '#f8fafc', // Slate 50
  bgTertiary: '#f1f5f9', // Slate 100
  bgAccent: '#4f46e5', // Indigo 600
  bgAccentHover: '#4338ca', // Indigo 700
  bgDanger: '#ef4444',
  bgDangerHover: '#dc2626',
  bgInput: '#ffffff', // White for frosted glass input
  bgCodeBlock: '#f8fafc',
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

  // Text - Darkened significantly for high contrast
  textPrimary: '#0f172a', // Slate 900
  textSecondary: '#475569', // Slate 600
  textTertiary: '#64748b', // Slate 500
  textAccent: '#ffffff',
  textDanger: '#dc2626',
  textLink: '#4f46e5', // Indigo 600
  textCode: '#0f172a',
  bgUserMessageText: '#ffffff',
  bgModelMessageText: '#0f172a',
  bgErrorMessageText: '#dc2626',

  // Borders
  borderPrimary: '#e2e8f0', // Slate 200
  borderSecondary: '#cbd5e1', // Slate 300
  borderFocus: '#4f46e5',

  // Scrollbar
  scrollbarThumb: '#cbd5e1',
  scrollbarTrack: 'transparent',

  // Icons
  iconUser: '#ffffff',
  iconModel: '#4f46e5',
  iconError: '#dc2626',
  iconThought: '#64748b',
  iconSettings: '#475569',
  iconClearChat: '#ffffff',
  iconSend: '#ffffff',
  iconAttach: '#64748b',
  iconStop: '#ffffff',
  iconEdit: '#64748b',
  iconHistory: '#0f172a',
};

export const AVAILABLE_THEMES: Theme[] = [
  { id: 'onyx', name: 'Onyx (Dark)', colors: ONYX_THEME_COLORS },
  { id: 'pearl', name: 'Pearl (Light)', colors: PEARL_THEME_COLORS },
];

export const DEFAULT_THEME_ID = 'pearl';
