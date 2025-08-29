import React, { useState } from 'react';
import { TextField, Button, Box } from '@mui/material';
import { CardCreate } from '../../types/card';

interface CardFormProps {
  onSubmit: (data: CardCreate) => void;
  onCancel: () => void;
  listId: string;
  boardId: string;
}

const CardForm: React.FC<CardFormProps> = ({ onSubmit, onCancel, listId, boardId }) => {
  const [name, setName] = useState('');
  const [desc, setDesc] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      name,
      desc,
      listId,
      boardId,
    });
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
      <TextField
        fullWidth
        label="Nom de la carte"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
        sx={{ mb: 2 }}
      />
      <TextField
        fullWidth
        label="Description"
        value={desc}
        onChange={(e) => setDesc(e.target.value)}
        multiline
        rows={3}
        sx={{ mb: 2 }}
      />
      <Box sx={{ display: 'flex', gap: 1 }}>
        <Button type="submit" variant="contained" color="primary">
          Créer
        </Button>
        <Button onClick={onCancel} variant="outlined">
          Annuler
        </Button>
      </Box>
    </Box>
  );
};

export default CardForm;

export {};
