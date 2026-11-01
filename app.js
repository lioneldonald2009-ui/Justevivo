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
