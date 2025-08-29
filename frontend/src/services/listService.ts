import { api } from './api';
import { List, ListCreate, ListUpdate } from '../types/list';

export const listService = {
  getAll: async (boardId: string): Promise<List[]> => {
    const response = await api.get(`/boards/${boardId}/lists`);
    return response.data;
  },

  getById: async (id: string): Promise<List> => {
    const response = await api.get(`/lists/${id}`);
    return response.data;
  },

  create: async (data: ListCreate): Promise<List> => {
    const response = await api.post('/lists', {
      name: data.name,
      idBoard: data.boardId,
      pos: data.position,
    });
    return response.data;
  },

  update: async (id: string, data: ListUpdate): Promise<List> => {
    const response = await api.put(`/lists/${id}`, {
      name: data.name,
      pos: data.position,
      closed: data.closed,
    });
    return response.data;
  },

  updateName: async (id: string, newName: string): Promise<List> => {
    const response = await api.put(`/lists/${id}`, {
      name: newName,
    });
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.put(`/lists/${id}`, { closed: true });
  },

  reorder: async (boardId: string, listIds: string[]): Promise<void> => {
    await api.put(`/boards/${boardId}/lists`, {
      lists: listIds,
    });
  },
};
