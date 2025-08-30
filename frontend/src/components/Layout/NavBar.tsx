import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Box,
  TextField,
  Menu,
  MenuItem,
  Divider,
  ListItemIcon,
  CircularProgress,
} from '@mui/material';
import {
  Home as HomeIcon,
  Notifications as NotificationsIcon,
  Person as PersonIcon,
  Add as AddIcon,
  Settings as SettingsIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Group as GroupIcon,
  ViewList as ViewListIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../hooks/useTheme';
import { ThemeSelector } from '../Theme/ThemeSelector';
import { workspaceService } from '../../services/workspaceService';
import { Workspace } from '../../types/workspace';
import { api } from '../../services/api';

const StyledAppBar = styled(AppBar)`
  background-color: ${(props) => props.theme.colors.background};
  box-shadow: ${(props) => props.theme.shadows.navbar};
`;

const NavContainer = styled.div`
  display: flex;
  align-items: center;
  gap: ${(props) => props.theme.spacing.md};
`;

const NavItem = styled.button`
  background: none;
  border: none;
  color: ${(props) => props.theme.colors.text};
  cursor: pointer;
  padding: ${(props) => props.theme.spacing.sm};
  font-size: ${(props) => props.theme.typography.fontSize.regular};
  display: flex;
  align-items: center;
  gap: ${(props) => props.theme.spacing.xs};

  &:hover {
    color: ${(props) => props.theme.colors.primary};
  }
`;

const SearchInput = styled(TextField)`
  width: 200px;
  margin: 0 ${(props) => props.theme.spacing.md};

  .MuiOutlinedInput-root {
    background-color: ${(props) => props.theme.colors.input};
    border-color: ${(props) => props.theme.colors.border};

    &:hover {
      border-color: ${(props) => props.theme.colors.primary};
    }
  }
`;

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const { colors, shadows } = useTheme();
  const [recentAnchorEl, setRecentAnchorEl] = useState<null | HTMLElement>(null);
  const [workspacesAnchorEl, setWorkspacesAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedWorkspaceId, setSelectedWorkspaceId] = useState<string | null>(null);
  const [currentWorkspace, setCurrentWorkspace] = useState<Workspace | null>(null);
  const [recentWorkspaces, setRecentWorkspaces] = useState<Workspace[]>([]);
  const [loadingRecents, setLoadingRecents] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const workspace = workspaceService.getCurrentWorkspace();
        const recents = await workspaceService.getRecentWorkspaces();
        setCurrentWorkspace(workspace);
        setRecentWorkspaces(recents);
      } catch (error) {
        console.error('Erreur lors de la récupération des données:', error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchRecentWorkspaces = async () => {
      setLoadingRecents(true);
      try {
        const recents = await workspaceService.getRecentWorkspaces();
        setRecentWorkspaces(recents);
      } catch (error) {
        console.error('Erreur lors de la récupération des workspaces récents:', error);
      } finally {
        setLoadingRecents(false);
      }
    };
    fetchRecentWorkspaces();
  }, []);

  const handleRecentClick = (event: React.MouseEvent<HTMLElement>) => {
    setRecentAnchorEl(event.currentTarget);
  };

  const handleWorkspacesClick = (event: React.MouseEvent<HTMLElement>) => {
    setWorkspacesAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setRecentAnchorEl(null);
    setWorkspacesAnchorEl(null);
  };

  const handleCreateWorkspace = () => {
    navigate('/workspaces/create');
    handleClose();
  };

  const handleEditWorkspace = (id: string) => {
    navigate(`/workspace/${id}`);
    handleClose();
  };
  

  const handleWorkspaceSettings = (id: string) => {
    navigate(`/workspaces/${id}/settings`);
    handleClose();
  };

  const handleWorkspaceClick = (workspace: Workspace) => {
    if (selectedWorkspaceId === workspace.id) {
      setSelectedWorkspaceId(null);
    } else {
      setSelectedWorkspaceId(workspace.id);
      setCurrentWorkspace(workspace);
    }
  };

  const handleContextMenuClose = () => setSelectedWorkspaceId(null);

  const handleManageMembers = () => {
    if (currentWorkspace) {
      navigate(`/workspaces/${currentWorkspace.id}/members`);
    } else {
      navigate('/workspaces');
    }
    handleClose();
  };

  const handleViewAllWorkspaces = () => {
    navigate('/workspaces');
    handleClose();
  };

  const handleDeleteWorkspace = async (workspaceId: string) => {
    try {
      await api.delete(`/organizations/${workspaceId}`);
      const updatedRecents = recentWorkspaces.filter((w) => w.id !== workspaceId);
      setRecentWorkspaces(updatedRecents);
      handleContextMenuClose();
      if (currentWorkspace?.id === workspaceId) navigate('/workspaces');
    } catch (err: any) {
      console.error('Erreur lors de la suppression:', err);
    }
  };

  return (
    <AppBar
      position="fixed"
      sx={{
        bgcolor: colors.card,
        color: colors.text,
        boxShadow: shadows.navbar,
        borderBottom: `1px solid ${colors.border}`,
      }}
    >
      <Toolbar>
        <IconButton edge="start" color="inherit" onClick={() => navigate('/')} sx={{ mr: 2 }}>
          <HomeIcon />
        </IconButton>

        <Box sx={{ display: 'flex', gap: 2, ml: 2 }}>
          <Typography
            variant="subtitle1"
            sx={{ cursor: 'pointer', '&:hover': { color: colors.primary } }}
            onClick={handleWorkspacesClick}
          >
            Workspaces
          </Typography>
          <Typography
            variant="subtitle1"
            sx={{ cursor: 'pointer', '&:hover': { color: colors.primary } }}
            onClick={handleRecentClick}
          >
            Recent
          </Typography>
        </Box>

        <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center', mx: 4 }}>
          <TextField
            placeholder="Search..."
            size="small"
            sx={{
              width: '300px',
              '& .MuiOutlinedInput-root': {
                bgcolor: colors.input,
                color: colors.text,
                '& fieldset': { borderColor: colors.border },
                '&:hover fieldset': { borderColor: colors.primary },
              },
            }}
          />
        </Box>

        <Box sx={{ display: 'flex', gap: 1 }}>
          <ThemeSelector />
          <IconButton color="inherit">
            <NotificationsIcon />
          </IconButton>
          <IconButton color="inherit">
            <PersonIcon />
          </IconButton>
        </Box>
      </Toolbar>

      {/* Workspaces menu — affiche NOMS UNIQUEMENT */}
      <Menu
        anchorEl={workspacesAnchorEl}
        open={Boolean(workspacesAnchorEl)}
        onClose={handleClose}
        PaperProps={{
          sx: { bgcolor: colors.card, color: colors.text, width: '250px' },
        }}
      >
        <MenuItem onClick={handleViewAllWorkspaces}>
          <ListItemIcon>
            <ViewListIcon sx={{ color: colors.text }} />
          </ListItemIcon>
          Voir tous les workspaces
        </MenuItem>
        <MenuItem onClick={handleCreateWorkspace}>
          <ListItemIcon>
            <AddIcon sx={{ color: colors.text }} />
          </ListItemIcon>
          Créer un workspace
        </MenuItem>
        <Divider sx={{ my: 1, borderColor: colors.border }} />
        <Typography variant="caption" sx={{ px: 2, py: 1, color: colors.textSecondary }}>
          Vos 3 workspaces les plus récents
        </Typography>

        {loadingRecents ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
            <CircularProgress size={24} />
          </Box>
        ) : recentWorkspaces.length > 0 ? (
          <>
            {recentWorkspaces.slice(0, 3).map((workspace) => (
              <Box key={workspace.id}>
                <MenuItem
                  onClick={() => handleWorkspaceClick(workspace)}
                  sx={{ position: 'relative' }}
                >
                  <Typography
                    variant="subtitle2"
                    noWrap
                    title={workspace.displayName || workspace.name}
                    sx={{ width: '100%' }}
                  >
                    {workspace.displayName || workspace.name}
                  </Typography>
                </MenuItem>

                {selectedWorkspaceId === workspace.id && (
                  <Box sx={{ px: 2, py: 1, bgcolor: colors.hover }}>
                    <MenuItem
                      onClick={() => {
                        handleEditWorkspace(workspace.id);
                        handleContextMenuClose();
                      }}
                      dense
                    >
                      <ListItemIcon>
                        <EditIcon fontSize="small" sx={{ color: colors.text }} />
                      </ListItemIcon>
                      Modifier
                    </MenuItem>
                    <MenuItem
                      onClick={() => {
                        handleWorkspaceSettings(workspace.id);
                        handleContextMenuClose();
                      }}
                      dense
                    >
                      <ListItemIcon>
                        <SettingsIcon fontSize="small" sx={{ color: colors.text }} />
                      </ListItemIcon>
                      Paramètres
                    </MenuItem>
                    <MenuItem
                      onClick={() => {
                        handleManageMembers();
                        handleContextMenuClose();
                      }}
                      dense
                    >
                      <ListItemIcon>
                        <GroupIcon fontSize="small" sx={{ color: colors.text }} />
                      </ListItemIcon>
                      Gérer les membres
                    </MenuItem>
                    <MenuItem
                      onClick={() => handleDeleteWorkspace(workspace.id)}
                      dense
                      sx={{ color: '#f44336' }}
                    >
                      <ListItemIcon>
                        <DeleteIcon fontSize="small" sx={{ color: '#f44336' }} />
                      </ListItemIcon>
                      Supprimer
                    </MenuItem>
                  </Box>
                )}
              </Box>
            ))}
          </>
        ) : (
          <MenuItem disabled>
            <Typography variant="body2" sx={{ color: colors.textSecondary }}>
              Aucun workspace récent
            </Typography>
          </MenuItem>
        )}
      </Menu>

      {/* Recent menu — affiche NOMS UNIQUEMENT */}
      <Menu
        anchorEl={recentAnchorEl}
        open={Boolean(recentAnchorEl)}
        onClose={handleClose}
        PaperProps={{
          sx: { bgcolor: colors.card, color: colors.text, width: '250px' },
        }}
      >
        <Typography variant="subtitle2" sx={{ px: 2, py: 1, color: colors.textSecondary }}>
          Vos 3 workspaces les plus récents
        </Typography>
        {loadingRecents ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
            <CircularProgress size={24} />
          </Box>
        ) : recentWorkspaces.length > 0 ? (
          recentWorkspaces.slice(0, 3).map((workspace) => (
            <MenuItem
              key={workspace.id}
              onClick={() => handleWorkspaceClick(workspace)}
              sx={{ position: 'relative' }}
            >
              <Typography
                variant="subtitle2"
                noWrap
                title={workspace.displayName || workspace.name}
                sx={{ width: '100%' }}
              >
                {workspace.displayName || workspace.name}
              </Typography>
            </MenuItem>
          ))
        ) : (
          <MenuItem disabled>
            <Typography variant="body2" sx={{ color: colors.textSecondary }}>
              Aucun workspace récent
            </Typography>
          </MenuItem>
        )}
        <Divider sx={{ my: 1, borderColor: colors.border }} />
        <MenuItem
          onClick={() => {
            navigate('/workspaces');
            handleClose();
          }}
        >
          <ListItemIcon>
            <ViewListIcon sx={{ color: colors.text }} />
          </ListItemIcon>
          Voir tous les workspaces
        </MenuItem>
      </Menu>

    </AppBar>
  );
};

export default Navbar;
