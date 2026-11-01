// ===== JUSTEVIVO · PARTIE 1 sur 2 · fichier app.js =====
const videoInput = document.getElementById('videoInput');
const videoPreview = document.getElementById('videoPreview');
const placeholder = document.getElementById('placeholderPreview');
const fileName = document.getElementById('fileName');
const captionText = document.getElementById('captionText');
const captionPreview = document.getElementById('captionPreview');
const previewFrame = document.getElementById('previewFrame');
const colorInput = document.getElementById('captionColor');
const toast = document.getElementById('toast');

const API_URL = 'https://justevivo-backend.onrender.com';

// Affiche les erreurs du script directement sur la page
window.addEventListener('error', ev => {
  try {
    toast.textContent = 'Erreur : ' + (ev.message || 'inconnue') +
      (ev.lineno ? ' (ligne ' + ev.lineno + ')' : '');
    toast.classList.add('show');
  } catch (e) { /* rien */ }
});

const STYLES = [
  ['pop', 'POP'], ['neon', 'NÉON'], ['clean', 'ÉPURÉ'], ['impact', 'IMPACT'],
  ['tiktok', 'TIKTOK'], ['boite', 'BOÎTE'], ['marker', 'SURLIGNEUR'], ['retro3d', 'RÉTRO 3D'],
  ['degrade', 'DÉGRADÉ'], ['cinema', 'CINÉMA'], ['machine', 'MACHINE'], ['comic', 'COMIC'],
  ['rose', 'NÉON ROSE'], ['verre', 'VERRE'], ['fin', 'FIN'], ['feu', 'FEU'],
  ['elegant', 'ÉLÉGANT'], ['contour', 'CONTOUR'], ['glace', 'GLACE'], ['or', 'OR'],
  ['bande', 'BANDEAU'], ['ombre', 'OMBRE'], ['neonvert', 'NÉON VERT'], ['neonjaune', 'NÉON JAUNE'],
  ['sunset', 'COUCHER'], ['ocean', 'OCÉAN'], ['chrome', 'CHROME'], ['sticker', 'AUTOCOLLANT'],
  ['jaune', 'JAUNE'], ['blanc', 'BLANC'], ['minimal', 'MINIMAL'], ['pixel', 'PIXEL']
];

// [nom affiché, famille CSS, graisse, taille]
const FONTS = [
  ['Auto (selon le style)', '', '', ''],
  ['Montserrat', "'Montserrat', sans-serif", '800', ''],
  ['Poppins', "'Poppins', sans-serif", '700', ''],
  ['Inter', "'Inter', sans-serif", '800', ''],
  ['Roboto', "'Roboto', sans-serif", '900', ''],
  ['Raleway', "'Raleway', sans-serif", '800', ''],
  ['Oswald', "'Oswald', sans-serif", '700', ''],
  ['Anton', "'Anton', sans-serif", '400', '26px'],
  ['Bebas Neue', "'Bebas Neue', sans-serif", '400', '28px'],
  ['Archivo Black', "'Archivo Black', sans-serif", '400', ''],
  ['Russo One', "'Russo One', sans-serif", '400', ''],
  ['Righteous', "'Righteous', sans-serif", '400', ''],
  ['Bangers', "'Bangers', cursive", '400', '27px'],
  ['Luckiest Guy', "'Luckiest Guy', cursive", '400', '25px'],
  ['Permanent Marker', "'Permanent Marker', cursive", '400', ''],
  ['Pacifico', "'Pacifico', cursive", '400', ''],
  ['Lobster', "'Lobster', cursive", '400', '26px'],
  ['Dancing Script', "'Dancing Script', cursive", '700', '26px'],
  ['Caveat', "'Caveat', cursive", '700', '28px'],
  ['Playfair Display', "'Playfair Display', serif", '800', ''],
  ['Press Start 2P (rétro)', "'Press Start 2P', monospace", '400', '13px']
];

const MODES = [
  ['all', 'Phrase complète'],
  ['progressive', 'Mot par mot (progressif)'],
  ['single', 'Un seul mot à la fois']
];

const KEYWORD_MODES = [
  ['off', 'Aucun'],
  ['auto', 'Automatique'],
  ['strong', 'Automatique (plus de mots)']
];

// [identifiant, nom, distance du bas en %]
const POSITIONS = [
  ['top', 'Haut', 78],
  ['middle', 'Milieu', 44],
  ['bottom', 'Bas', 14],
  ['custom', 'Personnalisée (curseur)', null]
];

// [identifiant, nom, rapport largeur/hauteur (0 = original)]
const FORMATS = [
  ['original', 'Original (comme la vidéo)', 0],
  ['9:16', 'Vertical 9:16 (TikTok, Reels, Shorts)', 9 / 16],
  ['1:1', 'Carré 1:1', 1],
  ['4:5', 'Portrait 4:5 (Instagram)', 4 / 5],
  ['16:9', 'Horizontal 16:9 (YouTube)', 16 / 9]
];

const STYLE_TABS = [
  ['all', 'Tous', null],
  ['classic', 'Classique', ['pop', 'clean', 'impact', 'cinema', 'elegant', 'minimal', 'fin', 'ombre', 'blanc', 'jaune', 'bande', 'boite']],
  ['neon', 'Néon', ['neon', 'neonvert', 'neonjaune', 'rose', 'glace', 'feu']],
  ['color', 'Couleur', ['degrade', 'sunset', 'ocean', 'chrome', 'or', 'marker', 'tiktok', 'retro3d', 'sticker', 'contour']],
  ['emoji', 'Emojis', ['pop', 'tiktok', 'impact', 'comic', 'sticker', 'boite', 'jaune', 'blanc', 'verre']],
  ['story', 'Storytelling', ['cinema', 'elegant', 'machine', 'fin', 'minimal', 'verre', 'pixel', 'bande']],
  ['mine', 'Mes styles', null]
];

const PRESET_KEY = 'justevivo_styles_v1';

const EMOJI_GROUPS = [
  ['💰', 'argent money cash fric thune riche richesse salaire revenu euro euros dollar dollars'],
  ['💸', 'depenser depense payer paie facture dette frais'],
  ['📈', 'croissance croitre augmenter hausse monter progresser growth profit benefice'],
  ['📉', 'baisse baisser perdre perte chute'],
  ['🔥', 'feu fire chaud hot viral tendance trending'],
  ['❤️', 'amour love coeur aimer adore passion'],
  ['😂', 'rire drole fun lol blague funny'],
  ['😱', 'choc wow shock peur horreur'],
  ['🤯', 'dingue fou folie incroyable'],
  ['⭐', 'etoile star meilleur favori'],
  ['🏆', 'gagnant victoire champion trophee winner win succes success reussir reussite'],
  ['🎯', 'objectif cible goal target viser'],
  ['💡', 'idee idea astuce conseil tip secret'],
  ['🚀', 'lancer lancement fusee rapide startup decoller'],
  ['⏰', 'heure minute horloge time urgent'],
  ['📱', 'telephone iphone smartphone mobile application app'],
  ['💻', 'ordinateur computer pc code logiciel site internet web'],
  ['🎬', 'video film cinema tournage camera'],
  ['🎵', 'musique music chanson chanter song'],
  ['📚', 'livre apprendre formation cours etudier lecture'],
  ['🏠', 'maison home appartement logement domicile immobilier loyer'],
  ['🚗', 'voiture auto car conduire route'],
  ['✈️', 'avion voyage voyager vacances vol travel'],
  ['🍕', 'pizza manger repas nourriture food'],
  ['☕', 'cafe coffee'],
  ['💪', 'force muscle sport muscler courage energie'],
  ['🧠', 'cerveau intelligent penser pensee mental brain mind'],
  ['👀', 'regarder regardez look attention'],
  ['👉', 'ici voici clique cliquer lien'],
  ['✅', 'valider vrai correct exact verifie'],
  ['❌', 'faux erreur interdit'],
  ['⚠️', 'danger risque piege arnaque warning'],
  ['🙏', 'merci thanks priere'],
  ['👍', 'super parfait genial cool excellent'],
  ['🎉', 'fete celebrer bravo anniversaire party'],
  ['🌍', 'monde world planete terre'],
  ['🌞', 'soleil sun ete'],
  ['🌙', 'nuit lune dormir sommeil'],
  ['😍', 'magnifique beau belle beaute adorable'],
  ['🤝', 'accord partenaire partenariat deal contrat equipe'],
  ['🔒', 'securite secure prive'],
  ['🛒', 'acheter achat boutique magasin shopping vendre vente'],
  ['📞', 'appeler appel contact'],
  ['📩', 'email mail message courriel'],
  ['🇫🇷', 'france francais'],
  ['🏢', 'entreprise societe business bureau company'],
  ['📝', 'document ecrire notes'],
  ['🧾', 'impot impots taxe taxes tva fiscal'],
  ['😢', 'triste pleurer larmes sad'],
  ['😎', 'swag style']
];

const EMOJI_MAP = new Map();
EMOJI_GROUPS.forEach(([emo, words]) => {
  words.split(' ').forEach(w => {
    if (!EMOJI_MAP.has(w)) EMOJI_MAP.set(w, emo);
  });
});

const DEFAULTS = {
  size: 100,
  words: 6,
  width: 90,
  lineHeight: 120,
  spacing: 0
};

const STOPWORDS = new Set((
  'alors aucun aussi autre autres avant avec avoir avez avons avait bien beaucoup ' +
  'cette ceux chaque comme comment dans donc elle elles encore entre être était ' +
  'étaient fait faire mais même moins notre nous nouveau votre vous leur leurs ' +
  'parce pendant plus pour pourquoi quand quel quelle quels sans selon sont sous ' +
  'tout tous toute toutes très trop vers voici voilà cela celui celle ces cet ceci ' +
  'ainsi après depuis enfin jamais déjà peut peux veux veut dont lorsque puisque ' +
  'rien chose choses about because their there these those would could should ' +
  'which where while with from have this that what when your just like really ' +
  'going know think being other every again still much very'
).split(' '));

let activeStyle = 'pop';
let displayMode = 'all';
let kwMode = 'off';
let emojiMode = 'off';
let positionPercent = 14;
let captionAttached = false;
let selectedFile = null;
let currentTab = 'all';
let presets = loadPresets();

let formatId = 'original';
let fitMode = 'cover';
let trimStart = 0;
let trimEnd = 0;

let sizeScale = DEFAULTS.size / 100;
let maxWords = DEFAULTS.words;
let widthPercent = DEFAULTS.width;
let lineHeight = DEFAULTS.lineHeight / 100;
let letterGap = DEFAULTS.spacing / 100;
let upperCase = false;

let zoomOn = false;
let zoomLevel = 1.18;
let silenceOn = false;
let silenceMin = 0.7;
let silences = [];
let hookSeconds = 3;
let hookScale = 1;
let hookTop = 12;

let baseSegments = [];
let segments = [];
let edited = false;
let lastShown = null;

function showToast(message) {
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => toast.classList.remove('show'), 4000);
}

function loadPresets() {
  try {
    const raw = localStorage.getItem(PRESET_KEY);
    const arr = raw ? JSON.parse(raw) : [];
    return Array.isArray(arr) ? arr : [];
  } catch (e) {
    return [];
  }
}

function storePresets(arr) {
  try {
    localStorage.setItem(PRESET_KEY, JSON.stringify(arr));
    return true;
  } catch (e) {
    return false;
  }
}

function normWord(w) {
  return w.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]/g, '');
}

function emojiForWord(w) {
  const n = normWord(w);
  if (!n) return '';
  return EMOJI_MAP.get(n) || EMOJI_MAP.get(n.replace(/(s|x)$/, '')) || '';
}

function emojiIndexes(words) {
  const map = new Map();
  if (emojiMode === 'off') return map;
  const used = new Set();
  for (let i = 0; i < words.length && map.size < 2; i++) {
    const e = emojiForWord(words[i]);
    if (e && !used.has(e)) {
      map.set(i, e);
      used.add(e);
    }
  }
  return map;
}

// Polices Google Fonts
const fontLink = document.createElement('link');
fontLink.rel = 'stylesheet';
fontLink.href =
  'https://fonts.googleapis.com/css2' +
  '?family=Anton&family=Archivo+Black&family=Bangers&family=Bebas+Neue' +
  '&family=Caveat:wght@700&family=Dancing+Script:wght@700&family=Inter:wght@800' +
  '&family=Lobster&family=Luckiest+Guy&family=Montserrat:wght@800&family=Oswald:wght@700' +
  '&family=Pacifico&family=Permanent+Marker&family=Playfair+Display:wght@800' +
  '&family=Poppins:wght@700&family=Press+Start+2P&family=Raleway:wght@800' +
  '&family=Righteous&family=Roboto:wght@900&family=Russo+One&display=swap';
document.head.appendChild(fontLink);

const fontStyle = document.createElement('style');
fontStyle.textContent = `
#captionPreview.custom-font b{font-weight:inherit;font-family:inherit}
#captionPreview.kwon b{color:inherit!important;background:none!important;padding:0!important;-webkit-text-stroke-color:inherit!important}
.preview-frame.contour #captionPreview.kwon .kw{-webkit-text-stroke-color:var(--kw)!important}
.preview-frame.bande .preview-caption{background:#000;color:#fff;font-weight:700;padding:8px 22px!important;border:1px solid var(--accent);border-radius:2px;text-shadow:none}
.preview-frame.ombre .preview-caption{color:#fff;font-weight:700;text-shadow:0 6px 18px #000,0 2px 4px #000}
.preview-frame.neonvert .preview-caption{color:#9dffb0;font-weight:800;text-shadow:0 0 8px #3dff7a,0 0 22px #3dff7a}
.preview-frame.neonjaune .preview-caption{color:#fff9a8;font-weight:800;text-shadow:0 0 8px #ffe600,0 0 22px #ffe600}
.preview-frame.sunset .preview-caption{font-weight:900;background:linear-gradient(90deg,#ff9a3c,#ff4e8b,#a855f7);-webkit-background-clip:text;background-clip:text;color:transparent;filter:drop-shadow(0 2px 4px #000)}
.preview-frame.sunset .preview-caption b{color:transparent!important}
.preview-frame.ocean .preview-caption{font-weight:900;background:linear-gradient(180deg,#b6fff0,#00e0c6,#0088ff);-webkit-background-clip:text;background-clip:text;color:transparent;filter:drop-shadow(0 2px 4px #000)}
.preview-frame.ocean .preview-caption b{color:transparent!important}
.preview-frame.chrome .preview-caption{font-weight:900;background:linear-gradient(180deg,#fff,#b8c4d6,#5d6b82,#c9d5e6);-webkit-background-clip:text;background-clip:text;color:transparent;-webkit-text-stroke:1px #1b2433;paint-order:stroke fill;filter:drop-shadow(0 2px 3px #000)}
.preview-frame.chrome .preview-caption b{color:transparent!important}
.preview-frame.sticker .preview-caption{font-weight:900;color:#111;-webkit-text-stroke:6px #fff;paint-order:stroke fill;text-shadow:none;filter:drop-shadow(0 4px 6px #0008)}
.preview-frame.jaune .preview-caption{background:#ffe600;color:#000;font-weight:900;padding:6px 14px!important;border-radius:4px;text-shadow:none}
.preview-frame.jaune .preview-caption b{color:#000!important}
.preview-frame.blanc .preview-caption{background:#fff;color:#111;font-weight:800;padding:6px 14px!important;border-radius:8px;text-shadow:none}
.preview-frame.minimal .preview-caption{font-weight:500;font-size:18px;color:#fff;text-shadow:0 1px 4px #000}
.preview-frame.minimal .preview-caption b{color:#fff!important;font-weight:700}
.preview-frame.pixel .preview-caption{font-family:'Press Start 2P',monospace;font-weight:400;font-size:13px;line-height:1.7;color:#ffe600;text-shadow:2px 2px 0 #000}
.preview-frame.pixel .preview-caption b{color:#fff!important;font-weight:400}
.style-tile:hover{border-color:#a879ff!important}
.style-tile .preview-caption{animation:none!important}
.style-tile .preview-frame.sticker .preview-caption{-webkit-text-stroke-width:3px!important}
.style-tile .preview-frame.comic .preview-caption{-webkit-text-stroke-width:2px!important}
`;
document.head.appendChild(fontStyle);

// ===== Petits outils pour construire les réglages =====
function styleSelect(select) {
  Object.assign(select.style, {
    width: '100%',
    padding: '10px',
    background: '#0b1122',
    color: '#fff',
    border: '1px solid #34405f',
    borderRadius: '8px',
    fontSize: '12px',
    fontFamily: 'inherit'
  });
}

function addSlider(parent, text, min, max, step, value, fmt, onInput, onChange) {
  const label = document.createElement('label');
  label.className = 'field-label';

  const input = document.createElement('input');
  input.type = 'range';
  input.min = String(min);
  input.max = String(max);
  input.step = String(step);
  input.value = String(value);
  Object.assign(input.style, { width: '100%', accentColor: '#a879ff' });

  const refresh = () => {
    label.textContent = text + ' : ' + fmt(Number(input.value));
  };
  refresh();

  input.addEventListener('input', () => {
    refresh();
    if (onInput) onInput(Number(input.value));
  });
  if (onChange) {
    input.addEventListener('change', () => onChange(Number(input.value)));
  }

  parent.appendChild(label);
  parent.appendChild(input);

  return {
    input,
    set(v) {
      input.value = String(v);
      refresh();
    }
  };
}

function addCheckbox(parent, text, onChange) {
  const label = document.createElement('label');
  Object.assign(label.style, {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '11px',
    color: '#b9c2d8',
    margin: '14px 0 4px'
  });

  const input = document.createElement('input');
  input.type = 'checkbox';
  label.appendChild(input);
  label.appendChild(document.createTextNode(text));
  parent.appendChild(label);

  input.addEventListener('change', () => onChange(input.checked));
  return input;
}

function addSelect(parent, text, options, value, onChange) {
  const label = document.createElement('label');
  label.className = 'field-label';
  label.textContent = text;

  const select = document.createElement('select');
  styleSelect(select);

  options.forEach(([id, name]) => {
    const option = document.createElement('option');
    option.value = id;
    option.textContent = name;
    select.appendChild(option);
  });

  select.value = value;
  select.addEventListener('change', () => onChange(select.value));

  parent.appendChild(label);
  parent.appendChild(select);
  return select;
}

function addNote(parent, text) {
  const div = document.createElement('div');
  div.textContent = text;
  Object.assign(div.style, {
    fontSize: '10px',
    color: '#8994ad',
    margin: '8px 0 0',
    lineHeight: '1.5'
  });
  parent.appendChild(div);
  return div;
}

const colorLabel = document.querySelector('label[for="captionColor"]');

function makeSection(title, open) {
  const details = document.createElement('details');
  details.open = !!open;

  const summary = document.createElement('summary');
  summary.textContent = title;
  Object.assign(summary.style, {
    cursor: 'pointer',
    fontSize: '11px',
    fontWeight: '800',
    color: '#d9c2ff',
    margin: '16px 0 4px'
  });
  details.appendChild(summary);

  colorLabel.parentNode.insertBefore(details, colorLabel);
  return details;
}

// ===== Police =====
const fontLabel = document.createElement('label');
fontLabel.className = 'field-label';
fontLabel.htmlFor = 'captionFont';
fontLabel.textContent = 'Police';

const fontSelect = document.createElement('select');
fontSelect.id = 'captionFont';
styleSelect(fontSelect);
FONTS.forEach((f, i) => {
  const option = document.createElement('option');
  option.value = String(i);
  option.textContent = f[0];
  fontSelect.appendChild(option);
});
colorLabel.parentNode.insertBefore(fontLabel, colorLabel);
colorLabel.parentNode.insertBefore(fontSelect, colorLabel);

// ===== Affichage des mots =====
const modeLabel = document.createElement('label');
modeLabel.className = 'field-label';
modeLabel.htmlFor = 'captionMode';
modeLabel.textContent = 'Affichage des mots';

const modeSelect = document.createElement('select');
modeSelect.id = 'captionMode';
styleSelect(modeSelect);
MODES.forEach(([id, label]) => {
  const option = document.createElement('option');
  option.value = id;
  option.textContent = label;
  modeSelect.appendChild(option);
});
colorLabel.parentNode.insertBefore(modeLabel, colorLabel);
colorLabel.parentNode.insertBefore(modeSelect, colorLabel);

modeSelect.addEventListener('change', () => {
  displayMode = modeSelect.value;
  lastShown = null;
  updateCaption();
  if (displayMode !== 'all' && !segments.length) {
    showToast('Générez d’abord les sous-titres IA pour utiliser ce mode.');
  }
});

// ===== Position du texte =====
const posLabel = document.createElement('label');
posLabel.className = 'field-label';
posLabel.htmlFor = 'captionPosition';
posLabel.textContent = 'Position du texte';

const posSelect = document.createElement('select');
posSelect.id = 'captionPosition';
styleSelect(posSelect);
POSITIONS.forEach(([id, label]) => {
  const option = document.createElement('option');
  option.value = id;
  option.textContent = label;
  if (id === 'bottom') option.selected = true;
  posSelect.appendChild(option);
});

const posSlider = document.createElement('input');
posSlider.type = 'range';
posSlider.id = 'captionPositionSlider';
posSlider.min = '4';
posSlider.max = '80';
posSlider.step = '1';
posSlider.value = String(positionPercent);
Object.assign(posSlider.style, { width: '100%', marginTop: '10px', accentColor: '#a879ff' });

colorLabel.parentNode.insertBefore(posLabel, colorLabel);
colorLabel.parentNode.insertBefore(posSelect, colorLabel);
colorLabel.parentNode.insertBefore(posSlider, colorLabel);

// ===== Mots-clés surlignés =====
const kwLabel = document.createElement('label');
kwLabel.className = 'field-label';
kwLabel.htmlFor = 'keywordMode';
kwLabel.textContent = 'Mots-clés surlignés';

const kwSelect = document.createElement('select');
kwSelect.id = 'keywordMode';
styleSelect(kwSelect);
KEYWORD_MODES.forEach(([id, label]) => {
  const option = document.createElement('option');
  option.value = id;
  option.textContent = label;
  kwSelect.appendChild(option);
});

const kwColorLabel = document.createElement('label');
kwColorLabel.className = 'field-label';
kwColorLabel.htmlFor = 'keywordColor';
kwColorLabel.textContent = 'Couleur des mots-clés';

const kwColorInput = document.createElement('input');
kwColorInput.type = 'color';
kwColorInput.id = 'keywordColor';
kwColorInput.value = '#ffe600';

colorLabel.parentNode.insertBefore(kwLabel, colorLabel);
colorLabel.parentNode.insertBefore(kwSelect, colorLabel);
colorLabel.parentNode.insertBefore(kwColorLabel, colorLabel);
colorLabel.parentNode.insertBefore(kwColorInput, colorLabel);

kwSelect.addEventListener('change', () => {
  kwMode = kwSelect.value;
  lastShown = null;
  updateCaption();
});
kwColorInput.addEventListener('input', () => {
  lastShown = null;
  updateCaption();
});

// ===== Emojis automatiques =====
const emojiLabel = document.createElement('label');
emojiLabel.className = 'field-label';
emojiLabel.htmlFor = 'emojiMode';
emojiLabel.textContent = 'Emojis automatiques';

const emojiSelect = document.createElement('select');
emojiSelect.id = 'emojiMode';
styleSelect(emojiSelect);
[['off', 'Aucun'], ['auto', 'Automatique']].forEach(([id, label]) => {
  const option = document.createElement('option');
  option.value = id;
  option.textContent = label;
  emojiSelect.appendChild(option);
});
colorLabel.parentNode.insertBefore(emojiLabel, colorLabel);
colorLabel.parentNode.insertBefore(emojiSelect, colorLabel);

emojiSelect.addEventListener('change', () => {
  emojiMode = emojiSelect.value;
  lastShown = null;
  updateCaption();
});

// ===== Format et découpage =====
const fmtBox = makeSection('Format et découpage', false);

const fmtSelect = addSelect(
  fmtBox, 'Format de la vidéo finale',
  FORMATS.map(f => [f[0], f[1]]), 'original',
  v => {
    formatId = v;
    layoutPreview();
    lastShown = null;
    updateCaption();
    updateHook();
    applyZoom();
  }
);

const fitSelect = addSelect(
  fmtBox, 'Ajustement de l’image',
  [['cover', 'Remplir le cadre (recadrer)'], ['contain', 'Garder toute l’image (bandes noires)']],
  'cover',
  v => {
    fitMode = v;
    layoutPreview();
  }
);

const trimStartSlider = addSlider(
  fmtBox, 'Début de la vidéo', 0, 100, 0.1, 0,
  v => v.toFixed(1) + ' s',
  v => {
    const e = trimEnd > 0 ? trimEnd : (videoPreview.duration || 100);
    if (v > e - 0.5) {
      v = Math.max(0, e - 0.5);
      trimStartSlider.set(v);
    }
    trimStart = v;
    updateTrimInfo();
    updateHook();
  },
  () => {
    if (isFinite(videoPreview.duration)) videoPreview.currentTime = trimStart;
  }
);

const trimEndSlider = addSlider(
  fmtBox, 'Fin de la vidéo', 0, 100, 0.1, 100,
  v => v.toFixed(1) + ' s',
  v => {
    if (v < trimStart + 0.5) {
      v = Math.min(Number(trimEndSlider.input.max), trimStart + 0.5);
      trimEndSlider.set(v);
    }
    trimEnd = v;
    updateTrimInfo();
  },
  () => {
    if (isTrimmed()) {
      videoPreview.currentTime = Math.max(trimStart, getTrimEnd() - 1);
    }
  }
);

const trimInfo = addNote(fmtBox, '');

function getTrimEnd() {
  const d = videoPreview.duration;
  if (!isFinite(d) || !d) return Infinity;
  return (trimEnd > 0 && trimEnd < d - 0.15) ? trimEnd : d;
}

function isTrimmed() {
  const d = videoPreview.duration;
  return isFinite(d) && d > 0 && (trimStart > 0.05 || getTrimEnd() < d - 0.15);
}

function outputDuration() {
  const d = videoPreview.duration;
  if (!isFinite(d) || !d) return 0;

  const a = trimStart;
  const b = getTrimEnd();
  let len = b - a;

  if (silenceOn) {
    silences.forEach(s => {
      const from = Math.max(s.from, a);
      const to = Math.min(s.to, b);
      if (to > from) len -= to - from;
    });
  }
  return Math.max(0, len);
}

function updateTrimInfo() {
  const d = videoPreview.duration;
  if (!isFinite(d) || !d) {
    trimInfo.textContent = 'Importez une vidéo pour régler le découpage.';
    return;
  }
  trimInfo.textContent =
    'Durée finale : ' + outputDuration().toFixed(1) + ' s' + (isTrimmed() ? ' (découpée)' : '');
}

function initTrim() {
  const d = videoPreview.duration;
  if (!isFinite(d) || !d) return;

  trimStart = 0;
  trimEnd = d;
  trimStartSlider.input.max = String(d);
  trimEndSlider.input.max = String(d);
  trimStartSlider.set(0);
  trimEndSlider.set(d);
  updateTrimInfo();
}

function enforceTrim() {
  if (!isTrimmed() || videoPreview.paused) return;

  const t = videoPreview.currentTime;
  const e = getTrimEnd();

  if (t < trimStart - 0.05) {
    videoPreview.currentTime = trimStart;
  } else if (t >= e - 0.02) {
    videoPreview.pause();
    videoPreview.currentTime = trimStart;
  }
}

function formatRatio() {
  const f = FORMATS.find(x => x[0] === formatId);
  return f ? f[2] : 0;
}

function layoutPreview() {
  const r = formatRatio();

  if (!r) {
    previewFrame.style.width = '';
    previewFrame.style.height = '';
    previewFrame.style.margin = '';
    videoPreview.style.objectFit = '';
    return;
  }

  const holder = previewFrame.parentElement;
  const cw = Math.max(120, (holder ? holder.clientWidth : 300) - 28);
  const w = Math.min(cw, 380 * r);
  const h = w / r;

  previewFrame.style.width = Math.round(w) + 'px';
  previewFrame.style.height = Math.round(h) + 'px';
  previewFrame.style.margin = '0 auto';
  videoPreview.style.objectFit = fitMode === 'cover' ? 'cover' : 'contain';
}

function previewScale() {
  if (!formatRatio()) return 1;
  const fw = previewFrame.clientWidth || 200;
  const fh = previewFrame.clientHeight || 240;
  return Math.min(fh / 240, fw / 200);
}

window.addEventListener('resize', () => {
  layoutPreview();
  lastShown = null;
  updateCaption();
  updateHook();
});

// ===== Réglages du texte =====
const advBox = makeSection('Réglages du texte (taille, lignes...)', true);

const sizeSlider = addSlider(
  advBox, 'Taille du texte', 50, 200, 5, DEFAULTS.size,
  v => v + ' %',
  v => {
    sizeScale = v / 100;
    lastShown = null;
    updateCaption();
  }
);

const wordsSlider = addSlider(
  advBox, 'Mots par sous-titre', 2, 10, 1, DEFAULTS.words,
  v => String(v),
  null,
  v => applyMaxWords(v)
);

const widthSlider = addSlider(
  advBox, 'Largeur du texte', 50, 100, 5, DEFAULTS.width,
  v => v + ' %',
  v => {
    widthPercent = v;
    lastShown = null;
    updateCaption();
  }
);

const lineSlider = addSlider(
  advBox, 'Interligne', 90, 200, 5, DEFAULTS.lineHeight,
  v => (v / 100).toFixed(2),
  v => {
    lineHeight = v / 100;
    lastShown = null;
    updateCaption();
  }
);

const spacingSlider = addSlider(
  advBox, 'Espacement des lettres', -5, 30, 1, DEFAULTS.spacing,
  v => (v / 100).toFixed(2) + ' em',
  v => {
    letterGap = v / 100;
    lastShown = null;
    updateCaption();
  }
);

const upperInput = addCheckbox(advBox, 'Tout en majuscules', checked => {
  upperCase = checked;
  lastShown = null;
  updateCaption();
});

const resetButton = document.createElement('button');
resetButton.type = 'button';
resetButton.className = 'button ghost full';
resetButton.textContent = 'Réinitialiser ces réglages';
advBox.appendChild(resetButton);

resetButton.addEventListener('click', () => {
  sizeScale = DEFAULTS.size / 100;
  widthPercent = DEFAULTS.width;
  lineHeight = DEFAULTS.lineHeight / 100;
  letterGap = DEFAULTS.spacing / 100;
  upperCase = false;

  sizeSlider.set(DEFAULTS.size);
  widthSlider.set(DEFAULTS.width);
  lineSlider.set(DEFAULTS.lineHeight);
  spacingSlider.set(DEFAULTS.spacing);
  upperInput.checked = false;

  wordsSlider.set(DEFAULTS.words);
  applyMaxWords(DEFAULTS.words);

  lastShown = null;
  updateCaption();
  showToast('Réglages du texte réinitialisés.');
});

// ===== Titre d'accroche =====
const hookBox = makeSection('Titre d’accroche', false);

const hookLabel = document.createElement('label');
hookLabel.className = 'field-label';
hookLabel.htmlFor = 'hookText';
hookLabel.textContent = 'Texte affiché au début de la vidéo';
hookBox.appendChild(hookLabel);

const hookInput = document.createElement('input');
hookInput.type = 'text';
hookInput.id = 'hookText';
hookInput.maxLength = 120;
hookInput.placeholder = 'Ex : Le secret pour économiser 1000 €';
Object.assign(hookInput.style, {
  width: '100%',
  padding: '10px',
  background: '#0b1122',
  color: '#fff',
  border: '1px solid #34405f',
  borderRadius: '8px',
  fontSize: '12px',
  fontFamily: 'inherit'
});
hookBox.appendChild(hookInput);

addSlider(hookBox, 'Durée d’affichage', 1, 10, 0.5, hookSeconds, v => v + ' s', v => {
  hookSeconds = v;
  updateHook();
});
addSlider(hookBox, 'Taille du titre', 60, 180, 10, 100, v => v + ' %', v => {
  hookScale = v / 100;
  updateHook();
});
addSlider(hookBox, 'Position du titre (depuis le haut)', 4, 70, 1, hookTop, v => v + ' %', v => {
  hookTop = v;
  updateHook();
});

hookInput.addEventListener('input', () => updateHook());

// ===== Zooms automatiques =====
const zoomBox = makeSection('Zooms automatiques', false);

addCheckbox(zoomBox, 'Activer les zooms (une phrase sur deux)', checked => {
  zoomOn = checked;
  applyZoom();
  if (checked && !baseSegments.length) {
    showToast('Générez les sous-titres IA : les zooms suivent les phrases.');
  }
});
addSlider(zoomBox, 'Intensité du zoom', 105, 150, 1, 118, v => v + ' %', v => {
  zoomLevel = v / 100;
  applyZoom();
});
addNote(zoomBox, 'Le zoom se voit pendant la lecture et dans la vidéo exportée.');

// ===== Suppression des silences =====
const silenceBox = makeSection('Suppression des silences', false);

addCheckbox(silenceBox, 'Supprimer les silences', checked => {
  silenceOn = checked;
  computeSilences();
  updateSilenceInfo();
  updateHook();

  if (checked && !baseSegments.length) {
    showToast('Générez d’abord les sous-titres IA.');
  } else if (checked) {
    showToast('À utiliser pour la parole : dans une chanson, les passages sans voix seraient coupés.');
  }
});
addSlider(silenceBox, 'Silence minimal à supprimer', 0.3, 2, 0.1, silenceMin, v => v.toFixed(1) + ' s', v => {
  silenceMin = v;
  computeSilences();
  updateSilenceInfo();
});

const silenceInfo = addNote(silenceBox, '');

function rawSpeech() {
  const speech = [];

  baseSegments.forEach(b => {
    const n = b.text.split(/\s+/).filter(Boolean).length;
    if (n > 0 && b.starts && b.ends && b.starts.length === n && b.ends.length === n) {
      for (let i = 0; i < n; i++) speech.push([b.starts[i], b.ends[i]]);
    } else {
      speech.push([b.start, b.end]);
    }
  });

  speech.sort((a, b) => a[0] - b[0]);
  return speech;
}

function computeSilences() {
  silences = [];
  if (!silenceOn || !baseSegments.length) return;

  const PAD = 0.15;
  let prevEnd = 0;

  rawSpeech().forEach(([s, e]) => {
    if (s - prevEnd >= silenceMin) {
      const a = prevEnd === 0 ? 0 : prevEnd + PAD;
      const b = s - PAD;
      if (b - a >= 0.15) silences.push({ from: a, to: b });
    }
    prevEnd = Math.max(prevEnd, e);
  });

  const dur = videoPreview.duration;
  if (isFinite(dur) && dur - prevEnd >= silenceMin) {
    const a = prevEnd + PAD;
    const b = dur - 0.05;
    if (b - a >= 0.15) silences.push({ from: a, to: b });
  }
}

function updateSilenceInfo() {
  if (!baseSegments.length) {
    silenceInfo.textContent = 'Générez d’abord les sous-titres IA.';
  } else if (!silenceOn) {
    silenceInfo.textContent = 'Désactivé.';
  } else {
    const total = silences.reduce((sum, s) => sum + (s.to - s.from), 0);
    silenceInfo.textContent =
      silences.length + ' silence(s) supprimé(s) · ' + total.toFixed(1) + ' s gagnées';
  }
  updateTrimInfo();
}

function compressTime(t) {
  let removed = 0;
  for (const s of silences) {
    if (t >= s.to) removed += s.to - s.from;
    else if (t > s.from) removed += t - s.from;
    else break;
  }
  return Math.max(0, t - removed);
}

function outTime(t) {
  const useSil = silenceOn && silences.length;
  const base = useSil ? compressTime(t) : t;
  const off = trimStart > 0.05 ? (useSil ? compressTime(trimStart) : trimStart) : 0;
  return Math.max(0, base - off);
}

function skipSilence() {
  if (!silenceOn || !silences.length || videoPreview.paused) return;
  const t = videoPreview.currentTime;
  const s = silences.find(x => t >= x.from && t < x.to);
  if (s) videoPreview.currentTime = s.to;
}

function zoomAt(t) {
  if (!zoomOn) return 1;

  const list = baseSegments.length ? baseSegments : segments;
  const i = list.findIndex(s => t >= s.start && t < s.end);
  if (i < 0 || i % 2 === 0) return 1;

  const s = list[i];
  const ramp = 0.3;
  const a = Math.min(1, Math.max(0, (t - s.start) / ramp));
  const b = Math.min(1, Math.max(0, (s.end - t) / ramp));
  const k = Math.min(a, b);
  const e = k * k * (3 - 2 * k);
  return 1 + (zoomLevel - 1) * e;
}

function applyZoom() {
  const z = videoPreview.paused ? 1 : zoomAt(videoPreview.currentTime || 0);
  videoPreview.style.transformOrigin = 'center center';
  videoPreview.style.transform = z > 1.0005 ? 'scale(' + z.toFixed(4) + ')' : '';
}

// Titre d'accroche dans l'aperçu
const hookPreview = document.createElement('div');
hookPreview.id = 'hookPreview';
Object.assign(hookPreview.style, {
  position: 'absolute',
  left: '0',
  right: '0',
  margin: '0 auto',
  width: 'fit-content',
  maxWidth: '86%',
  padding: '6px 12px',
  background: '#fff',
  color: '#111',
  borderRadius: '12px',
  fontWeight: '800',
  lineHeight: '1.25',
  textAlign: 'center',
  zIndex: '6',
  pointerEvents: 'none',
  display: 'none',
  boxShadow: '0 4px 14px rgba(0,0,0,0.35)'
});

function updateHook() {
  if (!captionAttached) return;

  const txt = hookInput.value.trim();
  const t = outTime(videoPreview.currentTime || 0);
  const show = txt && t < hookSeconds;

  hookPreview.style.display = show ? 'block' : 'none';

  if (show) {
    if (hookPreview.textContent !== txt) hookPreview.textContent = txt;
    hookPreview.style.fontSize = (14 * hookScale * previewScale()) + 'px';
    hookPreview.style.top = hookTop + '%';
  }
}

function applyMaxWords(v) {
  if (v === maxWords) return;

  if (
    baseSegments.length && edited &&
    !confirm('Changer ce réglage efface vos corrections du texte. Continuer ?')
  ) {
    wordsSlider.set(maxWords);
    return;
  }

  maxWords = v;

  if (baseSegments.length) {
    rebuildSegments();
    edited = false;
    captionText.value = segments.map(s => s.text).join('\n');
  }

  lastShown = null;
  updateCaption();
}

function applyPosition() {
  if (!captionAttached) return;
  captionPreview.style.bottom = positionPercent + '%';
  captionPreview.style.top = 'auto';
}

posSelect.addEventListener('change', () => {
  const preset = POSITIONS.find(p => p[0] === posSelect.value);
  if (preset && preset[2] !== null) {
    positionPercent = preset[2];
    posSlider.value = String(positionPercent);
  }
  applyPosition();
  if (!captionAttached) {
    showToast('Importez une vidéo pour voir la position du texte.');
  }
});

posSlider.addEventListener('input', () => {
  positionPercent = Number(posSlider.value);
  posSelect.value = 'custom';
  applyPosition();
});

function applyTypography() {
  const f = FONTS[Number(fontSelect.value)];
  const s = captionPreview.style;

  s.fontFamily = f[1] || '';
  s.fontWeight = f[1] ? f[2] : '';
  s.fontSize = f[1] ? f[3] : '';
  captionPreview.classList.toggle('custom-font', !!f[1]);

  const base = parseFloat(getComputedStyle(captionPreview).fontSize) || 23;
  s.fontSize = (base * sizeScale * previewScale()) + 'px';

  s.lineHeight = String(lineHeight);
  s.letterSpacing = letterGap ? letterGap + 'em' : '';
  s.textTransform = upperCase ? 'uppercase' : '';
  s.maxWidth = widthPercent + '%';
}

fontSelect.addEventListener('change', () => {
  lastShown = null;
  updateCaption();
});

// ===== Galerie de styles =====
const styleBox = document.querySelector('.style-options');

const tabsBar = document.createElement('div');
Object.assign(tabsBar.style, {
  display: 'flex',
  gap: '6px',
  overflowX: 'auto',
  marginBottom: '8px',
  paddingBottom: '4px'
});
styleBox.parentNode.insertBefore(tabsBar, styleBox);

function makeTile(styleId, label) {
  const tile = document.createElement('button');
  tile.type = 'button';
  tile.className = 'style-tile';
  tile.dataset.style = styleId;
  Object.assign(tile.style, {
    background: '#0c1325',
    border: '1px solid #35415f',
    borderRadius: '8px',
    padding: '4px',
    cursor: 'pointer',
    color: '#aeb8d0',
    fontSize: '9px',
    fontWeight: '800',
    textAlign: 'center',
    position: 'relative',
    fontFamily: 'inherit',
    minWidth: '0'
  });

  const frame = document.createElement('div');
  frame.className = 'preview-frame ' + styleId;
  Object.assign(frame.style, {
    height: '44px',
    width: '100%',
    borderRadius: '6px',
    background: '#1a2340'
  });

  const cap = document.createElement('div');
  cap.className = 'preview-caption';
  cap.innerHTML = 'Texte <b>clé</b>';
  cap.style.setProperty('font-size', styleId === 'pixel' ? '8px' : '13px', 'important');
  cap.style.setProperty('padding', '3px 7px', 'important');
  cap.style.setProperty('line-height', '1.2', 'important');
  cap.style.setProperty('--accent', '#a879ff');
  cap.style.setProperty('--kw', '#ffe600');
  frame.appendChild(cap);

  const name = document.createElement('div');
  name.textContent = label;
  Object.assign(name.style, {
    marginTop: '4px',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap'
  });

  tile.appendChild(frame);
  tile.appendChild(name);
  return tile;
}

function markSelected() {
  styleBox.querySelectorAll('.style-tile').forEach(t => {
    const on = t.dataset.preset === undefined && t.dataset.style === activeStyle;
    t.style.borderColor = on ? '#a879ff' : '#35415f';
    t.style.background = on ? '#2b2050' : '#0c1325';
  });
}

function renderGallery() {
  tabsBar.innerHTML = '';
  STYLE_TABS.forEach(([id, name]) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.dataset.tab = id;
    b.textContent = name;
    const on = id === currentTab;
    Object.assign(b.style, {
      padding: '6px 10px',
      borderRadius: '16px',
      fontSize: '10px',
      fontWeight: '800',
      whiteSpace: 'nowrap',
      cursor: 'pointer',
      fontFamily: 'inherit',
      border: '1px solid ' + (on ? '#a879ff' : '#35415f'),
      background: on ? '#2b2050' : '#0c1325',
      color: on ? '#d9c2ff' : '#aeb8d0'
    });
    tabsBar.appendChild(b);
  });

  styleBox.innerHTML = '';
  Object.assign(styleBox.style, {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
    gap: '6px',
    maxHeight: '250px',
    overflowY: 'auto'
  });

  if (currentTab === 'mine') {
    const add = document.createElement('button');
    add.type = 'button';
    add.dataset.save = '1';
    add.textContent = '＋ Enregistrer le style actuel';
    Object.assign(add.style, {
      gridColumn: '1 / -1',
      padding: '10px',
      background: '#2b2050',
      border: '1px solid #a879ff',
      color: '#d9c2ff',
      borderRadius: '8px',
      fontSize: '11px',
      fontWeight: '800',
      cursor: 'pointer',
      fontFamily: 'inherit'
    });
    styleBox.appendChild(add);

    if (!presets.length) {
      const note = document.createElement('div');
      note.textContent = 'Aucun style enregistré. Réglez votre style, puis touchez le bouton ci-dessus.';
      Object.assign(note.style, {
        gridColumn: '1 / -1',
        fontSize: '10px',
        color: '#8994ad',
        lineHeight: '1.5'
      });
      styleBox.appendChild(note);
    }

    presets.forEach((p, i) => {
      const tile = makeTile(p.style, p.name);
      tile.dataset.preset = String(i);

      const del = document.createElement('span');
      del.dataset.del = String(i);
      del.textContent = '×';
      Object.assign(del.style, {
        position: 'absolute',
        top: '0',
        right: '4px',
        fontSize: '15px',
        lineHeight: '1.2',
        color: '#ff8aa0',
        zIndex: '2',
        padding: '0 2px'
      });
      tile.appendChild(del);
      styleBox.appendChild(tile);
    });
  } else {
    const tab = STYLE_TABS.find(t => t[0] === currentTab);
    const ids = tab && tab[2] ? tab[2] : STYLES.map(s => s[0]);

    ids.forEach(id => {
      const st = STYLES.find(s => s[0] === id);
      if (st) styleBox.appendChild(makeTile(id, st[1]));
    });
  }

  markSelected();
}

function selectStyle(id, fromEmojiTab) {
  activeStyle = id;

  if (fromEmojiTab && emojiMode === 'off') {
    emojiMode = 'auto';
    emojiSelect.value = 'auto';
    showToast('Emojis automatiques activés.');
  }

  lastShown = null;
  markSelected();
  updateCaption();
}

function saveCurrentStyle() {
  const name = (prompt('Nom de ce style :', 'Mon style ' + (presets.length + 1)) || '')
    .trim()
    .slice(0, 20);
  if (!name) return;

  if (presets.length >= 30) {
    showToast('Maximum 30 styles enregistrés. Supprimez-en un d’abord.');
    return;
  }

  presets.push({
    name,
    style: activeStyle,
    font: fontSelect.value,
    color: colorInput.value,
    kwColor: kwColorInput.value,
    kwMode,
    emoji: emojiMode,
    display: displayMode,
    size: Math.round(sizeScale * 100),
    words: maxWords,
    width: widthPercent,
    lineHeight: Math.round(lineHeight * 100),
    spacing: Math.round(letterGap * 100),
    upper: upperCase,
    pos: positionPercent
  });

  if (storePresets(presets)) {
    showToast('Style « ' + name + ' » enregistré.');
  } else {
    showToast('Style gardé pour cette session seulement.');
  }

  renderGallery();
}

function applyPreset(p) {
  if (!p) return;

  activeStyle = STYLES.some(s => s[0] === p.style) ? p.style : 'pop';
  fontSelect.value = String(Math.min(Number(p.font) || 0, FONTS.length - 1));

  colorInput.value = p.color || '#a879ff';
  kwColorInput.value = p.kwColor || '#ffe600';

  kwMode = p.kwMode || 'off';
  kwSelect.value = kwMode;

  emojiMode = p.emoji || 'off';
  emojiSelect.value = emojiMode;

  displayMode = p.display || 'all';
  modeSelect.value = displayMode;

  const size = p.size || 100;
  sizeScale = size / 100;
  sizeSlider.set(size);

  widthPercent = p.width || 90;
  widthSlider.set(widthPercent);

  const lh = p.lineHeight || 120;
  lineHeight = lh / 100;
  lineSlider.set(lh);

  const sp = p.spacing || 0;
  letterGap = sp / 100;
  spacingSlider.set(sp);

  upperCase = !!p.upper;
  upperInput.checked = upperCase;

  const pos = Math.max(4, Math.min(80, Number(p.pos) || 14));
  positionPercent = pos;
  posSlider.value = String(pos);
  posSelect.value = 'custom';
  applyPosition();

  if (p.words && p.words !== maxWords) {
    wordsSlider.set(p.words);
    applyMaxWords(p.words);
  }

  markSelected();
  lastShown = null;
  updateCaption();
  showToast('Style « ' + p.name + ' » appliqué.');
}

styleBox.addEventListener('click', event => {
  const del = event.target.closest('[data-del]');
  if (del) {
    event.stopPropagation();
    const i = Number(del.dataset.del);
    const p = presets[i];
    if (p && confirm('Supprimer le style « ' + p.name + ' » ?')) {
      presets.splice(i, 1);
      storePresets(presets);
      renderGallery();
    }
    return;
  }

  if (event.target.closest('[data-save]')) {
    saveCurrentStyle();
    return;
  }

  const tile = event.target.closest('.style-tile');
  if (!tile) return;

  if (tile.dataset.preset !== undefined) {
    applyPreset(presets[Number(tile.dataset.preset)]);
    return;
  }

  selectStyle(tile.dataset.style, currentTab === 'emoji');
});

tabsBar.addEventListener('click', event => {
  const b = event.target.closest('[data-tab]');
  if (!b) return;
  currentTab = b.dataset.tab;
  renderGallery();
});

renderGallery();

// ===== Boutons : transcription et export =====
const transcribeButton = document.createElement('button');
transcribeButton.type = 'button';
transcribeButton.className = 'button primary full';
transcribeButton.textContent = 'Générer les sous-titres IA';
document.querySelector('.controls-panel').appendChild(transcribeButton);

const exportLabel = document.createElement('label');
exportLabel.className = 'field-label';
exportLabel.textContent = 'Exporter';

const srtButton = document.createElement('button');
srtButton.type = 'button';
srtButton.className = 'button ghost full';
srtButton.textContent = 'Télécharger SRT';

const vttButton = document.createElement('button');
vttButton.type = 'button';
vttButton.className = 'button ghost full';
vttButton.textContent = 'Télécharger VTT';

const exportVideoButton = document.createElement('button');
exportVideoButton.type = 'button';
exportVideoButton.className = 'button primary full';
exportVideoButton.textContent = 'Exporter la vidéo sous-titrée';

const panel = document.querySelector('.controls-panel');
panel.appendChild(exportLabel);
panel.appendChild(srtButton);
panel.appendChild(vttButton);
panel.appendChild(exportVideoButton);

function attachCaptionToVideo() {
  if (getComputedStyle(previewFrame).position === 'static') {
    previewFrame.style.position = 'relative';
  }

  previewFrame.appendChild(captionPreview);
  previewFrame.appendChild(hookPreview);

  const s = captionPreview.style;
  s.position = 'absolute';
  s.left = '0';
  s.right = '0';
  s.top = 'auto';
  s.transform = 'none';
  s.margin = '0 auto';
  s.padding = '0 12px';
  s.textAlign = 'center';
  s.zIndex = '5';
  s.pointerEvents = 'none';

  captionAttached = true;
  applyPosition();
}

videoInput.addEventListener('change', () => {
  const file = videoInput.files && videoInput.files[0];
  if (!file) return;

  if (!file.type.startsWith('video/')) {
    showToast('Choisissez une vidéo valide.');
    return;
  }

  selectedFile = file;
  baseSegments = [];
  segments = [];
  silences = [];
  edited = false;
  lastShown = null;
  trimStart = 0;
  trimEnd = 0;

  videoPreview.src = URL.createObjectURL(file);
  videoPreview.hidden = false;
  placeholder.hidden = true;
  fileName.textContent = file.name;

  attachCaptionToVideo();
  layoutPreview();
  captionText.value = '';
  updateCaption();
  updateSilenceInfo();
  updateHook();

  showToast('Vidéo chargée. Vous pouvez lancer la transcription.');
});

// ===== Découpage des phrases =====
function splitSegment(seg, max) {
  const words = seg.text.split(/\s+/).filter(Boolean);
  const n = words.length;
  if (n <= max) return [seg];

  let starts = seg.starts;
  let ends = seg.ends;
  const exact = starts && starts.length === n;

  if (!exact) {
    starts = Array.from({ length: n }, (_, i) => seg.start + ((seg.end - seg.start) * i) / n);
    ends = null;
  }

  const parts = Math.ceil(n / max);
  const per = Math.ceil(n / parts);
  const out = [];

  for (let i = 0; i < n; i += per) {
    const last = i + per >= n;
    const st = starts.slice(i, i + per);
    const nextStart = last ? seg.end : starts[i + per];
    let end = nextStart;

    if (!last && ends && ends[i + per - 1] !== undefined) {
      end = Math.min(nextStart, Math.max(ends[i + per - 1] + 0.4, st[0] + 0.3));
    }

    out.push({
      start: i === 0 ? seg.start : st[0],
      end,
      text: words.slice(i, i + per).join(' '),
      starts: st
    });
  }

  return out;
}

function makeBase(rawSegments, rawWords) {
  const base = rawSegments.map(s => ({
    start: s.start,
    end: s.end,
    text: (s.text || '').trim(),
    starts: [],
    ends: []
  }));

  (rawWords || []).forEach(w => {
    const seg = base.find(s => w.start >= s.start - 0.05 && w.start < s.end + 0.05);
    if (seg) {
      seg.starts.push(w.start);
      seg.ends.push(w.end);
    }
  });

  return base;
}

function rebuildSegments() {
  segments = [];
  baseSegments.forEach(b => {
    splitSegment(b, maxWords).forEach(p => {
      segments.push({
        start: p.start,
        end: p.end,
        text: p.text,
        starts: (p.starts || []).slice()
      });
    });
  });
}

// ===== Transcription (Groq via le serveur) =====
transcribeButton.addEventListener('click', async () => {
  if (!selectedFile) {
    showToast('Importez d’abord une vidéo.');
    return;
  }

  if (selectedFile.size > 25 * 1024 * 1024) {
    showToast('Fichier trop volumineux : maximum 25 Mo.');
    return;
  }

  transcribeButton.disabled = true;
  transcribeButton.textContent = 'Transcription en cours...';

  try {
    const formData = new FormData();
    formData.append('audio', selectedFile);

    const response = await fetch(API_URL + '/api/transcribe', {
      method: 'POST',
      body: formData
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || 'Erreur du serveur.');
    }
    if (!result.text) {
      throw new Error('Aucun texte détecté dans le fichier.');
    }

    if (Array.isArray(result.segments) && result.segments.length) {
      baseSegments = makeBase(result.segments, result.words);
      rebuildSegments();
      edited = false;
      captionText.value = segments.map(s => s.text).join('\n');
    } else {
      baseSegments = [];
      segments = [];
      captionText.value = result.text;
    }

    computeSilences();
    updateSilenceInfo();
    lastShown = null;
    updateCaption();

    showToast(
      'Transcription réussie ! Langue : ' + (result.language || 'détectée') +
      (segments.length ? '. Une ligne = un sous-titre, ne supprimez pas de ligne.' : '')
    );
  } catch (error) {
    console.error('Erreur JUSTEVIVO :', error);
    showToast(error.message || 'Impossible de contacter le serveur.');
  } finally {
    transcribeButton.disabled = false;
    transcribeButton.textContent = 'Générer les sous-titres IA';
  }
});

// ===== Affichage du texte dans l'aperçu =====
function escapeWord(w) {
  return w.replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
}

function keywordIndexes(words, mode) {
  const set = new Set();
  if (mode === 'off' || !words.length) return set;

  const per = mode === 'strong' ? 3 : 6;
  const max = Math.max(1, Math.round(words.length / per));
  const cands = [];

  words.forEach((w, i) => {
    const clean = w.toLowerCase().replace(/[^\p{L}\p{N}]/gu, '');
    if (!clean) return;

    if (/\d/.test(clean)) {
      cands.push({ i, len: 10 });
    } else if (clean.length >= 5 && !STOPWORDS.has(clean)) {
      cands.push({ i, len: clean.length });
    }
  });

  cands.sort((a, b) => b.len - a.len || a.i - b.i);
  cands.slice(0, max).forEach(c => set.add(c.i));
  return set;
}

function wordHtml(w, i, hidden, kwSet, emo) {
  const isKw = kwSet.has(i);
  let style = '';

  if (hidden) style += 'visibility:hidden;';

  if (isKw) {
    style += activeStyle === 'marker'
      ? 'background:' + kwColorInput.value + ';color:#000 !important;padding:0 6px;border-radius:4px;'
      : 'color:' + kwColorInput.value + ' !important;';
  }

  const extra = emo && emo.has(i) ? '\u00A0' + emo.get(i) : '';

  return '<span' + (isKw ? ' class="kw"' : '') +
    (style ? ' style="' + style + '"' : '') + '>' + w + extra + '</span>';
}

function renderCaption(text, emptyLabel, count, mode) {
  const words = text.trim().split(/\s+/).filter(Boolean);
  const safe = words.map(escapeWord);
  const kwSet = keywordIndexes(words, kwMode);
  const emo = emojiIndexes(words);

  if (!safe.length) {
    captionPreview.innerHTML = '';
    captionPreview.textContent = emptyLabel || '';
  } else if (mode === 'single') {
    const i = Math.min(count, safe.length) - 1;
    captionPreview.innerHTML =
      i >= 0 ? '<b>' + wordHtml(safe[i], i, false, kwSet, emo) + '</b>' : '';
  } else {
    const split = Math.ceil(safe.length / 2);
    const show = (w, i) => wordHtml(w, i, mode === 'progressive' && i >= count, kwSet, emo);

    const first = safe.slice(0, split).map((w, i) => show(w, i));
    const second = safe.slice(split).map((w, i) => show(w, i + split));

    captionPreview.innerHTML =
      first.join(' ') + (second.length ? ' <b>' + second.join(' ') + '</b>' : '');
  }

  captionPreview.classList.toggle('kwon', kwMode !== 'off');
  captionPreview.style.setProperty('--accent', colorInput.value);
  captionPreview.style.setProperty('--kw', kwColorInput.value);

  if (kwMode === 'off') {
    const b = captionPreview.querySelector('b');
    if (b) b.style.setProperty('color', colorInput.value);
  }
}

function visibleCount(seg, t) {
  const n = seg.text.split(/\s+/).filter(Boolean).length;
  if (!n) return 0;

  let starts = seg.starts;
  if (!starts || starts.length !== n) {
    starts = Array.from({ length: n }, (_, i) => seg.start + ((seg.end - seg.start) * i) / n);
  }

  return starts.filter(s => t >= s).length;
}

function drawSegments(force) {
  const t = videoPreview.currentTime || 0;
  const seg = segments.find(s => t >= s.start && t < s.end);

  let text = '';
  let count = -1;
  let key = '';

  if (seg) {
    text = seg.text;
    count = displayMode === 'all' ? -1 : visibleCount(seg, t);
    key = text + '|' + count + '|' + displayMode;
  }

  if (!force && key === lastShown) return;
  lastShown = key;

  renderCaption(text, '', count, displayMode);
}

function updateCaption() {
  previewFrame.classList.remove(...STYLES.map(s => s[0]));
  previewFrame.classList.add(activeStyle);

  applyTypography();

  if (segments.length) {
    drawSegments(true);
  } else {
    renderCaption(captionText.value, 'VOTRE TEXTE', -1, 'all');
  }
}

function syncCaption() {
  if (!segments.length) return;
  drawSegments(false);
}

function tick() {
  enforceTrim();
  skipSilence();
  syncCaption();
  applyZoom();
  updateHook();
  if (typeof tickAudio === 'function') tickAudio();
}

function syncLoop() {
  tick();
  if (!videoPreview.paused && !videoPreview.ended) {
    requestAnimationFrame(syncLoop);
  }
}

videoPreview.addEventListener('play', () => requestAnimationFrame(syncLoop));
videoPreview.addEventListener('timeupdate', tick);
videoPreview.addEventListener('seeked', tick);
videoPreview.addEventListener('pause', tick);
videoPreview.addEventListener('ended', tick);
videoPreview.addEventListener('loadedmetadata', () => {
  initTrim();
  computeSilences();
  updateSilenceInfo();
  layoutPreview();
  updateCaption();
  updateHook();
});

captionText.addEventListener('input', () => {
  if (segments.length) {
    const lines = captionText.value.split('\n');
    segments.forEach((s, i) => {
      s.text = (lines[i] || '').trim();
    });
    edited = true;
    lastShown = null;
  }
  updateCaption();
});

document.getElementById('previewButton').addEventListener('click', () => {
  lastShown = null;
  updateCaption();
  updateHook();
  showToast('Aperçu actualisé.');
});

colorInput.addEventListener('input', () => {
  lastShown = null;
  updateCaption();
});

// ===== Export SRT / VTT =====
function baseName() {
  return selectedFile ? selectedFile.name.replace(/\.[^.]+$/, '') : 'justevivo';
}

function pad(n, len) {
  return String(n).padStart(len || 2, '0');
}

function stamp(sec, sep) {
  const ms = Math.max(0, Math.round(sec * 1000));
  const h = Math.floor(ms / 3600000);
  const m = Math.floor((ms % 3600000) / 60000);
  const s = Math.floor((ms % 60000) / 1000);
  const r = ms % 1000;
  return pad(h) + ':' + pad(m) + ':' + pad(s) + sep + pad(r, 3);
}

function buildSubtitles(kind) {
  const sep = kind === 'vtt' ? '.' : ',';
  const a = trimStart;
  const b = getTrimEnd();

  const rows = segments
    .filter(s => s.text && s.end > a && s.start < b)
    .map(s => ({
      start: outTime(Math.max(s.start, a)),
      end: outTime(Math.min(s.end, b)),
      text: s.text
    }))
    .filter(r => r.end - r.start > 0.04);

  let out = kind === 'vtt' ? 'WEBVTT\n\n' : '';

  rows.forEach((r, i) => {
    if (kind === 'srt') out += (i + 1) + '\n';
    out += stamp(r.start, sep) + ' --> ' + stamp(r.end, sep) + '\n';
    out += r.text + '\n\n';
  });

  return out;
}

function downloadBlob(blob, name) {
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = name;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(a.href), 10000);
}

function exportSubtitles(kind) {
  if (!segments.length) {
    showToast('Générez d’abord les sous-titres IA.');
    return;
  }

  const type = kind === 'vtt' ? 'text/vtt' : 'application/x-subrip';
  const blob = new Blob([buildSubtitles(kind)], { type: type + ';charset=utf-8' });
  downloadBlob(blob, baseName() + '.' + kind);
  showToast('Fichier ' + kind.toUpperCase() + ' téléchargé.');
}

srtButton.addEventListener('click', () => exportSubtitles('srt'));
vttButton.addEventListener('click', () => exportSubtitles('vtt'));

// L'export vidéo est dans la partie 2 (app2.js)
exportVideoButton.addEventListener('click', () => {
  if (typeof exportVideo === 'function') {
    exportVideo();
  } else {
    showToast('La partie 2 (app2.js) n’est pas chargée.');
  }
});

// ===== Abonnements =====
document.querySelectorAll('.plan-button').forEach(button => {
  button.addEventListener('click', () => {
    showToast('La formule ' + button.dataset.plan + ' sera disponible après activation des paiements.');
  });
});

layoutPreview();
updateSilenceInfo();
updateCaption();

// ===== Chargement de la partie 2 =====
(function loadPart2() {
  const s = document.createElement('script');
  s.src = 'app2.js?v=' + Date.now();
  s.onerror = () => showToast('Partie 2 introuvable : créez le fichier app2.js dans le dépôt.');
  document.body.appendChild(s);
})();
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
