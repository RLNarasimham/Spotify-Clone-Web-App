import React, { useState } from "react";
import {
  X,
  Play,
  Pause,
  Heart,
  Share2,
  MoreHorizontal,
  Plus,
  Clock,
  Music,
} from "lucide-react";
import { Album } from "../../types";
import { mockSongs } from "../../data/mockData";

interface AlbumDetailModalProps {
  album: Album;
  isOpen: boolean;
  onClose: () => void;
  isPlaying: boolean;
  onPlay: () => void;
}

const AlbumDetailModal: React.FC<AlbumDetailModalProps> = ({
  album,
  isOpen,
  onClose,
  isPlaying,
  onPlay,
}) => {
  const [playingTrackId, setPlayingTrackId] = useState<string | null>(null);
  const [isLiked, setIsLiked] = useState(false);
  const [hoveredTrack, setHoveredTrack] = useState<string | null>(null);

  const albumTracks = mockSongs.filter((song) => song.albumId === album.id);

  const formatDuration = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const totalDuration = albumTracks.reduce(
    (total, track) => total + track.duration,
    0
  );
  const formatTotalDuration = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) {
      return `${hours} hr ${minutes} min`;
    }
    return `${minutes} min`;
  };

  const handleTrackPlay = (trackId: string) => {
    if (playingTrackId === trackId) {
      setPlayingTrackId(null);
    } else {
      setPlayingTrackId(trackId);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gray-900 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl">

        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-gray-900/80"></div>
          <img
            src={album.coverUrl}
            alt={album.title}
            className="w-full h-64 object-cover"
            onError={(e) => {
              e.currentTarget.src = `https://images.pexels.com/photos/1387153/pexels-photo-1387153.jpeg?auto=compress&cs=tinysrgb&w=800&h=400&fit=crop`;
            }}
          />

          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 bg-black/50 backdrop-blur-sm rounded-full text-white hover:bg-black/70 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>

          <div className="absolute bottom-0 left-0 right-0 p-6">
            <div className="flex items-end gap-6">
              <img
                src={album.coverUrl}
                alt={album.title}
                className="w-32 h-32 rounded-lg shadow-xl"
                onError={(e) => {
                  e.currentTarget.src = `https://images.pexels.com/photos/1387153/pexels-photo-1387153.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop`;
                }}
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-300 uppercase tracking-wider">
                  Album
                </p>
                <h1 className="text-3xl lg:text-5xl font-bold text-white mb-2 truncate">
                  {album.title}
                </h1>
                <div className="flex items-center gap-2 text-gray-300">
                  <span className="font-medium">{album.artist}</span>
                  <span>•</span>
                  <span>{album.year}</span>
                  <span>•</span>
                  <span>{albumTracks.length} songs</span>
                  <span>•</span>
                  <span>{formatTotalDuration(totalDuration)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 border-b border-gray-700">
          <div className="flex items-center gap-4">
            <button
              onClick={onPlay}
              className="bg-emerald-500 hover:bg-emerald-400 text-white p-4 rounded-full shadow-lg transition-all duration-200 hover:scale-105"
            >
              {isPlaying ? (
                <Pause className="w-6 h-6" />
              ) : (
                <Play className="w-6 h-6 ml-1" />
              )}
            </button>

            <button
              onClick={() => setIsLiked(!isLiked)}
              className={`p-3 rounded-full border-2 transition-all duration-200 ${
                isLiked
                  ? "border-red-500 bg-red-500 text-white"
                  : "border-gray-600 text-gray-400 hover:text-white hover:border-gray-500"
              }`}
            >
              <Heart className={`w-6 h-6 ${isLiked ? "fill-current" : ""}`} />
            </button>

            <button className="p-3 rounded-full text-gray-400 hover:text-white hover:bg-gray-700 transition-all">
              <Share2 className="w-6 h-6" />
            </button>

            <button className="p-3 rounded-full text-gray-400 hover:text-white hover:bg-gray-700 transition-all">
              <MoreHorizontal className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          <div className="p-6">
            {albumTracks.length > 0 ? (
              <div className="space-y-1">
                <div className="grid grid-cols-12 gap-4 px-4 py-2 text-sm font-medium text-gray-400 uppercase tracking-wider border-b border-gray-700/50">
                  <div className="col-span-1 text-center">#</div>
                  <div className="col-span-7">Title</div>
                  <div className="col-span-3 hidden md:block">
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="col-span-1"></div>
                </div>

                {albumTracks.map((track, index) => {
                  const isTrackPlaying = playingTrackId === track.id;
                  const isHovered = hoveredTrack === track.id;

                  return (
                    <div
                      key={track.id}
                      className="grid grid-cols-12 gap-4 px-4 py-3 rounded-lg hover:bg-gray-800/50 transition-all duration-200 group"
                      onMouseEnter={() => setHoveredTrack(track.id)}
                      onMouseLeave={() => setHoveredTrack(null)}
                    >

                      <div className="col-span-1 flex items-center justify-center">
                        {isHovered || isTrackPlaying ? (
                          <button
                            onClick={() => handleTrackPlay(track.id)}
                            className="p-1 rounded-full hover:bg-gray-600 transition-colors"
                          >
                            {isTrackPlaying ? (
                              <Pause className="w-4 h-4 text-emerald-500" />
                            ) : (
                              <Play className="w-4 h-4 text-white" />
                            )}
                          </button>
                        ) : (
                          <span className="text-gray-400 text-sm">
                            {index + 1}
                          </span>
                        )}
                      </div>

                      <div className="col-span-7 flex items-center min-w-0">
                        <div className="min-w-0 flex-1">
                          <h3
                            className={`font-medium truncate transition-colors ${
                              isTrackPlaying
                                ? "text-emerald-500"
                                : "text-white group-hover:text-emerald-400"
                            }`}
                          >
                            {track.title}
                          </h3>
                          <p className="text-sm text-gray-400 truncate">
                            {track.artist}
                          </p>
                        </div>
                      </div>

                      <div className="col-span-3 hidden md:flex items-center">
                        <span className="text-gray-400 text-sm group-hover:text-gray-300 transition-colors">
                          {formatDuration(track.duration)}
                        </span>
                      </div>

                      <div className="col-span-1 flex items-center justify-end">
                        <div
                          className={`flex items-center gap-1 transition-opacity ${
                            isHovered ? "opacity-100" : "opacity-0"
                          }`}
                        >
                          <button className="p-2 rounded-full hover:bg-gray-600 text-gray-400 hover:text-white transition-all">
                            <Plus className="w-4 h-4" />
                          </button>
                          <button className="p-2 rounded-full hover:bg-gray-600 text-gray-400 hover:text-white transition-all">
                            <MoreHorizontal className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-12">
                <Music className="w-16 h-16 mx-auto mb-4 text-gray-500" />
                <h3 className="text-xl font-medium text-gray-300 mb-2">
                  No tracks available
                </h3>
                <p className="text-gray-500">
                  This album doesn't have any tracks loaded yet.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlbumDetailModal;
