import { api } from './api';
import { Card, CardCreate, CardUpdate } from '../types/card';

export const cardService = {
  getAll: async (listId: string): Promise<Card[]> => {
    const response = await api.get(`/lists/${listId}/cards`);
    return response.data;
  },

  getById: async (id: string): Promise<Card> => {
    const response = await api.get(`/cards/${id}`);
    return response.data;
  },

  create: async (data: CardCreate): Promise<Card> => {
    const response = await api.post('/cards', {
      name: data.name,
      desc: data.desc,
      idList: data.listId,
      idBoard: data.boardId,
    });
    return response.data;
  },

  update: async (cardId: string, data: Partial<Card>): Promise<Card> => {
    const response = await api.put(`/cards/${cardId}`, data);
    return response.data;
  },

  delete: async (cardId: string): Promise<void> => {
    await api.delete(`/cards/${cardId}`);
  },

  addMember: async (cardId: string, memberId: string): Promise<void> => {
    await api.post(`/cards/${cardId}/idMembers`, { value: memberId });
  },

  removeMember: async (cardId: string, memberId: string): Promise<void> => {
    await api.delete(`/cards/${cardId}/idMembers/${memberId}`);
  },

  getCardsByList: async (listId: string): Promise<Card[]> => {
    const response = await api.get(`/lists/${listId}/cards`);
    return response.data.map((card: any) => ({
      id: card.id,
      name: card.name,
      desc: card.desc,
      listId: card.idList,
      boardId: card.idBoard,
      members: card.idMembers || [],
      labels: card.idLabels || [],
      due: card.due,
    }));
  },
};

export default cardService;
