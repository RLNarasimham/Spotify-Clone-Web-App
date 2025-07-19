import React, { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../hooks/useRedux";
import {
  togglePlay,
  nextSong,
  previousSong,
  setProgress,
  setVolume,
  toggleShuffle,
  toggleRepeat,
} from "../../store/playerSlice";
import { addToFavorites, removeFromFavorites } from "../../store/librarySlice";
import { toggleQueue } from "../../store/uiSlice";
import {
  Play,
  Pause,
  SkipForward,
  SkipBack,
  Volume2,
  VolumeX,
  Shuffle,
  Repeat,
  Repeat1,
  Heart,
  List,
  Maximize2,
} from "lucide-react";

const Player: React.FC = () => {
  const dispatch = useAppDispatch();
  const {
    currentSong,
    isPlaying,
    progress,
    duration,
    volume,
    shuffle,
    repeat,
  } = useAppSelector((state) => state.player);
  const { favorites } = useAppSelector((state) => state.library);
  const [isMuted, setIsMuted] = useState(false);
  const [previousVolume, setPreviousVolume] = useState(volume);

  useEffect(() => {
    if (isPlaying && currentSong) {
      if (progress >= (duration || currentSong.duration)) {
        if (repeat === "one") {
          dispatch(setProgress(0));
          return;
        } else if (repeat === "all") {
          dispatch(nextSong());
          return;
        } else {
          dispatch(togglePlay());
          return;
        }
      }

      const interval = setInterval(() => {
        dispatch(setProgress(progress + 1));
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [isPlaying, progress, dispatch, currentSong, duration, repeat]);

  const handleToggleFavorite = () => {
    if (!currentSong) return;

    const isFavorite = favorites.some((fav) => fav.id === currentSong.id);
    if (isFavorite) {
      dispatch(removeFromFavorites(currentSong.id));
    } else {
      dispatch(addToFavorites(currentSong));
    }
  };

  const isFavorite = () => {
    if (!currentSong) return false;
    return favorites.some((fav) => fav.id === currentSong.id);
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newProgress = parseInt(e.target.value);
    dispatch(setProgress(newProgress));
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    dispatch(setVolume(newVolume));
    if (newVolume > 0) {
      setIsMuted(false);
    }
  };

  const toggleMute = () => {
    if (isMuted) {
      dispatch(setVolume(previousVolume));
      setIsMuted(false);
    } else {
      setPreviousVolume(volume);
      dispatch(setVolume(0));
      setIsMuted(true);
    }
  };

  const getRepeatIcon = () => {
    switch (repeat) {
      case "one":
        return <Repeat1 className="h-3 w-3 lg:h-4 lg:w-4" />;
      case "all":
        return <Repeat className="h-3 w-3 lg:h-4 lg:w-4 text-green-500" />;
      default:
        return <Repeat className="h-3 w-3 lg:h-4 lg:w-4" />;
    }
  };

  if (!currentSong) {
    return null;
  }

  return (
    <div className="bg-gray-900 border-t border-gray-700 p-2 lg:p-4">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-2 lg:gap-0">
        <div className="flex items-center space-x-2 lg:space-x-4 lg:w-1/3 min-w-0">
          <img
            src={currentSong.image}
            alt={currentSong.title}
            className="w-10 h-10 lg:w-14 lg:h-14 rounded object-cover flex-shrink-0"
          />
          <div className="min-w-0 flex-1">
            <h3 className="font-medium text-white text-sm lg:text-base truncate">
              {currentSong.title}
            </h3>
            <p className="text-xs lg:text-sm text-gray-400 truncate">
              {currentSong.artist}
            </p>
          </div>
          <button
            className="p-1.5 lg:p-2 hover:bg-gray-800 rounded transition-colors flex-shrink-0"
            onClick={handleToggleFavorite}
            title="Heart-Pl"
          >
            <Heart
              className={`h-3 w-3 lg:h-4 lg:w-4 ${
                isFavorite()
                  ? "text-green-500 fill-current"
                  : "text-gray-400 hover:text-green-500"
              }`}
            />
          </button>
        </div>

        <div className="flex flex-col items-center space-y-2 lg:w-1/3">
          <div className="flex items-center space-x-2 lg:space-x-4">
            <button
              onClick={() => dispatch(toggleShuffle())}
              className={`p-1.5 lg:p-2 hover:bg-gray-800 rounded transition-colors ${
                shuffle ? "text-green-500" : "text-gray-400"
              }`}
              title="Shuffle-Pl"
            >
              <Shuffle className="h-3 w-3 lg:h-4 lg:w-4" />
            </button>
            <button
              onClick={() => dispatch(previousSong())}
              className="p-1.5 lg:p-2 hover:bg-gray-800 rounded transition-colors text-gray-400"
              title="SkipBack-Pl"
            >
              <SkipBack className="h-4 w-4 lg:h-5 lg:w-5" />
            </button>
            <button
              onClick={() => dispatch(togglePlay())}
              className="bg-white hover:bg-gray-200 text-black rounded-full p-1.5 lg:p-2 transition-colors"
              title="Play Pause-Pl"
            >
              {isPlaying ? (
                <Pause className="h-5 w-5 lg:h-6 lg:w-6" />
              ) : (
                <Play className="h-5 w-5 lg:h-6 lg:w-6 ml-0.5" />
              )}
            </button>
            <button
              onClick={() => {
                dispatch(nextSong());
                dispatch(togglePlay());
              }}
              className="p-1.5 lg:p-2 hover:bg-gray-800 rounded transition-colors text-gray-400"
              title="SkipForward-Pl"
            >
              <SkipForward className="h-4 w-4 lg:h-5 lg:w-5" />
            </button>
            <button
              onClick={() => dispatch(toggleRepeat())}
              className={`p-1.5 lg:p-2 hover:bg-gray-800 rounded transition-colors ${
                repeat !== "none" ? "text-green-500" : "text-gray-400"
              }`}
              title="RepeatIcon-Pl"
            >
              {getRepeatIcon()}
            </button>
          </div>

          <div className="flex items-center space-x-2 w-full max-w-md">
            <span className="text-xs text-gray-400 w-8 lg:w-10 text-right">
              {formatTime(progress)}
            </span>
            <input
              type="range"
              min="0"
              max={duration || currentSong.duration || 100}
              value={
                progress > (duration || currentSong.duration || 0)
                  ? duration || currentSong.duration || 0
                  : progress
              }
              onChange={handleProgressChange}
              className="flex-1 h-1 accent-green-400 rounded-lg appearance-auto cursor-pointer"
            />
            <span className="text-xs text-gray-400 w-8 lg:w-10">
              {formatTime(duration || currentSong.duration || 0)}
            </span>
          </div>
        </div>

        <div className="flex items-center justify-end space-x-2 lg:space-x-4 lg:w-1/3">
          <button
            onClick={() => dispatch(toggleQueue())}
            className="p-1.5 lg:p-2 hover:bg-gray-800 rounded transition-colors text-gray-400 hidden lg:block"
          >
            <List className="h-3 w-3 lg:h-4 lg:w-4" />
          </button>
          <button
            aria-label="Maximize Player"
            className="p-1.5 lg:p-2 hover:bg-gray-800 rounded transition-colors text-gray-400 hidden lg:block"
          >
            <Maximize2 className="h-3 w-3 lg:h-4 lg:w-4" />
          </button>
          <div className="flex items-center space-x-2">
            <button
              onClick={toggleMute}
              className="p-1.5 lg:p-2 hover:bg-gray-800 rounded transition-colors text-gray-400"
            >
              {isMuted || volume === 0 ? (
                <VolumeX className="h-3 w-3 lg:h-4 lg:w-4" />
              ) : (
                <Volume2 className="h-3 w-3 lg:h-4 lg:w-4" />
              )}
            </button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={volume}
              onChange={handleVolumeChange}
              title="Input Scroll-Pl"
              className="w-16 lg:w-24 h-1 accent-green-400 rounded-lg appearance-auto cursor-pointer hidden sm:block"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Player;
