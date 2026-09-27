/**
 * ==============================================================================
 * VISHNUHARAN'S SPOTIFY - MAIN APPLICATION ENTRY POINT
 * ==============================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Core Player and UI
  const player = new AudioPlayer();
  const ui = new UIEngine(player);

  // Global Keyboard Shortcuts
  window.addEventListener('keydown', (e) => {
    // Ignore keystrokes when typing inside inputs or textareas
    const activeTag = document.activeElement ? document.activeElement.tagName.toLowerCase() : '';
    if (activeTag === 'input' || activeTag === 'textarea' || activeTag === 'select') {
      return;
    }

    switch (e.code) {
      case 'Space':
        e.preventDefault();
        player.togglePlay();
        break;

      case 'ArrowRight':
        e.preventDefault();
        if (player.audio.duration) {
          player.audio.currentTime = Math.min(player.audio.duration, player.audio.currentTime + 5);
        }
        break;

      case 'ArrowLeft':
        e.preventDefault();
        if (player.audio.duration) {
          player.audio.currentTime = Math.max(0, player.audio.currentTime - 5);
        }
        break;

      case 'ArrowUp':
        e.preventDefault();
        player.setVolume(Math.min(1, player.volume + 0.05));
        break;

      case 'ArrowDown':
        e.preventDefault();
        player.setVolume(Math.max(0, player.volume - 0.05));
        break;

      case 'KeyM':
        e.preventDefault();
        player.toggleMute();
        break;

      case 'KeyL':
        e.preventDefault();
        if (player.currentSong) {
          player.toggleLike(player.currentSong.id);
        }
        break;

      case 'KeyN':
        e.preventDefault();
        player.next();
        break;

      case 'KeyP':
        e.preventDefault();
        player.prev();
        break;

      case 'KeyS':
        e.preventDefault();
        player.toggleShuffle();
        break;

      case 'KeyR':
        e.preventDefault();
        player.toggleRepeat();
        break;

      case 'Slash':
        e.preventDefault();
        const searchInput = document.getElementById('global-search-input');
        if (searchInput) {
          searchInput.focus();
        }
        break;

      case 'Escape':
        ui.closeAllModals();
        break;
    }
  });

  // Expose to window for debugging or developer interaction if desired
  window.vSpotify = {
    player,
    ui
  };

  console.log("🎵 Vishnuharan's Spotify is ready! Press Space to Play/Pause, N for Next, P for Prev, L to Like.");
});
