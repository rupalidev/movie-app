import React, { useState, useEffect } from 'react';

const API_KEY = '48a947d9'; 
const DEFAULT_QUERIES = ['Avengers', 'Inception', 'Interstellar', 'Titanic', 'Joker', 'The Matrix'];

const MovieSearch = () => {
  const [query, setQuery] = useState('');
  const [movies, setMovies] = useState([]);
  const [error, setError] = useState('');

 
  const fetchMovies = async (searchQuery) => {
    try {
      const response = await fetch(`https://www.omdbapi.com/?s=${searchQuery}&apikey=${API_KEY}`);
      const data = await response.json();

      if (data.Response === 'True') {
        return data.Search || [];
      } else {
        return [];
      }
    } catch (err) {
      return [];
    }
  };

 
  useEffect(() => {
    const fetchDefaultMovies = async () => {
      try {
        const moviePromises = DEFAULT_QUERIES.map((query) => fetchMovies(query));
        const movieResults = await Promise.all(moviePromises);
        const combinedMovies = movieResults.flat().slice(0, 10);
        setMovies(combinedMovies);
      } catch (err) {
        setError('Failed to load default movies.');
      }
    };

    fetchDefaultMovies();
  }, []);

  // Handle search form submission
  const handleSearch = (e) => {
    e.preventDefault();
    if (query) {
      fetchMovies(query).then((results) => {
        setMovies(results);
        if (results.length === 0) {
          setError('No movies found.');
        } else {
          setError('');
        }
      });
    }
  };

  return (
    <div style={styles.container}>
      <h1>Movie Search App</h1>

      <form onSubmit={handleSearch} style={styles.form}>
        <input
          type="text"
          placeholder="Search for a movie..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={styles.input}
        />
        <button type="submit" style={styles.button}>
          Search
        </button>
      </form>

      {error && <p style={styles.error}>{error}</p>}

      <div style={styles.moviesGrid}>
        {movies.map((movie) => (
          <div key={movie.imdbID} style={styles.card}>
            <img
              src={movie.Poster !== 'N/A' ? movie.Poster : 'https://via.placeholder.com/150'}
              alt={movie.Title}
              style={styles.poster}
            />
            <h3>{movie.Title}</h3>
            <p>Year: {movie.Year}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

const styles = {
  container: {
    textAlign: 'center',
    padding: '20px',
    fontFamily: 'Arial, sans-serif',
  },
  form: {
    marginBottom: '20px',
  },
  input: {
    padding: '10px',
    width: '300px',
    marginRight: '10px',
    fontSize: '16px',
  },
  button: {
    padding: '10px 20px',
    backgroundColor: '#007BFF',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '16px',
  },
  error: {
    color: 'red',
  },
  moviesGrid: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  card: {
    border: '1px solid #ddd',
    borderRadius: '10px',
    width: '200px',
    margin: '15px',
    padding: '10px',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
  },
  poster: {
    width: '100%',
    height: '300px',
    objectFit: 'cover',
  },
};

export default MovieSearch;
