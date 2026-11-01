// ===== JUSTEVIVO · app4.js (version 2) · vidéos de plus de 25 Mo =====
(function () {
  const SMALL_LIMIT = 24 * 1024 * 1024;  // en dessous : envoi direct de la vidéo
  const MAX_FILE = 600 * 1024 * 1024;    // taille maximale acceptée
  const RATE = 16000;                    // fréquence du son envoyé
  const CHUNK_SEC = 540;                 // environ 9 minutes par morceau
  const LABEL = 'Générer les sous-titres IA';

  const sleep = ms => new Promise(r => setTimeout(r, ms));

  // Aperçu léger : ne charge pas toute la vidéo d'avance
  videoPreview.preload = 'metadata';

  // Sécurité : le défilement de la page ne doit jamais rester bloqué
  const unlockStyle = document.createElement('style');
  unlockStyle.textContent = 'html:root{overflow-x:clip}';
  document.head.appendChild(unlockStyle);
  videoInput.addEventListener('change', () => {
    document.body.style.overflow = '';
  });

  // On remplace le bouton pour retirer l'ancienne limite de 25 Mo
  const oldBtn = transcribeButton;
  const btn = oldBtn.cloneNode(true);
  oldBtn.parentNode.replaceChild(btn, oldBtn);

  function decodeAB(ctx, ab) {
    return new Promise((resolve, reject) => {
      const p = ctx.decodeAudioData(ab, resolve, reject);
      if (p && p.catch) p.catch(reject);
    });
  }

  // Passe le son à 16 000 Hz, par petites étapes pour que la page reste fluide
  async function resample(data, from, to) {
    if (from === to) return data;

    const ratio = from / to;
    const outLen = Math.floor(data.length / ratio);
    const out = new Float32Array(outLen);
    const STEP = 1 << 18;

    for (let s = 0; s < outLen; s += STEP) {
      const e = Math.min(outLen, s + STEP);
      for (let i = s; i < e; i++) {
        const a = Math.floor(i * ratio);
        const b = Math.min(data.length, Math.max(a + 1, Math.floor((i + 1) * ratio)));
        let sum = 0;
        for (let j = a; j < b; j++) sum += data[j];
        out[i] = sum / (b - a);
      }
      await sleep(0);
    }

    return out;
  }

  // Extrait le son de la vidéo, en mono, à 16 000 Hz
  async function extractAudio(file, setStatus) {
    setStatus('Lecture du fichier...');
    await sleep(30);
    let ab = await file.arrayBuffer();

    const AC = window.AudioContext || window.webkitAudioContext;
    let ctx;
    try {
      ctx = new AC({ sampleRate: RATE });
    } catch (e) {
      ctx = new AC();
    }

    let buf;
    try {
      setStatus('Extraction du son...');
      await sleep(30);
      buf = await decodeAB(ctx, ab);
    } finally {
      ab = null;
      try { ctx.close(); } catch (e) { /* rien */ }
    }

    setStatus('Préparation du son...');
    const ch = buf.numberOfChannels;
    const len = buf.length;
    const rate = buf.sampleRate;
    const mono = new Float32Array(len);
    const STEP = 1 << 20;

    for (let c = 0; c < ch; c++) {
      const d = buf.getChannelData(c);
      for (let s = 0; s < len; s += STEP) {
        const e = Math.min(len, s + STEP);
        for (let i = s; i < e; i++) mono[i] += d[i] / ch;
        await sleep(0);
      }
    }

    buf = null;
    return resample(mono, rate, RATE);
  }

  // Coupe le son en morceaux, de préférence dans un moment calme
  function cutPoints(samples) {
    const total = samples.length;
    const chunk = CHUNK_SEC * RATE;

    if (total <= chunk * 1.05) return [0, total];

    const frame = Math.floor(RATE * 0.1);
    const cuts = [0];
    let pos = 0;

    while (total - pos > chunk * 1.05) {
      const target = pos + chunk;
      const from = Math.max(pos + Math.floor(chunk * 0.7), target - 15 * RATE);
      let best = target;
      let bestE = Infinity;

      for (let s = from; s + frame <= target; s += frame) {
        let e = 0;
        for (let i = s; i < s + frame; i++) e += samples[i] * samples[i];
        if (e < bestE) {
          bestE = e;
          best = s + Math.floor(frame / 2);
        }
      }

      cuts.push(best);
      pos = best;
    }

    cuts.push(total);
    return cuts;
  }

  // Fabrique un fichier WAV (16 bits, mono)
  function toWav(samples, start, end) {
    const n = end - start;
    const buffer = new ArrayBuffer(44 + n * 2);
    const v = new DataView(buffer);
    const w = (o, s) => {
      for (let i = 0; i < s.length; i++) v.setUint8(o + i, s.charCodeAt(i));
    };

    w(0, 'RIFF');
    v.setUint32(4, 36 + n * 2, true);
    w(8, 'WAVE');
    w(12, 'fmt ');
    v.setUint32(16, 16, true);
    v.setUint16(20, 1, true);
    v.setUint16(22, 1, true);
    v.setUint32(24, RATE, true);
    v.setUint32(28, RATE * 2, true);
    v.setUint16(32, 2, true);
    v.setUint16(34, 16, true);
    w(36, 'data');
    v.setUint32(40, n * 2, true);

    let o = 44;
    for (let i = start; i < end; i++, o += 2) {
      const s = Math.max(-1, Math.min(1, samples[i]));
      v.setInt16(o, s < 0 ? s * 0x8000 : s * 0x7fff, true);
    }

    return new Blob([buffer], { type: 'audio/wav' });
  }

  async function postAudio(blob, name) {
    const fd = new FormData();
    fd.append('audio', blob, name);

    let res;
    try {
      res = await fetch(API_URL + '/api/transcribe', { method: 'POST', body: fd });
    } catch (e) {
      throw new Error('Impossible de contacter le serveur.');
    }

    let data = {};
    try {
      data = await res.json();
    } catch (e) { /* réponse vide */ }

    if (!res.ok) {
      throw new Error(data.error || 'Erreur du serveur (' + res.status + ').');
    }
    return data;
  }

  function extractErrorText(e) {
    const n = e && e.name;
    if (n === 'RangeError' || n === 'NotReadableError') {
      return 'Ce fichier est trop lourd pour la mémoire de cet appareil. ' +
        'Essayez sur ordinateur, ou raccourcissez la vidéo.';
    }
    return 'Le son de cette vidéo n’a pas pu être lu par votre navigateur ' +
      '(format non pris en charge ou pas de piste audio). ' +
      'Essayez avec Chrome sur ordinateur, ou compressez la vidéo.';
  }

  // Même traitement du résultat que pour une petite vidéo
  function applyResult(segs, words, text) {
    if (segs.length) {
      baseSegments = makeBase(segs, words);
      rebuildSegments();
      edited = false;
      captionText.value = segments.map(s => s.text).join('\n');
    } else {
      baseSegments = [];
      segments = [];
      captionText.value = text;
    }

    computeSilences();
    updateSilenceInfo();
    lastShown = null;
    updateCaption();
  }

  btn.addEventListener('click', async () => {
    if (!selectedFile) {
      showToast('Importez d’abord une vidéo.');
      return;
    }

    if (selectedFile.size > MAX_FILE) {
      showToast('Fichier trop volumineux : maximum 600 Mo.');
      return;
    }

    const big = selectedFile.size > SMALL_LIMIT;

    // Vidéo longue : on prévient avant de lancer le travail lourd
    if (big) {
      const dur = videoPreview.duration;
      const mem = navigator.deviceMemory || 4;
      const safeSeconds = mem * 200;

      if (isFinite(dur) && dur > safeSeconds) {
        const ok = confirm(
          'Cette vidéo dure environ ' + Math.round(dur / 60) + ' minutes. ' +
          'Sur cet appareil, l’extraction du son peut ralentir ou bloquer la page. ' +
          'Un ordinateur est plus sûr pour une longue vidéo. Continuer quand même ?'
        );
        if (!ok) return;
      }
    }

    const setStatus = t => {
      btn.textContent = t;
    };

    btn.disabled = true;

    try {
      const segs = [];
      const words = [];
      let text = '';
      let language = '';

      if (!big) {
        setStatus('Transcription en cours...');
        const data = await postAudio(selectedFile, selectedFile.name);
        (data.segments || []).forEach(s => segs.push(s));
        (data.words || []).forEach(w => words.push(w));
        text = data.text || '';
        language = data.language || '';
      } else {
        showToast('Grosse vidéo : le son est extrait dans votre navigateur, patientez...');

        let samples;
        try {
          samples = await extractAudio(selectedFile, setStatus);
        } catch (e) {
          console.warn('Extraction audio :', e);
          throw new Error(extractErrorText(e));
        }

        const cuts = cutPoints(samples);
        const parts = cuts.length - 1;

        for (let k = 0; k < parts; k++) {
          setStatus('Transcription ' + (k + 1) + '/' + parts + '...');
          await sleep(30);

          const blob = toWav(samples, cuts[k], cuts[k + 1]);
          const data = await postAudio(blob, 'partie' + (k + 1) + '.wav');
          const off = cuts[k] / RATE;

          (data.segments || []).forEach(s => {
            segs.push({ start: s.start + off, end: s.end + off, text: s.text });
          });
          (data.words || []).forEach(w => {
            words.push({ start: w.start + off, end: w.end + off, word: w.word });
          });

          text += (text ? ' ' : '') + (data.text || '');
          if (!language) language = data.language || '';
        }

        samples = null;
      }

      if (!text.trim()) {
        throw new Error('Aucun texte détecté dans le fichier.');
      }

      applyResult(segs, words, text);

      showToast(
        'Transcription réussie ! Langue : ' + (language || 'détectée') +
        (segments.length ? '. Une ligne = un sous-titre, ne supprimez pas de ligne.' : '')
      );
    } catch (error) {
      console.error('Erreur JUSTEVIVO :', error);
      showToast(error.message || 'Impossible de contacter le serveur.');
    } finally {
      document.body.style.overflow = '';
      btn.disabled = false;
      btn.textContent = LABEL;
    }
  });
})();
