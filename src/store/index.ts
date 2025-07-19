import { configureStore } from '@reduxjs/toolkit';
import playerReducer from './playerSlice';
import libraryReducer from './librarySlice';
import uiReducer from './uiSlice';

export const store = configureStore({
  reducer: {
    player: playerReducer,
    library: libraryReducer,
    ui: uiReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;