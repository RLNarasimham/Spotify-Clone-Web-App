import React, { useState } from "react";
import { useAppDispatch, useAppSelector } from "../../hooks/useRedux";
import { playSong } from "../../store/playerSlice";
import {
  addToRecentlyPlayed,
  addToFavorites,
  removeFromFavorites,
  addPlaylist,
  deletePlaylist,
} from "../../store/librarySlice";
import { setCurrentView, setSelectedPlaylist } from "../../store/uiSlice";
import { Play, Heart, MoreHorizontal, Plus, Trash2 } from "lucide-react";
import { Song, Playlist } from "../../types";
import { useNavigate } from "react-router-dom";

const LibraryView: React.FC = () => {
  const dispatch = useAppDispatch();
  const { playlists, favorites, recentlyPlayed } = useAppSelector(
    (state) => state.library
  );
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState("");
  const [newPlaylistDescription, setNewPlaylistDescription] = useState("");
  const navigate = useNavigate();

  const handlePlaySong = (song: Song) => {
    dispatch(playSong({ song, queue: favorites }));
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

  const handlePlaylistSelect = (playlistId: string) => {
    dispatch(setCurrentView("playlist"));
    dispatch(setSelectedPlaylist(playlistId));
  };

  const handleCreatePlaylist = () => {
    if (newPlaylistName.trim()) {
      const newPlaylist: Playlist = {
        id: Date.now().toString(),
        name: newPlaylistName.trim(),
        description: newPlaylistDescription.trim() || "My custom playlist",
        image:
          "https://images.pexels.com/photos/1699161/pexels-photo-1699161.jpeg?auto=compress&cs=tinysrgb&w=400",
        songs: [],
        createdAt: new Date().toISOString().split("T")[0],
        isPublic: false,
        owner: "user123",
      };

      dispatch(addPlaylist(newPlaylist));
      setNewPlaylistName("");
      setNewPlaylistDescription("");
      setShowCreateModal(false);
    }
  };

  const handleDeletePlaylist = (playlistId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm("Are you sure you want to delete this playlist?")) {
      dispatch(deletePlaylist(playlistId));
    }
  };

  const handleRecentlyPlayedClick = () => {
    dispatch(setCurrentView("recentlyPlayed"));
    dispatch(setSelectedPlaylist(null));
    navigate("/recently-played");
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  return (
    <div className="space-y-6 lg:space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-2xl lg:text-3xl font-bold">Your Library</h1>
        <button
          onClick={() => setShowCreateModal(true)}
          title="Create Playlist-LB"
          className="bg-green-600 hover:bg-green-700 text-white px-3 lg:px-4 py-2 rounded-full flex items-center space-x-2 transition-colors text-sm lg:text-base self-start sm:self-auto"
        >
          <Plus className="h-3 w-3 lg:h-4 lg:w-4" />
          <span>Create Playlist</span>
        </button>
      </div>

      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Create New Playlist</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Playlist Name
                </label>
                <input
                  type="text"
                  value={newPlaylistName}
                  onChange={(e) => setNewPlaylistName(e.target.value)}
                  placeholder="Enter playlist name"
                  className="w-full px-3 py-2 bg-gray-700 rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Description (Optional)
                </label>
                <textarea
                  value={newPlaylistDescription}
                  onChange={(e) => setNewPlaylistDescription(e.target.value)}
                  placeholder="Enter playlist description"
                  rows={3}
                  className="w-full px-3 py-2 bg-gray-700 rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
                />
              </div>
              <div className="flex space-x-3 pt-4">
                <button
                  onClick={() => setShowCreateModal(false)}
                  title="Cancel Playlist Creation-LB"
                  className="flex-1 px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreatePlaylist}
                  disabled={!newPlaylistName.trim()}
                  title="Create Playlist-LB"
                  className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-lg transition-colors"
                >
                  Create
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 lg:gap-4">
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg p-4 lg:p-6 text-white">
          <div className="flex items-center space-x-3 lg:space-x-4">
            <Heart className="h-8 w-8 lg:h-12 lg:w-12 text-green-300 flex-shrink-0" />
            <div>
              <h3 className="text-lg lg:text-xl font-bold">Liked Songs</h3>
              <p className="opacity-90 text-sm lg:text-base">
                {favorites.length} liked songs
              </p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-600 to-teal-600 rounded-lg p-4 lg:p-6 text-white">
          <div
            className="flex items-center space-x-3 lg:space-x-4"
            onClick={handleRecentlyPlayedClick}
          >
            <Play className="h-8 w-8 lg:h-12 lg:w-12 text-white flex-shrink-0" />
            <div>
              <h3 className="text-lg lg:text-xl font-bold">Recently Played</h3>
              <p className="opacity-90 text-sm lg:text-base">
                {recentlyPlayed.length} tracks
              </p>
            </div>
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-xl lg:text-2xl font-bold mb-3 lg:mb-4">
          Made by You
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 lg:gap-4">
          {playlists.map((playlist) => (
            <div
              key={playlist.id}
              className="bg-gray-800 rounded-lg p-3 lg:p-4 hover:bg-gray-700 transition-colors cursor-pointer group relative"
              onClick={() => handlePlaylistSelect(playlist.id)}
            >
              <div className="relative mb-3 lg:mb-4">
                <img
                  src={playlist.coverUrl}
                  alt={playlist.name}
                  className="w-full aspect-square object-cover rounded-md"
                />
                <button
                  title="Play Song-LB"
                  className="absolute bottom-1 right-1 lg:bottom-2 lg:right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-green-500 hover:bg-green-400 rounded-full p-1.5 lg:p-2"
                >
                  <Play className="h-3 w-3 lg:h-4 lg:w-4 text-black fill-current" />
                </button>
                <button
                  onClick={(e) => handleDeletePlaylist(playlist.id, e)}
                  className="absolute top-1 right-1 lg:top-2 lg:right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-red-500 hover:bg-red-400 rounded-full p-1.5 lg:p-2"
                  title="Delete Playlist-LB"
                >
                  <Trash2 className="h-3 w-3 lg:h-4 lg:w-4 text-white" />
                </button>
              </div>
              <h3 className="font-semibold text-white truncate text-sm lg:text-base">
                {playlist.name}
              </h3>
              <p className="text-xs lg:text-sm text-gray-400 truncate">
                {playlist.description}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {playlist.songs?.length ?? 0} songs
              </p>
            </div>
          ))}
        </div>
      </div>

      {recentlyPlayed.length > 0 && (
        <div>
          <h2 className="text-xl lg:text-2xl font-bold mb-3 lg:mb-4">
            Recently Played
          </h2>
          <div className="space-y-1 lg:space-y-2">
            {recentlyPlayed.slice(0, 5).map((song, index) => (
              <div
                key={`${song.id}-${index}`}
                className="flex items-center space-x-3 lg:space-x-4 p-2 lg:p-3 hover:bg-gray-800 rounded-lg transition-colors cursor-pointer group"
                onClick={() => handlePlaySong(song)}
              >
                <img
                  src={song.image}
                  alt={song.title}
                  className="w-10 h-10 lg:w-12 lg:h-12 rounded object-cover flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-white text-sm lg:text-base truncate">
                    {song.title}
                  </h3>
                  <p className="text-xs lg:text-sm text-gray-400 truncate">
                    {song.artist}
                  </p>
                </div>
                <span className="text-gray-400 text-xs lg:text-sm hidden sm:block flex-shrink-0">
                  {formatTime(song.duration)}
                </span>
                <div className="flex items-center space-x-1 lg:space-x-2 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                  <button
                    className="p-1 hover:bg-gray-700 rounded"
                    onClick={(e) => handleToggleFavorite(song, e)}
                    title="Favourites-RP-LB"
                  >
                    <Heart
                      className={`h-3 w-3 lg:h-4 lg:w-4 ${
                        isFavorite(song.id)
                          ? "text-green-500 fill-current"
                          : "text-gray-400"
                      }`}
                    />
                  </button>
                  <button
                    title="Three Dots Menu-RP-LB"
                    className="p-1 hover:bg-gray-700 rounded"
                  >
                    <MoreHorizontal className="h-3 w-3 lg:h-4 lg:w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default LibraryView;
