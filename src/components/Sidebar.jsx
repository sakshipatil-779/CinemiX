import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  Film,
  Compass,
  Heart,
  PlaySquare,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { useMovieContext } from "../context/MovieContext";

export default function Sidebar() {
  const {
    favourites,
    isSidebarCollapsed,
    setIsSidebarCollapsed
  } = useMovieContext();
  const navigate = useNavigate();

  return (
    <aside className={`sidebar ${isSidebarCollapsed ? "collapsed" : ""}`}>
      {/* Brand Header */}
      <div className="sidebar-header">
        <div className="brand-wrapper" onClick={() => navigate("/")} title="CinemiX Home">
          <div className="brand-icon-box">
            <Film size={20} />
          </div>
          {!isSidebarCollapsed && (
            <span className="brand-name">
              Cinemi<span>X</span>
            </span>
          )}
        </div>
        <button
          className="sidebar-collapse-btn"
          onClick={() => setIsSidebarCollapsed(prev => !prev)}
          title={isSidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          aria-label={isSidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {isSidebarCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>

      {/* Navigation List */}
      <nav className="sidebar-content">
        <NavLink
          to="/"
          className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
          title="Home"
        >
          <PlaySquare className="nav-icon" />
          {!isSidebarCollapsed && <span className="nav-text">Home</span>}
        </NavLink>

        <NavLink
          to="/explore"
          className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
          title="Explore"
        >
          <Compass className="nav-icon" />
          {!isSidebarCollapsed && <span className="nav-text">Explore</span>}
        </NavLink>

        <NavLink
          to="/favourites"
          className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
          title="Favourites"
        >
          <Heart className="nav-icon" />
          {!isSidebarCollapsed && <span className="nav-text">Favourites</span>}
          {!isSidebarCollapsed && favourites.length > 0 && (
            <span className="nav-badge">{favourites.length}</span>
          )}
        </NavLink>
      </nav>
    </aside>
  );
}
