import React from "react";
import { useNavigate } from "react-router-dom";

export default function GenreCard({ genre, count, image }) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/explore?genre=${encodeURIComponent(genre)}`);
  };

  return (
    <div
      className="genre-card"
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleClick();
        }
      }}
      title={`Explore ${genre} movies`}
    >
      <img
        src={image || "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80"}
        alt={genre}
        className="genre-card-img"
        loading="lazy"
      />
      <div className="genre-card-overlay">
        <h3 className="genre-card-name">{genre}</h3>
        <span className="genre-card-count">{count} {count === 1 ? "Movie" : "Movies"}</span>
      </div>
    </div>
  );
}
