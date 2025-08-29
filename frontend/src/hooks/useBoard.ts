import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store';
import { boardService } from '../services/boardService';
import { Board, BoardCreate, BoardUpdate } from '../types/board';

export const useBoard = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { boards, loading, error } = useSelector((state: RootState) => state.board);

  const getAllBoards = async (workspaceId: string) => {
    try {
      const response = await boardService.getAll(workspaceId);
      return response;
    } catch (error) {
      console.error('Error fetching boards:', error);
      throw error;
    }
  };

  const getBoardById = async (id: string) => {
    try {
      const response = await boardService.getById(id);
      return response;
    } catch (error) {
      console.error('Error fetching board:', error);
      throw error;
    }
  };

  const createBoard = async (data: BoardCreate) => {
    try {
      const response = await boardService.create(data);
      return response;
    } catch (error) {
      console.error('Error creating board:', error);
      throw error;
    }
  };

  const updateBoard = async (id: string, data: BoardUpdate) => {
    try {
      const response = await boardService.update(id, data);
      return response;
    } catch (error) {
      console.error('Error updating board:', error);
      throw error;
    }
  };

  const deleteBoard = async (id: string) => {
    try {
      await boardService.delete(id);
    } catch (error) {
      console.error('Error deleting board:', error);
      throw error;
    }
  };

  return {
    boards,
    loading,
    error,
    getAllBoards,
    getBoardById,
    createBoard,
    updateBoard,
    deleteBoard,
  };
};

export default useBoard;
