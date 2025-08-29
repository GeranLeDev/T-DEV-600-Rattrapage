import React from 'react';
import { Grid } from '@mui/material';
import { Board } from '../../types/board';
import BoardCard from './BoardCard';

interface BoardListProps {
  boards: Board[];
  onBoardClick: (boardId: string) => void;
}

const BoardList: React.FC<BoardListProps> = ({ boards, onBoardClick }) => {
  return (
    <Grid container spacing={2}>
      {boards.map((board) => (
        <Grid item xs={12} sm={6} md={4} key={board.id}>
          <BoardCard board={board} onClick={() => onBoardClick(board.id)} />
        </Grid>
      ))}
    </Grid>
  );
};

export default BoardList;

export {};
