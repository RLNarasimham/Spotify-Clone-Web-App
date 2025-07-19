import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../hooks/useRedux";
import { playSong } from "../../store/playerSlice";
import {
  addToRecentlyPlayed,
  addToFavorites,
  removeFromFavorites,
} from "../../store/librarySlice";
import { setCurrentView, setSelectedPlaylist } from "../../store/uiSlice";
import axios from "axios";
import { Play, Heart, MoreHorizontal, Search, Loader2 } from "lucide-react";
import { Song } from "../../types";
import { useRef } from "react";

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

const HomeView: React.FC = () => {
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [addToPlaylistSong, setAddToPlaylistSong] = useState<Song | null>(null);
  const [shareSong, setShareSong] = useState<Song | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [searchResults, setSearchResults] = useState<Song[]>([]);
  const [trendingSongs, setTrendingSongs] = useState<Song[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isLoadingTrending, setIsLoadingTrending] = useState<boolean>(true);

  const menuRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

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
  });

  const searchMusic = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.get<iTunesResponse>(
        `https://itunes.apple.com/search?term=${encodeURIComponent(
          query
        )}&media=music&entity=song&limit=20`
      );

      const songs = response.data.results
        .filter((track) => track.previewUrl)
        .map(convertToSong);

      setSearchResults(songs);
      dispatch(setSearchQuery(query));
      dispatch(setSearchResults(songs));
    } catch (error) {
      console.error("Error searching music:", error);
      setSearchResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  const loadTrendingSongs = async () => {
    setIsLoadingTrending(true);
    try {
      const trendingArtists = [
        "Taylor Swift",
        "Ed Sheeran",
        "Billie Eilish",
        "The Weeknd",
        "Dua Lipa",
        "Harry Styles",
        "Ariana Grande",
        "Post Malone",
        "Drake",
        "Olivia Rodrigo",
      ];

      const randomArtist =
        trendingArtists[Math.floor(Math.random() * trendingArtists.length)];

      const response = await axios.get<iTunesResponse>(
        `https://itunes.apple.com/search?term=${encodeURIComponent(
          randomArtist
        )}&media=music&entity=song&limit=10`
      );

      const songs = response.data.results
        .filter((track) => track.previewUrl)
        .map(convertToSong);

      setTrendingSongs(songs);
    } catch (error) {
      console.error("Error loading trending songs:", error);
      setTrendingSongs([]);
    } finally {
      setIsLoadingTrending(false);
    }
  };

  useEffect(() => {
    loadTrendingSongs();
  }, []);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchQuery) {
        searchMusic(searchQuery);
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        openMenuId &&
        menuRefs.current[openMenuId] &&
        !menuRefs.current[openMenuId]?.contains(event.target as Node)
      ) {
        setOpenMenuId(null);
      }
    };
    if (openMenuId) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [openMenuId]);

  const dispatch = useAppDispatch();
  const { songs, playlists, recentlyPlayed, favorites } = useAppSelector(
    (state) => state.library
  );

  const handlePlaySong = (song: Song) => {
    dispatch(
      playSong({
        song,
        queue: searchResults.length > 0 ? searchResults : trendingSongs,
      })
    );
    dispatch(addToRecentlyPlayed(song));
  };

  const handlePlaylistClick = (playlistId: string) => {
    dispatch(setCurrentView("playlist"));
    dispatch(setSelectedPlaylist(playlistId));
  };

  const handlePlayPlaylist = (playlistId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const playlist = playlists.find((p) => p.id === playlistId);
    if (playlist && playlist.songs.length > 0) {
      dispatch(playSong({ song: playlist.songs[0], queue: playlist.songs }));
      dispatch(addToRecentlyPlayed(playlist.songs[0]));
    }
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

  const handleAddSongToPlaylist = (playlistId: string) => {
    if (!addToPlaylistSong) return;
    dispatch({
      type: "library/addSongToPlaylist",
      payload: { playlistId, song: addToPlaylistSong },
    });
    setAddToPlaylistSong(null);
    setOpenMenuId(null);
  };

  const isFavorite = (songId: string) => {
    return favorites.some((fav) => fav.id === songId);
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const songsToDisplay =
    searchResults.length > 0 ? searchResults : trendingSongs;

  return (
    <div className="space-y-6 lg:space-y-8">
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg p-4 lg:p-8 text-white">
        <h1 className="text-2xl lg:text-4xl font-bold mb-1 lg:mb-2">
          Hello!! Dive into Music World!!
        </h1>
        <p className="text-base lg:text-xl opacity-90">
          Ready to discover your next favorite song?
        </p>
      </div>

      <div className="relative">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="text"
            placeholder="Search for songs, artists, or albums..."
            value={searchQuery}
            onChange={(e) => {
              const query = e.target.value;
              dispatch(setSearchQuery(query));

              if (query.trim()) {
                const results = songs.filter(
                  (song) =>
                    song.title.toLowerCase().includes(query.toLowerCase()) ||
                    song.artist.toLowerCase().includes(query.toLowerCase()) ||
                    song.album.toLowerCase().includes(query.toLowerCase())
                );
                dispatch(setSearchResults(results));
                dispatch(setCurrentView("search"));
              } else {
                dispatch(setSearchResults([]));
              }
            }}
            className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
          />
          {isLoading && (
            <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5 animate-spin" />
          )}
        </div>
        {searchQuery && (
          <div className="mt-2 text-sm text-gray-400">
            {searchResults.length > 0
              ? `Found ${searchResults.length} results for "${searchQuery}"`
              : isLoading
              ? "Searching..."
              : "No results found"}
          </div>
        )}
      </div>

      {playlists.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-4">
          {playlists.slice(0, 6).map((playlist) => (
            <div
              key={playlist.id}
              className="bg-gray-800 rounded-lg p-3 lg:p-4 hover:bg-gray-700 transition-colors cursor-pointer group"
              onClick={() => handlePlaylistClick(playlist.id)}
            >
              <div className="flex items-center space-x-3 lg:space-x-4">
                <img
                  src={playlist.coverUrl}
                  alt={playlist.name}
                  className="w-12 h-12 lg:w-16 lg:h-16 rounded object-cover flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-white text-sm lg:text-base truncate">
                    {playlist.name}
                  </h3>
                  <p className="text-xs lg:text-sm text-gray-400">
                    {playlist.songs?.length ?? 0} songs
                  </p>
                </div>
                <button
                  className="opacity-0 group-hover:opacity-100 transition-opacity bg-green-500 hover:bg-green-400 rounded-full p-1.5 lg:p-2 flex-shrink-0"
                  onClick={(e) => handlePlayPlaylist(playlist.id, e)}
                  title="Play Playlist"
                >
                  <Play className="h-3 w-3 lg:h-4 lg:w-4 text-black fill-current" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {recentlyPlayed.length > 0 && (
        <div>
          <h2 className="text-xl lg:text-2xl font-bold mb-3 lg:mb-4">
            Recently Played
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 lg:gap-4">
            {recentlyPlayed.slice(0, 6).map((song) => (
              <div
                key={song.id}
                className="bg-gray-800 rounded-lg p-3 lg:p-4 hover:bg-gray-700 transition-colors cursor-pointer group"
                onClick={() => handlePlaySong(song)}
              >
                <div className="relative mb-3 lg:mb-4">
                  <img
                    src={song.image}
                    alt={song.title}
                    className="w-full aspect-square object-cover rounded-md"
                  />
                  <button
                    className="absolute bottom-1 right-1 lg:bottom-2 lg:right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-green-500 hover:bg-green-400 rounded-full p-1.5 lg:p-2"
                    title="Play Song"
                  >
                    <Play className="h-3 w-3 lg:h-4 lg:w-4 text-black fill-current" />
                  </button>
                </div>
                <h3 className="font-semibold text-white truncate text-sm lg:text-base">
                  {song.title}
                </h3>
                <p className="text-xs lg:text-sm text-gray-400 truncate">
                  {song.artist}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      <div>
        <h2 className="text-xl lg:text-2xl font-bold mb-3 lg:mb-4">
          {searchQuery ? "Search Results" : "Trending Now"}
        </h2>

        {isLoadingTrending && !searchQuery ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-purple-500" />
            <span className="ml-2 text-gray-400">
              Loading trending songs...
            </span>
          </div>
        ) : (
          <div className="space-y-1 lg:space-y-2">
            {songsToDisplay.slice(0, 10).map((song, index) => (
              <div
                key={song.id}
                className="flex items-center space-x-3 lg:space-x-4 p-2 lg:p-3 hover:bg-gray-800 rounded-lg transition-colors cursor-pointer group"
                onClick={() => handlePlaySong(song)}
              >
                <span className="text-gray-400 text-xs lg:text-sm w-3 lg:w-4 flex-shrink-0">
                  {index + 1}
                </span>
                <img
                  src={song.image}
                  alt={song.title}
                  className="w-10 h-10 lg:w-12 lg:h-12 rounded object-cover flex-shrink-0"
                  onError={(e) => {
                    e.currentTarget.src =
                      "https://via.placeholder.com/100x100/1f2937/9ca3af?text=Music";
                  }}
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
                <div className="flex items-center space-x-1 lg:space-x-2 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 relative">
                  <button
                    className="p-1 hover:bg-gray-700 rounded"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToggleFavorite(song, e);
                    }}
                    title="Add to Favorites"
                  >
                    <Heart
                      className={`h-3 w-3 lg:h-4 lg:w-4 ${
                        isFavorite(song.id)
                          ? "text-green-500 fill-current"
                          : "text-gray-400"
                      }`}
                    />
                  </button>

                  <div
                    ref={(el) => (menuRefs.current[song.id] = el)}
                    className="relative"
                  >
                    <button
                      className="p-1 hover:bg-gray-700 rounded"
                      onClick={(e) => {
                        e.stopPropagation();
                        setOpenMenuId(openMenuId === song.id ? null : song.id);
                      }}
                      title="More Options"
                    >
                      <MoreHorizontal className="h-3 w-3 lg:h-4 lg:w-4" />
                    </button>
                    {openMenuId === song.id && (
                      <div
                        className="absolute right-0 mt-2 w-36 bg-gray-900 border border-gray-700 rounded shadow-lg z-10"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <button
                          className="block w-full text-left px-4 py-2 text-sm text-white hover:bg-gray-700"
                          onClick={() => {
                            setAddToPlaylistSong(song);
                          }}
                          title="Add to Playlist"
                        >
                          Add to Playlist
                        </button>
                        <button
                          className="block w-full text-left px-4 py-2 text-sm text-white hover:bg-gray-700"
                          onClick={() => {
                            setOpenMenuId(null);
                            setShareSong(song);
                          }}
                          title="Share Song"
                        >
                          Share
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {addToPlaylistSong && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40"
          onClick={() => setAddToPlaylistSong(null)}
        >
          <div
            className="bg-gray-900 rounded p-4 w-80 max-h-96 overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <h4 className="text-white mb-2">Add to which playlist?</h4>
            <ul className="space-y-1">
              {playlists.map((pl) => (
                <li key={pl.id}>
                  <button
                    className="w-full text-left px-3 py-2 text-white hover:bg-gray-700 rounded"
                    onClick={() => handleAddSongToPlaylist(pl.id)}
                    title={`Add to ${pl.name}`}
                  >
                    {pl.name}
                  </button>
                </li>
              ))}
            </ul>
            <button
              className="mt-3 w-full px-3 py-2 bg-gray-700 text-white rounded hover:bg-gray-600"
              onClick={() => setAddToPlaylistSong(null)}
              title="Cancel"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {shareSong && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40"
          onClick={() => setShareSong(null)}
        >
          <div
            className="bg-gray-900 rounded p-4 w-80"
            onClick={(e) => e.stopPropagation()}
          >
            <h4 className="text-white mb-2">Share "{shareSong.title}"</h4>
            <ul className="space-y-1">
              <li>
                <button
                  className="w-full text-left px-3 py-2 text-white hover:bg-gray-700 rounded"
                  onClick={() => {
                    navigator.clipboard.writeText(
                      window.location.href + `?song=${shareSong.id}`
                    );
                    setShareSong(null);
                    alert("Link copied to clipboard!");
                  }}
                  title="Copy Link"
                >
                  Copy Link
                </button>
              </li>
              <li>
                <button
                  className="w-full text-left px-3 py-2 text-white hover:bg-gray-700 rounded"
                  onClick={() => {
                    window.open(
                      `https://twitter.com/intent/tweet?text=Check out this song: ${encodeURIComponent(
                        shareSong.title
                      )}&url=${encodeURIComponent(
                        window.location.href + `?song=${shareSong.id}`
                      )}`,
                      "_blank"
                    );
                    setShareSong(null);
                  }}
                  title="Share on Twitter"
                >
                  Share on Twitter
                </button>
              </li>
              <li>
                <button
                  className="w-full text-left px-3 py-2 text-white hover:bg-gray-700 rounded"
                  onClick={() => {
                    window.open(
                      `https://wa.me/?text=Check out this song: ${encodeURIComponent(
                        shareSong.title
                      )} ${encodeURIComponent(
                        window.location.href + `?song=${shareSong.id}`
                      )}`,
                      "_blank"
                    );
                    setShareSong(null);
                  }}
                  title="Share on WhatsApp"
                >
                  Share on WhatsApp
                </button>
              </li>
            </ul>
            <button
              className="mt-3 w-full px-3 py-2 bg-gray-700 text-white rounded hover:bg-gray-600"
              onClick={() => setShareSong(null)}
              title="Cancel"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomeView;
