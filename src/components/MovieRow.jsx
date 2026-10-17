import React from "react";
import { useNavigate } from "react-router-dom";
import MovieCard from "./MovieCard";

export default function MovieRow({
  title,
  movies = [],
  seeAllPath = "/explore",
  isRanked = false,
  badge = null
}) {
  const navigate = useNavigate();

  if (!movies || movies.length === 0) return null;

  return (
    <section className="movie-section">
      <div className="section-header">
        <h2 className="section-title">
          {title}
          {badge}
        </h2>
        {seeAllPath && (
          <button
            className="section-see-all"
            onClick={() => navigate(seeAllPath)}
            title={`View all ${title}`}
          >
            See All
          </button>
        )}
      </div>

      <div className="movie-row-scroll">
        {movies.map((movie, index) => (
          <MovieCard
            key={movie.id}
            movie={movie}
            isRowItem={true}
            rankingNumber={isRanked ? index + 1 : null}
            showMatchScore={false}
          />
        ))}
      </div>
    </section>
  );
}
