import { useState } from "react";
import { Search, NumResults, Navbar } from "./Components/Navbar.js";
import { Box, Loader, ErrorMessage } from "./Components/smallerComps.js";
import { WatchedBox } from "./Components/WatchedBox.js";
import { MoviesList } from "./Components/MoviesListBox.js";
import { useFetchData } from "./Hooks/useFetchData.js";

export default function App() {
  const [query, setQuery] = useState("");
  const [isSelected, setIsSelected] = useState("");
  const [movies, setMovies] = useState([]);

  const { isLoading, isError } = useFetchData(query, setMovies);

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
        <NumResults numMovies={movies?.Search?.length} />
      </Navbar>
      <main className="main">
        <Box>
          {isLoading ? (
            <Loader />
          ) : isError ? (
            <ErrorMessage errorMSG={isError} />
          ) : (
            <MoviesList
              movies={movies?.Search}
              onSelectMovie={handleSelectedMovie}
            />
          )}
        </Box>
        <Box>
          <WatchedBox
            isSelected={isSelected}
            onNewMovieAdd={handleSelectedMovie}
            onCloseMovie={handleCloseMovie}
          />
        </Box>
      </main>
    </>
  );
}

// MovieDetails;
// WatchedSummary
// WatchedMoviesList
