import React, { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../hooks/useRedux";
import { playSong } from "../../store/playerSlice";
import {
  addToRecentlyPlayed,
  addToFavorites,
  removeFromFavorites,
  updatePlaylist,
} from "../../store/librarySlice";
import {
  Play,
  Heart,
  MoreHorizontal,
  Clock,
  Share,
  Download,
  Edit3,
  Plus,
  X,
  Search,
  Loader2,
} from "lucide-react";
import { Song } from "../../types";
import axios from "axios";

interface iTunesTrack {
  trackId: number;
  trackName: string;
  artistName: string;
  artworkUrl100: string;
  trackTimeMillis: number;
  previewUrl: string;
  collectionName: string;
  primaryGenreName: string;
  releaseDate: string;
  trackPrice: number;
  currency: string;
}

interface iTunesResponse {
  resultCount: number;
  results: iTunesTrack[];
}

const PlaylistView: React.FC = () => {
  const dispatch = useAppDispatch();
  const { selectedPlaylist } = useAppSelector((state) => state.ui);
  const { playlists, favorites, songs } = useAppSelector(
    (state) => state.library
  );

  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState("");
  const [playlistSearch, setPlaylistSearch] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [showAddSongs, setShowAddSongs] = useState(false);
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [iTunesSearchQuery, setITunesSearchQuery] = useState("");
  const [iTunesResults, setITunesResults] = useState<Song[]>([]);
  const [isLoadingItunes, setIsLoadingItunes] = useState(false);
  const [showItunesSearch, setShowItunesSearch] = useState(false);
  const [librarySearchQuery, setLibrarySearchQuery] = useState("");

  const playlist = playlists.find((p) => p.id === selectedPlaylist);

  const filteredLibrarySongs = songs
    .filter((song) => {
      const searchTerm = librarySearchQuery.toLowerCase();
      return (
        !librarySearchQuery ||
        song.title.toLowerCase().includes(searchTerm) ||
        song.artist.toLowerCase().includes(searchTerm) ||
        (song.album && song.album.toLowerCase().includes(searchTerm)) ||
        (song.genre && song.genre.toLowerCase().includes(searchTerm))
      );
    })
    .filter((song) => {
      return !(playlist?.songs ?? []).find((s) => s.id === song.id);
    });

  const convertToSong = (track: iTunesTrack): Song => ({
    id: track.trackId.toString(),
    title: track.trackName,
    artist: track.artistName,
    image: track.artworkUrl100,
    duration: Math.floor(track.trackTimeMillis / 1000),
    url: track.previewUrl || "",
    album: track.collectionName || "",
    genre: track.primaryGenreName || "",
    year: new Date(track.releaseDate).getFullYear(),
    albumId: track.trackId.toString(),
  });

  const searchItunes = async (query: string) => {
    if (!query.trim()) {
      setITunesResults([]);
      return;
    }

    setIsLoadingItunes(true);
    try {
      const response = await axios.get<iTunesResponse>(
        `https://itunes.apple.com/search?term=${encodeURIComponent(
          query
        )}&media=music&entity=song&limit=20`
      );

      const songs = response.data.results
        .filter((track) => track.previewUrl)
        .map(convertToSong);

      setITunesResults(songs);
    } catch (error) {
      console.error("Error searching iTunes:", error);
      setITunesResults([]);
    } finally {
      setIsLoadingItunes(false);
    }
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (iTunesSearchQuery && showItunesSearch) {
        searchItunes(iTunesSearchQuery);
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [iTunesSearchQuery, showItunesSearch]);

  const handlePlaySong = (song: Song) => {
    dispatch(playSong({ song, queue: playlist?.songs || [] }));
    dispatch(addToRecentlyPlayed(song));
  };

  const handleToggleFavorite = (song: Song, e: React.MouseEvent) => {
    e.stopPropagation();
    const isFavorite = favorites.some((fav) => fav.id === song.id);
    if (isFavorite) {
      dispatch(removeFromFavorites(song.id));
    } else {
      dispatch(addToFavorites(song));
    }
  };

  const isFavorite = (songId: string) => {
    return favorites.some((fav) => fav.id === songId);
  };

  const handleEditPlaylist = () => {
    if (playlist) {
      setEditName(playlist.name);
      setEditDescription(playlist.description);
      setIsEditing(true);
    }
  };

  const searchTerm = (playlistSearch ?? "").toLowerCase();

  const filteredSongs = playlist
    ? (playlist.songs ?? []).filter((song) => {
        return (
          (song.title ?? "").toLowerCase().includes(searchTerm) ||
          (song.artist ?? "").toLowerCase().includes(searchTerm) ||
          (song.album ?? "").toLowerCase().includes(searchTerm)
        );
      })
    : [];

  const handleSaveEdit = () => {
    if (playlist && editName.trim()) {
      const updatedPlaylist = {
        ...playlist,
        name: editName.trim(),
        description: editDescription.trim(),
      };
      dispatch(updatePlaylist(updatedPlaylist));
      setIsEditing(false);
    }
  };

  const handleAddSongToPlaylist = (song: Song) => {
    if (playlist && !(playlist.songs ?? []).find((s) => s.id === song.id)) {
      const updatedPlaylist = {
        ...playlist,
        songs: [...(playlist.songs ?? []), song],
      };
      dispatch(updatePlaylist(updatedPlaylist));
    }
  };

  const handleAddFromItunes = (song: Song) => {
    handleAddSongToPlaylist(song);
  };

  const handleRemoveSongFromPlaylist = (
    songId: string,
    e: React.MouseEvent
  ) => {
    e.stopPropagation();
    if (playlist) {
      const updatedPlaylist = {
        ...playlist,
        songs: (playlist.songs ?? []).filter((s) => s.id !== songId),
      };
      dispatch(updatePlaylist(updatedPlaylist));
    }
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const getTotalDuration = () => {
    if (!playlist) return 0;
    return (playlist.songs ?? []).reduce(
      (total, song) => total + song.duration,
      0
    );
  };

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) {
      return `${hours} hr ${minutes} min`;
    }
    return `${minutes} min`;
  };

  if (!playlist) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-400">Playlist not found</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 lg:space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-end space-y-4 lg:space-y-0 lg:space-x-6 bg-gradient-to-b from-purple-600/20 to-transparent p-4 lg:p-8 rounded-lg">
        <img
          src={playlist.coverUrl}
          alt={playlist.name}
          className="w-32 h-32 lg:w-60 lg:h-60 rounded-lg shadow-2xl object-cover mx-auto lg:mx-0"
        />
        <div className="flex-1 text-center lg:text-left">
          <p className="text-xs lg:text-sm uppercase tracking-wide text-white/70 mb-1 lg:mb-2">
            Playlist
          </p>
          {isEditing ? (
            <div className="space-y-3">
              <input
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="text-3xl lg:text-6xl font-bold text-white bg-transparent border-b border-gray-400 focus:outline-none focus:border-green-500 w-full"
              />
              <textarea
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                className="text-white/80 text-sm lg:text-lg bg-transparent border border-gray-400 rounded px-2 py-1 focus:outline-none focus:border-green-500 w-full resize-none"
                rows={2}
              />
              <div className="flex space-x-2">
                <button
                  onClick={handleSaveEdit}
                  className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg text-sm transition-colors"
                >
                  Save
                </button>
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded-lg text-sm transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <>
              <h1 className="text-3xl lg:text-6xl font-bold text-white mb-2 lg:mb-4 break-words">
                {playlist.name}
              </h1>
              <p className="text-white/80 text-sm lg:text-lg mb-2 lg:mb-4">
                {playlist.description}
              </p>
              <div className="flex flex-wrap items-center justify-center lg:justify-start space-x-2 text-white/60 text-sm lg:text-base">
                <span className="font-semibold">{playlist.owner}</span>
                <span className="hidden sm:inline">•</span>
                <span>{playlist.songs?.length ?? 0} songs</span>
                <span className="hidden sm:inline">•</span>
                <span className="hidden sm:inline">
                  {formatDuration(getTotalDuration())}
                </span>
              </div>
            </>
          )}
        </div>
      </div>

      <div className="px-4 lg:px-8 flex items-center mb-2">
        <div className="relative w-full max-w-xs">
          <input
            type="text"
            value={playlistSearch}
            onChange={(e) => setPlaylistSearch(e.target.value)}
            placeholder="Search in this playlist"
            className="w-full px-3 py-2 pl-9 bg-gray-700 rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500 text-white"
          />
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
        </div>
      </div>

      <div className="flex items-center space-x-4 lg:space-x-6 px-4 lg:px-8">
        <button
          onClick={() =>
            playlist.songs &&
            playlist.songs.length > 0 &&
            handlePlaySong(playlist.songs[0])
          }
          className="bg-green-500 hover:bg-green-400 text-black rounded-full p-3 lg:p-4 transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed"
          disabled={(playlist.songs?.length ?? 0) === 0}
        >
          <Play className="h-6 w-6 lg:h-8 lg:w-8 fill-current" />
        </button>
        <button className="p-2 hover:bg-gray-800 rounded-full transition-colors">
          <Heart className="h-5 w-5 lg:h-6 lg:w-6 text-green-500" />
        </button>
        <button
          onClick={() => setShowAddSongs(true)}
          className="p-2 hover:bg-gray-800 rounded-full transition-colors"
        >
          <Plus className="h-5 w-5 lg:h-6 lg:w-6" />
        </button>
        <button
          onClick={handleEditPlaylist}
          className="p-2 hover:bg-gray-800 rounded-full transition-colors"
        >
          <Edit3 className="h-5 w-5 lg:h-6 lg:w-6" />
        </button>
        <button className="p-2 hover:bg-gray-800 rounded-full transition-colors">
          <Download className="h-5 w-5 lg:h-6 lg:w-6" />
        </button>
        <button className="p-2 hover:bg-gray-800 rounded-full transition-colors">
          <Share className="h-5 w-5 lg:h-6 lg:w-6" />
        </button>
        <div className="relative inline-block">
          <button
            className="p-2 hover:bg-gray-800 rounded-full transition-colors"
            onClick={() => setShowMoreMenu((prev) => !prev)}
          >
            <MoreHorizontal className="h-5 w-5 lg:h-6 lg:w-6" />
          </button>

          {showMoreMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded shadow-lg z-50">
              <button
                className="block w-full text-left px-4 py-2 hover:bg-gray-700 text-white"
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                  setShowMoreMenu(false);
                  setTimeout(() => {
                    alert("Playlist link is copied to clipboard!!");
                  }, 100);
                }}
              >
                Copy Playlist Link
              </button>
              <button
                className="block w-full text-left px-4 py-2 hover:bg-gray-700 text-white"
                onClick={() => setShowMoreMenu(false)}
              >
                Close
              </button>
            </div>
          )}
        </div>
      </div>

      {showAddSongs && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">Add Songs to Playlist</h2>
              <button
                onClick={() => {
                  setShowAddSongs(false);
                  setShowItunesSearch(false);
                  setITunesSearchQuery("");
                  setITunesResults([]);
                  setLibrarySearchQuery("");
                }}
                className="p-2 hover:bg-gray-700 rounded-full transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex space-x-2 mb-4">
              <button
                onClick={() => setShowItunesSearch(false)}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  !showItunesSearch
                    ? "bg-green-600 text-white"
                    : "bg-gray-600 text-gray-300 hover:bg-gray-500"
                }`}
              >
                Library Songs
              </button>
              <button
                onClick={() => setShowItunesSearch(true)}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  showItunesSearch
                    ? "bg-green-600 text-white"
                    : "bg-gray-600 text-gray-300 hover:bg-gray-500"
                }`}
              >
                Search iTunes
              </button>
            </div>

            <div className="mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder={
                    showItunesSearch
                      ? "Search iTunes for songs, artists, or albums..."
                      : "Search library songs..."
                  }
                  value={
                    showItunesSearch ? iTunesSearchQuery : librarySearchQuery
                  }
                  onChange={(e) =>
                    showItunesSearch
                      ? setITunesSearchQuery(e.target.value)
                      : setLibrarySearchQuery(e.target.value)
                  }
                  className="w-full pl-10 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500"
                />
                {isLoadingItunes && showItunesSearch && (
                  <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5 animate-spin" />
                )}
              </div>
            </div>

            <div className="flex-1 overflow-y-auto space-y-2">
              {showItunesSearch ? (
                <>
                  {isLoadingItunes ? (
                    <div className="flex items-center justify-center py-8">
                      <Loader2 className="h-6 w-6 animate-spin text-green-500" />
                      <span className="ml-2 text-gray-400">
                        Searching iTunes...
                      </span>
                    </div>
                  ) : iTunesResults.length === 0 ? (
                    <p className="text-gray-400 text-center py-8">
                      {iTunesSearchQuery
                        ? "No results found"
                        : "Search iTunes to find songs"}
                    </p>
                  ) : (
                    iTunesResults.map((song) => (
                      <div
                        key={song.id}
                        className="flex items-center space-x-3 p-3 hover:bg-gray-700 rounded-lg transition-colors"
                      >
                        <img
                          src={song.image}
                          alt={song.title}
                          className="w-12 h-12 rounded object-cover"
                          onError={(e) => {
                            e.currentTarget.src =
                              "https://via.placeholder.com/100x100/1f2937/9ca3af?text=Music";
                          }}
                        />
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-white truncate">
                            {song.title}
                          </h3>
                          <p className="text-sm text-gray-400 truncate">
                            {song.artist}
                          </p>
                          <p className="text-xs text-gray-500 truncate">
                            {song.album}
                          </p>
                        </div>
                        <span className="text-xs text-gray-400">
                          {formatTime(song.duration)}
                        </span>
                        <button
                          onClick={() => handleAddFromItunes(song)}
                          className="p-2 bg-green-600 hover:bg-green-700 rounded-full transition-colors"
                          disabled={
                            !!(playlist.songs ?? []).find(
                              (s) => s.id === song.id
                            )
                          }
                        >
                          <Plus className="h-4 w-4 text-white" />
                        </button>
                      </div>
                    ))
                  )}
                </>
              ) : (
                <>
                  {filteredLibrarySongs.length === 0 ? (
                    <p className="text-gray-400 text-center py-8">
                      {librarySearchQuery
                        ? "No library songs found matching your search"
                        : songs.length === 0
                        ? "No songs in library"
                        : "All library songs are already in this playlist"}
                    </p>
                  ) : (
                    filteredLibrarySongs.map((song) => (
                      <div
                        key={song.id}
                        className="flex items-center space-x-3 p-3 hover:bg-gray-700 rounded-lg transition-colors"
                      >
                        <img
                          src={song.image}
                          alt={song.title}
                          className="w-12 h-12 rounded object-cover"
                          onError={(e) => {
                            e.currentTarget.src =
                              "https://via.placeholder.com/100x100/1f2937/9ca3af?text=Music";
                          }}
                        />
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-white truncate">
                            {song.title}
                          </h3>
                          <p className="text-sm text-gray-400 truncate">
                            {song.artist}
                          </p>
                          <p className="text-xs text-gray-500 truncate">
                            {song.album || `${song.genre} • ${song.year}`}
                          </p>
                        </div>
                        <span className="text-xs text-gray-400">
                          {formatTime(song.duration)}
                        </span>
                        <button
                          onClick={() => handleAddSongToPlaylist(song)}
                          className="p-2 bg-green-600 hover:bg-green-700 rounded-full transition-colors"
                          disabled={
                            !!(playlist.songs ?? []).find(
                              (s) => s.id === song.id
                            )
                          }
                        >
                          <Plus className="h-4 w-4 text-white" />
                        </button>
                      </div>
                    ))
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="w-full max-w-screen-2xl mx-auto px-2 sm:px-4 md:px-8 xl:px-24 2xl:px-48">
        {(playlist.songs?.length ?? 0) === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg mb-4">This playlist is empty</p>
            <button
              onClick={() => setShowAddSongs(true)}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-full transition-colors"
            >
              Add Songs
            </button>
          </div>
        ) : (
          <>
            <div className="hidden lg:grid grid-cols-12 gap-2 text-gray-400 text-sm border-b border-gray-700 pb-2 mb-4">
              <div className="col-span-1">#</div>
              <div className="col-span-5">Title</div>
              <div className="col-span-3">Album</div>
              <div className="col-span-2">Date added</div>
              <div className="col-span-1 text-right">
                <Clock className="h-4 w-4 ml-auto" />
              </div>
            </div>

            <div className="space-y-1">
              {filteredSongs.length === 0 ? (
                <div className="text-center py-8 text-gray-400">
                  No results found
                </div>
              ) : (
                filteredSongs.map((song, index) => (
                  <div
                    key={song.id}
                    className="grid grid-cols-12 gap-2 lg:gap-4 items-center p-2 hover:bg-gray-800 rounded-lg transition-colors cursor-pointer group"
                    onClick={() => handlePlaySong(song)}
                  >
                    <div className="col-span-12 lg:hidden flex items-center space-x-1">
                      <span className="text-gray-400 text-sm w-10 sm:w-12 flex-shrink-0">
                        <span className="group-hover:hidden">{index + 1}</span>
                        <Play className="h-4 w-4 hidden group-hover:block text-white" />
                      </span>
                      <img
                        src={song.image}
                        alt={song.title}
                        className="w-10 h-10 rounded object-cover flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-white text-sm truncate">
                          {song.title}
                        </h3>
                        <p className="text-xs text-gray-400 truncate">
                          {song.artist}
                        </p>
                      </div>
                      <div className="flex items-center px-1 flex-shrink-0">
                        <button
                          className="opacity-0 group-hover:opacity-100 transition-opacity hover:bg-gray-700 rounded"
                          onClick={(e) => handleToggleFavorite(song, e)}
                        >
                          <Heart
                            className={`h-4 w-4 ${
                              isFavorite(song.id)
                                ? "text-green-500 fill-current"
                                : "text-gray-400"
                            }`}
                          />
                        </button>
                        <span className="text-gray-400 text-xs">
                          {formatTime(song.duration)}
                        </span>
                        <button
                          className="opacity-0 group-hover:opacity-100 transition-opacity hover:bg-gray-700 rounded text-red-400"
                          onClick={(e) =>
                            handleRemoveSongFromPlaylist(song.id, e)
                          }
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    </div>

                    <div className="hidden lg:contents">
                      <div className="col-span-1 text-gray-400 text-sm">
                        <span className="group-hover:hidden">{index + 1}</span>
                        <Play className="h-4 w-4 hidden group-hover:block text-white" />
                      </div>
                      <div className="col-span-5 flex items-center space-x-3">
                        <img
                          src={song.image}
                          alt={song.title}
                          className="w-10 h-10 rounded object-cover"
                        />
                        <div>
                          <h3 className="font-medium text-white">
                            {song.title}
                          </h3>
                          <p className="text-sm text-gray-400">{song.artist}</p>
                        </div>
                      </div>
                      <div className="col-span-3 text-gray-400 text-sm">
                        {song.album}
                      </div>
                      <div className="col-span-2 text-gray-400 text-sm">
                        {new Date(playlist.createdAt).toLocaleDateString(
                          "en-US",
                          {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          }
                        )}
                      </div>
                      <div className="col-span-1 text-right">
                        <div className="flex items-center space-x-1">
                          <button
                            className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-gray-700 rounded"
                            onClick={(e) => handleToggleFavorite(song, e)}
                          >
                            <Heart
                              className={`h-4 w-4 ${
                                isFavorite(song.id)
                                  ? "text-green-500 fill-current"
                                  : "text-gray-400"
                              }`}
                            />
                          </button>
                          <span className="text-gray-400 text-sm">
                            {formatTime(song.duration)}
                          </span>
                          <button
                            className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-gray-700 rounded text-red-400"
                            onClick={(e) =>
                              handleRemoveSongFromPlaylist(song.id, e)
                            }
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default PlaylistView;
