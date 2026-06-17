import { useState, useEffect } from "react";
import { Search, NumResults, Navbar } from "./Components/Navbar.js";
import { Box, Loader, ErrorMessage } from "./Components/smallerComps.js";
import { WatchedBox } from "./Components/WatchedBox.js";
import { MoviesList } from "./Components/MoviesListBox.js";

export default function App() {
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(null);
  const [movies, setMovies] = useState([]);
  const [isSelected, setIsSelected] = useState("");

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
          setMovies([]);
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

  function handleSelectedMovie(id) {
    setIsSelected(id === isSelected ? "" : id);
  }

  function handleCloseMovie() {
    setIsSelected("");
  }
  return (
    <>
      <Navbar>
        <Search query={query} setQuery={setQuery} />
        <NumResults numMovies={movies?.length} />
      </Navbar>
      <main className="main">
        <Box>{isLoading ? <Loader /> : isError ? <ErrorMessage errorMSG={isError} /> : <MoviesList movies={movies} onSelectMovie={handleSelectedMovie} />}</Box>
        <Box>
          <WatchedBox isSelected={isSelected} onNewMovieAdd={handleSelectedMovie} onCloseMovie={handleCloseMovie} />
        </Box>
      </main>
    </>
  );
}

// MovieDetails;
// WatchedSummary
// WatchedMoviesList
