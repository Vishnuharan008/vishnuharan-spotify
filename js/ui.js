/**
 * ==============================================================================
 * VISHNUHARAN'S SPOTIFY - USER INTERFACE ENGINE
 * ==============================================================================
 * Handles view rendering, event bindings, modals, and reactive updates.
 */

class UIEngine {
  constructor(player) {
    this.player = player;
    this.currentView = 'home';
    this.currentViewParam = null;
    this.historyStack = [];
    this.historyIndex = -1;

    // Load custom playlists from localStorage
    this.customPlaylists = JSON.parse(localStorage.getItem('vspotify_custom_playlists') || '[]');
    this.allPlaylists = [...DEFAULT_PLAYLISTS, ...this.customPlaylists];

    // DOM Elements
    this.viewRoot = document.getElementById('view-root');
    this.globalSearchInput = document.getElementById('global-search-input');
    this.btnClearSearch = document.getElementById('btn-clear-search');
    this.sidebarLikedCount = document.getElementById('sidebar-liked-count');
    this.sidebarPlaylistList = document.getElementById('sidebar-playlist-list');

    // Player Elements
    this.playerThumb = document.getElementById('player-thumb');
    this.playerTitle = document.getElementById('player-title');
    this.playerArtist = document.getElementById('player-artist');
    this.playerLikeBtn = document.getElementById('player-like-btn');
    this.btnPlayPause = document.getElementById('btn-play-pause');
    this.playPauseIcon = document.getElementById('play-pause-icon');
    this.btnPrev = document.getElementById('btn-prev');
    this.btnNext = document.getElementById('btn-next');
    this.btnShuffle = document.getElementById('btn-shuffle');
    this.btnRepeat = document.getElementById('btn-repeat');

    // Progress Elements
    this.timeCurrent = document.getElementById('time-current');
    this.timeDuration = document.getElementById('time-duration');
    this.timelineSliderWrapper = document.getElementById('timeline-slider-wrapper');
    this.timelineFill = document.getElementById('timeline-fill');
    this.timelineThumb = document.getElementById('timeline-thumb');
    this.isSeeking = false;

    // Volume Elements
    this.volumeSliderWrapper = document.getElementById('volume-slider-wrapper');
    this.volumeFill = document.getElementById('volume-fill');
    this.volumeThumb = document.getElementById('volume-thumb');
    this.btnMuteVolume = document.getElementById('btn-mute-volume');
    this.volumeIcon = document.getElementById('volume-icon');

    // Modals
    this.audioModal = document.getElementById('audio-modal');
    this.lyricsModal = document.getElementById('lyrics-modal');
    this.queueModal = document.getElementById('queue-modal');
    this.playlistModal = document.getElementById('playlist-modal');

    this.init();
  }

  init() {
    this.navigate('home', null, false);
    this.renderSidebarPlaylists();
    this.updateLikedCounts();
    this.bindPlayerEvents();
    this.bindGlobalEvents();
    this.bindSliderEvents();
    this.bindModalEvents();

    // Initial player state sync
    if (this.player.currentSong) {
      this.updatePlayerBar(this.player.currentSong);
    }
    this.updateVolumeBar(this.player.volume, this.player.isMuted);
  }

  // View Navigation
  navigate(viewName, param = null, pushHistory = true) {
    if (pushHistory) {
      // Truncate any forward history
      this.historyStack = this.historyStack.slice(0, this.historyIndex + 1);
      this.historyStack.push({ view: viewName, param });
      this.historyIndex++;
    } else if (this.historyStack.length === 0) {
      this.historyStack.push({ view: viewName, param });
      this.historyIndex = 0;
    }

    this.currentView = viewName;
    this.currentViewParam = param;

    // Update active nav styling
    document.querySelectorAll('.nav-item, .mobile-nav-item').forEach(el => {
      if (el.dataset.view === viewName) {
        el.classList.add('active');
      } else {
        el.classList.remove('active');
      }
    });

    const mainScroll = document.getElementById('main-scroll-area');
    if (mainScroll) mainScroll.scrollTop = 0;

    this.renderCurrentView();
    this.updateHistoryButtons();
  }

  goBack() {
    if (this.historyIndex > 0) {
      this.historyIndex--;
      const step = this.historyStack[this.historyIndex];
      this.navigate(step.view, step.param, false);
    }
  }

  goForward() {
    if (this.historyIndex < this.historyStack.length - 1) {
      this.historyIndex++;
      const step = this.historyStack[this.historyIndex];
      this.navigate(step.view, step.param, false);
    }
  }

  updateHistoryButtons() {
    const btnBack = document.getElementById('btn-history-back');
    const btnForward = document.getElementById('btn-history-forward');
    if (btnBack) btnBack.disabled = this.historyIndex <= 0;
    if (btnForward) btnForward.disabled = this.historyIndex >= this.historyStack.length - 1;
  }

  // Render Dispatcher
  renderCurrentView() {
    switch (this.currentView) {
      case 'home':
        this.renderHome();
        break;
      case 'search':
        this.renderSearch(this.globalSearchInput.value);
        break;
      case 'library':
        this.renderLibrary();
        break;
      case 'liked':
        this.renderLikedSongs();
        break;
      case 'playlist':
        this.renderPlaylist(this.currentViewParam);
        break;
      default:
        this.renderHome();
    }
  }

  // Greeting helper
  getGreeting() {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  }

  // --------------------------------------------------------------------------
  // HOME VIEW
  // --------------------------------------------------------------------------
  renderHome() {
    const greeting = `${this.getGreeting()}, Vishnuharan`;
    const likedCount = this.player.likedSongIds.size;
    const songs = this.player.songs;
    const recentlyPlayed = this.player.getRecentlyPlayed();

    let html = `
      <div class="view-container">
        <!-- Hero Greeting & Quick Grid -->
        <div class="hero-greeting">
          <h1 class="greeting-title">${greeting}</h1>
          <div class="quick-grid">
            <div class="quick-card" data-action="open-liked">
              <div class="quick-card-liked-icon">
                <svg viewBox="0 0 24 24" width="28" height="28" fill="currentColor">
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                </svg>
              </div>
              <span class="quick-card-title">Liked Songs (${likedCount})</span>
              <button class="quick-play-btn" data-action="play-liked" title="Play Liked Songs">
                <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><polygon points="6 4 18 12 6 20 6 4"></polygon></svg>
              </button>
            </div>
    `;

    // 5 curated quick cards
    this.allPlaylists.slice(0, 5).forEach(pl => {
      html += `
        <div class="quick-card" data-action="open-playlist" data-id="${pl.id}">
          <img src="${pl.cover}" class="quick-card-img" alt="${this.escapeHtml(pl.name)}">
          <span class="quick-card-title">${this.escapeHtml(pl.name)}</span>
          <button class="quick-play-btn" data-action="play-playlist" data-id="${pl.id}" title="Play ${this.escapeHtml(pl.name)}">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><polygon points="6 4 18 12 6 20 6 4"></polygon></svg>
          </button>
        </div>
      `;
    });

    html += `
          </div>
        </div>
    `;

    // Recently Played Section (if any)
    if (recentlyPlayed.length > 0) {
      html += `
        <section class="home-section">
          <div class="section-header">
            <h2 class="section-title">Recently Played</h2>
          </div>
          <div class="cards-grid">
            ${recentlyPlayed.slice(0, 6).map(s => this.renderSongCard(s)).join('')}
          </div>
        </section>
      `;
    }

    // Vishnuharan's Top Hits / All 21 Songs
    html += `
      <section class="home-section">
        <div class="section-header">
          <div>
            <h2 class="section-title">Made For Vishnuharan</h2>
            <p style="font-size: 0.82rem; color: var(--text-secondary); margin-top: 2px;">
              Your 21 handpicked Tamil & Indie favorites • High Quality Streaming
            </p>
          </div>
          <button class="section-see-all" data-action="play-all-songs">Play All</button>
        </div>
        <div class="cards-grid">
          ${songs.map(s => this.renderSongCard(s)).join('')}
        </div>
      </section>
    `;

    // Curated Playlists Section
    html += `
      <section class="home-section">
        <div class="section-header">
          <h2 class="section-title">Featured Playlists</h2>
        </div>
        <div class="cards-grid">
          ${this.allPlaylists.map(pl => this.renderPlaylistCard(pl)).join('')}
        </div>
      </section>
    </div>
    `;

    this.viewRoot.innerHTML = html;
    this.bindCardClicks();
  }

  // Song Card HTML Generator
  renderSongCard(song) {
    const isCurrent = this.player.currentSong && this.player.currentSong.id === song.id;
    const isPlaying = isCurrent && this.player.isPlaying;

    return `
      <div class="media-card ${isCurrent ? 'active-playing' : ''}" data-song-id="${song.id}">
        <div class="card-img-wrapper">
          <img src="${song.cover}" class="card-cover" alt="${this.escapeHtml(song.title)}" loading="lazy">
          <button class="card-play-btn" data-action="play-card-song" data-id="${song.id}" title="${isPlaying ? 'Pause' : 'Play'}">
            ${isPlaying 
              ? `<div class="eq-bars"><div class="eq-bar"></div><div class="eq-bar"></div><div class="eq-bar"></div><div class="eq-bar"></div></div>`
              : `<svg viewBox="0 0 24 24" fill="currentColor"><polygon points="6 4 18 12 6 20 6 4"></polygon></svg>`}
          </button>
        </div>
        <div class="card-info">
          <span class="card-title">${this.escapeHtml(song.title)}</span>
          <span class="card-subtitle">${this.escapeHtml(song.artist)}</span>
          ${song.isCustomAudio ? `<span class="card-badge-custom">⚡ Custom Audio</span>` : ''}
        </div>
      </div>
    `;
  }

  // Playlist Card HTML Generator
  renderPlaylistCard(pl) {
    return `
      <div class="media-card" data-playlist-id="${pl.id}">
        <div class="card-img-wrapper">
          <img src="${pl.cover}" class="card-cover" alt="${this.escapeHtml(pl.name)}" loading="lazy">
          <button class="card-play-btn" data-action="play-playlist" data-id="${pl.id}" title="Play Playlist">
            <svg viewBox="0 0 24 24" fill="currentColor"><polygon points="6 4 18 12 6 20 6 4"></polygon></svg>
          </button>
        </div>
        <div class="card-info">
          <span class="card-title">${this.escapeHtml(pl.name)}</span>
          <span class="card-subtitle">${this.escapeHtml(pl.desc || 'By Vishnuharan')}</span>
        </div>
      </div>
    `;
  }

  // --------------------------------------------------------------------------
  // SEARCH VIEW
  // --------------------------------------------------------------------------
  renderSearch(query = '') {
    const q = query.trim().toLowerCase();

    if (!q) {
      // Categories / Browse All view
      const categories = [
        { name: "Tamil Indipop", color: "#E13300", bg: "https://c.saavncdn.com/772/Aasa-Kooda-From-Think-Indie-Tamil-2024-20251026074529-500x500.jpg" },
        { name: "Anirudh Hits", color: "#1E3264", bg: "https://c.saavncdn.com/510/Beast-Tamil-2022-20220504184736-500x500.jpg" },
        { name: "Soulful Melodies", color: "#8D67AB", bg: "https://c.saavncdn.com/332/Hey-Minnale-From-Amaran-Tamil-Tamil-2024-20241004094036-500x500.jpg" },
        { name: "Dance & Kuthu", color: "#BA5D07", bg: "https://c.saavncdn.com/880/Dude-Original-Motion-Picture-Soundtrack-Tamil-2025-20251026215849-500x500.jpg" },
        { name: "Late Night Chill", color: "#148A08", bg: "https://c.saavncdn.com/600/Kaadhalin-Inimai-Feel-Good-Songs-Tamil-2025-20260406191336-500x500.jpg" },
        { name: "Classic Nostalgia", color: "#503750", bg: "https://c.saavncdn.com/780/In-the-Words-of-Na-Muthukumar-Tamil-2026-20260821175353-500x500.jpg" },
        { name: "Acoustic & Folk", color: "#D84000", bg: "https://c.saavncdn.com/173/VadaChennai-Tamil-2018-20260108133313-500x500.jpg" },
        { name: "Romantic Duets", color: "#E91429", bg: "https://c.saavncdn.com/873/Adi-Penne-Tamil-2021-20211229150342-500x500.jpg" }
      ];

      let html = `
        <div class="view-container">
          <h2 class="section-title">Browse all</h2>
          <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); gap: 18px;">
            ${categories.map(c => `
              <div class="category-tile" style="background-color: ${c.color}; border-radius: var(--radius-md); height: 160px; padding: 16px; position: relative; overflow: hidden; cursor: pointer;" data-category="${this.escapeHtml(c.name)}">
                <span style="font-size: 1.25rem; font-weight: 800; color: white;">${this.escapeHtml(c.name)}</span>
                <img src="${c.bg}" style="position: absolute; right: -16px; bottom: -8px; width: 90px; height: 90px; object-fit: cover; transform: rotate(25deg); box-shadow: 0 4px 12px rgba(0,0,0,0.4); border-radius: 4px;" alt="">
              </div>
            `).join('')}
          </div>
        </div>
      `;
      this.viewRoot.innerHTML = html;

      // Category click binds
      document.querySelectorAll('.category-tile').forEach(tile => {
        tile.addEventListener('click', () => {
          this.globalSearchInput.value = tile.dataset.category.split(' ')[0];
          this.renderSearch(this.globalSearchInput.value);
        });
      });
      return;
    }

    // Perform Search Filter
    const results = this.player.songs.filter(s =>
      s.title.toLowerCase().includes(q) ||
      s.artist.toLowerCase().includes(q) ||
      s.album.toLowerCase().includes(q) ||
      s.genre.toLowerCase().includes(q)
    );

    if (results.length === 0) {
      this.viewRoot.innerHTML = `
        <div class="view-container" style="text-align: center; padding-top: 60px;">
          <h2 style="font-size: 1.5rem; margin-bottom: 8px;">No results found for "${this.escapeHtml(query)}"</h2>
          <p style="color: var(--text-secondary); font-size: 0.9rem;">
            Please make sure your words are spelled correctly, or use less or different keywords.
          </p>
        </div>
      `;
      return;
    }

    const topResult = results[0];

    let html = `
      <div class="view-container">
        <div style="display: grid; grid-template-columns: minmax(260px, 1fr) 2fr; gap: 24px;">
          <!-- Top Result Card -->
          <div>
            <h2 class="section-title" style="margin-bottom: 16px;">Top result</h2>
            <div class="media-card" style="padding: 20px; background-color: var(--bg-surface); cursor: pointer;" data-song-id="${topResult.id}">
              <img src="${topResult.cover}" style="width: 92px; height: 92px; border-radius: var(--radius-sm); margin-bottom: 16px; object-fit: cover; box-shadow: 0 8px 16px rgba(0,0,0,0.5);" alt="">
              <h3 style="font-size: 1.6rem; font-weight: 800; margin-bottom: 4px;">${this.escapeHtml(topResult.title)}</h3>
              <p style="font-size: 0.85rem; color: var(--text-secondary); margin-bottom: 12px;">
                Song • <span style="color: var(--text-primary); font-weight: 600;">${this.escapeHtml(topResult.artist)}</span>
              </p>
              <button class="btn-primary" data-action="play-card-song" data-id="${topResult.id}" style="width: 44px; height: 44px; padding: 0; display: flex; align-items: center; justify-content: center;">
                <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor"><polygon points="6 4 18 12 6 20 6 4"></polygon></svg>
              </button>
            </div>
          </div>

          <!-- Songs Table List -->
          <div>
            <h2 class="section-title" style="margin-bottom: 16px;">Songs</h2>
            ${this.renderSongTable(results.slice(0, 5), true)}
          </div>
        </div>

        ${results.length > 5 ? `
          <div style="margin-top: 16px;">
            <h2 class="section-title" style="margin-bottom: 16px;">More matching tracks</h2>
            <div class="cards-grid">
              ${results.slice(5).map(s => this.renderSongCard(s)).join('')}
            </div>
          </div>
        ` : ''}
      </div>
    `;

    this.viewRoot.innerHTML = html;
    this.bindCardClicks();
    this.bindTableClicks();
  }

  // --------------------------------------------------------------------------
  // LIKED SONGS VIEW
  // --------------------------------------------------------------------------
  renderLikedSongs() {
    const likedSongs = this.player.getLikedSongs();

    let html = `
      <div class="view-container">
        <!-- Playlist Hero Header -->
        <div class="playlist-hero">
          <div class="hero-art-liked">
            <svg viewBox="0 0 24 24" width="70" height="70" fill="white">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
            </svg>
          </div>
          <div class="hero-info">
            <span class="hero-type">Playlist</span>
            <h1 class="hero-title">Liked Songs</h1>
            <p class="hero-desc">Your personal saved favorites across Tamil films and independent music.</p>
            <div class="hero-meta">
              <span>Vishnuharan</span>
              <span class="dot">•</span>
              <span>${likedSongs.length} songs</span>
            </div>
          </div>
        </div>

        <!-- Controls Bar -->
        <div class="playlist-actions-bar">
          <button class="big-play-btn" id="btn-play-all-liked" title="Play">
            <svg viewBox="0 0 24 24" fill="currentColor"><polygon points="6 4 18 12 6 20 6 4"></polygon></svg>
          </button>
        </div>

        <!-- Songs Table -->
        ${likedSongs.length === 0 ? `
          <div style="text-align: center; padding: 48px; color: var(--text-secondary);">
            <h3 style="font-size: 1.2rem; color: #fff; margin-bottom: 8px;">Songs you like will appear here</h3>
            <p>Save songs by clicking the heart icon on any track or player bar.</p>
          </div>
        ` : this.renderSongTable(likedSongs)}
      </div>
    `;

    this.viewRoot.innerHTML = html;
    this.bindTableClicks();

    const btnPlayAll = document.getElementById('btn-play-all-liked');
    if (btnPlayAll && likedSongs.length > 0) {
      btnPlayAll.addEventListener('click', () => {
        this.player.playSong(likedSongs[0], likedSongs);
      });
    }
  }

  // --------------------------------------------------------------------------
  // PLAYLIST VIEW
  // --------------------------------------------------------------------------
  renderPlaylist(playlistId) {
    const pl = this.allPlaylists.find(p => p.id === playlistId) || this.allPlaylists[0];
    const songs = this.player.songs.filter(s => pl.songIds.includes(s.id));

    let html = `
      <div class="view-container">
        <!-- Playlist Hero Header -->
        <div class="playlist-hero">
          <img src="${pl.cover}" class="hero-art-img" alt="${this.escapeHtml(pl.name)}">
          <div class="hero-info">
            <span class="hero-type">Playlist</span>
            <h1 class="hero-title">${this.escapeHtml(pl.name)}</h1>
            <p class="hero-desc">${this.escapeHtml(pl.desc || 'Curated mix on Vishnuharan\'s Spotify')}</p>
            <div class="hero-meta">
              <span>Vishnuharan</span>
              <span class="dot">•</span>
              <span>${songs.length} songs</span>
            </div>
          </div>
        </div>

        <!-- Controls Bar -->
        <div class="playlist-actions-bar">
          <button class="big-play-btn" id="btn-play-all-playlist" title="Play">
            <svg viewBox="0 0 24 24" fill="currentColor"><polygon points="6 4 18 12 6 20 6 4"></polygon></svg>
          </button>
        </div>

        <!-- Songs Table -->
        ${songs.length === 0 ? `
          <div style="text-align: center; padding: 48px; color: var(--text-secondary);">
            <p>No songs in this playlist yet.</p>
          </div>
        ` : this.renderSongTable(songs)}
      </div>
    `;

    this.viewRoot.innerHTML = html;
    this.bindTableClicks();

    const btnPlayAll = document.getElementById('btn-play-all-playlist');
    if (btnPlayAll && songs.length > 0) {
      btnPlayAll.addEventListener('click', () => {
        this.player.playSong(songs[0], songs);
      });
    }
  }

  // --------------------------------------------------------------------------
  // LIBRARY VIEW
  // --------------------------------------------------------------------------
  renderLibrary() {
    const likedCount = this.player.likedSongIds.size;

    let html = `
      <div class="view-container">
        <div class="section-header">
          <h1 class="section-title">Your Library</h1>
          <button class="btn-primary" id="btn-create-playlist-lib">+ New Playlist</button>
        </div>

        <div class="cards-grid">
          <!-- Liked Songs Big Card -->
          <div class="media-card" style="background: linear-gradient(135deg, #450af5, #8e8ee5); min-height: 220px;" data-action="open-liked">
            <div style="flex: 1; display: flex; flex-direction: column; justify-content: flex-end; padding: 10px;">
              <span style="font-size: 1.6rem; font-weight: 800; color: white;">Liked Songs</span>
              <span style="font-size: 0.88rem; color: rgba(255, 255, 255, 0.8);">${likedCount} liked songs</span>
            </div>
            <button class="card-play-btn" data-action="play-liked" style="opacity: 1; transform: none; position: absolute; right: 14px; bottom: 14px;">
              <svg viewBox="0 0 24 24" fill="currentColor"><polygon points="6 4 18 12 6 20 6 4"></polygon></svg>
            </button>
          </div>

          <!-- All Playlists -->
          ${this.allPlaylists.map(pl => this.renderPlaylistCard(pl)).join('')}
        </div>
      </div>
    `;

    this.viewRoot.innerHTML = html;
    this.bindCardClicks();

    const btnCreate = document.getElementById('btn-create-playlist-lib');
    if (btnCreate) {
      btnCreate.addEventListener('click', () => this.openModal(this.playlistModal));
    }
  }

  // --------------------------------------------------------------------------
  // TABLE COMPONENT GENERATOR
  // --------------------------------------------------------------------------
  renderSongTable(songs, compact = false) {
    return `
      <div class="song-table-container">
        <table class="song-table">
          <thead>
            <tr>
              <th style="width: 40px; text-align: center;">#</th>
              <th>Title</th>
              ${!compact ? `<th>Album</th>` : ''}
              <th style="width: 50px; text-align: center;">Like</th>
              <th style="width: 70px; text-align: right;">Time</th>
              <th style="width: 40px; text-align: center;"></th>
            </tr>
          </thead>
          <tbody>
            ${songs.map((song, index) => {
              const isCurrent = this.player.currentSong && this.player.currentSong.id === song.id;
              const isPlaying = isCurrent && this.player.isPlaying;
              const isLiked = this.player.isSongLiked(song.id);

              return `
                <tr class="song-row ${isCurrent ? 'active' : ''}" data-song-id="${song.id}">
                  <td class="song-num-col">
                    <span class="row-index">
                      ${isPlaying 
                        ? `<div class="eq-bars" style="margin: 0 auto;"><div class="eq-bar"></div><div class="eq-bar"></div><div class="eq-bar"></div><div class="eq-bar"></div></div>`
                        : `${index + 1}`}
                    </span>
                    <button class="row-play-btn" data-action="table-play" data-id="${song.id}">
                      <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><polygon points="6 4 18 12 6 20 6 4"></polygon></svg>
                    </button>
                  </td>
                  <td>
                    <div class="song-main-cell">
                      <img src="${song.cover}" class="table-cover" alt="" loading="lazy">
                      <div class="song-meta">
                        <span class="song-title-text">${this.escapeHtml(song.title)}</span>
                        <span class="song-artist-text">${this.escapeHtml(song.artist)}</span>
                      </div>
                    </div>
                  </td>
                  ${!compact ? `<td>${this.escapeHtml(song.album)}</td>` : ''}
                  <td style="text-align: center;">
                    <button class="table-action-btn ${isLiked ? 'liked' : ''}" data-action="toggle-like" data-id="${song.id}" title="Like">
                      <svg viewBox="0 0 24 24" width="18" height="18" fill="${isLiked ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2">
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                      </svg>
                    </button>
                  </td>
                  <td style="text-align: right; font-variant-numeric: tabular-nums;">${song.duration}</td>
                  <td style="text-align: center;">
                    <button class="table-action-btn" data-action="open-audio-for-song" data-id="${song.id}" title="Change audio / MP3 link">
                      <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M12 20h9"></path>
                        <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
                      </svg>
                    </button>
                  </td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>
      </div>
    `;
  }

  // --------------------------------------------------------------------------
  // EVENT BINDINGS
  // --------------------------------------------------------------------------
  bindPlayerEvents() {
    this.btnPlayPause.addEventListener('click', () => this.player.togglePlay());
    this.btnPrev.addEventListener('click', () => this.player.prev());
    this.btnNext.addEventListener('click', () => this.player.next());
    this.btnShuffle.addEventListener('click', () => this.player.toggleShuffle());
    this.btnRepeat.addEventListener('click', () => this.player.toggleRepeat());
    this.btnMuteVolume.addEventListener('click', () => this.player.toggleMute());

    this.playerLikeBtn.addEventListener('click', () => {
      if (this.player.currentSong) {
        this.player.toggleLike(this.player.currentSong.id);
      }
    });

    // Subscriptions to player engine
    this.player.on('play', song => {
      this.updatePlayPauseIcon(true);
      this.refreshActiveTrackIndicators();
    });

    this.player.on('pause', song => {
      this.updatePlayPauseIcon(false);
      this.refreshActiveTrackIndicators();
    });

    this.player.on('songchange', song => {
      this.updatePlayerBar(song);
      this.refreshActiveTrackIndicators();
      this.showToast(`Playing ${song.title}`, 'info');
    });

    this.player.on('timeupdate', ({ currentTime, duration, progress }) => {
      if (!this.isSeeking) {
        this.timeCurrent.textContent = this.formatTime(currentTime);
        if (duration && !isNaN(duration)) {
          this.timeDuration.textContent = this.formatTime(duration);
        }
        this.timelineFill.style.width = `${progress}%`;
        this.timelineThumb.style.left = `${progress}%`;
      }
    });

    this.player.on('loadedmetadata', ({ duration, song }) => {
      if (duration && !isNaN(duration)) {
        this.timeDuration.textContent = this.formatTime(duration);
      }
    });

    this.player.on('volumechange', ({ volume, muted }) => {
      this.updateVolumeBar(volume, muted);
    });

    this.player.on('shufflechange', isShuffle => {
      if (isShuffle) {
        this.btnShuffle.classList.add('active');
        this.showToast('Shuffle turned ON', 'info');
      } else {
        this.btnShuffle.classList.remove('active');
        this.showToast('Shuffle turned OFF', 'info');
      }
    });

    this.player.on('repeatchange', mode => {
      if (mode === 'all') {
        this.btnRepeat.classList.add('active');
        this.btnRepeat.title = 'Repeat All';
        this.showToast('Repeat ALL turned ON', 'info');
      } else if (mode === 'one') {
        this.btnRepeat.classList.add('active');
        this.btnRepeat.title = 'Repeat ONE';
        this.showToast('Repeat ONE turned ON', 'info');
      } else {
        this.btnRepeat.classList.remove('active');
        this.btnRepeat.title = 'Repeat OFF';
        this.showToast('Repeat turned OFF', 'info');
      }
    });

    this.player.on('likechange', ({ songId, isLiked }) => {
      if (this.player.currentSong && this.player.currentSong.id === songId) {
        this.updatePlayerLikeBtn(isLiked);
      }
      this.updateLikedCounts();
      this.renderCurrentView();
      this.showToast(isLiked ? 'Added to Liked Songs' : 'Removed from Liked Songs', isLiked ? 'success' : 'info');
    });

    this.player.on('songsupdated', () => {
      this.renderCurrentView();
      this.showToast('Song audio links updated', 'success');
    });
  }

  bindGlobalEvents() {
    // Navigation items
    document.querySelectorAll('.nav-item, .mobile-nav-item').forEach(el => {
      el.addEventListener('click', () => {
        const view = el.dataset.view;
        this.navigate(view);
      });
    });

    // History buttons
    document.getElementById('btn-history-back').addEventListener('click', () => this.goBack());
    document.getElementById('btn-history-forward').addEventListener('click', () => this.goForward());

    // Search bar input
    this.globalSearchInput.addEventListener('input', (e) => {
      const val = e.target.value;
      this.btnClearSearch.style.display = val ? 'block' : 'none';
      if (this.currentView !== 'search') {
        this.navigate('search', null, true);
      } else {
        this.renderSearch(val);
      }
    });

    this.globalSearchInput.addEventListener('focus', () => {
      if (this.currentView !== 'search') {
        this.navigate('search');
      }
    });

    this.btnClearSearch.addEventListener('click', () => {
      this.globalSearchInput.value = '';
      this.btnClearSearch.style.display = 'none';
      this.renderSearch('');
    });

    // Sidebar Liked Songs Quick Tile
    const sidebarLiked = document.getElementById('sidebar-liked-songs');
    if (sidebarLiked) {
      sidebarLiked.addEventListener('click', () => this.navigate('liked'));
    }

    // Sidebar Library Title Click
    const navLibrary = document.getElementById('nav-library');
    if (navLibrary) {
      navLibrary.addEventListener('click', () => this.navigate('library'));
    }

    // Create Playlist Button
    const btnCreatePlaylist = document.getElementById('btn-create-playlist');
    if (btnCreatePlaylist) {
      btnCreatePlaylist.addEventListener('click', () => this.openModal(this.playlistModal));
    }

    // Audio Guide Pill in topbar & player button
    document.getElementById('btn-open-audio-modal').addEventListener('click', () => this.openAudioModal());
    document.getElementById('btn-player-change-audio').addEventListener('click', () => this.openAudioModal());

    // Lyrics & Queue Modals
    document.getElementById('btn-lyrics-modal').addEventListener('click', () => this.openLyricsModal());
    document.getElementById('btn-queue-modal').addEventListener('click', () => this.openQueueModal());
  }

  bindSliderEvents() {
    // Timeline Seeking
    const handleTimelineSeek = (e) => {
      const rect = this.timelineSliderWrapper.getBoundingClientRect();
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const pos = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
      this.timelineFill.style.width = `${pos * 100}%`;
      this.timelineThumb.style.left = `${pos * 100}%`;
      return pos * 100;
    };

    const startSeek = (e) => {
      this.isSeeking = true;
      const pct = handleTimelineSeek(e);
      const onMove = (moveEvent) => handleTimelineSeek(moveEvent);
      const onUp = (upEvent) => {
        this.isSeeking = false;
        const finalPct = handleTimelineSeek(upEvent);
        this.player.seek(finalPct);
        window.removeEventListener('mousemove', onMove);
        window.removeEventListener('mouseup', onUp);
        window.removeEventListener('touchmove', onMove);
        window.removeEventListener('touchend', onUp);
      };
      window.addEventListener('mousemove', onMove);
      window.addEventListener('mouseup', onUp);
      window.addEventListener('touchmove', onMove);
      window.addEventListener('touchend', onUp);
    };

    this.timelineSliderWrapper.addEventListener('mousedown', startSeek);
    this.timelineSliderWrapper.addEventListener('touchstart', startSeek);

    // Volume Slider
    const handleVolumeChange = (e) => {
      const rect = this.volumeSliderWrapper.getBoundingClientRect();
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const vol = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
      this.player.setVolume(vol);
    };

    const startVolSeek = (e) => {
      handleVolumeChange(e);
      const onVolMove = (moveEvent) => handleVolumeChange(moveEvent);
      const onVolUp = () => {
        window.removeEventListener('mousemove', onVolMove);
        window.removeEventListener('mouseup', onVolUp);
      };
      window.addEventListener('mousemove', onVolMove);
      window.addEventListener('mouseup', onVolUp);
    };

    this.volumeSliderWrapper.addEventListener('mousedown', startVolSeek);
  }

  bindCardClicks() {
    // Media cards click delegator
    document.querySelectorAll('.media-card').forEach(card => {
      card.addEventListener('click', (e) => {
        const actionBtn = e.target.closest('[data-action]');
        if (actionBtn) return; // handled by button logic

        if (card.dataset.songId) {
          const songId = Number(card.dataset.songId);
          this.player.playSong(songId, this.player.songs);
        } else if (card.dataset.playlistId) {
          this.navigate('playlist', card.dataset.playlistId);
        } else if (card.dataset.action === 'open-liked') {
          this.navigate('liked');
        }
      });
    });

    // Play button on cards
    document.querySelectorAll('[data-action="play-card-song"]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = Number(btn.dataset.id);
        if (this.player.currentSong && this.player.currentSong.id === id) {
          this.player.togglePlay();
        } else {
          this.player.playSong(id, this.player.songs);
        }
      });
    });

    // Quick Grid Cards
    document.querySelectorAll('.quick-card').forEach(card => {
      card.addEventListener('click', (e) => {
        const btn = e.target.closest('button');
        if (btn) return;
        if (card.dataset.action === 'open-liked') {
          this.navigate('liked');
        } else if (card.dataset.action === 'open-playlist') {
          this.navigate('playlist', card.dataset.id);
        }
      });
    });

    // Quick Play Buttons
    document.querySelectorAll('.quick-play-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const action = btn.dataset.action;
        if (action === 'play-liked') {
          const liked = this.player.getLikedSongs();
          if (liked.length > 0) this.player.playSong(liked[0], liked);
        } else if (action === 'play-playlist') {
          const pl = this.allPlaylists.find(p => p.id === btn.dataset.id);
          if (pl && pl.songIds.length > 0) {
            const plSongs = this.player.songs.filter(s => pl.songIds.includes(s.id));
            if (plSongs.length > 0) this.player.playSong(plSongs[0], plSongs);
          }
        }
      });
    });

    // Play All Songs Button
    const btnPlayAll = document.querySelector('[data-action="play-all-songs"]');
    if (btnPlayAll) {
      btnPlayAll.addEventListener('click', () => {
        this.player.playSong(this.player.songs[0], this.player.songs);
      });
    }
  }

  bindTableClicks() {
    // Row click
    document.querySelectorAll('.song-row').forEach(row => {
      row.addEventListener('click', (e) => {
        if (e.target.closest('button')) return; // action handled by button
        const songId = Number(row.dataset.songId);
        this.player.playSong(songId);
      });
    });

    // Table Play Button
    document.querySelectorAll('[data-action="table-play"]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const songId = Number(btn.dataset.id);
        if (this.player.currentSong && this.player.currentSong.id === songId) {
          this.player.togglePlay();
        } else {
          this.player.playSong(songId);
        }
      });
    });

    // Toggle Like Button
    document.querySelectorAll('[data-action="toggle-like"]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const songId = Number(btn.dataset.id);
        this.player.toggleLike(songId);
      });
    });

    // Open Audio Customizer for single song
    document.querySelectorAll('[data-action="open-audio-for-song"]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.openAudioModal(Number(btn.dataset.id));
      });
    });
  }

  // --------------------------------------------------------------------------
  // MODALS & DIALOGS
  // --------------------------------------------------------------------------
  bindModalEvents() {
    // Close modal triggers
    const closeBtns = [
      'btn-close-audio-modal',
      'btn-close-lyrics-modal',
      'btn-close-lyrics-modal-footer',
      'btn-close-queue-modal',
      'btn-close-queue-modal-footer',
      'btn-close-playlist-modal',
      'btn-cancel-create-playlist'
    ];

    closeBtns.forEach(id => {
      const btn = document.getElementById(id);
      if (btn) {
        btn.addEventListener('click', () => this.closeAllModals());
      }
    });

    // Close when clicking modal backdrop
    [this.audioModal, this.lyricsModal, this.queueModal, this.playlistModal].forEach(modal => {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) this.closeAllModals();
      });
    });

    // Audio Customizer Form
    const songSelect = document.getElementById('audio-modal-select-song');
    const urlInput = document.getElementById('audio-modal-url-input');
    const fileInput = document.getElementById('local-audio-file-input');
    const dropzone = document.getElementById('file-dropzone');
    const statusDiv = document.getElementById('custom-audio-status');
    const btnSave = document.getElementById('btn-save-custom-audio');
    const btnReset = document.getElementById('btn-reset-custom-audio');

    // Populate song select dropdown
    songSelect.innerHTML = this.player.songs.map(s => `
      <option value="${s.id}">${s.id}. ${s.title} - ${s.artist}</option>
    `).join('');

    songSelect.addEventListener('change', () => {
      const selectedId = Number(songSelect.value);
      const song = this.player.songs.find(s => s.id === selectedId);
      if (song) {
        urlInput.value = song.url;
        statusDiv.style.display = 'none';
      }
    });

    dropzone.addEventListener('click', () => fileInput.click());

    fileInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) {
        const objectUrl = URL.createObjectURL(file);
        urlInput.value = objectUrl;
        statusDiv.textContent = `Selected local file: ${file.name}`;
        statusDiv.style.display = 'block';
      }
    });

    btnSave.addEventListener('click', () => {
      const songId = Number(songSelect.value);
      const newUrl = urlInput.value.trim();
      if (newUrl) {
        this.player.setCustomAudio(songId, newUrl);
        this.closeAllModals();
        this.showToast('Song audio updated successfully!', 'success');
      }
    });

    btnReset.addEventListener('click', () => {
      const songId = Number(songSelect.value);
      this.player.resetCustomAudio(songId);
      const original = DEFAULT_SONGS.find(s => s.id === songId);
      if (original) urlInput.value = original.url;
      statusDiv.style.display = 'none';
      this.showToast('Reset audio to default track', 'info');
    });

    // Create Playlist Form
    document.getElementById('btn-confirm-create-playlist').addEventListener('click', () => {
      const nameInput = document.getElementById('new-playlist-name');
      const descInput = document.getElementById('new-playlist-desc');
      const name = nameInput.value.trim();

      if (!name) {
        alert('Please enter a playlist name');
        return;
      }

      const newPl = {
        id: `pl-user-${Date.now()}`,
        name: name,
        desc: descInput.value.trim() || 'Created by Vishnuharan',
        cover: this.player.currentSong ? this.player.currentSong.cover : DEFAULT_SONGS[0].cover,
        songIds: [1, 2, 3]
      };

      this.customPlaylists.push(newPl);
      localStorage.setItem('vspotify_custom_playlists', JSON.stringify(this.customPlaylists));
      this.allPlaylists = [...DEFAULT_PLAYLISTS, ...this.customPlaylists];

      this.renderSidebarPlaylists();
      this.closeAllModals();
      this.navigate('playlist', newPl.id);
      this.showToast(`Playlist "${name}" created!`, 'success');

      nameInput.value = '';
      descInput.value = '';
    });
  }

  openModal(modal) {
    this.closeAllModals();
    modal.classList.add('open');
  }

  closeAllModals() {
    [this.audioModal, this.lyricsModal, this.queueModal, this.playlistModal].forEach(m => m.classList.remove('open'));
  }

  openAudioModal(targetSongId = null) {
    const songId = targetSongId || (this.player.currentSong ? this.player.currentSong.id : 1);
    const songSelect = document.getElementById('audio-modal-select-song');
    const urlInput = document.getElementById('audio-modal-url-input');
    const statusDiv = document.getElementById('custom-audio-status');

    if (songSelect) songSelect.value = songId;
    const song = this.player.songs.find(s => s.id === songId);
    if (song && urlInput) {
      urlInput.value = song.url;
    }
    if (statusDiv) statusDiv.style.display = 'none';

    this.openModal(this.audioModal);
  }

  openLyricsModal() {
    const current = this.player.currentSong;
    if (!current) {
      this.showToast('Play a song to view lyrics', 'info');
      return;
    }

    document.getElementById('lyrics-song-title').textContent = `${current.title} - Lyrics`;
    document.getElementById('lyrics-display').textContent = current.lyrics || 'Lyrics excerpt not available for this song.';
    this.openModal(this.lyricsModal);
  }

  openQueueModal() {
    const nowPlayingDiv = document.getElementById('queue-now-playing');
    const queueItemsContainer = document.getElementById('queue-items-container');

    const cur = this.player.currentSong;
    if (cur) {
      nowPlayingDiv.innerHTML = `
        <div class="queue-item current">
          <img src="${cur.cover}" style="width: 40px; height: 40px; border-radius: 4px; object-fit: cover;" alt="">
          <div style="flex: 1; overflow: hidden;">
            <div style="font-weight: 700; font-size: 0.9rem; color: var(--spotify-green);">${this.escapeHtml(cur.title)}</div>
            <div style="font-size: 0.78rem; color: var(--text-secondary);">${this.escapeHtml(cur.artist)}</div>
          </div>
          <span style="font-size: 0.8rem; color: var(--text-secondary);">${cur.duration}</span>
        </div>
      `;
    } else {
      nowPlayingDiv.innerHTML = `<div style="color: var(--text-secondary); font-size: 0.85rem;">Nothing playing right now</div>`;
    }

    const upcoming = this.player.queue.slice(this.player.currentIndex + 1);
    if (upcoming.length === 0) {
      queueItemsContainer.innerHTML = `<div style="color: var(--text-secondary); font-size: 0.85rem; padding: 12px 0;">No songs left in the current queue.</div>`;
    } else {
      queueItemsContainer.innerHTML = upcoming.map((song, idx) => `
        <div class="queue-item" data-queue-idx="${this.player.currentIndex + 1 + idx}">
          <img src="${song.cover}" style="width: 40px; height: 40px; border-radius: 4px; object-fit: cover;" alt="">
          <div style="flex: 1; overflow: hidden;">
            <div style="font-weight: 600; font-size: 0.88rem; color: #fff;">${this.escapeHtml(song.title)}</div>
            <div style="font-size: 0.78rem; color: var(--text-secondary);">${this.escapeHtml(song.artist)}</div>
          </div>
          <span style="font-size: 0.8rem; color: var(--text-secondary);">${song.duration}</span>
        </div>
      `).join('');

      queueItemsContainer.querySelectorAll('.queue-item').forEach(el => {
        el.addEventListener('click', () => {
          const idx = Number(el.dataset.queueIdx);
          if (!isNaN(idx) && this.player.queue[idx]) {
            this.player.currentIndex = idx;
            this.player.playSong(this.player.queue[idx]);
            this.openQueueModal();
          }
        });
      });
    }

    document.getElementById('btn-clear-queue').onclick = () => {
      this.player.toggleShuffle();
      this.openQueueModal();
    };

    this.openModal(this.queueModal);
  }

  // --------------------------------------------------------------------------
  // SIDEBAR & PLAYER BAR SYNC
  // --------------------------------------------------------------------------
  renderSidebarPlaylists() {
    let html = `
      <!-- Liked Songs Quick Item -->
      <div class="playlist-sidebar-item" id="sidebar-liked-songs" data-view="liked">
        <div class="playlist-thumb-liked">
          <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
          </svg>
        </div>
        <div class="playlist-meta">
          <span class="playlist-name">Liked Songs</span>
          <span class="playlist-sub">Playlist • <span id="sidebar-liked-count">${this.player.likedSongIds.size}</span> songs</span>
        </div>
      </div>
    `;

    this.allPlaylists.forEach(pl => {
      html += `
        <div class="playlist-sidebar-item" data-action="sidebar-playlist" data-id="${pl.id}">
          <img src="${pl.cover}" class="playlist-thumb" alt="${this.escapeHtml(pl.name)}">
          <div class="playlist-meta">
            <span class="playlist-name">${this.escapeHtml(pl.name)}</span>
            <span class="playlist-sub">Playlist • Vishnuharan</span>
          </div>
        </div>
      `;
    });

    this.sidebarPlaylistList.innerHTML = html;

    // Re-bind sidebar item clicks
    document.getElementById('sidebar-liked-songs').addEventListener('click', () => this.navigate('liked'));

    document.querySelectorAll('[data-action="sidebar-playlist"]').forEach(el => {
      el.addEventListener('click', () => {
        this.navigate('playlist', el.dataset.id);
      });
    });
  }

  updateLikedCounts() {
    const count = this.player.likedSongIds.size;
    const countEl = document.getElementById('sidebar-liked-count');
    if (countEl) countEl.textContent = count;
  }

  updatePlayerBar(song) {
    if (!song) return;
    this.playerThumb.src = song.cover;
    this.playerTitle.textContent = song.title;
    this.playerArtist.textContent = song.artist;
    this.updatePlayerLikeBtn(this.player.isSongLiked(song.id));
  }

  updatePlayPauseIcon(isPlaying) {
    if (isPlaying) {
      this.playPauseIcon.innerHTML = `<rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect>`;
      this.btnPlayPause.title = 'Pause';
    } else {
      this.playPauseIcon.innerHTML = `<polygon points="5 3 19 12 5 21 5 3"></polygon>`;
      this.btnPlayPause.title = 'Play';
    }
  }

  updatePlayerLikeBtn(isLiked) {
    if (isLiked) {
      this.playerLikeBtn.classList.add('liked');
      this.playerLikeBtn.innerHTML = `
        <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
        </svg>
      `;
    } else {
      this.playerLikeBtn.classList.remove('liked');
      this.playerLikeBtn.innerHTML = `
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
        </svg>
      `;
    }
  }

  updateVolumeBar(vol, isMuted) {
    const percent = isMuted ? 0 : vol * 100;
    this.volumeFill.style.width = `${percent}%`;
    this.volumeThumb.style.left = `${percent}%`;

    if (isMuted || vol === 0) {
      this.volumeIcon.innerHTML = `
        <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
        <line x1="23" y1="9" x2="17" y2="15"></line>
        <line x1="17" y1="9" x2="23" y2="15"></line>
      `;
    } else if (vol < 0.5) {
      this.volumeIcon.innerHTML = `
        <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
        <path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path>
      `;
    } else {
      this.volumeIcon.innerHTML = `
        <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
        <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>
      `;
    }
  }

  refreshActiveTrackIndicators() {
    const curId = this.player.currentSong ? this.player.currentSong.id : null;
    const isPlaying = this.player.isPlaying;

    // Cards
    document.querySelectorAll('.media-card').forEach(card => {
      const songId = Number(card.dataset.songId);
      if (songId === curId) {
        card.classList.add('active-playing');
        const playBtn = card.querySelector('.card-play-btn');
        if (playBtn) {
          playBtn.innerHTML = isPlaying 
            ? `<div class="eq-bars"><div class="eq-bar"></div><div class="eq-bar"></div><div class="eq-bar"></div><div class="eq-bar"></div></div>`
            : `<svg viewBox="0 0 24 24" fill="currentColor"><polygon points="6 4 18 12 6 20 6 4"></polygon></svg>`;
        }
      } else {
        card.classList.remove('active-playing');
        const playBtn = card.querySelector('.card-play-btn');
        if (playBtn && card.dataset.songId) {
          playBtn.innerHTML = `<svg viewBox="0 0 24 24" fill="currentColor"><polygon points="6 4 18 12 6 20 6 4"></polygon></svg>`;
        }
      }
    });

    // Rows
    document.querySelectorAll('.song-row').forEach(row => {
      const songId = Number(row.dataset.songId);
      if (songId === curId) {
        row.classList.add('active');
        const indexSpan = row.querySelector('.row-index');
        if (indexSpan) {
          indexSpan.innerHTML = isPlaying 
            ? `<div class="eq-bars" style="margin: 0 auto;"><div class="eq-bar"></div><div class="eq-bar"></div><div class="eq-bar"></div><div class="eq-bar"></div></div>`
            : indexSpan.dataset.originalIndex || '1';
        }
      } else {
        row.classList.remove('active');
      }
    });
  }

  // --------------------------------------------------------------------------
  // UTILITIES
  // --------------------------------------------------------------------------
  formatTime(seconds) {
    if (isNaN(seconds) || seconds < 0) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  }

  escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  showToast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast ${type === 'success' ? 'toast-success' : ''}`;
    toast.textContent = message;
    container.appendChild(toast);

    setTimeout(() => {
      if (toast.parentNode) {
        toast.parentNode.removeChild(toast);
      }
    }, 3000);
  }
}
