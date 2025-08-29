export interface Board {
  id: string;
  name: string;
  description: string;
  desc?: string;
  workspaceId: string;
  background?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface BoardCreate {
  name: string;
  description?: string;
  workspaceId: string;
  background?: string;
}

export interface BoardUpdate {
  name?: string;
  description?: string;
  desc?: string;
  background?: string;
}
