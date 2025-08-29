import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  CircularProgress,
  IconButton,
  Menu,
  MenuItem,
  Tooltip,
  Paper,
  Alert,
} from '@mui/material';
import {
  Add as AddIcon,
  MoreVert as MoreVertIcon,
  Star as StarIcon,
  StarBorder as StarBorderIcon,
  ChevronLeft as ChevronLeftIcon,
  Close as CloseIcon,
} from '@mui/icons-material';
import { api } from '../../services/api';
import { Board } from '../../types/board';
import { List } from '../../types/list';
import { Card } from '../../types/card';
import { cardService } from '../../services/cardService';
import { ListCard } from '../../components/List/ListCard';
import BoardLeftBar from '../../components/Board/BoardLeftBar';
import { BOARD_STYLES } from './BoardStyles';
import { boardService } from '../../services/boardService';
import { listService } from '../../services/listService';
import { templateService } from '../../services/templateService';
import { TemplateSelector } from '../../components/Board/TemplateSelector';

const BoardPage: React.FC = () => {
  const { boardId } = useParams<{ boardId: string }>();
  const [board, setBoard] = useState<Board | null>(null);
  const [lists, setLists] = useState<List[]>([]);
  const [cards, setCards] = useState<Card[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [showListForm, setShowListForm] = useState(false);
  const [showLeftBar, setShowLeftBar] = useState(true);
  const [showCardForm, setShowCardForm] = useState<string | null>(null);
  const [showTemplateSelector, setShowTemplateSelector] = useState(false);
  const [boardMembers, setBoardMembers] = useState<{ id: string; name: string; avatar?: string }[]>(
    []
  );
  const [boardLabels, setBoardLabels] = useState<{ id: string; name: string; color: string }[]>([]);

  useEffect(() => {
    const fetchBoardData = async () => {
      if (!boardId) {
        setError('ID du tableau non trouvé');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const [boardResponse, listsResponse] = await Promise.all([
          api.get(`/boards/${boardId}`, {
            params: {
              fields: 'id,name,desc,prefs,background',
            },
          }),
          api.get(`/boards/${boardId}/lists`, {
            params: {
              fields: 'id,name,pos,closed',
            },
          }),
        ]);

        // Récupération de la couleur de fond
        let background = '#026AA7'; // Couleur par défaut

        // Récupération de la couleur de fond dans l'ordre de priorité
        if (boardResponse.data.background) {
          background = boardResponse.data.background;
        } else if (boardResponse.data.prefs) {
          if (boardResponse.data.prefs.backgroundImage) {
            background = boardResponse.data.prefs.backgroundImage;
          } else if (boardResponse.data.prefs.background) {
            background = boardResponse.data.prefs.background;
          }
        }

        const boardData: Board = {
          id: boardResponse.data.id,
          name: boardResponse.data.name,
          description: boardResponse.data.desc || '',
          workspaceId: boardResponse.data.idOrganization,
          background: background,
        };

        const listsData: List[] = listsResponse.data
          .filter((list: any) => !list.closed)
          .map((list: any) => ({
            id: list.id,
            name: list.name,
            boardId: boardId,
            position: list.pos,
          }))
          .sort((a: List, b: List) => a.position - b.position);

        // Récupérer les cartes pour chaque liste
        const cardsData: Card[] = [];
        await Promise.all(
          listsData.map(async (list: List) => {
            try {
              const listCards = await cardService.getCardsByList(list.id);
              cardsData.push(...listCards);
            } catch (err) {
              cardsData.push(...[]);
            }
          })
        );

        setBoard(boardData);
        setLists(listsData);
        setCards(cardsData);
        setIsFavorite(boardResponse.data.prefs?.starred || false);
        setError(null);

        // Récupérer les membres du tableau
        try {
          const members = await boardService.getMembers(boardId);
          setBoardMembers(members);
        } catch (err) {
          setBoardMembers([]);
        }

        // Récupérer les étiquettes du tableau
        try {
          const labels = await boardService.getLabels(boardId);
          setBoardLabels(labels);
        } catch (err) {
          setBoardLabels([]);
        }
      } catch (err) {
        setError('Une erreur est survenue lors du chargement du tableau');
      } finally {
        setLoading(false);
      }
    };

    fetchBoardData();
  }, [boardId]);

  const handleCreateList = async (name: string) => {
    if (!boardId) return;

    try {
      const response = await api.post('/lists', {
        name,
        idBoard: boardId,
        pos: lists.length ? Math.max(...lists.map((list) => list.position)) + 16384 : 16384,
      });

      const newList: List = {
        id: response.data.id,
        name: response.data.name,
        boardId: boardId,
        position: response.data.pos,
      };

      setLists([...lists, newList]);
      setShowListForm(false);
    } catch (err) {
      console.error('Erreur lors de la création de la liste:', err);
      // Gérer l'erreur ici
    }
  };

  const handleCreateCard = async (listId: string, name: string) => {
    if (!boardId) return;

    try {
      const newCard = await cardService.create({
        name,
        listId,
        boardId,
      });

      setCards((prevCards) => [...prevCards, newCard]);
      setShowCardForm(null);
    } catch (err) {
      console.error('Erreur lors de la création de la carte:', err);
    }
  };

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const toggleFavorite = async () => {
    if (!board) return;
    try {
      const response = await api.put(`/boards/${board.id}/prefs/starred`, {
        value: !isFavorite,
      });

      if (response.data.starred !== undefined) {
        setIsFavorite(response.data.starred);
      }
    } catch (err) {
      console.error('Erreur lors de la mise à jour du favori:', err);
    }
  };

  const toggleLeftBar = () => {
    setShowLeftBar(!showLeftBar);
  };

  const handleCardClick = (cardId: string) => {
    // TODO: Implémenter l'ouverture de la modal de détails de la carte
    console.log('Carte cliquée:', cardId);
  };

  const handleTemplateSelect = async (templateId: string) => {
    if (!boardId) return;

    try {
      const {
        board: newBoard,
        lists: newLists,
        cards: newCards,
      } = await templateService.createBoardFromTemplate(
        templateId,
        boardId,
        board?.name || 'Nouveau tableau'
      );

      setBoard(newBoard);
      setLists(newLists);
      setCards(newCards);
      setShowTemplateSelector(false);
    } catch (err) {
      console.error('Erreur lors de la création du tableau à partir du template:', err);
    }
  };

  const handleUpdateList = async (listId: string, newName: string) => {
    try {
      // Appel du service pour mettre à jour le nom de la liste
      const updatedList = await listService.updateName(listId, newName);

      // Mise à jour du state
      setLists((prevLists) =>
        prevLists.map((list) => (list.id === listId ? { ...list, name: newName } : list))
      );
    } catch (err) {
      console.error('Erreur lors de la mise à jour de la liste:', err);
    }
  };

  const handleDeleteList = async (listId: string) => {
    try {
      // Appel du service pour supprimer la liste
      await listService.delete(listId);

      // Mise à jour du state
      setLists((prevLists) => prevLists.filter((list) => list.id !== listId));

      // Suppression des cartes associées
      setCards((prevCards) => prevCards.filter((card) => card.listId !== listId));
    } catch (err) {
      console.error('Erreur lors de la suppression de la liste:', err);
    }
  };

  // Ajout des fonctions pour gérer les membres et les étiquettes
  const handleAssignMember = async (cardId: string, memberId: string) => {
    try {
      await cardService.addMember(cardId, memberId);
      // Mettre à jour le state
      setCards((prevCards) =>
        prevCards.map((card) =>
          card.id === cardId ? { ...card, members: [...(card.members || []), memberId] } : card
        )
      );
    } catch (err) {
      console.error("Erreur lors de l'ajout du membre à la carte:", err);
    }
  };

  const handleRemoveMember = async (cardId: string, memberId: string) => {
    try {
      await cardService.removeMember(cardId, memberId);
      // Mettre à jour le state
      setCards((prevCards) =>
        prevCards.map((card) =>
          card.id === cardId
            ? { ...card, members: (card.members || []).filter((id) => id !== memberId) }
            : card
        )
      );
    } catch (err) {
      console.error('Erreur lors de la suppression du membre de la carte:', err);
    }
  };

  const handleAddLabel = async (cardId: string, labelId: string) => {
    try {
      // Dans un environnement réel, nous appellerions l'API
      // await cardService.addLabel(cardId, labelId);

      // Mettre à jour le state
      setCards((prevCards) =>
        prevCards.map((card) =>
          card.id === cardId ? { ...card, labels: [...(card.labels || []), labelId] } : card
        )
      );
    } catch (err) {
      console.error("Erreur lors de l'ajout de l'étiquette à la carte:", err);
    }
  };

  const handleRemoveLabel = async (cardId: string, labelId: string) => {
    try {
      // Dans un environnement réel, nous appellerions l'API
      // await cardService.removeLabel(cardId, labelId);

      // Mettre à jour le state
      setCards((prevCards) =>
        prevCards.map((card) =>
          card.id === cardId
            ? { ...card, labels: (card.labels || []).filter((id) => id !== labelId) }
            : card
        )
      );
    } catch (err) {
      console.error("Erreur lors de la suppression de l'étiquette de la carte:", err);
    }
  };

  // Ajout de la fonction pour mettre à jour la description du tableau
  const handleUpdateBoardDescription = async (newDescription: string) => {
    if (!boardId || !board) return;

    try {
      // Mise à jour de la description via le service
      const updatedBoard = await boardService.update(boardId, {
        ...board,
        description: newDescription,
      });

      // Mise à jour du state local
      setBoard((prev) => (prev ? { ...prev, description: newDescription } : null));
      return Promise.resolve();
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la description:', error);
      return Promise.reject(error);
    }
  };

  const handleUpdateCard = async (cardId: string, newName: string, newDesc?: string) => {
    try {
      const updatedCard = await cardService.update(cardId, {
        name: newName,
        desc: newDesc,
      });

      // Mettre à jour l'état local des cartes
      setCards((prevCards) =>
        prevCards.map((card) =>
          card.id === cardId ? { ...card, name: newName, desc: newDesc } : card
        )
      );

      // Afficher une notification de succès si vous en avez
      console.log('Carte mise à jour avec succès:', updatedCard);
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la carte:', error);
      // Gérer l'erreur (afficher une notification d'erreur par exemple)
    }
  };

  const handleDeleteCard = async (cardId: string) => {
    try {
      await cardService.delete(cardId);

      // Mettre à jour l'état local en retirant la carte supprimée
      setCards((prevCards) => prevCards.filter((card) => card.id !== cardId));

      // Afficher une notification de succès si vous en avez
      console.log('Carte supprimée avec succès');
    } catch (error) {
      console.error('Erreur lors de la suppression de la carte:', error);
      // Gérer l'erreur (afficher une notification d'erreur par exemple)
    }
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          bgcolor: BOARD_STYLES.background.overlay,
        }}
      >
        <CircularProgress sx={{ color: BOARD_STYLES.text.primary }} />
      </Box>
    );
  }

  if (error || !board) {
    return (
      <Box sx={{ p: BOARD_STYLES.spacing.md }}>
        <Alert severity="error">{error || 'Tableau non trouvé'}</Alert>
      </Box>
    );
  }

  const getBackgroundStyle = () => {
    if (!board?.background) {
      return {
        backgroundColor: '#026AA7',
      };
    }

    const bg = board.background;

    // Si c'est une URL d'image
    if (bg.startsWith('http')) {
      return {
        backgroundImage: `url(${bg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      };
    }

    // Mapping complet des couleurs Trello
    const colorMap: Record<string, string> = {
      blue: '#0079BF',
      orange: '#D29034',
      green: '#519839',
      red: '#B04632',
      purple: '#89609E',
      pink: '#CD5A91',
      lime: '#4BBF6B', // Vert clair
      sky: '#00AECC', // Bleu ciel
      grey: '#838C91',
    };

    // Si la couleur est déjà un code hexadécimal, on l'utilise directement
    // Sinon, on vérifie si c'est une couleur nommée dans notre mapping
    const isHexColor = /^#[0-9A-F]{6}$/i.test(bg);
    const mappedColor = isHexColor ? bg : colorMap[bg.toLowerCase()] || '#0079BF';

    return {
      backgroundColor: mappedColor,
    };
  };

  return (
    <Box
      sx={{
        height: '100vh',
        width: '100%',
        display: 'flex',
        position: 'fixed',
        top: 0,
        left: 0,
      }}
    >
      {showLeftBar && (
        <BoardLeftBar
          boardName={board.name}
          workspaceName="Mon espace de travail"
          description={board.description}
          members={boardMembers}
          lists={lists.map((list) => ({
            id: list.id,
            name: list.name,
            cardCount: cards.filter((card) => card.listId === list.id).length,
          }))}
          labels={boardLabels}
          onTemplateClick={() => setShowTemplateSelector(true)}
          onDescriptionUpdate={handleUpdateBoardDescription}
        />
      )}

      <Box
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          ...getBackgroundStyle(),
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.15)',
            pointerEvents: 'none',
            zIndex: 1,
          },
          '& > *': {
            position: 'relative',
            zIndex: 2,
          },
        }}
      >
        <Box
          sx={{
            p: BOARD_STYLES.spacing.md,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            bgcolor: BOARD_STYLES.background.overlay,
            backdropFilter: 'blur(4px)',
            color: BOARD_STYLES.text.primary,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: BOARD_STYLES.spacing.sm }}>
            <IconButton
              onClick={toggleLeftBar}
              sx={{
                color: BOARD_STYLES.text.primary,
                '&:hover': { bgcolor: BOARD_STYLES.background.hoverOverlay },
              }}
            >
              <ChevronLeftIcon />
            </IconButton>
            <Typography variant="h5">{board.name}</Typography>
            <Tooltip title={isFavorite ? 'Retirer des favoris' : 'Ajouter aux favoris'}>
              <IconButton
                size="small"
                onClick={toggleFavorite}
                sx={{ color: isFavorite ? BOARD_STYLES.icons.favorite : BOARD_STYLES.text.primary }}
              >
                {isFavorite ? <StarIcon /> : <StarBorderIcon />}
              </IconButton>
            </Tooltip>
          </Box>

          <Box sx={{ display: 'flex', gap: BOARD_STYLES.spacing.sm }}>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              sx={{
                bgcolor: BOARD_STYLES.background.buttonOverlay,
                color: BOARD_STYLES.text.primary,
                '&:hover': { bgcolor: BOARD_STYLES.background.buttonHoverOverlay },
              }}
            >
              Ajouter une liste
            </Button>
            <IconButton
              onClick={handleMenuClick}
              sx={{
                color: BOARD_STYLES.text.primary,
                '&:hover': { bgcolor: BOARD_STYLES.background.hoverOverlay },
              }}
            >
              <MoreVertIcon />
            </IconButton>
          </Box>
        </Box>

        <Box
          sx={{
            flex: 1,
            p: BOARD_STYLES.spacing.md,
            overflowX: 'auto',
            display: 'flex',
            gap: BOARD_STYLES.spacing.md,
            position: 'relative',
            zIndex: 1,
          }}
        >
          {lists.map((list) => (
            <ListCard
              key={list.id}
              list={list}
              cards={cards.filter((card) => card.listId === list.id)}
              onAddCard={() => setShowCardForm(list.id)}
              onCardClick={(card) => handleCardClick(card.id)}
              onUpdateList={handleUpdateList}
              onDeleteList={handleDeleteList}
              onCreateCard={handleCreateCard}
              onUpdateCard={handleUpdateCard}
              onDeleteCard={handleDeleteCard}
              showCardForm={showCardForm}
              setShowCardForm={setShowCardForm}
              availableMembers={boardMembers}
              availableLabels={boardLabels}
              onAssignMember={handleAssignMember}
              onRemoveMember={handleRemoveMember}
              onAddLabel={handleAddLabel}
              onRemoveLabel={handleRemoveLabel}
            />
          ))}

          {showListForm ? (
            <Paper
              sx={{
                width: 300,
                bgcolor: 'rgba(255, 255, 255, 0.8)',
                borderRadius: 1,
                p: 1,
              }}
            >
              <Box
                component="form"
                onSubmit={(e) => {
                  e.preventDefault();
                  const input = e.currentTarget.querySelector('input');
                  if (input?.value.trim()) {
                    handleCreateList(input.value.trim());
                  }
                }}
              >
                <input
                  type="text"
                  placeholder="Saisissez le titre de la liste..."
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
                    sx={{
                      bgcolor: '#0079BF',
                      '&:hover': { bgcolor: '#026AA7' },
                    }}
                  >
                    Ajouter la liste
                  </Button>
                  <IconButton
                    onClick={() => setShowListForm(false)}
                    sx={{ color: 'rgba(0, 0, 0, 0.5)' }}
                  >
                    <CloseIcon />
                  </IconButton>
                </Box>
              </Box>
            </Paper>
          ) : (
            <Box
              sx={{
                minWidth: 300,
                height: 'fit-content',
                mr: 2,
                p: 2,
                bgcolor: 'rgba(255, 255, 255, 0.3)',
                borderRadius: 1,
                cursor: 'pointer',
                color: BOARD_STYLES.text.primary,
                transition: 'background-color 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                '&:hover': {
                  bgcolor: 'rgba(255, 255, 255, 0.4)',
                },
              }}
              onClick={() => setShowListForm(true)}
            >
              <AddIcon />
              <Typography sx={{ fontWeight: 500 }}>Ajouter une liste</Typography>
            </Box>
          )}
        </Box>
      </Box>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        PaperProps={{
          sx: {
            bgcolor: BOARD_STYLES.background.menuOverlay,
            color: BOARD_STYLES.text.primary,
            backdropFilter: 'blur(4px)',
          },
        }}
      >
        <MenuItem
          onClick={handleMenuClose}
          sx={{ '&:hover': { bgcolor: BOARD_STYLES.background.hoverOverlay } }}
        >
          Paramètres du tableau
        </MenuItem>
        <MenuItem
          onClick={handleMenuClose}
          sx={{ '&:hover': { bgcolor: BOARD_STYLES.background.hoverOverlay } }}
        >
          Archiver le tableau
        </MenuItem>
        <MenuItem
          onClick={handleMenuClose}
          sx={{
            color: BOARD_STYLES.icons.delete,
            '&:hover': { bgcolor: BOARD_STYLES.background.hoverOverlay },
          }}
        >
          Supprimer le tableau
        </MenuItem>
      </Menu>

      <TemplateSelector
        open={showTemplateSelector}
        onClose={() => setShowTemplateSelector(false)}
        onSelectTemplate={handleTemplateSelect}
        workspaceId={board.workspaceId}
      />
    </Box>
  );
};

export default BoardPage;
