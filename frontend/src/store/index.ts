import { configureStore } from '@reduxjs/toolkit';
import workspaceReducer from './slices/workspaceSlice';
import boardReducer from './slices/boardSlice';
import cardReducer from './slices/cardSlice';
import themeReducer from './slices/themeSlice';

export const store = configureStore({
  reducer: {
    workspace: workspaceReducer,
    board: boardReducer,
    card: cardReducer,
    theme: themeReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
