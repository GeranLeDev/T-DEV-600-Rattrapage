import React, { useEffect } from 'react';
import { Box, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useWorkspace } from '../../hooks/useWorkspace';
import { WorkspaceList } from '../../components/Workspace/WorkspaceList';

const WorkspacePage: React.FC = () => {
  const navigate = useNavigate();
  const { getAllWorkspaces, loading, error } = useWorkspace('');

  useEffect(() => {
    getAllWorkspaces();
  }, [getAllWorkspaces]);

  return (
    <Box p={3}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Mes Espaces de Travail</Typography>
        <Button variant="contained" color="primary">
          Créer un espace de travail
        </Button>
      </Box>
      <WorkspaceList />
    </Box>
  );
};

export default WorkspacePage;
