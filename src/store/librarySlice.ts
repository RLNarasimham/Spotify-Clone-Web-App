import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Song, Playlist, LibraryState } from "../types";

const initialState: LibraryState = {
  songs: [],
  playlists: [],
  recentlyPlayed: [],
  favorites: [],
  searchResults: [],
  searchQuery: "",
  isLoading: false,
};

const librarySlice = createSlice({
  name: "library",
  initialState,
  reducers: {
    setSongs: (state, action: PayloadAction<Song[]>) => {
      state.songs = action.payload;
    },
    setPlaylists: (state, action: PayloadAction<Playlist[]>) => {
      state.playlists = action.payload;
    },
    addPlaylist: (state, action: PayloadAction<Playlist>) => {
      state.playlists.push(action.payload);
    },
    updatePlaylist: (state, action: PayloadAction<Playlist>) => {
      const index = state.playlists.findIndex(
        (p) => p.id === action.payload.id
      );
      if (index !== -1) {
        state.playlists[index] = action.payload;
      }
    },
    deletePlaylist: (state, action: PayloadAction<string>) => {
      state.playlists = state.playlists.filter((p) => p.id !== action.payload);
    },
    addToFavorites: (state, action: PayloadAction<Song>) => {
      if (!state.favorites.find((s) => s.id === action.payload.id)) {
        state.favorites.push(action.payload);
      }
    },
    removeFromFavorites: (state, action: PayloadAction<string>) => {
      state.favorites = state.favorites.filter((s) => s.id !== action.payload);
    },
    addToRecentlyPlayed: (state, action: PayloadAction<Song>) => {
      state.recentlyPlayed = state.recentlyPlayed.filter(
        (s) => s.id !== action.payload.id
      );
      state.recentlyPlayed.unshift(action.payload);
      if (state.recentlyPlayed.length > 20) {
        state.recentlyPlayed = state.recentlyPlayed.slice(0, 20);
      }
    },
    addSongToPlaylist: (
      state,
      action: PayloadAction<{ playlistId: string; song: Song }>
    ) => {
      const { playlistId, song } = action.payload;
      const playlist = state.playlists.find((p) => p.id === playlistId);
      if (playlist && !playlist.songs.find((s) => s.id === song.id)) {
        playlist.songs.push(song);
      }
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    setSearchResults: (state, action: PayloadAction<Song[]>) => {
      state.searchResults = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
  },
});

export const {
  setSongs,
  setPlaylists,
  addPlaylist,
  updatePlaylist,
  deletePlaylist,
  addToFavorites,
  removeFromFavorites,
  addToRecentlyPlayed,
  setSearchQuery,
  setSearchResults,
  setLoading,
  addSongToPlaylist,
} = librarySlice.actions;

export default librarySlice.reducer;
