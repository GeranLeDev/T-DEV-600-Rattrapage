export interface List {
  id: string;
  name: string;
  boardId: string;
  position: number;
  closed?: boolean;
}

export interface ListCreate {
  name: string;
  boardId: string;
  position?: number;
}

export interface ListUpdate {
  name?: string;
  position?: number;
  closed?: boolean;
}
