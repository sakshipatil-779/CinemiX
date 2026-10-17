import React from "react";
import { useMovieContext } from "../context/MovieContext";
import MovieCard from "../components/MovieCard";

export default function RecentlyAddedPage() {
  const { movies } = useMovieContext();
  const recentMovies = movies.filter(m => m.recentlyAdded || m.releaseYear >= 2024);

  return (
    <div className="recently-added-page">
      <div style={{ marginBottom: "26px" }}>
        <h1 style={{ fontSize: "28px", color: "#ffffff", marginBottom: "6px" }}>
          Recently Added to CinemiX
        </h1>
        <p style={{ color: "var(--text-muted)", fontSize: "14px" }}>
          Explore the newest arrivals, world premieres, and fresh remaster releases.
        </p>
      </div>

      <div className="movie-grid">
        {recentMovies.map(movie => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>
    </div>
  );
}
