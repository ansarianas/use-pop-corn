import { useEffect, useState } from "react";

const KEY = "892e5d9f";
const OMDB_BASE_URI = "http://www.omdbapi.com";

export function useMovies(query) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [movies, setMovies] = useState([]);

  useEffect(
    function () {
      const controller = new AbortController();

      async function fetchMovies() {
        try {
          setIsLoading(true);
          setError("");

          const url = `${OMDB_BASE_URI}/?apikey=${KEY}&s=${query}`;
          const res = await fetch(url, { signal: controller.signal });
          if (!res.ok) throw new Error();

          const data = await res.json();
          if (data.Response === "False") throw new Error();

          setMovies(data.Search);
          setIsLoading(false);
        } catch (err) {
          if (err.name !== "AbortError") {
            setError("Unknown error occured");
          }
        } finally {
          setIsLoading(false);
        }
      }

      if (query) fetchMovies();

      return function () {
        controller.abort();
      };
    },
    [query]
  );

  return { movies, isLoading, error };
}
