import React, { useEffect } from "react";
import { X, Film } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useMovieContext } from "../context/MovieContext";

export default function TrailerModal() {
  const { trailerMovie, setTrailerMovie } = useMovieContext();

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") setTrailerMovie(null);
    };
    if (trailerMovie) window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [trailerMovie, setTrailerMovie]);

  if (!trailerMovie) return null;

  return (
    <AnimatePresence>
      <div className="modal-backdrop" onClick={() => setTrailerMovie(null)}>
        <motion.div
          className="modal-container"
          style={{ maxWidth: "900px", padding: "20px", background: "#100C19" }}
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.92 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <Film size={20} color="var(--accent-primary)" />
              <h3 style={{ fontSize: "18px", color: "#ffffff" }}>
                Trailer: {trailerMovie.title}
              </h3>
            </div>
            <button
              className="modal-close-btn"
              style={{ position: "static" }}
              onClick={() => setTrailerMovie(null)}
              title="Close Trailer"
            >
              <X size={18} />
            </button>
          </div>

          {/* 16:9 Video Container */}
          <div style={{ position: "relative", width: "100%", paddingBottom: "56.25%", borderRadius: "14px", overflow: "hidden", background: "#000000" }}>
            <iframe
              style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", border: "none" }}
              src={`${trailerMovie.trailerUrl || "https://www.youtube.com/embed/ScMzIvxBSi4"}?autoplay=1&rel=0`}
              title={`${trailerMovie.title} Official Trailer`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>

          <div style={{ marginTop: "16px", display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "13px", color: "var(--text-muted)" }}>
            <span>CinemiX Cinematic Cinema Preview</span>
            <span>Duration: {trailerMovie.duration} min • {trailerMovie.releaseYear}</span>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
