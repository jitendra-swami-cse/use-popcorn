import { useState } from "react";
import { Search, NumResults, Navbar } from "./Components/Navbar.js";
import { Box, Loader, ErrorMessage } from "./Components/smallerComps.js";
import { WatchedBox } from "./Components/WatchedBox.js";
import { MoviesList } from "./Components/MoviesListBox.js";
import { useFetchData } from "./Hooks/useFetchData.js";

export default function App() {
  const [query, setQuery] = useState("");
  const [selectedMovie, setSelectedMovie] = useState("");
  const [movies, setMovies] = useState(null);
  const [movieData, setMovieData] = useState(null);

  const { isLoading, isError } = useFetchData(query, setMovies);

  function handleSelectedMovie(id) {
    const apiPrefix = `https://www.omdbapi.com/?apikey=636f8485&i=`;

    setSelectedMovie(
      apiPrefix + id === selectedMovie
        ? setMovieData(null) && ""
        : apiPrefix + id,
    );
  }

  function handleCloseMovie() {
    setSelectedMovie("");
    setMovieData(null);
  }
  return (
    <>
      <Navbar>
        <Search setQuery={setQuery} />
        <NumResults numMovies={movies?.Search?.length} />
      </Navbar>
      <main className="main">
        <Box>
          {(isLoading && <Loader />) ||
            (isError && <ErrorMessage errorMSG={isError} />) ||
            (movies && (
              <MoviesList
                movies={movies?.Search}
                onSelectMovie={handleSelectedMovie}
              />
            ))}
        </Box>
        <Box>
          <WatchedBox
            selectedMovie={selectedMovie}
            movieData={movieData}
            onCloseMovie={handleCloseMovie}
            setMovieData={setMovieData}
          />
        </Box>
      </main>
    </>
  );
}

// MovieDetails;
// WatchedSummary
// WatchedMoviesList
