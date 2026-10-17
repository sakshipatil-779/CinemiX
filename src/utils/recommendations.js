/**
 * CinemiX Transparent Recommendation Engine
 * 
 * Computes recommendation score (0-100) based on:
 * - Genre match (up to 40 points)
 * - Language match (up to 15 points)
 * - Movie rating quality (up to 25 points)
 * - Similarity to favourited / highly-rated movies (up to 20 points)
 * 
 * Provides verifiable "Why this movie?" reasons explaining the score.
 */

export function getRecommendations(movies, preferences = {}, ratedMovies = {}, favouriteMovies = []) {
  const {
    genres: preferredGenres = ["Adventure", "Sci-Fi", "Fantasy"],
    languages: preferredLanguages = ["English", "Japanese", "Hindi", "Marathi"],
    minRating = 7.0
  } = preferences;

  // Set of favourited IDs to avoid recommending already favourited items in the pure recs list
  const favSet = new Set(favouriteMovies);

  // Extract genres and directors from movies rated >= 8 or favourited
  const positiveMovieIds = Object.keys(ratedMovies).filter(id => Number(ratedMovies[id]) >= 8);
  const positiveSeedMovies = movies.filter(m => favSet.has(m.id) || positiveMovieIds.includes(m.id));

  const positiveGenres = new Set();
  const positiveDirectors = new Set();

  positiveSeedMovies.forEach(m => {
    (m.genres || []).forEach(g => positiveGenres.add(g));
    if (m.director) positiveDirectors.add(m.director);
  });

  // Calculate scores for each eligible movie
  const scoredMovies = movies.map(movie => {
    // If user rated this movie < 5, penalize heavily
    const userRating = ratedMovies[movie.id];
    if (userRating && Number(userRating) < 5) {
      return null;
    }

    let genreScore = 0;
    let languageScore = 0;
    let qualityScore = 0;
    let similarityScore = 0;
    const reasons = [];

    // 1. Genre Match (up to 40 pts)
    const matchingPreferredGenres = (movie.genres || []).filter(g => preferredGenres.includes(g));
    const matchingPositiveGenres = (movie.genres || []).filter(g => positiveGenres.has(g));

    if (matchingPreferredGenres.length > 0) {
      const matchRatio = Math.min(1, matchingPreferredGenres.length / Math.max(1, movie.genres.length));
      genreScore += Math.round(matchRatio * 30);
      reasons.push(`Matches your favourite genre: ${matchingPreferredGenres.slice(0, 2).join(" & ")}`);
    }

    if (matchingPositiveGenres.length > 0) {
      genreScore += 10;
      if (!reasons.some(r => r.includes("Matches your favourite genre"))) {
        reasons.push(`Shares genres with movies you loved (${matchingPositiveGenres.slice(0, 2).join(", ")})`);
      }
    }
    genreScore = Math.min(40, genreScore);

    // 2. Language Match (15 pts)
    if (preferredLanguages.includes(movie.language)) {
      languageScore = 15;
      if (preferredLanguages.length > 0 && movie.language !== "English") {
        reasons.push(`Available in your preferred language: ${movie.language}`);
      }
    }

    // 3. Rating Quality (up to 25 pts)
    qualityScore = Math.min(25, Math.round(((movie.rating || 0) / 10) * 25));
    if ((movie.rating || 0) >= 8.5) {
      reasons.push(`Critically acclaimed score of ${movie.rating}/10`);
    }

    // 4. Similarity match to favourites/high ratings (up to 20 pts)
    if (positiveSeedMovies.length > 0) {
      let simPts = 0;
      // Director match
      if (movie.director && positiveDirectors.has(movie.director)) {
        simPts += 12;
        reasons.push(`Directed by ${movie.director}, whose work you enjoy`);
      }

      // Shared multiple genres with seed movies
      const sharedCount = (movie.genres || []).filter(g => positiveGenres.has(g)).length;
      if (sharedCount >= 2) {
        simPts += 8;
      }
      similarityScore = Math.min(20, simPts);
    } else {
      // Default boost for trending/popular when no prior seeds exist
      if (movie.trending) {
        similarityScore += 10;
        reasons.push("Trending now among global viewers");
      }
      if ((movie.popularity || 0) >= 90) {
        similarityScore += 10;
      }
      similarityScore = Math.min(20, similarityScore);
    }

    // Fallback reason if none triggered
    if (reasons.length === 0) {
      reasons.push(`High recommendation score (${movie.rating} rating)`);
    }

    const totalScore = Math.min(100, genreScore + languageScore + qualityScore + similarityScore);

    // Apply minimum rating filter constraint if desired
    if (movie.rating < (minRating || 0)) {
      return null;
    }

    return {
      ...movie,
      recommendationScore: totalScore,
      scoreBreakdown: {
        genre: genreScore,
        language: languageScore,
        quality: qualityScore,
        similarity: similarityScore
      },
      recommendationReasons: reasons.slice(0, 2),
      isFavourited: favSet.has(movie.id)
    };
  }).filter(Boolean);

  // Exclude movies already favourited from the pure recommendation carousel/list
  const eligibleRecommendations = scoredMovies.filter(m => !favSet.has(m.id));

  // Sort by score descending, tiebreaker by rating and popularity
  eligibleRecommendations.sort((a, b) => {
    if (b.recommendationScore !== a.recommendationScore) {
      return b.recommendationScore - a.recommendationScore;
    }
    if (b.rating !== a.rating) {
      return b.rating - a.rating;
    }
    return (b.popularity || 0) - (a.popularity || 0);
  });

  return eligibleRecommendations;
}
