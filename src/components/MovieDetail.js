import { useEffect, useRef, useState } from "react";
import { useKey } from "../hooks/useKey";
import { useMovieDetails } from "../hooks/useMovieDetail";
import StarRating from "./StarRating";
import Loader from "./Loader";

export default function SelectedMovie({
  selectedId,
  watched,
  onCloseMovie,
  onWatched,
}) {
  const [movie, isLoading] = useMovieDetails(selectedId);
  const [userRating, setUserRating] = useState(0);
  const countRef = useRef(0);
  useKey("Escape", onCloseMovie);

  const isWatched = watched.map((movie) => movie.imdbId).includes(selectedId);
  const watchedUserRating = watched.find(
    (movie) => movie.imdbId === selectedId
  )?.userRating;

  const {
    Title: title,
    Year: year,
    Poster: poster,
    Runtime: runtime,
    imdbRating,
    Plot: plot,
    Released: released,
    Actors: actors,
    Director: director,
    Genre: genre,
  } = movie;

  function handleAdd() {
    const watchedMovie = {
      imdbId: selectedId,
      title,
      year,
      poster,
      imdbRating: Number(imdbRating),
      runtime: Number(runtime.split(" ").at(0)),
      userRating,
    };

    onWatched(watchedMovie);
    onCloseMovie();
  }

  useEffect(
    function () {
      if (!title) return;
      document.title = `Movie | ${title}`;

      return function () {
        document.title = "usePopCorn";
      };
    },
    [title]
  );

  useEffect(
    function () {
      if (userRating) countRef.current = countRef.current + 1;
    },
    [userRating]
  );

  return (
    <div className="details">
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <header>
            <button className="btn-back" onClick={onCloseMovie}>
              &larr;
            </button>
            <img src={poster} alt={`Poster of ${movie} movie`} />
            <div className="details-overview">
              <h2>{title}</h2>
              <p>
                {released} &bull; {runtime}
              </p>
              <p>{genre}</p>
              <p>
                <span>⭐️</span>
                {imdbRating} IMDb rating
              </p>
            </div>
          </header>
          <section>
            {isWatched ? (
              <p>
                You have rated this movie {watchedUserRating} <span>⭐️</span>
              </p>
            ) : (
              <>
                <StarRating maxRating={10} onSetRating={setUserRating} />
                {userRating > 0 && (
                  <button className="btn-add" onClick={handleAdd}>
                    + Add to your list
                  </button>
                )}
              </>
            )}
            <p>
              <em>{plot}</em>
            </p>
            <p>Starring {actors}</p>
            <p>Directed by {director}</p>
          </section>
        </>
      )}
    </div>
  );
}
