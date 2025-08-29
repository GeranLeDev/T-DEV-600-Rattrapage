export const API_BASE_URL = 'https://api.trello.com/1';

export const ROUTES = {
  HOME: '/',
  WORKSPACES: '/workspaces',
  WORKSPACE_DETAIL: '/workspaces/:id',
  BOARDS: '/boards',
  BOARD_DETAIL: '/boards/:id',
  TASKS: '/tasks',
} as const;

export const COLORS = {
  PRIMARY: '#026AA7',
  SECONDARY: '#5AAC44',
  ERROR: '#EB5A46',
  WARNING: '#F2D600',
  SUCCESS: '#61BD4F',
  INFO: '#00B8D9',
  BACKGROUND: '#F9FAFC',
  TEXT: '#172B4D',
  TEXT_SECONDARY: '#5A6A85',
  BORDER: '#E4E5E7',
} as const;

export const SPACING = {
  XS: '4px',
  SM: '8px',
  MD: '16px',
  LG: '24px',
  XL: '32px',
} as const;

export const BREAKPOINTS = {
  XS: '0px',
  SM: '600px',
  MD: '960px',
  LG: '1280px',
  XL: '1920px',
} as const;

export const TYPOGRAPHY = {
  FONT_FAMILY: {
    PRIMARY: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    MONOSPACE: 'source-code-pro, Menlo, Monaco, Consolas, "Courier New", monospace',
  },
  FONT_SIZE: {
    XS: '12px',
    SM: '14px',
    MD: '16px',
    LG: '18px',
    XL: '24px',
    XXL: '32px',
  },
  FONT_WEIGHT: {
    LIGHT: 300,
    REGULAR: 400,
    MEDIUM: 500,
    BOLD: 700,
  },
} as const;

export default {
  API_BASE_URL,
  ROUTES,
  COLORS,
  SPACING,
  BREAKPOINTS,
  TYPOGRAPHY,
};
