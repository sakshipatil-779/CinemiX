import React, { useState } from "react";
import { Star, Heart, Eye, Puzzle } from "lucide-react";
import { useMovieContext } from "../context/MovieContext";

export default function MovieCard({
  movie,
  isRowItem = false,
  rankingNumber = null,
  showMatchScore = false,
  matchScore = null
}) {
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

  const resolvedMatchScore = matchScore || movie.matchScore || 99;

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
          <Star size={11} fill="#f59e0b" color="#f59e0b" />
          <span>{movie.rating ? Number(movie.rating).toFixed(1) : "9.9"}</span>
        </div>

        {/* Favourite Button */}
        <button
          className={`card-fav-btn ${favourite ? "active" : ""}`}
          onClick={handleFavClick}
          title={favourite ? "Remove from Favourites" : "Add to Favourites"}
          aria-label={favourite ? "Remove from Favourites" : "Add to Favourites"}
        >
          <Heart
            size={15}
            fill={favourite ? "#ef4444" : "none"}
            color={favourite ? "#ef4444" : "currentColor"}
          />
        </button>

        {/* Optional Ranking Badge (#1, #2...) */}
        {rankingNumber && !showMatchScore && (
          <div className="ranking-badge">
            #{rankingNumber}
          </div>
        )}

        {/* Hover Action Overlay */}
        <div className="card-hover-overlay">
          <span className="quick-view-btn">
            <Eye size={13} /> Quick View
          </span>
        </div>

        {/* Match Score Badge (Filter Screen Only) */}
        {showMatchScore && (
          <div className="card-match-badge">
            <Puzzle size={13} className="match-puzzle-icon" />
            <span className="match-score-text">Match Score</span>
            <span className="match-score-value">{resolvedMatchScore}%</span>
          </div>
        )}
      </div>

      {/* Info Section */}
      <div className="movie-card-info">
        {/* Movie Name */}
        <h3 className="movie-card-title">{movie.title}</h3>

        {/* Language & Release Year */}
        <div className="movie-card-meta-row">
          <span className="movie-card-language">{movie.language || "English"}</span>
          <span className="movie-card-year">{movie.releaseYear}</span>
        </div>

        {/* Genre Tags */}
        <div className="movie-card-genres">
          {(movie.genres || []).slice(0, 3).map((genre) => (
            <span key={genre} className="movie-genre-chip">
              {genre}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
