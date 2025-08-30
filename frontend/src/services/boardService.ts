import { api } from './api';
import { Board, BoardCreate, BoardUpdate } from '../types/board';
import type { Card } from '../types/card';

export const boardService = {
  // ---- BOARDS ----
  getAll: async (workspaceId: string): Promise<Board[]> => {
    const { data } = await api.get(`/organizations/${workspaceId}/boards`);
    return data;
  },

  getById: async (id: string): Promise<Board> => {
    const { data } = await api.get(`/boards/${id}`);
    return data;
  },

  create: async (payload: BoardCreate): Promise<Board> => {
    const { data } = await api.post('/boards', payload);
    return data;
  },

  update: async (id: string, payload: BoardUpdate): Promise<Board> => {
    const { data } = await api.put(`/boards/${id}`, payload);
    return data;
  },

  updateDescription: async (id: string, desc: string): Promise<Board> => {
    const { data } = await api.put(`/boards/${id}`, { desc });
    return data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/boards/${id}`);
  },

  // ---- LABELS (du board) ----
  getLabels: async (boardId: string): Promise<Array<{ id: string; name: string; color: string }>> => {
    try {
      const { data } = await api.get(`/boards/${boardId}/labels`);
      return (Array.isArray(data) ? data : []).map((label: any) => ({
        id: label.id,
        name: label.name,
        color: label.color || '#B3B3B3',
      }));
    } catch (error) {
      console.error('Erreur lors de la récupération des étiquettes:', error);
      return [];
    }
  },

  // ---- MEMBRES (du board) ----
  getMembers: async (boardId: string): Promise<Array<{ id: string; name: string; avatar: string }>> => {
    try {
      const { data } = await api.get(`/boards/${boardId}/members`);
      return (Array.isArray(data) ? data : []).map((member: any) => ({
        id: member.id,
        name: member.fullName || member.username,
        avatar: member.avatarUrl || '',
      }));
    } catch (error) {
      console.error('Erreur lors de la récupération des membres du tableau:', error);
      return [];
    }
  },

  // ---- CARTES (lecture avec mapping idLabels/idMembers -> labels/members) ----
  getCards: async (boardId: string): Promise<Card[]> => {
    const { data } = await api.get(`/boards/${boardId}/cards`);
    return (Array.isArray(data) ? data : []).map((c: any): Card => ({
      id: c.id,
      name: c.name,
      desc: c.desc || '',
      labels: (c.idLabels || []) as string[],
      members: (c.idMembers || []) as string[],
      due: c.due || undefined,
      listId: c.idList,
      boardId: c.idBoard,
    }));
  },


  // (optionnel) cartes d’une liste précise
  getListCards: async (listId: string): Promise<Card[]> => {
    const { data } = await api.get(`/lists/${listId}/cards`);
    return (Array.isArray(data) ? data : []).map((c: any): Card => ({
      id: c.id,
      name: c.name,
      desc: c.desc || '',
      labels: (c.idLabels || []) as string[],
      members: (c.idMembers || []) as string[],
      due: c.due || undefined,
      listId: c.idList,
      boardId: c.idBoard,
    }));
  },


  //E TIQUETTES SUR CARTE (persistance)
  addLabelToCard: async (cardId: string, labelId: string): Promise<void> => {
    await api.post(`/cards/${cardId}/idLabels`, { value: labelId });
  },

  removeLabelFromCard: async (cardId: string, labelId: string): Promise<void> => {
    await api.delete(`/cards/${cardId}/idLabels/${labelId}`);
  },

  getCardLabels: async (
    cardId: string
  ): Promise<Array<{ id: string; name: string; color: string }>> => {
    const { data } = await api.get(`/cards/${cardId}/labels`);
    return (Array.isArray(data) ? data : []).map((l: any) => ({
      id: l.id,
      name: l.name,
      color: l.color || '#B3B3B3',
    }));
  },

  createLabel: async (
    boardId: string,
    name: string,
    color: string
  ): Promise<{ id: string; name: string; color: string }> => {
    const { data } = await api.post(`/labels`, { idBoard: boardId, name, color });
    return { id: data.id, name: data.name, color: data.color || '#B3B3B3' };
  },
};
