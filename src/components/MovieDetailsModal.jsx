import React, { useEffect } from "react";
import { X, Play, Heart, Star, Clock, Globe } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useMovieContext } from "../context/MovieContext";
import RatingControl from "./RatingControl";

export default function MovieDetailsModal() {
  const {
    selectedMovie,
    setSelectedMovie,
    setTrailerMovie,
    toggleFavourite,
    isFavourite
  } = useMovieContext();

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setSelectedMovie(null);
      }
    };
    if (selectedMovie) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedMovie, setSelectedMovie]);

  if (!selectedMovie) return null;

  const favourite = isFavourite(selectedMovie.id);

  return (
    <AnimatePresence>
      <div className="modal-backdrop" onClick={() => setSelectedMovie(null)}>
        <motion.div
          className="modal-container"
          initial={{ opacity: 0, scale: 0.94, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 20 }}
          transition={{ duration: 0.22, ease: "easeOut" }}
          onClick={(e) => e.stopPropagation()}
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-movie-title"
        >
          {/* Close Button */}
          <button
            className="modal-close-btn"
            onClick={() => setSelectedMovie(null)}
            title="Close details (Esc)"
            aria-label="Close details"
          >
            <X size={20} />
          </button>

          {/* Hero Backdrop Header */}
          <div className="modal-hero">
            <img
              src={selectedMovie.backdrop || selectedMovie.poster}
              alt={selectedMovie.title}
              className="modal-backdrop-img"
            />
            <div className="modal-hero-gradient" />
          </div>

          {/* Content Body */}
          <div className="modal-content-body">
            <div className="modal-top-row">
              <img
                src={selectedMovie.poster || selectedMovie.backdrop}
                alt={selectedMovie.title}
                className="modal-poster"
              />

              <div className="modal-header-info">
                <h2 id="modal-movie-title" className="modal-title">
                  {selectedMovie.title}
                </h2>
                {selectedMovie.tagline && (
                  <p className="modal-tagline">"{selectedMovie.tagline}"</p>
                )}

                <div className="modal-meta-row">
                  <div className="modal-meta-item">
                    <Star size={15} fill="#f59e0b" color="#f59e0b" />
                    <strong style={{ color: "#ffffff" }}>{selectedMovie.rating}</strong> / 10
                    <span style={{ fontSize: "11px", color: "var(--text-dim)" }}>
                      ({selectedMovie.voteCount ? selectedMovie.voteCount.toLocaleString() : "1.2k"} votes)
                    </span>
                  </div>
                  <span>•</span>
                  <div className="modal-meta-item">
                    <Clock size={15} />
                    <span>{selectedMovie.duration} min</span>
                  </div>
                  <span>•</span>
                  <span>{selectedMovie.releaseYear}</span>
                  <span>•</span>
                  <div className="modal-meta-item">
                    <Globe size={15} />
                    <span>{selectedMovie.language}</span>
                  </div>
                </div>

                {/* Genre badges */}
                <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginTop: "4px" }}>
                  {selectedMovie.genres?.map(genre => (
                    <span key={genre} className="genre-pill">
                      {genre}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Action Bar */}
            <div className="modal-actions">
              <button
                className="btn-primary"
                onClick={() => setTrailerMovie(selectedMovie)}
              >
                <Play size={16} fill="#ffffff" />
                <span>Watch Trailer</span>
              </button>

              <button
                className={`btn-secondary ${favourite ? "active glow-pill" : ""}`}
                onClick={() => toggleFavourite(selectedMovie.id)}
                style={favourite ? { borderColor: "#f43f5e", color: "#f43f5e" } : {}}
              >
                <Heart size={16} fill={favourite ? "#f43f5e" : "none"} />
                <span>{favourite ? "Favourited" : "Add to Favourites"}</span>
              </button>
            </div>

            {/* User Personal Rating Control */}
            <RatingControl movieId={selectedMovie.id} />

            {/* Synopsis */}
            <div style={{ marginBottom: "24px" }}>
              <h3 className="modal-section-title">Synopsis</h3>
              <p className="modal-synopsis">{selectedMovie.description}</p>
            </div>

            {/* Metadata Grid */}
            <div className="metadata-grid">
              <div>
                <div className="metadata-item-label">Director</div>
                <div className="metadata-item-value">{selectedMovie.director || "Unknown"}</div>
              </div>

              <div>
                <div className="metadata-item-label">Cast Members</div>
                <div className="metadata-item-value">
                  {selectedMovie.cast ? selectedMovie.cast.join(", ") : "Various Artists"}
                </div>
              </div>

              <div>
                <div className="metadata-item-label">Audio & Subtitles</div>
                <div className="metadata-item-value">
                  {selectedMovie.language} (Original), English Subtitles
                </div>
              </div>

              <div>
                <div className="metadata-item-label">Popularity Index</div>
                <div className="metadata-item-value">{selectedMovie.popularity || 85}% Match</div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
