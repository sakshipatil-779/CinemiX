/**
 * Simple if-else weight-based scoring engine for CinemiX
 *
 * Scoring Rules:
 * - Genre match:    50 points
 * - Language match: 20 points
 * - Rating quality: 20 points
 * - Keyword match:  10 points
 *
 * The minimum rating acts as an eligibility filter. For eligible movies,
 * rating points are calculated proportionally to the movie's rating.
 * The final score is normalized to 100 based on the preferences the user actually supplied.
 *
 * Ranking:
 * - Rank eligible movies by match score, then rating and popularity.
 */

export function getMovieMatchScoreDetails(movie, filters = {}, contextData = {}) {
  const { preferences = {} } = contextData;
  const {
    selectedGenres = [],
    selectedLanguage = "All",
    minRating = 0,
    searchQuery = ""
  } = filters;

  const movieRating = Number(movie.rating || 0);

  // 1. Minimum rating acts as an eligibility filter:
  // "IF the rating is below the minimum, exclude the movie."
  const effectiveMinRating = Number(minRating || preferences.minRating || 0);
  if (effectiveMinRating > 0 && movieRating < effectiveMinRating) {
    return {
      isEligible: false,
      matchScore: 0,
      totalPoints: 0,
      maxPoints: 0,
      breakdown: { genre: 0, language: 0, rating: 0, keyword: 0 }
    };
  }

  let totalPoints = 0;
  let maxPoints = 0;
  const breakdown = { genre: 0, language: 0, rating: 0, keyword: 0 };

  // Rule 1: Genre match (50 points)
  const suppliedGenres = (selectedGenres && selectedGenres.length > 0)
    ? selectedGenres
    : (preferences.genres && preferences.genres.length > 0 ? preferences.genres : null);

  if (suppliedGenres && suppliedGenres.length > 0) {
    maxPoints += 50;
    const movieGenres = (movie.genres || []).map(g => g.toLowerCase());
    const matchesGenre = suppliedGenres.some(g => movieGenres.includes(g.toLowerCase()));

    // IF the selected genre matches, add 50 points
    if (matchesGenre) {
      totalPoints += 50;
      breakdown.genre = 50;
    }
  }

  // Rule 2: Language match (20 points)
  const suppliedLanguage = (selectedLanguage && selectedLanguage !== "All")
    ? selectedLanguage
    : (preferences.languages && preferences.languages.length > 0 ? preferences.languages : null);

  if (suppliedLanguage) {
    maxPoints += 20;
    const movieLang = (movie.language || "").toLowerCase();
    const matchesLang = Array.isArray(suppliedLanguage)
      ? suppliedLanguage.some(l => l.toLowerCase() === movieLang)
      : suppliedLanguage.toLowerCase() === movieLang;

    // IF the language matches, add 20 points
    if (matchesLang) {
      totalPoints += 20;
      breakdown.language = 20;
    }
  }

  // Rule 3: Rating quality (20 points)
  // "ELSE, calculate rating points proportionally to the movie's rating."
  maxPoints += 20;
  const clampedRating = Math.min(10, Math.max(0, movieRating));
  const ratingPoints = (clampedRating / 10) * 20;
  totalPoints += ratingPoints;
  breakdown.rating = Math.round(ratingPoints);

  // Rule 4: Keyword match (10 points)
  const keyword = (searchQuery || "").trim().toLowerCase();
  if (keyword.length > 0) {
    maxPoints += 10;
    const inTitle = movie.title?.toLowerCase().includes(keyword);
    const inOverview = movie.description?.toLowerCase().includes(keyword) || movie.tagline?.toLowerCase().includes(keyword);
    const inCast = (movie.cast || []).some(c => c.toLowerCase().includes(keyword));
    const inDirector = movie.director?.toLowerCase().includes(keyword);
    const inGenres = (movie.genres || []).some(g => g.toLowerCase().includes(keyword));

    // IF the keyword matches the title, overview, or dataset keywords, add 10 points
    if (inTitle || inOverview || inCast || inDirector || inGenres) {
      totalPoints += 10;
      breakdown.keyword = 10;
    }
  }

  // "The final score is normalized to 100 based on the preferences the user actually supplied."
  const finalScore = maxPoints > 0
    ? Math.min(100, Math.max(0, Math.round((totalPoints / maxPoints) * 100)))
    : Math.round((clampedRating / 10) * 100);

  return {
    isEligible: true,
    matchScore: finalScore,
    totalPoints: Math.round(totalPoints),
    maxPoints,
    breakdown
  };
}

export function calculateMovieMatchScore(movie, filters = {}, contextData = {}) {
  const details = getMovieMatchScoreDetails(movie, filters, contextData);
  return details.matchScore;
}

export function filterMovies(movies, filters, contextData = {}) {
  const {
    searchQuery = "",
    selectedGenres = [],
    minRating = 0,
    selectedLanguage = "All",
    releaseYear = "All",
    durationCategory = "All",
    sortBy = "match-score"
  } = filters;

  const normalizedSearch = searchQuery.trim().toLowerCase();
  const hasKeyword = normalizedSearch.length > 0;
  const hasGenre = selectedGenres.length > 0;
  const hasLanguage = selectedLanguage && selectedLanguage !== "All";

  const results = [];

  for (const movie of movies) {
    // 1. Release Year Filter
    if (releaseYear && releaseYear !== "All") {
      const y = movie.releaseYear || 0;
      if (releaseYear === "2020s" && y < 2020) continue;
      else if (releaseYear === "2010s" && (y < 2010 || y > 2019)) continue;
      else if (releaseYear === "2000s" && (y < 2000 || y > 2009)) continue;
      else if (releaseYear === "1990s" && (y < 1990 || y > 1999)) continue;
      else if (releaseYear === "1980s" && (y < 1980 || y > 1989)) continue;
      else if (releaseYear === "pre-1980" && y >= 1980) continue;
      else if (releaseYear === "2020-2024" && (y < 2020 || y > 2024)) continue;
      else if (releaseYear === "2025+" && y < 2025) continue;
      else {
        const numericYear = Number(releaseYear);
        if (!isNaN(numericYear) && y !== numericYear) continue;
      }
    }

    // 2. Duration Filter
    if (durationCategory && durationCategory !== "All") {
      const duration = movie.duration || 0;
      if (durationCategory === "under-90" && duration >= 90) continue;
      if (durationCategory === "90-120" && (duration < 90 || duration > 120)) continue;
      if (durationCategory === "over-120" && duration <= 120) continue;
    }

    // 3. Score calculation with eligibility check
    const scoreObj = getMovieMatchScoreDetails(movie, filters, contextData);

    // IF the rating is below the minimum, exclude the movie
    if (!scoreObj.isEligible) {
      continue;
    }

    // 4. Relevance Filter:
    // If user explicitly applied criteria (genre, language, search query),
    // ensure the movie has a positive match on at least one user-selected preference.
    if (hasGenre || hasLanguage || hasKeyword) {
      const hasAnyPreferenceMatch =
        (hasGenre && scoreObj.breakdown.genre > 0) ||
        (hasLanguage && scoreObj.breakdown.language > 0) ||
        (hasKeyword && scoreObj.breakdown.keyword > 0);

      if (!hasAnyPreferenceMatch) {
        continue;
      }
    }

    results.push({
      ...movie,
      matchScore: scoreObj.matchScore,
      scoreBreakdown: scoreObj.breakdown
    });
  }

  // Sorting
  // "Rank eligible movies by match score, then rating and popularity."
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
        return (b.popularity || 0) - (a.popularity || 0);
      case "match-score":
      default:
        // 1. match score
        if (b.matchScore !== a.matchScore) {
          return (b.matchScore || 0) - (a.matchScore || 0);
        }
        // 2. then rating
        if ((b.rating || 0) !== (a.rating || 0)) {
          return (b.rating || 0) - (a.rating || 0);
        }
        // 3. then popularity
        return (b.popularity || 0) - (a.popularity || 0);
    }
  });

  return results;
}
