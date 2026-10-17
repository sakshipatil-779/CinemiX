/**
 * Filtering and sorting utility for CinemiX movies
 */

export function calculateMovieMatchScore(movie, filters = {}, contextData = {}) {
  const { preferences = {}, userRatings = {}, favourites = [] } = contextData;
  let score = 75; // baseline

  // Rating contribution (movie.rating 7.0 - 10.0 => +4 to +12)
  const rating = movie.rating || 7.0;
  score += Math.round(((rating - 6) / 4) * 12);

  // Genre match with active filters (if any)
  const selectedGenres = filters.selectedGenres || [];
  if (selectedGenres.length > 0) {
    const matchedCount = (movie.genres || []).filter(g => selectedGenres.includes(g)).length;
    if (matchedCount > 0) {
      score += Math.round((matchedCount / selectedGenres.length) * 10);
    }
  } else if (preferences.genres) {
    const matchedPref = (movie.genres || []).filter(g => preferences.genres.includes(g)).length;
    score += Math.min(8, matchedPref * 3);
  }

  // Language match
  if (filters.selectedLanguage && filters.selectedLanguage !== "All") {
    if (movie.language === filters.selectedLanguage) score += 6;
  } else if (preferences.languages && preferences.languages.includes(movie.language)) {
    score += 4;
  }

  // Favourites / high user rating bonus
  if (favourites.includes(movie.id)) score += 6;
  if (userRatings[movie.id] && Number(userRatings[movie.id]) >= 8) score += 5;

  // Search match bonus
  if (filters.searchQuery) {
    const q = filters.searchQuery.toLowerCase();
    if (movie.title?.toLowerCase().includes(q)) score += 5;
  }

  // Popularity slight boost
  if ((movie.popularity || 0) >= 90) score += 3;

  return Math.min(99, Math.max(70, Math.round(score)));
}

export function filterMovies(movies, filters, contextData = {}) {
  const {
    searchQuery = "",
    selectedGenres = [],
    minRating = 0,
    selectedLanguage = "All",
    releaseYear = "All",
    durationCategory = "All", // "all", "short" (<90), "medium" (90-120), "long" (>120)
    sortBy = "popularity" // "popularity", "match-score", "rating-desc", "year-desc", "year-asc", "title-asc"
  } = filters;

  const normalizedSearch = searchQuery.trim().toLowerCase();

  const results = movies
    .filter(movie => {
      // 1. Text Search (title, genre, language, director, cast, description)
      if (normalizedSearch) {
        const titleMatch = movie.title?.toLowerCase().includes(normalizedSearch);
        const descMatch = movie.description?.toLowerCase().includes(normalizedSearch);
        const directorMatch = movie.director?.toLowerCase().includes(normalizedSearch);
        const castMatch = (movie.cast || []).some(c => c.toLowerCase().includes(normalizedSearch));
        const genreMatch = (movie.genres || []).some(g => g.toLowerCase().includes(normalizedSearch));
        const langMatch = movie.language?.toLowerCase().includes(normalizedSearch);

        if (!titleMatch && !descMatch && !directorMatch && !castMatch && !genreMatch && !langMatch) {
          return false;
        }
      }

      // 2. Genre Filter (all selected must be present or any match based on user selection)
      if (selectedGenres.length > 0) {
        const hasMatch = selectedGenres.some(selectedGenre => 
          (movie.genres || []).includes(selectedGenre)
        );
        if (!hasMatch) return false;
      }

      // 3. Minimum Rating Filter
      if (minRating > 0 && (movie.rating || 0) < minRating) {
        return false;
      }

      // 4. Language Filter
      if (selectedLanguage && selectedLanguage !== "All") {
        if (movie.language !== selectedLanguage) return false;
      }

      // 5. Release Year Filter
      if (releaseYear && releaseYear !== "All") {
        if (releaseYear === "2025+") {
          if (movie.releaseYear < 2025) return false;
        } else if (releaseYear === "2020-2024") {
          if (movie.releaseYear < 2020 || movie.releaseYear > 2024) return false;
        } else {
          const numericYear = Number(releaseYear);
          if (!isNaN(numericYear) && movie.releaseYear !== numericYear) return false;
        }
      }

      // 6. Duration Filter
      if (durationCategory && durationCategory !== "All") {
        const duration = movie.duration || 0;
        if (durationCategory === "under-90" && duration >= 90) return false;
        if (durationCategory === "90-120" && (duration < 90 || duration > 120)) return false;
        if (durationCategory === "over-120" && duration <= 120) return false;
      }

      return true;
    })
    .map(movie => ({
      ...movie,
      matchScore: calculateMovieMatchScore(movie, filters, contextData)
    }));

  // Sorting
  results.sort((a, b) => {
    switch (sortBy) {
      case "match-score":
        return (b.matchScore || 0) - (a.matchScore || 0);
      case "rating-desc":
        return (b.rating || 0) - (a.rating || 0);
      case "year-desc":
        return (b.releaseYear || 0) - (a.releaseYear || 0);
      case "year-asc":
        return (a.releaseYear || 0) - (b.releaseYear || 0);
      case "title-asc":
        return (a.title || "").localeCompare(b.title || "");
      case "popularity":
      default:
        return (b.popularity || 0) - (a.popularity || 0);
    }
  });

  return results;
}
