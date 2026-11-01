// ===== JUSTEVIVO · app3.js · export vidéo + Outils IA =====

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

// ===== OUTILS IA : section « Outils » + fenêtre des générateurs =====
const TOOL_GROUPS = [
  { id: 'youtube', name: 'YouTube', icon: '▶', tools: [
    ['yt_title', 'Générateur de titres'],
    ['yt_desc', 'Générateur de descriptions'],
    ['yt_hashtag', 'Générateur de hashtags'],
    ['yt_user', 'Générateur de noms de chaîne'],
    ['transcript', 'Transcription de ma vidéo']
  ] },
  { id: 'instagram', name: 'Instagram', icon: '◎', tools: [
    ['ig_caption', 'Générateur de légendes'],
    ['ig_hashtag', 'Générateur de hashtags'],
    ['ig_user', 'Générateur de noms d’utilisateur']
  ] },
  { id: 'tiktok', name: 'TikTok', icon: '♪', tools: [
    ['tt_caption', 'Générateur de légendes'],
    ['tt_hashtag', 'Générateur de hashtags'],
    ['tt_user', 'Générateur de noms d’utilisateur']
  ] },
  { id: 'create', name: 'Création de contenu', icon: '✦', tools: [
    ['idea', 'Générateur d’idées de vidéo'],
    ['hook', 'Générateur d’accroches'],
    ['script', 'Générateur de scripts vidéo']
  ] }
];

const TONE_OPTIONS = [
  ['neutre', 'Neutre'], ['drole', 'Drôle'], ['pro', 'Professionnel'],
  ['inspirant', 'Inspirant'], ['provoc', 'Audacieux'], ['educatif', 'Éducatif']
];

const LANG_OPTIONS = [
  ['fr', 'Français'], ['en', 'English'], ['es', 'Español'], ['pt', 'Português'],
  ['de', 'Deutsch'], ['it', 'Italiano'], ['ar', 'العربية']
];

const toolsCss = document.createElement('style');
toolsCss.textContent = `
.tools-section{padding:80px 8% 60px}
.tools-head{margin-bottom:22px}
.tools-head h2{font-size:34px;letter-spacing:-1.5px;margin:10px 0}
.tools-head h2 span{background:linear-gradient(90deg,#b57cff,#41c7ff);color:transparent;background-clip:text;-webkit-background-clip:text}
.tools-head p{color:var(--muted);font-size:13px;line-height:1.7;max-width:540px;margin:0}
.tools-card{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));border:1px solid #2b3554;border-radius:16px;background:#0e1426;overflow:hidden;box-shadow:0 25px 80px #0005}
.tools-col{padding:20px 16px;border-right:1px solid #27314e;min-width:0}
.tools-col:last-child{border-right:0}
.tools-col h3{display:flex;align-items:center;gap:10px;margin:0 0 12px;font-size:14px}
.tools-ico{width:28px;height:28px;flex:none;border-radius:8px;display:grid;place-items:center;font-size:13px;color:#fff;background:linear-gradient(135deg,#a13cff,#25baff)}
.tool-link{display:block;width:100%;text-align:left;background:none;border:0;border-radius:8px;padding:10px;margin:2px 0;color:#c2c8d9;font:inherit;font-size:12px;cursor:pointer}
.tool-link:hover{background:#25204a;color:#fff}
@media(max-width:850px){
  .tools-section{padding:60px 5% 40px}
  .tools-card{grid-template-columns:repeat(2,minmax(0,1fr))}
  .tools-col{border-bottom:1px solid #27314e}
}
@media(max-width:600px){
  .tools-card{grid-template-columns:minmax(0,1fr)}
  .tools-col{border-right:0}
  .tools-head h2{font-size:28px}
}
`;
document.head.appendChild(toolsCss);

function mkEl(tag, css, text) {
  const e = document.createElement(tag);
  if (css) Object.assign(e.style, css);
  if (text !== undefined) e.textContent = text;
  return e;
}

const FIELD_CSS = {
  width: '100%',
  boxSizing: 'border-box',
  padding: '10px',
  background: '#0b1122',
  color: '#fff',
  border: '1px solid #34405f',
  borderRadius: '8px',
  fontSize: '13px',
  fontFamily: 'inherit'
};

const LABEL_CSS = { display: 'block', fontSize: '11px', color: '#b9c2d8', margin: '12px 0 6px' };

function findTool(id) {
  for (const g of TOOL_GROUPS) {
    for (const t of g.tools) {
      if (t[0] === id) return { id, label: t[1], group: g.name };
    }
  }
  return null;
}

// Fenêtre d'un outil
const toolModal = mkEl('div', {
  position: 'fixed', top: '0', left: '0', right: '0', bottom: '0',
  background: 'rgba(4,7,16,0.9)', zIndex: '9998', display: 'none',
  justifyContent: 'center', alignItems: 'flex-start', padding: '12px', overflowY: 'auto'
});

const toolCard = mkEl('div', {
  width: '100%', maxWidth: '520px', background: '#10162a', border: '1px solid #34405f',
  borderRadius: '14px', padding: '14px', color: '#fff', fontFamily: 'inherit',
  fontSize: '12px', boxSizing: 'border-box'
});

const toolTitle = mkEl('div', { fontWeight: '800', fontSize: '15px', marginBottom: '6px' });
const toolForm = mkEl('div');
const toolTopicLabel = mkEl('label', LABEL_CSS);

const toolTopic = document.createElement('textarea');
toolTopic.rows = 4;
toolTopic.maxLength = 1500;
Object.assign(toolTopic.style, FIELD_CSS, { resize: 'vertical' });

const toolFill = document.createElement('button');
toolFill.type = 'button';
toolFill.className = 'button ghost full';
toolFill.textContent = 'Utiliser le texte de ma vidéo';

const toolToneLabel = mkEl('label', LABEL_CSS, 'Ton');
const toolTone = document.createElement('select');
styleSelect(toolTone);
TONE_OPTIONS.forEach(([id, name]) => {
  const o = document.createElement('option');
  o.value = id;
  o.textContent = name;
  toolTone.appendChild(o);
});

const toolLangLabel = mkEl('label', LABEL_CSS, 'Langue du résultat');
const toolLang = document.createElement('select');
styleSelect(toolLang);
LANG_OPTIONS.forEach(([id, name]) => {
  const o = document.createElement('option');
  o.value = id;
  o.textContent = name;
  toolLang.appendChild(o);
});

const toolGo = document.createElement('button');
toolGo.type = 'button';
toolGo.className = 'button primary full';
toolGo.textContent = 'Générer';

[toolTopicLabel, toolTopic, toolFill, toolToneLabel, toolTone, toolLangLabel, toolLang, toolGo]
  .forEach(e => toolForm.appendChild(e));

const toolStatus = mkEl('div', { color: '#aeb8d0', margin: '10px 0', lineHeight: '1.5' });

const toolResult = document.createElement('textarea');
toolResult.rows = 11;
Object.assign(toolResult.style, FIELD_CSS, { resize: 'vertical', lineHeight: '1.5' });

const toolActions = mkEl('div', { display: 'flex', gap: '8px', margin: '8px 0', flexWrap: 'wrap' });

const toolCopy = document.createElement('button');
toolCopy.type = 'button';
toolCopy.className = 'button ghost';
toolCopy.textContent = 'Copier';

const toolDl = document.createElement('button');
toolDl.type = 'button';
toolDl.className = 'button ghost';
toolDl.textContent = 'Télécharger (.txt)';

toolActions.appendChild(toolCopy);
toolActions.appendChild(toolDl);

const toolClose = document.createElement('button');
toolClose.type = 'button';
toolClose.className = 'button ghost full';
toolClose.textContent = 'Fermer';

[toolTitle, toolForm, toolStatus, toolResult, toolActions, toolClose].forEach(e => toolCard.appendChild(e));
toolModal.appendChild(toolCard);
document.body.appendChild(toolModal);

let currentTool = null;

const USER_TOOLS = ['yt_user', 'ig_user', 'tt_user'];

function transcriptText() {
  if (!segments.length) return '';
  return segments
    .filter(s => s.text)
    .map(s => '[' + fmtTime(s.start) + '] ' + s.text)
    .join('\n');
}

function openTool(id) {
  const meta = findTool(id);
  if (!meta) return;

  currentTool = id;
  toolTitle.textContent = meta.group + ' · ' + meta.label;
  toolResult.value = '';
  toolStatus.textContent = '';
  toolDl.style.display = 'none';

  if (id === 'transcript') {
    toolForm.style.display = 'none';
    const txt = transcriptText();
    toolResult.value = txt;
    toolDl.style.display = '';
    toolStatus.textContent = txt
      ? 'Transcription de votre vidéo (modifiable).'
      : 'Importez une vidéo et générez les sous-titres IA pour obtenir sa transcription.';
  } else {
    toolForm.style.display = 'block';
    const isUser = USER_TOOLS.indexOf(id) >= 0;
    toolTopicLabel.textContent = isUser ? 'Votre thème ou votre nom' : 'De quoi parle votre vidéo ?';
    toolTopic.placeholder = isUser
      ? 'Ex : cuisine facile, fitness, voyage'
      : 'Ex : comment économiser 200 € par mois';
    toolFill.style.display = segments.length ? '' : 'none';
    toolStatus.textContent = 'Décrivez votre sujet, puis touchez « Générer ».';
  }

  toolModal.style.display = 'flex';
  document.body.style.overflow = 'hidden';
}

function closeTool() {
  toolModal.style.display = 'none';
  document.body.style.overflow = '';
  currentTool = null;
}

toolClose.addEventListener('click', closeTool);
toolModal.addEventListener('click', e => {
  if (e.target === toolModal) closeTool();
});

toolFill.addEventListener('click', () => {
  const t = segments.map(s => s.text).join(' ').trim();
  if (!t) {
    toolStatus.textContent = 'Générez d’abord les sous-titres IA de votre vidéo.';
    return;
  }
  toolTopic.value = t.slice(0, 1500);
});

async function copyText(text) {
  if (!text) {
    showToast('Rien à copier pour le moment.');
    return;
  }
  try {
    await navigator.clipboard.writeText(text);
    showToast('Texte copié.');
  } catch (e) {
    prompt('Copiez ce texte :', text);
  }
}

toolCopy.addEventListener('click', () => copyText(toolResult.value));

toolDl.addEventListener('click', () => {
  const txt = toolResult.value;
  if (!txt) {
    showToast('Rien à télécharger pour le moment.');
    return;
  }
  downloadBlob(new Blob([txt], { type: 'text/plain;charset=utf-8' }), baseName() + '-transcription.txt');
});

async function generateText(tool, topic, tone, lang) {
  let res;
  try {
    res = await fetch(API_URL + '/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tool, topic, tone, lang })
    });
  } catch (e) {
    throw new Error('Impossible de contacter le serveur. Vérifiez qu’il est à jour (server.js) et réessayez.');
  }

  let data = {};
  try {
    data = await res.json();
  } catch (e) { /* réponse vide */ }

  if (!res.ok) {
    throw new Error(data.error || 'Erreur du serveur (' + res.status + ').');
  }
  return data.text || '';
}

toolGo.addEventListener('click', async () => {
  if (!currentTool) return;

  const topic = toolTopic.value.trim();
  if (topic.length < 2) {
    toolStatus.textContent = 'Décrivez votre sujet en quelques mots.';
    return;
  }

  const id = currentTool;
  toolGo.disabled = true;
  toolGo.textContent = 'Génération...';
  toolStatus.textContent = 'Génération en cours (si le serveur dormait, comptez jusqu’à 1 minute)...';

  try {
    const text = await generateText(id, topic, toolTone.value, toolLang.value);
    if (currentTool !== id) return;
    toolResult.value = text;
    toolStatus.textContent = text
      ? 'Terminé. Vous pouvez modifier le texte avant de le copier.'
      : 'Aucun résultat. Réessayez.';
  } catch (e) {
    toolStatus.textContent = e.message || 'Génération impossible.';
  } finally {
    toolGo.disabled = false;
    toolGo.textContent = 'Générer';
  }
});

// Section « Outils » (colonnes comme un menu) + lien dans le menu du haut
(function buildToolsSection() {
  const studio = document.getElementById('studio');
  if (!studio || !studio.parentNode) return;

  const section = document.createElement('section');
  section.className = 'tools-section';
  section.id = 'tools';

  const head = document.createElement('div');
  head.className = 'tools-head';
  head.innerHTML =
    '<div class="eyebrow">OUTILS POUR CRÉATEURS</div>' +
    '<h2>Générateurs <span>IA</span></h2>' +
    '<p>Titres, descriptions, hashtags, légendes, idées et scripts : choisissez un outil, ' +
    'décrivez votre sujet et copiez le résultat.</p>';
  section.appendChild(head);

  const card = document.createElement('div');
  card.className = 'tools-card';

  TOOL_GROUPS.forEach(g => {
    const col = document.createElement('div');
    col.className = 'tools-col';

    const h = document.createElement('h3');
    const ico = document.createElement('span');
    ico.className = 'tools-ico';
    ico.textContent = g.icon;
    h.appendChild(ico);
    h.appendChild(document.createTextNode(g.name));
    col.appendChild(h);

    g.tools.forEach(([id, label]) => {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'tool-link';
      b.textContent = label;
      b.addEventListener('click', () => openTool(id));
      col.appendChild(b);
    });

    card.appendChild(col);
  });

  section.appendChild(card);
  studio.parentNode.insertBefore(section, studio.nextSibling);

  const nav = document.querySelector('.topbar nav');
  if (nav && !nav.querySelector('a[href="#tools"]')) {
    const a = document.createElement('a');
    a.href = '#tools';
    a.textContent = 'Outils';
    nav.insertBefore(a, nav.querySelector('a[href="#pricing"]'));
  }
})();
