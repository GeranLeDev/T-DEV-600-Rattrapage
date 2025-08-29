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
  IconButton,
  Tooltip,
  Alert,
} from '@mui/material';
import {
  ContentCopy as CopyIcon,
  Email as EmailIcon,
  Link as LinkIcon,
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
  const [inviteLink, setInviteLink] = useState('');
  const [copied, setCopied] = useState(false);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
    setError('');
    setSuccess('');
  };

  const handleEmailInvite = async () => {
    try {
      await onInvite(email);
      setSuccess('Invitation envoyée avec succès');
      setEmail('');
    } catch (err) {
      setError("Erreur lors de l'envoi de l'invitation");
    }
  };

  const handleCopyLink = () => {
    const link = `${window.location.origin}/workspaces/${workspaceId}/join?token=${inviteLink}`;
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const generateInviteLink = () => {
    // Générer un token unique pour l'invitation
    const token = Math.random().toString(36).substring(2, 15);
    setInviteLink(token);
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          bgcolor: colors.card,
          color: colors.text,
        },
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
              '&.Mui-selected': {
                color: colors.primary,
              },
            },
          }}
        >
          <Tab icon={<EmailIcon />} label="Par email" iconPosition="start" />
          <Tab icon={<LinkIcon />} label="Lien d'invitation" iconPosition="start" />
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
            sx={{
              mt: 2,
              bgcolor: colors.primary,
              '&:hover': { bgcolor: colors.secondary },
            }}
          >
            Envoyer l'invitation
          </Button>
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          <Typography variant="body2" sx={{ mb: 2, color: colors.textSecondary }}>
            Générez un lien d'invitation unique pour partager avec vos membres
          </Typography>
          <Button
            variant="outlined"
            onClick={generateInviteLink}
            sx={{
              mb: 2,
              borderColor: colors.border,
              color: colors.text,
              '&:hover': { borderColor: colors.primary },
            }}
          >
            Générer un lien
          </Button>
          {inviteLink && (
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                p: 2,
                bgcolor: colors.hover,
                borderRadius: 1,
              }}
            >
              <Typography
                variant="body2"
                sx={{
                  flex: 1,
                  wordBreak: 'break-all',
                  color: colors.text,
                }}
              >
                {`${window.location.origin}/workspaces/${workspaceId}/join?token=${inviteLink}`}
              </Typography>
              <Tooltip title={copied ? 'Copié !' : 'Copier le lien'}>
                <IconButton onClick={handleCopyLink} size="small">
                  <CopyIcon />
                </IconButton>
              </Tooltip>
            </Box>
          )}
        </TabPanel>

        <TabPanel value={tabValue} index={2}>
          <Typography variant="body2" sx={{ mb: 2, color: colors.textSecondary }}>
            Ajoutez directement un membre en utilisant son nom d'utilisateur
          </Typography>
          <TextField
            autoFocus
            margin="dense"
            label="Nom d'utilisateur"
            fullWidth
            sx={{
              '& .MuiOutlinedInput-root': {
                '& fieldset': { borderColor: colors.border },
                '&:hover fieldset': { borderColor: colors.primary },
              },
            }}
          />
          <Button
            variant="contained"
            sx={{
              mt: 2,
              bgcolor: colors.primary,
              '&:hover': { bgcolor: colors.secondary },
            }}
          >
            Ajouter le membre
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
