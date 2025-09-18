import { Button } from '@sample/ui';
import React from 'react';

interface ApplicationHeaderProps {
  title?: string;
  onFilterSort?: () => void;
}

export const ApplicationHeader: React.FC<ApplicationHeaderProps> = ({
  title = 'Movie Magic',
  onFilterSort,
}) => (
  <header className="bg-white shadow-sm border-b">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center py-4">
        <div className="flex items-center">
          <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
        </div>

        <div className="flex items-center space-x-4">
          <Button onClick={onFilterSort} variant="secondary">
            Filter & Sort
          </Button>
        </div>
      </div>
    </div>
  </header>
);
