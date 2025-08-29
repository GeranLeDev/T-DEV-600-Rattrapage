import {
  Box,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  Stack,
  Paper,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../hooks/useTheme';
import {
  Speed as SpeedIcon,
  Security as SecurityIcon,
  Devices as DevicesIcon,
  Group as GroupIcon,
  ViewKanban as ViewKanbanIcon,
  Timeline as TimelineIcon,
  Assignment as AssignmentIcon,
  CheckCircle as CheckCircleIcon,
} from '@mui/icons-material';
import React from 'react';

export const Home = () => {
  const navigate = useNavigate();
  const { colors, shadows, spacing } = useTheme();

  const features = [
    {
      icon: <SpeedIcon />,
      title: 'Performance',
      description: 'Interface rapide et réactive pour une productivité optimale',
    },
    {
      icon: <SecurityIcon />,
      title: 'Sécurité',
      description: 'Protection des données et confidentialité assurée',
    },
    {
      icon: <DevicesIcon />,
      title: 'Multi-plateforme',
      description: 'Accessible sur tous vos appareils',
    },
  ];

  const benefits = [
    'Gestion de projet simplifiée',
    'Collaboration en temps réel',
    'Suivi des tâches efficace',
    'Organisation visuelle intuitive',
    'Personnalisation avancée',
    'Intégration avec vos outils favoris',
  ];

  return (
    <Box sx={{ p: spacing.lg }}>
      {/* Section Hero */}
      <Box sx={{ textAlign: 'center', mb: Number(spacing.xl) * 2 }}>
        <Typography
          variant="h2"
          component="h1"
          sx={{
            color: colors.text,
            mb: spacing.md,
            fontWeight: 'bold',
          }}
        >
          Bienvenue sur Trello Clone
        </Typography>
        <Typography
          variant="h5"
          sx={{
            color: colors.textSecondary,
            mb: spacing.lg,
            maxWidth: '800px',
            mx: 'auto',
          }}
        >
          Organisez vos projets et collaborez avec votre équipe de manière efficace et intuitive
        </Typography>
        <Button
          variant="contained"
          size="large"
          onClick={() => navigate('/workspaces')}
          sx={{
            bgcolor: colors.primary,
            '&:hover': { bgcolor: colors.secondary },
            px: spacing.xl,
            py: spacing.md,
          }}
        >
          COMMENCER
        </Button>
      </Box>

      {/* Section Principales Fonctionnalités */}
      <Grid container spacing={spacing.lg} sx={{ mb: Number(spacing.xl) * 2 }}>
        <Grid item xs={12} md={4}>
          <Card
            sx={{
              height: '100%',
              bgcolor: colors.card,
              boxShadow: shadows.card,
              transition: 'transform 0.2s',
              '&:hover': {
                transform: 'translateY(-4px)',
              },
            }}
          >
            <CardContent>
              <ViewKanbanIcon sx={{ fontSize: 40, color: colors.primary, mb: 2 }} />
              <Typography variant="h5" sx={{ color: colors.text, mb: spacing.md }}>
                Créez des Workspaces
              </Typography>
              <Typography sx={{ color: colors.textSecondary }}>
                Organisez vos projets en workspaces distincts pour une meilleure gestion et une
                collaboration optimale
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card
            sx={{
              height: '100%',
              bgcolor: colors.card,
              boxShadow: shadows.card,
              transition: 'transform 0.2s',
              '&:hover': {
                transform: 'translateY(-4px)',
              },
            }}
          >
            <CardContent>
              <TimelineIcon sx={{ fontSize: 40, color: colors.primary, mb: 2 }} />
              <Typography variant="h5" sx={{ color: colors.text, mb: spacing.md }}>
                Gérez vos Tableaux
              </Typography>
              <Typography sx={{ color: colors.textSecondary }}>
                Créez et organisez vos tableaux Kanban pour suivre vos tâches et projets
                efficacement
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card
            sx={{
              height: '100%',
              bgcolor: colors.card,
              boxShadow: shadows.card,
              transition: 'transform 0.2s',
              '&:hover': {
                transform: 'translateY(-4px)',
              },
            }}
          >
            <CardContent>
              <GroupIcon sx={{ fontSize: 40, color: colors.primary, mb: 2 }} />
              <Typography variant="h5" sx={{ color: colors.text, mb: spacing.md }}>
                Collaborez en Équipe
              </Typography>
              <Typography sx={{ color: colors.textSecondary }}>
                Invitez des membres, assignez des tâches et travaillez ensemble sur vos projets
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Section Caractéristiques */}
      <Box sx={{ mb: Number(spacing.xl) * 2, mt: Number(spacing.xl) * 2 }}>
        <Typography
          variant="h3"
          sx={{
            color: colors.text,
            mb: spacing.xl,
            textAlign: 'center',
            fontWeight: 'bold',
          }}
        >
          Caractéristiques Principales
        </Typography>
        <Grid container spacing={spacing.lg}>
          {features.map((feature, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Paper
                sx={{
                  p: spacing.lg,
                  bgcolor: colors.card,
                  boxShadow: shadows.card,
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                  transition: 'transform 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                  },
                }}
              >
                <Box sx={{ color: colors.primary, mb: spacing.md }}>
                  {React.cloneElement(feature.icon, { sx: { fontSize: 48 } })}
                </Box>
                <Typography variant="h6" sx={{ color: colors.text, mb: spacing.sm }}>
                  {feature.title}
                </Typography>
                <Typography sx={{ color: colors.textSecondary }}>{feature.description}</Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Section Avantages */}
      <Box sx={{ mb: Number(spacing.xl) * 2, mt: Number(spacing.xl) * 4 }}>
        <Typography
          variant="h3"
          sx={{
            color: colors.text,
            mb: spacing.xl,
            textAlign: 'center',
            fontWeight: 'bold',
            mt: 8,
          }}
        >
          Pourquoi Choisir Trello Clone ?
        </Typography>
        <Box
          sx={{
            maxWidth: '1000px',
            mx: 'auto',
            px: spacing.xl,
          }}
        >
          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <Paper
                sx={{
                  p: spacing.lg,
                  bgcolor: colors.card,
                  boxShadow: shadows.card,
                }}
              >
                <List>
                  {benefits.slice(0, 3).map((benefit, index) => (
                    <ListItem
                      key={index}
                      sx={{
                        py: 2,
                        '&:hover': {
                          bgcolor: 'rgba(0, 0, 0, 0.04)',
                        },
                      }}
                    >
                      <ListItemIcon>
                        <CheckCircleIcon sx={{ color: colors.primary, fontSize: 28 }} />
                      </ListItemIcon>
                      <ListItemText
                        primary={benefit}
                        sx={{
                          '& .MuiListItemText-primary': {
                            color: colors.text,
                            fontWeight: 500,
                            fontSize: '1.1rem',
                          },
                        }}
                      />
                    </ListItem>
                  ))}
                </List>
              </Paper>
            </Grid>
            <Grid item xs={12} md={6}>
              <Paper
                sx={{
                  p: spacing.lg,
                  bgcolor: colors.card,
                  boxShadow: shadows.card,
                }}
              >
                <List>
                  {benefits.slice(3).map((benefit, index) => (
                    <ListItem
                      key={index}
                      sx={{
                        py: 2,
                        '&:hover': {
                          bgcolor: 'rgba(0, 0, 0, 0.04)',
                        },
                      }}
                    >
                      <ListItemIcon>
                        <CheckCircleIcon sx={{ color: colors.primary, fontSize: 28 }} />
                      </ListItemIcon>
                      <ListItemText
                        primary={benefit}
                        sx={{
                          '& .MuiListItemText-primary': {
                            color: colors.text,
                            fontWeight: 500,
                            fontSize: '1.1rem',
                          },
                        }}
                      />
                    </ListItem>
                  ))}
                </List>
              </Paper>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Box>
  );
};

export default Home;
