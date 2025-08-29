import { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  FormControl,
  FormHelperText,
  Switch,
  FormControlLabel,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Alert,
  CircularProgress,
} from '@mui/material';
import { Delete as DeleteIcon } from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';
import { useTheme } from '../../hooks/useTheme';
import { api } from '../../services/api';
import { Workspace } from '../../types/workspace';

export const WorkspaceSettings = () => {
  const { workspaceId } = useParams<{ workspaceId: string }>();
  const navigate = useNavigate();
  const { colors, shadows } = useTheme();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [openDelete, setOpenDelete] = useState(false);
  const [workspace, setWorkspace] = useState<Workspace | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    isPrivate: true,
    allowInvites: true,
    enableNotifications: true,
  });

  useEffect(() => {
    const fetchWorkspaceData = async () => {
      if (!workspaceId) return;

      try {
        setLoading(true);
        const response = await api.get(`/organizations/${workspaceId}`, {
          params: {
            fields: 'id,name,displayName,desc,prefs',
          },
        });

        const workspaceData = response.data;
        setWorkspace(workspaceData);
        setFormData({
          name: workspaceData.displayName || workspaceData.name,
          description: workspaceData.desc || '',
          isPrivate: workspaceData.prefs?.permissionLevel === 'private',
          allowInvites: workspaceData.prefs?.invitations === 'members',
          enableNotifications: workspaceData.prefs?.notifications || true,
        });
      } catch (err) {
        console.error('Erreur lors de la récupération du workspace:', err);
        setError('Impossible de charger les données du workspace');
      } finally {
        setLoading(false);
      }
    };

    fetchWorkspaceData();
  }, [workspaceId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: e.target.type === 'checkbox' ? checked : value,
    }));
  };

  const formatShortName = (name: string): string => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '_') // Remplace les caractères non autorisés par des underscores
      .replace(/_{2,}/g, '_') // Remplace les underscores multiples par un seul
      .replace(/^_|_$/g, ''); // Supprime les underscores au début et à la fin
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // Mise à jour du nom affiché et de la description uniquement
      await api.put(`/organizations/${workspaceId}`, {
        displayName: formData.name,
        desc: formData.description,
      });

      // Mise à jour de la visibilité
      if (workspace?.prefs?.permissionLevel !== (formData.isPrivate ? 'private' : 'public')) {
        await api.put(`/organizations/${workspaceId}`, {
          prefs_permissionLevel: formData.isPrivate ? 'private' : 'public',
        });
      }

      // Mise à jour des permissions d'invitation
      if (workspace?.prefs?.invitations !== (formData.allowInvites ? 'members' : 'admins')) {
        await api.put(`/organizations/${workspaceId}`, {
          prefs_invitations: formData.allowInvites ? 'members' : 'admins',
        });
      }

      // Mise à jour des notifications
      if (workspace?.prefs?.notifications !== formData.enableNotifications) {
        await api.put(`/organizations/${workspaceId}`, {
          prefs_notifications: formData.enableNotifications,
        });
      }

      // Recharger les données du workspace
      const response = await api.get(`/organizations/${workspaceId}`, {
        params: {
          fields: 'id,name,displayName,desc,prefs',
        },
      });
      setWorkspace(response.data);

      setSuccess('Les paramètres ont été mis à jour avec succès');
    } catch (err: any) {
      console.error('Erreur lors de la mise à jour:', err);
      setError(
        err.response?.data?.message ||
          'Une erreur est survenue lors de la mise à jour des paramètres'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      setLoading(true);
      await api.delete(`/organizations/${workspaceId}`);
      navigate('/workspaces');
    } catch (err) {
      console.error('Erreur lors de la suppression:', err);
      setError('Une erreur est survenue lors de la suppression du workspace');
      setOpenDelete(false);
    } finally {
      setLoading(false);
    }
  };

  if (loading && !workspace) {
    return (
      <Box
        sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3, maxWidth: '800px', margin: '0 auto' }}>
      <Paper sx={{ p: 3, bgcolor: colors.card, boxShadow: shadows.card }}>
        <Typography variant="h5" sx={{ mb: 3, color: colors.text }}>
          Paramètres du workspace
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {success}
          </Alert>
        )}

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
                  '& fieldset': { borderColor: colors.border },
                  '&:hover fieldset': { borderColor: colors.primary },
                },
                '& .MuiInputLabel-root': { color: colors.textSecondary },
              }}
            />
            <FormHelperText sx={{ color: colors.textSecondary }}>
              Le nom qui sera affiché pour votre workspace
            </FormHelperText>
          </FormControl>

          <FormControl fullWidth sx={{ mb: 3 }}>
            <TextField
              label="Description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              multiline
              rows={4}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '& fieldset': { borderColor: colors.border },
                  '&:hover fieldset': { borderColor: colors.primary },
                },
                '& .MuiInputLabel-root': { color: colors.textSecondary },
              }}
            />
            <FormHelperText sx={{ color: colors.textSecondary }}>
              Une description détaillée de votre workspace
            </FormHelperText>
          </FormControl>

          <Divider sx={{ my: 3, borderColor: colors.border }} />

          <Typography variant="h6" sx={{ mb: 2, color: colors.text }}>
            Préférences
          </Typography>

          <FormControlLabel
            control={
              <Switch
                checked={formData.isPrivate}
                onChange={handleChange}
                name="isPrivate"
                color="primary"
              />
            }
            label="Workspace privé"
            sx={{ mb: 2, color: colors.text }}
          />

          <FormControlLabel
            control={
              <Switch
                checked={formData.allowInvites}
                onChange={handleChange}
                name="allowInvites"
                color="primary"
              />
            }
            label="Autoriser les membres à inviter"
            sx={{ mb: 2, color: colors.text }}
          />

          <FormControlLabel
            control={
              <Switch
                checked={formData.enableNotifications}
                onChange={handleChange}
                name="enableNotifications"
                color="primary"
              />
            }
            label="Activer les notifications"
            sx={{ mb: 3, color: colors.text }}
          />

          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
            <Button
              variant="contained"
              color="error"
              startIcon={<DeleteIcon />}
              onClick={() => setOpenDelete(true)}
              sx={{ bgcolor: 'error.main', '&:hover': { bgcolor: 'error.dark' } }}
            >
              Supprimer le workspace
            </Button>

            <Button
              type="submit"
              variant="contained"
              disabled={loading}
              sx={{
                bgcolor: colors.primary,
                '&:hover': { bgcolor: colors.secondary },
              }}
            >
              {loading ? <CircularProgress size={24} /> : 'Enregistrer les modifications'}
            </Button>
          </Box>
        </form>
      </Paper>

      <Dialog
        open={openDelete}
        onClose={() => setOpenDelete(false)}
        PaperProps={{
          sx: {
            bgcolor: colors.card,
            color: colors.text,
          },
        }}
      >
        <DialogTitle>Confirmer la suppression</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ color: colors.textSecondary }}>
            Êtes-vous sûr de vouloir supprimer ce workspace ? Cette action est irréversible et
            supprimera tous les tableaux et données associés.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDelete(false)} sx={{ color: colors.textSecondary }}>
            Annuler
          </Button>
          <Button
            onClick={handleDelete}
            color="error"
            disabled={loading}
            sx={{ color: 'error.main' }}
          >
            {loading ? <CircularProgress size={24} /> : 'Supprimer'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
