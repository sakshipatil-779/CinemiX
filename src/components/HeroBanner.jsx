import React, { useState, useEffect } from "react";
import { Play, MoreHorizontal, Star, Flame, Clock } from "lucide-react";
import { useMovieContext } from "../context/MovieContext";

export default function HeroBanner() {
  const { movies, setSelectedMovie, setTrailerMovie } = useMovieContext();
  
  // Pick featured movies for hero carousel
  const featuredMovies = movies.filter(m => m.trending || m.isHeroFeatured).slice(0, 4);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto cycle every 8 seconds
  useEffect(() => {
    if (featuredMovies.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % featuredMovies.length);
    }, 8000);
    return () => clearInterval(interval);
  }, [featuredMovies.length]);

  if (featuredMovies.length === 0) return null;

  const currentMovie = featuredMovies[currentIndex] || featuredMovies[0];

  return (
    <div className="hero-banner">
      {/* Backdrop Image */}
      <img
        src={currentMovie.backdrop || currentMovie.poster}
        alt={currentMovie.title}
        className="hero-backdrop-img"
        key={currentMovie.id}
      />

      {/* Gradient & Content Overlay */}
      <div className="hero-overlay">
        {/* Badges */}
        <div className="hero-badge-row">
          <span className="trending-badge">
            <Flame size={14} /> Now Trending
          </span>
          {currentMovie.genres?.slice(0, 2).map((genre) => (
            <span key={genre} className="genre-pill">
              {genre}
            </span>
          ))}
        </div>

        {/* Title */}
        <h1 className="hero-title">{currentMovie.title}</h1>

        {/* Synopsis */}
        <p className="hero-synopsis line-clamp-2">
          {currentMovie.description}
        </p>

        {/* Metadata */}
        <div className="hero-meta">
          <span className="hero-meta-item">
            <Star size={14} className="rating-star-icon" fill="#f59e0b" />
            <strong style={{ color: "#ffffff" }}>{currentMovie.rating}</strong> / 10
          </span>
          <span>•</span>
          <span className="hero-meta-item">
            <Clock size={14} />
            {currentMovie.duration} min
          </span>
          <span>•</span>
          <span>{currentMovie.releaseYear}</span>
          <span>•</span>
          <span>{currentMovie.language}</span>
        </div>

        {/* Action Buttons */}
        <div className="hero-actions">
          <button
            className="btn-primary"
            onClick={() => setTrailerMovie(currentMovie)}
            title="Watch Trailer"
          >
            <Play size={16} fill="#ffffff" />
            <span>Watch Trailer</span>
          </button>

          <button
            className="btn-secondary"
            onClick={() => setSelectedMovie(currentMovie)}
            title="View Details"
          >
            <MoreHorizontal size={18} />
            <span>View Details</span>
          </button>
        </div>
      </div>

      {/* Carousel Indicators */}
      {featuredMovies.length > 1 && (
        <div className="hero-indicators">
          {featuredMovies.map((m, idx) => (
            <span
              key={m.id}
              className={`hero-indicator-dot ${idx === currentIndex ? "active" : ""}`}
              onClick={() => setCurrentIndex(idx)}
              title={m.title}
            />
          ))}
        </div>
      )}
    </div>
  );
}
