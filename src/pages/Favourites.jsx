import React from "react";
import { useNavigate } from "react-router-dom";
import { Heart } from "lucide-react";
import { useMovieContext } from "../context/MovieContext";
import MovieCard from "../components/MovieCard";
import EmptyState from "../components/EmptyState";

export default function Favourites() {
  const { movies, favourites } = useMovieContext();
  const navigate = useNavigate();

  const favouriteMovies = movies.filter(m => favourites.includes(m.id));

  return (
    <div className="favourites-page">
      <div style={{ marginBottom: "26px" }}>
        <h1 style={{ fontSize: "28px", color: "#ffffff", marginBottom: "6px" }}>
          My Favourites
        </h1>
        <p style={{ color: "var(--text-muted)", fontSize: "14px" }}>
          {favouriteMovies.length} saved title{favouriteMovies.length === 1 ? "" : "s"} you love.
        </p>
      </div>

      {favouriteMovies.length > 0 ? (
        <div className="movie-grid">
          {favouriteMovies.map(movie => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={Heart}
          title="Your Favourites list is empty"
          description="Click the heart icon on any movie poster or details page to add it to your personal favorites."
          actionText="Discover Movies"
          onAction={() => navigate("/explore")}
        />
      )}
    </div>
  );
}
