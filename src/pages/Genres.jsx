import React from "react";
import { useMovieContext } from "../context/MovieContext";
import { GENRE_METADATA } from "../data/movies";
import GenreCard from "../components/GenreCard";

export default function Genres() {
  const { movies } = useMovieContext();

  // Compute movie counts per genre
  const genreCounts = React.useMemo(() => {
    const counts = {};
    movies.forEach(m => {
      (m.genres || []).forEach(g => {
        counts[g] = (counts[g] || 0) + 1;
      });
    });
    return counts;
  }, [movies]);

  return (
    <div className="genres-page">
      <div style={{ marginBottom: "26px" }}>
        <h1 style={{ fontSize: "28px", color: "#ffffff", marginBottom: "6px" }}>
          Browse by Genre
        </h1>
        <p style={{ color: "var(--text-muted)", fontSize: "14px" }}>
          Select a category to explore award-winning titles tailored to your cinematic taste.
        </p>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
          gap: "20px"
        }}
      >
        {GENRE_METADATA.map(meta => (
          <GenreCard
            key={meta.name}
            genre={meta.name}
            count={genreCounts[meta.name] || 0}
            image={meta.image}
          />
        ))}
      </div>
    </div>
  );
}
