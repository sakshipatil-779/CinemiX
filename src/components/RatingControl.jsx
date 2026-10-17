import React, { useState } from "react";
import { Star, X } from "lucide-react";
import { useMovieContext } from "../context/MovieContext";

export default function RatingControl({ movieId }) {
  const { getRating, setUserRating } = useMovieContext();
  const currentRating = getRating(movieId);
  const [hoverRating, setHoverRating] = useState(null);

  const activeRating = hoverRating !== null ? hoverRating : (currentRating || 0);

  return (
    <div className="user-rating-section">
      <div>
        <div className="metadata-item-label">Your Personal Rating</div>
        <div style={{ fontSize: "13px", color: "var(--text-secondary)" }}>
          {currentRating ? (
            <span>
              You rated this <strong style={{ color: "var(--accent-primary)" }}>{currentRating}/10</strong>
            </span>
          ) : (
            <span>Not rated yet</span>
          )}
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <div className="rating-stars-row" onMouseLeave={() => setHoverRating(null)}>
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((starValue) => {
            const isFilled = starValue <= activeRating;
            return (
              <button
                key={starValue}
                className={`star-rating-btn ${isFilled ? "active" : ""}`}
                onClick={() => setUserRating(movieId, starValue)}
                onMouseEnter={() => setHoverRating(starValue)}
                title={`Rate ${starValue}/10`}
                aria-label={`Rate ${starValue} out of 10`}
              >
                <Star
                  size={18}
                  fill={isFilled ? "#f59e0b" : "none"}
                  color={isFilled ? "#f59e0b" : "rgba(255, 255, 255, 0.25)"}
                />
              </button>
            );
          })}
        </div>

        {currentRating && (
          <button
            className="clear-rating-btn"
            onClick={() => setUserRating(movieId, 0)}
            title="Clear my rating"
          >
            Clear
          </button>
        )}
      </div>
    </div>
  );
}
