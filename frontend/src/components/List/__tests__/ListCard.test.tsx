import React, { act } from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ThemeProvider, createTheme } from '@mui/material';
import { ListCard } from '../ListCard';
import { List } from '../../../types/list';
import { Card } from '../../../types/card';

const testTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#026AA7',
    },
    secondary: {
      main: '#5AAC44',
    },
  },
  typography: {
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  },
});

const mockList: List = {
  id: 'list1',
  name: 'Test List',
  boardId: 'board1',
  position: 0,
};

const mockCards: Card[] = [
  {
    id: 'card1',
    name: 'Card 1',
    desc: 'Description 1',
    listId: 'list1',
    boardId: 'board1',
  },
  {
    id: 'card2',
    name: 'Card 2',
    desc: 'Description 2',
    listId: 'list1',
    boardId: 'board1',
  },
];

describe('ListCard', () => {
  const mockOnAddCard = jest.fn();
  const mockOnCardClick = jest.fn();

  const renderComponent = () => {
    return render(
      <ThemeProvider theme={testTheme}>
        <ListCard
          list={mockList}
          cards={mockCards}
          onAddCard={mockOnAddCard}
          onCardClick={mockOnCardClick}
        />
      </ThemeProvider>
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('affiche le titre de la liste avec le nombre de cartes', () => {
    renderComponent();
    expect(screen.getByText('Test List (2)')).toBeInTheDocument();
  });

  test('affiche toutes les cartes de la liste', () => {
    renderComponent();
    expect(screen.getByText('Card 1')).toBeInTheDocument();
    expect(screen.getByText('Card 2')).toBeInTheDocument();
  });

  test('affiche le bouton pour ajouter une carte', () => {
    renderComponent();
    expect(screen.getByText('Ajouter une carte')).toBeInTheDocument();
  });

  test("appelle onAddCard lors du clic sur le bouton d'ajout", () => {
    renderComponent();
    fireEvent.click(screen.getByText('Ajouter une carte'));
    expect(mockOnAddCard).toHaveBeenCalledTimes(1);
  });

  test('appelle onCardClick lors du clic sur une carte', () => {
    renderComponent();
    fireEvent.click(screen.getByText('Card 1'));
    expect(mockOnCardClick).toHaveBeenCalledWith(mockCards[0]);
  });

  test('affiche le menu des options de la liste', async () => {
    renderComponent();
    const menuButton = screen.getByTestId('MoreVertIcon').closest('button');
    if (menuButton) {
      fireEvent.click(menuButton);
      // Attendre que le menu soit rendu
      await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 0));
      });
      expect(screen.getByRole('menu')).toBeInTheDocument();
    }
  });
});
