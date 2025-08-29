import React, { useState } from 'react';
import { TextField, Button, Box } from '@mui/material';

interface ListFormProps {
  onSubmit: (title: string) => void;
  onCancel: () => void;
}

const ListForm: React.FC<ListFormProps> = ({ onSubmit, onCancel }) => {
  const [title, setTitle] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(title);
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
      <TextField
        fullWidth
        label="Titre de la liste"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
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

export default ListForm;

export {};
