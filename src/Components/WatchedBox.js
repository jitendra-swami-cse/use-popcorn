import { useState, useEffect } from "react";
import { Loader, ErrorMessage } from "./smallerComps";
import { MovieDetails } from "./MovieDetails";
import { useFetchData } from "../Hooks/useFetchData";
import { useLocalStorageState } from "../Hooks/useLocalStorage";

const tempWatchedData = [
  {
    imdbID: "tt1375666",
    Title: "Inception",
    Year: "2010",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
    runtime: 148,
    imdbRating: 8.8,
    userRating: 10,
  },
  {
    imdbID: "tt0088763",
    Title: "Back to the Future",
    Year: "1985",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BZmU0M2Y1OGUtZjIxNi00ZjBkLTg1MjgtOWIyNThiZWIwYjRiXkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_SX300.jpg",
    runtime: 116,
    imdbRating: 8.5,
    userRating: 9,
  },
];

const average = (arr) =>
  arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);

export function WatchedBox({
  selectedMovie,
  movieData,
  onCloseMovie,
  setMovieData,
}) {
  const [watched, setWatched] = useLocalStorageState([], "watchedMovies_2");

  const avgImdbRating = average(
    watched.map((movie) => movie.imdbRating),
  ).toFixed(2);
  const avgUserRating = average(
    watched.map((movie) => movie.userRating),
  ).toFixed(2);
  const avgRuntime = average(watched.map((movie) => movie.runtime)).toFixed(2);

  const { isLoading, isError } = useFetchData(selectedMovie, setMovieData);
  // console.log(movieData);

  useEffect(
    function () {
      document.title = movieData ? `Movie | ${movieData.Title}` : "usePopcorn";
    },
    [movieData],
  );

  function handleAddWatched(userRating) {
    const newMovie = {
      ...movieData,
      runtime: Number(movieData.Runtime.split(" ")[0]),
      userRating,
    };
    setWatched([...watched, newMovie]);
    onCloseMovie();
  }

  function deleteWatchedMovie(idToDel) {
    setWatched([
      ...watched.filter((movie) => (movie.imdbID === idToDel ? null : movie)),
    ]);
  }

  return (
    (isLoading && <Loader />) ||
    (isError && <ErrorMessage errorMSG={isError} />) ||
    (movieData && (
      <MovieDetails
        movieData={movieData}
        onAddWatched={handleAddWatched}
        onCloseMovie={onCloseMovie}
      />
    )) || (
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
                <button
                  class="btn-delete"
                  onClick={() => deleteWatchedMovie(movie.imdbID)}
                >
                  X
                </button>
              </div>
            </li>
          ))}
        </ul>
      </>
    )
  );
}
