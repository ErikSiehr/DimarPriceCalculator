// Design Tokens - Brand Colors and Design System
export const colors = {
  // Primary text color
  primary: {
    DEFAULT: '#3A3429',
    light: '#5A5449',
    dark: '#2A2419',
  },
  // Accent/highlight color
  accent: {
    DEFAULT: '#A89454',
    light: '#C4B070',
    dark: '#8A7A44',
    muted: 'rgba(168, 148, 84, 0.15)',
    subtle: 'rgba(168, 148, 84, 0.08)',
  },
  // Background colors
  background: {
    DEFAULT: '#F7F5EF',
    card: '#FFFFFF',
    muted: 'rgba(168, 148, 84, 0.05)',
  },
  // Border colors
  border: {
    DEFAULT: 'rgba(168, 148, 84, 0.2)',
    light: 'rgba(168, 148, 84, 0.1)',
    strong: 'rgba(168, 148, 84, 0.3)',
  },
  // State colors
  success: '#4CAF50',
  error: '#E53935',
  warning: '#FF9800',
} as const

export const shadows = {
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  DEFAULT: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
  md: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
  lg: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
  accent: '0 4px 14px 0 rgba(168, 148, 84, 0.25)',
} as const

export const spacing = {
  xs: '0.25rem',
  sm: '0.5rem',
  md: '0.75rem',
  lg: '1rem',
  xl: '1.5rem',
  '2xl': '2rem',
  '3xl': '3rem',
} as const

export const borderRadius = {
  sm: '0.25rem',
  DEFAULT: '0.5rem',
  md: '0.75rem',
  lg: '1rem',
  full: '9999px',
} as const

export const typography = {
  fontFamily: {
    sans: 'var(--font-geist-sans), system-ui, sans-serif',
    mono: 'var(--font-geist-mono), monospace',
  },
  fontSize: {
    xs: '0.75rem',
    sm: '0.875rem',
    base: '1rem',
    lg: '1.125rem',
    xl: '1.25rem',
    '2xl': '1.5rem',
    '3xl': '2rem',
    '4xl': '3rem',
  },
  fontWeight: {
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  },
  lineHeight: {
    tight: '1.25',
    normal: '1.5',
    relaxed: '1.625',
  },
} as const

export const transitions = {
  fast: '0.15s ease',
  DEFAULT: '0.2s ease',
  slow: '0.3s ease',
} as const

// CSS custom properties for use in styled-components
export const cssVariables = `
  --color-primary: ${colors.primary.DEFAULT};
  --color-primary-light: ${colors.primary.light};
  --color-primary-dark: ${colors.primary.dark};
  --color-accent: ${colors.accent.DEFAULT};
  --color-accent-light: ${colors.accent.light};
  --color-accent-dark: ${colors.accent.dark};
  --color-accent-muted: ${colors.accent.muted};
  --color-accent-subtle: ${colors.accent.subtle};
  --color-background: ${colors.background.DEFAULT};
  --color-background-card: ${colors.background.card};
  --color-background-muted: ${colors.background.muted};
  --color-border: ${colors.border.DEFAULT};
  --color-border-light: ${colors.border.light};
  --color-border-strong: ${colors.border.strong};
  --shadow-sm: ${shadows.sm};
  --shadow: ${shadows.DEFAULT};
  --shadow-md: ${shadows.md};
  --shadow-lg: ${shadows.lg};
  --shadow-accent: ${shadows.accent};
  --radius-sm: ${borderRadius.sm};
  --radius: ${borderRadius.DEFAULT};
  --radius-md: ${borderRadius.md};
  --radius-lg: ${borderRadius.lg};
  --transition-fast: ${transitions.fast};
  --transition: ${transitions.DEFAULT};
  --transition-slow: ${transitions.slow};
`

export type ThemeColors = typeof colors
export type ThemeShadows = typeof shadows
export type ThemeSpacing = typeof spacing
