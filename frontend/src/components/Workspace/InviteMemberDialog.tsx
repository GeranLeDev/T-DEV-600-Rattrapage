import { workspaceService } from '../../services/workspaceService';
import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Tabs,
  Tab,
  Box,
  Typography,
  Alert,
} from '@mui/material';
import {
  Email as EmailIcon,
  PersonAdd as PersonAddIcon,
} from '@mui/icons-material';
import { useTheme } from '../../hooks/useTheme';

interface InviteMemberDialogProps {
  open: boolean;
  onClose: () => void;
  onInvite: (email: string) => Promise<void>;
  workspaceId: string;
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`invite-tabpanel-${index}`}
      aria-labelledby={`invite-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

export const InviteMemberDialog: React.FC<InviteMemberDialogProps> = ({
  open,
  onClose,
  onInvite,
  workspaceId,
}) => {
  const { colors } = useTheme();
  const [tabValue, setTabValue] = useState(0);
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [directUsername, setDirectUsername] = useState('');
  const [directLoading, setDirectLoading] = useState(false);

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
    setError('');
    setSuccess('');
  };

  const handleEmailInvite = async () => {
    try {
      await onInvite(email.trim());
      setSuccess('Invitation envoyée avec succès');
      setEmail('');
    } catch {
      setError("Erreur lors de l'envoi de l'invitation");
    }
  };

  const handleDirectInvite = async () => {
    const username = directUsername.trim().replace(/^@/, '');
    if (!username) return;
    setError('');
    setSuccess('');
    setDirectLoading(true);
    try {
      // Passe 'admin' à la place de 'normal' si tu veux inviter en admin par défaut
      await workspaceService.addMemberByUsername(workspaceId, username, 'normal');
      setSuccess(`Invitation envoyée à @${username}`);
      setDirectUsername('');
    } catch (e: any) {
      if (e?.message === 'PERM') setError('Permissions insuffisantes pour inviter des membres.');
      else if (e?.message === 'USERNAME') setError("Nom d'utilisateur introuvable.");
      else setError("Erreur lors de l'invitation par nom d'utilisateur.");
    } finally {
      setDirectLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: { bgcolor: colors.card, color: colors.text },
      }}
    >
      <DialogTitle>Inviter un membre</DialogTitle>
      <DialogContent>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          sx={{
            borderBottom: `1px solid ${colors.border}`,
            '& .MuiTab-root': {
              color: colors.textSecondary,
              '&.Mui-selected': { color: colors.primary },
            },
          }}
        >
          <Tab icon={<EmailIcon />} label="Par email" iconPosition="start" />
          <Tab icon={<PersonAddIcon />} label="Direct" iconPosition="start" />
        </Tabs>

        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}
        {success && (
          <Alert severity="success" sx={{ mt: 2 }}>
            {success}
          </Alert>
        )}

        {/* Onglet PAR EMAIL */}
        <TabPanel value={tabValue} index={0}>
          <TextField
            autoFocus
            margin="dense"
            label="Adresse email"
            type="email"
            fullWidth
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            sx={{
              '& .MuiOutlinedInput-root': {
                '& fieldset': { borderColor: colors.border },
                '&:hover fieldset': { borderColor: colors.primary },
              },
            }}
          />
          <Button
            variant="contained"
            onClick={handleEmailInvite}
            disabled={!email.trim()}
            sx={{ mt: 2, bgcolor: colors.primary, '&:hover': { bgcolor: colors.secondary } }}
          >
            Envoyer l'invitation
          </Button>
        </TabPanel>

        {/* Onglet DIRECT (@username) */}
        <TabPanel value={tabValue} index={1}>
          <Typography variant="body2" sx={{ mb: 2, color: colors.textSecondary }}>
            Ajoutez directement un membre en utilisant son nom d'utilisateur Trello
          </Typography>
          <TextField
            margin="dense"
            label="Nom d'utilisateur Trello (ex : johndoe ou @johndoe)"
            fullWidth
            value={directUsername}
            onChange={(e) => setDirectUsername(e.target.value)}
            sx={{
              '& .MuiOutlinedInput-root': {
                '& fieldset': { borderColor: colors.border },
                '&:hover fieldset': { borderColor: colors.primary },
              },
            }}
          />
          <Button
            variant="contained"
            onClick={handleDirectInvite}
            disabled={!directUsername.trim() || directLoading}
            sx={{ mt: 2, bgcolor: colors.primary, '&:hover': { bgcolor: colors.secondary } }}
          >
            {directLoading ? 'Envoi…' : 'Ajouter le membre'}
          </Button>
        </TabPanel>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} sx={{ color: colors.textSecondary }}>
          Fermer
        </Button>
      </DialogActions>
    </Dialog>
  );
};
