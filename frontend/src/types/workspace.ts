export interface Member {
  id: string;
  username: string;
  fullName: string;
  lastActive?: string;
  avatar?: string;
  role?: 'admin' | 'member';
}

interface WorkspacePrefs {
  permissionLevel: 'private' | 'public';
  invitations: 'admins' | 'members';
  notifications: boolean;
}

export interface Workspace {
  id: string;
  name: string;
  displayName: string;
  description: string;
  desc?: string;
  members: Member[];
  isFavorite: boolean;
  createdAt: string;
  updatedAt: string;
  prefs?: WorkspacePrefs;
}

export interface WorkspaceCreate {
  name: string;
  displayName: string;
  description?: string;
}

export interface WorkspaceUpdate {
  name?: string;
  displayName?: string;
  description?: string;
}
