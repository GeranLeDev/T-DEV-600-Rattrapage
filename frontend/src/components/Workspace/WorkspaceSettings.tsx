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
  });

  useEffect(() => {
    const fetchWorkspaceData = async () => {
      if (!workspaceId) return;

      try {
        setLoading(true);
        const { data } = await api.get(`/organizations/${workspaceId}`, {
          params: { fields: 'id,name,displayName,desc,prefs' },
        });

        setWorkspace(data);
        setFormData({
          name: data.displayName || data.name,
          description: data.desc || '',
          isPrivate: data.prefs?.permissionLevel === 'private',
          allowInvites: true,
        });
      } catch (err) {
        console.error('Erreur lors du chargement du workspace:', err);
        setError('Impossible de charger les données du workspace');
      } finally {
        setLoading(false);
      }
    };

    fetchWorkspaceData();
  }, [workspaceId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, checked, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  // Le switch ne fait qu'actualiser le state local (pas d'appel API ici)
  const handleTogglePrivacy = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newIsPrivate = e.target.checked;
    setFormData((prev) => ({ ...prev, isPrivate: newIsPrivate }));
    setSuccess('');
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!workspaceId) return;

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // 1) Nom + description
      await api.put(`/organizations/${workspaceId}`, {
        displayName: formData.name,
        desc: formData.description,
      });

      // 2) Visibilité (private/public) — utiliser des slashes dans les clés, en query params
      const desiredPermission = formData.isPrivate ? 'private' : 'public';
      if (workspace?.prefs?.permissionLevel !== desiredPermission) {
        await api.put(
          `/organizations/${workspaceId}`,
          undefined,
          { params: { 'prefs/permissionLevel': desiredPermission } }
        );
      }

      // 3) Permissions d'invitation
      const desiredInvites = formData.allowInvites ? 'members' : 'admins';
      if (workspace?.prefs?.invitations !== desiredInvites) {
        await api.put(
          `/organizations/${workspaceId}`,
          undefined,
          { params: { 'prefs/invitations': desiredInvites } }
        );
      }

      // 4) Rafraîchir l’objet serveur
      const refreshed = await api.get(`/organizations/${workspaceId}`, {
        params: { fields: 'id,name,displayName,desc,prefs' },
      });
      setWorkspace(refreshed.data);

      setSuccess('Les paramètres ont été mis à jour avec succès');
    } catch (err: any) {
      console.error('Erreur lors de la mise à jour:', err?.response?.data || err);
      setError(
        err?.response?.data?.message ||
        'Une erreur est survenue lors de la mise à jour des paramètres'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!workspaceId) return;
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
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3, maxWidth: '800px', margin: '0 auto' }}>
      <Paper sx={{ p: 3, bgcolor: colors.card, boxShadow: shadows.card }}>
        <Typography
          variant="h5"
          sx={{ mb: 3, color: colors.text, display: 'flex', alignItems: 'center', gap: 1 }}
        >
          Paramètres du workspace
          <Box
            component="span"
            sx={{
              px: 1,
              py: 0.25,
              fontSize: 12,
              borderRadius: 1,
              bgcolor: formData.isPrivate ? colors.hover : 'success.main',
              color: formData.isPrivate ? colors.textSecondary : '#fff',
            }}
          >
            {formData.isPrivate ? 'Privé' : 'Public'}
          </Box>
        </Typography>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

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
                onChange={handleTogglePrivacy} // MAJ locale seulement
                color="primary"
              />
            }
            label={`Workspace ${formData.isPrivate ? 'privé' : 'public'}`}
            sx={{ mb: 2, color: colors.text }}
          />

          <FormControlLabel
            control={
              <Switch
                checked // toujours ON
                disabled // non modifiable
                color="primary"
              />
            }
            label="Autoriser les membres à inviter"
            sx={{ mb: 2, color: colors.text }}
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
              sx={{ bgcolor: colors.primary, '&:hover': { bgcolor: colors.secondary } }}
            >
              {loading ? <CircularProgress size={24} /> : 'Enregistrer les modifications'}
            </Button>
          </Box>
        </form>
      </Paper>

      <Dialog
        open={openDelete}
        onClose={() => setOpenDelete(false)}
        PaperProps={{ sx: { bgcolor: colors.card, color: colors.text } }}
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
          <Button onClick={handleDelete} color="error" disabled={loading} sx={{ color: 'error.main' }}>
            {loading ? <CircularProgress size={24} /> : 'Supprimer'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
