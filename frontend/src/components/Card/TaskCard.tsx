import React, { useState } from 'react';
import {
  Paper,
  Typography,
  Box,
  Chip,
  Avatar,
  AvatarGroup,
  IconButton,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Checkbox,
  TextField,
  Divider,
} from '@mui/material';
import {
  MoreVert as MoreVertIcon,
  Person as PersonIcon,
  Label as LabelIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import { Card } from '../../types/card';

interface TaskCardProps {
  card: Card;
  onClick?: () => void;
  onAssignMember?: (cardId: string, memberId: string) => Promise<void>;
  onRemoveMember?: (cardId: string, memberId: string) => Promise<void>;
  onAddLabel?: (cardId: string, labelId: string) => Promise<void>;
  onRemoveLabel?: (cardId: string, labelId: string) => Promise<void>;
  onEditCard?: (cardId: string, newName: string, newDesc?: string) => Promise<void>;
  onDeleteCard?: (cardId: string) => Promise<void>;
  availableMembers?: { id: string; name: string; avatar?: string }[];
  availableLabels?: { id: string; name: string; color: string }[];
}

export const TaskCard: React.FC<TaskCardProps> = ({
  card,
  onClick,
  onAssignMember,
  onRemoveMember,
  onAddLabel,
  onRemoveLabel,
  onEditCard,
  onDeleteCard,
  availableMembers = [],
  availableLabels = [],
}) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [memberDialogOpen, setMemberDialogOpen] = useState(false);
  const [labelDialogOpen, setLabelDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editName, setEditName] = useState(card.name);
  const [editDesc, setEditDesc] = useState(card.desc || '');
  const menuOpen = Boolean(anchorEl);

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleMemberDialogOpen = () => {
    handleMenuClose();
    setMemberDialogOpen(true);
  };

  const handleLabelDialogOpen = () => {
    handleMenuClose();
    setLabelDialogOpen(true);
  };

  const handleMemberChange = async (memberId: string) => {
    if (!onAssignMember || !onRemoveMember) return;

    const isMemberAssigned = card.members?.includes(memberId);
    try {
      if (isMemberAssigned) {
        await onRemoveMember(card.id, memberId);
      } else {
        await onAssignMember(card.id, memberId);
      }
    } catch (error) {
      console.error('Erreur lors de la modification des membres:', error);
    }
  };

  const handleLabelChange = async (labelId: string) => {
    if (!onAddLabel || !onRemoveLabel) return;

    const isLabelAssigned = card.labels?.includes(labelId);
    try {
      if (isLabelAssigned) {
        await onRemoveLabel(card.id, labelId);
      } else {
        await onAddLabel(card.id, labelId);
      }
    } catch (error) {
      console.error('Erreur lors de la modification des étiquettes:', error);
    }
  };

  const handleCardClick = (e: React.MouseEvent) => {
    if (onClick) {
      onClick();
    }
  };

  // Fonction helper pour obtenir la couleur de l'étiquette à partir de son ID
  const getLabelColor = (labelId: string): string => {
    const label = availableLabels.find((l) => l.id === labelId);
    return label?.color || '#cccccc';
  };

  return (
    <Paper
      onClick={handleCardClick}
      sx={{
        p: 1.5,
        mb: 1,
        backgroundColor: '#fff',
        boxShadow: '0 1px 0 rgba(9,30,66,.25)',
        borderRadius: '3px',
        cursor: 'pointer',
        position: 'relative',
        '&:hover': {
          backgroundColor: '#f4f5f7',
        },
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <Typography variant="body2" sx={{ flexGrow: 1 }}>
          {card.name}
        </Typography>
        <IconButton
          size="small"
          onClick={handleMenuClick}
          sx={{
            padding: '2px',
            mr: -1,
            mt: -1,
            color: 'rgba(0, 0, 0, 0.5)',
            '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.08)' },
          }}
        >
          <MoreVertIcon fontSize="small" />
        </IconButton>
      </Box>

      {card.desc && (
        <Typography variant="caption" color="textSecondary" sx={{ mt: 1, display: 'block' }}>
          {card.desc}
        </Typography>
      )}

      <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        {card.labels && card.labels.length > 0 && (
          <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
            {card.labels.map((labelId) => (
              <Chip
                key={labelId}
                label=""
                size="small"
                sx={{
                  height: '6px',
                  width: '40px',
                  backgroundColor: getLabelColor(labelId),
                  '& .MuiChip-label': {
                    display: 'none',
                  },
                }}
              />
            ))}
          </Box>
        )}

        {card.members && card.members.length > 0 && (
          <AvatarGroup
            max={3}
            sx={{ '& .MuiAvatar-root': { width: 24, height: 24, fontSize: 12 } }}
          >
            {card.members.map((memberId) => {
              const member = availableMembers.find((m) => m.id === memberId);
              return (
                <Avatar
                  key={memberId}
                  src={member?.avatar}
                  alt={member?.name || memberId}
                  sx={{ bgcolor: '#026AA7' }}
                >
                  {member?.name.charAt(0) || memberId.charAt(0)}
                </Avatar>
              );
            })}
          </AvatarGroup>
        )}
      </Box>

      {card.due && (
        <Box sx={{ mt: 1 }}>
          <Chip
            size="small"
            label={new Date(card.due).toLocaleDateString()}
            sx={{ fontSize: '0.75rem' }}
          />
        </Box>
      )}

      {/* Menu d'options */}
      <Menu
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
            minWidth: 180,
            boxShadow: '0px 2px 8px rgba(0,0,0,0.15)',
            zIndex: 9999,
          },
        }}
      >
        <MenuItem
          onClick={() => {
            handleMenuClose();
            setEditDialogOpen(true);
          }}
        >
          <ListItemIcon>
            <EditIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Modifier la carte</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleMemberDialogOpen}>
          <ListItemIcon>
            <PersonIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Assigner des membres</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleLabelDialogOpen}>
          <ListItemIcon>
            <LabelIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Ajouter des étiquettes</ListItemText>
        </MenuItem>
        <Divider />
        <MenuItem
          onClick={() => {
            handleMenuClose();
            setDeleteDialogOpen(true);
          }}
          sx={{ color: 'error.main' }}
        >
          <ListItemIcon>
            <DeleteIcon fontSize="small" sx={{ color: 'error.main' }} />
          </ListItemIcon>
          <ListItemText>Supprimer</ListItemText>
        </MenuItem>
      </Menu>

      {/* Dialog pour modifier la carte */}
      <Dialog
        open={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
        onClick={(e) => e.stopPropagation()}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Modifier la carte</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Titre de la carte"
            fullWidth
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            label="Description"
            fullWidth
            multiline
            rows={4}
            value={editDesc}
            onChange={(e) => setEditDesc(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>Annuler</Button>
          <Button
            onClick={async () => {
              if (onEditCard && editName.trim()) {
                await onEditCard(card.id, editName.trim(), editDesc.trim());
                setEditDialogOpen(false);
              }
            }}
            variant="contained"
          >
            Enregistrer
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog de confirmation de suppression */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onClick={(e) => e.stopPropagation()}
      >
        <DialogTitle>Supprimer la carte</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Êtes-vous sûr de vouloir supprimer cette carte ? Cette action est irréversible.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Annuler</Button>
          <Button
            onClick={async () => {
              if (onDeleteCard) {
                await onDeleteCard(card.id);
                setDeleteDialogOpen(false);
              }
            }}
            color="error"
            variant="contained"
          >
            Supprimer
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog pour assigner des membres */}
      <Dialog
        open={memberDialogOpen}
        onClose={() => setMemberDialogOpen(false)}
        onClick={(e) => e.stopPropagation()}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Assigner des membres</DialogTitle>
        <DialogContent>
          <List>
            {availableMembers.map((member) => (
              <ListItem key={member.id} dense button onClick={() => handleMemberChange(member.id)}>
                <ListItemIcon>
                  <Checkbox
                    edge="start"
                    checked={card.members?.includes(member.id) || false}
                    tabIndex={-1}
                    disableRipple
                  />
                </ListItemIcon>
                <ListItemText primary={member.name} primaryTypographyProps={{ variant: 'body2' }} />
                <Avatar
                  src={member.avatar}
                  sx={{ width: 24, height: 24, ml: 2, bgcolor: '#026AA7' }}
                >
                  {member.name.charAt(0)}
                </Avatar>
              </ListItem>
            ))}
            {availableMembers.length === 0 && (
              <ListItem>
                <ListItemText primary="Aucun membre disponible" />
              </ListItem>
            )}
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setMemberDialogOpen(false)}>Fermer</Button>
        </DialogActions>
      </Dialog>

      {/* Dialog pour ajouter des étiquettes */}
      <Dialog
        open={labelDialogOpen}
        onClose={() => setLabelDialogOpen(false)}
        onClick={(e) => e.stopPropagation()}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Ajouter des étiquettes</DialogTitle>
        <DialogContent>
          <List>
            {availableLabels.map((label) => (
              <ListItem key={label.id} dense button onClick={() => handleLabelChange(label.id)}>
                <ListItemIcon>
                  <Checkbox
                    edge="start"
                    checked={card.labels?.includes(label.id) || false}
                    tabIndex={-1}
                    disableRipple
                  />
                </ListItemIcon>
                <Box
                  sx={{
                    width: '36px',
                    height: '24px',
                    borderRadius: '3px',
                    backgroundColor: label.color,
                    mr: 2,
                  }}
                />
                <ListItemText primary={label.name} primaryTypographyProps={{ variant: 'body2' }} />
              </ListItem>
            ))}
            {availableLabels.length === 0 && (
              <ListItem>
                <ListItemText primary="Aucune étiquette disponible" />
              </ListItem>
            )}
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setLabelDialogOpen(false)}>Fermer</Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default TaskCard;
