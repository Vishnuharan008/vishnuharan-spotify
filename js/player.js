/**
 * ==============================================================================
 * VISHNUHARAN'S SPOTIFY - AUDIO ENGINE
 * ==============================================================================
 * Handles playback, state, queue, shuffle, repeat, volume, and storage persistence.
 */

class AudioPlayer {
  constructor() {
    this.audio = new Audio();
    this.audio.preload = 'metadata';

    this.songs = getSongsList();
    this.queue = [...this.songs];
    this.originalQueue = [...this.songs];
    this.currentIndex = 0;
    this.currentSong = this.queue[0] || null;

    this.isPlaying = false;
    this.isShuffle = false;
    this.repeatMode = 'off'; // 'off' | 'all' | 'one'
    this.volume = parseFloat(localStorage.getItem('vspotify_volume') || '0.8');
    this.isMuted = false;
    this.previousVolume = this.volume;

    this.likedSongIds = new Set(JSON.parse(localStorage.getItem('vspotify_liked') || '[]'));
    this.recentlyPlayedIds = JSON.parse(localStorage.getItem('vspotify_recent') || '[]');

    this.listeners = new Map();

    this.initAudioEvents();
    this.setVolume(this.volume);
  }

  // Event Subscription
  on(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event).push(callback);
  }

  emit(event, data) {
    if (this.listeners.has(event)) {
      this.listeners.get(event).forEach(cb => {
        try { cb(data); } catch (e) { console.error(e); }
      });
    }
  }

  initAudioEvents() {
    this.audio.addEventListener('play', () => {
      this.isPlaying = true;
      this.emit('play', this.currentSong);
    });

    this.audio.addEventListener('pause', () => {
      this.isPlaying = false;
      this.emit('pause', this.currentSong);
    });

    this.audio.addEventListener('timeupdate', () => {
      this.emit('timeupdate', {
        currentTime: this.audio.currentTime || 0,
        duration: this.audio.duration || 0,
        progress: this.audio.duration ? (this.audio.currentTime / this.audio.duration) * 100 : 0
      });
    });

    this.audio.addEventListener('loadedmetadata', () => {
      this.emit('loadedmetadata', {
        duration: this.audio.duration || 0,
        song: this.currentSong
      });
    });

    this.audio.addEventListener('ended', () => {
      if (this.repeatMode === 'one') {
        this.audio.currentTime = 0;
        this.audio.play();
      } else {
        this.next(true); // auto next
      }
    });

    this.audio.addEventListener('error', (e) => {
      console.warn('Audio playback notice:', e);
      this.emit('error', {
        song: this.currentSong,
        error: this.audio.error
      });
    });

    this.audio.addEventListener('volumechange', () => {
      this.emit('volumechange', {
        volume: this.audio.volume,
        muted: this.audio.muted
      });
    });
  }

  // Play a specific song by Object or ID
  playSong(songOrId, newQueue = null) {
    let song = null;
    if (typeof songOrId === 'object' && songOrId !== null) {
      song = songOrId;
    } else {
      song = this.songs.find(s => s.id === Number(songOrId));
    }

    if (!song) return;

    if (newQueue && Array.isArray(newQueue) && newQueue.length > 0) {
      this.queue = [...newQueue];
      this.originalQueue = [...newQueue];
      if (this.isShuffle) {
        this.applyShuffle(song.id);
      }
    }

    const foundIdx = this.queue.findIndex(s => s.id === song.id);
    if (foundIdx !== -1) {
      this.currentIndex = foundIdx;
    } else {
      this.queue.splice(this.currentIndex + 1, 0, song);
      this.currentIndex += 1;
    }

    this.currentSong = song;
    this.recordRecentlyPlayed(song.id);

    // Update audio source
    const songUrl = song.url;
    if (this.audio.src !== songUrl) {
      this.audio.src = songUrl;
    }

    const playPromise = this.audio.play();
    if (playPromise !== undefined) {
      playPromise.catch(err => {
        console.log('Playback notice (interaction required or network):', err);
        this.isPlaying = false;
        this.emit('pause', this.currentSong);
      });
    }

    this.emit('songchange', this.currentSong);
  }

  togglePlay() {
    if (!this.currentSong) {
      if (this.queue.length > 0) {
        this.playSong(this.queue[0]);
      }
      return;
    }

    if (this.audio.paused) {
      if (!this.audio.src || this.audio.src === '' || this.audio.src === window.location.href) {
        this.audio.src = this.currentSong.url;
      }
      this.audio.play().catch(e => console.log('Autoplay policy or source error:', e));
    } else {
      this.audio.pause();
    }
  }

  next(isAuto = false) {
    if (this.queue.length === 0) return;

    if (this.repeatMode === 'one' && !isAuto) {
      // Manual click on next in repeat-one mode moves to next song
    }

    if (this.currentIndex < this.queue.length - 1) {
      this.currentIndex++;
      this.playSong(this.queue[this.currentIndex]);
    } else {
      if (this.repeatMode === 'all' || isAuto) {
        this.currentIndex = 0;
        this.playSong(this.queue[0]);
      } else {
        this.audio.pause();
        this.audio.currentTime = 0;
        this.isPlaying = false;
        this.emit('pause', this.currentSong);
      }
    }
  }

  prev() {
    if (this.queue.length === 0) return;

    // If song played for more than 3 seconds, restart it (standard Spotify behavior)
    if (this.audio.currentTime > 3) {
      this.audio.currentTime = 0;
      return;
    }

    if (this.currentIndex > 0) {
      this.currentIndex--;
      this.playSong(this.queue[this.currentIndex]);
    } else {
      this.currentIndex = this.queue.length - 1;
      this.playSong(this.queue[this.currentIndex]);
    }
  }

  seek(percentage) {
    if (this.audio.duration && !isNaN(this.audio.duration)) {
      const targetTime = (percentage / 100) * this.audio.duration;
      this.audio.currentTime = Math.max(0, Math.min(targetTime, this.audio.duration));
    }
  }

  setVolume(val) {
    this.volume = Math.max(0, Math.min(1, val));
    this.audio.volume = this.volume;
    if (this.volume > 0) {
      this.isMuted = false;
      this.audio.muted = false;
    }
    localStorage.setItem('vspotify_volume', this.volume);
    this.emit('volumechange', { volume: this.volume, muted: this.isMuted });
  }

  toggleMute() {
    if (this.isMuted || this.audio.volume === 0) {
      this.isMuted = false;
      this.audio.muted = false;
      this.setVolume(this.previousVolume || 0.8);
    } else {
      this.previousVolume = this.volume;
      this.isMuted = true;
      this.audio.muted = true;
      this.audio.volume = 0;
      this.emit('volumechange', { volume: 0, muted: true });
    }
  }

  toggleShuffle() {
    this.isShuffle = !this.isShuffle;
    if (this.isShuffle) {
      this.applyShuffle(this.currentSong ? this.currentSong.id : null);
    } else {
      // restore original order
      const curId = this.currentSong ? this.currentSong.id : null;
      this.queue = [...this.originalQueue];
      if (curId) {
        this.currentIndex = this.queue.findIndex(s => s.id === curId);
      }
    }
    this.emit('shufflechange', this.isShuffle);
  }

  applyShuffle(keepSongId = null) {
    const list = [...this.originalQueue];
    // Fisher-Yates shuffle
    for (let i = list.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [list[i], list[j]] = [list[j], list[i]];
    }

    if (keepSongId) {
      const current = list.find(s => s.id === keepSongId);
      const remaining = list.filter(s => s.id !== keepSongId);
      if (current) {
        this.queue = [current, ...remaining];
        this.currentIndex = 0;
        return;
      }
    }
    this.queue = list;
    this.currentIndex = 0;
  }

  toggleRepeat() {
    if (this.repeatMode === 'off') {
      this.repeatMode = 'all';
    } else if (this.repeatMode === 'all') {
      this.repeatMode = 'one';
    } else {
      this.repeatMode = 'off';
    }
    this.emit('repeatchange', this.repeatMode);
  }

  // Liked Songs Management
  toggleLike(songId) {
    const id = Number(songId);
    let isLiked = false;
    if (this.likedSongIds.has(id)) {
      this.likedSongIds.delete(id);
      isLiked = false;
    } else {
      this.likedSongIds.add(id);
      isLiked = true;
    }
    localStorage.setItem('vspotify_liked', JSON.stringify([...this.likedSongIds]));
    this.emit('likechange', { songId: id, isLiked });
    return isLiked;
  }

  isSongLiked(songId) {
    return this.likedSongIds.has(Number(songId));
  }

  getLikedSongs() {
    return this.songs.filter(s => this.likedSongIds.has(s.id));
  }

  // Recently Played
  recordRecentlyPlayed(songId) {
    const id = Number(songId);
    this.recentlyPlayedIds = this.recentlyPlayedIds.filter(item => item !== id);
    this.recentlyPlayedIds.unshift(id);
    if (this.recentlyPlayedIds.length > 20) {
      this.recentlyPlayedIds.pop();
    }
    localStorage.setItem('vspotify_recent', JSON.stringify(this.recentlyPlayedIds));
    this.emit('recentchange', this.recentlyPlayedIds);
  }

  getRecentlyPlayed() {
    return this.recentlyPlayedIds
      .map(id => this.songs.find(s => s.id === id))
      .filter(Boolean);
  }

  // Override Audio URL for a song (User Feature)
  setCustomAudio(songId, newUrl, customName = null) {
    const id = Number(songId);
    const overrides = JSON.parse(localStorage.getItem('vspotify_custom_audio') || '{}');
    overrides[id] = { url: newUrl, customName: customName || 'Custom Audio' };
    localStorage.setItem('vspotify_custom_audio', JSON.stringify(overrides));

    // Update in-memory songs
    this.songs = getSongsList();
    this.queue = this.queue.map(s => (s.id === id ? { ...s, url: newUrl, isCustomAudio: true } : s));
    this.originalQueue = this.originalQueue.map(s => (s.id === id ? { ...s, url: newUrl, isCustomAudio: true } : s));

    if (this.currentSong && this.currentSong.id === id) {
      this.currentSong.url = newUrl;
      this.audio.src = newUrl;
      if (this.isPlaying) {
        this.audio.play();
      }
    }
    this.emit('songsupdated', this.songs);
  }

  resetCustomAudio(songId) {
    const id = Number(songId);
    const overrides = JSON.parse(localStorage.getItem('vspotify_custom_audio') || '{}');
    delete overrides[id];
    localStorage.setItem('vspotify_custom_audio', JSON.stringify(overrides));

    this.songs = getSongsList();
    this.emit('songsupdated', this.songs);
  }
}
