import React from 'react';
import { Card, CardContent, Typography, Box, IconButton, Avatar, AvatarGroup } from '@mui/material';
import { useTheme } from '../../hooks/useTheme';
import { Workspace } from '../../types/workspace';

interface WorkspaceCardProps {
  workspace: Workspace;
  onWorkspaceClick?: (id: string) => void;
}

export const WorkspaceCard: React.FC<WorkspaceCardProps> = ({ workspace, onWorkspaceClick }) => {
  const { colors, shadows } = useTheme();

  return (
    <Card
      onClick={() => onWorkspaceClick?.(workspace.id)}
      sx={{
        cursor: 'pointer',
        bgcolor: colors.card,
        boxShadow: shadows.card,
        border: `1px solid ${colors.border}`,
        '&:hover': {
          transform: 'translateY(-4px)',
          transition: 'transform 0.2s ease-in-out',
        },
      }}
    >
      <CardContent>
        <Typography variant="h6" gutterBottom>
          {workspace.displayName || workspace.name}
        </Typography>
        {workspace.description && (
          <Typography variant="body2" color="textSecondary" gutterBottom>
            {workspace.description}
          </Typography>
        )}
        <Box sx={{ mt: 2 }}>
          <AvatarGroup max={4}>
            {workspace.members.map((member) => (
              <Avatar
                key={member.id}
                alt={member.username}
                src={member.avatar}
                sx={{ width: 32, height: 32 }}
              />
            ))}
          </AvatarGroup>
        </Box>
      </CardContent>
    </Card>
  );
};
