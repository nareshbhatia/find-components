import { Button } from '@sample/ui';
import React from 'react';

interface Movie {
  id: number;
  title: string;
  year: number;
  genre: string;
}

interface MovieListProps {
  movies?: Movie[];
}

const defaultMovies: Movie[] = [
  { id: 1, title: 'The Shawshank Redemption', year: 1994, genre: 'Drama' },
  { id: 2, title: 'The Godfather', year: 1972, genre: 'Crime' },
  { id: 3, title: 'The Dark Knight', year: 2008, genre: 'Action' },
  { id: 4, title: 'Pulp Fiction', year: 1994, genre: 'Crime' },
  { id: 5, title: 'Forrest Gump', year: 1994, genre: 'Drama' },
];

export const MovieList: React.FC<MovieListProps> = ({
  movies = defaultMovies,
}) => {
  const handlePlayMovie = (movie: Movie) => {
    console.log(`Playing movie: ${movie.title}`);
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold mb-4">Movie List</h2>
      <div className="grid gap-4">
        {movies.map((movie) => (
          <div
            key={movie.id}
            className="flex items-center justify-between p-4 border rounded-lg"
          >
            <div>
              <h3 className="font-semibold text-lg">{movie.title}</h3>
              <p className="text-gray-600">
                {movie.year} • {movie.genre}
              </p>
            </div>
            <Button
              onClick={() => {
                handlePlayMovie(movie);
              }}
            >
              Play Movie
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};
