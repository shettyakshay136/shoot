/**
 * Global Color Palette
 * Centralized color definitions for the entire application
 */

// Primary Brand Colors (ROG Orange)
export const PRIMARY_COLORS = {
  25: '#FFF4E8',
  50: '#FFE7C9',
  100: '#FFD9A9',
  200: '#FFC989',
  300: '#FBBB76',
  400: '#FF9440',
  500: '#FF6E1A',
  600: '#FF3B00',
  700: '#D32A00',
  800: '#A52000',
  900: '#61240E',
} as const;

// Secondary Colors
export const SECONDARY_COLORS = {
  25: '#C5BAB5',
  50: '#B8A8A0',
  100: '#AB968B',
  200: '#9E8476',
  300: '#917261',
  400: '#84604C',
  500: '#774E37',
  600: '#6A3C22',
  700: '#5D2A0D',
  800: '#501800',
  900: '#430600',
} as const;

// Neutral Colors
export const NEUTRAL_COLORS = {
  25: '#F9FAFB',
  50: '#F3F4F6',
  100: '#E5E7EB',
  200: '#D1D5DB',
  300: '#9CA3AF',
  400: '#6B7280',
  500: '#4B5563',
  600: '#374151',
  700: '#1F2937',
  800: '#111827',
  900: '#0A0F19',
} as const;

// Semantic Colors
export const SEMANTIC_COLORS = {
  // Success
  success: {
    50: '#ECFDF5',
    100: '#D1FAE5',
    500: '#10B981',
    600: '#059669',
    700: '#047857',
  },
  // Error
  error: {
    50: '#FEF2F2',
    100: '#FEE2E2',
    500: '#EF4444',
    600: '#DC2626',
    700: '#B91C1C',
  },
  // Warning
  warning: {
    50: '#FFFBEB',
    100: '#FEF3C7',
    500: '#F59E0B',
    600: '#D97706',
    700: '#B45309',
  },
  // Info
  info: {
    50: '#EFF6FF',
    100: '#DBEAFE',
    500: '#3B82F6',
    600: '#2563EB',
    700: '#1D4ED8',
  },
} as const;

// Background Colors
export const BACKGROUND_COLORS = {
  primary: '#000000',
  secondary: NEUTRAL_COLORS[900],
  tertiary: NEUTRAL_COLORS[800],
  surface: NEUTRAL_COLORS[700],
  overlay: 'rgba(0, 0, 0, 0.5)',
  transparent: 'transparent',
} as const;

// Text Colors
export const TEXT_COLORS = {
  primary: '#FFFFFF',
  secondary: 'rgba(255, 255, 255, 0.9)',
  tertiary: 'rgba(255, 255, 255, 0.7)',
  quaternary: 'rgba(255, 255, 255, 0.5)',
  inverse: NEUTRAL_COLORS[900],
  placeholder: 'rgba(255, 255, 255, 0.6)',
  disabled: 'rgba(255, 255, 255, 0.4)',
} as const;

// Border Colors
export const BORDER_COLORS = {
  primary: 'rgba(255, 255, 255, 0.2)',
  secondary: 'rgba(255, 255, 255, 0.1)',
  focused: 'rgba(255, 255, 255, 0.6)',
  error: SEMANTIC_COLORS.error[500],
  success: SEMANTIC_COLORS.success[500],
} as const;

// Shadow Colors
export const SHADOW_COLORS = {
  primary: 'rgba(0, 0, 0, 0.1)',
  secondary: 'rgba(0, 0, 0, 0.05)',
  elevated: 'rgba(0, 0, 0, 0.15)',
} as const;

// Button Colors
export const BUTTON_COLORS = {
  primary: {
    background: PRIMARY_COLORS[500],
    text: '#FFFFFF',
    border: PRIMARY_COLORS[500],
  },
  secondary: {
    background: 'transparent',
    text: PRIMARY_COLORS[500],
    border: PRIMARY_COLORS[500],
  },
  ghost: {
    background: 'transparent',
    text: TEXT_COLORS.primary,
    border: 'transparent',
  },
  disabled: {
    background: 'rgba(255, 255, 255, 0.1)',
    text: TEXT_COLORS.disabled,
    border: 'rgba(255, 255, 255, 0.1)',
  },
} as const;

// Input Colors
export const INPUT_COLORS = {
  background: 'rgba(0, 0, 0, 0.6)',
  backgroundFocused: 'rgba(0, 0, 0, 0.8)',
  border: BORDER_COLORS.primary,
  borderFocused: BORDER_COLORS.focused,
  text: TEXT_COLORS.primary,
  placeholder: TEXT_COLORS.placeholder,
} as const;
