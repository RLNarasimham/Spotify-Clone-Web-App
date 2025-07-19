import React, { useState, useMemo } from "react";
import { Search, Filter, Grid, List } from "lucide-react";
import { useAlbums } from "../../hooks/useAlbums";
import { Album } from "../../types";
import LoadingSpinner from "../Common/LoadingSpinner";
import ErrorMessage from "../Common/ErrorMessage";
import AlbumCard from "../Albums/AlbumCard";
import AlbumList from "../Albums/AlbumList";
import AlbumDetailModal from "../Albums/AlbumDetailModal";
import FilterPanel from "../Albums/FilterPanel";

type ViewMode = "grid" | "list";
type SortOption = "name" | "artist" | "year" | "popularity";

const AlbumsView: React.FC = () => {
  const { albums, loading, error, refetch } = useAlbums();
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [yearRange, setYearRange] = useState<[number, number]>([1960, 2024]);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedAlbum, setSelectedAlbum] = useState<Album | null>(null);
  const [playingAlbumId, setPlayingAlbumId] = useState<string | null>(null);

  const availableGenres = useMemo(() => {
    const genres = new Set<string>();
    albums.forEach((album) => {
      if (album.genre) {
        album.genre.split(",").forEach((g) => genres.add(g.trim()));
      }
    });
    return Array.from(genres).sort();
  }, [albums]);

  const filteredAlbums = useMemo(() => {
    // let filtered = albums.filter((album) => {
    const filtered = albums.filter((album) => {
      const matchesSearch =
        album.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        album.artist.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesGenre =
        selectedGenres.length === 0 ||
        (album.genre &&
          selectedGenres.some((genre) =>
            album.genre.toLowerCase().includes(genre.toLowerCase())
          ));

      const albumYear = album.year || 2000;
      const matchesYear =
        albumYear >= yearRange[0] && albumYear <= yearRange[1];

      return matchesSearch && matchesGenre && matchesYear;
    });

    filtered.sort((a, b) => {
      let comparison = 0;

      switch (sortBy) {
        case "name":
          comparison = a.title.localeCompare(b.title);
          break;
        case "artist":
          comparison = a.artist.localeCompare(b.artist);
          break;
        case "year":
          comparison = (a.year || 0) - (b.year || 0);
          break;
        case "popularity":
          comparison = (a.popularity || 0) - (b.popularity || 0);
          break;
      }

      return sortOrder === "asc" ? comparison : -comparison;
    });

    return filtered;
  }, [albums, searchTerm, sortBy, sortOrder, selectedGenres, yearRange]);

  const handlePlayAlbum = (albumId: string) => {
    if (playingAlbumId === albumId) {
      setPlayingAlbumId(null);
    } else {
      setPlayingAlbumId(albumId);
    }
  };

  const handleAlbumClick = (album: Album) => {
    setSelectedAlbum(album);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-96">
        <ErrorMessage message={error} onRetry={refetch} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
      <div className="bg-gradient-to-r from-emerald-600 to-blue-600 p-8">
        <h1 className="text-4xl font-bold mb-2">Your Albums</h1>
        <p className="text-emerald-100 text-lg">
          {filteredAlbums.length}{" "}
          {filteredAlbums.length === 1 ? "album" : "albums"}
        </p>
      </div>

      <div className="sticky top-0 bg-gray-900/95 backdrop-blur-sm border-b border-gray-700 p-6 z-10">
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search albums or artists..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-white placeholder-gray-400"
            />
          </div>

          <div className="flex items-center gap-4">
            <select
              value={`${sortBy}-${sortOrder}`}
              onChange={(e) => {
                const [field, order] = e.target.value.split("-");
                setSortBy(field as SortOption);
                setSortOrder(order as "asc" | "desc");
              }}
              className="bg-gray-800 border border-gray-600 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-emerald-500"
            >
              <option value="name-asc">Name A-Z</option>
              <option value="name-desc">Name Z-A</option>
              <option value="artist-asc">Artist A-Z</option>
              <option value="artist-desc">Artist Z-A</option>
              <option value="year-desc">Newest First</option>
              <option value="year-asc">Oldest First</option>
              <option value="popularity-desc">Most Popular</option>
              <option value="popularity-asc">Least Popular</option>
            </select>

            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all duration-200 ${
                showFilters || selectedGenres.length > 0
                  ? "bg-emerald-600 border-emerald-500 text-white"
                  : "bg-gray-800 border-gray-600 text-gray-300 hover:bg-gray-700"
              }`}
            >
              <Filter className="w-4 h-4" />
              Filters
              {selectedGenres.length > 0 && (
                <span className="bg-emerald-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                  {selectedGenres.length}
                </span>
              )}
            </button>

            <div className="flex bg-gray-800 rounded-lg border border-gray-600 overflow-hidden">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 transition-colors ${
                  viewMode === "grid"
                    ? "bg-emerald-600 text-white"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                <Grid className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 transition-colors ${
                  viewMode === "list"
                    ? "bg-emerald-600 text-white"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                <List className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {showFilters && (
          <FilterPanel
            availableGenres={availableGenres}
            selectedGenres={selectedGenres}
            onGenresChange={setSelectedGenres}
            yearRange={yearRange}
            onYearRangeChange={setYearRange}
            onClearFilters={() => {
              setSelectedGenres([]);
              setYearRange([1960, 2024]);
            }}
          />
        )}
      </div>

      <div className="p-6">
        {filteredAlbums.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-gray-400 mb-4">
              <Search className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p className="text-xl mb-2">No albums found</p>
              <p>Try adjusting your search or filters</p>
            </div>
          </div>
        ) : viewMode === "grid" ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
            {filteredAlbums.map((album) => (
              <AlbumCard
                key={album.id}
                album={album}
                isPlaying={playingAlbumId === album.id}
                onPlay={() => handlePlayAlbum(album.id)}
                onClick={() => handleAlbumClick(album)}
              />
            ))}
          </div>
        ) : (
          <AlbumList
            albums={filteredAlbums}
            playingAlbumId={playingAlbumId}
            onPlay={handlePlayAlbum}
            onAlbumClick={handleAlbumClick}
          />
        )}
      </div>

      {selectedAlbum && (
        <AlbumDetailModal
          album={selectedAlbum}
          isOpen={!!selectedAlbum}
          onClose={() => setSelectedAlbum(null)}
          isPlaying={playingAlbumId === selectedAlbum.id}
          onPlay={() => handlePlayAlbum(selectedAlbum.id)}
        />
      )}
    </div>
  );
};

export default AlbumsView;
