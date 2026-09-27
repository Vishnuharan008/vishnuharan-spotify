# 🎧 VISHNUHARAN'S SPOTIFY

A modern, professional Spotify-like music streaming web application built with pure **HTML5, CSS3, and JavaScript**.

---

## ✨ Features Included

- **Modern Dark Theme**: Spotify signature black, dark-gray surfaces, and radiant Spotify Green accents (`#1ed760`).
- **All 21 Handpicked Songs**: Pre-loaded with official high-resolution album artwork from JioSaavn, artist names, movie/album titles, and lyrics excerpts.
- **Persistent Bottom Music Player**:
  - Track thumbnail, title, artist, and interactive like heart button.
  - Play / Pause toggle with animated SVG icons and equalizer visualizer bars.
  - Previous / Next navigation.
  - Shuffle mode (Fisher-Yates queue shuffle) and Repeat modes (Off, All, One).
  - Smooth interactive scrub bar with current time and total duration.
  - Volume controller with mute/unmute toggle and real-time icon states.
- **HTML5 Audio API Integration**: Songs stream and play smoothly directly in the browser.
- **Home View**:
  - Time-based greeting ("Good morning / afternoon / evening, Vishnuharan").
  - Quick-jump 6-item grid (Liked Songs, Top Favorites, Anirudh Mania, Pure Melodies, etc.).
  - "Made For Vishnuharan" showcase featuring all 21 songs with hover play buttons.
  - "Recently Played" section automatically tracked across sessions.
  - Curated playlists with dedicated detail views.
- **Search System**:
  - Instant live search filtering songs, artists, albums, and genres.
  - Top result highlight card + song table list.
  - Spotify-style colorful "Browse all" genre category tiles.
- **Music Library & Custom Playlists**:
  - View all curated and user-created playlists.
  - Create new custom playlists with custom titles and descriptions.
  - Dedicated "Liked Songs" view with full track table and "Play All".
- **Local Storage Persistence**:
  - Liked tracks, volume preferences, recently played tracks, and custom playlists persist across page reloads.
- **Mobile & Tablet Responsive**:
  - Dedicated bottom navigation bar on mobile.
  - Touch-friendly scrub bar and responsive card layouts.
- **Keyboard Shortcuts**:
  - `Space`: Play / Pause
  - `Arrow Right` / `Arrow Left`: Seek forward / backward 5 seconds
  - `Arrow Up` / `Arrow Down`: Volume up / down 5%
  - `M`: Mute / Unmute
  - `L`: Like / Unlike current song
  - `N`: Next track
  - `P`: Previous track
  - `S`: Toggle Shuffle
  - `R`: Toggle Repeat
  - `/`: Quick focus search bar
  - `Esc`: Close open modal

---

## 🎵 How to Replace Song Audio Links

You have **two easy ways** to use your own songs:

### Method 1: Using the Web App UI (Zero Code)
1. In the app, click the **"Custom Audio / MP3"** button in the top bar (or click the pencil icon next to any song in a table).
2. Select which song you want to update from the dropdown.
3. Either:
   - Paste a direct MP3 / audio stream URL into the input field, OR
   - Click **"Browse Local MP3 / Audio File"** to select any MP3 from your computer!
4. Click **"Save & Play"**. The player will immediately switch to your audio.

### Method 2: In Code (`js/songs.js`)
Open `js/songs.js` in your code editor. Each song has a `url` property:

```javascript
{
  id: 1,
  title: "Radhimaa",
  artist: "Sai Abhyankkar, Nargis Teji...",
  album: "Think Indie",
  cover: "https://c.saavncdn.com/...",
  url: "./audio/radhimaa.mp3", // <-- Put your direct link or local file path here!
  duration: "3:45",
  ...
}
```

> **Tip for local files**: Create a folder named `audio` inside the project and put your `.mp3` files there (e.g. `./audio/radhimaa.mp3`, `./audio/arabic-kuthu.mp3`).

---

## 🚀 Running the Project

You can run this project using any local web server or by opening `index.html` directly in your browser:

### Option A: Using Python (Recommended)
```bash
python -m http.server 8000
```
Then visit `http://localhost:8000` in your browser.

### Option B: Using Node.js
```bash
npx serve .
```

### Option C: Directly in Browser
Double-click `index.html` in File Explorer to open it in Chrome, Edge, or Firefox.

---

## 📁 File Structure

```
Vishnuharan 's Spotify/
├── index.html          # Main HTML structure with sidebar, topbar, player, and modals
├── css/
│   └── style.css       # Complete dark theme styling, animations, responsive rules
├── js/
│   ├── songs.js        # 21 songs metadata, official album artwork, and audio URLs
│   ├── player.js       # HTML5 Audio playback engine, shuffle, repeat, queue
│   ├── ui.js           # Dynamic view rendering (Home, Search, Library, Liked, Modals)
│   └── app.js          # Initialization and keyboard shortcuts
└── README.md           # Documentation and guide
```
