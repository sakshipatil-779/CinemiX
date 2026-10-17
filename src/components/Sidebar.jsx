import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  Film,
  Compass,
  Layers,
  Heart,
  PlaySquare,
  Sparkles,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { useMovieContext } from "../context/MovieContext";
import toast from "react-hot-toast";

export default function Sidebar() {
  const {
    favourites,
    isSidebarCollapsed,
    setIsSidebarCollapsed
  } = useMovieContext();
  const navigate = useNavigate();

  const handleLogout = () => {
    toast("Logged out of CinemiX Demo session", {
      icon: "👋",
      style: {
        borderRadius: "12px",
        background: "#211B2D",
        color: "#F8F6FC",
        border: "1px solid rgba(255, 255, 255, 0.1)"
      }
    });
  };

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
          to="/genres"
          className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
          title="Genres"
        >
          <Layers className="nav-icon" />
          {!isSidebarCollapsed && <span className="nav-text">Genres</span>}
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

        <div className="nav-divider" />

        <NavLink
          to="/recently-added"
          className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
          title="Recently Added"
        >
          <Sparkles className="nav-icon" />
          {!isSidebarCollapsed && <span className="nav-text">Recently Added</span>}
        </NavLink>

        <div className="nav-divider" />

        <NavLink
          to="/settings"
          className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
          title="Settings"
        >
          <Settings className="nav-icon" />
          {!isSidebarCollapsed && <span className="nav-text">Settings</span>}
        </NavLink>
      </nav>

      {/* Footer / Logout */}
      <div className="sidebar-footer">
        <button className="logout-btn" onClick={handleLogout} title="Logout">
          <LogOut className="nav-icon" />
          {!isSidebarCollapsed && <span className="logout-text">Logout</span>}
        </button>
      </div>
    </aside>
  );
}
