import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { useWorkspace } from '../../hooks/useWorkspace';
import BoardList from '../../components/Board/BoardList';
import { useTheme } from '../../hooks/useTheme';

export const WorkspaceDetailPage: React.FC = () => {
  const { workspaceId } = useParams<{ workspaceId: string }>();
  const navigate = useNavigate();
  const { colors } = useTheme();
  const { workspace, boards, loading, error } = useWorkspace(workspaceId || '');

  if (loading) {
    return <Typography>Chargement...</Typography>;
  }

  if (error || !workspace) {
    return <Typography color="error">{error || 'Workspace non trouvé'}</Typography>;
  }

  return (
    <Box sx={{ maxWidth: '1200px', mx: 'auto', p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4 }}>
        <Box>
          <Typography variant="h4" component="h1" gutterBottom>
            {workspace.displayName || workspace.name}
          </Typography>
          <Typography variant="body1" color="textSecondary" sx={{ mb: 2 }}>
            {workspace.description}
          </Typography>
        </Box>
        <Box>
          <Button
            variant="contained"
            onClick={() => navigate(`/workspaces/${workspace.id}/settings`)}
            sx={{
              bgcolor: colors.primary,
              '&:hover': {
                bgcolor: colors.primary,
                opacity: 0.9,
              },
            }}
          >
            Paramètres
          </Button>
        </Box>
      </Box>

      <Typography variant="h5" gutterBottom>
        Tableaux
      </Typography>
      <BoardList
        boards={boards}
        onBoardClick={(boardId: string) => navigate(`/boards/${boardId}`)}
      />
    </Box>
  );
};
