import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ThemeProvider } from '@mui/material';
import { theme } from '../../../styles/theme';
import BoardLeftBar from '../BoardLeftBar';

const mockMembers = [
  { id: '1', name: 'John Doe', avatar: 'avatar1.jpg' },
  { id: '2', name: 'Jane Smith', avatar: 'avatar2.jpg' },
];

const mockLists = [
  { id: '1', name: 'À faire', cardCount: 3 },
  { id: '2', name: 'En cours', cardCount: 2 },
];

const mockLabels = [
  { id: '1', name: 'Urgent', color: '#ff0000' },
  { id: '2', name: 'Important', color: '#00ff00' },
];

describe('BoardLeftBar', () => {
  const renderComponent = () => {
    return render(
      <ThemeProvider theme={theme}>
        <BoardLeftBar
          boardName="Test Board"
          workspaceName="Test Workspace"
          members={mockMembers}
          lists={mockLists}
          labels={mockLabels}
          onTemplateClick={() => {}}
        />
      </ThemeProvider>
    );
  };

  test('renders board name and workspace name', () => {
    renderComponent();
    expect(screen.getByText('Test Board')).toBeInTheDocument();
    expect(screen.getByText(/dans l'espace de travail Test Workspace/)).toBeInTheDocument();
  });

  test('toggles sections when clicked', () => {
    renderComponent();

    // Test "À propos" section
    const aboutButton = screen.getByText('À propos de ce tableau');
    fireEvent.click(aboutButton);
    expect(screen.getByText('Description')).toBeInTheDocument();

    // Test "Membres" section
    const membersButton = screen.getByText('Membres');
    fireEvent.click(membersButton);
    expect(screen.getByText('+ Inviter des membres')).toBeInTheDocument();

    // Test "Listes" section
    const listsButton = screen.getByText('Listes');
    fireEvent.click(listsButton);
    expect(screen.getByText('À faire')).toBeInTheDocument();

    // Test "Étiquettes" section
    const labelsButton = screen.getByText('Étiquettes');
    fireEvent.click(labelsButton);
    expect(screen.getByText('Urgent')).toBeInTheDocument();
  });

  test('displays correct number of members and lists', () => {
    renderComponent();

    // Click on members section
    fireEvent.click(screen.getByText('Membres'));
    const avatars = screen.getAllByRole('img');
    expect(avatars).toHaveLength(2); // 2 members

    // Click on lists section
    fireEvent.click(screen.getByText('Listes'));
    expect(screen.getByText('À faire')).toBeInTheDocument();
    expect(screen.getByText('En cours')).toBeInTheDocument();
  });

  test('displays labels with correct colors', () => {
    renderComponent();

    // Click on labels section
    fireEvent.click(screen.getByText('Étiquettes'));

    const urgentLabel = screen.getByText('Urgent');
    const importantLabel = screen.getByText('Important');

    expect(urgentLabel).toBeInTheDocument();
    expect(importantLabel).toBeInTheDocument();
  });
});
