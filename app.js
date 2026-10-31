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
  ['or', 'OR']
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

let activeStyle = 'pop';
let selectedFile = null;
let segments = []; // [{ start, end, text }]
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

// Évite le faux gras sur les polices à une seule graisse
const fontStyle = document.createElement('style');
fontStyle.textContent =
  '#captionPreview.custom-font b{font-weight:inherit;font-family:inherit}';
document.head.appendChild(fontStyle);

// Créer le menu des polices (au-dessus de la couleur)
const fontLabel = document.createElement('label');
fontLabel.className = 'field-label';
fontLabel.htmlFor = 'captionFont';
fontLabel.textContent = 'Police';

const fontSelect = document.createElement('select');
fontSelect.id = 'captionFont';
Object.assign(fontSelect.style, {
  width: '100%',
  padding: '10px',
  background: '#0b1122',
  color: '#fff',
  border: '1px solid #34405f',
  borderRadius: '8px',
  fontSize: '12px',
  fontFamily: 'inherit'
});

FONTS.forEach((f, i) => {
  const option = document.createElement('option');
  option.value = String(i);
  option.textContent = f[0];
  fontSelect.appendChild(option);
});

const colorLabel = document.querySelector('label[for="captionColor"]');
colorLabel.parentNode.insertBefore(fontLabel, colorLabel);
colorLabel.parentNode.insertBefore(fontSelect, colorLabel);

function applyFont() {
  const f = FONTS[Number(fontSelect.value)];

  if (f[1]) {
    captionPreview.style.fontFamily = f[1];
    captionPreview.style.fontWeight = f[2];
    captionPreview.style.fontSize = f[3];
    captionPreview.classList.add('custom-font');
  } else {
    captionPreview.style.fontFamily = '';
    captionPreview.style.fontWeight = '';
    captionPreview.style.fontSize = '';
    captionPreview.classList.remove('custom-font');
  }
}

fontSelect.addEventListener('change', () => {
  applyFont();
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

// Placer le sous-titre PAR-DESSUS la vidéo
function attachCaptionToVideo() {
  if (getComputedStyle(previewFrame).position === 'static') {
    previewFrame.style.position = 'relative';
  }

  previewFrame.appendChild(captionPreview);

  const s = captionPreview.style;
  s.position = 'absolute';
  s.left = '0';
  s.right = '0';
  s.bottom = '16%';
  s.top = 'auto';
  s.transform = 'none';
  s.margin = '0 auto';
  s.padding = '0 12px';
  s.textAlign = 'center';
  s.zIndex = '5';
  s.pointerEvents = 'none';
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
  segments = [];
  lastShown = null;

  const url = URL.createObjectURL(file);
  videoPreview.src = url;
  videoPreview.hidden = false;
  placeholder.hidden = true;
  fileName.textContent = file.name;

  attachCaptionToVideo();
  captionText.value = '';
  updateCaption();

  showToast('Vidéo chargée. Vous pouvez lancer la transcription.');
});

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
      segments = result.segments.map(s => ({
        start: s.start,
        end: s.end,
        text: (s.text || '').trim()
      }));
      // Une ligne = un sous-titre
      captionText.value = segments.map(s => s.text).join('\n');
    } else {
      segments = [];
      captionText.value = result.text;
    }

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

// Afficher un texte dans l'aperçu
function renderCaption(text, emptyLabel) {
  const words = text.trim().split(/\s+/).filter(Boolean);
  const safe = words.map(escapeWord);

  if (!safe.length) {
    captionPreview.innerHTML = '';
    captionPreview.textContent = emptyLabel || '';
  } else {
    const split = Math.ceil(safe.length / 2);

    captionPreview.innerHTML =
      safe.slice(0, split).join(' ') +
      '<br><b>' +
      safe.slice(split).join(' ') +
      '</b>';
  }

  captionPreview.style.setProperty('--accent', colorInput.value);

  captionPreview.querySelector('b')
    ?.style.setProperty('color', colorInput.value);
}

// Trouver le sous-titre actif selon le temps de la vidéo
function currentSegmentText() {
  const t = videoPreview.currentTime || 0;
  const seg = segments.find(s => t >= s.start && t < s.end);
  return seg ? seg.text : '';
}

// Personnalisation des sous-titres
function updateCaption() {
  if (segments.length) {
    renderCaption(currentSegmentText(), '');
  } else {
    renderCaption(captionText.value, 'VOTRE TEXTE');
  }

  previewFrame.classList.remove(...STYLES.map(s => s[0]));
  previewFrame.classList.add(activeStyle);
}

// Synchronisation avec la vidéo
function syncCaption() {
  if (!segments.length) return;
  const text = currentSegmentText();
  if (text === lastShown) return;
  lastShown = text;
  renderCaption(text, '');
}

function syncLoop() {
  syncCaption();
  if (!videoPreview.paused && !videoPreview.ended) {
    requestAnimationFrame(syncLoop);
  }
}

videoPreview.addEventListener('play', () => requestAnimationFrame(syncLoop));
videoPreview.addEventListener('timeupdate', syncCaption);
videoPreview.addEventListener('seeked', syncCaption);
videoPreview.addEventListener('pause', syncCaption);

// Corriger le texte (une ligne = un segment)
captionText.addEventListener('input', () => {
  if (segments.length) {
    const lines = captionText.value.split('\n');
    segments.forEach((s, i) => {
      s.text = (lines[i] || '').trim();
    });
    lastShown = null;
  }
  updateCaption();
});

// Aperçu
document.getElementById('previewButton')
  .addEventListener('click', () => {
    lastShown = null;
    updateCaption();
    showToast('Aperçu actualisé.');
  });

colorInput.addEventListener('input', () => {
  lastShown = null;
  updateCaption();
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

updateCaption();
