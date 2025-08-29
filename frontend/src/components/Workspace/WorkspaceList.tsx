import { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  IconButton,
  Avatar,
  AvatarGroup,
  Tooltip,
  CircularProgress,
} from '@mui/material';
import {
  Settings as SettingsIcon,
  Group as GroupIcon,
  Star as StarIcon,
} from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store';
import { fetchWorkspaces } from '../../store/slices/workspaceSlice';
import { Workspace } from '../../types/workspace';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../hooks/useTheme';

export const WorkspaceList = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { workspaces, loading, error } = useSelector((state: RootState) => state.workspace);
  const navigate = useNavigate();
  const { colors, shadows } = useTheme();
  const [localWorkspaces, setLocalWorkspaces] = useState<Workspace[]>([]);

  useEffect(() => {
    dispatch(fetchWorkspaces());
  }, [dispatch]);

  useEffect(() => {
    if (workspaces) {
      setLocalWorkspaces(workspaces);
    }
  }, [workspaces]);

  const handleToggleFavorite = (workspaceId: string) => {
    setLocalWorkspaces(
      localWorkspaces.map((workspace) =>
        workspace.id === workspaceId
          ? { ...workspace, isFavorite: !workspace.isFavorite }
          : workspace
      )
    );
  };

  if (loading) {
    return (
      <Box
        sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '200px' }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Typography color="error" sx={{ textAlign: 'center', mt: 4 }}>
        {error}
      </Typography>
    );
  }

  if (!localWorkspaces || localWorkspaces.length === 0) {
    return (
      <Typography sx={{ textAlign: 'center', mt: 4, color: colors.textSecondary }}>
        Aucun espace de travail trouvé
      </Typography>
    );
  }

  return (
    <Box sx={{ maxWidth: '1200px', mx: 'auto', mt: 4, p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4 }}>
        <Typography variant="h4" component="h1">
          Vos workspaces
        </Typography>
        <Button
          variant="contained"
          onClick={() => navigate('/workspaces/create')}
          sx={{
            bgcolor: colors.primary,
            '&:hover': {
              bgcolor: colors.primary,
              opacity: 0.9,
            },
          }}
        >
          Créer un workspace
        </Button>
      </Box>

      <Grid container spacing={3}>
        {localWorkspaces.map((workspace) => (
          <Grid item xs={12} sm={6} md={4} key={workspace.id}>
            <Card
              elevation={0}
              sx={{
                bgcolor: colors.card,
                boxShadow: shadows.card,
                border: `1px solid ${colors.border}`,
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                transition: 'transform 0.2s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-4px)',
                },
              }}
            >
              <CardContent sx={{ flexGrow: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Typography
                    variant="h6"
                    sx={{
                      cursor: 'pointer',
                      '&:hover': { color: colors.primary },
                    }}
                    onClick={() => navigate(`/workspace/${workspace.id}`)}
                  >
                    {workspace.displayName || workspace.name}
                  </Typography>
                  <IconButton
                    onClick={() => handleToggleFavorite(workspace.id)}
                    sx={{
                      color: workspace.isFavorite ? colors.primary : colors.textSecondary,
                    }}
                  >
                    <StarIcon />
                  </IconButton>
                </Box>
                <Typography
                  variant="body2"
                  color="textSecondary"
                  sx={{ mb: 2, color: colors.textSecondary }}
                >
                  {workspace.description}
                </Typography>
                {workspace.members && (
                  <AvatarGroup max={4} sx={{ justifyContent: 'flex-start' }}>
                    {workspace.members.map((member) => (
                      <Tooltip key={member.id} title={member.username}>
                        <Avatar src={member.avatar} alt={member.username} />
                      </Tooltip>
                    ))}
                  </AvatarGroup>
                )}
              </CardContent>
              <CardActions sx={{ justifyContent: 'flex-end', p: 2 }}>
                <IconButton
                  onClick={() => navigate(`/workspaces/${workspace.id}/members`)}
                  sx={{ color: colors.text }}
                >
                  <GroupIcon />
                </IconButton>
                <IconButton
                  onClick={() => navigate(`/workspaces/${workspace.id}/settings`)}
                  sx={{ color: colors.text }}
                >
                  <SettingsIcon />
                </IconButton>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};
