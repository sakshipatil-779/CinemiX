import React from "react";
import HeroBanner from "../components/HeroBanner";
import MovieRow from "../components/MovieRow";
import { useMovieContext } from "../context/MovieContext";
import { Sparkles, Flame, Clock } from "lucide-react";

export default function Home() {
  const { movies, recommendations } = useMovieContext();

  const trendingMovies = movies.filter(m => m.trending);
  const recentlyAddedMovies = movies.filter(m => m.recentlyAdded);

  return (
    <div className="home-page-container">
      {/* Featured Hero Banner */}
      <HeroBanner />

      {/* Recommended For You Row */}
      <MovieRow
        title="Recommended for You"
        movies={recommendations.slice(0, 8)}
        seeAllPath="/explore?sort=match-score"
        badge={
          <span
            style={{
              fontSize: "11px",
              padding: "3px 9px",
              borderRadius: "999px",
              background: "rgba(185, 138, 245, 0.15)",
              color: "var(--accent-primary)",
              fontWeight: "600",
              display: "inline-flex",
              alignItems: "center",
              gap: "4px"
            }}
          >
            <Sparkles size={11} /> AI Match
          </span>
        }
      />

      {/* Trending Movies Row */}
      <MovieRow
        title="Now Trending"
        movies={trendingMovies}
        isRanked={true}
        seeAllPath="/explore?sort=popularity"
        badge={
          <span
            style={{
              fontSize: "11px",
              padding: "3px 9px",
              borderRadius: "999px",
              background: "rgba(245, 158, 11, 0.15)",
              color: "#f59e0b",
              fontWeight: "600",
              display: "inline-flex",
              alignItems: "center",
              gap: "4px"
            }}
          >
            <Flame size={11} /> Top 10
          </span>
        }
      />

      {/* Recently Added Row */}
      <MovieRow
        title="Recently Added"
        movies={recentlyAddedMovies}
        seeAllPath="/recently-added"
        badge={
          <span
            style={{
              fontSize: "11px",
              padding: "3px 9px",
              borderRadius: "999px",
              background: "rgba(16, 185, 129, 0.15)",
              color: "#10b981",
              fontWeight: "600",
              display: "inline-flex",
              alignItems: "center",
              gap: "4px"
            }}
          >
            <Clock size={11} /> New Releases
          </span>
        }
      />
    </div>
  );
}
