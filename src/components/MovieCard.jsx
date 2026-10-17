import React, { useState } from "react";
import { Star, Heart, Eye, Sparkles } from "lucide-react";
import { useMovieContext } from "../context/MovieContext";

export default function MovieCard({ movie, isRowItem = false, rankingNumber = null, showReasons = false }) {
  const { setSelectedMovie, toggleFavourite, isFavourite } = useMovieContext();
  const [imageError, setImageError] = useState(false);

  const favourite = isFavourite(movie.id);

  const handleCardClick = () => {
    setSelectedMovie(movie);
  };

  const handleFavClick = (e) => {
    e.stopPropagation();
    toggleFavourite(movie.id);
  };

  // Fallback image generator (gradient with title)
  const posterSrc = imageError
    ? "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=800&q=80"
    : (movie.poster || movie.backdrop);

  return (
    <div
      className={`movie-card ${isRowItem ? "in-row" : ""}`}
      onClick={handleCardClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleCardClick();
        }
      }}
      title={`${movie.title} (${movie.releaseYear}) - Click for details`}
    >
      {/* Poster Box */}
      <div className="movie-poster-box">
        <img
          src={posterSrc}
          alt={movie.title}
          className="movie-poster-img"
          onError={() => setImageError(true)}
          loading="lazy"
        />

        {/* Rating Badge */}
        <div className="card-rating-badge">
          <Star size={11} fill="#f59e0b" />
          <span>{movie.rating}</span>
        </div>

        {/* Favourite Button */}
        <button
          className={`card-fav-btn ${favourite ? "active" : ""}`}
          onClick={handleFavClick}
          title={favourite ? "Remove from Favourites" : "Add to Favourites"}
          aria-label={favourite ? "Remove from Favourites" : "Add to Favourites"}
        >
          <Heart size={16} fill={favourite ? "currentColor" : "none"} />
        </button>

        {/* Optional Ranking Badge (#1, #2...) */}
        {rankingNumber && (
          <div className="ranking-badge">
            #{rankingNumber}
          </div>
        )}

        {/* Hover Action Overlay */}
        <div className="card-hover-overlay">
          <span className="quick-view-btn">
            <Eye size={14} /> Quick View
          </span>
        </div>
      </div>

      {/* Info Section */}
      <div className="movie-card-info">
        <h3 className="movie-card-title">{movie.title}</h3>
        <div className="movie-card-meta">
          <span>{movie.genres?.[0] || "Cinema"}</span>
          <span>{movie.releaseYear}</span>
        </div>

        {/* Recommendation Reason Pill */}
        {showReasons && movie.recommendationReasons?.[0] && (
          <div className="rec-reason-badge" title={movie.recommendationReasons.join(" • ")}>
            <Sparkles size={11} />
            <span className="truncate">{movie.recommendationReasons[0]}</span>
          </div>
        )}
      </div>
    </div>
  );
}
