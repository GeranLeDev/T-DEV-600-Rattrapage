import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ThemeProvider, createTheme } from '@mui/material';
import { TaskCard } from '../TaskCard';
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

const mockCard: Card = {
  id: '1',
  name: 'Test Card',
  desc: 'Test Description',
  listId: 'list1',
  boardId: 'board1',
  members: ['John', 'Jane'],
  labels: ['Urgent', 'Important'],
  due: '2024-03-20',
};

describe('TaskCard', () => {
  const renderComponent = () => {
    return render(
      <ThemeProvider theme={testTheme}>
        <TaskCard card={mockCard} />
      </ThemeProvider>
    );
  };

  test('affiche le titre de la carte', () => {
    renderComponent();
    expect(screen.getByText('Test Card')).toBeInTheDocument();
  });

  test('affiche la description de la carte', () => {
    renderComponent();
    expect(screen.getByText('Test Description')).toBeInTheDocument();
  });

  test('affiche les membres de la carte', () => {
    renderComponent();
    const avatars = screen.getAllByRole('img');
    expect(avatars).toHaveLength(2); // 2 membres
  });

  test('affiche les étiquettes de la carte', () => {
    renderComponent();
    const labels = screen.getAllByRole('presentation');
    expect(labels).toHaveLength(2); // 2 étiquettes
  });

  test("affiche la date d'échéance de la carte", () => {
    renderComponent();
    expect(screen.getByText('20/03/2024')).toBeInTheDocument();
  });

  test('appelle la fonction onClick lors du clic sur la carte', () => {
    const handleClick = jest.fn();
    render(
      <ThemeProvider theme={testTheme}>
        <TaskCard card={mockCard} onClick={handleClick} />
      </ThemeProvider>
    );

    fireEvent.click(screen.getByText('Test Card'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
