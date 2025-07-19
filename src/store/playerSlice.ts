import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Song, PlayerState } from "../types";

type RepeatMode = "none" | "all" | "one";

const initialState: PlayerState = {
  currentSong: null,
  isPlaying: false,
  queue: [],
  currentIndex: 0,
  volume: 0.7,
  progress: 0,
  duration: 0,
  shuffle: false,
  repeat: "none",
  isLoading: false,
};

const playerSlice = createSlice({
  name: "player",
  initialState,
  reducers: {
    playSong: (
      state,
      action: PayloadAction<{ song: Song; queue?: Song[] }>
    ) => {
      state.currentSong = action.payload.song;
      state.isPlaying = true;
      state.progress = 0;
      if (action.payload.queue) {
        state.queue = action.payload.queue;
        state.currentIndex = action.payload.queue.findIndex(
          (s) => s.id === action.payload.song.id
        );
      }
    },

    togglePlay: (state) => {
      state.isPlaying = !state.isPlaying;
    },

    pauseSong: (state) => {
      state.isPlaying = false;
    },

    nextSong: (state) => {
      if (state.queue.length === 0) return;

      const atEnd = state.currentIndex + 1 >= state.queue.length;

      if (atEnd) {
        if (state.repeat === "all") {
          state.currentIndex = 0;
        } else if (state.repeat === "one") {
          state.progress = 0;
          return;
        } else {
          state.isPlaying = false;
          return;
        }
      } else {
        state.currentIndex += 1;
      }

      state.currentSong = state.queue[state.currentIndex];
      state.progress = 0;
    },

    previousSong: (state) => {
      if (state.queue.length === 0) return;

      if (state.currentIndex === 0) {
        if (state.repeat === "all") {
          state.currentIndex = state.queue.length - 1;
        }
      } else {
        state.currentIndex -= 1;
      }

      state.currentSong = state.queue[state.currentIndex];
      state.progress = 0;
    },

    setVolume: (state, action: PayloadAction<number>) => {
      state.volume = action.payload;
    },

    setProgress: (state, action: PayloadAction<number>) => {
      state.progress = action.payload;
    },

    setDuration: (state, action: PayloadAction<number>) => {
      state.duration = action.payload;
    },

    toggleShuffle: (state) => {
      state.shuffle = !state.shuffle;
    },

    toggleRepeat: (state) => {
      const modes: RepeatMode[] = ["none", "all", "one"];
      const idx = modes.indexOf(state.repeat as RepeatMode);
      state.repeat = modes[(idx + 1) % modes.length];
    },

    setQueue: (state, action: PayloadAction<Song[]>) => {
      state.queue = action.payload;
    },

    addToQueue: (state, action: PayloadAction<Song>) => {
      state.queue.push(action.payload);
    },

    removeFromQueue: (state, action: PayloadAction<string>) => {
      state.queue = state.queue.filter((song) => song.id !== action.payload);
    },

    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
  },
});

export const {
  playSong,
  togglePlay,
  pauseSong,
  nextSong,
  previousSong,
  setVolume,
  setProgress,
  setDuration,
  toggleShuffle,
  toggleRepeat,
  setQueue,
  addToQueue,
  removeFromQueue,
  setLoading,
} = playerSlice.actions;

export default playerSlice.reducer;
