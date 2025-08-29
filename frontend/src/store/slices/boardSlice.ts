import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  boards: [],
  loading: false,
  error: null,
};

const boardSlice = createSlice({
  name: 'board',
  initialState,
  reducers: {},
});

export default boardSlice.reducer;
