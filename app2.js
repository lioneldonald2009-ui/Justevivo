// ===== JUSTEVIVO · PARTIE 2 sur 2 · fichier app2.js =====
// Apparence des styles dans la vidéo exportée (dessin sur canvas)
const STYLE_BASE = {
  size: 23, weight: '800', family: "'DM Sans', Arial, sans-serif",
  c1: '#f7f7ff', c2: 'accent', upper: false,
  shadows: [{ c: '#000', x: 0, y: 3, b: 12 }]
};

const STYLE_CFG = {
  pop: {},
  neon: { c1: '#6ffaff', shadows: [{ c: '#3af7ff', x: 0, y: 0, b: 12 }] },
  clean: { weight: '600', box: { bg: 'rgba(0,0,0,0.6)', padX: 15, padY: 10, radius: 5 } },
  impact: { family: "Impact, 'Arial Black', sans-serif", upper: true, size: 26, c1: '#fff', stroke: 2, spacing: 1, shadows: [{ c: '#000', x: 0, y: 3, b: 0 }] },
  tiktok: { family: "'Arial Black', Arial, sans-serif", weight: '900', upper: true, c1: '#ffe600', c2: '#fff', stroke: 2, shadows: [{ c: '#000', x: 0, y: 4, b: 0 }] },
  boite: { c1: '#fff', c2: '#fff', box: { bg: 'accent', padX: 16, padY: 8, radius: 10 } },
  marker: { c1: '#fff', c2: '#000', marker: true, shadows: [{ c: '#000', x: 0, y: 2, b: 6 }] },
  retro3d: { family: "'Arial Black', Arial, sans-serif", upper: true, c1: '#fff', c2: '#fff', shadows: [{ c: 'accent', x: 3, y: 3, b: 0 }, { c: '#000', x: 6, y: 6, b: 0 }] },
  degrade: { weight: '900', grad: ['#ff5fa2', '#ffb347', '#41c7ff'], gradDir: 'h', shadows: [{ c: '#000', x: 0, y: 2, b: 4 }] },
  cinema: { family: 'Georgia, serif', weight: '400', size: 19, c1: '#fff', c2: '#fff', line2Weight: '700', spacing: 0.5, shadows: [{ c: '#000', x: 0, y: 2, b: 6 }, { c: '#000', x: 0, y: 0, b: 2 }] },
  machine: { family: "'Courier New', monospace", size: 17, c1: '#7dff9b', c2: '#7dff9b', box: { bg: 'rgba(0,0,0,0.8)', border: 'rgba(125,255,155,0.4)', padX: 14, padY: 8, radius: 0 } },
  comic: { family: "'Comic Sans MS', 'Chalkboard SE', cursive", weight: '900', upper: true, c1: '#fff', stroke: 3, shadows: [], rotate: -2 },
  rose: { c1: '#fff', c2: '#ffd1fb', shadows: [{ c: '#fff', x: 0, y: 0, b: 6 }, { c: '#ff3df0', x: 0, y: 0, b: 14 }, { c: '#ff3df0', x: 0, y: 0, b: 30 }] },
  verre: { weight: '700', c1: '#fff', c2: '#fff', box: { bg: 'rgba(255,255,255,0.15)', border: 'rgba(255,255,255,0.33)', padX: 16, padY: 8, radius: 14 } },
  fin: { weight: '300', size: 20, upper: true, c1: '#fff', line2Weight: '600', spacing: 2, shadows: [{ c: '#000', x: 0, y: 1, b: 4 }] },
  feu: { family: "Impact, 'Arial Black', sans-serif", upper: true, size: 26, grad: ['#fff200', '#ff6a00', '#e00000'], gradDir: 'v', shadows: [{ c: '#ff5a00', x: 0, y: 0, b: 8 }] },
  elegant: { family: 'Georgia, serif', weight: '400', italic: true, line2NoItalic: true, line2Weight: '700', c1: '#fff6e0', shadows: [{ c: '#000', x: 0, y: 2, b: 8 }] },
  contour: { weight: '900', upper: true, hollow: true, stroke: 1.5, shadows: [] },
  glace: { weight: '700', c1: '#dff6ff', c2: '#fff', shadows: [{ c: '#36bfff', x: 0, y: 0, b: 8 }, { c: '#36bfff', x: 0, y: 0, b: 20 }] },
  or: { family: 'Georgia, serif', weight: '900', size: 25, grad: ['#fff3b0', '#e0a800', '#8a5a00'], gradDir: 'v', shadows: [{ c: '#000', x: 0, y: 2, b: 3 }] },
  bande: { weight: '700', c1: '#fff', shadows: [], box: { bg: '#000', border: 'accent', padX: 22, padY: 8, radius: 2 } },
  ombre: { weight: '700', c1: '#fff', shadows: [{ c: '#000', x: 0, y: 6, b: 18 }, { c: '#000', x: 0, y: 2, b: 4 }] },
  neonvert: { c1: '#9dffb0', shadows: [{ c: '#3dff7a', x: 0, y: 0, b: 8 }, { c: '#3dff7a', x: 0, y: 0, b: 22 }] },
  neonjaune: { c1: '#fff9a8', shadows: [{ c: '#ffe600', x: 0, y: 0, b: 8 }, { c: '#ffe600', x: 0, y: 0, b: 22 }] },
  sunset: { weight: '900', grad: ['#ff9a3c', '#ff4e8b', '#a855f7'], gradDir: 'h', shadows: [{ c: '#000', x: 0, y: 2, b: 4 }] },
  ocean: { weight: '900', grad: ['#b6fff0', '#00e0c6', '#0088ff'], gradDir: 'v', shadows: [{ c: '#000', x: 0, y: 2, b: 4 }] },
  chrome: { weight: '900', grad: ['#fff', '#b8c4d6', '#5d6b82', '#c9d5e6'], gradDir: 'v', stroke: 1, strokeColor: '#1b2433', shadows: [{ c: '#000', x: 0, y: 2, b: 3 }] },
  sticker: { weight: '900', c1: '#111', c2: 'accent', stroke: 3, strokeColor: '#fff', shadows: [{ c: 'rgba(0,0,0,0.55)', x: 0, y: 4, b: 8 }] },
  jaune: { weight: '900', c1: '#000', c2: '#000', shadows: [], box: { bg: '#ffe600', padX: 14, padY: 6, radius: 4 } },
  blanc: { weight: '800', c1: '#111', c2: 'accent', shadows: [], box: { bg: '#fff', padX: 14, padY: 6, radius: 8 } },
  minimal: { weight: '500', size: 18, c1: '#fff', c2: '#fff', line2Weight: '700', shadows: [{ c: '#000', x: 0, y: 1, b: 4 }] },
  pixel: { family: "'Press Start 2P', monospace", weight: '400', size: 13, c1: '#ffe600', c2: '#fff', shadows: [{ c: '#000', x: 2, y: 2, b: 0 }] }
};

// ===== Audio : état =====
const DUCK_LEVEL = 0.35;

const MUSIC_TRACKS = [
  ['calm', 'Calme (doux)'],
  ['energy', 'Énergique (rythme)'],
  ['suspense', 'Suspense'],
  ['lofi', 'Lo-fi (détente)']
];

let musicBuffer = null;
let musicToken = 0;
let musicVolume = 0.3;
let voiceVolume = 1;
let duckOn = true;
let sfxVolume = 0.6;
let musicStart = 0;
let fadeIn = 0;
let fadeOut = 0;
let customVersion = 0;

const sfxChoice = { hook: 'none', zoom: 'none', cap: 'none' };
const customSfx = { hook: null, zoom: null, cap: null };
const credits = { music: null, hook: null, zoom: null, cap: null };

let pctx = null;
let pMusic = null;
let pSfxGain = null;
let sampleNode = null;
let sfxPrevT = null;
let sfxCacheKey = '';
let sfxCache = [];
let speechCache = { key: null, ranges: [] };
const builtinCache = {};
const noiseCache = new WeakMap();

function clamp01(x) {
  return Math.max(0, Math.min(1, x));
}

function fmtTime(sec) {
  const s = Math.max(0, Math.round(sec));
  return Math.floor(s / 60) + ':' + pad(s % 60);
}

function getPreviewCtx() {
  if (!pctx) {
    const AC = window.AudioContext || window.webkitAudioContext;
    pctx = new AC();
  }
  return pctx;
}

['pointerdown', 'touchstart', 'keydown'].forEach(evName => {
  document.addEventListener(evName, () => {
    try {
      const c = getPreviewCtx();
      if (c.state === 'suspended') c.resume();
    } catch (e) { /* son indisponible */ }
  }, { passive: true });
});

function decodeAudio(ctx, ab) {
  return new Promise((resolve, reject) => {
    const p = ctx.decodeAudioData(ab, resolve, reject);
    if (p && p.catch) p.catch(reject);
  });
}

// ===== Réglages : musique =====
const musicBox = makeSection('Musique de fond', false);

let musicPrev = 'none';
const musicSelect = addSelect(
  musicBox, 'Musique',
  [['none', 'Aucune']].concat(MUSIC_TRACKS, [
    ['search', '🔎 Rechercher une musique en ligne...'],
    ['file', '📁 Mon fichier audio...'],
    ['loaded', 'Musique choisie']
  ]),
  'none',
  v => onMusicChoice(v)
);
const loadedOption = Array.from(musicSelect.options).find(o => o.value === 'loaded');
loadedOption.hidden = true;

const musicFileInput = document.createElement('input');
musicFileInput.type = 'file';
musicFileInput.accept = 'audio/*';
musicFileInput.style.display = 'none';
musicBox.appendChild(musicFileInput);

const musicInfo = addNote(musicBox, 'Aucune musique.');

addSlider(musicBox, 'Volume de la musique', 0, 100, 5, Math.round(musicVolume * 100), v => v + ' %', v => {
  musicVolume = v / 100;
});

const musicStartSlider = addSlider(
  musicBox, 'Commencer la musique à', 0, 120, 1, 0,
  v => fmtTime(v),
  v => {
    musicStart = v;
  },
  () => startPreviewMusic()
);

const duckInput = addCheckbox(musicBox, 'Baisser la musique quand quelqu’un parle', checked => {
  duckOn = checked;
});
duckInput.checked = true;

addSlider(musicBox, 'Volume de la voix', 0, 100, 5, Math.round(voiceVolume * 100), v => v + ' %', v => {
  voiceVolume = v / 100;
  updateAudioMix();
});

const sampleButton = document.createElement('button');
sampleButton.type = 'button';
sampleButton.className = 'button ghost full';
sampleButton.textContent = '▶ Écouter 8 secondes de la musique';
musicBox.appendChild(sampleButton);
sampleButton.addEventListener('click', () => playMusicSample());

const creditsNote = addNote(musicBox, '');
const creditsButton = document.createElement('button');
creditsButton.type = 'button';
creditsButton.className = 'button ghost full';
creditsButton.textContent = 'Copier les crédits des sons';
musicBox.appendChild(creditsButton);

addNote(
  musicBox,
  'Les musiques de l’application sont sans droits d’auteur. Les sons trouvés en ligne sont sous licence ' +
  'Creative Commons : copiez les crédits dans la description de votre vidéo. ' +
  'Importez uniquement un fichier dont vous avez les droits.'
);

function creditsText() {
  const names = { music: 'Musique', hook: 'Son du titre', zoom: 'Son du zoom', cap: 'Son des sous-titres' };
  const lines = [];

  Object.keys(credits).forEach(k => {
    const c = credits[k];
    if (!c) return;
    if (k === 'music' && !musicBuffer) return;
    if (k !== 'music' && sfxChoice[k] !== 'custom') return;
    lines.push(names[k] + ' : « ' + c.title + ' » par ' + c.creator + ' (' + c.license + ') ' + c.link);
  });

  return lines.join('\n');
}

function updateCreditsView() {
  const txt = creditsText();
  creditsNote.textContent = txt
    ? 'Crédits à indiquer :\n' + txt
    : 'Aucun crédit nécessaire pour le moment.';
  creditsNote.style.whiteSpace = 'pre-wrap';
  creditsNote.style.wordBreak = 'break-word';
}

creditsButton.addEventListener('click', async () => {
  const txt = creditsText();
  if (!txt) {
    showToast('Aucun crédit à copier pour le moment.');
    return;
  }
  try {
    await navigator.clipboard.writeText(txt);
    showToast('Crédits copiés.');
  } catch (e) {
    prompt('Copiez ces crédits :', txt);
  }
});

function setMusic(buf, label, credit) {
  musicToken++;
  musicBuffer = buf;
  credits.music = credit || null;

  loadedOption.textContent = label.slice(0, 40);
  loadedOption.hidden = false;
  musicSelect.value = 'loaded';
  musicPrev = 'loaded';

  const max = Math.max(1, Math.floor(buf.duration - 1));
  musicStartSlider.input.max = String(max);
  if (musicStart > max) musicStart = 0;
  musicStartSlider.set(musicStart);

  musicInfo.textContent = label + ' (' + fmtTime(buf.duration) + ', en boucle).';
  updateCreditsView();
  startPreviewMusic();
}

async function onMusicChoice(v) {
  const token = ++musicToken;
  stopPreviewMusic();
  stopSample();

  if (v === 'loaded') {
    if (!musicBuffer) musicSelect.value = 'none';
    return;
  }

  if (v === 'none') {
    musicBuffer = null;
    credits.music = null;
    musicPrev = 'none';
    musicInfo.textContent = 'Aucune musique.';
    updateCreditsView();
    return;
  }

  if (v === 'search') {
    musicSelect.value = musicPrev;
    openSoundSearch(
      'music',
      (buf, credit) => setMusic(buf, 'En ligne : ' + credit.title, credit),
      () => { musicSelect.value = musicPrev; }
    );
    return;
  }

  if (v === 'file') {
    musicSelect.value = musicPrev;
    musicFileInput.value = '';
    musicFileInput.click();
    return;
  }

  musicInfo.textContent = 'Création de la musique...';

  try {
    const buf = await getBuiltin(v);
    if (token !== musicToken) return;

    const tr = MUSIC_TRACKS.find(x => x[0] === v);
    musicBuffer = buf;
    credits.music = null;
    musicPrev = v;
    musicStartSlider.input.max = String(Math.max(1, Math.floor(buf.duration - 1)));
    musicInfo.textContent = 'Prête : ' + (tr ? tr[1] : v) + ' (en boucle).';
    updateCreditsView();
    startPreviewMusic();
  } catch (e) {
    console.warn('Musique :', e);
    if (token !== musicToken) return;
    musicBuffer = null;
    musicInfo.textContent = 'Impossible de créer cette musique sur ce navigateur.';
  }
}

musicFileInput.addEventListener('change', async () => {
  const file = musicFileInput.files && musicFileInput.files[0];
  if (!file) return;

  if (file.size > 40 * 1024 * 1024) {
    showToast('Fichier audio trop volumineux : maximum 40 Mo.');
    return;
  }

  musicInfo.textContent = 'Chargement du fichier audio...';

  try {
    const buf = await decodeAudio(getPreviewCtx(), await file.arrayBuffer());
    setMusic(buf, 'Fichier : ' + file.name, null);
  } catch (e) {
    console.warn('Audio illisible :', e);
    musicInfo.textContent = 'Ce fichier audio est illisible. Essayez un MP3 ou un WAV.';
  }
});

// ===== Réglages : effets sonores =====
const sfxBox = makeSection('Effets sonores', false);

const sfxFile = document.createElement('input');
sfxFile.type = 'file';
sfxFile.accept = 'audio/*';
sfxFile.style.display = 'none';
sfxBox.appendChild(sfxFile);

let sfxFileSlot = null;
const sfxSelects = {};

function makeSfxRow(slot, label, builtins) {
  const sel = addSelect(
    sfxBox, label,
    builtins.concat([
      ['search', '🔎 Rechercher un son en ligne...'],
      ['file', '📁 Mon fichier audio...'],
      ['custom', 'Son choisi']
    ]),
    'none',
    v => onSfxChoice(slot, v)
  );
  const opt = Array.from(sel.options).find(o => o.value === 'custom');
  opt.hidden = true;
  sfxSelects[slot] = { sel, opt };
}

makeSfxRow('hook', 'Son du titre d’accroche', [['none', 'Aucun'], ['whoosh', 'Whoosh'], ['ding', 'Ding'], ['pop', 'Pop']]);
makeSfxRow('zoom', 'Son des zooms', [['none', 'Aucun'], ['whoosh', 'Whoosh'], ['pop', 'Pop']]);
makeSfxRow('cap', 'Son à chaque nouveau sous-titre', [['none', 'Aucun'], ['pop', 'Pop'], ['click', 'Clic']]);

function onSfxChoice(slot, v) {
  const s = sfxSelects[slot];

  if (v === 'search') {
    s.sel.value = sfxChoice[slot];
    openSoundSearch(
      'sfx',
      (buf, credit) => setSfx(slot, buf, credit.title, credit),
      () => { s.sel.value = sfxChoice[slot]; }
    );
    return;
  }

  if (v === 'file') {
    s.sel.value = sfxChoice[slot];
    sfxFileSlot = slot;
    sfxFile.value = '';
    sfxFile.click();
    return;
  }

  if (v === 'custom' && !customSfx[slot]) {
    s.sel.value = 'none';
    v = 'none';
  }

  sfxChoice[slot] = v;
  if (v !== 'custom') credits[slot] = null;
  customVersion++;
  updateCreditsView();

  if (slot === 'zoom' && v !== 'none' && !zoomOn) {
    showToast('Activez aussi les zooms automatiques pour entendre ce son.');
  }
  if (slot === 'cap' && v !== 'none' && !segments.length) {
    showToast('Générez d’abord les sous-titres IA pour entendre ce son.');
  }
}

function setSfx(slot, buf, label, credit) {
  const s = sfxSelects[slot];

  customSfx[slot] = buf;
  sfxChoice[slot] = 'custom';
  credits[slot] = credit || null;
  customVersion++;

  s.opt.textContent = 'Son : ' + label.slice(0, 28);
  s.opt.hidden = false;
  s.sel.value = 'custom';

  updateCreditsView();

  try {
    const ctx = getPreviewCtx();
    if (ctx.state === 'suspended') ctx.resume();
    playSfx(ctx, getPreviewSfxGain(), 'custom', ctx.currentTime, buf);
  } catch (e) { /* aperçu impossible */ }

  showToast('Son ajouté.');
}

sfxFile.addEventListener('change', async () => {
  const file = sfxFile.files && sfxFile.files[0];
  if (!file || !sfxFileSlot) return;

  if (file.size > 15 * 1024 * 1024) {
    showToast('Fichier audio trop volumineux : maximum 15 Mo.');
    return;
  }

  try {
    const buf = await decodeAudio(getPreviewCtx(), await file.arrayBuffer());
    setSfx(sfxFileSlot, buf, file.name, null);
  } catch (e) {
    showToast('Ce fichier audio est illisible. Essayez un MP3 ou un WAV.');
  }
});

addSlider(sfxBox, 'Volume des effets', 0, 100, 5, Math.round(sfxVolume * 100), v => v + ' %', v => {
  sfxVolume = v / 100;
});
addNote(sfxBox, 'Les effets se jouent pendant la lecture et dans la vidéo exportée. Un son choisi est coupé à 4 secondes.');

// ===== Réglages : fondus =====
const fadeBox = makeSection('Transitions : fondus', false);

addSlider(fadeBox, 'Fondu d’entrée (image et son)', 0, 3, 0.1, 0, v => (v === 0 ? 'aucun' : v.toFixed(1) + ' s'), v => {
  fadeIn = v;
});
addSlider(fadeBox, 'Fondu de sortie (image et son)', 0, 3, 0.1, 0, v => (v === 0 ? 'aucun' : v.toFixed(1) + ' s'), v => {
  fadeOut = v;
});
addNote(fadeBox, 'Le fondu se voit pendant la lecture et dans la vidéo exportée.');

// ===== Recherche de sons en ligne (Openverse) =====
const SOUND_HINTS = {
  music: ['calm piano', 'upbeat', 'lofi', 'cinematic', 'acoustic guitar', 'happy'],
  sfx: ['whoosh', 'pop', 'ding', 'applause', 'laugh', 'click']
};

const soundModal = document.createElement('div');
Object.assign(soundModal.style, {
  position: 'fixed',
  top: '0',
  left: '0',
  right: '0',
  bottom: '0',
  background: 'rgba(4,7,16,0.9)',
  zIndex: '9999',
  display: 'none',
  justifyContent: 'center',
  alignItems: 'flex-start',
  padding: '12px',
  overflowY: 'auto'
});

const soundCard = document.createElement('div');
Object.assign(soundCard.style, {
  width: '100%',
  maxWidth: '480px',
  background: '#10162a',
  border: '1px solid #34405f',
  borderRadius: '14px',
  padding: '14px',
  color: '#fff',
  fontFamily: 'inherit',
  fontSize: '12px'
});

const soundTitle = document.createElement('div');
Object.assign(soundTitle.style, { fontWeight: '800', fontSize: '15px', marginBottom: '10px' });

const soundRow = document.createElement('div');
Object.assign(soundRow.style, { display: 'flex', gap: '8px' });

const soundInput = document.createElement('input');
soundInput.type = 'text';
soundInput.maxLength = 60;
Object.assign(soundInput.style, {
  flex: '1',
  minWidth: '0',
  padding: '10px',
  background: '#0b1122',
  color: '#fff',
  border: '1px solid #34405f',
  borderRadius: '8px',
  fontSize: '13px',
  fontFamily: 'inherit'
});

const soundGo = document.createElement('button');
soundGo.type = 'button';
soundGo.className = 'button primary';
soundGo.textContent = 'Chercher';
Object.assign(soundGo.style, { padding: '10px 14px' });

soundRow.appendChild(soundInput);
soundRow.appendChild(soundGo);

const soundChips = document.createElement('div');
Object.assign(soundChips.style, { display: 'flex', flexWrap: 'wrap', gap: '6px', margin: '10px 0 4px' });

const soundStatus = document.createElement('div');
Object.assign(soundStatus.style, { color: '#aeb8d0', margin: '8px 0', lineHeight: '1.5' });

const soundList = document.createElement('div');

const soundFoot = document.createElement('div');
soundFoot.textContent =
  'Sons sous licence Creative Commons autorisant l’usage commercial (source : Openverse). ' +
  'Pensez à copier les crédits dans la description de votre vidéo.';
Object.assign(soundFoot.style, { color: '#8994ad', fontSize: '10px', lineHeight: '1.5', margin: '10px 0' });

const soundClose = document.createElement('button');
soundClose.type = 'button';
soundClose.className = 'button ghost full';
soundClose.textContent = 'Fermer';

[soundTitle, soundRow, soundChips, soundStatus, soundList, soundFoot, soundClose].forEach(el => soundCard.appendChild(el));
soundModal.appendChild(soundCard);
document.body.appendChild(soundModal);

let soundReq = null;
let searchToken = 0;
let previewAudio = null;
let previewBtn = null;

function safeUrl(u) {
  return typeof u === 'string' && /^https:\/\//i.test(u) ? u : '';
}

function openSoundSearch(kind, onPick, onCancel) {
  soundReq = { kind, onPick, onCancel, done: false };

  soundTitle.textContent = kind === 'music' ? '🔎 Rechercher une musique' : '🔎 Rechercher un effet sonore';
  soundInput.placeholder = kind === 'music' ? 'Ex : calm piano, upbeat, lofi' : 'Ex : whoosh, applause, laugh';
  soundInput.value = '';
  soundList.innerHTML = '';
  soundStatus.textContent = 'Tapez un mot (de préférence en anglais), puis touchez « Chercher ».';

  soundChips.innerHTML = '';
  SOUND_HINTS[kind].forEach(word => {
    const chip = document.createElement('button');
    chip.type = 'button';
    chip.textContent = word;
    Object.assign(chip.style, {
      padding: '6px 10px',
      borderRadius: '14px',
      border: '1px solid #35415f',
      background: '#0c1325',
      color: '#d9c2ff',
      fontSize: '11px',
      fontWeight: '700',
      cursor: 'pointer',
      fontFamily: 'inherit'
    });
    chip.addEventListener('click', () => {
      soundInput.value = word;
      runSoundSearch();
    });
    soundChips.appendChild(chip);
  });

  soundModal.style.display = 'flex';
  document.body.style.overflow = 'hidden';
  setTimeout(() => soundInput.focus(), 60);
}

function closeSoundModal() {
  stopSoundPreview();
  searchToken++;
  soundModal.style.display = 'none';
  document.body.style.overflow = '';

  const r = soundReq;
  soundReq = null;
  if (r && !r.done && r.onCancel) r.onCancel();
}

soundClose.addEventListener('click', closeSoundModal);
soundModal.addEventListener('click', e => {
  if (e.target === soundModal) closeSoundModal();
});
soundGo.addEventListener('click', () => runSoundSearch());
soundInput.addEventListener('keydown', e => {
  if (e.key === 'Enter') {
    e.preventDefault();
    runSoundSearch();
  }
});

async function searchSounds(q, kind) {
  const params = new URLSearchParams({
    q,
    category: kind === 'music' ? 'music' : 'sound_effect',
    license_type: 'commercial,modification',
    page_size: '12'
  });

  const res = await fetch('https://api.openverse.org/v1/audio/?' + params.toString());

  if (res.status === 429) {
    throw new Error('Trop de recherches en peu de temps. Réessayez dans quelques minutes.');
  }
  if (!res.ok) {
    throw new Error('Recherche impossible pour le moment (erreur ' + res.status + ').');
  }

  const data = await res.json();
  return (data.results || []).filter(r => safeUrl(r.url));
}

async function runSoundSearch() {
  if (!soundReq) return;

  const q = soundInput.value.trim();
  if (q.length < 2) {
    soundStatus.textContent = 'Tapez au moins 2 lettres.';
    return;
  }

  const kind = soundReq.kind;
  const token = ++searchToken;

  stopSoundPreview();
  soundList.innerHTML = '';
  soundStatus.textContent = 'Recherche en cours...';
  soundGo.disabled = true;

  try {
    const items = await searchSounds(q, kind);
    if (token !== searchToken || !soundReq) return;

    if (!items.length) {
      soundStatus.textContent = 'Aucun résultat. Essayez un autre mot, de préférence en anglais.';
    } else {
      soundStatus.textContent = items.length + ' résultat(s). Touchez « Écouter », puis « Utiliser ».';
      items.forEach(r => soundList.appendChild(makeSoundRow(r)));
    }
  } catch (e) {
    if (token !== searchToken) return;
    soundStatus.textContent = e && e.message ? e.message : 'Recherche impossible.';
  } finally {
    if (token === searchToken) soundGo.disabled = false;
  }
}

function licenseLabel(r) {
  const l = String(r.license || '').toLowerCase();
  if (!l) return 'Licence libre';
  if (l === 'cc0') return 'CC0';
  if (l === 'pdm') return 'Domaine public';
  return 'CC ' + l.toUpperCase() + (r.license_version ? ' ' + r.license_version : '');
}

function creditFor(r) {
  return {
    title: r.title || 'Sans titre',
    creator: r.creator || 'auteur inconnu',
    license: licenseLabel(r),
    link: safeUrl(r.foreign_landing_url) || safeUrl(r.url)
  };
}

function stopSoundPreview() {
  if (previewAudio) {
    try { previewAudio.pause(); } catch (e) { /* rien */ }
    previewAudio = null;
  }
  if (previewBtn) {
    previewBtn.textContent = '▶ Écouter';
    previewBtn = null;
  }
}

function toggleSoundPreview(url, btn) {
  if (previewAudio && previewBtn === btn) {
    stopSoundPreview();
    return;
  }

  stopSoundPreview();
  previewAudio = new Audio(url);
  previewAudio.volume = 0.8;
  previewBtn = btn;
  btn.textContent = '■ Stop';

  previewAudio.onended = stopSoundPreview;
  previewAudio.onerror = () => {
    showToast('Aperçu impossible pour ce son.');
    stopSoundPreview();
  };
  previewAudio.play().catch(() => stopSoundPreview());
}

async function fetchAudioBuffer(url, maxBytes) {
  const res = await fetch(url, { mode: 'cors' });
  if (!res.ok) throw new Error('http');

  const len = Number(res.headers.get('content-length') || 0);
  if (len && len > maxBytes) throw new Error('big');

  const ab = await res.arrayBuffer();
  if (ab.byteLength > maxBytes) throw new Error('big');

  try {
    return await decodeAudio(getPreviewCtx(), ab);
  } catch (e) {
    throw new Error('decode');
  }
}

function soundErrorText(e) {
  const m = e && e.message;
  if (m === 'big') return 'Ce son est trop volumineux. Choisissez-en un plus court.';
  if (m === 'decode') return 'Votre navigateur ne sait pas lire ce format audio. Choisissez-en un autre.';
  if (m === 'http') return 'Ce son n’est plus disponible. Choisissez-en un autre.';
  return 'Ce site n’autorise pas l’utilisation directe de ce son. Essayez un autre résultat, ' +
    'ou ouvrez « Source », téléchargez le fichier, puis importez-le avec « Mon fichier audio ».';
}

function makeSoundRow(r) {
  const row = document.createElement('div');
  Object.assign(row.style, {
    background: '#0c1325',
    border: '1px solid #293554',
    borderRadius: '10px',
    padding: '10px',
    margin: '8px 0'
  });

  const title = document.createElement('div');
  title.textContent = (r.title || 'Sans titre').slice(0, 70);
  Object.assign(title.style, { fontWeight: '800', fontSize: '12px', marginBottom: '4px' });

  const meta = document.createElement('div');
  const parts = [r.creator, licenseLabel(r)];
  if (Number(r.duration) > 0) parts.push(fmtTime(Number(r.duration) / 1000));
  if (r.provider) parts.push(r.provider);
  meta.textContent = parts.filter(Boolean).join(' · ');
  Object.assign(meta.style, { color: '#8994ad', fontSize: '10px', lineHeight: '1.5' });

  const actions = document.createElement('div');
  Object.assign(actions.style, { display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: '8px', alignItems: 'center' });

  const play = document.createElement('button');
  play.type = 'button';
  play.className = 'button ghost';
  play.textContent = '▶ Écouter';
  Object.assign(play.style, { padding: '8px 12px', fontSize: '11px' });
  play.addEventListener('click', () => toggleSoundPreview(safeUrl(r.url), play));

  const use = document.createElement('button');
  use.type = 'button';
  use.className = 'button primary';
  use.textContent = 'Utiliser';
  Object.assign(use.style, { padding: '8px 14px', fontSize: '11px' });

  use.addEventListener('click', async () => {
    const req = soundReq;
    if (!req) return;

    stopSoundPreview();
    use.disabled = true;
    use.textContent = 'Chargement...';

    try {
      const buf = await fetchAudioBuffer(safeUrl(r.url), req.kind === 'music' ? 35e6 : 12e6);
      if (soundReq !== req) return;

      req.done = true;
      const credit = creditFor(r);
      closeSoundModal();
      req.onPick(buf, credit);
    } catch (e) {
      use.disabled = false;
      use.textContent = 'Utiliser';
      soundStatus.textContent = soundErrorText(e);
    }
  });

  actions.appendChild(play);
  actions.appendChild(use);

  const link = safeUrl(r.foreign_landing_url);
  if (link) {
    const a = document.createElement('a');
    a.href = link;
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    a.textContent = 'Source';
    Object.assign(a.style, { color: '#d9c2ff', fontSize: '11px', textDecoration: 'underline' });
    actions.appendChild(a);
  }

  row.appendChild(title);
  row.appendChild(meta);
  row.appendChild(actions);
  return row;
}

// ===== Audio : fondus, baisse de la musique, effets =====
function fadeFactor(t) {
  if (!fadeIn && !fadeOut) return 1;

  const o = outTime(t);
  const total = outputDuration();
  let f = 1;

  if (fadeIn > 0) f = Math.min(f, o / fadeIn);
  if (fadeOut > 0 && total > 0) f = Math.min(f, (total - o) / fadeOut);

  return clamp01(f);
}

function speechRanges() {
  if (speechCache.key === baseSegments) return speechCache.ranges;

  const merged = [];
  rawSpeech().forEach(([s, e]) => {
    const last = merged[merged.length - 1];
    if (last && s - last[1] < 0.4) {
      last[1] = Math.max(last[1], e);
    } else {
      merged.push([s, e]);
    }
  });

  speechCache = { key: baseSegments, ranges: merged };
  return merged;
}

function duckFactor(t) {
  if (!duckOn || !baseSegments.length) return 1;
  const inside = speechRanges().some(r => t >= r[0] - 0.1 && t <= r[1] + 0.15);
  return inside ? DUCK_LEVEL : 1;
}

function makeNoise(ctx) {
  const len = ctx.sampleRate;
  const b = ctx.createBuffer(1, len, ctx.sampleRate);
  const d = b.getChannelData(0);
  for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
  return b;
}

function noiseBuf(ctx) {
  let b = noiseCache.get(ctx);
  if (!b) {
    b = makeNoise(ctx);
    noiseCache.set(ctx, b);
  }
  return b;
}

// Joue un effet sonore (créé par l'application, ou son choisi par l'utilisateur)
function playSfx(ctx, dest, kind, when, buf) {
  const t = Math.max(when, ctx.currentTime);

  if (kind === 'custom') {
    if (!buf) return;
    const d = Math.min(buf.duration, 4);
    const s = ctx.createBufferSource();
    s.buffer = buf;
    const g = ctx.createGain();
    g.gain.setValueAtTime(1, t);
    g.gain.setValueAtTime(1, t + Math.max(0, d - 0.3));
    g.gain.linearRampToValueAtTime(0, t + d);
    s.connect(g);
    g.connect(dest);
    s.start(t);
    s.stop(t + d + 0.02);
    return;
  }

  if (kind === 'whoosh') {
    const src = ctx.createBufferSource();
    src.buffer = noiseBuf(ctx);
    const f = ctx.createBiquadFilter();
    f.type = 'bandpass';
    f.Q.value = 1.2;
    f.frequency.setValueAtTime(250, t);
    f.frequency.exponentialRampToValueAtTime(4000, t + 0.45);
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(0.9, t + 0.2);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.55);
    src.connect(f);
    f.connect(g);
    g.connect(dest);
    src.start(t, Math.random() * 0.3);
    src.stop(t + 0.6);
  } else if (kind === 'ding') {
    [[880, 0.5], [1320, 0.25]].forEach(([fr, vol]) => {
      const o = ctx.createOscillator();
      o.type = 'sine';
      o.frequency.value = fr;
      const g = ctx.createGain();
      g.gain.setValueAtTime(vol, t);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 0.7);
      o.connect(g);
      g.connect(dest);
      o.start(t);
      o.stop(t + 0.75);
    });
  } else if (kind === 'pop') {
    const o = ctx.createOscillator();
    o.type = 'sine';
    o.frequency.setValueAtTime(700, t);
    o.frequency.exponentialRampToValueAtTime(180, t + 0.09);
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.8, t);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.13);
    o.connect(g);
    g.connect(dest);
    o.start(t);
    o.stop(t + 0.15);
  } else if (kind === 'click') {
    const src = ctx.createBufferSource();
    src.buffer = noiseBuf(ctx);
    const f = ctx.createBiquadFilter();
    f.type = 'highpass';
    f.frequency.value = 2500;
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.7, t);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.03);
    src.connect(f);
    f.connect(g);
    g.connect(dest);
    src.start(t, Math.random() * 0.5);
    src.stop(t + 0.05);
  }
}

function getPreviewSfxGain() {
  const ctx = getPreviewCtx();
  if (!pSfxGain) {
    pSfxGain = ctx.createGain();
    pSfxGain.connect(ctx.destination);
  }
  pSfxGain.gain.value = sfxVolume;
  return pSfxGain;
}

// Moments où jouer un effet (temps de la vidéo d'origine)
function sfxEventsList() {
  const hookOn = hookInput.value.trim().length > 0;
  const key = [
    sfxChoice.hook, sfxChoice.zoom, sfxChoice.cap, customVersion,
    zoomOn ? 1 : 0, hookOn ? 1 : 0, segments.length, baseSegments.length,
    trimStart, trimEnd, silenceOn ? silences.length : -1
  ].join('|');

  if (key === sfxCacheKey) return sfxCache;

  const ev = [];
  const a = trimStart;
  const b = getTrimEnd();
  const ok = slot => sfxChoice[slot] !== 'none' && (sfxChoice[slot] !== 'custom' || customSfx[slot]);

  if (ok('hook') && hookOn) {
    ev.push({ t: a + 0.05, kind: sfxChoice.hook, slot: 'hook' });
  }

  if (ok('zoom') && zoomOn) {
    const list = baseSegments.length ? baseSegments : segments;
    list.forEach((s, i) => {
      if (i % 2 === 1) ev.push({ t: s.start, kind: sfxChoice.zoom, slot: 'zoom' });
    });
  }

  if (ok('cap')) {
    let last = -9;
    segments.forEach(s => {
      if (s.text && s.start - last >= 0.25) {
        ev.push({ t: s.start, kind: sfxChoice.cap, slot: 'cap' });
        last = s.start;
      }
    });
  }

  const out = ev.filter(e =>
    e.t >= a - 0.001 && e.t < b &&
    !(silenceOn && silences.some(s => e.t >= s.from && e.t < s.to))
  );

  out.sort((x, y) => x.t - y.t);
  sfxCacheKey = key;
  sfxCache = out;
  return out;
}

function previewSfxTick() {
  if (videoPreview.paused) {
    sfxPrevT = null;
    return;
  }

  const t = videoPreview.currentTime;

  if (sfxPrevT !== null && t > sfxPrevT && t - sfxPrevT < 0.4) {
    sfxEventsList().forEach(e => {
      if (e.t > sfxPrevT && e.t <= t) {
        const ctx = getPreviewCtx();
        if (ctx.state === 'suspended') ctx.resume();
        playSfx(ctx, getPreviewSfxGain(), e.kind, ctx.currentTime, customSfx[e.slot]);
      }
    });
  }

  sfxPrevT = t;
}

// ===== Audio : musique dans l'aperçu =====
function startPreviewMusic() {
  stopPreviewMusic();
  if (!musicBuffer || videoPreview.paused) return;

  stopSample();

  const ctx = getPreviewCtx();
  if (ctx.state === 'suspended') ctx.resume();

  const dur = musicBuffer.duration;
  const src = ctx.createBufferSource();
  src.buffer = musicBuffer;
  src.loop = true;

  const gain = ctx.createGain();
  gain.gain.value = 0;
  src.connect(gain);
  gain.connect(ctx.destination);

  const off = (musicStart + outTime(videoPreview.currentTime || 0)) % dur;
  src.start(0, off);

  pMusic = { src, gain, startCtx: ctx.currentTime, startOff: off, cur: 0 };
}

function stopPreviewMusic() {
  if (!pMusic) return;
  try { pMusic.src.stop(); } catch (e) { /* déjà arrêtée */ }
  try { pMusic.src.disconnect(); } catch (e) { /* rien */ }
  try { pMusic.gain.disconnect(); } catch (e) { /* rien */ }
  pMusic = null;
}

function resyncMusic() {
  if (!pMusic || !musicBuffer || videoPreview.paused) return;

  const dur = musicBuffer.duration;
  const ctx = getPreviewCtx();
  const pos = (ctx.currentTime - pMusic.startCtx + pMusic.startOff) % dur;
  const want = (musicStart + outTime(videoPreview.currentTime || 0)) % dur;

  let d = Math.abs(pos - want);
  d = Math.min(d, dur - d);
  if (d > 0.4) startPreviewMusic();
}

function stopSample() {
  if (!sampleNode) return;
  try { sampleNode.stop(); } catch (e) { /* déjà arrêté */ }
  sampleNode = null;
}

function playMusicSample() {
  if (!musicBuffer) {
    showToast('Choisissez d’abord une musique.');
    return;
  }

  stopSample();
  stopPreviewMusic();

  const ctx = getPreviewCtx();
  if (ctx.state === 'suspended') ctx.resume();

  const src = ctx.createBufferSource();
  src.buffer = musicBuffer;
  const g = ctx.createGain();
  g.gain.value = Math.max(0.05, musicVolume);
  src.connect(g);
  g.connect(ctx.destination);
  src.start(0, musicStart % musicBuffer.duration);
  src.stop(ctx.currentTime + 8);
  sampleNode = src;
}

// Voile noir pour les fondus (aperçu)
const fadeOverlay = document.createElement('div');
Object.assign(fadeOverlay.style, {
  position: 'absolute',
  left: '0',
  right: '0',
  top: '0',
  bottom: '0',
  background: '#000',
  opacity: '0',
  pointerEvents: 'none',
  zIndex: '7'
});

function updateAudioMix() {
  const t = videoPreview.currentTime || 0;
  const playing = !videoPreview.paused;
  const f = playing ? fadeFactor(t) : 1;

  try {
    videoPreview.volume = clamp01(voiceVolume * f);
  } catch (e) { /* volume non réglable sur cet appareil */ }

  fadeOverlay.style.opacity = playing ? String(1 - f) : '0';

  if (pMusic) {
    const target = musicVolume * duckFactor(t) * f;
    pMusic.cur += (target - pMusic.cur) * 0.2;
    pMusic.gain.gain.value = pMusic.cur;
  }
}

function tickAudio() {
  updateAudioMix();
  previewSfxTick();
}

videoPreview.addEventListener('play', () => {
  sfxPrevT = videoPreview.currentTime;
  startPreviewMusic();
});
videoPreview.addEventListener('pause', () => {
  stopPreviewMusic();
  sfxPrevT = null;
  updateAudioMix();
});
videoPreview.addEventListener('ended', () => {
  stopPreviewMusic();
  sfxPrevT = null;
});
videoPreview.addEventListener('seeked', resyncMusic);

videoInput.addEventListener('change', () => {
  stopPreviewMusic();
  previewFrame.appendChild(fadeOverlay);
});

// ===== Musiques créées par l'application =====
function midiHz(m) {
  return 440 * Math.pow(2, (m - 69) / 12);
}

function synthNote(ctx, dest, o) {
  if (o.d < 0.03) return;

  const osc = ctx.createOscillator();
  osc.type = o.type || 'sine';
  osc.frequency.value = o.f;

  const g = ctx.createGain();
  const a = o.a === undefined ? 0.02 : o.a;
  const r = o.r === undefined ? 0.2 : o.r;
  g.gain.setValueAtTime(0, o.t);
  g.gain.linearRampToValueAtTime(o.g, o.t + a);
  g.gain.setValueAtTime(o.g, Math.max(o.t + a, o.t + o.d - r));
  g.gain.linearRampToValueAtTime(0, o.t + o.d);

  if (o.lp) {
    const f = ctx.createBiquadFilter();
    f.type = 'lowpass';
    f.frequency.value = o.lp;
    osc.connect(f);
    f.connect(g);
  } else {
    osc.connect(g);
  }

  g.connect(dest);
  osc.start(o.t);
  osc.stop(o.t + o.d + 0.05);
}

function drumKick(ctx, dest, t, g) {
  const o = ctx.createOscillator();
  o.type = 'sine';
  o.frequency.setValueAtTime(150, t);
  o.frequency.exponentialRampToValueAtTime(45, t + 0.12);
  const a = ctx.createGain();
  a.gain.setValueAtTime(g, t);
  a.gain.exponentialRampToValueAtTime(0.001, t + 0.3);
  o.connect(a);
  a.connect(dest);
  o.start(t);
  o.stop(t + 0.32);
}

function drumNoise(ctx, dest, noise, t, type, freq, g, d) {
  const s = ctx.createBufferSource();
  s.buffer = noise;
  const f = ctx.createBiquadFilter();
  f.type = type;
  f.frequency.value = freq;
  const a = ctx.createGain();
  a.gain.setValueAtTime(g, t);
  a.gain.exponentialRampToValueAtTime(0.001, t + d);
  s.connect(f);
  f.connect(a);
  a.connect(dest);
  s.start(t, Math.random() * 0.5);
  s.stop(t + d + 0.02);
}

function renderTrack(id) {
  const OAC = window.OfflineAudioContext || window.webkitOfflineAudioContext;
  if (!OAC) return Promise.reject(new Error('Audio non disponible'));

  const SR = 44100;
  const bpm = { calm: 72, energy: 112, suspense: 76, lofi: 82 }[id] || 90;
  const beat = 60 / bpm;
  const bar = beat * 4;
  const total = bar * 4;
  const ctx = new OAC(2, Math.ceil(total * SR), SR);

  const comp = ctx.createDynamicsCompressor();
  const master = ctx.createGain();
  master.gain.value = 0.8;
  master.connect(comp);
  comp.connect(ctx.destination);

  const noise = makeNoise(ctx);
  const chords = [[57, 60, 64], [57, 60, 65], [55, 60, 64], [55, 59, 62]];
  const roots = [45, 41, 48, 43];

  const note = (m, t, d, type, g, a, r, lp) => {
    synthNote(ctx, master, {
      f: midiHz(m), t, d: Math.min(d, total - t - 0.02), type, g, a, r, lp
    });
  };

  for (let b = 0; b < 4; b++) {
    const t0 = b * bar;

    if (id === 'calm') {
      chords[b].forEach(m => note(m, t0, bar + 0.25, 'sine', 0.11, 0.5, 1.0));
      note(roots[b], t0, bar, 'sine', 0.2, 0.1, 0.6);
      for (let i = 0; i < 8; i++) {
        note(chords[b][i % 3] + 12, t0 + (i * beat) / 2, beat * 1.2, 'triangle', 0.07, 0.01, 0.5, 2500);
      }
    }

    if (id === 'energy') {
      for (let i = 0; i < 4; i++) {
        drumKick(ctx, master, t0 + i * beat, 0.9);
        drumNoise(ctx, master, noise, t0 + i * beat + beat / 2, 'highpass', 7000, 0.22, 0.05);
      }
      drumNoise(ctx, master, noise, t0 + beat, 'bandpass', 1800, 0.45, 0.18);
      drumNoise(ctx, master, noise, t0 + beat * 3, 'bandpass', 1800, 0.45, 0.18);

      for (let i = 0; i < 8; i++) {
        note(roots[b], t0 + (i * beat) / 2, (beat / 2) * 0.9, 'sawtooth', 0.14, 0.005, 0.08, 400);
      }
      [1.5, 3.5].forEach(k => {
        chords[b].forEach(m => note(m + 12, t0 + beat * k, beat * 0.4, 'sawtooth', 0.045, 0.005, 0.15, 1800));
      });
    }

    if (id === 'suspense') {
      drumKick(ctx, master, t0, 0.35);
      drumKick(ctx, master, t0 + beat * 2, 0.25);
      note(roots[b] - 12, t0, bar, 'sine', 0.16, 0.2, 0.4);
    }

    if (id === 'lofi') {
      [0, 2.5].forEach(k => {
        chords[b].forEach(m => note(m, t0 + beat * k, beat * 1.8, 'triangle', 0.09, 0.01, 0.5, 1100));
      });
      note(roots[b], t0, beat * 1.8, 'sine', 0.2, 0.01, 0.4);
      note(roots[b], t0 + beat * 2, beat * 1.8, 'sine', 0.2, 0.01, 0.4);
      drumKick(ctx, master, t0, 0.8);
      drumKick(ctx, master, t0 + beat * 2.5, 0.7);
      drumNoise(ctx, master, noise, t0 + beat, 'bandpass', 1500, 0.35, 0.16);
      drumNoise(ctx, master, noise, t0 + beat * 3, 'bandpass', 1500, 0.35, 0.16);
      for (let i = 0; i < 8; i++) {
        drumNoise(ctx, master, noise, t0 + (i * beat) / 2, 'highpass', 8000, 0.1, 0.04);
      }
    }
  }

  if (id === 'suspense') {
    note(33, 0, total, 'sawtooth', 0.06, 0.05, 0.05, 180);
    note(40, 0, total, 'sine', 0.08, 0.05, 0.05);

    [3, 7, 10, 14].forEach((bt, k) => {
      const chord = chords[Math.floor(bt / 4)];
      note(chord[k % chord.length] + 24, bt * beat, 2.5, 'triangle', 0.07, 0.02, 2.0, 3000);
    });
  }

  return ctx.startRendering();
}

async function getBuiltin(id) {
  if (!builtinCache[id]) builtinCache[id] = await renderTrack(id);
  return builtinCache[id];
}

// ===== Dessin de la vidéo exportée =====
function roundRectPath(ctx, x, y, w, h, r) {
  const rr = Math.max(0, Math.min(r, w / 2, h / 2));
  ctx.beginPath();
  ctx.moveTo(x + rr, y);
  ctx.arcTo(x + w, y, x + w, y + h, rr);
  ctx.arcTo(x + w, y + h, x, y + h, rr);
  ctx.arcTo(x, y + h, x, y, rr);
  ctx.arcTo(x, y, x + w, y, rr);
  ctx.closePath();
}

function getCaptionState(t) {
  const seg = segments.find(s => t >= s.start && t < s.end);
  if (!seg) return null;

  const words = seg.text.split(/\s+/).filter(Boolean);
  if (!words.length) return null;

  const count = displayMode === 'all' ? -1 : visibleCount(seg, t);
  return { words, count };
}

function drawVideoFrame(ctx, vid, vw, vh, w, h, z, fit) {
  ctx.fillStyle = '#000';
  ctx.fillRect(0, 0, w, h);

  if (fit === 'cover') {
    const scz = Math.max(w / vw, h / vh) * z;
    const sw = w / scz;
    const sh = h / scz;
    ctx.drawImage(vid, (vw - sw) / 2, (vh - sh) / 2, sw, sh, 0, 0, w, h);
  } else {
    const scz = Math.min(w / vw, h / vh) * z;
    const dw = vw * scz;
    const dh = vh * scz;
    ctx.drawImage(vid, 0, 0, vw, vh, (w - dw) / 2, (h - dh) / 2, dw, dh);
  }
}

function drawHook(ctx, w, h, t) {
  const txt = hookInput.value.trim();
  if (!txt) return;

  const tt = outTime(t);
  if (tt >= hookSeconds) return;

  const sc = Math.min(h / 240, w / 200);
  const size = 14 * sc * hookScale;
  const fade = Math.min(1, Math.max(0, (hookSeconds - tt) / 0.3));

  ctx.save();
  ctx.globalAlpha = fade;
  ctx.font = '800 ' + size + "px 'DM Sans', Arial, sans-serif";
  if ('letterSpacing' in ctx) ctx.letterSpacing = '0px';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  const maxW = w * 0.86 - size * 1.6;
  const lines = [];
  let cur = '';

  txt.split(/\s+/).forEach(word => {
    const test = cur ? cur + ' ' + word : word;
    if (cur && ctx.measureText(test).width > maxW) {
      lines.push(cur);
      cur = word;
    } else {
      cur = test;
    }
  });
  if (cur) lines.push(cur);

  const lh = size * 1.25;
  const widest = Math.max(...lines.map(l => ctx.measureText(l).width));
  const padX = size * 0.85;
  const padY = size * 0.45;
  const bw = Math.min(w * 0.94, widest + padX * 2);
  const bh = lines.length * lh + padY * 2;
  const x = w / 2 - bw / 2;
  const y = Math.max(4, Math.min(h * (hookTop / 100), h - bh - 4));

  ctx.save();
  roundRectPath(ctx, x, y, bw, bh, size * 0.85);
  ctx.shadowColor = 'rgba(0,0,0,0.35)';
  ctx.shadowBlur = size * 0.6;
  ctx.shadowOffsetY = size * 0.2;
  ctx.fillStyle = '#fff';
  ctx.fill();
  ctx.restore();

  ctx.fillStyle = '#111';
  lines.forEach((l, i) => {
    ctx.fillText(l, w / 2, y + padY + i * lh + lh / 2);
  });

  ctx.restore();
}

function drawCaption(ctx, w, h, t) {
  const st = getCaptionState(t);
  if (!st) return;

  const cfg = Object.assign({}, STYLE_BASE, STYLE_CFG[activeStyle] || {});
  const accent = colorInput.value;
  const kwOn = kwMode !== 'off';
  const kwColor = kwColorInput.value;
  const f = FONTS[Number(fontSelect.value)];
  const family = f[1] || cfg.family;
  const weight = f[1] ? f[2] : cfg.weight;
  const basePx = f[1] && f[3] ? parseFloat(f[3]) : cfg.size;

  const sc = Math.min(h / 240, w / 200);
  const upper = cfg.upper || upperCase;
  const conv = x => (upper ? x.toUpperCase() : x);

  const words = st.words;
  const n = words.length;
  const kwSet = keywordIndexes(words, kwMode);
  const emo = emojiIndexes(words);
  const split = Math.ceil(n / 2);
  const withEmoji = (x, i) => x + (emo.has(i) ? '\u00A0' + emo.get(i) : '');

  let items = words.map((x, i) => ({
    text: withEmoji(x, i),
    second: i >= split,
    show: displayMode !== 'progressive' || i < st.count,
    kw: kwSet.has(i)
  }));

  if (displayMode === 'single') {
    const i = Math.min(st.count, n) - 1;
    if (i < 0) return;
    items = [{ text: withEmoji(words[i], i), second: true, show: true, kw: kwSet.has(i) }];
  }

  const fontFor = (second, px) =>
    (cfg.italic && !(second && cfg.line2NoItalic) ? 'italic ' : '') +
    (second && cfg.line2Weight ? cfg.line2Weight : weight) +
    ' ' + px + 'px ' + family;

  ctx.save();

  const setSpacing = px => {
    if ('letterSpacing' in ctx) {
      ctx.letterSpacing = (((cfg.spacing || 0) * sc) + letterGap * px) + 'px';
    }
  };

  const boxPadX = cfg.box ? cfg.box.padX * sc : 0;
  const boxPadY = cfg.box ? cfg.box.padY * sc : 0;
  const maxWidth = Math.max(40, w * (widthPercent / 100) - boxPadX * 2);

  const layout = px => {
    setSpacing(px);

    const result = [];
    let cur = { items: [], width: 0 };

    ctx.font = fontFor(false, px);
    const space = ctx.measureText(' ').width;

    items.forEach(it => {
      ctx.font = fontFor(it.second, px);
      const ww = ctx.measureText(conv(it.text)).width;

      if (cur.items.length && cur.width + space + ww > maxWidth) {
        result.push(cur);
        cur = { items: [], width: 0 };
      }

      const x = cur.items.length ? cur.width + space : 0;
      cur.items.push({ it, x, ww });
      cur.width = x + ww;
    });

    if (cur.items.length) result.push(cur);
    return result;
  };

  const fullSize = basePx * sc * sizeScale;
  let size = fullSize;
  let lines = layout(size);
  const widest = ls => Math.max(...ls.map(l => l.width));

  let guard = 0;
  while (guard++ < 8 && widest(lines) > maxWidth * 1.001 && size > fullSize * 0.4) {
    size *= 0.9;
    lines = layout(size);
  }

  setSpacing(size);

  const lh = size * lineHeight;
  const totalH = lines.length * lh;
  const bottomY = h * (1 - positionPercent / 100);
  let top = bottomY - totalH;
  top = Math.max(4 + boxPadY, Math.min(top, h - totalH - 4 - boxPadY));

  if (cfg.rotate) {
    const cy0 = top + totalH / 2;
    ctx.translate(w / 2, cy0);
    ctx.rotate((cfg.rotate * Math.PI) / 180);
    ctx.translate(-w / 2, -cy0);
  }

  if (cfg.box) {
    const bw = widest(lines) + boxPadX * 2;
    const bh = totalH + boxPadY * 2;
    ctx.save();
    roundRectPath(ctx, w / 2 - bw / 2, top - boxPadY, bw, bh, cfg.box.radius * sc);
    ctx.fillStyle = cfg.box.bg === 'accent' ? accent : cfg.box.bg;
    ctx.fill();
    if (cfg.box.border) {
      ctx.strokeStyle = cfg.box.border === 'accent' ? accent : cfg.box.border;
      ctx.lineWidth = Math.max(1, sc);
      ctx.stroke();
    }
    ctx.restore();
  }

  ctx.textBaseline = 'middle';
  ctx.textAlign = 'left';

  lines.forEach((line, li) => {
    const x0 = w / 2 - line.width / 2;
    const cy = top + li * lh + lh / 2;

    line.items.forEach(entry => {
      const it = entry.it;
      if (!it.show) return;

      ctx.font = fontFor(it.second, size);

      const x = x0 + entry.x;
      const txt = conv(it.text);

      const colorKey = kwOn ? cfg.c1 : (it.second ? cfg.c2 : cfg.c1);
      let fill = colorKey === 'accent' ? accent : colorKey;

      if (cfg.grad) {
        const g = cfg.gradDir === 'h'
          ? ctx.createLinearGradient(x0, 0, x0 + line.width, 0)
          : ctx.createLinearGradient(0, cy - lh / 2, 0, cy + lh / 2);
        cfg.grad.forEach((c, i) => g.addColorStop(i / (cfg.grad.length - 1), c));
        fill = g;
      }

      const itemFill = it.kw ? kwColor : fill;

      const marked = cfg.marker && (kwOn ? it.kw : it.second);
      if (marked) {
        ctx.save();
        roundRectPath(ctx, x - 6 * sc, cy - lh * 0.45, entry.ww + 12 * sc, lh * 0.9, 4 * sc);
        ctx.fillStyle = kwOn ? kwColor : accent;
        ctx.fill();
        ctx.restore();
        ctx.fillStyle = '#000';
        ctx.fillText(txt, x, cy);
        return;
      }

      [...cfg.shadows].reverse().forEach(sh => {
        ctx.save();
        ctx.shadowColor = sh.c === 'accent' ? accent : sh.c;
        ctx.shadowBlur = (sh.b || 0) * sc;
        ctx.shadowOffsetX = (sh.x || 0) * sc;
        ctx.shadowOffsetY = (sh.y || 0) * sc;
        ctx.fillStyle = cfg.hollow ? 'rgba(0,0,0,0)' : itemFill;
        ctx.fillText(txt, x, cy);
        ctx.restore();
      });

      if (cfg.hollow) {
        ctx.lineWidth = Math.max(1.5, cfg.stroke * sc * 1.3);
        ctx.strokeStyle = it.kw ? kwColor : (it.second && !kwOn ? accent : '#fff');
        ctx.lineJoin = 'round';
        ctx.strokeText(txt, x, cy);
      } else {
        if (cfg.stroke) {
          ctx.lineWidth = cfg.stroke * sc * 2;
          ctx.strokeStyle = cfg.strokeColor || '#000';
          ctx.lineJoin = 'round';
          ctx.strokeText(txt, x, cy);
        }
        ctx.fillStyle = itemFill;
        ctx.fillText(txt, x, cy);
      }
    });
  });

  ctx.restore();
}

// ===== Export de la vidéo =====
const MIME_CHOICES = [
  'video/mp4;codecs=avc1.42E01E,mp4a.40.2',
  'video/mp4',
  'video/webm;codecs=vp9,opus',
  'video/webm;codecs=vp8,opus',
  'video/webm'
];

async function exportVideo() {
  if (!selectedFile) {
    showToast('Importez d’abord une vidéo.');
    return;
  }

  if (!segments.length) {
    showToast('Générez d’abord les sous-titres IA.');
    return;
  }

  if (typeof MediaRecorder === 'undefined' || !HTMLCanvasElement.prototype.captureStream) {
    showToast('Ce navigateur ne permet pas l’export vidéo. Essayez Chrome.');
    return;
  }

  const idleLabel = 'Exporter la vidéo sous-titrée';
  exportVideoButton.disabled = true;
  exportVideoButton.textContent = 'Préparation...';
  videoPreview.pause();
  stopPreviewMusic();
  stopSample();

  let audioCtx = null;
  let objectUrl = null;

  try {
    try {
      const fsel = FONTS[Number(fontSelect.value)];
      const cfgNow = Object.assign({}, STYLE_BASE, STYLE_CFG[activeStyle] || {});
      const fam = fsel[1] || cfgNow.family;
      const wt = fsel[1] ? fsel[2] : cfgNow.weight;
      await document.fonts.load(wt + ' 20px ' + fam);
      await document.fonts.load('700 20px ' + fam);
      await document.fonts.load("800 20px 'DM Sans'");
    } catch (e) {
      console.warn('Chargement de police :', e);
    }

    if (document.fonts && document.fonts.ready) {
      await document.fonts.ready;
    }

    const vid = document.createElement('video');
    objectUrl = URL.createObjectURL(selectedFile);
    vid.src = objectUrl;
    vid.playsInline = true;
    vid.preload = 'auto';

    await new Promise((resolve, reject) => {
      vid.onloadedmetadata = resolve;
      vid.onerror = () => reject(new Error('Lecture de la vidéo impossible.'));
    });

    const vw = vid.videoWidth || 720;
    const vh = vid.videoHeight || 1280;
    const rr = formatRatio();
    let w;
    let h;

    if (!rr) {
      const ratio = Math.min(1, 1280 / Math.max(vw, vh));
      w = Math.max(2, Math.round((vw * ratio) / 2) * 2);
      h = Math.max(2, Math.round((vh * ratio) / 2) * 2);
    } else {
      const cap = rr === 1 ? 1080 : 1280;
      const long = Math.min(cap, Math.max(720, Math.max(vw, vh)));
      if (rr < 1) {
        h = long;
        w = long * rr;
      } else {
        w = long;
        h = long / rr;
      }
      w = Math.max(2, Math.round(w / 2) * 2);
      h = Math.max(2, Math.round(h / 2) * 2);
    }

    const canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d');

    const stream = canvas.captureStream(30);

    // Son : voix + musique + effets
    let hasAudio = false;
    let voiceGain = null;
    let musicNode = null;
    let sfxGain = null;

    try {
      const AC = window.AudioContext || window.webkitAudioContext;
      audioCtx = new AC();
      await audioCtx.resume();

      const srcNode = audioCtx.createMediaElementSource(vid);
      const dest = audioCtx.createMediaStreamDestination();

      voiceGain = audioCtx.createGain();
      voiceGain.gain.value = voiceVolume;
      srcNode.connect(voiceGain);
      voiceGain.connect(dest);

      if (musicBuffer) {
        const msrc = audioCtx.createBufferSource();
        msrc.buffer = musicBuffer;
        msrc.loop = true;
        const mg = audioCtx.createGain();
        mg.gain.value = 0;
        msrc.connect(mg);
        mg.connect(dest);
        musicNode = { src: msrc, gain: mg, cur: 0 };
      }

      sfxGain = audioCtx.createGain();
      sfxGain.gain.value = sfxVolume;
      sfxGain.connect(dest);

      dest.stream.getAudioTracks().forEach(tr => stream.addTrack(tr));
      hasAudio = true;
    } catch (e) {
      console.warn('Son non capturé :', e);
    }

    const mime = MIME_CHOICES.find(m => MediaRecorder.isTypeSupported(m)) || '';
    const recorder = new MediaRecorder(
      stream,
      mime ? { mimeType: mime, videoBitsPerSecond: 5000000 } : { videoBitsPerSecond: 5000000 }
    );

    const trimmed = isTrimmed();
    const startT = trimmed ? trimStart : 0;
    const endT = trimmed ? getTrimEnd() : vid.duration;
    const fit = rr ? fitMode : 'cover';

    if (startT > 0.05) {
      await new Promise(resolve => {
        const done = () => {
          vid.onseeked = null;
          resolve();
        };
        vid.onseeked = done;
        setTimeout(done, 3000);
        vid.currentTime = startT;
      });
    }

    const sfxList = sfxEventsList().filter(e => e.t >= startT - 0.01);
    let sfxIdx = 0;

    showToast(
      'Export en cours : gardez cet écran ouvert jusqu’à la fin de la vidéo.' +
      (hasAudio ? '' : ' (Son non disponible sur ce navigateur.)')
    );

    const blob = await new Promise((resolve, reject) => {
      const chunks = [];

      recorder.ondataavailable = e => {
        if (e.data && e.data.size) chunks.push(e.data);
      };

      recorder.onstop = () =>
        resolve(new Blob(chunks, { type: recorder.mimeType || mime || 'video/webm' }));

      recorder.onerror = e => reject((e && e.error) || new Error('Erreur d’enregistrement.'));

      vid.onended = () => {
        if (recorder.state !== 'inactive') recorder.stop();
      };

      const draw = () => {
        if (trimmed && vid.currentTime >= endT - 0.02) {
          vid.pause();
          if (recorder.state !== 'inactive') recorder.stop();
          return;
        }

        if (silenceOn && silences.length && !vid.seeking) {
          const cur = vid.currentTime;
          const sl = silences.find(x => cur >= x.from && cur < x.to);
          if (sl) vid.currentTime = sl.to;
        }

        const tcur = vid.currentTime;

        drawVideoFrame(ctx, vid, vw, vh, w, h, zoomAt(tcur), fit);
        drawCaption(ctx, w, h, tcur);
        drawHook(ctx, w, h, tcur);

        const ff = fadeFactor(tcur);
        if (ff < 0.999) {
          ctx.fillStyle = 'rgba(0,0,0,' + (1 - ff).toFixed(3) + ')';
          ctx.fillRect(0, 0, w, h);
        }

        if (voiceGain) voiceGain.gain.value = voiceVolume * ff;

        if (musicNode) {
          const target = musicVolume * duckFactor(tcur) * ff;
          musicNode.cur += (target - musicNode.cur) * 0.2;
          musicNode.gain.gain.value = musicNode.cur;
        }

        if (sfxGain) {
          while (sfxIdx < sfxList.length && sfxList[sfxIdx].t <= tcur) {
            const e = sfxList[sfxIdx];
            if (tcur - e.t < 0.5) {
              playSfx(audioCtx, sfxGain, e.kind, audioCtx.currentTime, customSfx[e.slot]);
            }
            sfxIdx++;
          }
        }

        const span = Math.max(0.1, endT - startT);
        const pct = Math.min(100, Math.max(0, Math.round(((tcur - startT) / span) * 100)));
        exportVideoButton.textContent = 'Export en cours... ' + pct + '%';

        if (!vid.ended && recorder.state !== 'inactive') {
          requestAnimationFrame(draw);
        }
      };

      recorder.start(1000);

      vid.play()
        .then(() => {
          if (musicNode) {
            const off = musicBuffer ? musicStart % musicBuffer.duration : 0;
            musicNode.src.start(0, off);
          }
          requestAnimationFrame(draw);
        })
        .catch(() => {
          reject(new Error('Lecture bloquée. Touchez de nouveau le bouton d’export.'));
          if (recorder.state !== 'inactive') recorder.stop();
        });
    });

    const ext = blob.type.includes('mp4') ? 'mp4' : 'webm';
    downloadBlob(blob, baseName() + '-sous-titres.' + ext);
    showToast(
      'Vidéo exportée (' + ext.toUpperCase() + ').' +
      (creditsText() ? ' Pensez à copier les crédits des sons dans la description.' : '')
    );
  } catch (error) {
    console.error('Erreur export :', error);
    showToast(error.message || 'Export impossible.');
  } finally {
    if (audioCtx) audioCtx.close().catch(() => {});
    if (objectUrl) URL.revokeObjectURL(objectUrl);
    exportVideoButton.disabled = false;
    exportVideoButton.textContent = idleLabel;
  }
}

updateCreditsView();
