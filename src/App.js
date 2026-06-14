import { useEffect, useState } from "react";
import StarRating from "./StarRatings.js";

const tempMovieData = [
  {
    imdbID: "tt1375666",
    Title: "Inception",
    Year: "2010",
    Poster: "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
  },
  {
    imdbID: "tt0133093",
    Title: "The Matrix",
    Year: "1999",
    Poster: "https://m.media-amazon.com/images/M/MV5BNzQzOTk3OTAtNDQ0Zi00ZTVkLWI0MTEtMDllZjNkYzNjNTc4L2ltYWdlXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_SX300.jpg",
  },
  {
    imdbID: "tt6751668",
    Title: "Parasite",
    Year: "2019",
    Poster: "https://m.media-amazon.com/images/M/MV5BYWZjMjk3ZTItODQ2ZC00NTY5LWE0ZDYtZTI3MjcwN2Q5NTVkXkEyXkFqcGdeQXVyODk4OTc3MTY@._V1_SX300.jpg",
  },
];

const tempWatchedData = [
  {
    imdbID: "tt1375666",
    Title: "Inception",
    Year: "2010",
    Poster: "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
    runtime: 148,
    imdbRating: 8.8,
    userRating: 10,
  },
  {
    imdbID: "tt0088763",
    Title: "Back to the Future",
    Year: "1985",
    Poster: "https://m.media-amazon.com/images/M/MV5BZmU0M2Y1OGUtZjIxNi00ZjBkLTg1MjgtOWIyNThiZWIwYjRiXkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_SX300.jpg",
    runtime: 116,
    imdbRating: 8.5,
    userRating: 9,
  },
];

const average = (arr) => arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);

function Search({ query, setQuery }) {
  return <input className="search" type="text" placeholder="Search movies..." value={query} onChange={(e) => setQuery(e.target.value)} />;
}

function NumResults() {
  return (
    <p className="num-results">
      Found <strong>X</strong> results
      {/* Found <strong>{movies.length}</strong> results */}
    </p>
  );
}

function Navbar({ children }) {
  return (
    <nav className="nav-bar">
      <div className="logo">
        <span role="img">🍿</span>
        <h1>usePopcorn</h1>
      </div>
      {children}
    </nav>
  );
}

function Box({ children }) {
  const [isOpen, setIsOpen] = useState(true);
  return (
    <div className="box">
      <button className="btn-toggle" onClick={() => setIsOpen((open) => !open)}>
        {isOpen ? "–" : "+"}
      </button>
      {isOpen && children}
    </div>
  );
}

function Loader() {
  return <div className="loader">Loading.....</div>;
}
function ErrorMessage({ errorMSG }) {
  return (
    <p className="error">
      <span>❌ </span>
      {errorMSG}
    </p>
  );
}

function MoviesList({ query, onSelectMovie }) {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(null);

  useEffect(
    function () {
      const controller = new AbortController();

      if (query.length < 3) {
        setMovies([]);
        setIsError("");
        return;
      }

      async function fetchMovies() {
        try {
          setIsLoading(true);
          setIsError("");

          const res = await fetch(`http://www.omdbapi.com/?apikey=636f8485&s=${query}`, {
            signal: controller.signal,
          });

          if (!res.ok) throw new Error("Something went wrong with fetching movies");

          const data = await res.json();

          if (data.Response === "False") throw new Error(data.Error);

          setMovies(data.Search);
        } catch (error) {
          if (error.name !== "AbortError") {
            setIsError(error.message);
          }
          console.log(error.message);
        } finally {
          setIsLoading(false);
        }
      }

      fetchMovies();

      return function () {
        controller.abort();
      };
    },
    [query],
  );

  if (isLoading) return <Loader />;
  if (isError) return <ErrorMessage errorMSG={isError} />;

  return (
    <ul className="list list-movies">
      {movies?.map((movie) => (
        <li key={movie.imdbID} onClick={() => onSelectMovie(movie.imdbID)}>
          <img src={movie.Poster} alt={`${movie.Title} poster`} />
          <h3>{movie.Title}</h3>
          <div>
            <p>
              <span>🗓</span>
              <span>{movie.Year}</span>
            </p>
          </div>
        </li>
      ))}
    </ul>
  );
}

function MovieDetails({ movieData, onAddWatched }) {
  const [userRating, setUserRating] = useState(0);

  return (
    <div className="details">
      <header>
        <button className="btn-back">←</button>
        <img src={movieData.Poster} alt={`Poster of Movie ${movieData.Title}`} />
        <div className="details-overview">
          <h2>{movieData.Title}</h2>
          <p>
            {movieData.Released} • {movieData.Runtime}
          </p>
          <p>{movieData.Genre}</p>
          <p>⭐ {movieData.imdbRating} IMDb rating</p>
        </div>
      </header>
      <section>
        <div className="rating">
          <StarRating maxRating={10} size={24} onSetRating={setUserRating} />
          {userRating ? (
            <button className="btn-add" onClick={() => onAddWatched(movieData)}>
              + Add to list
            </button>
          ) : (
            ""
          )}
        </div>
        <p>
          <em>{movieData.Plot}</em>
        </p>
        <p>Starring {movieData.Actors}</p>
        <p>{movieData.Director}</p>
      </section>
    </div>
  );
}

function WatchedBox({ isSelected, onNewMovieAdd }) {
  const [watched, setWatched] = useState(tempWatchedData);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState("");
  const [movieData, setMovieData] = useState(null);
  const avgImdbRating = average(watched.map((movie) => movie.imdbRating));
  const avgUserRating = average(watched.map((movie) => movie.userRating));
  const avgRuntime = average(watched.map((movie) => movie.runtime));

  useEffect(
    function () {
      async function fetchMovieDetails() {
        const controller = new AbortController();
        try {
          setIsLoading(true);
          setIsError("");
          const res = await fetch(`https://www.omdbapi.com/?apikey=636f8485&i=${isSelected}`, { signal: controller.signal });
          const data = await res.json();
          console.log(`https://www.omdbapi.com/?apikey=636f8485&i=${isSelected}`);
          console.log(data);
          setMovieData(data);
        } catch (error) {
          if (error.name !== "AbortError") {
            setIsError(error.message);
          }
          console.log(error.message);
        } finally {
          setIsLoading(false);
          setIsError("");
        }
      }

      fetchMovieDetails();
      return function () {
        controller.abort();
      };
    },
    [isSelected],
  );

  useEffect(
    function () {
      if (movieData) document.title = `Movie | ${movieData.Title}`;
    },
    [movieData],
  );

  function handleAddWatched(newMovie) {
    setWatched([...watched, newMovie]);
    onNewMovieAdd();
  }

  return isSelected ? (
    isLoading ? (
      <Loader />
    ) : (
      <MovieDetails movieData={movieData} onAddWatched={handleAddWatched} />
    )
  ) : (
    <>
      <div className="summary">
        <h2>Movies you watched</h2>
        <div>
          <p>
            <span>#️⃣</span>
            <span>{watched.length} movies</span>
          </p>
          <p>
            <span>⭐️</span>
            <span>{avgImdbRating}</span>
          </p>
          <p>
            <span>🌟</span>
            <span>{avgUserRating}</span>
          </p>
          <p>
            <span>⏳</span>
            <span>{avgRuntime} min</span>
          </p>
        </div>
      </div>

      <ul className="list">
        {watched.map((movie) => (
          <li key={movie.imdbID}>
            <img src={movie.Poster} alt={`${movie.Title} poster`} />
            <h3>{movie.Title}</h3>
            <div>
              <p>
                <span>⭐️</span>
                <span>{movie.imdbRating}</span>
              </p>
              <p>
                <span>🌟</span>
                <span>{movie.userRating}</span>
              </p>
              <p>
                <span>⏳</span>
                <span>{movie.runtime} min</span>
              </p>
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}
export default function App() {
  const [query, setQuery] = useState("");
  const [isSelected, setIsSelected] = useState("");

  function handleSelectedMovie(id) {
    setIsSelected((s) => (s ? "" : id));
  }

  return (
    <>
      <Navbar>
        <Search query={query} setQuery={setQuery} />
        <NumResults />
      </Navbar>
      <main className="main">
        <Box>
          <MoviesList query={query} onSelectMovie={handleSelectedMovie} />
        </Box>
        <Box>
          <WatchedBox isSelected={isSelected} onNewMovieAdd={handleSelectedMovie} />
        </Box>
      </main>
    </>
  );
}

// MovieDetails;
// WatchedSummary
// WatchedMoviesList
