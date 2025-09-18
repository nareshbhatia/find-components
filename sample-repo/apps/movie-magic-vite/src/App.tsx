import { ApplicationHeader } from './components/ApplicationHeader';
import { FilterPanel } from '@sample/filter-panel';
import { MovieList } from '@sample/movie-list';
import React, { useState } from 'react';
import './App.css';

function App() {
  const [showFilters, setShowFilters] = useState(false);

  const handleFilterSort = () => {
    setShowFilters(!showFilters);
  };

  const handleApplyFilters = (filters: any) => {
    console.log('Applying filters:', filters);
    // In a real app, this would filter the movie list
  };

  const handleClearFilters = () => {
    console.log('Clearing filters');
    // In a real app, this would reset the movie list
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <ApplicationHeader onFilterSort={handleFilterSort} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {showFilters && (
            <div className="lg:col-span-1">
              <FilterPanel
                onApplyFilters={handleApplyFilters}
                onClearFilters={handleClearFilters}
              />
            </div>
          )}

          <div className={showFilters ? 'lg:col-span-3' : 'lg:col-span-4'}>
            <MovieList />
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
