import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
} from '@mui/material';
import { useTheme } from '../../hooks/useTheme';
import { templateService } from '../../services/templateService';

interface TemplateSelectorProps {
  open: boolean;
  onClose: () => void;
  onSelectTemplate: (templateId: string) => void;
  workspaceId: string;
}

const defaultTemplates = [
  {
    id: 'project-management',
    name: 'Gestion de Projet',
    description: 'Template idéal pour suivre les projets de A à Z',
    image:
      'https://trello.com/1/cards/65f2d8b9c2f8a6a3b3b3b3b3/attachments/65f2d8b9c2f8a6a3b3b3b3b4/previews/65f2d8b9c2f8a6a3b3b3b3b5/download/project-management.png',
  },
  {
    id: 'kanban-board',
    name: 'Tableau Kanban',
    description: 'Organisez vos tâches avec la méthode Kanban',
    image:
      'https://trello.com/1/cards/65f2d8b9c2f8a6a3b3b3b3b3/attachments/65f2d8b9c2f8a6a3b3b3b3b4/previews/65f2d8b9c2f8a6a3b3b3b3b5/download/kanban.png',
  },
  {
    id: 'sprint-planning',
    name: 'Planification de Sprint',
    description: 'Gérez vos sprints agile efficacement',
    image:
      'https://trello.com/1/cards/65f2d8b9c2f8a6a3b3b3b3b3/attachments/65f2d8b9c2f8a6a3b3b3b3b4/previews/65f2d8b9c2f8a6a3b3b3b3b5/download/sprint.png',
  },
];

export const TemplateSelector: React.FC<TemplateSelectorProps> = ({
  open,
  onClose,
  onSelectTemplate,
  workspaceId,
}) => {
  const { colors, shadows } = useTheme();
  const [templates, setTemplates] = React.useState(defaultTemplates);
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    const fetchTemplates = async () => {
      setLoading(true);
      try {
        const fetchedTemplates = await templateService.getAll();
        setTemplates(fetchedTemplates);
      } catch (error) {
        console.error('Erreur lors de la récupération des templates:', error);
      } finally {
        setLoading(false);
      }
    };

    if (open) {
      fetchTemplates();
    }
  }, [open]);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          bgcolor: colors.card,
          color: colors.text,
        },
      }}
    >
      <DialogTitle>Choisir un template</DialogTitle>
      <DialogContent>
        <Grid container spacing={3}>
          {templates.map((template) => (
            <Grid item xs={12} sm={6} md={4} key={template.id}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  cursor: 'pointer',
                  bgcolor: colors.card,
                  boxShadow: shadows.card,
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    transition: 'transform 0.2s ease-in-out',
                  },
                }}
                onClick={() => onSelectTemplate(template.id)}
              >
                <CardMedia
                  component="img"
                  height="140"
                  image={template.image}
                  alt={template.name}
                  sx={{ objectFit: 'cover' }}
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography gutterBottom variant="h6" component="h2">
                    {template.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {template.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="inherit">
          Annuler
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default TemplateSelector;
