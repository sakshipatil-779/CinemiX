import React, { useState } from "react";
import { Sliders, RotateCcw, Trash2, Check, Sparkles, Shield, Eye } from "lucide-react";
import { useMovieContext } from "../context/MovieContext";
import { ALL_GENRES, ALL_LANGUAGES } from "../data/movies";

export default function Settings() {
  const {
    preferences,
    updatePreferences,
    resetDemoData,
    clearAllUserData,
    favourites,
    userRatings
  } = useMovieContext();

  const [confirmClear, setConfirmClear] = useState(false);

  const toggleGenre = (genre) => {
    const current = preferences.genres || [];
    const updated = current.includes(genre)
      ? current.filter(g => g !== genre)
      : [...current, genre];
    updatePreferences({ genres: updated });
  };

  const toggleLanguage = (lang) => {
    const current = preferences.languages || [];
    const updated = current.includes(lang)
      ? current.filter(l => l !== lang)
      : [...current, lang];
    updatePreferences({ languages: updated });
  };

  const handleMinRatingChange = (e) => {
    updatePreferences({ minRating: Number(e.target.value) });
  };

  const toggleReducedMotion = () => {
    updatePreferences({ reducedMotion: !preferences.reducedMotion });
  };

  return (
    <div className="settings-page" style={{ maxWidth: "880px" }}>
      <div style={{ marginBottom: "28px" }}>
        <h1 style={{ fontSize: "28px", color: "#ffffff", marginBottom: "6px" }}>
          Settings & Recommendation Tuning
        </h1>
        <p style={{ color: "var(--text-muted)", fontSize: "14px" }}>
          Personalize your CinemiX recommendation algorithm, audio preferences, and interface controls.
        </p>
      </div>

      {/* Algorithm Explainer Box */}
      <div
        style={{
          background: "linear-gradient(135deg, rgba(139, 92, 246, 0.12) 0%, rgba(33, 27, 45, 0.6) 100%)",
          border: "1px solid rgba(185, 138, 245, 0.25)",
          borderRadius: "var(--radius-lg)",
          padding: "20px 24px",
          marginBottom: "28px",
          display: "flex",
          gap: "16px"
        }}
      >
        <Sparkles size={24} color="var(--accent-primary)" style={{ flexShrink: 0, marginTop: "2px" }} />
        <div>
          <h3 style={{ fontSize: "16px", color: "#ffffff", marginBottom: "6px" }}>
            How CinemiX Recommendations Work
          </h3>
          <p style={{ fontSize: "13px", color: "var(--text-secondary)", lineHeight: 1.6 }}>
            Our scoring algorithm weights your selections dynamically:
            <strong style={{ color: "var(--accent-primary)" }}> Genre Affinity (40%)</strong>,
            <strong style={{ color: "#38bdf8" }}> Language Match (15%)</strong>,
            <strong style={{ color: "#f59e0b" }}> Critical Score (25%)</strong>, and
            <strong style={{ color: "#ec4899" }}> Similarity to Favourited/Rated Films (20%)</strong>.
            Movies rated 8–10 boost similar styles, while ratings below 5 are automatically filtered out.
          </p>
        </div>
      </div>

      {/* Preferred Genres */}
      <div className="filter-panel" style={{ marginBottom: "24px" }}>
        <h3 style={{ fontSize: "16px", color: "#ffffff", marginBottom: "14px", display: "flex", alignItems: "center", gap: "8px" }}>
          <Sliders size={18} color="var(--accent-primary)" />
          Favourite Genres
        </h3>
        <p style={{ fontSize: "13px", color: "var(--text-muted)", marginBottom: "14px" }}>
          Select the genres you love. Movies matching these genres will receive the highest recommendation priority.
        </p>
        <div className="filter-pill-container">
          {ALL_GENRES.map(genre => {
            const isSelected = (preferences.genres || []).includes(genre);
            return (
              <button
                key={genre}
                className={`filter-pill ${isSelected ? "active" : ""}`}
                onClick={() => toggleGenre(genre)}
              >
                {isSelected && <Check size={12} style={{ marginRight: "4px" }} />}
                {genre}
              </button>
            );
          })}
        </div>
      </div>

      {/* Preferred Languages */}
      <div className="filter-panel" style={{ marginBottom: "24px" }}>
        <h3 style={{ fontSize: "16px", color: "#ffffff", marginBottom: "14px" }}>
          Preferred Languages & Dubs
        </h3>
        <p style={{ fontSize: "13px", color: "var(--text-muted)", marginBottom: "14px" }}>
          CinemiX showcases diverse cinema in original soundtracks with subtitles.
        </p>
        <div className="filter-pill-container">
          {ALL_LANGUAGES.map(lang => {
            const isSelected = (preferences.languages || []).includes(lang);
            return (
              <button
                key={lang}
                className={`filter-pill ${isSelected ? "active" : ""}`}
                onClick={() => toggleLanguage(lang)}
              >
                {isSelected && <Check size={12} style={{ marginRight: "4px" }} />}
                {lang}
              </button>
            );
          })}
        </div>
      </div>

      {/* Rating & Visual Controls */}
      <div className="filter-panel" style={{ marginBottom: "24px" }}>
        <h3 style={{ fontSize: "16px", color: "#ffffff", marginBottom: "14px" }}>
          Recommendation Quality Threshold
        </h3>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "16px" }}>
          <div>
            <div style={{ fontSize: "13px", color: "var(--text-primary)", fontWeight: "600" }}>
              Minimum Recommendation Rating
            </div>
            <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>
              Filter out movies with community scores below this threshold.
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
            <input
              type="range"
              min="0"
              max="9.0"
              step="0.5"
              value={preferences.minRating || 0}
              onChange={handleMinRatingChange}
              className="rating-slider"
              style={{ width: "160px" }}
            />
            <span style={{ fontSize: "14px", fontWeight: "700", color: "var(--accent-primary)", minWidth: "50px" }}>
              {(preferences.minRating || 0).toFixed(1)} / 10
            </span>
          </div>
        </div>

        <div style={{ height: "1px", background: "rgba(255,255,255,0.06)", margin: "18px 0" }} />

        {/* Reduced motion */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <div style={{ fontSize: "13px", color: "var(--text-primary)", fontWeight: "600" }}>
              Reduced Motion UI Effects
            </div>
            <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>
              Minimize card zoom animations and background transitions for accessibility.
            </div>
          </div>
          <button
            onClick={toggleReducedMotion}
            className={`btn-secondary ${preferences.reducedMotion ? "active" : ""}`}
            style={{ padding: "8px 16px", fontSize: "13px" }}
          >
            {preferences.reducedMotion ? "Enabled" : "Disabled"}
          </button>
        </div>
      </div>

      {/* Data Management & Resets */}
      <div className="filter-panel" style={{ borderColor: "rgba(239, 68, 68, 0.25)" }}>
        <h3 style={{ fontSize: "16px", color: "#ffffff", marginBottom: "14px", display: "flex", alignItems: "center", gap: "8px" }}>
          <Shield size={18} color="#f43f5e" />
          Data Management & Local Demo State
        </h3>
        <p style={{ fontSize: "13px", color: "var(--text-muted)", marginBottom: "18px" }}>
          Currently storing: <strong>{favourites.length} Favourites</strong> and <strong>{Object.keys(userRatings).length} User Ratings</strong> in browser localStorage.
        </p>

        <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
          <button
            className="btn-secondary"
            onClick={resetDemoData}
            title="Reset to default seed dataset"
          >
            <RotateCcw size={15} />
            <span>Reset Demo Data</span>
          </button>

          {!confirmClear ? (
            <button
              className="btn-secondary"
              style={{ borderColor: "rgba(244, 63, 94, 0.3)", color: "#ff6b8b" }}
              onClick={() => setConfirmClear(true)}
            >
              <Trash2 size={15} />
              <span>Clear All Saved Data</span>
            </button>
          ) : (
            <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
              <button
                className="btn-primary"
                style={{ background: "#e11d48", padding: "8px 16px" }}
                onClick={() => {
                  clearAllUserData();
                  setConfirmClear(false);
                }}
              >
                Confirm Clear All
              </button>
              <button
                className="btn-secondary"
                style={{ padding: "8px 16px" }}
                onClick={() => setConfirmClear(false)}
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
