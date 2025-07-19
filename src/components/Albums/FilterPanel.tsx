import React from "react";
import { X, RotateCcw } from "lucide-react";

interface FilterPanelProps {
  availableGenres: string[];
  selectedGenres: string[];
  onGenresChange: (genres: string[]) => void;
  yearRange: [number, number];
  onYearRangeChange: (range: [number, number]) => void;
  onClearFilters: () => void;
}

const FilterPanel: React.FC<FilterPanelProps> = ({
  availableGenres,
  selectedGenres,
  onGenresChange,
  yearRange,
  onYearRangeChange,
  onClearFilters,
}) => {
  const handleGenreToggle = (genre: string) => {
    if (selectedGenres.includes(genre)) {
      onGenresChange(selectedGenres.filter((g) => g !== genre));
    } else {
      onGenresChange([...selectedGenres, genre]);
    }
  };

  return (
    <div className="mt-4 p-4 bg-gray-800/50 rounded-lg border border-gray-700">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-white">Filters</h3>
        <button
          onClick={onClearFilters}
          className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
          Clear All
        </button>
      </div>

      <div className="space-y-6">
        <div>
          <h4 className="text-sm font-medium text-gray-300 mb-3">Genres</h4>
          <div className="flex flex-wrap gap-2">
            {availableGenres.map((genre) => (
              <button
                key={genre}
                onClick={() => handleGenreToggle(genre)}
                className={`px-3 py-1 rounded-full text-sm transition-all duration-200 ${
                  selectedGenres.includes(genre)
                    ? "bg-emerald-600 text-white border border-emerald-500"
                    : "bg-gray-700 text-gray-300 border border-gray-600 hover:bg-gray-600 hover:text-white"
                }`}
              >
                {genre}
                {selectedGenres.includes(genre) && (
                  <X className="w-3 h-3 ml-1 inline" />
                )}
              </button>
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-sm font-medium text-gray-300 mb-3">
            Release Year
          </h4>
          <div className="space-y-3">
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <label className="block text-xs text-gray-400 mb-1">From</label>
                <input
                  type="number"
                  min="1950"
                  max="2024"
                  value={yearRange[0]}
                  onChange={(e) =>
                    onYearRangeChange([parseInt(e.target.value), yearRange[1]])
                  }
                  className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>
              <div className="flex-1">
                <label className="block text-xs text-gray-400 mb-1">To</label>
                <input
                  type="number"
                  min="1950"
                  max="2024"
                  value={yearRange[1]}
                  onChange={(e) =>
                    onYearRangeChange([yearRange[0], parseInt(e.target.value)])
                  }
                  className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="relative">
              <input
                type="range"
                min="1950"
                max="2024"
                value={yearRange[0]}
                onChange={(e) =>
                  onYearRangeChange([parseInt(e.target.value), yearRange[1]])
                }
                className="absolute w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer"
                style={{ zIndex: 1 }}
              />
              <input
                type="range"
                min="1950"
                max="2024"
                value={yearRange[1]}
                onChange={(e) =>
                  onYearRangeChange([yearRange[0], parseInt(e.target.value)])
                }
                className="absolute w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer"
                style={{ zIndex: 2 }}
              />
              <div className="flex justify-between text-xs text-gray-500 mt-4">
                <span>1950</span>
                <span>2024</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterPanel;
