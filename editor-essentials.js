/* JUSTEVIVO — Editor Essentials
   Outils locaux, sans service externe : raccourcis, transport vidéo, vitesse et import par glisser-déposer. */
(() => {
  'use strict';
  const init = () => {
    const video = document.getElementById('videoPreview');
    const input = document.getElementById('videoInput');
    const frame = document.getElementById('previewFrame');
    const panel = document.querySelector('.preview-panel');
    if (!video || !input || !frame || !panel || panel.dataset.jvEssentials === '1') return;
    panel.dataset.jvEssentials = '1';

    const toolbar = document.createElement('div');
    toolbar.className = 'jv-transport';
    toolbar.setAttribute('aria-label', 'Commandes de lecture');
    toolbar.innerHTML = [
      '<div class="jv-transport-main">',
      '<button type="button" data-jv-action="back" aria-label="Reculer de cinq secondes" title="Reculer de 5 s (J)">−5 s</button>',
      '<button type="button" data-jv-action="play" class="jv-transport-play" aria-label="Lire ou mettre en pause" title="Lecture / pause (Espace)">▶</button>',
      '<button type="button" data-jv-action="forward" aria-label="Avancer de cinq secondes" title="Avancer de 5 s (L)">+5 s</button>',
      '<button type="button" data-jv-action="mute" aria-label="Activer ou couper le son" title="Son (M)">Son</button>',
      '<button type="button" data-jv-action="fullscreen" aria-label="Plein écran" title="Plein écran (F)">⛶</button>',
      '</div>',
      '<div class="jv-transport-meta"><label>Vitesse <select data-jv-speed aria-label="Vitesse de lecture"><option value=".5">0,5×</option><option value=".75">0,75×</option><option value="1" selected>1×</option><option value="1.25">1,25×</option><option value="1.5">1,5×</option><option value="2">2×</option></select></label><span data-jv-time>00:00 / 00:00</span></div>',
      '<details class="jv-shortcuts"><summary>Raccourcis clavier</summary><p><kbd>Espace</kbd> Lecture/pause · <kbd>J</kbd>/<kbd>L</kbd> −/+ 5 s · <kbd>←</kbd>/<kbd>→</kbd> −/+ 1 s · <kbd>M</kbd> Son · <kbd>F</kbd> Plein écran</p></details>'
    ].join('');
    frame.insertAdjacentElement('afterend', toolbar);

    const timeLabel = toolbar.querySelector('[data-jv-time]');
    const speed = toolbar.querySelector('[data-jv-speed]');
    const format = value => {
      if (!Number.isFinite(value)) return '00:00';
      const s = Math.max(0, Math.floor(value));
      return String(Math.floor(s / 60)).padStart(2, '0') + ':' + String(s % 60).padStart(2, '0');
    };
    const updateTime = () => { timeLabel.textContent = format(video.currentTime) + ' / ' + format(video.duration); };
    const seek = delta => {
      if (!Number.isFinite(video.duration)) return;
      video.currentTime = Math.min(video.duration, Math.max(0, video.currentTime + delta));
    };
    const togglePlay = () => {
      if (!video.src && !video.currentSrc) { input.click(); return; }
      if (video.paused) video.play().catch(() => {}); else video.pause();
    };
    const actions = {
      back: () => seek(-5),
      forward: () => seek(5),
      play: togglePlay,
      mute: () => { video.muted = !video.muted; },
      fullscreen: () => {
        const target = frame;
        if (document.fullscreenElement) document.exitFullscreen?.();
        else target.requestFullscreen?.();
      }
    };
    toolbar.addEventListener('click', event => {
      const button = event.target.closest('[data-jv-action]');
      if (button) actions[button.dataset.jvAction]?.();
    });
    speed.addEventListener('change', () => { video.playbackRate = Number(speed.value) || 1; });
    ['timeupdate', 'durationchange', 'loadedmetadata', 'seeked'].forEach(name => video.addEventListener(name, updateTime));
    video.addEventListener('play', () => { toolbar.querySelector('[data-jv-action="play"]').textContent = 'Ⅱ'; });
    video.addEventListener('pause', () => { toolbar.querySelector('[data-jv-action="play"]').textContent = '▶'; });
    video.addEventListener('volumechange', () => {
      const button = toolbar.querySelector('[data-jv-action="mute"]');
      button.textContent = video.muted ? 'Muet' : 'Son';
      button.setAttribute('aria-pressed', String(video.muted));
    });
    video.addEventListener('loadedmetadata', updateTime);

    document.addEventListener('keydown', event => {
      if (event.defaultPrevented || event.ctrlKey || event.metaKey || event.altKey) return;
      const target = event.target;
      if (target && (target.isContentEditable || /INPUT|TEXTAREA|SELECT|BUTTON/.test(target.tagName))) return;
      if (!video.src && !video.currentSrc) return;
      const key = event.key.toLowerCase();
      const map = {
        ' ': () => togglePlay(),
        'j': () => seek(-5),
        'l': () => seek(5),
        'arrowleft': () => seek(-1),
        'arrowright': () => seek(1),
        'm': actions.mute,
        'f': actions.fullscreen
      };
      if (map[key]) { event.preventDefault(); map[key](); }
    });

    const acceptsVideo = file => file && (file.type.startsWith('video/') || /\.(mp4|mov|webm|m4v|ogg)$/i.test(file.name || ''));
    ['dragenter', 'dragover'].forEach(name => frame.addEventListener(name, event => {
      event.preventDefault(); frame.classList.add('jv-drop-active');
    }));
    ['dragleave', 'drop'].forEach(name => frame.addEventListener(name, event => {
      event.preventDefault(); frame.classList.remove('jv-drop-active');
    }));
    frame.addEventListener('drop', event => {
      const file = Array.from(event.dataTransfer?.files || []).find(acceptsVideo);
      if (!file) return;
      try {
        const transfer = new DataTransfer();
        transfer.items.add(file);
        input.files = transfer.files;
        input.dispatchEvent(new Event('change', { bubbles: true }));
      } catch (_) {
        const note = document.getElementById('fileName');
        if (note) note.textContent = 'Utilisez la zone « Déposez votre vidéo ici » pour importer ce fichier.';
      }
    });
    frame.setAttribute('aria-label', 'Aperçu vidéo. Déposez un fichier vidéo ici pour l’importer.');
    updateTime();
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once: true });
  else init();
})();
