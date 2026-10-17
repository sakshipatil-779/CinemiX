import React from "react";
import { RotateCcw, Filter, Star, Sparkles } from "lucide-react";
import { ALL_GENRES, ALL_LANGUAGES } from "../data/movies";

export default function FilterPanel({
  filters,
  setFilters,
  totalResults,
  onReset
}) {
  const {
    selectedGenres,
    minRating,
    selectedLanguage,
    releaseYear,
    durationCategory,
    sortBy
  } = filters;

  const toggleGenre = (genre) => {
    setFilters(prev => {
      const exists = prev.selectedGenres.includes(genre);
      const updated = exists
        ? prev.selectedGenres.filter(g => g !== genre)
        : [...prev.selectedGenres, genre];
      return { ...prev, selectedGenres: updated };
    });
  };

  const handleMinRatingChange = (e) => {
    setFilters(prev => ({ ...prev, minRating: Number(e.target.value) }));
  };

  const handleLanguageChange = (e) => {
    setFilters(prev => ({ ...prev, selectedLanguage: e.target.value }));
  };

  const handleYearChange = (e) => {
    setFilters(prev => ({ ...prev, releaseYear: e.target.value }));
  };

  const handleDurationChange = (e) => {
    setFilters(prev => ({ ...prev, durationCategory: e.target.value }));
  };

  const handleSortChange = (e) => {
    setFilters(prev => ({ ...prev, sortBy: e.target.value }));
  };

  return (
    <div className="filter-panel">
      {/* Top Controls Row */}
      <div className="filter-row" style={{ justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <Filter size={18} color="var(--accent-primary)" />
          <span style={{ fontWeight: "700", color: "#ffffff", fontSize: "15px" }}>
            Filters & Sorting
          </span>
        </div>

        {/* Sort Dropdown */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <span className="filter-label" style={{ margin: 0 }}>Sort By:</span>
          <select
            className="filter-select"
            value={sortBy}
            onChange={handleSortChange}
            aria-label="Sort movies by"
          >
            <option value="popularity">Most Popular</option>
            <option value="rating-desc">Highest Rated</option>
            <option value="year-desc">Newest First</option>
            <option value="year-asc">Oldest First</option>
            <option value="title-asc">Title (A - Z)</option>
          </select>
        </div>
      </div>

      {/* Genre Pills */}
      <div className="filter-group">
        <span className="filter-label">Filter by Genre:</span>
        <div className="filter-pill-container">
          {ALL_GENRES.map(genre => {
            const isActive = selectedGenres.includes(genre);
            return (
              <button
                key={genre}
                className={`filter-pill ${isActive ? "active" : ""}`}
                onClick={() => toggleGenre(genre)}
              >
                {genre}
              </button>
            );
          })}
        </div>
      </div>

      {/* Secondary Row: Rating, Language, Year, Duration */}
      <div className="filter-row">
        {/* Rating Slider */}
        <div className="filter-group" style={{ minWidth: "180px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span className="filter-label">Min Rating:</span>
            <span style={{ fontSize: "12px", color: "var(--accent-primary)", fontWeight: "700" }}>
              {minRating > 0 ? `${minRating.toFixed(1)} / 10` : "Any"}
            </span>
          </div>
          <div className="rating-slider-box">
            <input
              type="range"
              min="0"
              max="9.5"
              step="0.5"
              value={minRating}
              onChange={handleMinRatingChange}
              className="rating-slider"
              aria-label="Minimum rating"
            />
          </div>
        </div>

        {/* Language Select */}
        <div className="filter-group">
          <span className="filter-label">Language:</span>
          <select
            className="filter-select"
            value={selectedLanguage}
            onChange={handleLanguageChange}
            aria-label="Select language"
          >
            <option value="All">All Languages</option>
            {ALL_LANGUAGES.map(lang => (
              <option key={lang} value={lang}>{lang}</option>
            ))}
          </select>
        </div>

        {/* Release Year */}
        <div className="filter-group">
          <span className="filter-label">Release Era:</span>
          <select
            className="filter-select"
            value={releaseYear}
            onChange={handleYearChange}
            aria-label="Select release year"
          >
            <option value="All">All Years</option>
            <option value="2025+">2025 & Beyond (Upcoming)</option>
            <option value="2024">2024 Releases</option>
            <option value="2023">2023 Releases</option>
            <option value="2020-2024">Recent (2020 - 2024)</option>
          </select>
        </div>

        {/* Duration */}
        <div className="filter-group">
          <span className="filter-label">Duration:</span>
          <select
            className="filter-select"
            value={durationCategory}
            onChange={handleDurationChange}
            aria-label="Select duration"
          >
            <option value="All">Any Duration</option>
            <option value="under-90">Under 90 mins</option>
            <option value="90-120">90 – 120 mins</option>
            <option value="over-120">Over 120 mins</option>
          </select>
        </div>
      </div>

      {/* Action / Results Bar */}
      <div className="filter-actions-bar">
        <div className="results-count">
          Showing <strong>{totalResults}</strong> movie{totalResults === 1 ? "" : "s"}
        </div>

        <button className="clear-filters-btn" onClick={onReset}>
          <RotateCcw size={13} />
          <span>Clear All Filters</span>
        </button>
      </div>
    </div>
  );
}
