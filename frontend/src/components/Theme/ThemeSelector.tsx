import { IconButton, Menu, MenuItem, Tooltip } from '@mui/material';
import { Palette as PaletteIcon } from '@mui/icons-material';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';
import { setTheme } from '../../store/slices/themeSlice';
import { themes } from '../../styles/themes';

const themeOptions = [
  { name: 'Clair', value: 'light' },
  { name: 'Sombre', value: 'dark' },
  { name: 'Bleu', value: 'blue' },
  { name: 'Vert', value: 'green' },
  { name: 'Violet Bleu Nuit', value: 'nightPurple' },
];

export const ThemeSelector = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const dispatch = useDispatch();
  const currentTheme = useSelector((state: RootState) => state.theme.currentTheme);

  useEffect(() => {
    // Récupérer le thème sauvegardé dans le localStorage
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme && savedTheme !== currentTheme) {
      dispatch(setTheme(savedTheme));
    }
  }, [dispatch, currentTheme]);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleThemeChange = (themeValue: string) => {
    dispatch(setTheme(themeValue));
    handleClose();
  };

  return (
    <>
      <Tooltip title="Changer le thème">
        <IconButton
          onClick={handleClick}
          color="inherit"
          sx={{
            color: themes[currentTheme as keyof typeof themes].colors.text,
          }}
        >
          <PaletteIcon />
        </IconButton>
      </Tooltip>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        PaperProps={{
          sx: {
            bgcolor: themes[currentTheme as keyof typeof themes].colors.card,
            color: themes[currentTheme as keyof typeof themes].colors.text,
          },
        }}
      >
        {themeOptions.map((option) => (
          <MenuItem
            key={option.value}
            onClick={() => handleThemeChange(option.value)}
            selected={currentTheme === option.value}
            sx={{
              '&.Mui-selected': {
                bgcolor: themes[currentTheme as keyof typeof themes].colors.hover,
                '&:hover': {
                  bgcolor: themes[currentTheme as keyof typeof themes].colors.hover,
                },
              },
            }}
          >
            {option.name}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};
