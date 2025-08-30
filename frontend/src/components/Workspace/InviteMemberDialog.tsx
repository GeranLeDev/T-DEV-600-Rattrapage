import { workspaceService } from '../../services/workspaceService';
import { workspaceJoinUrl } from '../../utils/urls';
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
const TRELO_INVITE_RE = /^https?:\/\/trello\.com\/invite\/(?:b\/)?[A-Za-z0-9]+\/[A-Za-z0-9]+/i;

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
  const [trelloLink, setTrelloLink] = useState('');
  const [copied, setCopied] = useState(false);
  const [directUsername, setDirectUsername] = useState('');
  const [directLoading, setDirectLoading] = useState(false);

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
    if (!TRELO_INVITE_RE.test(trelloLink)) {
      setError("Lien Trello invalide. Format attendu : https://trello.com/invite/{id}/{token}");
      return;
    }
    navigator.clipboard.writeText(trelloLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };


  const handleDirectInvite = async () => {
    const username = directUsername.trim().replace(/^@/, '');
    if (!username) return;
    setError('');
    setSuccess('');
    setDirectLoading(true);
    try {
      // ⇩ mets 'admin' si tu veux inviter en admin par défaut
      await workspaceService.addMemberByUsername(workspaceId, username, 'normal');
      setSuccess(`Invitation envoyée à @${username}`);
      setDirectUsername('');
    } catch (e: any) {
      if (e?.message === 'PERM') setError("Permissions insuffisantes pour inviter des membres.");
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
            onClick={handleDirectInvite}
            disabled={!directUsername.trim() || directLoading}
            sx={{ mt: 2, bgcolor: colors.primary, '&:hover': { bgcolor: colors.secondary } }}
          >
            {directLoading ? 'Envoi…' : 'Ajouter le membre'}
          </Button>
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          <Typography variant="body2" sx={{ mb: 2, color: colors.textSecondary }}>
            Collez un lien d’invitation Trello (créé depuis Trello) au format :
            <br />
            <code>https://trello.com/invite/&lt;id&gt;/&lt;token&gt;</code>
          </Typography>

          <TextField
            fullWidth
            placeholder="https://trello.com/invite/68b2de631d258e1c52a85aa9/ATTI612a3..."
            value={trelloLink}
            onChange={(e) => { setTrelloLink(e.target.value.trim()); setError(''); setSuccess(''); }}
            sx={{
              mb: 2,
              '& .MuiOutlinedInput-root': {
                '& fieldset': { borderColor: colors.border },
                '&:hover fieldset': { borderColor: colors.primary },
              },
            }}
          />

          {trelloLink && TRELO_INVITE_RE.test(trelloLink) && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, p: 2, bgcolor: colors.hover, borderRadius: 1 }}>
              <Typography variant="body2" sx={{ flex: 1, wordBreak: 'break-all', color: colors.text }}>
                <a href={trelloLink} target="_blank" rel="noreferrer">{trelloLink}</a>
              </Typography>
              <Tooltip title={copied ? 'Copié !' : 'Copier le lien'}>
                <IconButton onClick={handleCopyLink} size="small" disabled={!trelloLink}>
                  <CopyIcon />
                </IconButton>
              </Tooltip>
            </Box>
          )}

          {!trelloLink && (
            <Alert severity="info" sx={{ mt: 1 }}>
              Dans Trello, ouvre <strong>Inviter</strong> → <em>Créer un lien</em>, puis colle-le ici.
            </Alert>
          )}
        </TabPanel>


        <TabPanel value={tabValue} index={2}>
          <Typography variant="body2" sx={{ mb: 2, color: colors.textSecondary }}>
            Ajoutez directement un membre en utilisant son nom d'utilisateur Trello
          </Typography>

          <TextField
            autoFocus
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
