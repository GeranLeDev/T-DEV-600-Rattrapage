import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  Box,
  Paper,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Button,
  Avatar,
  Alert,
  CircularProgress,
  Menu,
  MenuItem,
  ListItemIcon,
  TextField,
  InputAdornment,
  Chip,
  Tooltip,
} from '@mui/material';
import {
  Delete as DeleteIcon,
  PersonAdd as PersonAddIcon,
  Edit as EditIcon,
  Search as SearchIcon,
  AdminPanelSettings as AdminIcon,
  Person as PersonIcon,
  MoreVert as MoreVertIcon,
  FiberManualRecord as StatusIcon,
} from '@mui/icons-material';
import { useTheme } from '../../hooks/useTheme';
import { workspaceService } from '../../services/workspaceService';
import { Member } from '../../types/workspace';
import { InviteMemberDialog } from './InviteMemberDialog';

export const WorkspaceMembers = () => {
  const { workspaceId } = useParams<{ workspaceId: string }>();
  const { colors, shadows } = useTheme();
  const [members, setMembers] = useState<Member[]>([]);
  const [openInvite, setOpenInvite] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const lower = (v?: string) => (v ?? '').toLowerCase();

  useEffect(() => {
    const fetchMembers = async () => {
      if (!workspaceId) {
        setError('ID du workspace non trouvé');
        return;
      }

      try {
        setLoading(true);
        const response = await workspaceService.getMembers(workspaceId);
        setMembers(response);
        setError('');
      } catch (err: any) {
        console.error('Error details:', err.response?.data || err.message);
        const errorMessage =
          err.response?.data?.message || err.message || 'Une erreur est survenue';
        setError(`Erreur lors de la récupération des membres: ${errorMessage}`);
        setMembers([]);
      } finally {
        setLoading(false);
      }
    };

    fetchMembers();
  }, [workspaceId]);

  const handleInvite = async (email: string) => {
    if (!workspaceId) return;
    try {
      await workspaceService.addMember(workspaceId, email);
      const updatedMembers = await workspaceService.getMembers(workspaceId);
      setMembers(updatedMembers);
    } catch (err) {
      throw new Error("Erreur lors de l'envoi de l'invitation");
    }
  };

  const handleRemoveMember = async (memberId: string) => {
    if (!workspaceId) return;
    try {
      await workspaceService.removeMember(workspaceId, memberId);
      setMembers(members.filter((member) => member.id !== memberId));
    } catch (err) {
      setError('Erreur lors de la suppression du membre');
    }
  };

  const handleChangeRole = async (memberId: string, newRole: 'admin' | 'member') => {
    if (!workspaceId) return;
    try {
      await workspaceService.updateMemberRole(workspaceId, memberId, newRole);
      setMembers(
        members.map((member) => (member.id === memberId ? { ...member, role: newRole } : member))
      );
    } catch (err) {
      setError('Erreur lors du changement de rôle');
    }
  };

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>, member: Member) => {
    setAnchorEl(event.currentTarget);
    setSelectedMember(member);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedMember(null);
  };

  const list = Array.isArray(members) ? members : [];
  const q = lower(searchQuery);

  const filteredMembers = list.filter((m) => {
    const username = lower(m.username);
    const fullName = lower(m.fullName);
    return username.includes(q) || fullName.includes(q);
  });


  if (loading) {
    return (
      <Box
        sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '200px' }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: '800px', mx: 'auto', mt: 4, p: 3 }}>
      <Paper
        elevation={0}
        sx={{
          p: 4,
          bgcolor: colors.card,
          boxShadow: shadows.card,
          border: `1px solid ${colors.border}`,
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4 }}>
          <Typography variant="h5" component="h1">
            Membres du workspace
          </Typography>
          <Button
            variant="contained"
            startIcon={<PersonAddIcon />}
            onClick={() => setOpenInvite(true)}
            sx={{
              bgcolor: colors.primary,
              '&:hover': {
                bgcolor: colors.primary,
                opacity: 0.9,
              },
            }}
          >
            Inviter
          </Button>
        </Box>

        <TextField
          fullWidth
          variant="outlined"
          placeholder="Rechercher un membre..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          sx={{ mb: 3 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: colors.textSecondary }} />
              </InputAdornment>
            ),
          }}
        />

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {filteredMembers.length > 0 ? (
          <List>
            {filteredMembers.map((member) => (
              <ListItem
                key={member.id}
                sx={{
                  borderBottom: `1px solid ${colors.border}`,
                  '&:last-child': {
                    borderBottom: 'none',
                  },
                }}
              >
                <Box sx={{ position: 'relative', mr: 2 }}>
                  <Avatar>{member.fullName?.charAt(0) || member.username?.charAt(0)}</Avatar>
                  <StatusIcon
                    sx={{
                      position: 'absolute',
                      bottom: 0,
                      right: 0,
                      color: member.lastActive ? '#4caf50' : '#9e9e9e',
                      fontSize: '1rem',
                      bgcolor: colors.card,
                      borderRadius: '50%',
                    }}
                  />
                </Box>
                <ListItemText
                  primary={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      {member.fullName || member.username}
                      <Chip
                        size="small"
                        label={member.role === 'admin' ? 'Admin' : 'Membre'}
                        icon={member.role === 'admin' ? <AdminIcon /> : <PersonIcon />}
                        sx={{
                          bgcolor: member.role === 'admin' ? colors.primary : colors.hover,
                          color: member.role === 'admin' ? '#fff' : colors.text,
                        }}
                      />
                    </Box>
                  }
                  secondary={
                    <Box>
                      <Typography variant="body2" color="textSecondary">
                        {member.username}
                      </Typography>
                      {member.lastActive && (
                        <Typography variant="caption" color="textSecondary">
                          Dernière activité : {new Date(member.lastActive).toLocaleDateString()}
                        </Typography>
                      )}
                    </Box>
                  }
                />
                <ListItemSecondaryAction>
                  <IconButton
                    edge="end"
                    aria-label="more"
                    onClick={(e) => handleMenuClick(e, member)}
                    sx={{ color: colors.textSecondary }}
                  >
                    <MoreVertIcon />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
        ) : (
          !error && (
            <Typography sx={{ textAlign: 'center', color: colors.textSecondary }}>
              Aucun membre trouvé
            </Typography>
          )
        )}
      </Paper>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        PaperProps={{
          sx: {
            bgcolor: colors.card,
            color: colors.text,
          },
        }}
      >
        {selectedMember && (
          <>
            <MenuItem
              onClick={() => {
                handleChangeRole(
                  selectedMember.id,
                  selectedMember.role === 'admin' ? 'member' : 'admin'
                );
                handleMenuClose();
              }}
            >
              <ListItemIcon>
                {selectedMember.role === 'admin' ? (
                  <PersonIcon fontSize="small" />
                ) : (
                  <AdminIcon fontSize="small" />
                )}
              </ListItemIcon>
              {selectedMember.role === 'admin' ? 'Rétrograder en membre' : 'Promouvoir admin'}
            </MenuItem>
            <MenuItem
              onClick={() => {
                handleRemoveMember(selectedMember.id);
                handleMenuClose();
              }}
              sx={{ color: 'error.main' }}
            >
              <ListItemIcon>
                <DeleteIcon fontSize="small" sx={{ color: 'error.main' }} />
              </ListItemIcon>
              Supprimer le membre
            </MenuItem>
          </>
        )}
      </Menu>

      <InviteMemberDialog
        open={openInvite}
        onClose={() => setOpenInvite(false)}
        onInvite={handleInvite}
        workspaceId={workspaceId || ''}
      />
    </Box>
  );
};
