// ===== Export de la vidéo =====
const MIME_CHOICES = [
  'video/mp4;codecs=avc1.42E01E,mp4a.40.2',
  'video/mp4',
  'video/webm;codecs=vp9,opus',
  'video/webm;codecs=vp8,opus',
  'video/webm'
];

// ===== Choix de la résolution d'export =====
let exportQuality = '720p';

(function addExportQualityControl() {
  if (!exportVideoButton || document.getElementById('justevivo-export-quality')) return;

  const wrap = document.createElement('label');
  wrap.id = 'justevivo-export-quality';
  wrap.style.cssText = 'display:flex;align-items:center;gap:10px;flex-wrap:wrap;margin:10px 0;color:#cbd5e1;font-family:inherit;font-size:13px;font-weight:600;line-height:1.4;';

  const caption = document.createElement('span');
  caption.textContent = 'Qualité vidéo';

  const select = document.createElement('select');
  select.id = 'justevivo-export-resolution';
  select.setAttribute('aria-label', 'Résolution de la vidéo exportée');
  select.style.cssText = 'min-width:145px;padding:10px 12px;border:1px solid #475569;border-radius:9px;background:#111827;color:#fff;font-family:inherit;font-size:13px;font-weight:600;';

  [
    ['original', 'Originale'],
    ['720p', 'HD 720p'],
    ['1080p', 'Full HD 1080p']
  ].forEach(([value, label]) => {
    const option = document.createElement('option');
    option.value = value;
    option.textContent = label;
    select.appendChild(option);
  });

  select.value = exportQuality;
  select.addEventListener('change', () => {
    exportQuality = select.value;
  });

  const help = document.createElement('small');
  help.textContent = '1080p donne une image plus nette et un fichier plus lourd.';
  help.style.cssText = 'flex-basis:100%;color:#94a3b8;font-size:11px;font-weight:400;';

  wrap.append(caption, select, help);
  exportVideoButton.parentNode.insertBefore(wrap, exportVideoButton);
})();

function getExportDimensions(vw, vh, ratio) {
  const sourceLong = Math.max(vw, vh);
  const targetLong = exportQuality === 'original'
    ? sourceLong
    : (exportQuality === '1080p' ? 1920 : 1280);

  let w;
  let h;

  if (!ratio) {
    const scale = targetLong / sourceLong;
    w = vw * scale;
    h = vh * scale;
  } else if (ratio < 1) {
    h = targetLong;
    w = h * ratio;
  } else {
    w = targetLong;
    h = w / ratio;
  }

  w = Math.max(2, Math.round(w / 2) * 2);
  h = Math.max(2, Math.round(h / 2) * 2);
  return { w, h };
}

function getExportBitrate() {
  if (exportQuality === '1080p') return 10000000;
  if (exportQuality === 'original') return 12000000;
  return 5000000;
}

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
    const dimensions = getExportDimensions(vw, vh, rr);
    const w = dimensions.w;
    const h = dimensions.h;

    const canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d');

    const stream = canvas.captureStream(30);

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
      mime ? { mimeType: mime, videoBitsPerSecond: getExportBitrate() } : { videoBitsPerSecond: getExportBitrate() }
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
