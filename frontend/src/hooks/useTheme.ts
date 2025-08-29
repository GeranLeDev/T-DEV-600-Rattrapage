import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { themes } from '../styles/themes';

type ThemeKey = keyof typeof themes;

export const useTheme = () => {
  const currentTheme = useSelector((state: RootState) => state.theme.currentTheme) as ThemeKey;
  const theme = themes[currentTheme];

  return {
    theme,
    currentTheme,
    colors: theme.colors,
    shadows: theme.shadows,
    spacing: theme.spacing,
    borderRadius: theme.borderRadius,
    transitions: theme.transitions,
  };
};
