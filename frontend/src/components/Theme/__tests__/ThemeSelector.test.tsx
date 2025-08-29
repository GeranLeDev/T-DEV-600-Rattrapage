import React, { act } from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { ThemeProvider, createTheme } from '@mui/material';
import { ThemeSelector } from '../ThemeSelector';
import themeReducer from '../../../store/slices/themeSlice';

// Mock du localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  clear: jest.fn(),
  removeItem: jest.fn(),
};
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

const testTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#026AA7',
    },
    secondary: {
      main: '#5AAC44',
    },
  },
  typography: {
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  },
  components: {
    MuiIconButton: {
      styleOverrides: {
        root: {
          color: '#172B4D',
        },
      },
    },
  },
});

const createTestStore = (initialState = { theme: { currentTheme: 'light' } }) => {
  return configureStore({
    reducer: {
      theme: themeReducer,
    },
    preloadedState: initialState,
  });
};

describe('ThemeSelector', () => {
  beforeEach(() => {
    localStorageMock.getItem.mockClear();
    localStorageMock.setItem.mockClear();
  });

  const renderComponent = (store = createTestStore()) => {
    return render(
      <Provider store={store}>
        <ThemeProvider theme={testTheme}>
          <ThemeSelector />
        </ThemeProvider>
      </Provider>
    );
  };

  test('affiche le bouton de sélection de thème', () => {
    renderComponent();
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  test('ouvre le menu de sélection de thème au clic', () => {
    renderComponent();
    fireEvent.click(screen.getByRole('button'));
    expect(screen.getByRole('menu')).toBeInTheDocument();
  });

  test('affiche tous les thèmes disponibles', () => {
    renderComponent();
    fireEvent.click(screen.getByRole('button'));

    const themes = ['Clair', 'Sombre', 'Bleu', 'Vert', 'Violet Bleu Nuit'];

    themes.forEach((themeName) => {
      expect(screen.getByText(themeName)).toBeInTheDocument();
    });
  });

  test('change le thème lors de la sélection', () => {
    const store = createTestStore();
    renderComponent(store);

    fireEvent.click(screen.getByRole('button'));
    fireEvent.click(screen.getByText('Sombre'));

    const state = store.getState();
    expect(state.theme.currentTheme).toBe('dark');
  });

  test("ferme le menu après la sélection d'un thème", () => {
    renderComponent();

    fireEvent.click(screen.getByRole('button'));
    expect(screen.getByRole('menu')).toBeInTheDocument();

    fireEvent.click(screen.getByText('Sombre'));
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  });

  test('sauvegarde le thème sélectionné dans le localStorage', () => {
    renderComponent();

    fireEvent.click(screen.getByRole('button'));
    fireEvent.click(screen.getByText('Sombre'));

    expect(localStorageMock.setItem).toHaveBeenCalledWith('theme', 'dark');
  });
});
