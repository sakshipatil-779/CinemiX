/**
 * Filtering and sorting utility for CinemiX movies
 */

export function filterMovies(movies, filters) {
  const {
    searchQuery = "",
    selectedGenres = [],
    minRating = 0,
    selectedLanguage = "All",
    releaseYear = "All",
    durationCategory = "All", // "all", "short" (<90), "medium" (90-120), "long" (>120)
    sortBy = "popularity" // "popularity", "rating-desc", "year-desc", "year-asc", "title-asc"
  } = filters;

  const normalizedSearch = searchQuery.trim().toLowerCase();

  const results = movies.filter(movie => {
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
  });

  // Sorting
  results.sort((a, b) => {
    switch (sortBy) {
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
