import React, { useState, useEffect } from 'react';
import {
  Paper,
  Typography,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
} from '@mui/material';
import {
  MoreVert as MoreVertIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Close as CloseIcon,
} from '@mui/icons-material';
import { TaskCard } from '../Card/TaskCard';
import { List } from '../../types/list';
import { Card } from '../../types/card';

interface ListCardProps {
  list: List;
  cards: Card[];
  onAddCard: () => void;
  onCardClick: (card: Card) => void;
  onUpdateList: (listId: string, newName: string) => Promise<void>;
  onDeleteList: (listId: string) => Promise<void>;
  onCreateCard?: (listId: string, name: string) => Promise<void>;
  onUpdateCard?: (cardId: string, newName: string, newDesc?: string) => Promise<void>;
  onDeleteCard?: (cardId: string) => Promise<void>;
  showCardForm: string | null;
  setShowCardForm: (listId: string | null) => void;
  availableMembers?: { id: string; name: string; avatar?: string }[];
  availableLabels?: { id: string; name: string; color: string }[];
  onAssignMember?: (cardId: string, memberId: string) => Promise<void>;
  onRemoveMember?: (cardId: string, memberId: string) => Promise<void>;
  onAddLabel?: (cardId: string, labelId: string) => Promise<void>;
  onRemoveLabel?: (cardId: string, labelId: string) => Promise<void>;
}

export const ListCard: React.FC<ListCardProps> = ({
  list,
  cards,
  onAddCard,
  onCardClick,
  onUpdateList,
  onDeleteList,
  onCreateCard,
  onUpdateCard,
  onDeleteCard,
  showCardForm,
  setShowCardForm,
  availableMembers,
  availableLabels,
  onAssignMember,
  onRemoveMember,
  onAddLabel,
  onRemoveLabel,
}) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [newListName, setNewListName] = useState(list.name);
  const [isUpdating, setIsUpdating] = useState(false);
  const menuOpen = Boolean(anchorEl);

  useEffect(() => {}, [anchorEl, menuOpen]);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleEditClick = () => {
    handleMenuClose();
    setEditDialogOpen(true);
  };

  const handleDeleteClick = () => {
    handleMenuClose();
    setDeleteDialogOpen(true);
  };

  const handleUpdateList = async () => {
    if (newListName.trim() && newListName !== list.name) {
      setIsUpdating(true);
      try {
        await onUpdateList(list.id, newListName);
        setEditDialogOpen(false);
      } catch (error) {
        console.error('Erreur lors de la mise à jour de la liste:', error);
      } finally {
        setIsUpdating(false);
      }
    }
  };

  const handleDeleteConfirm = async () => {
    setIsUpdating(true);
    try {
      await onDeleteList(list.id);
      setDeleteDialogOpen(false);
    } catch (error) {
      console.error('Erreur lors de la suppression de la liste:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleCreateCardSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const input = form.querySelector('input');

    if (input?.value.trim() && onCreateCard) {
      onCreateCard(list.id, input.value.trim());
    }
  };

  return (
    <Paper
      sx={{
        width: 300,
        bgcolor: 'rgba(255, 255, 255, 0.8)',
        borderRadius: 1,
        display: 'flex',
        flexDirection: 'column',
        maxHeight: '100%',
        height: 'fit-content',
        minHeight: 100,
        position: 'relative',
        zIndex: 1,
      }}
    >
      <Box
        sx={{
          p: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          position: 'relative',
          zIndex: 2,
        }}
      >
        <Typography
          sx={{
            fontWeight: 'bold',
            color: '#172B4D',
            fontSize: '14px',
            p: 1,
            flexGrow: 1,
          }}
        >
          {list.name} ({cards.length})
        </Typography>
        <IconButton
          size="small"
          onClick={handleMenuOpen}
          sx={{
            color: 'rgba(0, 0, 0, 0.5)',
            '&:hover': { bgcolor: 'rgba(0, 0, 0, 0.1)' },
            zIndex: 3,
          }}
          data-testid="list-options-button"
        >
          <MoreVertIcon fontSize="small" />
        </IconButton>
      </Box>

      <Menu
        id={`list-menu-${list.id}`}
        anchorEl={anchorEl}
        open={menuOpen}
        onClose={handleMenuClose}
        onClick={(e) => e.stopPropagation()}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        sx={{
          '& .MuiPaper-root': {
            minWidth: 150,
            boxShadow: '0px 2px 8px rgba(0,0,0,0.15)',
            zIndex: 9999,
          },
        }}
        slotProps={{
          paper: {
            elevation: 8,
            sx: { zIndex: 9999 },
          },
        }}
        MenuListProps={{
          'aria-labelledby': 'list-options-button',
        }}
      >
        <MenuItem onClick={handleEditClick}>
          <EditIcon fontSize="small" sx={{ mr: 1 }} />
          Modifier
        </MenuItem>
        <MenuItem onClick={handleDeleteClick} sx={{ color: 'error.main' }}>
          <DeleteIcon fontSize="small" sx={{ mr: 1 }} />
          Supprimer
        </MenuItem>
      </Menu>

      <Box
        sx={{
          flex: 1,
          overflowY: 'auto',
          minHeight: 'auto',
          maxHeight: 'calc(100vh - 200px)',
          p: 1,
        }}
      >
        {cards.map((card) => (
          <TaskCard
            key={card.id}
            card={card}
            onClick={() => onCardClick(card)}
            availableMembers={availableMembers}
            availableLabels={availableLabels}
            onAssignMember={onAssignMember}
            onRemoveMember={onRemoveMember}
            onAddLabel={onAddLabel}
            onRemoveLabel={onRemoveLabel}
            onEditCard={onUpdateCard}
            onDeleteCard={onDeleteCard}
          />
        ))}

        {showCardForm === list.id ? (
          <Box component="form" onSubmit={handleCreateCardSubmit}>
            <input
              type="text"
              placeholder="Saisissez un titre pour cette carte..."
              autoFocus
              style={{
                width: '100%',
                padding: '8px',
                border: '2px solid #0079BF',
                borderRadius: '3px',
                marginBottom: '8px',
              }}
            />
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                type="submit"
                variant="contained"
                size="small"
                sx={{
                  bgcolor: '#0079BF',
                  '&:hover': { bgcolor: '#026AA7' },
                }}
              >
                Ajouter la carte
              </Button>
              <IconButton
                size="small"
                onClick={() => setShowCardForm(null)}
                sx={{ color: 'rgba(0, 0, 0, 0.5)' }}
              >
                <CloseIcon />
              </IconButton>
            </Box>
          </Box>
        ) : (
          <Box
            onClick={onAddCard}
            sx={{
              p: 1,
              borderRadius: 1,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              color: 'rgba(0, 0, 0, 0.6)',
              '&:hover': {
                bgcolor: 'rgba(0, 0, 0, 0.08)',
              },
            }}
          >
            <AddIcon fontSize="small" />
            <Typography variant="body2">Ajouter une carte</Typography>
          </Box>
        )}
      </Box>

      {/* Dialog de modification */}
      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)}>
        <DialogTitle>Modifier la liste</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Nom de la liste"
            fullWidth
            value={newListName}
            onChange={(e) => setNewListName(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)} disabled={isUpdating}>
            Annuler
          </Button>
          <Button onClick={handleUpdateList} variant="contained" disabled={isUpdating}>
            Enregistrer
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog de confirmation de suppression */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Supprimer la liste</DialogTitle>
        <DialogContent>
          Êtes-vous sûr de vouloir supprimer la liste "{list.name}" ? Cette action est irréversible.
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)} disabled={isUpdating}>
            Annuler
          </Button>
          <Button
            onClick={handleDeleteConfirm}
            color="error"
            variant="contained"
            disabled={isUpdating}
          >
            Supprimer
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default ListCard;
