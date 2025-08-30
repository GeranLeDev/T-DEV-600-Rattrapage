import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Tabs,
  Tab,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  AvatarGroup,
  Divider,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
} from '@mui/material';
import {
  MoreVert as MoreVertIcon,
  Add as AddIcon,
  Group as GroupIcon,
  Settings as SettingsIcon,
  Star as StarIcon,
  StarBorder as StarBorderIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import { useTheme } from '../../hooks/useTheme';
import { workspaceService } from '../../services/workspaceService';
import { Workspace, Member } from '../../types/workspace';
import { Board } from '../../types/board';
import { api } from '../../services/api';
import { CreateBoardDialog } from '../Board/CreateBoardDialog';
import { boardService } from '../../services/boardService';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  const { colors } = useTheme();

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`workspace-tabpanel-${index}`}
      aria-labelledby={`workspace-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3, color: colors.text }}>{children}</Box>}
    </div>
  );
}

export const WorkspaceDetail = () => {
  const { workspaceId } = useParams<{ workspaceId: string }>();
  const navigate = useNavigate();
  const { colors, shadows, spacing } = useTheme();
  const [tabValue, setTabValue] = useState(0);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [workspace, setWorkspace] = useState<Workspace | null>(null);
  const [members, setMembers] = useState<Member[]>([]);
  const [boards, setBoards] = useState<Board[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openCreateBoard, setOpenCreateBoard] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [boardToDelete, setBoardToDelete] = useState<Board | null>(null);

  useEffect(() => {
    const fetchWorkspaceData = async () => {
      if (!workspaceId) {
        setError('ID du workspace non trouvé');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await api.get(`/organizations/${workspaceId}`, {
          params: {
            fields: 'id,name,displayName,desc,memberships,prefs,dateLastActivity,createdAt',
          },
        });

        const workspaceData: Workspace = {
          id: response.data.id,
          name: response.data.name,
          displayName: response.data.displayName,
          description: response.data.desc || '',
          members: response.data.memberships || [],
          isFavorite: workspaceService.isWorkspaceFavorite(response.data.id),
          createdAt: response.data.createdAt,
          updatedAt: response.data.dateLastActivity,
        };
        
        workspaceService.setCurrentWorkspace(workspaceData);
        const membersResponse = await api.get(`/organizations/${workspaceId}/members`);
        const membersData: Member[] = membersResponse.data.map((member: any) => ({
          id: member.id,
          username: member.username,
          fullName: member.fullName,
          avatar: member.avatarUrl,
          role: member.memberType === 'admin' ? 'admin' : 'member',
        }));

        setWorkspace(workspaceData);
        setMembers(membersData);

        // Récupération des tableaux
        const boardsResponse = await api.get(`/organizations/${workspaceId}/boards`);
        const boardsData: Board[] = boardsResponse.data.map((board: any) => ({
          id: board.id,
          name: board.name,
          description: board.desc || '',
          workspaceId: workspaceId,
        }));
        setBoards(boardsData);

        setError(null);
      } catch (err) {
        console.error('Erreur lors de la récupération des données:', err);
        setError('Une erreur est survenue lors du chargement du workspace');
      } finally {
        setLoading(false);
      }
    };

    fetchWorkspaceData();
  }, [workspaceId]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const toggleFavorite = () => {
    if (!workspace) return;
    const next = workspaceService.toggleWorkspaceFavorite(workspace.id);
    setWorkspace({ ...workspace, isFavorite: next });
  };
  

  const handleCreateBoard = async (title: string, background: string) => {
    if (!workspaceId) return;
    try {
      // Déterminer si l'image est une image de Trello (compatible avec l'API)
      const isTrelloBackground =
        background.startsWith('http') &&
        (background.includes('trello-backgrounds') || background.includes('trello.com'));

      // Structure modifiée pour respecter exactement la syntaxe de l'API Trello
      let boardData;

      // Gestion différente selon le type de fond d'écran
      if (background.startsWith('data:')) {
        // Image téléchargée par l'utilisateur (data URI)
        boardData = {
          name: title,
          desc: '',
          idOrganization: workspaceId,
          defaultLists: false,
          // Pour les images téléchargées localement, on utilise une couleur par défaut
          // car Trello ne supporte pas directement les data URI
          prefs: {
            background: 'lime', // Couleur par défaut pour les images téléchargées
          },
        };
      } else if (background.startsWith('http')) {
        if (isTrelloBackground) {
          // Image Trello compatible - utilise le format attendu par l'API
          boardData = {
            name: title,
            desc: '',
            idOrganization: workspaceId,
            defaultLists: false,
            prefs: {
              backgroundImage: background,
            },
          };
        } else {
          // Image URL externe (non hébergée sur Trello)
          boardData = {
            name: title,
            desc: '',
            idOrganization: workspaceId,
            defaultLists: false,
            // Pour les URL externes, on utilise une couleur et on stocke l'URL
            // dans une propriété personnalisée pour référence future
            prefs: {
              background: 'blue', // Couleur par défaut pour les images externes
              // Note: customBackgroundUrl n'est pas une propriété standard de Trello,
              // c'est juste pour montrer comment on pourrait stocker l'information
              customBackgroundUrl: background,
            },
          };
        }
      } else {
        // C'est une couleur nommée de Trello
        boardData = {
          name: title,
          desc: '',
          idOrganization: workspaceId,
          defaultLists: false,
          prefs: {
            background: background,
          },
        };
      }

      const newBoard = await api.post(`/boards`, boardData);

      // Ajouter le nouveau tableau à la liste
      setBoards([
        ...boards,
        {
          id: newBoard.data.id,
          name: newBoard.data.name,
          description: newBoard.data.desc || '',
          workspaceId: workspaceId,
          background:
            newBoard.data.prefs?.backgroundImage || newBoard.data.prefs?.background || background,
        },
      ]);
    } catch (err) {
      console.error('Erreur lors de la création du tableau:', err);
      throw err;
    }
  };

  const handleDeleteBoard = async () => {
    if (!boardToDelete) return;

    try {
      setLoading(true);
      await boardService.delete(boardToDelete.id);

      // Mettre à jour la liste des tableaux localement après suppression
      setBoards(boards.filter((board) => board.id !== boardToDelete.id));

      // Fermer le dialogue de confirmation
      setDeleteDialogOpen(false);
      setBoardToDelete(null);
    } catch (err) {
      setError('Une erreur est survenue lors de la suppression du tableau');
    } finally {
      setLoading(false);
    }
  };

  const openDeleteDialog = (board: Board, event: React.MouseEvent) => {
    // Empêcher la propagation de l'événement pour éviter de naviguer vers le tableau
    event.stopPropagation();
    setBoardToDelete(board);
    setDeleteDialogOpen(true);
  };

  if (loading) {
    return (
      <Box
        sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error || !workspace) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography color="error">{error || 'Workspace non trouvé'}</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ p: spacing.lg, borderBottom: `1px solid ${colors.border}` }}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: spacing.md,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: spacing.md }}>
            <Typography variant="h4" sx={{ color: colors.text }}>
              {workspace.displayName || workspace.name}
            </Typography>
            <IconButton
              size="small"
              onClick={toggleFavorite}
              sx={{ color: workspace.isFavorite ? colors.primary : colors.textSecondary }}
            >
              {workspace.isFavorite ? <StarIcon /> : <StarBorderIcon />}
            </IconButton>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: spacing.sm }}>
            <AvatarGroup max={3}>
              {members.map((member) => (
                <Avatar key={member.id} sx={{ bgcolor: colors.primary }}>
                  {member.fullName?.charAt(0) || member.username?.charAt(0)}
                </Avatar>
              ))}
            </AvatarGroup>
            <IconButton onClick={handleMenuClick} sx={{ color: colors.textSecondary }}>
              <MoreVertIcon />
            </IconButton>
          </Box>
        </Box>
        <Typography variant="body1" sx={{ color: colors.textSecondary }}>
          {workspace.description}
        </Typography>
      </Box>

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
        <Tab label="Tableaux" />
        <Tab label="Membres" />
        <Tab label="Paramètres" />
      </Tabs>

      <TabPanel value={tabValue} index={0}>
        <Grid container spacing={spacing.md}>
          {boards.map((board) => (
            <Grid item xs={12} sm={6} md={4} key={board.id}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  bgcolor: colors.card,
                  boxShadow: shadows.card,
                  cursor: 'pointer',
                  position: 'relative',
                  '&:hover': {
                    boxShadow: shadows.modal,
                  },
                }}
                onClick={() => navigate(`/boards/${board.id}`)}
              >
                <IconButton
                  size="small"
                  color="error"
                  sx={{
                    position: 'absolute',
                    top: '8px',
                    right: '8px',
                    zIndex: 1,
                    bgcolor: 'rgba(255, 255, 255, 0.8)',
                    '&:hover': {
                      bgcolor: 'rgba(255, 255, 255, 0.9)',
                    },
                  }}
                  onClick={(e) => openDeleteDialog(board, e)}
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>

                <CardContent>
                  <Typography variant="h6" sx={{ color: colors.text, mb: spacing.sm }}>
                    {board.name}
                  </Typography>
                  <Typography variant="body2" sx={{ color: colors.textSecondary }}>
                    {board.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
          <Grid item xs={12} sm={6} md={4}>
            <Card
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                bgcolor: colors.card,
                boxShadow: shadows.card,
                cursor: 'pointer',
                border: `2px dashed ${colors.border}`,
                '&:hover': {
                  borderColor: colors.primary,
                },
              }}
              onClick={() => setOpenCreateBoard(true)}
            >
              <CardContent
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: '100%',
                }}
              >
                <Button startIcon={<AddIcon />} sx={{ color: colors.textSecondary }}>
                  Créer un tableau
                </Button>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <CreateBoardDialog
          open={openCreateBoard}
          onClose={() => setOpenCreateBoard(false)}
          onCreateBoard={handleCreateBoard}
          workspaceId={workspaceId || ''}
        />

        {/* Dialog de confirmation de suppression */}
        <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
          <DialogTitle>Supprimer le tableau</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Êtes-vous sûr de vouloir supprimer le tableau "{boardToDelete?.name}" ? Cette action
              est irréversible.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDeleteDialogOpen(false)} color="primary">
              Annuler
            </Button>
            <Button
              onClick={handleDeleteBoard}
              color="error"
              variant="contained"
              disabled={loading}
            >
              Supprimer
            </Button>
          </DialogActions>
        </Dialog>
      </TabPanel>

      <TabPanel value={tabValue} index={1}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: spacing.md }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6" sx={{ color: colors.text }}>
              Membres du workspace ({members.length})
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              sx={{
                bgcolor: colors.primary,
                '&:hover': { bgcolor: colors.secondary },
              }}
              onClick={() => navigate(`/workspaces/${workspace.id}/members`)}
            >
              Inviter des membres
            </Button>
          </Box>
          <Divider sx={{ borderColor: colors.border }} />
          {members.map((member) => (
            <Box
              key={member.id}
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                p: spacing.sm,
                bgcolor: colors.card,
                borderRadius: '8px',
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: spacing.sm }}>
                <Avatar sx={{ bgcolor: colors.primary }}>
                  {member.fullName?.charAt(0) || member.username?.charAt(0)}
                </Avatar>
                <Box>
                  <Typography sx={{ color: colors.text }}>
                    {member.fullName || member.username}
                  </Typography>
                  <Typography variant="caption" sx={{ color: colors.textSecondary }}>
                    {member.role || 'Membre'}
                  </Typography>
                </Box>
              </Box>
              <IconButton
                size="small"
                sx={{ color: colors.textSecondary }}
                onClick={() => navigate(`/workspaces/${workspace.id}/members`)}
              >
                <MoreVertIcon />
              </IconButton>
            </Box>
          ))}
        </Box>
      </TabPanel>

      <TabPanel value={tabValue} index={2}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: spacing.md }}>
          <Typography variant="h6" sx={{ color: colors.text }}>
            Paramètres du workspace
          </Typography>
          <Divider sx={{ borderColor: colors.border }} />
          <Button
            variant="contained"
            onClick={() => navigate(`/workspaces/${workspace.id}/settings`)}
            sx={{
              bgcolor: colors.primary,
              '&:hover': { bgcolor: colors.secondary },
              alignSelf: 'flex-start',
            }}
          >
            Modifier les paramètres
          </Button>
        </Box>
      </TabPanel>

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
        <MenuItem
          onClick={() => {
            navigate(`/workspaces/${workspace.id}/settings`);
            handleMenuClose();
          }}
        >
          <SettingsIcon sx={{ mr: spacing.sm }} /> Paramètres
        </MenuItem>
        <MenuItem
          onClick={() => {
            navigate(`/workspaces/${workspace.id}/members`);
            handleMenuClose();
          }}
        >
          <GroupIcon sx={{ mr: spacing.sm }} /> Gérer les membres
        </MenuItem>
        <MenuItem onClick={handleMenuClose} sx={{ color: 'error.main' }}>
          Supprimer le workspace
        </MenuItem>
      </Menu>
    </Box>
  );
};
