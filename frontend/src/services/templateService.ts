import { api } from './api';
import { Board } from '../types/board';
import { List } from '../types/list';
import { Card } from '../types/card';

export interface Template {
  id: string;
  name: string;
  description: string;
  image: string;
  lists: {
    name: string;
    cards: {
      name: string;
      description?: string;
      labels?: string[];
      dueDate?: string;
      members?: string[];
    }[];
  }[];
}

const trelloTemplates: Template[] = [
  {
    id: 'project-management',
    name: 'Gestion de Projet',
    description: 'Template idéal pour suivre les projets de A à Z',
    image:
      'https://trello.com/1/cards/65f2d8b9c2f8a6a3b3b3b3b3/attachments/65f2d8b9c2f8a6a3b3b3b3b4/previews/65f2d8b9c2f8a6a3b3b3b3b5/download/project-management.png',
    lists: [
      {
        name: 'À faire',
        cards: [
          { name: 'Définir les objectifs du projet' },
          { name: 'Créer le cahier des charges' },
          { name: 'Identifier les parties prenantes' },
        ],
      },
      {
        name: 'En cours',
        cards: [{ name: 'Planifier les sprints' }, { name: 'Créer les user stories' }],
      },
      {
        name: 'En revue',
        cards: [{ name: "Valider l'architecture technique" }, { name: 'Revoir les maquettes' }],
      },
      {
        name: 'Terminé',
        cards: [{ name: "Mettre en place l'environnement de développement" }],
      },
    ],
  },
  {
    id: 'kanban-board',
    name: 'Tableau Kanban',
    description: 'Organisez vos tâches avec la méthode Kanban',
    image:
      'https://trello.com/1/cards/65f2d8b9c2f8a6a3b3b3b3b3/attachments/65f2d8b9c2f8a6a3b3b3b3b4/previews/65f2d8b9c2f8a6a3b3b3b3b5/download/kanban.png',
    lists: [
      {
        name: 'Backlog',
        cards: [{ name: 'Tâche 1' }, { name: 'Tâche 2' }, { name: 'Tâche 3' }],
      },
      {
        name: 'À faire',
        cards: [{ name: 'Tâche 4' }, { name: 'Tâche 5' }],
      },
      {
        name: 'En cours',
        cards: [{ name: 'Tâche 6' }, { name: 'Tâche 7' }],
      },
      {
        name: 'Terminé',
        cards: [{ name: 'Tâche 8' }],
      },
    ],
  },
  {
    id: 'sprint-planning',
    name: 'Planification de Sprint',
    description: 'Gérez vos sprints agile efficacement',
    image:
      'https://trello.com/1/cards/65f2d8b9c2f8a6a3b3b3b3b3/attachments/65f2d8b9c2f8a6a3b3b3b3b4/previews/65f2d8b9c2f8a6a3b3b3b3b5/download/sprint.png',
    lists: [
      {
        name: 'Product Backlog',
        cards: [{ name: 'User Story 1' }, { name: 'User Story 2' }, { name: 'User Story 3' }],
      },
      {
        name: 'Sprint Backlog',
        cards: [{ name: 'Tâche Sprint 1' }, { name: 'Tâche Sprint 2' }],
      },
      {
        name: 'En cours',
        cards: [{ name: 'Tâche Sprint 3' }, { name: 'Tâche Sprint 4' }],
      },
      {
        name: 'Terminé',
        cards: [{ name: 'Tâche Sprint 5' }],
      },
    ],
  },
];

export const templateService = {
  getAll: async (): Promise<Template[]> => {
    // En production, on appellerait l'API
    return Promise.resolve(trelloTemplates);
  },

  getById: async (id: string): Promise<Template> => {
    const template = trelloTemplates.find((t) => t.id === id);
    if (!template) {
      throw new Error('Template non trouvé');
    }
    return Promise.resolve(template);
  },

  create: async (data: Omit<Template, 'id'>): Promise<Template> => {
    const newTemplate: Template = {
      ...data,
      id: Math.random().toString(36).substr(2, 9),
    };
    trelloTemplates.push(newTemplate);
    return Promise.resolve(newTemplate);
  },

  update: async (id: string, data: Partial<Template>): Promise<Template> => {
    const index = trelloTemplates.findIndex((t) => t.id === id);
    if (index === -1) {
      throw new Error('Template non trouvé');
    }
    trelloTemplates[index] = { ...trelloTemplates[index], ...data };
    return Promise.resolve(trelloTemplates[index]);
  },

  delete: async (id: string): Promise<void> => {
    const index = trelloTemplates.findIndex((t) => t.id === id);
    if (index === -1) {
      throw new Error('Template non trouvé');
    }
    trelloTemplates.splice(index, 1);
    return Promise.resolve();
  },

  createBoardFromTemplate: async (
    templateId: string,
    workspaceId: string,
    boardName: string
  ): Promise<{
    board: Board;
    lists: List[];
    cards: Card[];
  }> => {
    const template = await templateService.getById(templateId);

    // Créer le tableau
    const board: Board = {
      id: Math.random().toString(36).substr(2, 9),
      name: boardName,
      description: template.description,
      workspaceId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Créer les listes
    const lists: List[] = template.lists.map((list, index) => ({
      id: Math.random().toString(36).substr(2, 9),
      name: list.name,
      boardId: board.id,
      position: index,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }));

    // Créer les cartes
    const cards: Card[] = template.lists.flatMap((list, listIndex) =>
      list.cards.map((card, cardIndex) => ({
        id: Math.random().toString(36).substr(2, 9),
        name: card.name,
        description: card.description || '',
        boardId: board.id,
        listId: lists[listIndex].id,
        position: cardIndex,
        labels: card.labels || [],
        dueDate: card.dueDate,
        members: card.members || [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }))
    );

    return Promise.resolve({ board, lists, cards });
  },
};
