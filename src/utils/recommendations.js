/**
 * CinemiX Transparent Recommendation Engine
 *
 * Scoring Rules (Weight-Based):
 * - Genre match:    50 points
 * - Language match: 20 points
 * - Rating quality: 20 points
 * - Keyword/Affinity match: 10 points
 *
 * Eligibility filter:
 * - Minimum rating acts as an eligibility filter.
 * - Rank eligible movies by match score, then rating and popularity.
 */

export function getRecommendations(movies, preferences = {}, ratedMovies = {}, favouriteMovies = []) {
  const {
    genres: preferredGenres = ["Adventure", "Sci-Fi", "Fantasy", "Action"],
    languages: preferredLanguages = ["English", "Japanese", "French", "Spanish"],
    minRating = 7.0
  } = preferences;

  const favSet = new Set(favouriteMovies);

  // Extract positive seeds from user ratings >= 8 or favourites
  const positiveMovieIds = Object.keys(ratedMovies).filter(id => Number(ratedMovies[id]) >= 8);
  const positiveSeedMovies = movies.filter(m => favSet.has(m.id) || positiveMovieIds.includes(m.id));

  const positiveGenres = new Set();
  const positiveDirectors = new Set();

  positiveSeedMovies.forEach(m => {
    (m.genres || []).forEach(g => positiveGenres.add(g.toLowerCase()));
    if (m.director) positiveDirectors.add(m.director.toLowerCase());
  });

  const scoredMovies = movies.map(movie => {
    const movieRating = Number(movie.rating || 0);

    // Minimum rating eligibility filter:
    // "IF the rating is below the minimum, exclude the movie."
    if (minRating > 0 && movieRating < minRating) {
      return null;
    }

    // Heavy penalty for negatively rated movies
    const userRating = ratedMovies[movie.id];
    if (userRating && Number(userRating) < 5) {
      return null;
    }

    let genreScore = 0;
    let languageScore = 0;
    let qualityScore = 0;
    let keywordScore = 0;
    const reasons = [];

    // 1. Genre Match (50 points)
    // "IF the selected genre matches, add 50 points."
    const movieGenres = (movie.genres || []).map(g => g.toLowerCase());
    const matchedPrefGenres = preferredGenres.filter(g => movieGenres.includes(g.toLowerCase()));
    const matchedSeedGenres = [...positiveGenres].filter(g => movieGenres.includes(g));

    if (matchedPrefGenres.length > 0) {
      genreScore = 50;
      reasons.push(`Matches your genre preference: ${matchedPrefGenres.slice(0, 2).join(" & ")}`);
    } else if (matchedSeedGenres.length > 0) {
      genreScore = 40;
      reasons.push(`Shares themes with movies you loved (${matchedSeedGenres.slice(0, 2).join(", ")})`);
    }

    // 2. Language Match (20 points)
    // "IF the language matches, add 20 points."
    const movieLang = (movie.language || "").toLowerCase();
    const isPreferredLang = preferredLanguages.some(l => l.toLowerCase() === movieLang);

    if (isPreferredLang) {
      languageScore = 20;
      if (movie.language !== "English") {
        reasons.push(`Available in your preferred language: ${movie.language}`);
      }
    }

    // 3. Rating Quality (20 points)
    // "ELSE, calculate rating points proportionally to the movie's rating."
    const clampedRating = Math.min(10, Math.max(0, movieRating));
    qualityScore = Math.round((clampedRating / 10) * 20);
    if (movieRating >= 8.0) {
      reasons.push(`Critically acclaimed score of ${movie.rating}/10`);
    }

    // 4. Keyword / Director / Similarity Match (10 points)
    // "IF the keyword matches the title, overview, or dataset keywords, add 10 points."
    if (movie.director && positiveDirectors.has(movie.director.toLowerCase())) {
      keywordScore = 10;
      reasons.push(`Directed by ${movie.director}, whose work you enjoy`);
    } else if (movie.trending) {
      keywordScore = 10;
      reasons.push("Trending now among global viewers");
    } else if ((movie.popularity || 0) >= 80) {
      keywordScore = 10;
    }

    if (reasons.length === 0) {
      reasons.push(`High recommendation score (${movie.rating} rating)`);
    }

    const totalScore = Math.min(100, genreScore + languageScore + qualityScore + keywordScore);

    return {
      ...movie,
      recommendationScore: totalScore,
      matchScore: totalScore,
      scoreBreakdown: {
        genre: genreScore,
        language: languageScore,
        quality: qualityScore,
        keyword: keywordScore
      },
      recommendationReasons: reasons.slice(0, 2),
      isFavourited: favSet.has(movie.id)
    };
  }).filter(Boolean);

  // Exclude movies already favourited from the pure recommendation carousel/list
  const eligibleRecommendations = scoredMovies.filter(m => !favSet.has(m.id));

  // "Rank eligible movies by match score, then rating and popularity."
  eligibleRecommendations.sort((a, b) => {
    if (b.recommendationScore !== a.recommendationScore) {
      return b.recommendationScore - a.recommendationScore;
    }
    if ((b.rating || 0) !== (a.rating || 0)) {
      return (b.rating || 0) - (a.rating || 0);
    }
    return (b.popularity || 0) - (a.popularity || 0);
  });

  return eligibleRecommendations;
}
