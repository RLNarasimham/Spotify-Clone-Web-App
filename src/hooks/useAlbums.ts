import { useState, useEffect, useCallback } from "react";
import { Album } from "../types";
import { albumService } from "../services/albumService";

interface UseAlbumsReturn {
  albums: Album[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  searchAlbums: (query: string) => Promise<Album[]>;
  getAlbumById: (id: string) => Promise<Album | null>;
  getAlbumsByArtist: (artist: string) => Promise<Album[]>;
  getAlbumsByGenre: (genre: string) => Promise<Album[]>;
}

export const useAlbums = (): UseAlbumsReturn => {
  const [albums, setAlbums] = useState<Album[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAlbums = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await albumService.getAllAlbums();
      setAlbums(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch albums");
    } finally {
      setLoading(false);
    }
  }, []);

  const refetch = useCallback(async () => {
    await fetchAlbums();
  }, [fetchAlbums]);

  const searchAlbums = useCallback(async (query: string): Promise<Album[]> => {
    try {
      return await albumService.searchAlbums(query);
    } catch (err) {
      console.error("Failed to search albums:", err);
      return [];
    }
  }, []);

  const getAlbumById = useCallback(
    async (id: string): Promise<Album | null> => {
      try {
        return await albumService.getAlbumById(id);
      } catch (err) {
        console.error("Failed to get album by ID:", err);
        return null;
      }
    },
    []
  );

  const getAlbumsByArtist = useCallback(
    async (artist: string): Promise<Album[]> => {
      try {
        return await albumService.getAlbumsByArtist(artist);
      } catch (err) {
        console.error("Failed to get albums by artist:", err);
        return [];
      }
    },
    []
  );

  const getAlbumsByGenre = useCallback(
    async (genre: string): Promise<Album[]> => {
      try {
        return await albumService.getAlbumsByGenre(genre);
      } catch (err) {
        console.error("Failed to get albums by genre:", err);
        return [];
      }
    },
    []
  );

  useEffect(() => {
    fetchAlbums();
  }, [fetchAlbums]);

  return {
    albums,
    loading,
    error,
    refetch,
    searchAlbums,
    getAlbumById,
    getAlbumsByArtist,
    getAlbumsByGenre,
  };
};
