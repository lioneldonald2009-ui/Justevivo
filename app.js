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

// Liste des styles : [identifiant, nom affiché]
const STYLES = [
  ['pop', 'POP'],
  ['neon', 'NÉON'],
  ['clean', 'ÉPURÉ'],
  ['impact', 'IMPACT'],
  ['tiktok', 'TIKTOK'],
  ['boite', 'BOÎTE'],
  ['marker', 'SURLIGNEUR'],
  ['retro3d', 'RÉTRO 3D'],
  ['degrade', 'DÉGRADÉ'],
  ['cinema', 'CINÉMA'],
  ['machine', 'MACHINE'],
  ['comic', 'COMIC'],
  ['rose', 'NÉON ROSE'],
  ['verre', 'VERRE'],
  ['fin', 'FIN'],
  ['feu', 'FEU'],
  ['elegant', 'ÉLÉGANT'],
  ['contour', 'CONTOUR'],
  ['glace', 'GLACE'],
  ['or', 'OR'],
  ['bande', 'BANDEAU'],
  ['ombre', 'OMBRE'],
  ['neonvert', 'NÉON VERT'],
  ['neonjaune', 'NÉON JAUNE'],
  ['sunset', 'COUCHER'],
  ['ocean', 'OCÉAN'],
  ['chrome', 'CHROME'],
  ['sticker', 'AUTOCOLLANT'],
  ['jaune', 'JAUNE'],
  ['blanc', 'BLANC'],
  ['minimal', 'MINIMAL'],
  ['pixel', 'PIXEL']
];

// Liste des polices : [nom affiché, famille CSS, graisse, taille]
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

// Modes d'affichage des mots : [identifiant, nom affiché]
const MODES = [
  ['all', 'Phrase complète'],
  ['progressive', 'Mot par mot (progressif)'],
  ['single', 'Un seul mot à la fois']
];

// Modes de mots-clés : [identifiant, nom affiché]
const KEYWORD_MODES = [
  ['off', 'Aucun'],
  ['auto', 'Automatique'],
  ['strong', 'Automatique (plus de mots)']
];

// Positions prédéfinies : [identifiant, nom affiché, distance du bas en %]
const POSITIONS = [
  ['top', 'Haut', 78],
  ['middle', 'Milieu', 44],
  ['bottom', 'Bas', 14],
  ['custom', 'Personnalisée (curseur)', null]
];

// Valeurs par défaut des réglages du texte
const DEFAULTS = {
  size: 100,       // %
  words: 6,        // mots par sous-titre
  width: 90,       // % de la largeur de la vidéo
  lineHeight: 120, // /100
  spacing: 0       // /100 em
};

// Mots courants à ne jamais surligner
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

// Apparence de chaque style pour l'export vidéo (dessin sur canvas)
const STYLE_BASE = {
  size: 23,
  weight: '800',
  family: "'DM Sans', Arial, sans-serif",
  c1: '#f7f7ff',
  c2: 'accent',
  upper: false,
  shadows: [{ c: '#000', x: 0, y: 3, b: 12 }]
};

const STYLE_CFG = {
  pop: {},
  neon: { c1: '#6ffaff', shadows: [{ c: '#3af7ff', x: 0, y: 0, b: 12 }] },
  clean: { weight: '600', box: { bg: 'rgba(0,0,0,0.6)', padX: 15, padY: 10, radius: 5 } },
  impact: {
    family: "Impact, 'Arial Black', sans-serif", upper: true, size: 26,
    c1: '#fff', stroke: 2, spacing: 1,
    shadows: [{ c: '#000', x: 0, y: 3, b: 0 }]
  },
  tiktok: {
    family: "'Arial Black', Arial, sans-serif", weight: '900', upper: true,
    c1: '#ffe600', c2: '#fff', stroke: 2,
    shadows: [{ c: '#000', x: 0, y: 4, b: 0 }]
  },
  boite: {
    c1: '#fff', c2: '#fff',
    box: { bg: 'accent', padX: 16, padY: 8, radius: 10 }
  },
  marker: {
    c1: '#fff', c2: '#000', marker: true,
    shadows: [{ c: '#000', x: 0, y: 2, b: 6 }]
  },
  retro3d: {
    family: "'Arial Black', Arial, sans-serif", upper: true,
    c1: '#fff', c2: '#fff',
    shadows: [
      { c: 'accent', x: 3, y: 3, b: 0 },
      { c: '#000', x: 6, y: 6, b: 0 }
    ]
  },
  degrade: {
    weight: '900', grad: ['#ff5fa2', '#ffb347', '#41c7ff'], gradDir: 'h',
    shadows: [{ c: '#000', x: 0, y: 2, b: 4 }]
  },
  cinema: {
    family: "Georgia, serif", weight: '400', size: 19, c1: '#fff', c2: '#fff',
    line2Weight: '700', spacing: 0.5,
    shadows: [{ c: '#000', x: 0, y: 2, b: 6 }, { c: '#000', x: 0, y: 0, b: 2 }]
  },
  machine: {
    family: "'Courier New', monospace", size: 17, c1: '#7dff9b', c2: '#7dff9b',
    box: { bg: 'rgba(0,0,0,0.8)', border: 'rgba(125,255,155,0.4)', padX: 14, padY: 8, radius: 0 }
  },
  comic: {
    family: "'Comic Sans MS', 'Chalkboard SE', cursive", weight: '900',
    upper: true, c1: '#fff', stroke: 3, shadows: [], rotate: -2
  },
  rose: {
    c1: '#fff', c2: '#ffd1fb',
    shadows: [
      { c: '#fff', x: 0, y: 0, b: 6 },
      { c: '#ff3df0', x: 0, y: 0, b: 14 },
      { c: '#ff3df0', x: 0, y: 0, b: 30 }
    ]
  },
  verre: {
    weight: '700', c1: '#fff', c2: '#fff',
    box: { bg: 'rgba(255,255,255,0.15)', border: 'rgba(255,255,255,0.33)', padX: 16, padY: 8, radius: 14 }
  },
  fin: {
    weight: '300', size: 20, upper: true, c1: '#fff', line2Weight: '600',
    spacing: 2, shadows: [{ c: '#000', x: 0, y: 1, b: 4 }]
  },
  feu: {
    family: "Impact, 'Arial Black', sans-serif", upper: true, size: 26,
    grad: ['#fff200', '#ff6a00', '#e00000'], gradDir: 'v',
    shadows: [{ c: '#ff5a00', x: 0, y: 0, b: 8 }]
  },
  elegant: {
    family: "Georgia, serif", weight: '400', italic: true, line2NoItalic: true,
    line2Weight: '700', c1: '#fff6e0',
    shadows: [{ c: '#000', x: 0, y: 2, b: 8 }]
  },
  contour: {
    weight: '900', upper: true, hollow: true, stroke: 1.5, shadows: []
  },
  glace: {
    weight: '700', c1: '#dff6ff', c2: '#fff',
    shadows: [{ c: '#36bfff', x: 0, y: 0, b: 8 }, { c: '#36bfff', x: 0, y: 0, b: 20 }]
  },
  or: {
    family: "Georgia, serif", weight: '900', size: 25,
    grad: ['#fff3b0', '#e0a800', '#8a5a00'], gradDir: 'v',
    shadows: [{ c: '#000', x: 0, y: 2, b: 3 }]
  },
  bande: {
    weight: '700', c1: '#fff', shadows: [],
    box: { bg: '#000', border: 'accent', padX: 22, padY: 8, radius: 2 }
  },
  ombre: {
    weight: '700', c1: '#fff',
    shadows: [{ c: '#000', x: 0, y: 6, b: 18 }, { c: '#000', x: 0, y: 2, b: 4 }]
  },
  neonvert: {
    c1: '#9dffb0',
    shadows: [{ c: '#3dff7a', x: 0, y: 0, b: 8 }, { c: '#3dff7a', x: 0, y: 0, b: 22 }]
  },
  neonjaune: {
    c1: '#fff9a8',
    shadows: [{ c: '#ffe600', x: 0, y: 0, b: 8 }, { c: '#ffe600', x: 0, y: 0, b: 22 }]
  },
  sunset: {
    weight: '900', grad: ['#ff9a3c', '#ff4e8b', '#a855f7'], gradDir: 'h',
    shadows: [{ c: '#000', x: 0, y: 2, b: 4 }]
  },
  ocean: {
    weight: '900', grad: ['#b6fff0', '#00e0c6', '#0088ff'], gradDir: 'v',
    shadows: [{ c: '#000', x: 0, y: 2, b: 4 }]
  },
  chrome: {
    weight: '900', grad: ['#fff', '#b8c4d6', '#5d6b82', '#c9d5e6'], gradDir: 'v',
    stroke: 1, strokeColor: '#1b2433',
    shadows: [{ c: '#000', x: 0, y: 2, b: 3 }]
  },
  sticker: {
    weight: '900', c1: '#111', c2: 'accent', stroke: 3, strokeColor: '#fff',
    shadows: [{ c: 'rgba(0,0,0,0.55)', x: 0, y: 4, b: 8 }]
  },
  jaune: {
    weight: '900', c1: '#000', c2: '#000', shadows: [],
    box: { bg: '#ffe600', padX: 14, padY: 6, radius: 4 }
  },
  blanc: {
    weight: '800', c1: '#111', c2: 'accent', shadows: [],
    box: { bg: '#fff', padX: 14, padY: 6, radius: 8 }
  },
  minimal: {
    weight: '500', size: 18, c1: '#fff', c2: '#fff', line2Weight: '700',
    shadows: [{ c: '#000', x: 0, y: 1, b: 4 }]
  },
  pixel: {
    family: "'Press Start 2P', monospace", weight: '400', size: 13,
    c1: '#ffe600', c2: '#fff',
    shadows: [{ c: '#000', x: 2, y: 2, b: 0 }]
  }
};

let activeStyle = 'pop';
let displayMode = 'all';
let kwMode = 'off';
let positionPercent = 14; // distance du bas de la vidéo, en %
let captionAttached = false;
let selectedFile = null;

// Réglages du texte (modifiables par l'utilisateur)
let sizeScale = DEFAULTS.size / 100;
let maxWords = DEFAULTS.words;
let widthPercent = DEFAULTS.width;
let lineHeight = DEFAULTS.lineHeight / 100;
let letterGap = DEFAULTS.spacing / 100; // en em
let upperCase = false;

// Outils IA : zoom, silences, titre d'accroche
let zoomOn = false;
let zoomLevel = 1.18;
let silenceOn = false;
let silenceMin = 0.7;   // durée minimale d'un silence supprimé, en secondes
let silences = [];      // [{ from, to }] en secondes (temps de la vidéo d'origine)
let hookSeconds = 3;    // durée d'affichage du titre
let hookScale = 1;      // taille du titre
let hookTop = 12;       // position du titre, % depuis le haut

let baseSegments = []; // phrases d'origine (avant découpage)
let segments = [];     // sous-titres affichés [{ start, end, text, starts: [] }]
let edited = false;    // l'utilisateur a corrigé le texte à la main
let lastShown = null;

function showToast(message) {
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(
    () => toast.classList.remove('show'),
    4000
  );
}

// Charger les polices Google Fonts
const fontLink = document.createElement('link');
fontLink.rel = 'stylesheet';
fontLink.href =
  'https://fonts.googleapis.com/css2' +
  '?family=Anton' +
  '&family=Archivo+Black' +
  '&family=Bangers' +
  '&family=Bebas+Neue' +
  '&family=Caveat:wght@700' +
  '&family=Dancing+Script:wght@700' +
  '&family=Inter:wght@800' +
  '&family=Lobster' +
  '&family=Luckiest+Guy' +
  '&family=Montserrat:wght@800' +
  '&family=Oswald:wght@700' +
  '&family=Pacifico' +
  '&family=Permanent+Marker' +
  '&family=Playfair+Display:wght@800' +
  '&family=Poppins:wght@700' +
  '&family=Press+Start+2P' +
  '&family=Raleway:wght@800' +
  '&family=Righteous' +
  '&family=Roboto:wght@900' +
  '&family=Russo+One' +
  '&display=swap';
document.head.appendChild(fontLink);

// CSS ajouté par le script : polices, mots-clés et nouveaux styles
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
`;
document.head.appendChild(fontStyle);

// Style commun des menus déroulants
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

// Curseur avec son titre (affiche la valeur en direct)
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

// Case à cocher avec son titre
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

const colorLabel = document.querySelector('label[for="captionColor"]');

// Section repliable de réglages (placée avant « Couleur d'accentuation »)
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

// Menu des polices
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

// Menu du mode d'affichage des mots
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

// Menu de la position du texte
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

// Curseur de position verticale (bas = 4, haut = 80)
const posSlider = document.createElement('input');
posSlider.type = 'range';
posSlider.id = 'captionPositionSlider';
posSlider.min = '4';
posSlider.max = '80';
posSlider.step = '1';
posSlider.value = String(positionPercent);
Object.assign(posSlider.style, {
  width: '100%',
  marginTop: '10px',
  accentColor: '#a879ff'
});

colorLabel.parentNode.insertBefore(posLabel, colorLabel);
colorLabel.parentNode.insertBefore(posSelect, colorLabel);
colorLabel.parentNode.insertBefore(posSlider, colorLabel);

// Menu des mots-clés surlignés
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

// ===== Réglages du texte (taille, mots, largeur, interligne...) =====
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

addSlider(
  hookBox, 'Durée d’affichage', 1, 10, 0.5, hookSeconds,
  v => v + ' s',
  v => {
    hookSeconds = v;
    updateHook();
  }
);

addSlider(
  hookBox, 'Taille du titre', 60, 180, 10, 100,
  v => v + ' %',
  v => {
    hookScale = v / 100;
    updateHook();
  }
);

addSlider(
  hookBox, 'Position du titre (depuis le haut)', 4, 70, 1, hookTop,
  v => v + ' %',
  v => {
    hookTop = v;
    updateHook();
  }
);

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

addSlider(
  zoomBox, 'Intensité du zoom', 105, 150, 1, 118,
  v => v + ' %',
  v => {
    zoomLevel = v / 100;
    applyZoom();
  }
);

const zoomNote = document.createElement('div');
zoomNote.textContent =
  'Le zoom se voit pendant la lecture et dans la vidéo exportée.';
Object.assign(zoomNote.style, {
  fontSize: '10px',
  color: '#8994ad',
  margin: '8px 0 0'
});
zoomBox.appendChild(zoomNote);

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

addSlider(
  silenceBox, 'Silence minimal à supprimer', 0.3, 2, 0.1, silenceMin,
  v => v.toFixed(1) + ' s',
  v => {
    silenceMin = v;
    computeSilences();
    updateSilenceInfo();
  }
);

const silenceInfo = document.createElement('div');
Object.assign(silenceInfo.style, {
  fontSize: '10px',
  color: '#8994ad',
  margin: '8px 0 0'
});
silenceBox.appendChild(silenceInfo);

// Calcul des silences (à partir des horaires des mots)
function computeSilences() {
  silences = [];
  if (!silenceOn || !baseSegments.length) return;

  const PAD = 0.15; // marge gardée autour de la parole
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

  let prevEnd = 0;
  speech.forEach(([s, e]) => {
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
    return;
  }
  if (!silenceOn) {
    silenceInfo.textContent = 'Désactivé.';
    return;
  }
  const total = silences.reduce((sum, s) => sum + (s.to - s.from), 0);
  silenceInfo.textContent =
    silences.length + ' silence(s) supprimé(s) · ' +
    total.toFixed(1) + ' s gagnées';
}

// Temps de la vidéo finale (sans les silences supprimés)
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
  return silenceOn && silences.length ? compressTime(t) : t;
}

// Sauter les silences pendant la lecture
function skipSilence() {
  if (!silenceOn || !silences.length || videoPreview.paused) return;
  const t = videoPreview.currentTime;
  const s = silences.find(x => t >= x.from && t < x.to);
  if (s) videoPreview.currentTime = s.to;
}

// Facteur de zoom à l'instant t (une phrase sur deux, avec transition douce)
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
  // Pas de zoom en pause, pour garder les commandes de la vidéo accessibles
  const z = videoPreview.paused ? 1 : zoomAt(videoPreview.currentTime || 0);
  videoPreview.style.transformOrigin = 'center center';
  videoPreview.style.transform = z > 1.0005 ? 'scale(' + z.toFixed(4) + ')' : '';
}

// Titre d'accroche superposé à la vidéo (aperçu)
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
    hookPreview.style.fontSize = (14 * hookScale) + 'px';
    hookPreview.style.top = hookTop + '%';
  }
}

// Changer le nombre de mots par sous-titre
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

// Appliquer police, taille et réglages du texte à l'aperçu
function applyTypography() {
  const f = FONTS[Number(fontSelect.value)];
  const s = captionPreview.style;

  s.fontFamily = f[1] || '';
  s.fontWeight = f[1] ? f[2] : '';
  s.fontSize = f[1] ? f[3] : '';
  captionPreview.classList.toggle('custom-font', !!f[1]);

  // Taille de base (selon le style / la police), puis facteur choisi
  const base = parseFloat(getComputedStyle(captionPreview).fontSize) || 23;
  s.fontSize = (base * sizeScale) + 'px';

  s.lineHeight = String(lineHeight);
  s.letterSpacing = letterGap ? letterGap + 'em' : '';
  s.textTransform = upperCase ? 'uppercase' : '';
  s.maxWidth = widthPercent + '%';
}

fontSelect.addEventListener('change', () => {
  lastShown = null;
  updateCaption();
});

// Créer les boutons de style
const styleBox = document.querySelector('.style-options');
styleBox.innerHTML = '';
STYLES.forEach(([id, label]) => {
  const b = document.createElement('button');
  b.type = 'button';
  b.className = 'style-option' + (id === activeStyle ? ' selected' : '');
  b.dataset.style = id;
  b.textContent = label;
  styleBox.appendChild(b);
});

styleBox.addEventListener('click', event => {
  const button = event.target.closest('.style-option');
  if (!button) return;

  styleBox.querySelectorAll('.style-option')
    .forEach(b => b.classList.remove('selected'));

  button.classList.add('selected');
  activeStyle = button.dataset.style;
  lastShown = null;
  updateCaption();
});

// Ajouter le bouton de transcription IA
const transcribeButton = document.createElement('button');
transcribeButton.type = 'button';
transcribeButton.className = 'button primary full';
transcribeButton.textContent = 'Générer les sous-titres IA';

document.querySelector('.controls-panel')
  .appendChild(transcribeButton);

// Boutons d'export
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

// Placer le sous-titre PAR-DESSUS la vidéo
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

// Charger la vidéo
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

  const url = URL.createObjectURL(file);
  videoPreview.src = url;
  videoPreview.hidden = false;
  placeholder.hidden = true;
  fileName.textContent = file.name;

  attachCaptionToVideo();
  captionText.value = '';
  updateCaption();
  updateSilenceInfo();
  updateHook();

  showToast('Vidéo chargée. Vous pouvez lancer la transcription.');
});

// Découper une longue phrase en sous-titres courts (max mots maximum)
function splitSegment(seg, max) {
  const words = seg.text.split(/\s+/).filter(Boolean);
  const n = words.length;
  if (n <= max) return [seg];

  let starts = seg.starts;
  let ends = seg.ends;
  const exact = starts && starts.length === n;

  if (!exact) {
    // Pas d'heures précises : on répartit les mots sur la durée
    starts = Array.from(
      { length: n },
      (_, i) => seg.start + ((seg.end - seg.start) * i) / n
    );
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

// Associer chaque mot (avec son heure) à sa phrase d'origine
function makeBase(rawSegments, rawWords) {
  const base = rawSegments.map(s => ({
    start: s.start,
    end: s.end,
    text: (s.text || '').trim(),
    starts: [],
    ends: []
  }));

  (rawWords || []).forEach(w => {
    const seg = base.find(
      s => w.start >= s.start - 0.05 && w.start < s.end + 0.05
    );
    if (seg) {
      seg.starts.push(w.start);
      seg.ends.push(w.end);
    }
  });

  return base;
}

// Reconstruire les sous-titres à partir des phrases d'origine
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

// Transcription avec Groq
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

    const response = await fetch(
      API_URL + '/api/transcribe',
      {
        method: 'POST',
        body: formData
      }
    );

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
      // Une ligne = un sous-titre
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
      'Transcription réussie ! Langue : ' +
      (result.language || 'détectée') +
      (segments.length
        ? '. Une ligne = un sous-titre, ne supprimez pas de ligne.'
        : '')
    );

  } catch (error) {
    console.error('Erreur JUSTEVIVO :', error);
    showToast(error.message || 'Impossible de contacter le serveur.');
  } finally {
    transcribeButton.disabled = false;
    transcribeButton.textContent = 'Générer les sous-titres IA';
  }
});

// Échapper le HTML
function escapeWord(w) {
  return w.replace(/[&<>"]/g, c => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;'
  }[c]));
}

// Choisir les mots-clés d'une phrase (retourne les positions des mots)
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

// HTML d'un mot dans l'aperçu
function wordHtml(w, i, hidden, kwSet) {
  const isKw = kwSet.has(i);
  let style = '';

  if (hidden) style += 'visibility:hidden;';

  if (isKw) {
    style += activeStyle === 'marker'
      ? 'background:' + kwColorInput.value +
        ';color:#000 !important;padding:0 6px;border-radius:4px;'
      : 'color:' + kwColorInput.value + ' !important;';
  }

  return '<span' + (isKw ? ' class="kw"' : '') +
    (style ? ' style="' + style + '"' : '') + '>' + w + '</span>';
}

// Afficher un texte dans l'aperçu
// count = nombre de mots visibles (-1 = tous), mode = all | progressive | single
function renderCaption(text, emptyLabel, count, mode) {
  const words = text.trim().split(/\s+/).filter(Boolean);
  const safe = words.map(escapeWord);
  const kwSet = keywordIndexes(words, kwMode);

  if (!safe.length) {
    captionPreview.innerHTML = '';
    captionPreview.textContent = emptyLabel || '';
  } else if (mode === 'single') {
    const i = Math.min(count, safe.length) - 1;
    captionPreview.innerHTML =
      i >= 0 ? '<b>' + wordHtml(safe[i], i, false, kwSet) + '</b>' : '';
  } else {
    const split = Math.ceil(safe.length / 2);
    const show = (w, i) =>
      wordHtml(w, i, mode === 'progressive' && i >= count, kwSet);

    const first = safe.slice(0, split).map((w, i) => show(w, i));
    const second = safe.slice(split).map((w, i) => show(w, i + split));

    // Retour à la ligne automatique
    captionPreview.innerHTML =
      first.join(' ') +
      (second.length ? ' <b>' + second.join(' ') + '</b>' : '');
  }

  captionPreview.classList.toggle('kwon', kwMode !== 'off');
  captionPreview.style.setProperty('--accent', colorInput.value);
  captionPreview.style.setProperty('--kw', kwColorInput.value);

  if (kwMode === 'off') {
    captionPreview.querySelector('b')
      ?.style.setProperty('color', colorInput.value);
  }
}

// Combien de mots ont déjà été prononcés dans ce segment
function visibleCount(seg, t) {
  const n = seg.text.split(/\s+/).filter(Boolean).length;
  if (!n) return 0;

  let starts = seg.starts;
  if (!starts || starts.length !== n) {
    // Pas d'heures précises : on répartit les mots sur la durée du segment
    starts = Array.from(
      { length: n },
      (_, i) => seg.start + ((seg.end - seg.start) * i) / n
    );
  }

  return starts.filter(s => t >= s).length;
}

// Dessiner le sous-titre selon le temps de la vidéo
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

// Personnalisation des sous-titres
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

// Synchronisation avec la vidéo
function syncCaption() {
  if (!segments.length) return;
  drawSegments(false);
}

function tick() {
  skipSilence();
  syncCaption();
  applyZoom();
  updateHook();
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
  computeSilences();
  updateSilenceInfo();
  updateHook();
});

// Corriger le texte (une ligne = un sous-titre)
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

// Aperçu
document.getElementById('previewButton')
  .addEventListener('click', () => {
    lastShown = null;
    updateCaption();
    updateHook();
    showToast('Aperçu actualisé.');
  });

colorInput.addEventListener('input', () => {
  lastShown = null;
  updateCaption();
});

// ===== EXPORT SRT / VTT =====
function baseName() {
  return selectedFile
    ? selectedFile.name.replace(/\.[^.]+$/, '')
    : 'justevivo';
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

  // Les horaires suivent la vidéo raccourcie si les silences sont supprimés
  const rows = segments
    .filter(s => s.text)
    .map(s => ({
      start: outTime(s.start),
      end: outTime(s.end),
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
  const blob = new Blob([buildSubtitles(kind)], {
    type: type + ';charset=utf-8'
  });
  downloadBlob(blob, baseName() + '.' + kind);
  showToast('Fichier ' + kind.toUpperCase() + ' téléchargé.');
}

srtButton.addEventListener('click', () => exportSubtitles('srt'));
vttButton.addEventListener('click', () => exportSubtitles('vtt'));

// ===== EXPORT VIDÉO (dessin des sous-titres sur canvas) =====
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

// Texte à afficher à l'instant t (même logique que l'aperçu)
function getCaptionState(t) {
  const seg = segments.find(s => t >= s.start && t < s.end);
  if (!seg) return null;

  const words = seg.text.split(/\s+/).filter(Boolean);
  if (!words.length) return null;

  const count = displayMode === 'all' ? -1 : visibleCount(seg, t);
  return { words, count };
}

// Titre d'accroche dessiné dans la vidéo exportée
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

  // Échelle adaptée à la vidéo, puis taille choisie par l'utilisateur
  const sc = Math.min(h / 240, w / 200);
  const upper = cfg.upper || upperCase;
  const conv = x => (upper ? x.toUpperCase() : x);

  const words = st.words;
  const n = words.length;
  const kwSet = keywordIndexes(words, kwMode);
  const split = Math.ceil(n / 2);

  // Mots à dessiner (la 2e moitié prend la couleur d'accentuation)
  let items = words.map((x, i) => ({
    text: x,
    second: i >= split,
    show: displayMode !== 'progressive' || i < st.count,
    kw: kwSet.has(i)
  }));

  if (displayMode === 'single') {
    const i = Math.min(st.count, n) - 1;
    if (i < 0) return;
    items = [{ text: words[i], second: true, show: true, kw: kwSet.has(i) }];
  }

  const fontFor = (second, px) =>
    (cfg.italic && !(second && cfg.line2NoItalic) ? 'italic ' : '') +
    (second && cfg.line2Weight ? cfg.line2Weight : weight) +
    ' ' + px + 'px ' + family;

  ctx.save();

  const setSpacing = px => {
    if ('letterSpacing' in ctx) {
      ctx.letterSpacing =
        (((cfg.spacing || 0) * sc) + letterGap * px) + 'px';
    }
  };

  const boxPadX = cfg.box ? cfg.box.padX * sc : 0;
  const boxPadY = cfg.box ? cfg.box.padY * sc : 0;
  const maxWidth = Math.max(40, w * (widthPercent / 100) - boxPadX * 2);

  // Retour à la ligne automatique
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

  // Réduction seulement si un mot seul est plus large que la zone de texte
  let guard = 0;
  while (
    guard++ < 8 &&
    widest(lines) > maxWidth * 1.001 &&
    size > fullSize * 0.4
  ) {
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

  // Boîte de fond
  if (cfg.box) {
    const bw = widest(lines) + boxPadX * 2;
    const bh = totalH + boxPadY * 2;
    ctx.save();
    roundRectPath(
      ctx, w / 2 - bw / 2, top - boxPadY, bw, bh,
      cfg.box.radius * sc
    );
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

      // Avec les mots-clés, tout le texte garde la couleur de base
      const colorKey = kwOn ? cfg.c1 : (it.second ? cfg.c2 : cfg.c1);
      let fill = colorKey === 'accent' ? accent : colorKey;

      if (cfg.grad) {
        const g = cfg.gradDir === 'h'
          ? ctx.createLinearGradient(x0, 0, x0 + line.width, 0)
          : ctx.createLinearGradient(0, cy - lh / 2, 0, cy + lh / 2);
        cfg.grad.forEach((c, i) =>
          g.addColorStop(i / (cfg.grad.length - 1), c)
        );
        fill = g;
      }

      const itemFill = it.kw ? kwColor : fill;

      // Surligneur : fond de couleur derrière les mots-clés (ou la 2e moitié)
      const marked = cfg.marker && (kwOn ? it.kw : it.second);
      if (marked) {
        ctx.save();
        roundRectPath(
          ctx, x - 6 * sc, cy - lh * 0.45,
          entry.ww + 12 * sc, lh * 0.9, 4 * sc
        );
        ctx.fillStyle = kwOn ? kwColor : accent;
        ctx.fill();
        ctx.restore();
        ctx.fillStyle = '#000';
        ctx.fillText(txt, x, cy);
        return;
      }

      // Ombres / lueurs (la plus éloignée en premier)
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
        ctx.strokeStyle = it.kw
          ? kwColor
          : (it.second && !kwOn ? accent : '#fff');
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

const MIME_CHOICES = [
  'video/mp4;codecs=avc1.42E01E,mp4a.40.2',
  'video/mp4',
  'video/webm;codecs=vp9,opus',
  'video/webm;codecs=vp8,opus',
  'video/webm'
];

exportVideoButton.addEventListener('click', async () => {
  if (!selectedFile) {
    showToast('Importez d’abord une vidéo.');
    return;
  }

  if (!segments.length) {
    showToast('Générez d’abord les sous-titres IA.');
    return;
  }

  if (
    typeof MediaRecorder === 'undefined' ||
    !HTMLCanvasElement.prototype.captureStream
  ) {
    showToast('Ce navigateur ne permet pas l’export vidéo. Essayez Chrome.');
    return;
  }

  const idleLabel = 'Exporter la vidéo sous-titrée';
  exportVideoButton.disabled = true;
  exportVideoButton.textContent = 'Préparation...';
  videoPreview.pause();

  let audioCtx = null;
  let objectUrl = null;

  try {
    // S'assurer que la police du style / choisie est bien chargée
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

    // Taille de sortie (maximum 1280 px sur le grand côté)
    const vw = vid.videoWidth || 720;
    const vh = vid.videoHeight || 1280;
    const ratio = Math.min(1, 1280 / Math.max(vw, vh));
    const w = Math.max(2, Math.round((vw * ratio) / 2) * 2);
    const h = Math.max(2, Math.round((vh * ratio) / 2) * 2);

    const canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d');

    const stream = canvas.captureStream(30);

    // Récupérer le son de la vidéo
    let hasAudio = false;
    try {
      const AC = window.AudioContext || window.webkitAudioContext;
      audioCtx = new AC();
      await audioCtx.resume();
      const srcNode = audioCtx.createMediaElementSource(vid);
      const dest = audioCtx.createMediaStreamDestination();
      srcNode.connect(dest);
      dest.stream.getAudioTracks().forEach(tr => stream.addTrack(tr));
      hasAudio = true;
    } catch (e) {
      console.warn('Son non capturé :', e);
    }

    const mime = MIME_CHOICES.find(m => MediaRecorder.isTypeSupported(m)) || '';
    const recorder = new MediaRecorder(
      stream,
      mime
        ? { mimeType: mime, videoBitsPerSecond: 5000000 }
        : { videoBitsPerSecond: 5000000 }
    );

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
        resolve(
          new Blob(chunks, {
            type: recorder.mimeType || mime || 'video/webm'
          })
        );

      recorder.onerror = e =>
        reject((e && e.error) || new Error('Erreur d’enregistrement.'));

      vid.onended = () => {
        if (recorder.state !== 'inactive') recorder.stop();
      };

      const draw = () => {
        // Sauter les silences
        if (silenceOn && silences.length && !vid.seeking) {
          const cur = vid.currentTime;
          const sl = silences.find(x => cur >= x.from && cur < x.to);
          if (sl) vid.currentTime = sl.to;
        }

        // Image de la vidéo (avec zoom automatique)
        const z = zoomAt(vid.currentTime);
        if (z > 1.0005) {
          const sw = vw / z;
          const sh = vh / z;
          ctx.drawImage(vid, (vw - sw) / 2, (vh - sh) / 2, sw, sh, 0, 0, w, h);
        } else {
          ctx.drawImage(vid, 0, 0, w, h);
        }

        drawCaption(ctx, w, h, vid.currentTime);
        drawHook(ctx, w, h, vid.currentTime);

        const pct = vid.duration
          ? Math.min(100, Math.round((vid.currentTime / vid.duration) * 100))
          : 0;
        exportVideoButton.textContent = 'Export en cours... ' + pct + '%';

        if (!vid.ended && recorder.state !== 'inactive') {
          requestAnimationFrame(draw);
        }
      };

      recorder.start(1000);

      vid.play()
        .then(() => requestAnimationFrame(draw))
        .catch(() => {
          reject(new Error('Lecture bloquée. Touchez de nouveau le bouton d’export.'));
          if (recorder.state !== 'inactive') recorder.stop();
        });
    });

    const ext = blob.type.includes('mp4') ? 'mp4' : 'webm';
    downloadBlob(blob, baseName() + '-sous-titres.' + ext);
    showToast('Vidéo exportée (' + ext.toUpperCase() + ') et téléchargée.');

  } catch (error) {
    console.error('Erreur export :', error);
    showToast(error.message || 'Export impossible.');
  } finally {
    if (audioCtx) audioCtx.close().catch(() => {});
    if (objectUrl) URL.revokeObjectURL(objectUrl);
    exportVideoButton.disabled = false;
    exportVideoButton.textContent = idleLabel;
  }
});

// Abonnements
document.querySelectorAll('.plan-button').forEach(button => {
  button.addEventListener('click', () => {
    showToast(
      'La formule ' + button.dataset.plan +
      ' sera disponible après activation des paiements.'
    );
  });
});

updateSilenceInfo();
updateCaption();
