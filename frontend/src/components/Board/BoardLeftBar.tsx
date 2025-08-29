import React, { useState } from 'react';
import {
  Box,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
  Divider,
  Collapse,
  IconButton,
  Avatar,
  AvatarGroup,
  Chip,
  TextField,
  Button,
} from '@mui/material';
import {
  TableChart as TableChartIcon,
  Star as StarIcon,
  Person as PersonIcon,
  ViewList as ViewListIcon,
  ExpandLess,
  ExpandMore,
  Label as LabelIcon,
  AccessTime as AccessTimeIcon,
  Description as DescriptionIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Save as SaveIcon,
} from '@mui/icons-material';
import { useTheme } from '../../hooks/useTheme';

interface BoardLeftBarProps {
  boardName: string;
  workspaceName?: string;
  description?: string;
  members?: { id: string; name: string; avatar?: string }[];
  lists?: { id: string; name: string; cardCount: number }[];
  labels?: { id: string; name: string; color: string }[];
  onTemplateClick: () => void;
  onDescriptionUpdate?: (description: string) => Promise<void>;
}

const BoardLeftBar: React.FC<BoardLeftBarProps> = ({
  boardName,
  workspaceName,
  description = 'Ce tableau permet de gérer les tâches du projet',
  members = [],
  lists = [],
  labels = [],
  onTemplateClick,
  onDescriptionUpdate,
}) => {
  const { colors, spacing } = useTheme();
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    about: false,
    members: false,
    lists: false,
    labels: false,
  });
  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const [descriptionValue, setDescriptionValue] = useState(description);
  const [savingDescription, setSavingDescription] = useState(false);

  const toggleSection = (section: string) => {
    setOpenSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const handleDescriptionEdit = () => {
    setIsEditingDescription(true);
  };

  const handleDescriptionSave = async () => {
    if (onDescriptionUpdate) {
      setSavingDescription(true);
      try {
        await onDescriptionUpdate(descriptionValue);
        setIsEditingDescription(false);
      } catch (error) {
        // Gestion d'erreur si besoin
      } finally {
        setSavingDescription(false);
      }
    } else {
      setIsEditingDescription(false);
    }
  };

  const handleDescriptionCancel = () => {
    setDescriptionValue(description);
    setIsEditingDescription(false);
  };

  return (
    <Box
      sx={{
        width: 280,
        bgcolor: colors.card,
        borderRight: `1px solid ${colors.border}`,
        color: colors.text,
        height: '100%',
        p: spacing.md,
        overflowY: 'auto',
      }}
    >
      <Box sx={{ p: 2 }}>
        <Typography variant="h6" sx={{ color: colors.text }}>
          {boardName}
        </Typography>
        {workspaceName && (
          <Typography variant="body2" sx={{ color: colors.textSecondary }}>
            dans l'espace de travail {workspaceName}
          </Typography>
        )}
      </Box>
      <Divider />
      <List>
        {/* À propos */}
        <ListItem
          button
          onClick={() => toggleSection('about')}
          sx={{ '&:hover': { bgcolor: colors.hover } }}
        >
          <ListItemIcon sx={{ color: colors.text }}>
            <TableChartIcon />
          </ListItemIcon>
          <ListItemText primary="À propos de ce tableau" />
          {openSections.about ? <ExpandLess /> : <ExpandMore />}
        </ListItem>
        <Collapse in={openSections.about} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <ListItem sx={{ pl: 4, flexDirection: 'column', alignItems: 'flex-start' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', mb: 1 }}>
                <ListItemIcon sx={{ color: colors.text, minWidth: 30 }}>
                  <DescriptionIcon fontSize="small" />
                </ListItemIcon>
                <Typography variant="body2" fontWeight="medium">
                  Description
                </Typography>
                {!isEditingDescription && (
                  <Button
                    onClick={handleDescriptionEdit}
                    sx={{
                      ml: 'auto',
                      minWidth: 'auto',
                      p: 0.5,
                    }}
                  >
                    <EditIcon fontSize="small" sx={{ color: colors.textSecondary }} />
                  </Button>
                )}
              </Box>

              {isEditingDescription ? (
                <Box sx={{ width: '100%', pl: 3 }}>
                  <TextField
                    multiline
                    rows={3}
                    fullWidth
                    variant="outlined"
                    size="small"
                    value={descriptionValue}
                    onChange={(e) => setDescriptionValue(e.target.value)}
                    sx={{ mb: 1 }}
                  />
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={handleDescriptionCancel}
                      disabled={savingDescription}
                    >
                      Annuler
                    </Button>
                    <Button
                      variant="contained"
                      size="small"
                      onClick={handleDescriptionSave}
                      disabled={savingDescription}
                      startIcon={savingDescription ? null : <SaveIcon />}
                    >
                      {savingDescription ? 'Enregistrement...' : 'Enregistrer'}
                    </Button>
                  </Box>
                </Box>
              ) : (
                <Typography
                  variant="body2"
                  sx={{
                    color: colors.textSecondary,
                    pl: 3,
                    pr: 1,
                    whiteSpace: 'pre-wrap',
                  }}
                >
                  {descriptionValue || 'Aucune description'}
                </Typography>
              )}
            </ListItem>
          </List>
        </Collapse>

        {/* Favoris */}
        <ListItem button sx={{ '&:hover': { bgcolor: colors.hover } }}>
          <ListItemIcon sx={{ color: colors.text }}>
            <StarIcon />
          </ListItemIcon>
          <ListItemText primary="Favoris" />
        </ListItem>

        <Divider sx={{ borderColor: colors.border, my: 2 }} />

        {/* Membres */}
        <ListItem
          button
          onClick={() => toggleSection('members')}
          sx={{ '&:hover': { bgcolor: colors.hover } }}
        >
          <ListItemIcon sx={{ color: colors.text }}>
            <PersonIcon />
          </ListItemIcon>
          <ListItemText primary="Membres" />
          {openSections.members ? <ExpandLess /> : <ExpandMore />}
        </ListItem>
        <Collapse in={openSections.members} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <ListItem sx={{ pl: 4 }}>
              <AvatarGroup max={5} sx={{ justifyContent: 'flex-start' }}>
                {members.map((member) => (
                  <Avatar
                    key={member.id}
                    src={member.avatar}
                    alt={member.name}
                    sx={{ width: 32, height: 32 }}
                  >
                    {member.name.charAt(0)}
                  </Avatar>
                ))}
              </AvatarGroup>
            </ListItem>
          </List>
        </Collapse>

        {/* Listes */}
        <ListItem
          button
          onClick={() => toggleSection('lists')}
          sx={{ '&:hover': { bgcolor: colors.hover } }}
        >
          <ListItemIcon sx={{ color: colors.text }}>
            <ViewListIcon />
          </ListItemIcon>
          <ListItemText primary="Listes" />
          {openSections.lists ? <ExpandLess /> : <ExpandMore />}
        </ListItem>
        <Collapse in={openSections.lists} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            {lists.map((list) => (
              <ListItem key={list.id} sx={{ pl: 4 }}>
                <ListItemText
                  primary={list.name}
                  secondary={`${list.cardCount} cartes`}
                  sx={{ '& .MuiListItemText-secondary': { color: colors.textSecondary } }}
                />
              </ListItem>
            ))}
          </List>
        </Collapse>

        {/* Étiquettes */}
        <ListItem
          button
          onClick={() => toggleSection('labels')}
          sx={{ '&:hover': { bgcolor: colors.hover } }}
        >
          <ListItemIcon sx={{ color: colors.text }}>
            <LabelIcon />
          </ListItemIcon>
          <ListItemText primary="Étiquettes" />
          {openSections.labels ? <ExpandLess /> : <ExpandMore />}
        </ListItem>
        <Collapse in={openSections.labels} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            {labels.map((label) => (
              <ListItem key={label.id} sx={{ pl: 4 }}>
                <Chip
                  label={label.name}
                  size="small"
                  sx={{
                    bgcolor: label.color,
                    color: '#fff',
                    width: '100%',
                    justifyContent: 'flex-start',
                  }}
                />
              </ListItem>
            ))}
          </List>
        </Collapse>

        {/* Créer un tableau à partir d'un template */}
        <ListItem button onClick={onTemplateClick}>
          <ListItemIcon>
            <AddIcon sx={{ color: colors.text }} />
          </ListItemIcon>
          <ListItemText primary="Créer un tableau à partir d'un template" />
        </ListItem>
      </List>
    </Box>
  );
};

export default BoardLeftBar;
