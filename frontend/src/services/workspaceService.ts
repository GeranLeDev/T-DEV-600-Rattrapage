import { api } from './api';
import { Workspace, WorkspaceCreate, WorkspaceUpdate, Member } from '../types/workspace';

let currentWorkspace: Workspace | null = null;
let recentWorkspaces: Workspace[] = [];

export const workspaceService = {
  // Gestion du workspace actuel
  setCurrentWorkspace: (workspace: Workspace) => {
    currentWorkspace = workspace;
    // Ajouter aux récents si pas déjà présent
    if (!recentWorkspaces.find((w) => w.id === workspace.id)) {
      recentWorkspaces.unshift(workspace);
      // Garder seulement les 3 derniers
      recentWorkspaces = recentWorkspaces.slice(0, 3);
    }
  },

  getCurrentWorkspace: (): Workspace | null => {
    return currentWorkspace;
  },

  getRecentWorkspaces: async (): Promise<Workspace[]> => {
    try {
      // Récupérer les organisations récentes de l'utilisateur
      const response = await api.get('/members/me/organizations', {
        params: {
          fields: 'id,name,displayName,desc,memberships,prefs,dateLastActivity,createdAt',
          filter: 'members',
          member: true,
          limit: 3,
        },
      });

      // Transformer les données reçues au format attendu
      return response.data.map((org: any) => ({
        id: org.id,
        name: org.name,
        displayName: org.displayName,
        description: org.desc || '',
        members: org.memberships || [],
        isFavorite: org.prefs?.starred || false,
        createdAt: org.createdAt,
        updatedAt: org.dateLastActivity,
      }));
    } catch (error) {
      console.error('Erreur lors de la récupération des workspaces récents:', error);
      throw error;
    }
  },

  // Récupérer tous les workspaces
  getAll: async (): Promise<Workspace[]> => {
    const response = await api.get('/members/me/organizations');
    return response.data;
  },

  // Récupérer un workspace par son ID
  getById: async (id: string): Promise<Workspace> => {
    const response = await api.get(`/organizations/${id}`);
    return response.data;
  },

  // Créer un nouveau workspace
  create: async (data: WorkspaceCreate): Promise<Workspace> => {
    const response = await api.post('/organizations', data);
    return response.data;
  },

  // Mettre à jour un workspace
  update: async (id: string, data: WorkspaceUpdate): Promise<Workspace> => {
    const response = await api.put(`/organizations/${id}`, data);
    return response.data;
  },

  // Supprimer un workspace
  delete: async (id: string): Promise<void> => {
    await api.delete(`/organizations/${id}`);
  },

  // Ajouter un membre au workspace
  addMember: async (workspaceId: string, memberEmail: string): Promise<void> => {
    await api.put(`/organizations/${workspaceId}/members`, {
      email: memberEmail,
      type: 'normal',
    });
  },

  // Ajouter un membre par username (invite Trello)
  addMemberByUsername: async (
    workspaceId: string,
    username: string,
    role: 'admin' | 'normal' = 'normal'
  ): Promise<void> => {
    const clean = username.trim().replace(/^@/, '');

    try {
      // ✅ Variante Trello fiable : username dans le path, role en query
      await api.put(
        `/organizations/${workspaceId}/members/${encodeURIComponent(clean)}?type=${role}`
      );
    } catch (err: any) {
      // Fallback: ancien endpoint body (au cas où)
      try {
        await api.put(`/organizations/${workspaceId}/members`, {
          username: clean,
          type: role,
        });
      } catch (e: any) {
        const s = e?.response?.status;
        if (s === 401 || s === 403) throw new Error('PERM');      // pas les droits
        if (s === 400 || s === 404) throw new Error('USERNAME');  // username invalide/inconnu
        throw e;
      }
    }
  },



  // Générer un lien d'invitation
  generateInviteLink: async (workspaceId: string): Promise<string> => {
    const response = await api.post(`/organizations/${workspaceId}/invite-links`, {
      expiresIn: '7d', // Le lien expire dans 7 jours
    });
    return response.data.token;
  },

  // Valider et accepter une invitation par lien
  acceptInviteLink: async (workspaceId: string, token: string): Promise<void> => {
    await api.post(`/organizations/${workspaceId}/invite-links/${token}/accept`);
  },

  // Supprimer un membre du workspace
  removeMember: async (workspaceId: string, memberId: string): Promise<void> => {
    await api.delete(`/organizations/${workspaceId}/members/${memberId}`);
  },

  // Récupérer les membres d'un workspace avec leur rôle réel
  getMembers: async (workspaceId: string): Promise<Member[]> => {
    const { data } = await api.get(
      `/organizations/${workspaceId}/memberships?member=true`
    );
    return (Array.isArray(data) ? data : []).map((ms: any) => ({
      id: ms.idMember,
      username: ms.member?.username ?? '',
      fullName: ms.member?.fullName ?? '',
      avatar: ms.member?.avatarUrl ?? '',
      // Trello: memberType = 'admin' | 'normal'
      role: ms.memberType === 'admin' ? 'admin' : 'member',
    }));
  },



  // Mettre à jour le rôle d'un membre
  updateMemberRole: async (
    workspaceId: string,
    memberId: string,
    role: 'admin' | 'member'
  ): Promise<void> => {
    await api.put(`/organizations/${workspaceId}/members/${memberId}`, {
      type: role === 'admin' ? 'admin' : 'normal',
    });
  },
};
