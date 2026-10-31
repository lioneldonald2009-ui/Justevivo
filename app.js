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

let activeStyle = 'pop';
let selectedFile = null;
let segments = []; // [{ start, end, text }]

function showToast(message) {
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(
    () => toast.classList.remove('show'),
    4000
  );
}

// Ajouter le bouton de transcription IA
const transcribeButton = document.createElement('button');
transcribeButton.type = 'button';
transcribeButton.className = 'button primary full';
transcribeButton.textContent = 'Générer les sous-titres IA';

document.querySelector('.controls-panel')
  .appendChild(transcribeButton);

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

  const url = URL.createObjectURL(file);
  videoPreview.src = url;
  videoPreview.hidden = false;
  placeholder.hidden = true;
  fileName.textContent = file.name;

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

  previewFrame.classList.remove('pop', 'neon', 'clean');
  previewFrame.classList.add(activeStyle);
}

// Synchronisation avec la vidéo
let lastShown = null;

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

// Styles
document.querySelectorAll('.style-option').forEach(button => {
  button.addEventListener('click', () => {
    document.querySelectorAll('.style-option')
      .forEach(b => b.classList.remove('selected'));

    button.classList.add('selected');
    activeStyle = button.dataset.style;
    lastShown = null;
    updateCaption();
  });
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
