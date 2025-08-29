import { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  FormControl,
  FormHelperText,
  CircularProgress,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../hooks/useTheme';
import { workspaceService } from '../../services/workspaceService';
import { WorkspaceCreate } from '../../types/workspace';

export const CreateWorkspace = () => {
  const navigate = useNavigate();
  const { colors, shadows } = useTheme();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState<WorkspaceCreate>({
    name: '',
    displayName: '',
    description: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const workspaceData: WorkspaceCreate = {
        ...formData,
        displayName: formData.name,
      };
      const response = await workspaceService.create(workspaceData);
      console.log('Created workspace:', response);
      if (response && response.id) {
        workspaceService.setCurrentWorkspace(response);
        navigate(`/workspace/${response.id}`);
      } else {
        throw new Error('ID du workspace non reçu');
      }
    } catch (err: any) {
      console.error('Error creating workspace:', err.response?.data || err.message);
      setError('Une erreur est survenue lors de la création du workspace');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        maxWidth: '600px',
        mx: 'auto',
        mt: 4,
        p: 3,
      }}
    >
      <Paper
        elevation={0}
        sx={{
          p: 4,
          bgcolor: colors.card,
          boxShadow: shadows.card,
          border: `1px solid ${colors.border}`,
        }}
      >
        <Typography variant="h5" component="h1" gutterBottom>
          Créer un nouveau workspace
        </Typography>

        <form onSubmit={handleSubmit}>
          <FormControl fullWidth sx={{ mb: 3 }}>
            <TextField
              label="Nom du workspace"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              sx={{
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: colors.border,
                  },
                  '&:hover fieldset': {
                    borderColor: colors.primary,
                  },
                },
              }}
            />
            <FormHelperText>Donnez un nom descriptif à votre workspace</FormHelperText>
          </FormControl>

          <FormControl fullWidth sx={{ mb: 4 }}>
            <TextField
              label="Description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              multiline
              rows={4}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: colors.border,
                  },
                  '&:hover fieldset': {
                    borderColor: colors.primary,
                  },
                },
              }}
            />
            <FormHelperText>Décrivez l'objectif de ce workspace (optionnel)</FormHelperText>
          </FormControl>

          {error && (
            <Typography color="error" sx={{ mb: 2 }}>
              {error}
            </Typography>
          )}

          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              type="submit"
              variant="contained"
              disabled={loading}
              sx={{
                bgcolor: colors.primary,
                '&:hover': {
                  bgcolor: colors.primary,
                  opacity: 0.9,
                },
              }}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : 'Créer le workspace'}
            </Button>
            <Button
              variant="outlined"
              onClick={() => navigate('/workspaces')}
              sx={{
                borderColor: colors.border,
                color: colors.text,
                '&:hover': {
                  borderColor: colors.primary,
                },
              }}
            >
              Annuler
            </Button>
          </Box>
        </form>
      </Paper>
    </Box>
  );
};
