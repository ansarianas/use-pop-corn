import { useEffect, useState } from "react";

const KEY = "892e5d9f";
const OMDB_BASE_URI = "http://www.omdbapi.com";

export function useMovieDetails(selectedId) {
  const [movie, setMovie] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(
    function () {
      async function fetchMoviesDetails() {
        try {
          setIsLoading(true);
          const url = `${OMDB_BASE_URI}/?apikey=${KEY}&i=${selectedId}`;
          const res = await fetch(url);
          if (!res.ok) throw new Error();

          const data = await res.json();
          setMovie(data);
          setIsLoading(false);
        } catch (err) {
          console.log(err);
        }
      }

      fetchMoviesDetails();
    },
    [selectedId]
  );

  return [movie, isLoading];
}
