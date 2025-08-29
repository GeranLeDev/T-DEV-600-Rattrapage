export const theme = {
  colors: {
    primary: '#0079bf',
    secondary: '#5ba4cf',
    background: '#ffffff',
    surface: '#f4f5f7',
    text: '#172b4d',
    textSecondary: '#5e6c84',
    border: '#dfe1e6',
    error: '#eb5a46',
    success: '#61bd4f',
    warning: '#f2d600',
    card: '#ffffff',
    hover: '#f4f5f7',
    input: '#fafbfc',
    icon: '#42526e',
  },
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
  },
  borderRadius: {
    sm: '3px',
    md: '6px',
    lg: '12px',
  },
  typography: {
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif',
    fontSize: {
      small: '12px',
      regular: '14px',
      large: '16px',
      h1: '24px',
      h2: '20px',
      h3: '16px',
    },
    fontWeight: {
      regular: 400,
      medium: 500,
      bold: 600,
    },
  },
  shadows: {
    card: '0 1px 0 rgba(9, 30, 66, 0.25)',
    modal: '0 8px 16px -4px rgba(9, 30, 66, 0.25)',
    dropdown: '0 4px 8px -2px rgba(9, 30, 66, 0.25)',
  },
  transitions: {
    default: '200ms ease-in-out',
    fast: '100ms ease-in-out',
    slow: '300ms ease-in-out',
  },
} as const;

export type Theme = typeof theme;
