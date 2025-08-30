import { api } from './api';

export interface Me {
  id: string;
  username: string;
  fullName: string;
  bio?: string;
  avatarUrl?: string;
  url?: string;
  initials?: string;
}

export const accountService = {
  getMe: async (): Promise<Me> => {
    const { data } = await api.get('/members/me', {
      params: {
        // on demande explicitement les champs utiles
        fields: 'username,fullName,bio,avatarUrl,url,initials',
      },
    });
    return data;
  },
};
