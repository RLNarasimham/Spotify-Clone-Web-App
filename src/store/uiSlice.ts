import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UIState {
  sidebarCollapsed: boolean;
  currentView: 'home' | 'search' | 'library' | 'playlist';
  selectedPlaylist: string | null;
  showQueue: boolean;
}

const initialState: UIState = {
  sidebarCollapsed: false,
  currentView: 'home',
  selectedPlaylist: null,
  showQueue: false,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.sidebarCollapsed = !state.sidebarCollapsed;
    },
    setCurrentView: (state, action: PayloadAction<'home' | 'search' | 'library' | 'playlist'>) => {
      state.currentView = action.payload;
    },
    setSelectedPlaylist: (state, action: PayloadAction<string | null>) => {
      state.selectedPlaylist = action.payload;
    },
    toggleQueue: (state) => {
      state.showQueue = !state.showQueue;
    },
  },
});

export const {
  toggleSidebar,
  setCurrentView,
  setSelectedPlaylist,
  toggleQueue,
} = uiSlice.actions;

export default uiSlice.reducer;