import { ButtonDeprecated as Button } from '@sample/ui';
import React, { useState } from 'react';

interface FilterPanelProps {
  onApplyFilters?: (filters: FilterState) => void;
  onClearFilters?: () => void;
}

interface FilterState {
  genre: string;
  year: string;
  rating: string;
}

export const FilterPanel: React.FC<FilterPanelProps> = ({
  onApplyFilters,
  onClearFilters,
}) => {
  const [filters, setFilters] = useState<FilterState>({
    genre: '',
    year: '',
    rating: '',
  });

  const handleClear = () => {
    setFilters({
      genre: '',
      year: '',
      rating: '',
    });
    onClearFilters?.();
  };

  const handleApply = () => {
    onApplyFilters?.(filters);
  };

  const handleInputChange = (field: keyof FilterState, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <div className="p-4 border rounded-lg bg-gray-50">
      <h3 className="text-lg font-semibold mb-4">Filter Movies</h3>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Genre</label>
          <select
            value={filters.genre}
            onChange={(e) => {
              handleInputChange('genre', e.target.value);
            }}
            className="w-full p-2 border rounded"
          >
            <option value="">All Genres</option>
            <option value="action">Action</option>
            <option value="drama">Drama</option>
            <option value="comedy">Comedy</option>
            <option value="crime">Crime</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Year</label>
          <input
            type="text"
            value={filters.year}
            onChange={(e) => {
              handleInputChange('year', e.target.value);
            }}
            placeholder="e.g., 1994"
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Rating</label>
          <select
            value={filters.rating}
            onChange={(e) => {
              handleInputChange('rating', e.target.value);
            }}
            className="w-full p-2 border rounded"
          >
            <option value="">Any Rating</option>
            <option value="G">G</option>
            <option value="PG">PG</option>
            <option value="PG-13">PG-13</option>
            <option value="R">R</option>
          </select>
        </div>

        <div className="flex gap-2 pt-2">
          <Button onClick={handleClear}>Clear</Button>
          <Button onClick={handleApply}>Apply Filters</Button>
        </div>
      </div>
    </div>
  );
};
