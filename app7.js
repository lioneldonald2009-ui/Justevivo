// ===== JUSTEVIVO · app7.js · nouveaux styles, mot actif (karaoké), scènes et coupures =====
(function () {
  // On attend que les autres fichiers (app2.js et app3.js) soient chargés
  function ready() {
    return typeof STYLE_CFG !== 'undefined' &&
      typeof drawCaption === 'function' &&
      typeof exportVideo === 'function' &&
      typeof tickAudio === 'function' &&
      typeof fmtTime === 'function';
  }

  let waited = 0;

  (function wait() {
    if (ready()) {
      try {
        start();
      } catch (e) {
        console.error(e);
        showToast('Erreur (app7.js) : ' + e.message);
      }
      return;
    }
    if (waited++ < 200) setTimeout(wait, 200);
  })();

  function start() {
    // ===== 1. Nouveaux styles =====
    const NEW_STYLES = [
      ['hormo', 'IMPACT PLUS'],
      ['vert', 'BOÎTE VERTE'],
      ['orange', 'BOÎTE ORANGE'],
      ['rouge', 'BOÎTE ROUGE'],
      ['bleu', 'BOÎTE BLEUE'],
      ['violet', 'BOÎTE VIOLETTE'],
      ['rosebox', 'BOÎTE ROSE'],
      ['noir', 'NOIR'],
      ['film', 'FILM'],
      ['magazine', 'MAGAZINE'],
      ['signature', 'SIGNATURE'],
      ['neonbleu', 'NÉON BLEU'],
      ['neonorange', 'NÉON ORANGE'],
      ['glitch', 'GLITCH'],
      ['contourrouge', 'CONTOUR ROUGE']
    ];

    NEW_STYLES.forEach(s => {
      if (!STYLES.some(x => x[0] === s[0])) STYLES.push(s);
    });

    // Boîtes de couleur : [fond, texte]
    const BOXES = {
      vert: ['#2bff2b', '#000'],
      orange: ['#ff8a1f', '#fff'],
      rouge: ['#e11d2e', '#fff'],
      bleu: ['#2563ff', '#fff'],
      violet: ['#8b3dff', '#fff'],
      rosebox: ['#ff3d9a', '#fff'],
      noir: ['#000', '#fff']
    };

    let css = '';
    Object.keys(BOXES).forEach(id => {
      const bg = BOXES[id][0];
      const fg = BOXES[id][1];
      css +=
        '.preview-frame.' + id + ' .preview-caption{background:' + bg + ';color:' + fg +
        ';font-weight:900;padding:6px 14px!important;border-radius:6px;text-shadow:none}' +
        '.preview-frame.' + id + ' .preview-caption b{color:' + fg + '!important}\n';
    });

    css += `
.preview-frame.hormo .preview-caption{font-family:'Montserrat','Arial Black',sans-serif;font-weight:900;text-transform:uppercase;color:#fff;-webkit-text-stroke:3px #000;paint-order:stroke fill;text-shadow:0 4px 0 #000}
.preview-frame.hormo .preview-caption b{color:#fff!important}
.preview-frame.film .preview-caption{font-family:Arial,sans-serif;font-weight:700;color:#ffe600;text-shadow:2px 2px 0 #000,-2px -2px 0 #000,2px -2px 0 #000,-2px 2px 0 #000}
.preview-frame.film .preview-caption b{color:#ffe600!important}
.preview-frame.magazine .preview-caption{background:#ffe14d;color:#111;font-family:Georgia,serif;font-weight:700;padding:6px 14px!important;border-radius:4px;text-shadow:none}
.preview-frame.magazine .preview-caption b{color:#111!important}
.preview-frame.signature .preview-caption{font-family:'Pacifico',cursive;font-weight:400;color:#fff;text-shadow:0 3px 10px #000}
.preview-frame.signature .preview-caption b{color:#fff!important;font-weight:400}
.preview-frame.neonbleu .preview-caption{color:#e8f4ff;font-weight:800;text-shadow:0 0 8px #2f7bff,0 0 22px #2f7bff,0 0 40px #2f7bff}
.preview-frame.neonbleu .preview-caption b{color:#fff!important}
.preview-frame.neonorange .preview-caption{color:#fff1e0;font-weight:800;text-shadow:0 0 8px #ff8a1f,0 0 22px #ff8a1f,0 0 40px #ff6a00}
.preview-frame.neonorange .preview-caption b{color:#fff!important}
.preview-frame.glitch .preview-caption{color:#fff;font-weight:900;text-transform:uppercase;text-shadow:3px 0 #ff2d55,-3px 0 #00e5ff}
.preview-frame.glitch .preview-caption b{color:#fff!important}
.preview-frame.contourrouge .preview-caption{color:#ff2a2a;font-weight:900;text-transform:uppercase;-webkit-text-stroke:3px #fff;paint-order:stroke fill;text-shadow:0 3px 8px #0008}
.preview-frame.contourrouge .preview-caption b{color:#ff2a2a!important}
`;

    const styleEl = document.createElement('style');
    styleEl.textContent = css;
    document.head.appendChild(styleEl);

    // Apparence dans la vidéo exportée
    const boxCfg = (id, bg, fg) => ({
      weight: '900', c1: fg, c2: fg, shadows: [],
      box: { bg, padX: 14, padY: 6, radius: 6 }
    });

    Object.assign(STYLE_CFG, {
      hormo: {
        family: "'Montserrat', 'Arial Black', sans-serif", weight: '800', upper: true, size: 24,
        c1: '#fff', c2: '#fff', stroke: 3, shadows: [{ c: '#000', x: 0, y: 4, b: 0 }]
      },
      film: {
        family: 'Arial, sans-serif', weight: '700', c1: '#ffe600', c2: '#ffe600',
        stroke: 2, shadows: []
      },
      magazine: {
        family: 'Georgia, serif', weight: '700', c1: '#111', c2: '#111', shadows: [],
        box: { bg: '#ffe14d', padX: 14, padY: 6, radius: 4 }
      },
      signature: {
        family: "'Pacifico', cursive", weight: '400', size: 24, c1: '#fff', c2: '#fff',
        shadows: [{ c: '#000', x: 0, y: 3, b: 10 }]
      },
      neonbleu: {
        c1: '#e8f4ff', c2: '#fff',
        shadows: [{ c: '#2f7bff', x: 0, y: 0, b: 8 }, { c: '#2f7bff', x: 0, y: 0, b: 22 }, { c: '#2f7bff', x: 0, y: 0, b: 40 }]
      },
      neonorange: {
        c1: '#fff1e0', c2: '#fff',
        shadows: [{ c: '#ff8a1f', x: 0, y: 0, b: 8 }, { c: '#ff8a1f', x: 0, y: 0, b: 22 }, { c: '#ff6a00', x: 0, y: 0, b: 40 }]
      },
      glitch: {
        weight: '900', upper: true, c1: '#fff', c2: '#fff',
        shadows: [{ c: '#ff2d55', x: 3, y: 0, b: 0 }, { c: '#00e5ff', x: -3, y: 0, b: 0 }]
      },
      contourrouge: {
        weight: '900', upper: true, c1: '#ff2a2a', c2: '#ff2a2a', stroke: 3, strokeColor: '#fff',
        shadows: [{ c: 'rgba(0,0,0,0.5)', x: 0, y: 3, b: 8 }]
      }
    });

    Object.keys(BOXES).forEach(id => {
      STYLE_CFG[id] = boxCfg(id, BOXES[id][0], BOXES[id][1]);
    });

    // Onglets de la galerie
    function addToTab(id, ids) {
      const t = STYLE_TABS.find(x => x[0] === id);
      if (t && t[2]) {
        ids.forEach(i => {
          if (t[2].indexOf(i) < 0) t[2].push(i);
        });
      }
    }

    addToTab('classic', ['noir', 'film', 'magazine']);
    addToTab('neon', ['neonbleu', 'neonorange', 'glitch']);
    addToTab('color', ['contourrouge', 'hormo', 'vert', 'orange', 'rouge', 'bleu', 'violet', 'rosebox']);
    addToTab('emoji', ['hormo', 'vert', 'orange', 'rosebox', 'glitch']);
    addToTab('story', ['film', 'magazine', 'signature']);

    if (!STYLE_TABS.some(t => t[0] === 'box')) {
      STYLE_TABS.splice(STYLE_TABS.length - 1, 0, ['box', 'Boîtes',
        ['vert', 'orange', 'rouge', 'bleu', 'violet', 'rosebox', 'noir', 'jaune', 'blanc', 'magazine', 'boite', 'bande', 'clean', 'verre']]);
    }

    if (!STYLE_TABS.some(t => t[0] === 'impact')) {
      STYLE_TABS.splice(STYLE_TABS.length - 1, 0, ['impact', 'Impact',
        ['hormo', 'impact', 'tiktok', 'contourrouge', 'glitch', 'comic', 'sticker', 'retro3d', 'feu']]);
    }

    renderGallery();

    // ===== 2. Mot actif surligné (karaoké) =====
    if (!Array.from(modeSelect.options).some(o => o.value === 'karaoke')) {
      const o = document.createElement('option');
      o.value = 'karaoke';
      o.textContent = 'Mot actif surligné (karaoké)';
      modeSelect.appendChild(o);
    }

    let karaokeT = null;
    let kwBefore = null;

    // Le mot prononcé devient le seul « mot-clé » : il prend la couleur des mots-clés
    const origKeywordIndexes = keywordIndexes;
    keywordIndexes = function (words, mode) {
      if (displayMode !== 'karaoke') return origKeywordIndexes(words, mode);

      const set = new Set();
      const t = karaokeT !== null ? karaokeT : (videoPreview.currentTime || 0);
      const seg = segments.find(s => t >= s.start && t < s.end);
      if (!seg) return set;

      const n = seg.text.split(/\s+/).filter(Boolean).length;
      if (n !== words.length) return set;

      const c = visibleCount(seg, t);
      if (c > 0) set.add(Math.min(c, n) - 1);
      return set;
    };

    // Dans l'export, on donne le temps exact de l'image dessinée
    const origDrawCaption = drawCaption;
    drawCaption = function (ctx, w, h, t) {
      karaokeT = t;
      try {
        return origDrawCaption(ctx, w, h, t);
      } finally {
        karaokeT = null;
      }
    };

    modeSelect.addEventListener('change', () => {
      if (modeSelect.value === 'karaoke') {
        if (kwBefore === null) kwBefore = kwMode;
        kwMode = 'auto';
        kwSelect.value = 'auto';
        showToast('Karaoké : le mot prononcé prend la « Couleur des mots-clés ». Essayez le style SURLIGNEUR.');
      } else if (kwBefore !== null) {
        kwMode = kwBefore;
        kwSelect.value = kwBefore;
        kwBefore = null;
      }
      lastShown = null;
      updateCaption();
    });

    kwSelect.addEventListener('change', () => {
      if (displayMode === 'karaoke' && kwSelect.value === 'off') {
        kwMode = 'auto';
        kwSelect.value = 'auto';
      }
    });

    // ===== 3. Scènes et coupures =====
    let cuts = [];
    let ui = [];
    let rowsRef = null;
    let rowsLen = -1;

    function mergeRanges(list) {
      const sorted = list
        .map(r => ({ from: r.from, to: r.to }))
        .filter(r => r.to > r.from)
        .sort((a, b) => a.from - b.from);

      const out = [];
      sorted.forEach(r => {
        const last = out[out.length - 1];
        if (last && r.from <= last.to + 0.02) {
          last.to = Math.max(last.to, r.to);
        } else {
          out.push(r);
        }
      });
      return out;
    }

    // Les coupures utilisent le même mécanisme que la suppression des silences
    const silSection = Array.from(document.querySelectorAll('.controls-panel details')).find(d => {
      const s = d.querySelector('summary');
      return s && s.textContent.trim() === 'Suppression des silences';
    });
    const autoBox = silSection ? silSection.querySelector('input[type=checkbox]') : null;

    const origComputeSilences = computeSilences;
    computeSilences = function () {
      const wantAuto = !!(autoBox && autoBox.checked);

      silenceOn = wantAuto;
      origComputeSilences();

      const auto = wantAuto ? silences.slice() : [];
      silences = mergeRanges(auto.concat(cuts));
      silenceOn = wantAuto || cuts.length > 0;
    };

    function isCut(seg) {
      return cuts.some(c => c.from <= seg.start + 0.02 && c.to >= seg.end - 0.02);
    }

    const sceneBox = makeSection('Scènes et coupures', false);

    addNote(
      sceneBox,
      'Chaque ligne est un sous-titre. Touchez ✂ pour couper ce passage de la vidéo ' +
      '(il est sauté à la lecture et dans l’export), ↩ pour le remettre, ▶ pour aller à ce moment.'
    );

    const sceneInfo = addNote(sceneBox, '');

    const sceneList = document.createElement('div');
    Object.assign(sceneList.style, {
      maxHeight: '300px',
      overflowY: 'auto',
      margin: '8px 0',
      border: '1px solid #293554',
      borderRadius: '10px',
      background: '#0c1325'
    });
    sceneBox.appendChild(sceneList);

    const sceneClear = document.createElement('button');
    sceneClear.type = 'button';
    sceneClear.className = 'button ghost full';
    sceneClear.textContent = 'Annuler toutes les coupures';
    sceneBox.appendChild(sceneClear);

    function updateInfo() {
      const merged = mergeRanges(cuts);
      const total = merged.reduce((sum, r) => sum + (r.to - r.from), 0);
      sceneInfo.textContent = cuts.length
        ? cuts.length + ' passage(s) coupé(s) · ' + total.toFixed(1) + ' s retirées.'
        : 'Aucun passage coupé.';
    }

    function paintRow(r) {
      const cut = isCut(r.seg);
      r.row.style.opacity = cut ? '0.55' : '1';
      r.input.style.textDecoration = cut ? 'line-through' : 'none';
      r.cutBtn.style.background = cut ? '#5a1f33' : '#121a30';
      r.cutBtn.style.borderColor = cut ? '#ff6b8b' : '#35415f';
      r.cutBtn.textContent = cut ? '↩' : '✂';
    }

    function mini(text, title) {
      const b = document.createElement('button');
      b.type = 'button';
      b.textContent = text;
      b.title = title;
      Object.assign(b.style, {
        flex: 'none',
        width: '34px',
        height: '34px',
        border: '1px solid #35415f',
        background: '#121a30',
        color: '#d9c2ff',
        borderRadius: '8px',
        cursor: 'pointer',
        fontSize: '13px',
        fontFamily: 'inherit'
      });
      return b;
    }

    function applyCuts() {
      computeSilences();
      updateSilenceInfo();
      lastShown = null;
      updateCaption();
      updateHook();
      ui.forEach(paintRow);
      updateInfo();
    }

    function toggleCut(seg) {
      if (isCut(seg)) {
        cuts = cuts.filter(c => !(c.from < seg.end && c.to > seg.start));
      } else {
        cuts.push({ from: seg.start, to: seg.end });
      }
      applyCuts();
    }

    function buildRows() {
      sceneList.innerHTML = '';
      ui = [];
      rowsRef = segments;
      rowsLen = segments.length;

      if (!segments.length) {
        const n = document.createElement('div');
        n.textContent = 'Générez d’abord les sous-titres IA : les scènes apparaîtront ici.';
        Object.assign(n.style, { padding: '12px', color: '#8994ad', fontSize: '11px', lineHeight: '1.5' });
        sceneList.appendChild(n);
        updateInfo();
        return;
      }

      segments.forEach(seg => {
        const row = document.createElement('div');
        Object.assign(row.style, {
          display: 'flex',
          gap: '6px',
          alignItems: 'center',
          padding: '8px',
          borderBottom: '1px solid #1d2742'
        });

        const time = document.createElement('span');
        time.textContent = fmtTime(seg.start);
        Object.assign(time.style, { flex: 'none', width: '34px', color: '#8994ad', fontSize: '10px' });

        const input = document.createElement('input');
        input.type = 'text';
        input.value = seg.text;
        Object.assign(input.style, {
          flex: '1',
          minWidth: '0',
          padding: '8px',
          background: '#0b1122',
          color: '#fff',
          border: '1px solid #34405f',
          borderRadius: '8px',
          fontSize: '12px',
          fontFamily: 'inherit'
        });

        input.addEventListener('input', () => {
          seg.text = input.value.trim();
          edited = true;
          captionText.value = segments.map(s => s.text).join('\n');
          lastShown = null;
          updateCaption();
        });

        const play = mini('▶', 'Aller à ce moment');
        play.addEventListener('click', () => {
          if (isFinite(videoPreview.duration)) videoPreview.currentTime = seg.start;
        });

        const cutBtn = mini('✂', 'Couper ou remettre ce passage');
        cutBtn.addEventListener('click', () => toggleCut(seg));

        row.appendChild(time);
        row.appendChild(input);
        row.appendChild(play);
        row.appendChild(cutBtn);
        sceneList.appendChild(row);

        ui.push({ row, input, cutBtn, seg });
      });

      ui.forEach(paintRow);
      updateInfo();
    }

    sceneClear.addEventListener('click', () => {
      cuts = [];
      applyCuts();
      showToast('Coupures annulées.');
    });

    sceneBox.addEventListener('toggle', () => {
      if (sceneBox.open) buildRows();
    });

    // La liste se met à jour toute seule quand de nouveaux sous-titres arrivent
    setInterval(() => {
      if (!sceneBox.open) return;
      if (segments !== rowsRef || segments.length !== rowsLen) buildRows();
    }, 800);

    // Nouvelle vidéo : on repart de zéro
    videoInput.addEventListener('change', () => {
      cuts = [];
      rowsRef = null;
      rowsLen = -1;
      if (sceneBox.open) buildRows();
    });

    buildRows();
  }
})();
