import React from 'react';
import { Card, CardContent, Typography } from '@mui/material';
import { Board } from '../../types/board';

interface BoardCardProps {
  board: Board;
  onClick: () => void;
}

const BoardCard: React.FC<BoardCardProps> = ({ board, onClick }) => {
  return (
    <Card onClick={onClick} sx={{ cursor: 'pointer', mb: 2 }}>
      <CardContent>
        <Typography variant="h6">{board.name}</Typography>
        {board.description && (
          <Typography variant="body2" color="text.secondary">
            {board.description}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
};

export default BoardCard;

export {};
