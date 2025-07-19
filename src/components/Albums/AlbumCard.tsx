import React, { useState } from "react";
import { Play, Pause, Heart, MoreHorizontal, Plus } from "lucide-react";
import { Album } from "../../types";

interface AlbumCardProps {
  album: Album;
  isPlaying: boolean;
  onPlay: () => void;
  onClick: () => void;
}

const AlbumCard: React.FC<AlbumCardProps> = ({
  album,
  isPlaying,
  onPlay,
  onClick,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  const handlePlayClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onPlay();
  };

  const handleLikeClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsLiked(!isLiked);
  };

  const handleMoreClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <div
      className="group relative bg-gray-800/50 rounded-lg p-4 transition-all duration-300 hover:bg-gray-700/50 hover:scale-105 cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
    >
      <div className="relative aspect-square mb-4 overflow-hidden rounded-lg shadow-lg">
        <img
          src={album.coverUrl}
          alt={album.title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
          onError={(e) => {
            e.currentTarget.src = `https://images.pexels.com/photos/1387153/pexels-photo-1387153.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop`;
          }}
        />

        <div
          className={`absolute inset-0 bg-black/40 flex items-center justify-center transition-opacity duration-200 ${
            isHovered ? "opacity-100" : "opacity-0"
          }`}
        >
          <button
            onClick={handlePlayClick}
            className="bg-emerald-500 hover:bg-emerald-400 text-white p-3 rounded-full shadow-lg transform transition-all duration-200 hover:scale-110"
          >
            {isPlaying ? (
              <Pause className="w-6 h-6" />
            ) : (
              <Play className="w-6 h-6 ml-1" />
            )}
          </button>
        </div>

        <div
          className={`absolute top-2 right-2 flex gap-1 transition-opacity duration-200 ${
            isHovered ? "opacity-100" : "opacity-0"
          }`}
        >
          <button
            onClick={handleLikeClick}
            className={`p-2 rounded-full backdrop-blur-sm transition-all duration-200 ${
              isLiked
                ? "bg-red-500/80 text-white"
                : "bg-black/50 text-gray-300 hover:text-white"
            }`}
          >
            <Heart className={`w-4 h-4 ${isLiked ? "fill-current" : ""}`} />
          </button>
          <button
            onClick={handleMoreClick}
            className="p-2 rounded-full bg-black/50 backdrop-blur-sm text-gray-300 hover:text-white transition-colors duration-200"
          >
            <MoreHorizontal className="w-4 h-4" />
          </button>
        </div>

        {isPlaying && (
          <div className="absolute bottom-2 left-2">
            <div className="flex items-center gap-1">
              <div className="w-1 h-4 bg-emerald-500 rounded-full animate-pulse"></div>
              <div className="w-1 h-3 bg-emerald-500 rounded-full animate-pulse delay-75"></div>
              <div className="w-1 h-5 bg-emerald-500 rounded-full animate-pulse delay-150"></div>
            </div>
          </div>
        )}
      </div>

      <div className="space-y-1">
        <h3 className="font-semibold text-white truncate group-hover:text-emerald-400 transition-colors duration-200">
          {album.title}
        </h3>
        <p className="text-sm text-gray-400 truncate hover:text-gray-300 transition-colors">
          {album.artist}
        </p>
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>{album.year}</span>
          {album.trackCount && <span>{album.trackCount} tracks</span>}
        </div>
      </div>

      <div
        className={`mt-3 flex items-center gap-2 transition-all duration-200 ${
          isHovered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
        }`}
      >
        <button className="flex-1 text-xs bg-gray-700 hover:bg-gray-600 text-gray-300 hover:text-white py-2 px-3 rounded-md transition-all duration-200 flex items-center justify-center gap-1">
          <Plus className="w-3 h-3" />
          Add to Playlist
        </button>
      </div>
    </div>
  );
};

export default AlbumCard;
