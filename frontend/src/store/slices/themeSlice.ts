import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ThemeState {
  currentTheme: string;
}

// Récupérer le thème sauvegardé dans le localStorage ou utiliser 'light' par défaut
const savedTheme = localStorage.getItem('theme') || 'light';

const initialState: ThemeState = {
  currentTheme: savedTheme,
};

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    setTheme: (state, action: PayloadAction<string>) => {
      state.currentTheme = action.payload;
      // Sauvegarder le nouveau thème dans le localStorage
      localStorage.setItem('theme', action.payload);
    },
  },
});

export const { setTheme } = themeSlice.actions;
export default themeSlice.reducer;
