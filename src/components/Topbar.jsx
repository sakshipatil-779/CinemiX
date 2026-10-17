import React from "react";
import { Search, X, Bell } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useMovieContext } from "../context/MovieContext";
import toast from "react-hot-toast";

export default function Topbar() {
  const { globalSearch, setGlobalSearch } = useMovieContext();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSearchChange = (e) => {
    const val = e.target.value;
    setGlobalSearch(val);
    if (val.trim() && location.pathname !== "/explore") {
      navigate("/explore");
    }
  };

  const handleClearSearch = () => {
    setGlobalSearch("");
  };

  const handleNotificationsClick = () => {
    toast("You're all caught up! 3 new movies arrived this week.", {
      icon: "🔔",
      style: {
        borderRadius: "12px",
        background: "#211B2D",
        color: "#F8F6FC",
        border: "1px solid rgba(185, 138, 245, 0.3)"
      }
    });
  };

  return (
    <header className="topbar">
      {/* Search Input */}
      <div className="search-container">
        <div className="search-input-wrapper">
          <Search className="search-icon" />
          <input
            type="text"
            className="search-input"
            placeholder="Search for films, directors, or actors..."
            value={globalSearch}
            onChange={handleSearchChange}
            aria-label="Search movies"
          />
          {globalSearch && (
            <button
              className="search-clear-btn"
              onClick={handleClearSearch}
              title="Clear search"
              aria-label="Clear search"
            >
              <X size={15} />
            </button>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="topbar-actions">
        <button
          className="action-icon-btn"
          onClick={handleNotificationsClick}
          title="Notifications"
          aria-label="Notifications"
        >
          <Bell size={19} />
          <span className="notification-dot" />
        </button>

        <div
          className="user-profile"
          onClick={() => navigate("/settings")}
          title="Demo User Profile & Preferences"
        >
          <div className="user-avatar-wrapper">
            <img
              src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80"
              alt="User Avatar"
              className="user-avatar"
            />
            <span className="user-status-indicator" />
          </div>
        </div>
      </div>
    </header>
  );
}
