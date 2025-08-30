import { api } from './api';
import { Workspace, WorkspaceCreate, WorkspaceUpdate, Member } from '../types/workspace';

let currentWorkspace: Workspace | null = null;
let recentWorkspaces: Workspace[] = [];

const FAVORITES_STORAGE_KEY = 'trellolike.favoriteWorkspaces';

const getFavoriteIds = (): string[] => {
  try {
    const raw = localStorage.getItem(FAVORITES_STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const saveFavoriteIds = (ids: string[]) => {
  try {
    localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(ids));
  } catch { }
};

const applyFavorites = <T extends { id: string; isFavorite?: boolean }>(items: T[]): T[] => {
  const favs = new Set(getFavoriteIds());
  return items.map((i) => ({ ...i, isFavorite: favs.has(i.id) }));
};

const withFavorite = <T extends { id: string; isFavorite?: boolean }>(item: T): T => {
  const favs = getFavoriteIds();
  return { ...item, isFavorite: favs.includes(item.id) };
};


export const workspaceService = {
  isWorkspaceFavorite: (workspaceId: string): boolean => {
    return getFavoriteIds().includes(workspaceId);
  },

  setWorkspaceFavorite: (workspaceId: string, isFav: boolean): void => {
    let ids = getFavoriteIds();
    if (isFav) {
      if (!ids.includes(workspaceId)) ids.unshift(workspaceId);
    } else {
      ids = ids.filter((id) => id !== workspaceId);
    }
    saveFavoriteIds(ids);

    // met à jour le current et la liste récente en mémoire si présents
    if (currentWorkspace && currentWorkspace.id === workspaceId) {
      currentWorkspace = { ...currentWorkspace, isFavorite: isFav };
    }
    recentWorkspaces = recentWorkspaces.map((w) =>
      w.id === workspaceId ? { ...w, isFavorite: isFav } : w
    );
  },

  toggleWorkspaceFavorite: (workspaceId: string): boolean => {
    const next = !getFavoriteIds().includes(workspaceId);
    workspaceService.setWorkspaceFavorite(workspaceId, next);
    return next;
  },

  applyFavorites: <T extends { id: string; isFavorite?: boolean }>(items: T[]): T[] => {
    return applyFavorites(items);
  },

  setCurrentWorkspace: (workspace: Workspace) => {
    const withFav = withFavorite(workspace);
    currentWorkspace = withFav;

    // Ajouter aux récents si pas déjà présent
    if (!recentWorkspaces.find((w) => w.id === withFav.id)) {
      recentWorkspaces.unshift(withFav);
      recentWorkspaces = recentWorkspaces.slice(0, 3);
    } else {
      // garder les favoris à jour si déjà présent
      recentWorkspaces = recentWorkspaces.map((w) => (w.id === withFav.id ? withFav : w));
    }
  },

  getCurrentWorkspace: (): Workspace | null => {
    return currentWorkspace ? withFavorite(currentWorkspace) : null;
  },

  getRecentWorkspaces: async (): Promise<Workspace[]> => {
    try {
      const response = await api.get('/members/me/organizations', {
        params: {
          fields: 'id,name,displayName,desc,memberships,prefs,dateLastActivity,createdAt',
          filter: 'members',
          member: true,
          limit: 3,
        },
      });

      const mapped: Workspace[] = response.data.map((org: any) => ({
        id: org.id,
        name: org.name,
        displayName: org.displayName,
        description: org.desc || '',
        members: org.memberships || [],
        // On n'utilise PAS une étoile API ici (pas dispo pour organizations) : on applique nos favoris locaux
        isFavorite: false,
        createdAt: org.createdAt,
        updatedAt: org.dateLastActivity,
      }));

      const withFavs = applyFavorites(mapped);
      // garde aussi une copie mémoire
      recentWorkspaces = withFavs.slice(0, 3);
      return withFavs;
    } catch (error) {
      console.error('Erreur lors de la récupération des workspaces récents:', error);
      throw error;
    }
  },

  // Récupérer tous les workspaces
  // Récupérer tous les workspaces (avec description mappée)
  getAll: async (): Promise<Workspace[]> => {
    const { data } = await api.get('/members/me/organizations', {
      params: {
        // on demande explicitement les champs utiles (dont desc)
        fields: 'id,name,displayName,desc,memberships,prefs,dateLastActivity,createdAt',
      },
    });

    const mapped: Workspace[] = (Array.isArray(data) ? data : []).map((org: any) => ({
      id: org.id,
      name: org.name,
      displayName: org.displayName,
      description: org.desc || '',            // on mappe desc -> description
      members: org.memberships || [],
      isFavorite: false,                      // ssera écrasé par applyFavorites
      createdAt: org.createdAt,
      updatedAt: org.dateLastActivity,
    }));

    // applique les favoris locaux
    return workspaceService.applyFavorites(mapped);
  },


  // Récupérer un workspace par son ID
  getById: async (id: string): Promise<Workspace> => {
    const response = await api.get(`/organizations/${id}`);
    return withFavorite(response.data);
  },

  // Créer un nouveau workspace
  create: async (data: WorkspaceCreate): Promise<Workspace> => {
    const response = await api.post('/organizations', data);
    return withFavorite(response.data);
  },

  // Mettre à jour un workspace
  update: async (id: string, data: WorkspaceUpdate): Promise<Workspace> => {
    const response = await api.put(`/organizations/${id}`, data);
    return withFavorite(response.data);
  },

  // Supprimer un workspace
  delete: async (id: string): Promise<void> => {
    await api.delete(`/organizations/${id}`);
    // nettoyage local éventuel
    if (currentWorkspace?.id === id) currentWorkspace = null;
    recentWorkspaces = recentWorkspaces.filter((w) => w.id !== id);
    workspaceService.setWorkspaceFavorite(id, false);
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
      // username dans le path, role en query
      await api.put(
        `/organizations/${workspaceId}/members/${encodeURIComponent(clean)}?type=${role}`
      );
    } catch (err: any) {
      // fallback body
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

  // Générer un lien d'invitation (non supporté par l'API REST)
  generateInviteLink: async (_workspaceId: string): Promise<string> => {
    throw new Error('INVITE_LINK_NOT_SUPPORTED');
  },

  // Accepter un lien d'invitation (non supporté - via UI Trello)
  acceptInviteLink: async (_workspaceId: string, _token: string): Promise<void> => {
    throw new Error('INVITE_LINK_NOT_SUPPORTED');
  },

  // Supprimer un membre du workspace
  removeMember: async (workspaceId: string, memberId: string): Promise<void> => {
    await api.delete(`/organizations/${workspaceId}/members/${memberId}`);
  },

  // Récupérer les membres d'un workspace avec leur rôle réel
  getMembers: async (workspaceId: string): Promise<Member[]> => {
    const { data } = await api.get(`/organizations/${workspaceId}/memberships?member=true`);
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
