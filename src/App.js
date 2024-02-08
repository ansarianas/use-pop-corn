import { useState } from "react";
import { useMovies } from "./hooks/useMovies";
import { useLocalStorage } from "./hooks/useLocalStorage";
import Result from "./components/Result";
import Search from "./components/Search";
import Box from "./components/Box";
import MovieList from "./components/MovieList";
import MovieWatchedBox from "./components/MovieWatchedList";
import WatchSummary from "./components/WatchSummary";
import MovieWatchedList from "./components/MovieWatchedList";
import MovieDetail from "./components/MovieDetail";
import Navbar from "./components/NavBar";
import Loader from "./components/Loader";
import Error from "./components/Error";

function Main({ children }) {
  return <main className="main">{children}</main>;
}

export default function App() {
  const [selectedMovieId, setSelectedMovieId] = useState(null);
  const [query, setQuery] = useState("");
  const { movies, error, isLoading } = useMovies(query);
  const [watched, setWatched] = useLocalStorage([], "watched");

  function handleWatched(watchedMovie) {
    const isWatched =
      watched.filter((movie) => movie.imdbId === watchedMovie.imdbId).length >
      0;
    if (!isWatched) setWatched((prevState) => [...prevState, watchedMovie]);
  }

  function handleSelectedMovie(movieId) {
    setSelectedMovieId(movieId);
  }

  function handleCloseMovie() {
    setSelectedMovieId(null);
  }

  function handleDeleteWatched(movieId) {
    setWatched((prevState) =>
      prevState.filter((movie) => movie.imdbId !== movieId)
    );
  }

  return (
    <>
      <Navbar>
        <Search query={query} setQuery={setQuery} />
        <Result movies={movies} />
      </Navbar>
      <Main>
        <Box>
          {isLoading && <Loader />}
          {error && <Error message={error} />}
          {!error && !isLoading && (
            <MovieList
              movies={movies}
              onSelectedMovieId={handleSelectedMovie}
            />
          )}
        </Box>
        <Box>
          {selectedMovieId ? (
            <MovieDetail
              selectedId={selectedMovieId}
              watched={watched}
              onCloseMovie={handleCloseMovie}
              onWatched={handleWatched}
            />
          ) : (
            <>
              <WatchSummary watched={watched} />
              <MovieWatchedList
                watched={watched}
                onDeleteWatched={handleDeleteWatched}
              />
            </>
          )}
        </Box>
        <MovieWatchedBox />
      </Main>
    </>
  );
}
