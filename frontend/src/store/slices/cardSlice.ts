import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  cards: [],
  loading: false,
  error: null,
};

const cardSlice = createSlice({
  name: 'card',
  initialState,
  reducers: {},
});

export default cardSlice.reducer;
