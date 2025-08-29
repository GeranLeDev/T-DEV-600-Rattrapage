import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { Workspace, WorkspaceCreate, WorkspaceUpdate } from '../../types/workspace';
import { workspaceService } from '../../services/workspaceService';

interface WorkspaceState {
  workspaces: Workspace[];
  currentWorkspace: Workspace | null;
  loading: boolean;
  error: string | null;
}

const initialState: WorkspaceState = {
  workspaces: [],
  currentWorkspace: null,
  loading: false,
  error: null,
};

// Thunks
export const fetchWorkspaces = createAsyncThunk('workspace/fetchAll', async () => {
  const response = await workspaceService.getAll();
  return response;
});

export const fetchWorkspaceById = createAsyncThunk('workspace/fetchById', async (id: string) => {
  const response = await workspaceService.getById(id);
  return response;
});

export const createWorkspace = createAsyncThunk(
  'workspace/create',
  async (data: WorkspaceCreate) => {
    const response = await workspaceService.create(data);
    return response;
  }
);

export const updateWorkspace = createAsyncThunk(
  'workspace/update',
  async ({ id, data }: { id: string; data: WorkspaceUpdate }) => {
    const response = await workspaceService.update(id, data);
    return response;
  }
);

export const deleteWorkspace = createAsyncThunk('workspace/delete', async (id: string) => {
  await workspaceService.delete(id);
  return id;
});

const workspaceSlice = createSlice({
  name: 'workspace',
  initialState,
  reducers: {
    clearCurrentWorkspace: (state) => {
      state.currentWorkspace = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch All
      .addCase(fetchWorkspaces.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWorkspaces.fulfilled, (state, action) => {
        state.loading = false;
        state.workspaces = action.payload;
      })
      .addCase(fetchWorkspaces.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Une erreur est survenue';
      })
      // Fetch By Id
      .addCase(fetchWorkspaceById.fulfilled, (state, action) => {
        state.currentWorkspace = action.payload;
      })
      // Create
      .addCase(createWorkspace.fulfilled, (state, action) => {
        state.workspaces.push(action.payload);
      })
      // Update
      .addCase(updateWorkspace.fulfilled, (state, action) => {
        const index = state.workspaces.findIndex((w) => w.id === action.payload.id);
        if (index !== -1) {
          state.workspaces[index] = action.payload;
        }
        if (state.currentWorkspace?.id === action.payload.id) {
          state.currentWorkspace = action.payload;
        }
      })
      // Delete
      .addCase(deleteWorkspace.fulfilled, (state, action) => {
        state.workspaces = state.workspaces.filter((w) => w.id !== action.payload);
        if (state.currentWorkspace?.id === action.payload) {
          state.currentWorkspace = null;
        }
      });
  },
});

export const { clearCurrentWorkspace } = workspaceSlice.actions;
export default workspaceSlice.reducer;
