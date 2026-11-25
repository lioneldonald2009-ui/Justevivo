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
      '<p data-jv-playback-status role="status" aria-live="polite">Lecteur vidéo prêt · MP4, MOV et WebM selon les codecs du navigateur.</p>',
      '<div class="jv-transport-stream"><input type="url" data-jv-stream-url inputmode="url" placeholder="URL vidéo MP4, HLS (.m3u8) ou DASH (.mpd)" aria-label="Adresse d’une vidéo en ligne"><button type="button" data-jv-load-stream>Lire l’URL</button></div>',
      '<details class="jv-shortcuts"><summary>Raccourcis clavier</summary><p><kbd>Espace</kbd> Lecture/pause · <kbd>J</kbd>/<kbd>L</kbd> −/+ 5 s · <kbd>←</kbd>/<kbd>→</kbd> −/+ 1 s · <kbd>M</kbd> Son · <kbd>F</kbd> Plein écran</p></details>'
    ].join('');
    frame.insertAdjacentElement('afterend', toolbar);
    const playbackStyle = document.createElement('style');
    playbackStyle.textContent = `
      .jv-transport{display:grid;gap:10px;margin:10px 0;padding:12px;border:1px solid rgba(120,130,160,.22);border-radius:14px;background:rgba(120,130,160,.06)}
      .jv-transport-main,.jv-transport-meta,.jv-transport-stream{display:flex;align-items:center;gap:8px;flex-wrap:wrap}
      .jv-transport-main button,.jv-transport-stream button{min-height:36px;padding:7px 12px;border:1px solid #cfc7b8;border-radius:9px;background:#fff;color:#26364f;font-weight:700;cursor:pointer}
      .jv-transport-main button:disabled,.jv-transport-stream button:disabled{opacity:.55;cursor:wait}
      .jv-transport-meta{justify-content:space-between;font-size:12px}
      .jv-transport-meta select,.jv-transport-stream input{min-height:36px;padding:7px 9px;border:1px solid #d6d0c5;border-radius:9px;background:#fff;color:#26364f;max-width:100%}
      .jv-transport-stream input{flex:1 1 220px;min-width:0}
      [data-jv-playback-status]{margin:0;font-size:12px;line-height:1.45;color:inherit;opacity:.82}
      .jv-shortcuts{font-size:12px}.jv-shortcuts p{line-height:1.6}
    `;
    document.head.appendChild(playbackStyle);

    const timeLabel = toolbar.querySelector('[data-jv-time]');
    const speed = toolbar.querySelector('[data-jv-speed]');
    const playbackStatus = toolbar.querySelector('[data-jv-playback-status]');
    const setPlaybackStatus = message => { if (playbackStatus) playbackStatus.textContent = message; };
    const streamInput = toolbar.querySelector('[data-jv-stream-url]');
    const streamButton = toolbar.querySelector('[data-jv-load-stream]');
    let hlsEngine = null;
    let dashEngine = null;
    const loadScript = (src, ready) => new Promise((resolve, reject) => {
      if (ready()) { resolve(); return; }
      const existing = document.querySelector('script[data-jv-engine="' + src + '"]');
      if (existing) {
        existing.addEventListener('load', resolve, {once:true});
        existing.addEventListener('error', () => reject(new Error('Moteur de lecture indisponible.')), {once:true});
        return;
      }
      const script = document.createElement('script');
      script.src = src;
      script.async = true;
      script.dataset.jvEngine = src;
      script.onload = resolve;
      script.onerror = () => reject(new Error('Impossible de charger le moteur de lecture. Vérifiez votre connexion.'));
      document.head.appendChild(script);
    });
    const releaseStreamEngines = () => {
      if (hlsEngine) { try { hlsEngine.destroy(); } catch (_) {} hlsEngine = null; }
      if (dashEngine) { try { dashEngine.reset(); } catch (_) {} dashEngine = null; }
    };
    const setPlaybackSource = async rawUrl => {
      const url = String(rawUrl || '').trim();
      if (!/^https?:\/\//i.test(url)) throw new Error('Saisissez une URL vidéo commençant par http:// ou https://.');
      releaseStreamEngines();
      video.pause();
      video.removeAttribute('src');
      video.load();
      const cleanUrl = url.split(/[?#]/)[0].toLowerCase();
      if (cleanUrl.endsWith('.m3u8')) {
        if (video.canPlayType('application/vnd.apple.mpegurl')) {
          video.src = url;
          video.load();
        } else {
          await loadScript('https://cdn.jsdelivr.net/npm/hls.js@1.6.15/dist/hls.min.js', () => !!window.Hls);
          if (!window.Hls.isSupported()) throw new Error('HLS n’est pas pris en charge sur cet appareil.');
          hlsEngine = new window.Hls({enableWorker:true});
          hlsEngine.attachMedia(video);
          hlsEngine.on(window.Hls.Events.MEDIA_ATTACHED, () => hlsEngine && hlsEngine.loadSource(url));
          hlsEngine.on(window.Hls.Events.ERROR, (_, data) => {
            if (data && data.fatal) setPlaybackStatus('Erreur HLS : vérifiez l’URL et les autorisations CORS du serveur vidéo.');
          });
        }
        setPlaybackStatus('Moteur HLS activé. Chargement du flux…');
      } else if (cleanUrl.endsWith('.mpd')) {
        await loadScript('https://cdn.dashjs.org/latest/dash.all.min.js', () => !!window.dashjs);
        dashEngine = window.dashjs.MediaPlayer().create();
        dashEngine.initialize(video, url, false);
        dashEngine.on(window.dashjs.MediaPlayer.events.ERROR, () => setPlaybackStatus('Erreur DASH : vérifiez l’URL et les autorisations CORS du serveur vidéo.'));
        setPlaybackStatus('Moteur MPEG-DASH activé. Chargement du flux…');
      } else {
        video.src = url;
        video.load();
        setPlaybackStatus('Lecteur HTML5 activé. Chargement de la vidéo…');
      }
      return true;
    };
    window.JVSetPlaybackSource = setPlaybackSource;
    input.addEventListener('change', () => {
      releaseStreamEngines();
      if (video.currentSrc && video.currentSrc.startsWith('blob:')) setPlaybackStatus('Média locale prêt pour lecture.');
    });
    const waitForMetadata = () => {
      if (video.readyState >= 1) return Promise.resolve();
      return new Promise((resolve, reject) => {
        const timer = setTimeout(() => { cleanup(); reject(new Error('Délai dépassé pendant le chargement du flux vidéo.')); }, 20000);
        const cleanup = () => {
          clearTimeout(timer);
          video.removeEventListener('loadedmetadata', onReady);
          video.removeEventListener('error', onError);
        };
        const onReady = () => { cleanup(); resolve(); };
        const onError = () => { cleanup(); reject(new Error('Le flux ne peut pas être décodé par ce navigateur.')); };
        video.addEventListener('loadedmetadata', onReady, {once:true});
        video.addEventListener('error', onError, {once:true});
      });
    };
    streamButton.addEventListener('click', async () => {
      streamButton.disabled = true;
      try {
        await setPlaybackSource(streamInput.value);
        await waitForMetadata();
        await video.play();
      } catch (error) {
        setPlaybackStatus(error.message || 'Impossible de lire cette adresse vidéo.');
      } finally { streamButton.disabled = false; }
    });
    video.playsInline = true;
    video.preload = 'metadata';
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
    const togglePlay = async () => {
      if (!video.currentSrc && !video.getAttribute('src')) {
        setPlaybackStatus('Importez une vidéo pour démarrer la lecture.');
        input.click();
        return;
      }
      if (!video.paused) { video.pause(); return; }
      try {
        await video.play();
        setPlaybackStatus('Lecture en cours.');
      } catch (error) {
        const message = error && error.name === 'NotAllowedError'
          ? 'Lecture bloquée par le navigateur : appuyez directement sur ▶ dans la vidéo.'
          : 'Lecture impossible. Vérifiez le format et le codec de cette vidéo.';
        setPlaybackStatus(message);
      }
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
    video.addEventListener('play', () => {
      toolbar.querySelector('[data-jv-action="play"]').textContent = 'Ⅱ';
      setPlaybackStatus('Lecture en cours.');
    });
    video.addEventListener('pause', () => {
      toolbar.querySelector('[data-jv-action="play"]').textContent = '▶';
      if (video.currentSrc) setPlaybackStatus('Lecture en pause.');
    });
    video.addEventListener('ended', () => setPlaybackStatus('Lecture terminée.'));
    video.addEventListener('loadedmetadata', () => setPlaybackStatus('Vidéo chargée · ' + Math.round(video.videoWidth) + ' × ' + Math.round(video.videoHeight) + '.'));
    video.addEventListener('error', () => {
      const code = video.error && video.error.code;
      const messages = {
        1: 'Chargement vidéo interrompu.',
        2: 'Erreur réseau pendant le chargement de la vidéo.',
        3: 'Le navigateur ne parvient pas à décoder cette vidéo.',
        4: 'Format ou codec non pris en charge par ce navigateur.'
      };
      setPlaybackStatus(messages[code] || 'Erreur de lecture vidéo. Essayez un MP4 H.264 avec audio AAC.');
    });
    video.addEventListener('waiting', () => setPlaybackStatus('Chargement de la vidéo…'));
    video.addEventListener('stalled', () => setPlaybackStatus('Lecture en attente de données vidéo.'));
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
      if (!video.currentSrc && !video.getAttribute('src')) return;
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

    const acceptsMedia = file => file && (file.type.startsWith('video/') || file.type.startsWith('image/') || /\.(mp4|mov|webm|m4v|ogg|png|jpe?g|webp|gif|avif)$/i.test(file.name || ''));
    ['dragenter', 'dragover'].forEach(name => frame.addEventListener(name, event => {
      event.preventDefault(); frame.classList.add('jv-drop-active');
    }));
    ['dragleave', 'drop'].forEach(name => frame.addEventListener(name, event => {
      event.preventDefault(); frame.classList.remove('jv-drop-active');
    }));
    frame.addEventListener('drop', event => {
      const files = Array.from(event.dataTransfer?.files || []).filter(acceptsMedia);
      if (!files.length) return;
      try {
        const transfer = new DataTransfer();
        files.forEach(file => transfer.items.add(file));
        input.files = transfer.files;
        input.dispatchEvent(new Event('change', { bubbles: true }));
      } catch (_) {
        const note = document.getElementById('fileName');
        if (note) note.textContent = 'Utilisez la zone « Déposez votre vidéo ici » pour importer ce fichier.';
      }
    });
    frame.setAttribute('aria-label', 'Aperçu vidéo ou photo. Déposez un ou plusieurs médias ici pour les importer.');
    initMediaBin(input, panel);
    updateTime();
    window.addEventListener('pagehide', releaseStreamEngines, { once: true });
  };

  // Chutier multi-médias local : les fichiers restent sur l'appareil (IndexedDB).
  // La sélection d'une vidéo réutilise le flux de changement historique de app.js.
  function initMediaBin(input, previewPanel) {
    if (previewPanel.querySelector('#jvMediaBin')) return;
    const DB_NAME = 'justevivo-media-bin-v1';
    const STORE = 'media';
    const MAX_ITEMS = 40;
    let items = [];
    let activeId = '';
    let dispatchingSelection = false;
    let dbPromise = null;

    const isVideo = file => file && (file.type.startsWith('video/') || /\.(mp4|mov|webm|m4v|ogg)$/i.test(file.name || ''));
    const isImage = file => file && (file.type.startsWith('image/') || /\.(png|jpe?g|webp|gif|avif)$/i.test(file.name || ''));
    const supported = file => isVideo(file) || isImage(file);
    const makeId = () => 'm_' + Date.now().toString(36) + '_' + Math.random().toString(36).slice(2, 8);
    const safeName = value => String(value || 'Média').replace(/[<>]/g, '').slice(0, 90);

    const bin = document.createElement('section');
    bin.id = 'jvMediaBin';
    bin.className = 'jv-media-bin';
    bin.setAttribute('aria-label', 'Chutier des médias importés');
    bin.innerHTML = '<div class="jv-media-bin-head"><div><strong>Chutier de médias</strong><span data-jv-bin-count>0 média</span></div><div class="jv-media-bin-actions"><button type="button" data-jv-add>＋ Ajouter</button><button type="button" data-jv-clear>Vider</button></div></div><div class="jv-media-bin-list" data-jv-bin-list></div><p class="jv-media-bin-note" data-jv-bin-note>Importez plusieurs vidéos et photos. Les fichiers restent enregistrés sur cet appareil.</p>';
    const note = previewPanel.querySelector('#fileName');
    if (note) note.insertAdjacentElement('afterend', bin);
    else previewPanel.appendChild(bin);
    const list = bin.querySelector('[data-jv-bin-list]');
    const count = bin.querySelector('[data-jv-bin-count]');
    const status = bin.querySelector('[data-jv-bin-note]');

    const picker = document.createElement('input');
    picker.type = 'file';
    picker.accept = input.accept || 'video/*,image/*';
    picker.multiple = true;
    picker.hidden = true;
    bin.appendChild(picker);
    bin.querySelector('[data-jv-add]').addEventListener('click', () => picker.click());
    bin.querySelector('[data-jv-clear]').addEventListener('click', clearAll);
    picker.addEventListener('change', () => {
      const files = Array.from(picker.files || []);
      if (files.length) addFiles(files);
      picker.value = '';
    });

    function openDB() {
      if (!('indexedDB' in window)) return Promise.reject(new Error('IndexedDB indisponible'));
      if (dbPromise) return dbPromise;
      dbPromise = new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, 1);
        request.onupgradeneeded = () => {
          const db = request.result;
          if (!db.objectStoreNames.contains(STORE)) db.createObjectStore(STORE, { keyPath: 'id' });
        };
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error || new Error('Ouverture du chutier impossible'));
      });
      return dbPromise;
    }

    async function dbRun(mode, action) {
      const db = await openDB();
      return new Promise((resolve, reject) => {
        const tx = db.transaction(STORE, mode);
        const store = tx.objectStore(STORE);
        let request;
        try { request = action(store); } catch (error) { reject(error); return; }
        tx.oncomplete = () => resolve(request ? request.result : true);
        tx.onerror = tx.onabort = () => reject(tx.error || new Error('Écriture du chutier impossible'));
      });
    }

    async function persist(item) {
      try {
        await dbRun('readwrite', store => store.put({
          id: item.id, file: item.file, name: item.name, type: item.type,
          size: item.size, lastModified: item.lastModified, order: item.order
        }));
      } catch (error) {
        status.textContent = 'Le stockage local est indisponible : les médias resteront dans cette session uniquement.';
        console.warn('JUSTEVIVO media bin persistence:', error);
      }
    }

    async function removePersisted(id) {
      try { await dbRun('readwrite', store => store.delete(id)); } catch (_) {}
    }

    async function createThumbnail(item) {
      if (item.type === 'image') { item.thumbUrl = item.url; return; }
      const video = document.createElement('video');
      video.muted = true;
      video.playsInline = true;
      video.preload = 'metadata';
      video.src = item.url;
      try {
        await new Promise((resolve, reject) => {
          const timer = setTimeout(() => reject(new Error('Miniature vidéo expirée')), 7000);
          video.addEventListener('loadedmetadata', () => { clearTimeout(timer); resolve(); }, { once: true });
          video.addEventListener('error', () => { clearTimeout(timer); reject(new Error('Vidéo illisible')); }, { once: true });
        });
        if (video.duration > 0.2) {
          video.currentTime = Math.min(0.25, video.duration / 3);
          await new Promise(resolve => {
            const timer = setTimeout(resolve, 1800);
            video.addEventListener('seeked', () => { clearTimeout(timer); resolve(); }, { once: true });
          });
        }
        const canvas = document.createElement('canvas');
        canvas.width = 160;
        canvas.height = 100;
        const ctx = canvas.getContext('2d');
        if (ctx && video.videoWidth) {
          const scale = Math.max(canvas.width / video.videoWidth, canvas.height / video.videoHeight);
          const w = video.videoWidth * scale, h = video.videoHeight * scale;
          ctx.drawImage(video, (canvas.width - w) / 2, (canvas.height - h) / 2, w, h);
          item.thumbUrl = canvas.toDataURL('image/jpeg', 0.72);
        }
      } catch (_) {
        item.thumbUrl = '';
      } finally {
        video.pause();
        video.removeAttribute('src');
        video.load();
      }
    }

    function render() {
      list.replaceChildren();
      count.textContent = items.length + (items.length > 1 ? ' médias' : ' média');
      bin.classList.toggle('is-empty', items.length === 0);
      items.forEach((item, index) => {
        const card = document.createElement('article');
        card.className = 'jv-media-card' + (item.id === activeId ? ' is-active' : '');
        const select = document.createElement('button');
        select.type = 'button';
        select.className = 'jv-media-select';
        select.setAttribute('aria-pressed', String(item.id === activeId));
        select.setAttribute('aria-label', 'Sélectionner ' + safeName(item.name));
        const thumb = document.createElement('span');
        thumb.className = 'jv-media-thumb';
        if (item.thumbUrl) {
          const image = document.createElement('img');
          image.src = item.thumbUrl;
          image.alt = '';
          image.loading = 'lazy';
          thumb.appendChild(image);
        } else {
          thumb.textContent = item.type === 'video' ? '▶' : '▧';
        }
        const meta = document.createElement('span');
        meta.className = 'jv-media-meta';
        const name = document.createElement('strong');
        name.textContent = safeName(item.name);
        const detail = document.createElement('small');
        detail.textContent = (item.type === 'video' ? 'VIDÉO' : 'PHOTO') + ' · ' + formatSize(item.size);
        meta.append(name, detail);
        select.append(thumb, meta);
        select.addEventListener('click', () => selectItem(item.id));
        const actions = document.createElement('div');
        actions.className = 'jv-media-card-actions';
        const up = actionButton('↑', 'Monter', () => moveItem(index, -1));
        const down = actionButton('↓', 'Descendre', () => moveItem(index, 1));
        const replace = actionButton('↻', 'Remplacer ' + safeName(item.name), () => replaceItem(item.id));
        const remove = actionButton('×', 'Supprimer ' + safeName(item.name), () => removeItem(item.id));
        up.disabled = index === 0;
        down.disabled = index === items.length - 1;
        actions.append(up, down, replace, remove);
        card.append(select, actions);
        list.appendChild(card);
      });
    }

    function actionButton(label, title, callback) {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'jv-media-action';
      button.textContent = label;
      button.title = title;
      button.setAttribute('aria-label', title);
      button.addEventListener('click', callback);
      return button;
    }

    function formatSize(bytes) {
      const value = Number(bytes) || 0;
      return value < 1024 * 1024 ? Math.max(1, Math.round(value / 1024)) + ' Ko' : (value / (1024 * 1024)).toFixed(1) + ' Mo';
    }

    function setInputFile(file) {
      try {
        const transfer = new DataTransfer();
        transfer.items.add(file);
        dispatchingSelection = true;
        input.files = transfer.files;
        input.dispatchEvent(new Event('change', { bubbles: true }));
        dispatchingSelection = false;
        return true;
      } catch (error) {
        dispatchingSelection = false;
        return false;
      }
    }

    function selectItem(id) {
      const item = items.find(entry => entry.id === id);
      if (!item) return;
      activeId = id;
      try { localStorage.setItem('justevivo_media_bin_active_v1', id); } catch (_) {}
      if (item.type === 'video') {
        if (!setInputFile(item.file) && typeof window.attachProjectVideo === 'function') {
          window.attachProjectVideo(item.file);
        }
        status.textContent = 'Vidéo active : ' + safeName(item.name) + '. Les outils vidéo sont disponibles.';
      } else {
        input.value = '';
        if (typeof window.attachProjectPhoto === 'function') window.attachProjectPhoto(item.file, item.url);
        status.textContent = 'Photo active : ' + safeName(item.name) + '. La prévisualisation photo est disponible.';
      }
      render();
    }

    async function addFiles(files) {
      const valid = files.filter(supported);
      if (!valid.length) {
        status.textContent = 'Formats acceptés : vidéos MP4, MOV, WebM et photos JPG, PNG, WebP, GIF, AVIF.';
        return;
      }
      const added = [];
      for (const file of valid) {
        if (items.length >= MAX_ITEMS) break;
        const duplicate = items.some(item => item.name === file.name && item.size === file.size && item.lastModified === file.lastModified);
        if (duplicate) continue;
        const item = {
          id: makeId(), file, name: file.name, type: isVideo(file) ? 'video' : 'image',
          size: file.size, lastModified: file.lastModified || 0,
          order: items.length, url: URL.createObjectURL(file), thumbUrl: ''
        };
        items.push(item);
        added.push(item);
        await createThumbnail(item);
        await persist(item);
      }
      items.forEach((item, index) => { item.order = index; });
      render();
      if (added.length) {
        status.textContent = added.length + ' média(s) ajouté(s) au chutier.';
        selectItem(added[0].id);
      } else if (valid.length) {
        status.textContent = items.length >= MAX_ITEMS ? 'Limite de ' + MAX_ITEMS + ' médias atteinte.' : 'Ces fichiers sont déjà dans le chutier.';
      }
    }

    async function replaceItem(id) {
      const item = items.find(entry => entry.id === id);
      if (!item) return;
      const replacePicker = document.createElement('input');
      replacePicker.type = 'file';
      replacePicker.accept = input.accept;
      replacePicker.hidden = true;
      bin.appendChild(replacePicker);
      replacePicker.addEventListener('cancel', () => replacePicker.remove(), { once: true });
      replacePicker.addEventListener('change', async () => {
        const file = replacePicker.files && replacePicker.files[0];
        if (!file || !supported(file)) { replacePicker.remove(); return; }
        URL.revokeObjectURL(item.url);
        item.file = file;
        item.name = file.name;
        item.type = isVideo(file) ? 'video' : 'image';
        item.size = file.size;
        item.lastModified = file.lastModified || 0;
        item.url = URL.createObjectURL(file);
        item.thumbUrl = '';
        await createThumbnail(item);
        await persist(item);
        render();
        if (activeId === id) selectItem(id);
        replacePicker.remove();
      }, { once: true });
      replacePicker.click();
    }

    async function moveItem(index, delta) {
      const target = index + delta;
      if (target < 0 || target >= items.length) return;
      const [item] = items.splice(index, 1);
      items.splice(target, 0, item);
      items.forEach((entry, order) => { entry.order = order; persist(entry); });
      render();
    }

    async function removeItem(id) {
      const index = items.findIndex(entry => entry.id === id);
      if (index < 0) return;
      const [removed] = items.splice(index, 1);
      URL.revokeObjectURL(removed.url);
      await removePersisted(id);
      if (activeId === id) {
        activeId = '';
        if (items.length) selectItem(items[Math.min(index, items.length - 1)].id);
        else if (typeof window.detachProjectMedia === 'function') window.detachProjectMedia();
      }
      render();
    }

    async function clearAll() {
      if (!items.length) return;
      if (!window.confirm('Vider le chutier et retirer tous les médias importés ?')) return;
      items.forEach(item => URL.revokeObjectURL(item.url));
      items = [];
      activeId = '';
      try { localStorage.removeItem('justevivo_media_bin_active_v1'); } catch (_) {}
      try { await dbRun('readwrite', store => store.clear()); } catch (_) {}
      if (typeof window.detachProjectMedia === 'function') window.detachProjectMedia();
      input.value = '';
      render();
      status.textContent = 'Chutier vidé. Les ressources temporaires ont été libérées.';
    }

    input.addEventListener('change', () => {
      if (dispatchingSelection) return;
      const files = Array.from(input.files || []);
      if (files.length) addFiles(files);
    });

    async function restore() {
      try {
        const records = await dbRun('readonly', store => store.getAll());
        records.sort((a, b) => (a.order || 0) - (b.order || 0));
        for (const record of records.slice(0, MAX_ITEMS)) {
          const file = record.file instanceof File ? record.file : new File([record.file], record.name, { type: record.type, lastModified: record.lastModified || Date.now() });
          const item = {
            id: record.id, file, name: record.name, type: record.type,
            size: record.size, lastModified: record.lastModified || 0,
            order: items.length, url: URL.createObjectURL(file), thumbUrl: ''
          };
          items.push(item);
          await createThumbnail(item);
        }
        render();
        let remembered = '';
        try { remembered = localStorage.getItem('justevivo_media_bin_active_v1') || ''; } catch (_) {}
        if (items.length) selectItem(items.some(item => item.id === remembered) ? remembered : items[0].id);
      } catch (error) {
        status.textContent = 'Le chutier local sera disponible après le premier import.';
        console.warn('JUSTEVIVO media bin restore:', error);
      }
    }

    window.JV_MEDIA_BIN = {
      getItems: () => items.map(item => ({ id: item.id, name: item.name, type: item.type, size: item.size, order: item.order })),
      getActive: () => items.find(item => item.id === activeId) || null,
      select: selectItem,
      clearAll
    };
    restore();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once: true });
  else init();
})();
