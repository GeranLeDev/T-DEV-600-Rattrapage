import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Typography,
  Grid,
  IconButton,
  Tooltip,
  Tabs,
  Tab,
  InputAdornment,
  Divider,
  Chip,
  Alert,
} from '@mui/material';
import { useTheme } from '../../hooks/useTheme';
import {
  Check as CheckIcon,
  Image as ImageIcon,
  Palette as PaletteIcon,
  Search as SearchIcon,
  FileUpload as FileUploadIcon,
  Collections as CollectionsIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
} from '@mui/icons-material';

interface CreateBoardDialogProps {
  open: boolean;
  onClose: () => void;
  onCreateBoard: (title: string, background: string) => Promise<void>;
  workspaceId: string;
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`background-tabpanel-${index}`}
      aria-labelledby={`background-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 2 }}>{children}</Box>}
    </div>
  );
}

const backgroundColors = [
  { color: 'blue', label: 'Bleu', displayColor: '#0079BF', trelloValue: 'blue' },
  { color: 'orange', label: 'Orange', displayColor: '#D29034', trelloValue: 'orange' },
  { color: 'green', label: 'Vert', displayColor: '#519839', trelloValue: 'green' },
  { color: 'red', label: 'Rouge', displayColor: '#B04632', trelloValue: 'red' },
  { color: 'purple', label: 'Violet', displayColor: '#89609E', trelloValue: 'purple' },
  { color: 'pink', label: 'Rose', displayColor: '#CD5A91', trelloValue: 'pink' },
  { color: 'lime', label: 'Vert clair', displayColor: '#4BBF6B', trelloValue: 'lime' },
  { color: 'sky', label: 'Bleu ciel', displayColor: '#00AECC', trelloValue: 'sky' },
  { color: 'grey', label: 'Gris', displayColor: '#838C91', trelloValue: 'grey' },
  { color: 'turquoise', label: 'Turquoise', displayColor: '#00C2E0', trelloValue: 'turquoise' },
  { color: 'yellow', label: 'Jaune', displayColor: '#F2D600', trelloValue: 'yellow' },
  { color: 'darkred', label: 'Rouge foncé', displayColor: '#A50000', trelloValue: 'darkred' },
  { color: 'darkgreen', label: 'Vert foncé', displayColor: '#006644', trelloValue: 'darkgreen' },
  { color: 'darkblue', label: 'Bleu foncé', displayColor: '#0747A6', trelloValue: 'darkblue' },
  { color: 'black', label: 'Noir', displayColor: '#172B4D', trelloValue: 'black' },
];

const backgroundImages = [
  {
    url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4',
    label: 'Montagnes enneigées',
  },
  {
    url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e',
    label: 'Plage tropicale',
  },
  {
    url: 'https://images.unsplash.com/photo-1511497584788-876760111969',
    label: 'Forêt brumeuse',
  },
  {
    url: 'https://images.unsplash.com/photo-1682685797828-d3b2561deef4',
    label: 'Désert au coucher du soleil',
  },
  {
    url: 'https://images.unsplash.com/photo-1483347756197-71ef80e95f73',
    label: 'Aurore boréale',
  },
  {
    url: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05',
    label: 'Ville de nuit',
  },
  {
    url: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470',
    label: 'Lac de montagne',
  },
  {
    url: 'https://images.unsplash.com/photo-1432405972618-c60b0225b8f9',
    label: 'Cascade',
  },
  {
    url: 'https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07',
    label: 'Champs de fleurs',
  },
  {
    url: 'https://images.unsplash.com/photo-1494500764479-0c8f2919a3d8',
    label: 'Ciel étoilé',
  },
  {
    url: 'https://images.unsplash.com/photo-1508739773434-c26b3d09e071',
    label: 'Aurore boréale verte',
  },
  {
    url: 'https://images.unsplash.com/photo-1536257104079-aa99c6460a5a',
    label: 'Fougères vertes',
  },
  {
    url: 'https://images.unsplash.com/photo-1513002749550-c59d786b8e6c',
    label: 'Montagne au lever du soleil',
  },
  {
    url: 'https://images.unsplash.com/photo-1534274988757-a28bf1a57c17',
    label: 'Vagues de sable',
  },
  {
    url: 'https://images.unsplash.com/photo-1526047932273-341f2a7631f9',
    label: 'Plantes tropicales',
  },
];

const trelloBackgrounds = [
  {
    url: 'https://trello-backgrounds.s3.amazonaws.com/SharedBackground/2560x1920/1c1477490e1ef4953c16bbf9089e2e22/photo-1606639421367-1837e82e7e24.jpg',
    label: 'Fond Trello 1',
  },
  {
    url: 'https://trello-backgrounds.s3.amazonaws.com/SharedBackground/2560x1707/59e53de7a3263aa712f2b170fb7e2e38/photo-1579546929662-711aa81148cf.jpg',
    label: 'Fond Trello 2',
  },
  {
    url: 'https://trello-backgrounds.s3.amazonaws.com/SharedBackground/2400x1600/8bfba7c9b57c8296921c084ff7a47c5d/photo-1576502200916-3808e07386a5.jpg',
    label: 'Fond Trello 3',
  },
  {
    url: 'https://trello-backgrounds.s3.amazonaws.com/SharedBackground/2400x1600/6a9d1e6ae33e9d8ee61d0b6e7636b401/photo-1485470733090-0aae1788d5af.jpg',
    label: 'Fond Trello 4',
  },
  {
    url: 'https://trello-backgrounds.s3.amazonaws.com/SharedBackground/2400x1600/56d899126c3ee92e5b808b9664db30df/photo-1600596542815-ffad4c1539a9.jpg',
    label: 'Fond Trello 5',
  },
];

// Catégories d'images
const imageCategories = [
  { name: 'Nature', icon: '🌿' },
  { name: 'Abstrait', icon: '🎨' },
  { name: 'Ville', icon: '🏙️' },
  { name: 'Océan', icon: '🌊' },
  { name: 'Espace', icon: '✨' },
  { name: 'Minimaliste', icon: '◾' },
];

// Tableau d'images compatibles avec l'API Trello
// Ces images sont celles que Trello supporte nativement
const trelloCompatibleImages = [
  'https://trello-backgrounds.s3.amazonaws.com/SharedBackground/2560x1920/1c1477490e1ef4953c16bbf9089e2e22/photo-1606639421367-1837e82e7e24.jpg',
  'https://trello-backgrounds.s3.amazonaws.com/SharedBackground/2560x1707/59e53de7a3263aa712f2b170fb7e2e38/photo-1579546929662-711aa81148cf.jpg',
  'https://trello-backgrounds.s3.amazonaws.com/SharedBackground/2400x1600/8bfba7c9b57c8296921c084ff7a47c5d/photo-1576502200916-3808e07386a5.jpg',
  'https://trello-backgrounds.s3.amazonaws.com/SharedBackground/2400x1600/6a9d1e6ae33e9d8ee61d0b6e7636b401/photo-1485470733090-0aae1788d5af.jpg',
  'https://trello-backgrounds.s3.amazonaws.com/SharedBackground/2400x1600/56d899126c3ee92e5b808b9664db30df/photo-1600596542815-ffad4c1539a9.jpg',
];

export const CreateBoardDialog: React.FC<CreateBoardDialogProps> = ({
  open,
  onClose,
  onCreateBoard,
  workspaceId,
}) => {
  const { colors } = useTheme();
  const [title, setTitle] = useState('');
  const [selectedBackground, setSelectedBackground] = useState(backgroundColors[0].color);
  const [error, setError] = useState('');
  const [tabValue, setTabValue] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const imagesPerPage = 9;
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [showTrelloWarning, setShowTrelloWarning] = useState(false);

  // Combiner toutes les images disponibles
  const allImages = [...backgroundImages, ...trelloBackgrounds];

  // Filtrer par catégorie si une catégorie est sélectionnée
  const filteredImages = selectedCategory
    ? allImages.filter(
        (_, index) =>
          index % imageCategories.length ===
          imageCategories.findIndex((cat) => cat.name === selectedCategory)
      )
    : allImages;

  // Calculer les images à afficher pour la page actuelle
  const displayedImages = filteredImages.slice(
    currentPage * imagesPerPage,
    (currentPage + 1) * imagesPerPage
  );

  // Calculer le nombre total de pages
  const totalPages = Math.ceil(filteredImages.length / imagesPerPage);

  // Vérifier si une image est compatible avec Trello
  const isImageTrelloCompatible = (imageUrl: string) => {
    return trelloCompatibleImages.includes(imageUrl) || imageUrl.includes('trello-backgrounds');
  };

  // Afficher l'avertissement après un court délai si une image non-Trello est sélectionnée
  useEffect(() => {
    if (selectedBackground.startsWith('http') && !isImageTrelloCompatible(selectedBackground)) {
      const timer = setTimeout(() => {
        setShowTrelloWarning(true);
      }, 500);
      return () => clearTimeout(timer);
    } else {
      setShowTrelloWarning(false);
    }
  }, [selectedBackground]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
    setCurrentPage(0);
    setSelectedCategory(null);
    setShowTrelloWarning(false);
    if (newValue === 0) {
      setSelectedBackground(backgroundColors[0].color);
    } else if (newValue === 1 && displayedImages.length > 0) {
      setSelectedBackground(displayedImages[0].url);
      if (!isImageTrelloCompatible(displayedImages[0].url)) {
        setShowTrelloWarning(true);
      }
    } else if (newValue === 2 && uploadedImage) {
      setSelectedBackground(uploadedImage);
      setShowTrelloWarning(true);
    }
  };

  const handlePageChange = (direction: 'prev' | 'next') => {
    if (direction === 'prev' && currentPage > 0) {
      setCurrentPage(currentPage - 1);
    } else if (direction === 'next' && currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handleCreate = async () => {
    if (!title.trim()) {
      setError('Le titre est requis');
      return;
    }

    try {
      // Récupérer la valeur Trello si c'est une couleur
      const colorOption = backgroundColors.find((option) => option.color === selectedBackground);
      const trelloValue = colorOption?.trelloValue || selectedBackground;

      await onCreateBoard(title, trelloValue);
      setTitle('');
      setSelectedBackground(backgroundColors[0].color);
      setError('');
      onClose();
    } catch (err) {
      setError('Erreur lors de la création du tableau');
    }
  };

  const handleBackgroundSelect = (background: string) => {
    setSelectedBackground(background);

    // Montrer un avertissement si c'est une image non-compatible
    if (background.startsWith('http') && !isImageTrelloCompatible(background)) {
      setShowTrelloWarning(true);
    } else {
      setShowTrelloWarning(false);
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleSearch = () => {
    // Simulation d'une recherche - dans une vraie application, vous feriez un appel API ici
    console.log('Recherche:', searchQuery);
    // Pour la démo, afficher un message de mise en œuvre future
    setError("Recherche d'images non disponible dans cette démo");
    setTimeout(() => {
      setError('');
    }, 3000);
  };

  const handleCategorySelect = (category: string) => {
    if (selectedCategory === category) {
      setSelectedCategory(null);
    } else {
      setSelectedCategory(category);
      setCurrentPage(0);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsUploading(true);

      // Simuler un délai de chargement
      setTimeout(() => {
        const reader = new FileReader();
        reader.onload = (event) => {
          if (event.target?.result) {
            const imageUrl = event.target.result.toString();
            setUploadedImage(imageUrl);
            setSelectedBackground(imageUrl);
            setIsUploading(false);
          }
        };
        reader.readAsDataURL(file);
      }, 1000);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          bgcolor: colors.card,
          color: colors.text,
        },
      }}
    >
      <DialogTitle>Créer un tableau</DialogTitle>
      <DialogContent>
        <Box
          sx={{
            width: '100%',
            height: 150,
            mb: 2,
            borderRadius: 1,
            background:
              selectedBackground.startsWith('http') || selectedBackground.startsWith('data:')
                ? `url(${selectedBackground})`
                : backgroundColors.find((color) => color.color === selectedBackground)
                    ?.displayColor || selectedBackground,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
          }}
        >
          <TextField
            autoFocus
            placeholder="Ajouter un titre au tableau"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            variant="standard"
            sx={{
              width: '90%',
              '& input': {
                color: '#fff',
                fontSize: '1.2rem',
                textAlign: 'center',
                textShadow: '0 0 4px rgba(0,0,0,0.4)',
                '&::placeholder': {
                  color: 'rgba(255, 255, 255, 0.8)',
                  opacity: 1,
                },
              },
              '& .MuiInput-underline:before': {
                borderBottomColor: 'rgba(255, 255, 255, 0.5)',
              },
              '& .MuiInput-underline:hover:before': {
                borderBottomColor: 'rgba(255, 255, 255, 0.8)',
              },
            }}
          />
        </Box>

        {showTrelloWarning && (
          <Alert severity="info" sx={{ mb: 2 }}>
            Attention : L'API Trello peut ne pas supporter cette image. Une couleur par défaut
            pourrait être appliquée.
          </Alert>
        )}

        <Typography variant="subtitle2" sx={{ mb: 1 }}>
          Fond d'écran
        </Typography>

        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          sx={{
            borderBottom: 1,
            borderColor: 'divider',
            mb: 2,
          }}
        >
          <Tab icon={<PaletteIcon />} label="Couleurs" />
          <Tab icon={<ImageIcon />} label="Photos" />
          <Tab icon={<FileUploadIcon />} label="Personnalisé" />
        </Tabs>

        <TabPanel value={tabValue} index={0}>
          <Grid container spacing={1}>
            {backgroundColors.map((option) => (
              <Grid item key={option.color}>
                <Tooltip title={option.label}>
                  <IconButton
                    onClick={() => handleBackgroundSelect(option.color)}
                    sx={{
                      width: 40,
                      height: 40,
                      bgcolor: option.displayColor,
                      borderRadius: 1,
                      border: selectedBackground === option.color ? '2px solid white' : 'none',
                      '&:hover': {
                        opacity: 0.8,
                      },
                    }}
                  >
                    {selectedBackground === option.color && <CheckIcon sx={{ color: '#fff' }} />}
                  </IconButton>
                </Tooltip>
              </Grid>
            ))}
          </Grid>
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          {/* Catégories d'images */}
          <Box sx={{ mb: 2, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {imageCategories.map((category) => (
              <Chip
                key={category.name}
                label={`${category.icon} ${category.name}`}
                onClick={() => handleCategorySelect(category.name)}
                color={selectedCategory === category.name ? 'primary' : 'default'}
                sx={{ borderRadius: '16px' }}
              />
            ))}
          </Box>

          {/* Grille d'images */}
          <Grid container spacing={1}>
            {displayedImages.map((image) => (
              <Grid item key={image.url} xs={4}>
                <Tooltip
                  title={`${image.label}${
                    isImageTrelloCompatible(image.url) ? ' (Compatible Trello)' : ''
                  }`}
                >
                  <Box
                    onClick={() => handleBackgroundSelect(image.url)}
                    sx={{
                      width: '100%',
                      paddingTop: '56.25%', // Ratio 16:9
                      backgroundImage: `url(${image.url})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      borderRadius: 1,
                      cursor: 'pointer',
                      position: 'relative',
                      border: selectedBackground === image.url ? '2px solid white' : 'none',
                      '&:hover': {
                        opacity: 0.8,
                      },
                      // Ajouter un indicateur visuel pour les images Trello
                      ...(isImageTrelloCompatible(image.url) && {
                        '&::after': {
                          content: '""',
                          position: 'absolute',
                          top: 5,
                          right: 5,
                          width: 20,
                          height: 20,
                          backgroundColor: '#61BD4F',
                          borderRadius: '50%',
                          zIndex: 1,
                          border: '2px solid white',
                        },
                      }),
                    }}
                  >
                    {selectedBackground === image.url && (
                      <Box
                        sx={{
                          position: 'absolute',
                          top: '50%',
                          left: '50%',
                          transform: 'translate(-50%, -50%)',
                        }}
                      >
                        <CheckIcon sx={{ color: '#fff', fontSize: 24 }} />
                      </Box>
                    )}
                  </Box>
                </Tooltip>
              </Grid>
            ))}
          </Grid>

          {/* Pagination pour les images */}
          {totalPages > 1 && (
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
              <Button
                onClick={() => handlePageChange('prev')}
                disabled={currentPage === 0}
                startIcon={<ChevronLeftIcon />}
              >
                Précédent
              </Button>
              <Typography variant="body2">
                Page {currentPage + 1} sur {totalPages}
              </Typography>
              <Button
                onClick={() => handlePageChange('next')}
                disabled={currentPage === totalPages - 1}
                endIcon={<ChevronRightIcon />}
              >
                Suivant
              </Button>
            </Box>
          )}
        </TabPanel>

        <TabPanel value={tabValue} index={2}>
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle2" gutterBottom>
              Rechercher des images
            </Typography>
            <TextField
              fullWidth
              placeholder="Rechercher des images..."
              value={searchQuery}
              onChange={handleSearchChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <Button onClick={handleSearch} size="small">
                      Rechercher
                    </Button>
                  </InputAdornment>
                ),
              }}
              sx={{ mb: 2 }}
            />
          </Box>

          <Alert severity="warning" sx={{ mb: 2 }}>
            Note : L'API Trello nécessite des images hébergées sur leurs serveurs. Les images
            personnalisées peuvent ne pas être appliquées correctement.
          </Alert>

          <Divider sx={{ my: 2 }} />

          <Box>
            <Typography variant="subtitle2" gutterBottom>
              Télécharger une image
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Box
                sx={{
                  border: `2px dashed ${colors.border}`,
                  borderRadius: 1,
                  p: 3,
                  mb: 2,
                  width: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  cursor: 'pointer',
                  bgcolor: colors.hover,
                  ...(uploadedImage && {
                    backgroundImage: `url(${uploadedImage})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    height: 150,
                  }),
                }}
                component="label"
              >
                {!uploadedImage && (
                  <>
                    <FileUploadIcon sx={{ fontSize: 48, color: colors.textSecondary, mb: 1 }} />
                    <Typography variant="body2" color="textSecondary">
                      Glissez une image ou cliquez pour parcourir
                    </Typography>
                  </>
                )}
                <input type="file" accept="image/*" hidden onChange={handleFileUpload} />
              </Box>
              {isUploading && (
                <Typography variant="body2" color="primary">
                  Téléchargement en cours...
                </Typography>
              )}
              {uploadedImage && (
                <Button
                  onClick={() => {
                    setUploadedImage(null);
                    setSelectedBackground(backgroundColors[0].color);
                    setShowTrelloWarning(false);
                  }}
                  color="error"
                  size="small"
                >
                  Supprimer l'image
                </Button>
              )}
            </Box>
          </Box>
        </TabPanel>

        {error && (
          <Typography color="error" sx={{ mt: 2 }}>
            {error}
          </Typography>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} sx={{ color: colors.textSecondary }}>
          Annuler
        </Button>
        <Button
          onClick={handleCreate}
          variant="contained"
          sx={{
            bgcolor: colors.primary,
            '&:hover': { bgcolor: colors.secondary },
          }}
        >
          Créer
        </Button>
      </DialogActions>
    </Dialog>
  );
};
