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
  Person as PersonIcon,
  Add as AddIcon,
  Settings as SettingsIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Group as GroupIcon,
  ViewList as ViewListIcon,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../store';
import { fetchWorkspaces } from '../../store/slices/workspaceSlice'
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
  const location = useLocation();
  const dispatch = useDispatch<AppDispatch>();
  const { colors, shadows } = useTheme();
  const [recentAnchorEl, setRecentAnchorEl] = useState<null | HTMLElement>(null);
  const [workspacesAnchorEl, setWorkspacesAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedWorkspaceId, setSelectedWorkspaceId] = useState<string | null>(null);
  const [currentWorkspace, setCurrentWorkspace] = useState<Workspace | null>(null);
  const [recentWorkspaces, setRecentWorkspaces] = useState<Workspace[]>([]);
  const [loadingRecents, setLoadingRecents] = useState(false);
  const [search, setSearch] = useState('');

  // Synchroniser l'input avec l'URL quand on est sur /workspaces et /workspace: id (en gros les board)
  useEffect(() => {
    const q = new URLSearchParams(location.search).get('q') || '';
    setSearch(q);
  }, [location.search]);


  // Init : charge le workspace courant + les 3 derniers visités (stockage local)
  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        setLoadingRecents(true);
        const current = workspaceService.getCurrentWorkspace();
        const recents = await workspaceService.getRecentVisitedWorkspaces();
        if (!mounted) return;
        setCurrentWorkspace(current);
        setRecentWorkspaces(recents);
      } catch (error) {
        console.error('Erreur lors du chargement des récents:', error);
      } finally {
        if (mounted) setLoadingRecents(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  // Rester à jour : si la liste des récents change (autre onglet) ou quand on revient sur l’onglet
  useEffect(() => {
    const refreshRecents = async () => {
      try {
        setLoadingRecents(true);
        const recents = await workspaceService.getRecentVisitedWorkspaces();
        setRecentWorkspaces(recents);
      } catch (error) {
        console.error('Erreur lors de la récupération des récents:', error);
      } finally {
        setLoadingRecents(false);
      }
    };

    const onStorage = (e: StorageEvent) => {
      if (e.key === 'trellolike.recentWorkspaces') refreshRecents();
    };
    const onFocus = () => refreshRecents();

    window.addEventListener('storage', onStorage);
    window.addEventListener('focus', onFocus);
    return () => {
      window.removeEventListener('storage', onStorage);
      window.removeEventListener('focus', onFocus);
    };
  }, []);

  const handleRecentClick = (event: React.MouseEvent<HTMLElement>) => {
    setRecentAnchorEl(event.currentTarget);
    setLoadingRecents(true);
    workspaceService
      .getRecentVisitedWorkspaces()
      .then(setRecentWorkspaces)
      .finally(() => setLoadingRecents(false));
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearch(value);

    const params = new URLSearchParams(location.search);
    if (value) params.set('q', value);
    else params.delete('q');

    // /workspaces -> filtrer les workspaces
    if (location.pathname.startsWith('/workspaces')) {
      navigate(
        { pathname: '/workspaces', search: params.toString() ? `?${params.toString()}` : '' },
        { replace: true }
      );
      return;
    }

    // /workspace/:id -> filtrer les boards du workspace courant
    const m = location.pathname.match(/^\/workspace\/([^/]+)/);
    if (m) {
      navigate(
        { pathname: `/workspace/${m[1]}`, search: params.toString() ? `?${params.toString()}` : '' },
        { replace: true }
      );
    }
  };

  const goToWorkspace = (w: Workspace) => {
    workspaceService.setCurrentWorkspace(w);
    navigate(`/workspace/${w.id}`);
    handleClose();
  };

  const handleWorkspacesClick = (event: React.MouseEvent<HTMLElement>) => {
    setWorkspacesAnchorEl(event.currentTarget);
    setLoadingRecents(true);
    workspaceService
      .getRecentVisitedWorkspaces()
      .then(setRecentWorkspaces)
      .finally(() => setLoadingRecents(false));
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

      // MAJ du menu "Workspaces" (local à la navbar)
      const updatedRecents = recentWorkspaces.filter(w => w.id !== workspaceId);
      setRecentWorkspaces(updatedRecents);
      handleContextMenuClose();

      // Si on était sur la page du workspace supprimé → aller à la liste et recharger la liste
      if (currentWorkspace?.id === workspaceId) {
        navigate('/workspaces');
        await dispatch(fetchWorkspaces());
        return;
      }

      // Si on est déjà sur la liste → refetch pour voir l'item disparaître immédiatement
      if (location.pathname.startsWith('/workspaces')) {
        await dispatch(fetchWorkspaces());
        // (fallback dur si jamais) :
      }
    } catch (err) {
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
            placeholder={
              location.pathname.startsWith('/workspaces')
                ? 'Rechercher des workspaces...'
                : /^\/workspace\//.test(location.pathname)
                  ? 'Rechercher des boards...'
                  : 'Search...'
            }
            size="small"
            value={search}
            onChange={handleSearchChange}
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
          <IconButton
            color="inherit"
            aria-label="Compte"
            onClick={() => navigate('/compte')}
          >
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
              onClick={() => goToWorkspace(workspace)}
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
