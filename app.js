
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

  const url = URL.createObjectURL(file);
  videoPreview.src = url;
  videoPreview.hidden = false;
  placeholder.hidden = true;
  fileName.textContent = file.name;

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

    captionText.value = result.text;
    updateCaption();

    showToast(
      'Transcription réussie ! Langue : ' +
      (result.language || 'détectée')
    );

  } catch (error) {
    console.error('Erreur JUSTEVIVO :', error);
    showToast(error.message || 'Impossible de contacter le serveur.');
  } finally {
    transcribeButton.disabled = false;
    transcribeButton.textContent = 'Générer les sous-titres IA';
  }
});

// Personnalisation des sous-titres
function updateCaption() {
  const words = captionText.value.trim()
    .split(/\s+/)
    .filter(Boolean);

  const safe = words.map(w =>
    w.replace(/[&<>"]/g, c => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;'
    }[c]))
  );

  if (!safe.length) {
    captionPreview.textContent = 'VOTRE TEXTE';
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

  previewFrame.classList.remove('pop', 'neon', 'clean');
  previewFrame.classList.add(activeStyle);
}

// Styles
document.querySelectorAll('.style-option').forEach(button => {
  button.addEventListener('click', () => {
    document.querySelectorAll('.style-option')
      .forEach(b => b.classList.remove('selected'));

    button.classList.add('selected');
    activeStyle = button.dataset.style;
    updateCaption();
  });
});

// Aperçu
document.getElementById('previewButton')
  .addEventListener('click', () => {
    updateCaption();
    showToast('Aperçu actualisé.');
  });

captionText.addEventListener('input', updateCaption);
colorInput.addEventListener('input', updateCaption);

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
