import React from "react";
import { Search, X } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useMovieContext } from "../context/MovieContext";

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
    </header>
  );
}
