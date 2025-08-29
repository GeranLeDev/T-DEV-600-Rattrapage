import { api } from './api';
import { Board, BoardCreate, BoardUpdate } from '../types/board';

export const boardService = {
  getAll: async (workspaceId: string): Promise<Board[]> => {
    const response = await api.get(`/organizations/${workspaceId}/boards`);
    return response.data;
  },

  getById: async (id: string): Promise<Board> => {
    const response = await api.get(`/boards/${id}`);
    return response.data;
  },

  create: async (data: BoardCreate): Promise<Board> => {
    const response = await api.post('/boards', data);
    return response.data;
  },

  update: async (id: string, data: BoardUpdate): Promise<Board> => {
    const response = await api.put(`/boards/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/boards/${id}`);
  },

  getLabels: async (boardId: string): Promise<any[]> => {
    try {
      const response = await api.get(`/boards/${boardId}/labels`);
      return response.data.map((label: any) => ({
        id: label.id,
        name: label.name,
        color: label.color || '#B3B3B3',
      }));
    } catch (error) {
      console.error('Erreur lors de la récupération des étiquettes:', error);
      return [];
    }
  },

  getMembers: async (boardId: string): Promise<any[]> => {
    try {
      const response = await api.get(`/boards/${boardId}/members`);
      return response.data.map((member: any) => ({
        id: member.id,
        name: member.fullName || member.username,
        avatar: member.avatarUrl || '',
      }));
    } catch (error) {
      console.error('Erreur lors de la récupération des membres du tableau:', error);
      return [];
    }
  },
};
