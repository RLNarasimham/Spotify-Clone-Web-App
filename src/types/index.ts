export interface User {
  id: string;
  username: string;
  email: string;
  displayName: string;
  profilePicture?: string;
  createdAt: Date;
  followers: number;
  following: number;
  isVerified: boolean;
}

export interface Song {
  id: string;
  title: string;
  artist: string;
  albumId?: string;
  duration: number;
  trackNumber?: number;
  genre?: string;
  year?: number;
  audioUrl?: string;
  isExplicit?: boolean;
  playCount?: number;
  likes?: number;
}

export interface Album {
  id: string;
  title: string;
  artist: string;
  coverUrl: string;
  year?: number;
  genre?: string;
  trackCount?: number;
  duration?: number;
  popularity?: number;
  description?: string;
  label?: string;
}

export interface Playlist {
  id: string;
  name: string;
  description?: string;
  coverUrl?: string;
  songIds: string[];
  createdBy: string;
  isPublic: boolean;
  createdAt: Date;
  updatedAt: Date;
  followers?: number;
  tags?: string[];
}

export interface Genre {
  id: string;
  name: string;
  description?: string;
  coverUrl?: string;
  popularArtists?: string[];
}

export interface SearchResults {
  songs: Song[];
  albums: Album[];
  playlists: Playlist[];
  artists: string[];
}

export interface PlayerState {
  currentSong: Song | null;
  isPlaying: boolean;
  volume: number;
  progress: number;
  queue: Song[];
  shuffle: boolean;
  repeat: "none" | "one" | "all";
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
  error?: string;
}
