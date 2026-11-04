/*
 * JUSTEVIVO — app9.js
 * Galerie visuelle enrichie, palettes, emojis et animations.
 * Extension complémentaire : ne remplace pas app.js, app2.js ou app3.js.
 */
(() => {
  'use strict';

  const STYLE_NAMES = {
    pop:'POP', neon:'NÉON', clean:'ÉPURÉ', impact:'IMPACT', tiktok:'TIKTOK',
    boite:'BOÎTE', marker:'SURLIGNEUR', retro3d:'RÉTRO 3D', degrade:'DÉGRADÉ',
    cinema:'CINÉMA', machine:'MACHINE', comic:'COMIC', rose:'NÉON ROSE',
    verre:'VERRE', fin:'FIN', feu:'FEU', elegant:'ÉLÉGANT', contour:'CONTOUR',
    glace:'GLACE', or:'OR', bande:'BANDEAU', ombre:'OMBRE', neonvert:'NÉON VERT',
    neonjaune:'NÉON JAUNE', sunset:'COUCHER DE SOLEIL', ocean:'OCÉAN',
    chrome:'CHROME', sticker:'AUTOCOLLANT', jaune:'JAUNE', blanc:'BLANC',
    minimal:'MINIMAL', pixel:'PIXEL', hormo:'IMPACT PLUS', vert:'BOÎTE VERTE',
    orange:'BOÎTE ORANGE', rouge:'BOÎTE ROUGE', bleu:'BOÎTE BLEUE',
    violet:'BOÎTE VIOLETTE', rosebox:'BOÎTE ROSE', noir:'NOIR', film:'FILM',
    magazine:'MAGAZINE', signature:'SIGNATURE', neonbleu:'NÉON BLEU',
    neonorange:'NÉON ORANGE', glitch:'GLITCH', contourrouge:'CONTOUR ROUGE'
  };

  const PALETTES = [
    ['#ffe600','Jaune'],['#ffffff','Blanc'],['#a879ff','Violet'],
    ['#ff3d9a','Rose'],['#ff4b4b','Rouge'],['#ff8a1f','Orange'],
    ['#36c5ff','Bleu'],['#2bff8a','Vert'],['#00e0c6','Turquoise'],
    ['#ff9a3c','Orange clair'],['#111827','Noir'],['#f7f7ff','Ivoire']
  ];
  const EMOJIS = ['🔥','😂','😍','😱','🤯','💰','💸','🚀','💡','🎯','🏆','⭐',
    '❤️','💪','👀','👉','✅','❌','⚠️','🙏','👍','🎉','🌍','📱','💻','🎬','🎵','✈️','🍕','☕'];

  const css = `
    .style-options{
      display:grid!important;
      grid-template-columns:repeat(2,minmax(0,1fr))!important;
      gap:12px!important;
      max-height:560px!important;
      padding:8px!important;
      overflow-y:auto!important;
      overflow-x:hidden!important;
      align-items:stretch!important
    }
    .style-tile{
      display:flex!important;
      flex-direction:column!important;
      justify-content:flex-start!important;
      min-width:0!important;
      min-height:145px!important;
      padding:10px!important;
      border-radius:14px!important;
      background:linear-gradient(145deg,#18233d,#101629)!important;
      border:1px solid #35415f!important;
      transition:transform .2s,border-color .2s,box-shadow .2s!important
    }
    .style-tile:hover{
      transform:translateY(-3px);
      border-color:#a879ff!important;
      box-shadow:0 8px 24px #0007!important
    }
    .style-tile[aria-pressed="true"],.style-tile.is-selected{
      border-color:#b58aff!important;
      box-shadow:0 0 0 2px #a879ff55!important
    }
    .style-tile .preview-frame{
      width:100%!important;
      height:96px!important;
      min-height:96px!important;
      border-radius:10px!important;
      display:flex!important;
      align-items:center!important;
      justify-content:center!important;
      overflow:hidden!important;
      background:linear-gradient(135deg,#344466,#111a30)!important
    }
    .style-tile .preview-caption{
      max-width:95%!important;
      max-height:85px!important;
      overflow:hidden!important;
      font-size:17px!important;
      line-height:1.2!important;
      text-align:center!important
    }
    .style-tile>div:last-child{
      font-size:11px!important;
      letter-spacing:.4px!important;
      margin-top:9px!important;
      color:#f0edff!important;
      font-weight:800!important
    }
    .jv-style-lab{
      margin:16px 0 4px;padding:14px;background:#0d1528;
      border:1px solid #2d3a5b;border-radius:14px;color:#eef1ff
    }
    .jv-style-lab h4{margin:0 0 5px;font-size:14px;color:#fff}
    .jv-style-lab .jv-lab-note{margin:0 0 12px;color:#9eabc7;font-size:11px;line-height:1.5}
    .jv-lab-title{display:block;margin:13px 0 8px;color:#d9c2ff;font-size:11px;font-weight:800}
    .jv-palette{display:grid;grid-template-columns:repeat(6,minmax(0,1fr));gap:8px}
    .jv-color{height:34px;min-width:0;border:2px solid #ffffff24;border-radius:9px;cursor:pointer;position:relative}
    .jv-color[aria-pressed="true"]{outline:2px solid #fff;outline-offset:2px}
    .jv-emoji-grid{display:grid;grid-template-columns:repeat(8,minmax(0,1fr));gap:5px}
    .jv-emoji{min-width:0;min-height:36px;border:1px solid #35415f;border-radius:8px;background:#151f37;color:#fff;font-size:19px;cursor:pointer}
    .jv-emoji:hover{background:#302052;border-color:#a879ff}
    .jv-lab-row{display:flex;gap:8px;align-items:center;flex-wrap:wrap}
    .jv-mode{flex:1 1 110px;padding:9px 8px;border:1px solid #35415f;border-radius:9px;background:#151f37;color:#dce2f5;font-size:11px;font-weight:800;cursor:pointer}
    .jv-mode:hover{border-color:#a879ff;background:#251b40}
    .jv-custom-color{width:42px;height:36px;padding:2px;border:1px solid #465477;border-radius:8px;background:#10182c}
    @media(max-width:420px){
      .style-options{grid-template-columns:repeat(2,minmax(0,1fr))!important}
      .jv-emoji-grid{grid-template-columns:repeat(6,minmax(0,1fr))}
    }
  `;

  function notify(message) {
    if (typeof window.showToast === 'function') window.showToast(message);
    else {
      const toast = document.getElementById('toast');
      if (toast) {
        toast.textContent = message;
        toast.classList.add('show');
      } else {
        console.info('[JUSTEVIVO]', message);
      }
    }
  }

  function addCss() {
    if (document.getElementById('jv-app9-css')) return;
    const style = document.createElement('style');
    style.id = 'jv-app9-css';
    style.textContent = css;
    document.head.appendChild(style);
  }

  function setInputValue(id, value) {
    const input = document.getElementById(id);
    if (!input) return false;
    input.value = value;
    input.dispatchEvent(new Event('input', { bubbles:true }));
    input.dispatchEvent(new Event('change', { bubbles:true }));
    return true;
  }

  function applyAccent(value) {
    if (!setInputValue('captionColor', value)) {
      notify('Le réglage de couleur principale est introuvable.');
      return;
    }
    document.querySelectorAll('.style-tile .preview-caption')
      .forEach(el => el.style.setProperty('--accent', value));
    refreshSelection();
  }

  function applyKeywordColor(value) {
    if (!setInputValue('keywordColor', value)) {
      notify('Le réglage de couleur des mots importants est introuvable.');
      return;
    }
    document.querySelectorAll('.style-tile .preview-caption')
      .forEach(el => el.style.setProperty('--kw', value));
  }

  function refreshSelection() {
    let selectedStyle = '';
    try {
      if (typeof window.activeStyle !== 'undefined') selectedStyle = window.activeStyle;
    } catch (_) {}
    document.querySelectorAll('.style-tile').forEach(tile => {
      const selected = !!selectedStyle && tile.dataset.style === selectedStyle;
      tile.classList.toggle('is-selected', selected);
      tile.setAttribute('aria-pressed', String(selected));
    });
    const current = document.getElementById('captionColor');
    if (current) {
      document.querySelectorAll('.jv-color[data-color]').forEach(btn => {
        btn.setAttribute('aria-pressed', String(btn.dataset.color === current.value));
      });
    }
  }

  function insertEmoji(emoji) {
    const field = document.getElementById('captionText');
    if (!field) {
      notify('Le champ de texte des sous-titres est introuvable.');
      return;
    }
    const start = Number.isInteger(field.selectionStart) ? field.selectionStart : field.value.length;
    const end = Number.isInteger(field.selectionEnd) ? field.selectionEnd : start;
    field.value = field.value.slice(0,start) + emoji + field.value.slice(end);
    field.focus();
    if (typeof field.setSelectionRange === 'function') {
      field.setSelectionRange(start + emoji.length,start + emoji.length);
    }
    field.dispatchEvent(new Event('input',{bubbles:true}));
    notify('Emoji ajouté au texte.');
  }

  function createLab(styleBox) {
    if (document.getElementById('jv-style-lab') || !styleBox) return;
    const lab = document.createElement('section');
    lab.id = 'jv-style-lab';
    lab.className = 'jv-style-lab';

    const title = document.createElement('h4');
    title.textContent = 'Personnaliser le style';
    const note = document.createElement('p');
    note.className = 'jv-lab-note';
    note.textContent = 'Choisissez vos couleurs, ajoutez des emojis et réglez l’animation des sous-titres.';
    lab.append(title,note);

    function addTitle(text) {
      const el = document.createElement('span');
      el.className = 'jv-lab-title';
      el.textContent = text;
      lab.appendChild(el);
    }

    addTitle('Couleur principale');
    const palette = document.createElement('div');
    palette.className = 'jv-palette';
    PALETTES.forEach(([color,label]) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'jv-color';
      button.dataset.color = color;
      button.style.background = color;
      button.title = label;
      button.setAttribute('aria-label','Couleur '+label);
      button.setAttribute('aria-pressed','false');
      button.addEventListener('click',() => applyAccent(color));
      palette.appendChild(button);
    });
    lab.appendChild(palette);

    addTitle('Couleur personnalisée');
    const custom = document.createElement('input');
    custom.type = 'color';
    custom.className = 'jv-custom-color';
    custom.value = '#a879ff';
    custom.setAttribute('aria-label','Choisir une couleur personnalisée');
    custom.addEventListener('input',() => applyAccent(custom.value));
    lab.appendChild(custom);

    addTitle('Couleur des mots importants');
    const keywordRow = document.createElement('div');
    keywordRow.className = 'jv-lab-row';
    ['#ffe600','#ff4b4b','#36c5ff','#2bff8a','#ff3d9a','#ffffff'].forEach(color => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'jv-color';
      button.style.width = '34px';
      button.style.height = '30px';
      button.style.background = color;
      button.title = 'Mots importants : '+color;
      button.setAttribute('aria-label','Appliquer '+color+' aux mots importants');
      button.addEventListener('click',() => applyKeywordColor(color));
      keywordRow.appendChild(button);
    });
    lab.appendChild(keywordRow);

    addTitle('Ajouter un emoji');
    const emojiGrid = document.createElement('div');
    emojiGrid.className = 'jv-emoji-grid';
    EMOJIS.forEach(emoji => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'jv-emoji';
      button.textContent = emoji;
      button.setAttribute('aria-label','Ajouter '+emoji+' au texte');
      button.addEventListener('click',() => insertEmoji(emoji));
      emojiGrid.appendChild(button);
    });
    lab.appendChild(emojiGrid);

    addTitle('Animation des sous-titres');
    const modes = document.createElement('div');
    modes.className = 'jv-lab-row';
    [
      ['all','Phrase complète'],
      ['progressive','Mot par mot'],
      ['single','Un mot à la fois'],
      ['karaoke','Karaoké']
    ].forEach(([value,label]) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'jv-mode';
      button.textContent = label;
      button.addEventListener('click',() => {
        const select = document.getElementById('captionMode');
        if (!select || !Array.from(select.options).some(option => option.value === value)) {
          notify('Ce mode n’est pas disponible dans la version actuelle du moteur.');
          return;
        }
        select.value = value;
        select.dispatchEvent(new Event('change',{bubbles:true}));
        notify('Mode « '+label+' » activé.');
      });
      modes.appendChild(button);
    });
    lab.appendChild(modes);

    styleBox.insertAdjacentElement('afterend',lab);
    refreshSelection();
  }

  function enhanceTiles() {
    document.querySelectorAll('.style-tile').forEach(tile => {
      const id = tile.dataset.style;
      if (id) {
        tile.setAttribute('aria-label','Choisir le style '+(STYLE_NAMES[id] || id));
        tile.setAttribute('role','button');
        if (!tile.hasAttribute('aria-pressed')) tile.setAttribute('aria-pressed','false');
      }
      const caption = tile.querySelector('.preview-caption');
      if (caption && !caption.dataset.jvEnhanced) {
        caption.dataset.jvEnhanced = '1';
        caption.textContent = 'TES MOTS ';
        const strong = document.createElement('b');
        strong.textContent = 'EN VALEUR !';
        caption.appendChild(strong);
        const accent = document.getElementById('captionColor');
        const keyword = document.getElementById('keywordColor');
        caption.style.setProperty('--accent',accent ? accent.value : '#a879ff');
        caption.style.setProperty('--kw',keyword ? keyword.value : '#ffe600');
      }
    });
    refreshSelection();
  }

  function findStyleBox() {
    return document.querySelector('.jv-page .style-options') ||
      document.querySelector('.controls-panel .style-options') ||
      document.querySelector('.style-options');
  }

  function init() {
    const styleBox = findStyleBox();
    if (!styleBox) return false;
    addCss();
    enhanceTiles();
    createLab(styleBox);
    return true;
  }

  function start() {
    init();
    let tries = 0;
    const timer = window.setInterval(() => {
      tries++;
      init();
      if (tries >= 80) window.clearInterval(timer);
    },250);

    const observer = new MutationObserver(() => {
      enhanceTiles();
      const box = findStyleBox();
      if (box) createLab(box);
    });
    observer.observe(document.body,{childList:true,subtree:true});
    window.setTimeout(() => observer.disconnect(),30000);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded',start,{once:true});
  } else {
    start();
  }
})();
