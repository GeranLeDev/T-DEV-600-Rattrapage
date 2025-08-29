import React from 'react';
import { Typography, Box, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const HomePage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 'calc(100vh - 64px)',
        textAlign: 'center',
        p: 3,
      }}
    >
      <Typography variant="h2" component="h1" gutterBottom>
        Bienvenue sur Trello Clone
      </Typography>
      <Typography variant="h5" component="h2" gutterBottom color="text.secondary">
        Organisez vos projets et collaborez avec votre équipe
      </Typography>
      <Box sx={{ mt: 4 }}>
        <Button variant="contained" size="large" onClick={() => navigate('/workspaces')}>
          Commencer
        </Button>
      </Box>
    </Box>
  );
};

export default HomePage;
