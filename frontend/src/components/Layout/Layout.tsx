import React from 'react';
import styled from 'styled-components';
import { Box } from '@mui/material';
import NavBar from './NavBar';
import { useTheme } from '../../hooks/useTheme';

const LayoutContainer = styled.div`
  display: flex;
  min-height: 100vh;
`;

const MainContent = styled.main`
  flex: 1;
  padding: ${(props) => props.theme.spacing.lg};
  padding-top: calc(64px + ${(props) => props.theme.spacing.lg});
  background-color: ${(props) => props.theme.colors.background};
`;

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  const { colors } = useTheme();

  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: colors.background,
        color: colors.text,
        pt: '64px', // Hauteur de la NavBar
      }}
    >
      <NavBar />
      <Box component="main" sx={{ p: 3 }}>
        {children}
      </Box>
    </Box>
  );
};

export default Layout;

export {};
