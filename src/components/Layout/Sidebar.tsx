import React, { useState } from "react";
import { useAppDispatch, useAppSelector } from "../../hooks/useRedux";
import {
  setCurrentView,
  setSelectedPlaylist,
  toggleSidebar,
} from "../../store/uiSlice";
import { Home, Search, Library, Plus, Heart, Menu, Music } from "lucide-react";
import { Playlist } from "../../types";
import {
  addPlaylist,
  deletePlaylist,
  updatePlaylist,
} from "../../store/librarySlice";
import { Trash2, Pencil } from "lucide-react";

const Sidebar: React.FC = () => {
  const dispatch = useAppDispatch();

  const maybeCloseSidebar = () => {
    if (window.innerWidth < 1024 && !sidebarCollapsed) {
      dispatch(toggleSidebar());
    }
  };

  const { sidebarCollapsed, currentView } = useAppSelector((state) => state.ui);
  const { playlists } = useAppSelector((state) => state.library);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState("");
  const [newPlaylistUrl, setNewPlaylistUrl] = useState("");
  const [newPlaylistDescription, setNewPlaylistDescription] = useState("");
  const [editPlaylistId, setEditPlaylistId] = useState<string | null>(null);
  const [editPlaylistName, setEditPlaylistName] = useState("");
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [editPlaylistDescription, setEditPlaylistDescription] = useState("");

  const [newPlaylistNameError, setNewPlaylistNameError] = useState("");
  const [newPlaylistUrlError, setNewPlaylistUrlError] = useState("");
  const [editPlaylistNameError, setEditPlaylistNameError] = useState("");

  const validatePlaylistName = (name: string) => {
    if (name.length > 0 && /^\d/.test(name)) {
      return "Playlist name cannot start with a number";
    }
    return "";
  };

  const validatePlaylistUrl = (name: string) => {
    if (name.length > 0 && /^\d/.test(name)) {
      return "Playlist name cannot start with a number";
    }
    return "";
  };

  const handleViewChange = (
    view: "home" | "search" | "library" | "playlist"
  ) => {
    dispatch(setCurrentView(view));
    if (view !== "playlist") {
      dispatch(setSelectedPlaylist(null));
    }
    maybeCloseSidebar();
  };

  const handlePlaylistSelect = (playlistId: string) => {
    dispatch(setCurrentView("playlist"));
    dispatch(setSelectedPlaylist(playlistId));
    maybeCloseSidebar();
  };

  const handleDeletePlaylist = (playlistId: string) => {
    dispatch(deletePlaylist(playlistId));
    setConfirmDeleteId(null);
  };

  const handleEditPlaylist = (playlist: Playlist) => {
    setEditPlaylistId(playlist.id);
    setEditPlaylistName(playlist.name);
    setEditPlaylistDescription(playlist.description);
    setEditPlaylistNameError("");
  };

  const handleUpdatePlaylist = () => {
    if (editPlaylistId && editPlaylistName.trim()) {
      const error = validatePlaylistName(editPlaylistName.trim());
      if (error) {
        setEditPlaylistNameError(error);
        return;
      }

      const original = playlists.find((p) => p.id === editPlaylistId);
      if (original) {
        dispatch(
          updatePlaylist({
            ...original,
            name: editPlaylistName.trim(),
            description: editPlaylistDescription.trim(),
          })
        );
      }
      setEditPlaylistId(null);
      setEditPlaylistName("");
      setEditPlaylistDescription("");
      setEditPlaylistNameError("");
    }
  };

  const handleLogoClick = () => {
    dispatch(setCurrentView("home"));
    dispatch(setSelectedPlaylist(null));
    maybeCloseSidebar();
  };

  const handleCreatePlaylist = () => {
    if (newPlaylistName.trim()) {
      const error = validatePlaylistName(newPlaylistName.trim());
      if (error) {
        setNewPlaylistNameError(error);
        return;
      }

      const newPlaylist: Playlist = {
        id: Date.now().toString(),
        name: newPlaylistName.trim(),
        description: newPlaylistDescription.trim() || "My custom playlist",
        coverUrl:
          newPlaylistUrl.trim() ||
          "https://as2.ftcdn.net/v2/jpg/03/56/73/43/1000_F_356734372_sOSfIE8xFZXKbiIQgWhyw10zDEhdcwOL.jpg",
        songs: [],
        createdAt: new Date().toISOString().split("T")[0],
        isPublic: false,
        owner: "user123",
      };

      dispatch(addPlaylist(newPlaylist));
      setNewPlaylistName("");
      setNewPlaylistDescription("");
      setShowCreateModal(false);
      setNewPlaylistNameError("");
    }
  };

  const handleNewPlaylistNameChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value;
    setNewPlaylistName(value);
    setNewPlaylistNameError(validatePlaylistName(value));
  };

  const handleNewPlaylistUrlChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value;
    setNewPlaylistUrl(value);
    setNewPlaylistUrlError(validatePlaylistUrl(value));
  };

  const handleEditPlaylistNameChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value;
    setEditPlaylistName(value);
    setEditPlaylistNameError(validatePlaylistName(value));
  };

  return (
    <>
      {!sidebarCollapsed && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => dispatch(toggleSidebar())}
        />
      )}

      <div
        className={`bg-black text-white transition-all duration-300 z-50 ${
          sidebarCollapsed ? "w-16 lg:w-16" : "w-64 lg:w-64"
        } min-h-screen flex flex-col fixed lg:relative ${
          sidebarCollapsed
            ? "-translate-x-full lg:translate-x-0"
            : "translate-x-0"
        }`}
      >
        <div className="p-3 lg:p-4 border-b border-gray-800">
          <div className="flex items-center justify-between">
            {!sidebarCollapsed && (
              <div
                className="flex items-center space-x-2 cursor-pointer hover:opacity-80 transition-opacity"
                onClick={handleLogoClick}
              >
                <Music className="h-6 w-6 lg:h-8 lg:w-8 text-green-500" />
                <h1 className="text-lg lg:text-xl font-bold">Spotify 2.0</h1>
              </div>
            )}
            {sidebarCollapsed && (
              <div
                className="flex items-center justify-center cursor-pointer hover:opacity-80 transition-opacity"
                onClick={handleLogoClick}
              ></div>
            )}
            <button
              onClick={() => dispatch(toggleSidebar())}
              className="p-1.5 lg:p-2 hover:bg-gray-800 rounded-lg transition-colors"
              title="Hamburger Menu-SB"
            >
              <Menu className="h-4 w-4 lg:h-5 lg:w-5" />
            </button>
          </div>
        </div>

        <nav className="flex-1 p-3 overflow-y-auto">
          <div className="space-y-1 lg:space-y-2">
            <button
              onClick={() => handleViewChange("home")}
              className={`w-full flex items-center space-x-2 lg:space-x-3 p-2 lg:p-3 rounded-lg transition-colors text-sm lg:text-base ${
                currentView === "home" ? "bg-green-600" : "hover:bg-gray-800"
              }`}
              title="Home Button-SB"
            >
              <Home className="h-4 w-4 lg:h-5 lg:w-5 flex-shrink-0" />
              {!sidebarCollapsed && <span>Home</span>}
            </button>

            <button
              onClick={() => handleViewChange("search")}
              className={`w-full flex items-center space-x-2 lg:space-x-3 p-2 lg:p-3 rounded-lg transition-colors text-sm lg:text-base ${
                currentView === "search" ? "bg-green-600" : "hover:bg-gray-800"
              }`}
              title="Search Icon-SB"
            >
              <Search className="h-4 w-4 lg:h-5 lg:w-5 flex-shrink-0" />
              {!sidebarCollapsed && <span>Search</span>}
            </button>

            <button
              onClick={() => handleViewChange("library")}
              className={`w-full flex items-center space-x-2 lg:space-x-3 p-2 lg:p-3 rounded-lg transition-colors text-sm lg:text-base ${
                currentView === "library" ? "bg-green-600" : "hover:bg-gray-800"
              }`}
              title="Library Icon-SB"
            >
              <Library className="h-4 w-4 lg:h-5 lg:w-5 flex-shrink-0" />
              {!sidebarCollapsed && <span>Your Library</span>}
            </button>
          </div>

          <div className="mt-6 lg:mt-8 mb-3 lg:mb-4">
            <div className="flex items-center justify-between mb-3 lg:mb-4">
              {!sidebarCollapsed && (
                <h2 className="text-xs lg:text-sm font-semibold text-gray-400 uppercase tracking-wider">
                  Playlists
                </h2>
              )}
              <button
                onClick={() => setShowCreateModal(true)}
                className="p-1 hover:bg-gray-800 rounded"
                title="Create Playlist-SB"
              >
                <Plus className="h-3 w-3 lg:h-4 lg:w-4" />
              </button>
            </div>

            <div className="space-y-1">
              <button
                onClick={() => handleViewChange("favorites")}
                className="w-full flex items-center space-x-2 lg:space-x-3 p-1.5 lg:p-2 rounded-lg hover:bg-gray-800 transition-colors"
                title="Heart-SB"
              >
                <Heart className="h-3 w-3 lg:h-4 lg:w-4 text-green-500 flex-shrink-0" />
                {!sidebarCollapsed && (
                  <span className="text-xs lg:text-sm">Liked Songs</span>
                )}
              </button>

              {playlists.map((playlist) => (
                <div key={playlist.id} className="flex items-center group">
                  <button
                    title={playlist.name}
                    onClick={() => handlePlaylistSelect(playlist.id)}
                    className="w-full flex items-center space-x-2 lg:space-x-3 p-1.5 lg:p-2 rounded-lg hover:bg-gray-800 transition-colors text-left"
                  >
                    <img
                      src={playlist.coverUrl}
                      alt={playlist.name}
                      className="h-6 w-6 lg:h-8 lg:w-8 rounded object-cover flex-shrink-0"
                    />
                    {!sidebarCollapsed && (
                      <div className="flex-1 min-w-0">
                        <p className="text-xs lg:text-sm font-medium truncate">
                          {playlist.name}
                        </p>
                        <p className="text-xs text-gray-400 truncate">
                          {playlist.songs?.length ?? 0} songs
                        </p>
                      </div>
                    )}
                  </button>

                  {!sidebarCollapsed && (
                    <>
                      <button
                        onClick={() => handleEditPlaylist(playlist)}
                        className="ml-1 p-1 rounded hover:bg-gray-700 transition-colors opacity-0 group-hover:opacity-100"
                        title="Edit Button-SB"
                      >
                        <Pencil className="h-4 w-4 text-green-500" />
                      </button>
                      <button
                        onClick={() => setConfirmDeleteId(playlist.id)}
                        className="ml-1 p-1 rounded hover:bg-gray-700 transition-colors opacity-0 group-hover:opacity-100"
                        title="Delete Button-SB"
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </button>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        </nav>
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
                  onChange={handleNewPlaylistNameChange}
                  placeholder="Enter playlist name"
                  className={`w-full px-3 py-2 bg-gray-700 rounded-lg border focus:outline-none focus:ring-2 ${
                    newPlaylistNameError
                      ? "border-red-500 focus:ring-red-500"
                      : newPlaylistName.trim().length === 0
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-600 focus:ring-green-500"
                  }`}
                  required
                  minLength={1}
                />
                {newPlaylistNameError && (
                  <p className="text-red-400 text-sm mt-1">
                    {newPlaylistNameError}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Playlist Image Url
                </label>
                <input
                  type="text"
                  value={newPlaylistUrl}
                  onChange={handleNewPlaylistUrlChange}
                  placeholder="Enter playlist URL"
                  className={`w-full px-3 py-2 bg-gray-700 rounded-lg border focus:outline-none focus:ring-2 ${
                    newPlaylistUrlError
                      ? "border-red-500 focus:ring-red-500"
                      : newPlaylistUrl.trim().length === 0
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-600 focus:ring-green-500"
                  }`}
                  required
                  minLength={1}
                />
                {newPlaylistUrlError && (
                  <p className="text-red-400 text-sm mt-1">
                    {newPlaylistUrlError}
                  </p>
                )}
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
                  onClick={() => {
                    setShowCreateModal(false);
                    setNewPlaylistName("");
                    setNewPlaylistDescription("");
                    setNewPlaylistNameError("");
                  }}
                  className="flex-1 px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded-lg transition-colors"
                  title="Cancel Button"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreatePlaylist}
                  disabled={!newPlaylistName.trim() || !!newPlaylistNameError}
                  className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-lg transition-colors"
                >
                  Create
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {editPlaylistId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Edit Playlist</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Playlist Name
                </label>
                <input
                  type="text"
                  value={editPlaylistName}
                  onChange={handleEditPlaylistNameChange}
                  placeholder="Enter playlist name"
                  className={`w-full px-3 py-2 bg-gray-700 rounded-lg border focus:outline-none focus:ring-2 ${
                    editPlaylistNameError
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-600 focus:ring-green-500"
                  }`}
                />
                {editPlaylistNameError && (
                  <p className="text-red-400 text-sm mt-1">
                    {editPlaylistNameError}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Description
                </label>
                <textarea
                  value={editPlaylistDescription}
                  onChange={(e) => setEditPlaylistDescription(e.target.value)}
                  placeholder="Enter playlist description"
                  rows={3}
                  className="w-full px-3 py-2 bg-gray-700 rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
                />
              </div>
              <div className="flex space-x-3 pt-4">
                <button
                  onClick={() => {
                    setEditPlaylistId(null);
                    setEditPlaylistName("");
                    setEditPlaylistDescription("");
                    setEditPlaylistNameError("");
                  }}
                  className="flex-1 px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdatePlaylist}
                  disabled={!editPlaylistName.trim() || !!editPlaylistNameError}
                  className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-lg transition-colors"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {confirmDeleteId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-lg p-6 w-full max-w-sm">
            <h2 className="text-lg font-bold mb-4 text-red-500">
              Delete Playlist
            </h2>
            <p className="mb-6 text-gray-200">
              Are you sure you want to delete this playlist?
            </p>
            <div className="flex space-x-3">
              <button
                onClick={() => setConfirmDeleteId(null)}
                className="flex-1 px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeletePlaylist(confirmDeleteId)}
                className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;
