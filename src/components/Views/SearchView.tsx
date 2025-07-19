import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAppDispatch, useAppSelector } from "../../hooks/useRedux";
import { playSong } from "../../store/playerSlice";
import {
  addToRecentlyPlayed,
  addToFavorites,
  removeFromFavorites,
  setSearchQuery,
  setSearchResults,
} from "../../store/librarySlice";
import { Heart, MoreHorizontal, Search, Loader2 } from "lucide-react";
import { Song } from "../../types";

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

const SearchView: React.FC = () => {
  const dispatch = useAppDispatch();
  const [searchQuery, setSearchQueryLocal] = useState<string>("");
  const [searchResults, setSearchResultsLocal] = useState<Song[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { songs, favorites } = useAppSelector((state) => state.library);

  const handlePlaySong = (song: Song) => {
    dispatch(
      playSong({
        song,
        queue: searchResults.length > 0 ? searchResults : songs,
      })
    );
    dispatch(addToRecentlyPlayed(song));
  };

  const searchMusic = async (query: string) => {
    if (!query.trim()) {
      setSearchResultsLocal([]);
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

      setSearchResultsLocal(songs);
      dispatch(setSearchQuery(query));
      dispatch(setSearchResults(songs));
    } catch (error) {
      console.error("Error searching music:", error);
      setSearchResultsLocal([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchQuery) {
        searchMusic(searchQuery);
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

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

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const displaySongs = searchResults.length > 0 ? searchResults : songs;

  return (
    <div className="space-y-4 lg:space-y-6">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
        <input
          type="text"
          placeholder="Search for songs, artists, or albums..."
          value={searchQuery}
          onChange={(e) => setSearchQueryLocal(e.target.value)}
          className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
        />
        {isLoading && (
          <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5 animate-spin" />
        )}
      </div>

      {searchQuery ? (
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold mb-1 lg:mb-2">
            Search Results
          </h1>
          <p className="text-gray-400 mb-4 lg:mb-6 text-sm lg:text-base">
            {searchResults.length > 0
              ? `Found ${searchResults.length} results for "${searchQuery}"`
              : `No results found for "${searchQuery}"`}
          </p>
        </div>
      ) : (
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold mb-1 lg:mb-2">
            Browse All
          </h1>
          <p className="text-gray-400 mb-4 lg:mb-6 text-sm lg:text-base">
            Discover new music and artists
          </p>
        </div>
      )}

      <div className="space-y-1 lg:space-y-2">
        {displaySongs.map((song, index) => (
          <div
            key={song.id}
            className="flex items-center space-x-3 lg:space-x-4 p-2 lg:p-3 hover:bg-gray-800 rounded-lg transition-colors cursor-pointer group"
            onClick={() => handlePlaySong(song)}
          >
            <span className="text-gray-400 text-xs lg:text-sm w-4 lg:w-6 flex-shrink-0">
              {index + 1}
            </span>
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
            <span className="text-gray-400 text-xs lg:text-sm hidden md:block flex-shrink-0">
              {song.album}
            </span>
            <span className="text-gray-400 text-xs lg:text-sm hidden sm:block flex-shrink-0">
              {formatTime(song.duration)}
            </span>
            <div className="flex items-center space-x-1 lg:space-x-2 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
              <button
                className="p-1 hover:bg-gray-700 rounded"
                onClick={(e) => handleToggleFavorite(song, e)}
              >
                <Heart
                  className={`h-3 w-3 lg:h-4 lg:w-4 ${
                    isFavorite(song.id)
                      ? "text-green-500 fill-current"
                      : "text-gray-400"
                  }`}
                />
              </button>
              <button className="p-1 hover:bg-gray-700 rounded">
                <MoreHorizontal className="h-3 w-3 lg:h-4 lg:w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SearchView;
