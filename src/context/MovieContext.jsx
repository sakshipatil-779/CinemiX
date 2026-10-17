import React, { createContext, useContext, useState, useMemo, useCallback } from "react";
import toast from "react-hot-toast";
import { MOVIES_DATA } from "../data/movies";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { getRecommendations } from "../utils/recommendations";

const MovieContext = createContext(null);

const DEFAULT_PREFERENCES = {
  genres: ["Adventure", "Sci-Fi", "Fantasy", "Animation"],
  languages: ["English", "Japanese", "Hindi", "Marathi"],
  minRating: 7.5,
  reducedMotion: false
};

const INITIAL_FAVOURITES = ["tmdb-27205", "tmdb-19995"];
const INITIAL_RATINGS = {
  "tmdb-27205": 10,
  "tmdb-19995": 9
};

export function MovieProvider({ children }) {
  const [movies] = useState(MOVIES_DATA);
  const [favourites, setFavourites] = useLocalStorage("cinemix_favourites", INITIAL_FAVOURITES);
  const [userRatings, setUserRatings] = useLocalStorage("cinemix_ratings", INITIAL_RATINGS);
  const [preferences, setPreferences] = useLocalStorage("cinemix_preferences", DEFAULT_PREFERENCES);

  const [selectedMovie, setSelectedMovie] = useState(null);
  const [trailerMovie, setTrailerMovie] = useState(null);
  const [globalSearch, setGlobalSearch] = useState("");
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // Toggle Favourite
  const toggleFavourite = useCallback((movieId) => {
    const movie = movies.find(m => m.id === movieId);
    const title = movie ? movie.title : "Movie";
    const exists = favourites.includes(movieId);

    if (exists) {
      setFavourites(prev => prev.filter(id => id !== movieId));
      toast(`Removed "${title}" from Favourites`, {
        id: `fav-${movieId}`,
        icon: "💔",
        style: {
          borderRadius: "12px",
          background: "#211B2D",
          color: "#F8F6FC",
          border: "1px solid rgba(255, 255, 255, 0.1)"
        }
      });
    } else {
      setFavourites(prev => (prev.includes(movieId) ? prev : [...prev, movieId]));
      toast.success(`Added "${title}" to Favourites!`, {
        id: `fav-${movieId}`,
        icon: "💜",
        style: {
          borderRadius: "12px",
          background: "#211B2D",
          color: "#F8F6FC",
          border: "1px solid rgba(185, 138, 245, 0.3)"
        }
      });
    }
  }, [movies, favourites, setFavourites]);

  // Set / Clear User Rating
  const setUserRating = useCallback((movieId, rating) => {
    const movie = movies.find(m => m.id === movieId);
    const title = movie ? movie.title : "Movie";

    if (rating === null || rating === undefined || rating === 0) {
      setUserRatings(prev => {
        const newRatings = { ...prev };
        delete newRatings[movieId];
        return newRatings;
      });
      toast(`Removed rating for "${title}"`, {
        id: `rating-${movieId}`,
        icon: "⭐",
        style: {
          borderRadius: "12px",
          background: "#211B2D",
          color: "#F8F6FC",
          border: "1px solid rgba(255, 255, 255, 0.1)"
        }
      });
    } else {
      setUserRatings(prev => ({ ...prev, [movieId]: rating }));
      toast.success(`You rated "${title}" ${rating}/10!`, {
        id: `rating-${movieId}`,
        icon: "⭐",
        style: {
          borderRadius: "12px",
          background: "#211B2D",
          color: "#F8F6FC",
          border: "1px solid rgba(185, 138, 245, 0.3)"
        }
      });
    }
  }, [movies, setUserRatings]);

  // Update Preferences
  const updatePreferences = useCallback((newPreferences) => {
    setPreferences(prev => ({
      ...prev,
      ...newPreferences
    }));
    toast.success("Preferences saved successfully!", {
      style: {
        borderRadius: "12px",
        background: "#211B2D",
        color: "#F8F6FC",
        border: "1px solid rgba(185, 138, 245, 0.3)"
      }
    });
  }, [setPreferences]);

  // Reset local demo data
  const resetDemoData = useCallback(() => {
    setFavourites(INITIAL_FAVOURITES);
    setUserRatings(INITIAL_RATINGS);
    setPreferences(DEFAULT_PREFERENCES);
    toast.success("Demo data reset to default!", {
      icon: "🔄",
      style: {
        borderRadius: "12px",
        background: "#211B2D",
        color: "#F8F6FC",
        border: "1px solid rgba(185, 138, 245, 0.3)"
      }
    });
  }, [setFavourites, setUserRatings, setPreferences]);

  // Clear all data
  const clearAllUserData = useCallback(() => {
    setFavourites([]);
    setUserRatings({});
    setPreferences({
      genres: [],
      languages: [],
      minRating: 0,
      reducedMotion: false
    });
    toast("All user data and history cleared", {
      icon: "🧹",
      style: {
        borderRadius: "12px",
        background: "#211B2D",
        color: "#F8F6FC",
        border: "1px solid rgba(255, 255, 255, 0.1)"
      }
    });
  }, [setFavourites, setUserRatings, setPreferences]);

  // Dynamic recommendations computed based on current user preferences & ratings
  const recommendations = useMemo(() => {
    return getRecommendations(movies, preferences, userRatings, favourites);
  }, [movies, preferences, userRatings, favourites]);

  // Helpers to inspect status
  const isFavourite = useCallback((movieId) => favourites.includes(movieId), [favourites]);
  const getRating = useCallback((movieId) => userRatings[movieId] || null, [userRatings]);

  const value = {
    movies,
    favourites,
    userRatings,
    preferences,
    recommendations,
    toggleFavourite,
    setUserRating,
    updatePreferences,
    resetDemoData,
    clearAllUserData,
    isFavourite,
    getRating,
    selectedMovie,
    setSelectedMovie,
    trailerMovie,
    setTrailerMovie,
    globalSearch,
    setGlobalSearch,
    isSidebarCollapsed,
    setIsSidebarCollapsed
  };

  return <MovieContext.Provider value={value}>{children}</MovieContext.Provider>;
}

export function useMovieContext() {
  const context = useContext(MovieContext);
  if (!context) {
    throw new Error("useMovieContext must be used within a MovieProvider");
  }
  return context;
}
