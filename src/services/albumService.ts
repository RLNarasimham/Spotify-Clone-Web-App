import { Album } from "../types";
import { mockAlbums } from "../data/mockData";

class AlbumService {
  private albums: Album[] = mockAlbums;

  async getAllAlbums(): Promise<Album[]> {
    try {
      await new Promise((resolve) => setTimeout(resolve, 800));

      return this.albums;
    } catch (error) {
      throw new Error("Failed to fetch albums", error);
    }
  }

  async getAlbumById(id: string): Promise<Album | null> {
    try {
      await new Promise((resolve) => setTimeout(resolve, 300));

      return this.albums.find((album) => album.id === id) || null;
    } catch (error) {
      throw new Error(`Failed to fetch album with ID: ${id} -- ${error}`);
    }
  }

  async getAlbumsByArtist(artist: string): Promise<Album[]> {
    try {
      await new Promise((resolve) => setTimeout(resolve, 400));

      return this.albums.filter((album) =>
        album.artist.toLowerCase().includes(artist.toLowerCase())
      );
    } catch (error) {
      throw new Error(
        `Failed to fetch albums by artist: ${artist}  -- ${error}`
      );
    }
  }

  async getAlbumsByGenre(genre: string): Promise<Album[]> {
    try {
      await new Promise((resolve) => setTimeout(resolve, 400));

      return this.albums.filter((album) =>
        album.genre?.toLowerCase().includes(genre.toLowerCase())
      );
    } catch (error) {
      throw new Error(`Failed to fetch albums by genre: ${genre} -- ${error}`);
    }
  }

  async searchAlbums(query: string): Promise<Album[]> {
    try {
      await new Promise((resolve) => setTimeout(resolve, 300));

      const lowerQuery = query.toLowerCase();
      return this.albums.filter(
        (album) =>
          album.title.toLowerCase().includes(lowerQuery) ||
          album.artist.toLowerCase().includes(lowerQuery) ||
          album.genre?.toLowerCase().includes(lowerQuery)
      );
    } catch (error) {
      throw new Error(
        `Failed to search albums with query: ${query} -- ${error}`
      );
    }
  }

  async getPopularAlbums(limit: number = 10): Promise<Album[]> {
    try {
      await new Promise((resolve) => setTimeout(resolve, 400));

      return this.albums
        .sort((a, b) => (b.popularity || 0) - (a.popularity || 0))
        .slice(0, limit);
    } catch (error) {
      throw new Error("Failed to fetch popular albums", error);
    }
  }

  async getRecentAlbums(limit: number = 10): Promise<Album[]> {
    try {
      await new Promise((resolve) => setTimeout(resolve, 400));

      return this.albums
        .sort((a, b) => (b.year || 0) - (a.year || 0))
        .slice(0, limit);
    } catch (error) {
      throw new Error("Failed to fetch recent albums", error);
    }
  }

  async getRecommendedAlbums(
    userId: string,
    limit: number = 10
  ): Promise<Album[]> {
    try {
      await new Promise((resolve) => setTimeout(resolve, 600));

      return this.albums.sort(() => Math.random() - 0.5).slice(0, limit);
    } catch (error) {
      throw new Error("Failed to fetch recommended albums", error);
    }
  }
}

export const albumService = new AlbumService();
