import { useState, useEffect } from "react";
import { Loader } from "./smallerComps";
import StarRating from "./StarRatings";

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

function MovieDetails({ movieData, onAddWatched, onCloseMovie }) {
  const [userRating, setUserRating] = useState(0);

  useEffect(
    function () {
      function callback(e) {
        if (e.code.toLocaleLowerCase() === "escape") onCloseMovie();
        console.log("ok you pressed it.");
      }
      document.addEventListener("keydown", callback);

      return () => document.removeEventListener("keydown", callback);
    },
    [onCloseMovie],
  );

  return (
    <div className="details">
      <header>
        <button className="btn-back" onClick={onCloseMovie}>
          ←
        </button>
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

export function WatchedBox({ isSelected, onNewMovieAdd, onCloseMovie }) {
  const [watched, setWatched] = useState(tempWatchedData);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState("");
  const [movieData, setMovieData] = useState(null);
  const avgImdbRating = average(watched.map((movie) => movie.imdbRating));
  const avgUserRating = average(watched.map((movie) => movie.userRating));
  const avgRuntime = average(watched.map((movie) => movie.runtime));

  useEffect(
    function () {
      // if (isSelected) setMovieData(null);
      const controller = new AbortController();
      async function fetchMovieDetails() {
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
      document.title = isSelected ? `Movie | ${movieData.Title}` : "usePopcorn";
    },
    [isSelected, movieData],
  );

  function handleAddWatched(newMovie) {
    setWatched([...watched, newMovie]);
    onNewMovieAdd();
  }

  return isSelected ? (
    isLoading ? (
      <Loader />
    ) : (
      <MovieDetails movieData={movieData} onAddWatched={handleAddWatched} onCloseMovie={onCloseMovie} />
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
