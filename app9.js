/*
 * JUSTEVIVO — app9.js
 * Galerie visuelle enrichie + palettes de couleurs + emojis + modes d'animation.
 * Extension additive : ne remplace pas app.js, app2.js, app3.js ou app7.js.
 */
(function () {
  'use strict';

  const STYLE_NAMES = {
    pop: 'POP', neon: 'NÉON', clean: 'ÉPURÉ', impact: 'IMPACT', tiktok: 'TIKTOK',
    boite: 'BOÎTE', marker: 'SURLIGNEUR', retro3d: 'RÉTRO 3D', degrade: 'DÉGRADÉ',
    cinema: 'CINÉMA', machine: 'MACHINE', comic: 'COMIC', rose: 'NÉON ROSE',
    verre: 'VERRE', fin: 'FIN', feu: 'FEU', elegant: 'ÉLÉGANT', contour: 'CONTOUR',
    glace: 'GLACE', or: 'OR', bande: 'BANDEAU', ombre: 'OMBRE', neonvert: 'NÉON VERT',
    neonjaune: 'NÉON JAUNE', sunset: 'COUCHER DE SOLEIL', ocean: 'OCÉAN', chrome: 'CHROME',
    sticker: 'AUTOCOLLANT', jaune: 'JAUNE', blanc: 'BLANC', minimal: 'MINIMAL', pixel: 'PIXEL',
    hormo: 'IMPACT PLUS', vert: 'BOÎTE VERTE', orange: 'BOÎTE ORANGE', rouge: 'BOÎTE ROUGE',
    bleu: 'BOÎTE BLEUE', violet: 'BOÎTE VIOLETTE', rosebox: 'BOÎTE ROSE', noir: 'NOIR',
    film: 'FILM', magazine: 'MAGAZINE', signature: 'SIGNATURE', neonbleu: 'NÉON BLEU',
    neonorange: 'NÉON ORANGE', glitch: 'GLITCH', contourrouge: 'CONTOUR ROUGE'
  };

  const PALETTES = [
    ['#ffe600', 'Jaune'], ['#ffffff', 'Blanc'], ['#a879ff', 'Violet'],
    ['#ff3d9a', 'Rose'], ['#ff4b4b', 'Rouge'], ['#ff8a1f', 'Orange'],
    ['#36c5ff', 'Bleu'], ['#2bff8a', 'Vert'], ['#00e0c6', 'Turquoise'],
    ['#ff9a3c', 'Orange clair'], ['#111827', 'Noir'], ['#f7f7ff', 'Ivoire']
  ];

  const EMOJIS = ['🔥','😂','😍','😱','🤯','💰','💸','🚀','💡','🎯','🏆','⭐',
    '❤️','💪','👀','👉','✅','❌','⚠️','🙏','👍','🎉','🌍','📱','💻','🎬','🎵','✈️','🍕','☕'];

  const css = `
    .style-options{display:grid!important;grid-template-columns:repeat(3,minmax(0,1fr))!important;gap:9px!important;max-height:390px!important;padding:5px 3px 9px!important;overflow-y:auto!important;overflow-x:hidden!important}
    .style-tile{min-height:94px!important;padding:7px!important;border-radius:12px!important;background:#111a30!important;border:1px solid #35415f!important;transition:transform .16s,border-color .16s,box-shadow .16s!important}
    .style-tile:hover{transform:translateY(-2px);border-color:#a879ff!important;box-shadow:0 7px 20px #0005!important}
    .style-tile[aria-pressed="true"],.style-tile.is-selected{border-color:#b58aff!important;box-shadow:0 0 0 2px #a879ff35!important}
    .style-tile .preview-frame{height:60px!important;min-height:60px!important;border-radius:8px!important;display:flex!important;align-items:center!important;justify-content:center!important;overflow:hidden!important;background:linear-gradient(135deg,#263653,#111a30)!important}
    .style-tile .preview-caption{max-width:95%!important;max-height:52px!important;overflow:hidden!important;font-size:13px!important;line-height:1.15!important}
    .style-tile>div:last-child{font-size:10px!important;letter-spacing:.25px!important;margin-top:7px!important;color:#e4e8f7!important}
    .jv-style-lab{margin:16px 0 4px;padding:14px;background:#0d1528;border:1px solid #2d3a5b;border-radius:14px;color:#eef1ff}
    .jv-style-lab h4{margin:0 0 5px;font-size:14px;color:#fff}
    .jv-style-lab .jv-lab-note{margin:0 0 12px;color:#9eabc7;font-size:11px;line-height:1.5}
    .jv-lab-title{display:block;margin:13px 0 8px;color:#d9c2ff;font-size:11px;font-weight:800}
    .jv-palette{display:grid;grid-template-columns:repeat(6,minmax(0,1fr));gap:8px}
    .jv-color{height:34px;min-width:0;border:2px solid #ffffff24;border-radius:9px;cursor:pointer;position:relative}
    .jv-color[aria-pressed="true"]{outline:2px solid #fff;outline-offset:2px}
    .jv-color:focus-visible,.jv-emoji:focus-visible,.jv-mode:focus-visible{outline:2px solid #fff;outline-offset:2px}
    .jv-emoji-grid{display:grid;grid-template-columns:repeat(10,minmax(0,1fr));gap:5px}
    .jv-emoji{min-width:0;min-height:34px;border:1px solid #35415f;border-radius:8px;background:#151f37;color:#fff;font-size:19px;cursor:pointer}
    .jv-emoji:hover{background:#302052;border-color:#a879ff}
    .jv-lab-row{display:flex;gap:8px;align-items:center;flex-wrap:wrap}
    .jv-mode{flex:1 1 110px;padding:9px 8px;border:1px solid #35415f;border-radius:9px;background:#151f37;color:#dce2f5;font-size:10px;font-weight:800;cursor:pointer}
    .jv-mode:hover{border-color:#a879ff;background:#251b40}
    .jv-custom-color{width:42px;height:36px;padding:2px;border:1px solid #465477;border-radius:8px;background:#10182c}
    @media(max-width:420px){.style-options{grid-template-columns:repeat(2,minmax(0,1fr))!important}.jv-emoji-grid{grid-template-columns:repeat(6,minmax(0,1fr))}.jv-palette{grid-template-columns:repeat(6,minmax(0,1fr))}}
  `;

  function addCss() {
    if (document.getElementById('jv-app9-css')) return;
    const s = document.createElement('style');
    s.id = 'jv-app9-css';
    s.textContent = css;
    document.head.appendChild(s);
  }

  function notify(message) {
    if (typeof showToast === 'function') showToast(message);
    else {
      const toast = document.getElementById('toast');
      if (toast) { toast.textContent = message; toast.classList.add('show'); }
    }
  }

  function applyAccent(value) {
    const input = document.getElementById('captionColor');
    if (!input) return;
    input.value = value;
    input.dispatchEvent(new Event('input', { bubbles: true }));
    const tiles = document.querySelectorAll('.style-tile .preview-caption');
    tiles.forEach(el => el.style.setProperty('--accent', value));
    refreshSelection();
  }

  function applyKeywordColor(value) {
    const input = document.getElementById('keywordColor');
    if (!input) return;
    input.value = value;
    input.dispatchEvent(new Event('input', { bubbles: true }));
    document.querySelectorAll('.style-tile .preview-caption').forEach(el => el.style.setProperty('--kw', value));
  }

  function refreshSelection() {
    document.querySelectorAll('.style-tile').forEach(tile => {
      let selected = false;
      try { selected = typeof activeStyle !== 'undefined' && tile.dataset.style === activeStyle; } catch (e) {}
      tile.classList.toggle('is-selected', selected);
      tile.setAttribute('aria-pressed', String(selected));
    });
    const current = document.getElementById('captionColor');
    if (current) document.querySelectorAll('.jv-color').forEach(btn => btn.setAttribute('aria-pressed', String(btn.dataset.color === current.value)));
  }

  function insertEmoji(emoji) {
    const field = document.getElementById('captionText');
    if (!field) return;
    try {
      if (typeof segments !== 'undefined' && Array.isArray(segments) && segments.length) {
        const last = segments[segments.length - 1];
        last.text = String(last.text || '').replace(/\s+$/, '') + ' ' + emoji;
        field.value = segments.map(s => s.text || '').join('\n');
        try { edited = true; } catch (e) {}
        try { lastShown = null; } catch (e) {}
        if (typeof updateCaption === 'function') updateCaption();
      } else {
        const start = Number.isInteger(field.selectionStart) ? field.selectionStart : field.value.length;
        const end = Number.isInteger(field.selectionEnd) ? field.selectionEnd : start;
        field.value = field.value.slice(0, start) + emoji + field.value.slice(end);
        field.focus();
        field.setSelectionRange(start + emoji.length, start + emoji.length);
        field.dispatchEvent(new Event('input', { bubbles: true }));
      }
      notify('Emoji ajouté au texte.');
    } catch (e) {
      notify('Impossible d’ajouter cet emoji pour le moment.');
    }
  }

  function createLab(styleBox) {
    if (document.getElementById('jv-style-lab')) return;
    const lab = document.createElement('section');
    lab.id = 'jv-style-lab';
    lab.className = 'jv-style-lab';

    const title = document.createElement('h4');
    title.textContent = 'Personnaliser le style';
    const note = document.createElement('p');
    note.className = 'jv-lab-note';
    note.textContent = 'Les couleurs et les emojis choisis sont repris dans l’aperçu. Les couleurs de texte sont également utilisées lors de l’export.';
    lab.append(title, note);

    const accentTitle = document.createElement('span');
    accentTitle.className = 'jv-lab-title';
    accentTitle.textContent = 'Couleur principale';
    lab.appendChild(accentTitle);

    const palette = document.createElement('div');
    palette.className = 'jv-palette';
    PALETTES.forEach(([color, label]) => {
      const b = document.createElement('button');
      b.type = 'button'; b.className = 'jv-color'; b.dataset.color = color;
      b.style.background = color; b.title = label; b.setAttribute('aria-label', 'Couleur ' + label);
      b.setAttribute('aria-pressed', 'false');
      b.addEventListener('click', () => applyAccent(color));
      palette.appendChild(b);
    });
    lab.appendChild(palette);

    const customRow = document.createElement('div');
    customRow.className = 'jv-lab-row';
    const customLabel = document.createElement('label');
    customLabel.className = 'jv-lab-title';
    customLabel.textContent = 'Couleur personnalisée';
    customLabel.style.margin = '12px 0 8px';
    const custom = document.createElement('input');
    custom.type = 'color'; custom.className = 'jv-custom-color'; custom.value = '#a879ff';
    custom.setAttribute('aria-label', 'Choisir une couleur personnalisée');
    custom.addEventListener('input', () => applyAccent(custom.value));
    customRow.append(customLabel, custom);
    lab.appendChild(customRow);

    const kwTitle = document.createElement('span');
    kwTitle.className = 'jv-lab-title';
    kwTitle.textContent = 'Couleur des mots importants';
    lab.appendChild(kwTitle);
    const kwRow = document.createElement('div');
    kwRow.className = 'jv-lab-row';
    const kwColors = ['#ffe600','#ff4b4b','#36c5ff','#2bff8a','#ff3d9a','#ffffff'];
    kwColors.forEach(color => {
      const b = document.createElement('button');
      b.type = 'button'; b.className = 'jv-color'; b.style.width = '34px'; b.style.height = '30px';
      b.style.background = color; b.title = 'Couleur des mots importants : ' + color;
      b.setAttribute('aria-label', 'Appliquer ' + color + ' aux mots importants');
      b.addEventListener('click', () => applyKeywordColor(color));
      kwRow.appendChild(b);
    });
    lab.appendChild(kwRow);

    const emojiTitle = document.createElement('span');
    emojiTitle.className = 'jv-lab-title';
    emojiTitle.textContent = 'Ajouter un emoji au texte';
    lab.appendChild(emojiTitle);
    const emojiGrid = document.createElement('div');
    emojiGrid.className = 'jv-emoji-grid';
    EMOJIS.forEach(emoji => {
      const b = document.createElement('button');
      b.type = 'button'; b.className = 'jv-emoji'; b.textContent = emoji;
      b.setAttribute('aria-label', 'Ajouter ' + emoji + ' au texte');
      b.addEventListener('click', () => insertEmoji(emoji));
      emojiGrid.appendChild(b);
    });
    lab.appendChild(emojiGrid);

    const autoRow = document.createElement('div');
    autoRow.className = 'jv-lab-row';
    const auto = document.createElement('button');
    auto.type = 'button'; auto.className = 'jv-mode'; auto.textContent = '✨ Emojis automatiques';
    auto.addEventListener('click', () => {
      const select = document.getElementById('emojiMode');
      if (!select) { notify('Le réglage des emojis automatiques n’est pas disponible.'); return; }
      select.value = 'auto'; select.dispatchEvent(new Event('change', { bubbles: true }));
      notify('Emojis automatiques activés.');
    });
    const noEmoji = document.createElement('button');
    noEmoji.type = 'button'; noEmoji.className = 'jv-mode'; noEmoji.textContent = 'Désactiver les emojis';
    noEmoji.addEventListener('click', () => {
      const select = document.getElementById('emojiMode');
      if (select) { select.value = 'off'; select.dispatchEvent(new Event('change', { bubbles: true })); notify('Emojis automatiques désactivés.'); }
    });
    autoRow.append(auto, noEmoji);
    lab.appendChild(autoRow);

    const animTitle = document.createElement('span');
    animTitle.className = 'jv-lab-title';
    animTitle.textContent = 'Animation des sous-titres';
    lab.appendChild(animTitle);
    const modes = document.createElement('div');
    modes.className = 'jv-lab-row';
    [
      ['all', 'Phrase complète'],
      ['progressive', 'Mot par mot'],
      ['single', 'Un mot à la fois'],
      ['karaoke', 'Karaoké']
    ].forEach(([value, label]) => {
      const b = document.createElement('button');
      b.type = 'button'; b.className = 'jv-mode'; b.textContent = label;
      b.addEventListener('click', () => {
        const select = document.getElementById('captionMode');
        if (!select || !Array.from(select.options).some(o => o.value === value)) {
          notify(value === 'karaoke' ? 'Le mode karaoké sera disponible lorsque le module de styles sera chargé.' : 'Ce mode n’est pas disponible.');
          return;
        }
        select.value = value; select.dispatchEvent(new Event('change', { bubbles: true }));
        notify('Mode « ' + label + ' » activé.');
      });
      modes.appendChild(b);
    });
    lab.appendChild(modes);

    styleBox.insertAdjacentElement('afterend', lab);
    refreshSelection();
  }

  function enhanceTiles() {
    document.querySelectorAll('.style-tile').forEach(tile => {
      const id = tile.dataset.style;
      if (id && !tile.getAttribute('aria-label')) tile.setAttribute('aria-label', 'Choisir le style ' + (STYLE_NAMES[id] || id));
      const frame = tile.querySelector('.preview-frame');
      const cap = tile.querySelector('.preview-caption');
      if (cap && !cap.dataset.jvEnhanced) {
        cap.dataset.jvEnhanced = '1';
        cap.textContent = 'Tes mots ';
        const strong = document.createElement('b');
        strong.textContent = 'en valeur !';
        cap.appendChild(strong);
        const accent = document.getElementById('captionColor');
        const kw = document.getElementById('keywordColor');
        cap.style.setProperty('--accent', accent ? accent.value : '#a879ff');
        cap.style.setProperty('--kw', kw ? kw.value : '#ffe600');
      }
      if (frame) frame.setAttribute('aria-hidden', 'true');
    });
    refreshSelection();
  }

  function init() {
    const styleBox = document.querySelector('.jv-page .style-options') || document.querySelector('.controls-panel .style-options');
    if (!styleBox) return false;
    addCss();
    enhanceTiles();
    createLab(styleBox);
    return true;
  }

  function start() {
    init();
    let tries = 0;
    const timer = setInterval(() => {
      tries++;
      init();
      enhanceTiles();
      if (tries >= 80) clearInterval(timer);
    }, 250);
    const observer = new MutationObserver(() => {
      enhanceTiles();
      const box = document.querySelector('.jv-page .style-options') || document.querySelector('.controls-panel .style-options');
      if (box) createLab(box);
    });
    observer.observe(document.body, { childList: true, subtree: true });
    setTimeout(() => observer.disconnect(), 30000);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start, { once: true });
  else start();
})();
