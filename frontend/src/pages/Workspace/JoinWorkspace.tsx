import React, { useEffect, useState } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { Box, Paper, Typography, Button, CircularProgress, Alert } from '@mui/material';
import { useTheme } from '../../hooks/useTheme';
import { workspaceService } from '../../services/workspaceService';

export const JoinWorkspace = () => {
  const { workspaceId } = useParams<{ workspaceId: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { colors, shadows } = useTheme();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const joinWorkspace = async () => {
      if (!workspaceId) {
        setError('ID du workspace non trouvé');
        setLoading(false);
        return;
      }

      const token = searchParams.get('token');
      if (!token) {
        setError("Lien d'invitation invalide");
        setLoading(false);
        return;
      }

      try {
        await workspaceService.acceptInviteLink(workspaceId, token);
        setSuccess(true);
        // Rediriger vers le workspace après 2 secondes
        setTimeout(() => {
          navigate(`/workspaces/${workspaceId}`);
        }, 2000);
      } catch (err: any) {
        setError(err.message || "Une erreur est survenue lors de l'acceptation de l'invitation");
      } finally {
        setLoading(false);
      }
    };

    joinWorkspace();
  }, [workspaceId, searchParams, navigate]);

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        p: 3,
      }}
    >
      <Paper
        elevation={0}
        sx={{
          p: 4,
          maxWidth: 400,
          width: '100%',
          bgcolor: colors.card,
          boxShadow: shadows.card,
          border: `1px solid ${colors.border}`,
        }}
      >
        {error ? (
          <>
            <Typography variant="h5" gutterBottom sx={{ color: colors.text }}>
              Erreur
            </Typography>
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
            <Button
              variant="contained"
              onClick={() => navigate('/')}
              sx={{
                bgcolor: colors.primary,
                '&:hover': { bgcolor: colors.secondary },
              }}
            >
              Retour à l'accueil
            </Button>
          </>
        ) : success ? (
          <>
            <Typography variant="h5" gutterBottom sx={{ color: colors.text }}>
              Succès !
            </Typography>
            <Alert severity="success" sx={{ mb: 2 }}>
              Vous avez rejoint le workspace avec succès. Redirection...
            </Alert>
          </>
        ) : null}
      </Paper>
    </Box>
  );
};
