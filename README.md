# CinemiX — Cinematic Movie Discovery & Recommendation Platform

CinemiX is a modern, responsive web application for movie discovery and transparent recommendation scoring, built with **React 19**, **Vite 8**, and modular **CSS3 Glassmorphism**. Powered by an authentic **1,000-movie dataset** from TMDB via Kaggle, CinemiX delivers real-time, explainable weight-based match scoring, high-resolution visuals, and an interactive cinema browsing experience.

---

## 🌟 Key Highlights

* **Real Movie Dataset**: Over 1,000 verified movies spanning 1970–2024, complete with live TMDB posters, backdrops, real directors, cast, genres, and community ratings.
* **Explainable Weight-Based Scoring**: Replaces black-box ML with an explicit, explainable **50 / 20 / 20 / 10 if-else scoring engine**.
* **Filter View Match Score Badges**: Dynamic match percentage pills (`Match Score XX%`) displayed directly on cards in the Explore/Filter view.
* **Responsive Dark Cinema UI**: Tailored with a sleek dark-purple aesthetic, glassmorphic overlays, responsive grids, and interactive modal dialogs.
* **Interactive Trailer Previews**: Embedded HD trailer previews with modal overlays.
* **Personal Library**: Local-storage-backed Favorites and user rating (1–10⭐) tracking without altering community baseline ratings.

---

## 🧮 How the Recommendation Engine Scores Movies

CinemiX uses an explicit, transparent weight-based rule system rather than opaque machine learning.

### Scoring Weight Table

| Rule | Weight | Condition & Logic |
| :--- | :---: | :--- |
| **Genre Match** | **50 points** | `IF` the movie genres match the user's selected genre, add **50 points**. |
| **Language Match** | **20 points** | `IF` the movie language matches the user's selected language, add **20 points**. |
| **Rating Quality** | **20 points** | `IF` movie rating is below minimum, **exclude the movie**. `ELSE`, calculate points proportionally: $(\frac{\text{rating}}{10}) \times 20$. |
| **Keyword Match** | **10 points** | `IF` keyword matches title, overview, tagline, cast, director, or genres, add **10 points**. |

### Normalization & Ranking

* **Eligibility Filter**: Minimum rating acts as a hard eligibility filter. Movies below the threshold are excluded immediately.
* **Normalization**: The final score is normalized to $100$ based on the preferences actually supplied by the user:
  $$\text{Match Score} = \min\left(100, \operatorname{round}\left(\frac{\text{Earned Points}}{\text{Max Points for Supplied Criteria}} \times 100\right)\right)$$
* **Ranking**: Eligible movies are ranked strictly by:
  1. **Match Score** (descending)
  2. **Rating** (descending tie-breaker)
  3. **Popularity** (descending tie-breaker)

---

## 🎬 Dataset & Visual Assets

* **Data Source**: Integrated from Kaggle's live TMDB Dataset (`asaniczka/tmdb-movies-dataset-2023-930k-movies`) and enriched with director and cast credits (`rounakbanik/the-movies-dataset`).
* **Active TMDB CDN Links**:
  * **Posters (`w500`)**: `https://image.tmdb.org/t/p/w500{poster_path}`
  * **Backdrops (`w1280`)**: `https://image.tmdb.org/t/p/w1280{backdrop_path}`
* **Decade & Era Coverage**:
  * **2020s (Modern / Recent)**: *Oppenheimer*, *Barbie*, *Spider-Man: Across the Spider-Verse*, *Top Gun: Maverick*, *Dune*, etc.
  * **2010s Blockbusters**: *Interstellar*, *Inception*, *The Avengers*, *Parasite*, *Whiplash*, etc.
  * **2000s Millennium**: *The Dark Knight*, *Avatar*, *The Lord of the Rings*, *Gladiator*, *Spirited Away*, etc.
  * **1990s Golden Era**: *Pulp Fiction*, *The Shawshank Redemption*, *The Matrix*, *Fight Club*, *Jurassic Park*, etc.
  * **1980s & Vintage Classics**: *The Empire Strikes Back*, *The Godfather*, *Alien*, *Cinema Paradiso*, etc.

---

## 📁 Project Architecture

```
Cinemix/
├── .env.example              # Environment variables template
├── .gitignore                # Git ignore rules (protects .env and local tokens)
├── index.html                # Entry HTML shell
├── package.json              # Project dependencies and scripts
├── vite.config.js            # Vite configuration
└── src/
    ├── main.jsx              # React DOM root entry
    ├── App.jsx               # Application routing and layout wrapper
    ├── components/
    │   ├── EmptyState.jsx    # Graceful empty results fallback component
    │   ├── FilterPanel.jsx   # Interactive genre, language, era, rating, and sort toolbar
    │   ├── HeroBanner.jsx    # Auto-cycling featured banner with backdrop & trailer trigger
    │   ├── MovieCard.jsx     # Card component with match score pills, ratings, and favorites
    │   ├── MovieDetailsModal.jsx # Full-screen modal with synopsis, cast, and metadata
    │   ├── MovieRow.jsx      # Horizontally scrollable movie carousel
    │   ├── RatingControl.jsx # Interactive 1–10 star personal rating control
    │   ├── Sidebar.jsx       # Left navigation sidebar
    │   ├── Topbar.jsx        # Header with global search bar and brand logo
    │   └── TrailerModal.jsx  # Responsive 16:9 HD video playback modal
    ├── context/
    │   └── MovieContext.jsx  # Global application state (favorites, ratings, search, modal)
    ├── data/
    │   └── movies.js         # Curated 1,000-movie dataset with genres, metadata, and trailers
    ├── hooks/
    │   └── useLocalStorage.js# Synchronized localStorage hook for user preferences
    ├── pages/
    │   ├── Explore.jsx       # Multi-criteria filter screen with match scores
    │   ├── Favourites.jsx    # User's bookmarked movies
    │   ├── Genres.jsx        # Category grid exploration
    │   ├── Home.jsx          # Dashboard with Hero, Recommendations, and Trending rows
    │   └── Settings.jsx      # Preference manager and data reset panel
    ├── styles/
    │   ├── components.css    # UI component styles & match score badges
    │   ├── global.css        # Base styles, typography, and reset
    │   ├── layout.css        # App shell, sidebar, and view container layout
    │   ├── responsive.css    # Mobile, tablet, and reduced-motion media queries
    │   └── variables.css     # Design tokens (colors, gradients, glassmorphism)
    └── utils/
        ├── movieFilters.js   # 50/20/20/10 if-else weight-based scoring and filter engine
        └── recommendations.js# Home recommendation scoring algorithms
```

---

## 🛠️ Technology Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend Framework** | React 19 |
| **Build Tool & Bundler** | Vite 8 |
| **Icons** | Lucide React |
| **Routing** | React Router DOM v7 |
| **Animations** | Framer Motion |
| **Notifications** | React Hot Toast |
| **Styling** | Vanilla CSS3 (Custom Design Tokens, Flexbox, CSS Grid) |
| **Linter** | Oxlint |
| **Data Provider** | Kaggle TMDB Movie Dataset API |

---

## 🚀 Getting Started

### Prerequisites
* **Node.js**: v18.0.0 or higher (v20+ recommended)
* **npm**: v9.0.0 or higher

### 1. Clone & Install

```bash
# Clone the repository
git clone https://github.com/your-username/Cinemix.git

# Navigate into the project directory
cd Cinemix

# Install dependencies
npm install
```

### 2. Configure Environment Variables

Create a `.env` file in the root directory (based on `.env.example`):

```bash
cp .env.example .env
```

Add your Kaggle and optional API tokens:

```env
# Kaggle API Configuration
KAGGLE_API_TOKEN=your_kaggle_api_token_here
VITE_KAGGLE_API_TOKEN=your_kaggle_api_token_here

# TMDB API Configuration (Optional)
VITE_TMDB_API_KEY=your_tmdb_api_key_here
VITE_TMDB_BASE_URL=https://api.themoviedb.org/3
VITE_TMDB_IMAGE_BASE_URL=https://image.tmdb.org/t/p
```

> [!NOTE]
> `.env` is included in `.gitignore` to prevent credentials from being committed to source control.

### 3. Run Development Server

```bash
npm run dev
```

Open your browser at `http://localhost:5173/` (or the URL displayed in your terminal).

### 4. Build for Production

```bash
npm run build
```

Production assets will be built to the `dist/` directory.

### 5. Run Linter

```bash
npm run lint
```

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).