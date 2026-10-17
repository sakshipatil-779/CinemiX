# CinemiX — Cinematic Movie Discovery & Recommendation Platform

CinemiX is a modern, responsive movie recommendation web application built with React, Vite, and custom CSS3. Designed with a dark-purple aesthetic, lavender accents, translucent glassmorphism surfaces, and intelligent recommendation scoring, CinemiX delivers an intelligent cinematic discovery experience.

---

## 🌟 Key Features

### 1. Cinematic Home Dashboard
- **Featured Hero Banner**: Dynamic hero carousel showcasing trending titles with backdrop artwork, "Now Trending" badge, genre tags, and **Watch Trailer** preview action.
- **"Recommended for You" (AI/Rule-Based)**: Tailored recommendations with **"Why this movie?"** explanation tags (e.g., *"Matches your favourite genre: Sci-Fi"*, *"Critically acclaimed score of 8.9/10"*).
- **Now Trending & Recently Added**: Ranked carousel (`#1`, `#2`, `#3`) and newly premiered films.

### 2. Multi-Criteria Explore & Search
- **Instant Search**: Real-time matching across movie title, genres, director, cast members, language, and synopsis.
- **Multi-Filter Engine**:
  - **Genre Selection**: Multi-select pills across 13 genres (Action, Sci-Fi, Animation, Drama, etc.).
  - **Min Rating Slider**: Interactive slider from 0 to 9.5.
  - **Languages**: English, Hindi, Marathi, Japanese, Korean, Spanish, French.
  - **Release Era**: 2025+ (Upcoming), 2024, 2023, and Recent (2020-2024).
  - **Duration**: Under 90 mins, 90–120 mins, and Over 120 mins.
  - **Sorting**: Most Popular, Highest Rated, Newest, Oldest, Title A-Z.
- **Active Results Counter & Clear All**: One-click reset with empty-state recovery.

### 3. Transparent Recommendation Engine
CinemiX calculates a personalized affinity score (0–100) using a transparent scoring formula:
- **Genre Affinity (Up to 40 pts)**: Matches user's preferred genres and genres of films rated $\ge$ 8.
- **Language Alignment (15 pts)**: Favors movies in the user's chosen languages.
- **Critical Quality (Up to 25 pts)**: Scaled from the film's verified score (`(rating / 10) * 25`).
- **Director & Similarity Match (Up to 20 pts)**: Shared directors and sub-genres with items in the user's Favourites or highly-rated library.
- **Negative Feedback Penalty**: Movies rated $< 5$ are automatically excluded or penalized.
- **Explainability**: Every recommendation includes a verifiable reason badge.

### 4. Interactive Details & Personal Ratings
- **Movie Details Modal**: Full-screen backdrop artwork, floating poster, tagline, metadata grid (Director, Cast, Audio/Subtitles, Match Index), and synopsis.
- **Personal 1–10 Rating Control**: Separate personal rating system stored in `localStorage` without altering the verified community rating.
- **Favourites**: Heart controls with reactive toast notifications.
- **Trailer Playback**: High-definition trailer preview overlay with responsive 16:9 player.

### 5. Preference Tuning & Settings
- Configure favorite genres and preferred languages.
- Adjust minimum rating thresholds for recommendations.
- Toggle reduced-motion effects for accessibility.
- One-click **Reset Demo Data** or **Clear All Saved History**.

---

## 🛠️ Technology Stack

| Layer | Technology |
|---|---|
| **Framework** | React 19 + Vite 8 |
| **Language** | JavaScript (ESNext, JSX) |
| **Styling** | Vanilla CSS3 (Custom design tokens, Glassmorphism, CSS Grid, Flexbox) |
| **Icons** | Lucide React |
| **Routing** | React Router v7 |
| **Motion** | Framer Motion |
| **Notifications** | React Hot Toast |
| **Storage** | Browser `localStorage` with custom React hooks |

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher recommended; v24 tested)
- npm (v9 or higher)

### Installation & Run

1. Navigate to the project directory:
   ```bash
   cd CinemiX
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Launch development server:
   ```bash
   npm run dev
   ```
   The application will be running locally at `http://127.0.0.1:5173/`.

4. Build for production:
   ```bash
   npm run build
   ```
