import { useState, useEffect } from 'react';
import { Workspace } from '../types/workspace';
import { Board } from '../types/board';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store';
import { fetchWorkspaces } from '../store/slices/workspaceSlice';
import { workspaceService } from '../services/workspaceService';
import { WorkspaceCreate, WorkspaceUpdate } from '../types/workspace';

interface UseWorkspaceReturn {
  workspace: Workspace | null;
  boards: Board[];
  loading: boolean;
  error: string | null;
  getAllWorkspaces: () => Promise<Workspace[]>;
  getWorkspaceById: (id: string) => Promise<Workspace>;
  createWorkspace: (data: WorkspaceCreate) => Promise<Workspace>;
  updateWorkspace: (id: string, data: WorkspaceUpdate) => Promise<Workspace>;
  deleteWorkspace: (id: string) => Promise<void>;
}

export const useWorkspace = (workspaceId: string): UseWorkspaceReturn => {
  const dispatch = useDispatch<AppDispatch>();
  const { workspaces, loading, error } = useSelector((state: RootState) => state.workspace);
  const [workspace, setWorkspace] = useState<Workspace | null>(null);
  const [boards, setBoards] = useState<Board[]>([]);

  useEffect(() => {
    dispatch(fetchWorkspaces());
  }, [dispatch]);

  useEffect(() => {
    if (workspaces.length > 0 && workspaceId) {
      const foundWorkspace = workspaces.find((w) => w.id === workspaceId);
      setWorkspace(foundWorkspace || null);
    }
  }, [workspaces, workspaceId]);

  useEffect(() => {
    if (workspace) {
      // TODO: Fetch boards for the workspace
      // For now, we'll use dummy data
      setBoards([
        {
          id: '1',
          name: 'Tableau 1',
          description: 'Premier tableau',
          workspaceId: workspace.id,
        },
        {
          id: '2',
          name: 'Tableau 2',
          description: 'Deuxième tableau',
          workspaceId: workspace.id,
        },
      ]);
    }
  }, [workspace]);

  const getAllWorkspaces = async () => {
    try {
      const response = await workspaceService.getAll();
      return response;
    } catch (error) {
      console.error('Error fetching workspaces:', error);
      throw error;
    }
  };

  const getWorkspaceById = async (id: string) => {
    try {
      const response = await workspaceService.getById(id);
      return response;
    } catch (error) {
      console.error('Error fetching workspace:', error);
      throw error;
    }
  };

  const createWorkspace = async (data: WorkspaceCreate) => {
    try {
      const response = await workspaceService.create(data);
      return response;
    } catch (error) {
      console.error('Error creating workspace:', error);
      throw error;
    }
  };

  const updateWorkspace = async (id: string, data: WorkspaceUpdate) => {
    try {
      const response = await workspaceService.update(id, data);
      return response;
    } catch (error) {
      console.error('Error updating workspace:', error);
      throw error;
    }
  };

  const deleteWorkspace = async (id: string) => {
    try {
      await workspaceService.delete(id);
    } catch (error) {
      console.error('Error deleting workspace:', error);
      throw error;
    }
  };

  return {
    workspace,
    boards,
    loading,
    error,
    getAllWorkspaces,
    getWorkspaceById,
    createWorkspace,
    updateWorkspace,
    deleteWorkspace,
  };
};

export default useWorkspace;
