import React, { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { Filter } from "lucide-react";
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
  sortBy: "match-score"
};

export default function Explore() {
  const {
    movies,
    globalSearch,
    setGlobalSearch,
    preferences,
    userRatings,
    favourites
  } = useMovieContext();
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

  // Check if any filter or search query is currently active
  const hasFiltersApplied = Boolean(
    (filters.selectedGenres && filters.selectedGenres.length > 0) ||
    (filters.minRating && filters.minRating > 0) ||
    (filters.selectedLanguage && filters.selectedLanguage !== "All") ||
    (filters.releaseYear && filters.releaseYear !== "All") ||
    (filters.durationCategory && filters.durationCategory !== "All") ||
    (globalSearch && globalSearch.trim().length > 0)
  );

  // Combined filtering with match score calculation (only returns movies when filters are applied)
  const filteredResults = useMemo(() => {
    if (!hasFiltersApplied) {
      return [];
    }
    return filterMovies(
      movies,
      {
        ...filters,
        searchQuery: globalSearch
      },
      { preferences, userRatings, favourites }
    );
  }, [hasFiltersApplied, movies, filters, globalSearch, preferences, userRatings, favourites]);

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
        hasFiltersApplied={hasFiltersApplied}
      />

      {/* Results Grid or Empty State */}
      {!hasFiltersApplied ? (
        <EmptyState
          icon={Filter}
          title="No filters applied"
          description="Select a genre, choose a language, set a minimum rating, or search above to discover matching movies."
        />
      ) : filteredResults.length > 0 ? (
        <div className="movie-grid">
          {filteredResults.map(movie => (
            <MovieCard
              key={movie.id}
              movie={movie}
              showMatchScore={true}
              matchScore={movie.matchScore}
            />
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
