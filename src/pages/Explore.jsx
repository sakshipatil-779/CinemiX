import React, { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { useMovieContext } from "../context/MovieContext";
import FilterPanel from "../components/FilterPanel";
import MovieCard from "../components/MovieCard";
import EmptyState from "../components/EmptyState";
import { filterMovies } from "../utils/movieFilters";

const DEFAULT_FILTERS = {
  selectedGenres: [],
  minRating: 0,
  selectedLanguage: "All",
  releaseYear: "All",
  durationCategory: "All",
  sortBy: "popularity"
};

export default function Explore() {
  const { movies, globalSearch, setGlobalSearch } = useMovieContext();
  const [searchParams, setSearchParams] = useSearchParams();

  const [filters, setFilters] = useState(DEFAULT_FILTERS);

  // Sync URL query params if any (e.g. ?genre=Action)
  useEffect(() => {
    const genreParam = searchParams.get("genre");
    const sortParam = searchParams.get("sort");

    if (genreParam || sortParam) {
      setFilters(prev => ({
        ...prev,
        selectedGenres: genreParam ? [genreParam] : prev.selectedGenres,
        sortBy: sortParam || prev.sortBy
      }));
    }
  }, [searchParams]);

  // Combined filtering
  const filteredResults = useMemo(() => {
    return filterMovies(movies, {
      ...filters,
      searchQuery: globalSearch
    });
  }, [movies, filters, globalSearch]);

  const handleResetFilters = () => {
    setFilters(DEFAULT_FILTERS);
    setGlobalSearch("");
    setSearchParams({});
  };

  return (
    <div className="explore-page">
      <div style={{ marginBottom: "24px" }}>
        <h1 style={{ fontSize: "28px", color: "#ffffff", marginBottom: "6px" }}>
          Explore Movies
        </h1>
        <p style={{ color: "var(--text-muted)", fontSize: "14px" }}>
          Discover our curated collection of international cinema, indie gems, and blockbuster sagas.
        </p>
      </div>

      {/* Filter Toolbar */}
      <FilterPanel
        filters={filters}
        setFilters={setFilters}
        totalResults={filteredResults.length}
        onReset={handleResetFilters}
      />

      {/* Results Grid or Empty State */}
      {filteredResults.length > 0 ? (
        <div className="movie-grid">
          {filteredResults.map(movie => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      ) : (
        <EmptyState
          title="No movies found"
          description={`No movies match your current criteria${globalSearch ? ` for "${globalSearch}"` : ""}. Try adjusting the filters or clearing the search.`}
          actionText="Clear All Filters"
          onAction={handleResetFilters}
        />
      )}
    </div>
  );
}
