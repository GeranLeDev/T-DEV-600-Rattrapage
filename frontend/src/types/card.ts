export interface Card {
  id: string;
  name: string;
  desc?: string;
  listId: string;
  boardId: string;
  members?: string[];
  labels?: string[];
  due?: string;
}

export interface CardCreate {
  name: string;
  desc?: string;
  listId: string;
  boardId: string;
}

export interface CardUpdate {
  name?: string;
  desc?: string;
  listId?: string;
  closed?: boolean;
}
