import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { MovieProvider } from "./context/MovieContext";
import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";
import MovieDetailsModal from "./components/MovieDetailsModal";
import TrailerModal from "./components/TrailerModal";

// Pages
import Home from "./pages/Home";
import Explore from "./pages/Explore";
import Genres from "./pages/Genres";
import Favourites from "./pages/Favourites";
import RecentlyAddedPage from "./pages/RecentlyAddedPage";
import Settings from "./pages/Settings";

// Styles
import "./styles/global.css";
import "./styles/layout.css";
import "./styles/components.css";
import "./styles/responsive.css";

export default function App() {
  return (
    <BrowserRouter>
      <MovieProvider>
        {/* Global Toast Notifications */}
        <Toaster
          position="bottom-right"
          toastOptions={{
            duration: 3500,
            style: {
              background: "#211B2D",
              color: "#F8F6FC",
              border: "1px solid rgba(185, 138, 245, 0.3)",
              boxShadow: "0 10px 30px rgba(0, 0, 0, 0.6)",
              fontFamily: "'Inter', sans-serif",
              fontSize: "14px"
            }
          }}
        />

        {/* Viewport Framing (Centers desktop streaming app like the visual reference) */}
        <div className="cinemix-viewport">
          <div className="cinemix-app-shell">
            {/* Sidebar Navigation */}
            <Sidebar />

            {/* Main Application Area */}
            <main className="main-viewport">
              {/* Topbar Search & Header Actions */}
              <Topbar />

              {/* Scrollable Page Views */}
              <div className="view-content-area">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/explore" element={<Explore />} />
                  <Route path="/genres" element={<Genres />} />
                  <Route path="/favourites" element={<Favourites />} />
                  <Route path="/recently-added" element={<RecentlyAddedPage />} />
                  <Route path="/settings" element={<Settings />} />
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </div>

              {/* Interactive Modals */}
              <MovieDetailsModal />
              <TrailerModal />
            </main>
          </div>
        </div>
      </MovieProvider>
    </BrowserRouter>
  );
}
