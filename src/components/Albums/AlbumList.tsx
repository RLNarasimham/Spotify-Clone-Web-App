import React, { useState } from "react";
import {
  Play,
  Pause,
  Heart,
  MoreHorizontal,
  Clock,
  Calendar,
} from "lucide-react";
import { Album } from "../../types";

interface AlbumListProps {
  albums: Album[];
  playingAlbumId: string | null;
  onPlay: (albumId: string) => void;
  onAlbumClick: (album: Album) => void;
}

const AlbumList: React.FC<AlbumListProps> = ({
  albums,
  playingAlbumId,
  onPlay,
  onAlbumClick,
}) => {
  const [hoveredAlbum, setHoveredAlbum] = useState<string | null>(null);

  const formatDuration = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  return (
    <div className="bg-gray-800/30 rounded-lg overflow-hidden">

      <div className="grid grid-cols-12 gap-4 p-4 border-b border-gray-700 text-sm font-medium text-gray-400 uppercase tracking-wider">
        <div className="col-span-1 text-center">#</div>
        <div className="col-span-4">Album</div>
        <div className="col-span-3">Artist</div>
        <div className="col-span-2 hidden md:block">
          <div className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            Year
          </div>
        </div>
        <div className="col-span-1 hidden lg:block">
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            Duration
          </div>
        </div>
        <div className="col-span-1"></div>
      </div>

      <div className="divide-y divide-gray-700/50">
        {albums.map((album, index) => {
          const isPlaying = playingAlbumId === album.id;
          const isHovered = hoveredAlbum === album.id;

          return (
            <div
              key={album.id}
              className="grid grid-cols-12 gap-4 p-4 hover:bg-gray-700/30 transition-all duration-200 group cursor-pointer"
              onMouseEnter={() => setHoveredAlbum(album.id)}
              onMouseLeave={() => setHoveredAlbum(null)}
              onClick={() => onAlbumClick(album)}
            >

              <div className="col-span-1 flex items-center justify-center">
                {isHovered || isPlaying ? (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onPlay(album.id);
                    }}
                    className="p-1 rounded-full hover:bg-gray-600 transition-colors"
                  >
                    {isPlaying ? (
                      <Pause className="w-4 h-4 text-emerald-500" />
                    ) : (
                      <Play className="w-4 h-4 text-white" />
                    )}
                  </button>
                ) : (
                  <span className="text-gray-400 text-sm">{index + 1}</span>
                )}
              </div>

              <div className="col-span-4 flex items-center gap-3 min-w-0">
                <div className="relative flex-shrink-0">
                  <img
                    src={album.coverUrl}
                    alt={album.title}
                    className="w-12 h-12 rounded-md object-cover"
                    onError={(e) => {
                      e.currentTarget.src = `https://images.pexels.com/photos/1387153/pexels-photo-1387153.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop`;
                    }}
                  />
                  {isPlaying && (
                    <div className="absolute inset-0 bg-black/50 rounded-md flex items-center justify-center">
                      <div className="flex items-center gap-1">
                        <div className="w-1 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                        <div className="w-1 h-3 bg-emerald-500 rounded-full animate-pulse delay-75"></div>
                        <div className="w-1 h-2 bg-emerald-500 rounded-full animate-pulse delay-150"></div>
                      </div>
                    </div>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <h3
                    className={`font-medium truncate transition-colors ${
                      isPlaying
                        ? "text-emerald-500"
                        : "text-white group-hover:text-emerald-400"
                    }`}
                  >
                    {album.title}
                  </h3>
                  <p className="text-sm text-gray-400 truncate">
                    {album.trackCount ? `${album.trackCount} tracks` : "Album"}
                  </p>
                </div>
              </div>

              <div className="col-span-3 flex items-center">
                <span className="text-gray-300 truncate group-hover:text-white transition-colors">
                  {album.artist}
                </span>
              </div>

              <div className="col-span-2 hidden md:flex items-center">
                <span className="text-gray-400 group-hover:text-gray-300 transition-colors">
                  {album.year}
                </span>
              </div>

              <div className="col-span-1 hidden lg:flex items-center">
                <span className="text-gray-400 text-sm group-hover:text-gray-300 transition-colors">
                  {album.duration ? formatDuration(album.duration) : "--:--"}
                </span>
              </div>

              <div className="col-span-1 flex items-center justify-end">
                <div
                  className={`flex items-center gap-1 transition-opacity ${
                    isHovered ? "opacity-100" : "opacity-0"
                  }`}
                >
                  <button
                    onClick={(e) => e.stopPropagation()}
                    className="p-2 rounded-full hover:bg-gray-600 text-gray-400 hover:text-white transition-all"
                  >
                    <Heart className="w-4 h-4" />
                  </button>
                  <button
                    onClick={(e) => e.stopPropagation()}
                    className="p-2 rounded-full hover:bg-gray-600 text-gray-400 hover:text-white transition-all"
                  >
                    <MoreHorizontal className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AlbumList;
