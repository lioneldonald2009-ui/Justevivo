// ===== JUSTEVIVO · app6.js · paiement + menu du studio (projets, styles, paramètres) =====
(function () {
  const KEY = 'justevivo_session_v1';
  const sleep = ms => new Promise(r => setTimeout(r, ms));

  function el(tag, css, text) {
    const e = document.createElement(tag);
    if (css) Object.assign(e.style, css);
    if (text !== undefined) e.textContent = text;
    return e;
  }

  function btn(text, cls, css) {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = cls || 'button ghost';
    b.textContent = text;
    if (css) Object.assign(b.style, css);
    return b;
  }

  // ===== Styles ajoutés =====
  const css = document.createElement('style');
  css.textContent = `
.button.ghost{background:transparent}
.studio-tabs{display:none;gap:8px;overflow-x:auto;margin:0 0 14px;padding-bottom:4px}
.studio-tab{flex:none;padding:9px 14px;border-radius:18px;border:1px solid #35415f;background:#0c1325;color:#aeb8d0;font:inherit;font-size:11px;font-weight:800;cursor:pointer;white-space:nowrap}
.studio-tab:active{background:#2b2050;color:#d9c2ff}
@media(max-width:600px){.studio-tabs{display:flex}}
.side-link{cursor:pointer}
.side-link:hover{background:#1b2440;color:#d7c4ff}
.jv-editor-panel-nav{display:flex;gap:6px;overflow-x:auto;padding:8px;margin:8px 0 14px;background:#eef0fa;border:1px solid #d9def0;border-radius:12px;scrollbar-width:thin}
.jv-editor-panel-tab{flex:0 0 auto;border:1px solid #d8dcef;background:#fff;color:#27304a;border-radius:9px;padding:9px 12px;font:700 11px/1.2 inherit;cursor:pointer;white-space:nowrap}
.jv-editor-panel-tab.is-active{background:#7654ed;color:#fff;border-color:#7654ed;box-shadow:0 4px 12px #7654ed33}
.jv-editor-settings-panel{padding:14px;border:1px solid #dce1f0;border-radius:13px;background:#f8f9ff;color:#202943}
.jv-editor-settings-panel h4{margin:0 0 8px;font-size:15px}
.jv-settings-intro{font-size:12px;line-height:1.5;color:#65708a}
.jv-account-summary{white-space:pre-line;padding:12px;margin:12px 0;border-radius:10px;background:#fff;border:1px solid #e0e4f0;color:#303b56;font-size:12px;line-height:1.8}
.jv-editor-settings-panel input{width:100%;box-sizing:border-box;padding:11px;border:1px solid #d7dced;border-radius:9px;margin:6px 0 10px;background:#fff;color:#202943}
.jv-settings-message{font-size:12px;min-height:18px;color:#5e4ac8}
.editor-grid{align-items:start}
.preview-panel{position:sticky;top:14px;align-self:start}
@media(max-width:700px){.jv-editor-panel-nav{margin:8px 0;padding:6px}.jv-editor-panel-tab{padding:8px 10px}}
`;

  document.head.appendChild(css);

  // Navigation interne du panneau droit : l'aperçu vidéo reste toujours visible à gauche.
  const controlsPanel = document.querySelector('.controls-panel');
  let editorPanelTab = 'text';
  let editorPanelNav = null;
  let editorSettingsPanel = null;

  function buildEditorPanelNavigation() {
    if (!controlsPanel || controlsPanel.querySelector('.jv-editor-panel-nav')) return;
    editorPanelNav = document.createElement('nav');
    editorPanelNav.className = 'jv-editor-panel-nav';
    editorPanelNav.setAttribute('aria-label', 'Outils de personnalisation');
    const tabs = [
      ['text', 'Texte'],
      ['styles', 'Styles'],
      ['scenes', 'Scènes'],
      ['audio', 'Audio'],
      ['export', 'Export'],
      ['settings', 'Paramètres']
    ];
    tabs.forEach(([id, label]) => {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'jv-editor-panel-tab';
      b.dataset.panel = id;
      b.textContent = label;
      b.addEventListener('click', () => showEditorPanel(id));
      editorPanelNav.appendChild(b);
    });
    const panelLabel = controlsPanel.querySelector('.panel-label');
    if (panelLabel) panelLabel.insertAdjacentElement('afterend', editorPanelNav);
    else controlsPanel.prepend(editorPanelNav);

    editorSettingsPanel = document.createElement('section');
    editorSettingsPanel.className = 'jv-editor-settings-panel';
    editorSettingsPanel.hidden = true;
    editorSettingsPanel.innerHTML = `
      <h4>Paramètres du compte</h4>
      <p class="jv-settings-intro">Gérez votre compte JUSTEVIVO, consultez votre formule et sécurisez votre accès sans quitter le studio.</p>
      <section class="jv-settings-card" aria-labelledby="jv-settings-account-title">
        <h5 id="jv-settings-account-title">Mon compte et mon utilisation</h5>
        <div class="jv-account-summary" id="jv-settings-account" aria-live="polite">Chargement des informations du compte…</div>
        <button type="button" class="button ghost full" id="jv-settings-plans">Consulter les formules et abonnements</button>
      </section>
      <section class="jv-settings-card" aria-labelledby="jv-settings-security-title">
        <h5 id="jv-settings-security-title">Sécurité du compte</h5>
        <p class="jv-settings-hint">Pour changer votre mot de passe, JUSTEVIVO envoie d’abord un lien de vérification à l’adresse email de votre compte. Le changement sera autorisé uniquement après ouverture de ce lien.</p>
        <button type="button" class="button primary full" id="jv-request-password-reset">Continuer vers la vérification email</button>
        <p class="jv-settings-message" id="jv-settings-message" aria-live="polite"></p>
      </section>
    `;
    controlsPanel.appendChild(editorSettingsPanel);
    document.getElementById('jv-settings-plans').addEventListener('click', () => {
      // La grille tarifaire est une section de la page vitrine, en dehors du studio.
      // Le signal jv:show-pricing n'avait aucun écouteur : le clic ne faisait donc rien.
      const pricingSection = document.getElementById('pricing');
      if (pricingSection) {
        pricingSection.hidden = false;
        pricingSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        history.replaceState(null, '', '#pricing');
        return;
      }
      // Repli explicite si la section tarifaire est déplacée dans une future version.
      window.location.hash = 'pricing';
    });
    document.getElementById('jv-request-password-reset').addEventListener('click', async () => {
      const message = document.getElementById('jv-settings-message');
      const button = document.getElementById('jv-request-password-reset');
      button.disabled = true;
      message.textContent = 'Ouverture du contrôle de sécurité…';
      try {
        const email = await requestPasswordRecovery();
        message.textContent = 'La fenêtre de sécurité est ouverte pour ' + email + '. Validez le contrôle anti-robot, puis cliquez sur « Mot de passe oublié ? » pour recevoir le lien de vérification.';
      } catch (error) {
        message.textContent = error.message || 'Envoi impossible.';
      } finally {
        button.disabled = false;
      }
    });
    buildEditorPanelGroups();
    showEditorPanel('text');
  }

  const editorPanelGroups = {};
  const editorPanelGroupLabels = {
    text: 'Texte et sous-titres',
    styles: 'Styles et apparence',
    scenes: 'Scènes et montage',
    audio: 'Musique et effets sonores',
    export: 'Export et téléchargement'
  };

  function categoryForDetail(detail) {
    const title = (detail.querySelector('summary')?.textContent || '').toLowerCase();
    if (/format|découpage|export/.test(title)) return 'export';
    if (/zoom|silence|scène|coupure|accroche/.test(title)) return 'scenes';
    if (/apparence|réglages du texte/.test(title)) return 'styles';
    if (/audio|musique|son/.test(title)) return 'audio';
    return 'styles';
  }

  function categoryForControl(node) {
    if (node.matches('details')) return categoryForDetail(node);
    if (node.matches('.panel-label, .jv-editor-panel-nav, .jv-editor-settings-panel')) return 'system';
    if (node.matches('#subtitleLanguagePanel, #captionText, textarea[ id="captionText" ]')) return 'text';
    if (node.matches('.style-options, #captionColor, #previewButton') || node.querySelector('[data-tab]')) return 'styles';

    const id = (node.id || '').toLowerCase();
    const htmlFor = (node.htmlFor || '').toLowerCase();
    const target = id || htmlFor;

    if (['captionfont','captionmode','captionposition','captionpositionslider','keywordmode','keywordcolor','emojimode'].includes(target)) return 'styles';
    if (['subtitlelanguage','translatesubtitlesbutton'].includes(target)) return 'text';
    if (/audio|music|sound/.test(target)) return 'audio';
    if (/format|export|trim/.test(target)) return 'export';
    if (/scene|cut|silence|zoom|hook/.test(target)) return 'scenes';

    const label = (node.textContent || '').replace(/\\s+/g, ' ').trim().toLowerCase();
    const identity = ((node.id || '') + ' ' + (node.className || '')).toLowerCase();

    // Tous les réglages de sortie et les actions de téléchargement restent dans Export.
    if (/format de la vidéo finale|ajustement de l’image|début de la vidéo|fin de la vidéo|durée finale/.test(label)) return 'export';
    if (/exporter|télécharger srt|télécharger vtt|télécharger.*sous-titres|export video|exportvideo|srtbutton|vttbutton/.test(label + ' ' + identity)) return 'export';
    if (node.matches('label.field-label') && /export/.test(label)) return 'export';

    if (/générer les sous-titres|langue audio|appliquer la langue/.test(label)) return 'text';

    // Les éléments non identifiés restent visibles dans Texte : aucun contrôle n'est perdu.
    return 'text';
  }

  function buildEditorPanelGroups() {
    if (!controlsPanel) return;

    // Aplatir une éventuelle ancienne structure avant de reconstruire les groupes.
    // Les vrais contrôles sont déplacés, jamais clonés : leurs événements restent attachés.
    Array.from(controlsPanel.querySelectorAll(':scope > .jv-editor-control-group')).forEach(oldGroup => {
      Array.from(oldGroup.children).forEach(child => {
        if (child.classList.contains('jv-editor-group-title')) return;
        controlsPanel.insertBefore(child, oldGroup);
      });
      oldGroup.remove();
    });
    Object.keys(editorPanelGroups).forEach(key => delete editorPanelGroups[key]);
    controlsPanel.dataset.jvGrouped = '';

    const nav = editorPanelNav || controlsPanel.querySelector('.jv-editor-panel-nav');
    const settings = editorSettingsPanel || controlsPanel.querySelector('.jv-editor-settings-panel');
    const panelTitle = controlsPanel.querySelector('.panel-label');

    Object.entries(editorPanelGroupLabels).forEach(([id, label]) => {
      const section = document.createElement('section');
      section.className = 'jv-editor-control-group';
      section.dataset.group = id;
      section.hidden = true;
      section.style.setProperty('display', 'none', 'important');
      const heading = document.createElement('h4');
      heading.className = 'jv-editor-group-title';
      heading.textContent = label;
      section.appendChild(heading);
      editorPanelGroups[id] = section;
    });

    const exportIntro = document.createElement('p');
    exportIntro.className = 'jv-export-intro';
    exportIntro.textContent = 'Choisissez le format et le cadrage, ajustez le début et la fin, puis téléchargez les sous-titres ou la vidéo finale.';
    editorPanelGroups.export.appendChild(exportIntro);

    const audioNotice = document.createElement('p');
    audioNotice.className = 'jv-audio-placeholder';
    audioNotice.textContent = 'Les commandes audio sont en cours de chargement.';
    editorPanelGroups.audio.appendChild(audioNotice);

    Array.from(controlsPanel.children).forEach(node => {
      if (node === nav || node === settings || node === panelTitle ||
          node.classList.contains('jv-editor-control-group')) return;
      const group = categoryForControl(node);
      (editorPanelGroups[group] || editorPanelGroups.text).appendChild(node);
    });

    if (panelTitle && nav) panelTitle.insertAdjacentElement('afterend', nav);
    else if (nav && nav.parentElement !== controlsPanel) controlsPanel.prepend(nav);

    Object.values(editorPanelGroups).forEach(section => controlsPanel.appendChild(section));
    if (settings) controlsPanel.appendChild(settings);
    controlsPanel.dataset.jvGrouped = 'true';
  }

  function collectLateEditorControls() {
    if (!controlsPanel) return;
    if (!controlsPanel.dataset.jvGrouped) buildEditorPanelGroups();
    const knownGroups = new Set(Object.values(editorPanelGroups));
    const panelTitle = controlsPanel.querySelector('.panel-label');
    Array.from(controlsPanel.children).forEach(node => {
      if (node === editorPanelNav || node === editorSettingsPanel || node === panelTitle || knownGroups.has(node)) return;
      const group = categoryForControl(node);
      (editorPanelGroups[group] || editorPanelGroups.text).appendChild(node);
    });
    // Afficher les commandes réellement présentes dans Audio et retirer le texte provisoire.
    const audioNotice = editorPanelGroups.audio?.querySelector('.jv-audio-placeholder');
    const audioHasControls = editorPanelGroups.audio &&
      editorPanelGroups.audio.querySelectorAll('details').length > 0;
    if (audioHasControls && audioNotice) audioNotice.remove();
  }

  function showEditorPanel(id) {
    editorPanelTab = id;
    if (!controlsPanel) return;
    if (!editorPanelNav) buildEditorPanelNavigation();
    if (!controlsPanel.dataset.jvGrouped) buildEditorPanelGroups();
    collectLateEditorControls();

    Object.entries(editorPanelGroups).forEach(([key, section]) => {
      const visible = key === id;
      section.hidden = !visible;
      section.dataset.active = visible ? 'true' : 'false';
      section.style.setProperty('display', visible ? 'flex' : 'none', 'important');
      section.scrollTop = 0;
    });

    if (editorSettingsPanel) {
      const visible = id === 'settings';
      editorSettingsPanel.hidden = !visible;
      editorSettingsPanel.style.setProperty('display', visible ? 'block' : 'none', 'important');
    }

    if (editorPanelNav) {
      editorPanelNav.querySelectorAll('button').forEach(button => {
        const active = button.dataset.panel === id;
        button.classList.toggle('is-active', active);
        button.setAttribute('aria-pressed', active ? 'true' : 'false');
      });
    }

    // Réinitialiser les deux conteneurs possibles, sans animation qui laisse
    // temporairement apparaître la fin de l'ancien onglet.
    controlsPanel.scrollTop = 0;
    controlsPanel.querySelectorAll('.jv-editor-control-group').forEach(group => {
      if (group !== editorPanelGroups[id]) group.scrollTop = 0;
    });
    if (id === 'settings') refreshEmbeddedSettings();
  }

  async function refreshEmbeddedSettings() {
    const box = document.getElementById('jv-settings-account');
    if (!box) return;
    if (!hasSession()) {
      box.textContent = 'Vous n’êtes pas connecté. Connectez-vous pour consulter votre formule et vos quotas.';
      return;
    }
    box.textContent = 'Chargement des informations du compte…';
    try {
      const me = await getMe();
      const session = readSession();
      if (!me || !me.enabled) {
        box.textContent = 'Compte : ' + ((session && session.email) || '') + '\\nInformations temporairement indisponibles.';
        return;
      }
      box.textContent = [
        'Email : ' + (me.email || (session && session.email) || ''),
        'Formule : ' + (me.planName || 'Gratuit'),
        'Vidéos ce mois-ci : ' + me.videosUsed + ' / ' + me.videosLimit,
        'Durée maximale : ' + (me.maxSeconds >= 60 ? Math.round(me.maxSeconds / 60) + ' min' : me.maxSeconds + ' s'),
        'Générations aujourd’hui : ' + me.genUsed + ' / ' + me.genLimit
      ].join('\\n');
    } catch (error) {
      box.textContent = 'Impossible de charger les informations du compte. Réessayez dans quelques instants.';
    }
  }

  // ===== Compte : session, configuration, appels =====
  let conf = null;

  async function getConf() {
    if (conf) return conf;
    try {
      const r = await window.fetch(API_URL + '/api/config');
      const d = await r.json();
      conf = d && d.enabled ? { url: d.url, key: d.anonKey } : { disabled: true };
    } catch (e) {
      conf = { disabled: true };
    }
    return conf;
  }

  function readSession() {
    try {
      return JSON.parse(localStorage.getItem(KEY));
    } catch (e) {
      return null;
    }
  }

  function hasSession() {
    const s = readSession();
    return !!(s && s.access_token);
  }

  // Jeton de connexion : un appel au serveur le renouvelle si besoin
  async function token() {
    let s = readSession();
    if (!s) return '';

    const now = Math.floor(Date.now() / 1000);
    if ((s.expires_at || 0) - now <= 90) {
      try {
        await window.fetch(API_URL + '/api/me');
      } catch (e) { /* rien */ }
      s = readSession();
      if (!s) return '';
    }

    return s.access_token || '';
  }

  async function getMe() {
    try {
      const res = await window.fetch(API_URL + '/api/me');
      if (!res.ok) return null;
      return await res.json();
    } catch (e) {
      return null;
    }
  }

  function openLogin() {
    const b = Array.from(document.querySelectorAll('button'))
      .find(x => x.textContent.trim() === 'Connexion / Inscription');
    if (b) b.click();
  }

  // Appels à la base de données (chaque personne ne voit que ses données)
  async function sb(method, path, body, extra) {
    const c = await getConf();
    if (c.disabled) throw new Error('Les comptes ne sont pas disponibles pour le moment.');

    const t = await token();
    if (!t) throw new Error('Connectez-vous pour utiliser cette fonction.');

    const res = await window.fetch(c.url + '/rest/v1/' + path, {
      method,
      headers: Object.assign(
        { apikey: c.key, Authorization: 'Bearer ' + t, 'Content-Type': 'application/json' },
        extra || {}
      ),
      body: body === undefined ? undefined : JSON.stringify(body)
    });

    if (!res.ok) {
      let d = {};
      try {
        d = await res.json();
      } catch (e) { /* réponse vide */ }

      const code = String(d.code || '');
      if (res.status === 401) throw new Error('Session expirée. Reconnectez-vous.');
      if (code === '42P01' || code === 'PGRST205' || res.status === 404) {
        throw new Error('La base des projets n’est pas prête : exécutez le script SQL des projets dans Supabase.');
      }
      if (code === '42501') {
        throw new Error('Droits manquants sur les projets : exécutez les lignes « grant » du script SQL.');
      }
      throw new Error(d.message || 'Erreur ' + res.status + '.');
    }

    if (res.status === 204) return [];
    const text = await res.text();
    return text ? JSON.parse(text) : [];
  }

  // ===== Fenêtres =====
  function makeModal(titleText) {
    const modal = el('div', {
      position: 'fixed', top: '0', left: '0', right: '0', bottom: '0',
      background: 'rgba(4,7,16,0.9)', zIndex: '9997', display: 'none',
      justifyContent: 'center', alignItems: 'flex-start', padding: '12px', overflowY: 'auto'
    });

    modal.className = 'jv-app-modal';
    const card = el('div', {
      width: '100%', maxWidth: '460px', background: '#10162a', border: '1px solid #34405f',
      borderRadius: '14px', padding: '16px', color: '#fff', fontFamily: 'inherit',
      fontSize: '12px', boxSizing: 'border-box', marginTop: '24px'
    });
    card.className = 'jv-app-modal-card';

    const title = el('div', { fontWeight: '800', fontSize: '16px', marginBottom: '10px' }, titleText);
    title.className = 'jv-app-modal-title';
    const body = el('div');
    const close = btn('Fermer', 'button ghost full', { marginTop: '12px' });

    card.appendChild(title);
    card.appendChild(body);
    card.appendChild(close);
    modal.appendChild(card);
    document.body.appendChild(modal);

    function show() {
      modal.style.display = 'flex';
      document.body.style.overflow = 'hidden';
    }

    function hide() {
      modal.style.display = 'none';
      document.body.style.overflow = '';
    }

    close.addEventListener('click', hide);
    modal.addEventListener('click', e => {
      if (e.target === modal) hide();
    });

    return { body, show, hide };
  }

  // ===== Menu du studio : barre sur téléphone + menu de gauche =====
  const workspace = document.querySelector('.workspace');
  const wsHead = document.querySelector('.workspace-head');
  const ACTIONS = [
    ['studio', 'Mon studio'],
    ['projects', 'Mes projets'],
    ['styles', 'Styles de texte'],
    ['settings', 'Paramètres']
  ];

  if (workspace && wsHead) {
    const tabs = document.createElement('div');
    tabs.className = 'studio-tabs';

    ACTIONS.forEach(([id, label]) => {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'studio-tab';
      b.textContent = label;
      b.addEventListener('click', () => go(id));
      tabs.appendChild(b);
    });

    workspace.insertBefore(tabs, wsHead);
  }

  buildEditorPanelNavigation();
  collectLateEditorControls();

  // app.js charge app2.js de manière asynchrone. On récupère ses sections audio
  // dès que le chargement est terminé, sans recréer leurs champs ni leurs événements.
  window.addEventListener('justevivo:app2-ready', collectLateEditorControls);
  window.JVCollectLateEditorControls = collectLateEditorControls;

  document.querySelectorAll('.side-link').forEach(link => {
    // L'identifiant vient de data-page : l'ajout du tableau de bord ne décale plus les rubriques.
    const page = link.dataset.page;
    if (ACTIONS.some(([id]) => id === page)) {
      link.addEventListener('click', () => go(page));
    }
  });

  function go(id) {
    if (id === 'studio') {
      showEditorPanel('text');
      if (workspace) workspace.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else if (id === 'projects') {
      openProjects();
    } else if (id === 'styles') {
      showEditorPanel('styles');
    } else if (id === 'settings') {
      showEditorPanel('settings');
    }
    document.querySelectorAll('.sidebar .side-link').forEach(link => {
      link.classList.toggle('active', link.dataset.page === id);
    });
  }

  // ===== Projets : enregistrer l'état du studio =====
  function sectionInputs(title) {
    const d = Array.from(document.querySelectorAll('.controls-panel details')).find(x => {
      const s = x.querySelector('summary');
      return s && s.textContent.trim() === title;
    });
    return d ? Array.from(d.querySelectorAll('input')) : [];
  }

  function fire(e, type) {
    e.dispatchEvent(new Event(type, { bubbles: true }));
  }

  function setVal(e, v, type) {
    if (!e || v === undefined || v === null) return;
    e.value = String(v);
    fire(e, type);
  }

  function collect() {
    return {
      v: 1,
      style: activeStyle,
      font: fontSelect.value,
      color: colorInput.value,
      kwColor: kwColorInput.value,
      kwMode,
      emoji: emojiMode,
      display: displayMode,
      size: Math.round(sizeScale * 100),
      words: maxWords,
      width: widthPercent,
      lineHeight: Math.round(lineHeight * 100),
      spacing: Math.round(letterGap * 100),
      upper: upperCase,
      pos: positionPercent,
      hook: hookInput.value,
      hookSeconds,
      hookScale,
      hookTop,
      zoomOn,
      zoomLevel,
      silenceOn,
      silenceMin,
      format: formatId,
      fit: fitMode,
      caption: captionText.value,
      baseSegments,
      segments,
      edited
    };
  }

  function applySegments(d) {
    baseSegments = Array.isArray(d.baseSegments) ? d.baseSegments : [];
    segments = Array.isArray(d.segments) ? d.segments : [];
    edited = !!d.edited;
    captionText.value = d.caption || segments.map(s => s.text).join('\n');
    lastShown = null;
    computeSilences();
    updateSilenceInfo();
    updateCaption();
  }

  function restore(d) {
    // Les sous-titres d'abord, pour éviter les messages inutiles
    baseSegments = Array.isArray(d.baseSegments) ? d.baseSegments : [];
    segments = Array.isArray(d.segments) ? d.segments : [];
    edited = false;

    activeStyle = STYLES.some(s => s[0] === d.style) ? d.style : 'pop';

    setVal(fontSelect, d.font, 'change');
    setVal(colorInput, d.color, 'input');
    setVal(kwColorInput, d.kwColor, 'input');
    setVal(kwSelect, d.kwMode, 'change');
    setVal(emojiSelect, d.emoji, 'change');
    setVal(modeSelect, d.display, 'change');
    setVal(fmtSelect, d.format, 'change');
    setVal(fitSelect, d.fit, 'change');

    if (d.size) { sizeScale = d.size / 100; sizeSlider.set(d.size); }
    if (d.words) { maxWords = d.words; wordsSlider.set(d.words); }
    if (d.width) { widthPercent = d.width; widthSlider.set(d.width); }
    if (d.lineHeight) { lineHeight = d.lineHeight / 100; lineSlider.set(d.lineHeight); }
    if (d.spacing !== undefined) { letterGap = d.spacing / 100; spacingSlider.set(d.spacing); }

    upperCase = !!d.upper;
    upperInput.checked = upperCase;

    if (d.pos) {
      positionPercent = d.pos;
      posSlider.value = String(d.pos);
      posSelect.value = 'custom';
      applyPosition();
    }

    // Titre d'accroche
    hookInput.value = d.hook || '';
    fire(hookInput, 'input');
    const hs = sectionInputs('Titre d’accroche').filter(x => x.type === 'range');
    if (hs[0] && d.hookSeconds) setVal(hs[0], d.hookSeconds, 'input');
    if (hs[1] && d.hookScale) setVal(hs[1], Math.round(d.hookScale * 100), 'input');
    if (hs[2] && d.hookTop) setVal(hs[2], d.hookTop, 'input');

    // Zooms
    const zs = sectionInputs('Zooms automatiques');
    zoomOn = !!d.zoomOn;
    if (zs[0]) zs[0].checked = zoomOn;
    if (zs[1] && d.zoomLevel) setVal(zs[1], Math.round(d.zoomLevel * 100), 'input');

    // Silences
    const ss = sectionInputs('Suppression des silences');
    silenceOn = !!d.silenceOn;
    if (ss[0]) ss[0].checked = silenceOn;
    if (ss[1] && d.silenceMin) setVal(ss[1], d.silenceMin, 'input');

    applySegments(d);
    markSelected();
  }

  let pending = null;

  // Quand on réimporte la vidéo, les sous-titres du projet reviennent
  videoInput.addEventListener('change', () => {
    if (!pending) return;

    const p = pending;
    pending = null;

    const file = videoInput.files && videoInput.files[0];
    if (!file) return;

    if (p.videoName && file.name !== p.videoName) {
      const keep = confirm(
        'Cette vidéo (« ' + file.name + ' ») n’a pas le même nom que celle du projet (« ' +
        p.videoName + ' »). Garder quand même les sous-titres du projet ?'
      );
      if (!keep) return;
    }

    applySegments(p.data);
    showToast('Projet remis en place. Vous pouvez lire et exporter la vidéo.');
  });

  function openProject(row) {
    pending = { data: row.data || {}, videoName: row.video_name || '' };
    restore(row.data || {});
    pm.hide();
    showToast(
      'Projet « ' + row.name + ' » ouvert. Importez la même vidéo' +
      (row.video_name ? ' (' + row.video_name + ')' : '') + ' pour la lire et l’exporter.'
    );
    if (workspace) workspace.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  async function saveProject() {
    if (!hasSession()) {
      showToast('Connectez-vous pour enregistrer un projet.');
      openLogin();
      return;
    }

    // Un projet peut être sauvegardé avant la transcription : les réglages du studio
    // et les sous-titres disponibles sont conservés. Le média source sera réimporté
    // à l'ouverture, car les fichiers locaux ne sont pas stockés dans la base.
    const base = selectedFile ? selectedFile.name.replace(/\.[^.]+$/, '') : 'Mon projet';
    const name = (prompt('Nom du projet :', base) || '').trim().slice(0, 60);
    if (!name) return;

    try {
      const data = collect();
      if (JSON.stringify(data).length > 450000) {
        throw new Error('Ce projet est trop volumineux pour être enregistré.');
      }

      const existing = await sb('GET', 'projects?select=id&limit=40');
      if (existing.length >= 30) {
        throw new Error('Maximum 30 projets. Supprimez-en un dans « Mes projets ».');
      }

      await sb(
        'POST', 'projects',
        { name, video_name: selectedFile ? selectedFile.name : '', data },
        { Prefer: 'return=minimal' }
      );
      showToast('Projet « ' + name + ' » enregistré.');
    } catch (e) {
      showToast(e.message || 'Enregistrement impossible.');
    }
  }

  async function updateProject(row) {
    if (!hasSession()) {
      showToast('Connectez-vous pour modifier un projet.');
      openLogin();
      return;
    }
    if (!segments.length) {
      pmStatus.textContent = 'Générez ou chargez des sous-titres avant de mettre à jour ce projet.';
      return;
    }
    try {
      const data = collect();
      if (JSON.stringify(data).length > 450000) throw new Error('Ce projet est trop volumineux pour être enregistré.');
      await sb('PATCH', 'projects?id=eq.' + encodeURIComponent(row.id), {
        video_name: selectedFile ? selectedFile.name : (row.video_name || ''),
        data,
        updated_at: new Date().toISOString()
      }, { Prefer: 'return=minimal' });
      pmStatus.textContent = 'Projet « ' + row.name + ' » mis à jour.';
      loadProjects();
    } catch (error) {
      pmStatus.textContent = error.message || 'Mise à jour impossible.';
    }
  }

  async function renameProject(row) {
    const nextName = (prompt('Nouveau nom du projet :', row.name) || '').trim().slice(0, 60);
    if (!nextName || nextName === row.name) return;
    try {
      await sb('PATCH', 'projects?id=eq.' + encodeURIComponent(row.id), {
        name: nextName, updated_at: new Date().toISOString()
      }, { Prefer: 'return=minimal' });
      pmStatus.textContent = 'Projet renommé en « ' + nextName + ' ».';
      loadProjects();
    } catch (error) {
      pmStatus.textContent = error.message || 'Renommage impossible.';
    }
  }

  // Bouton « Enregistrer le projet » sous les boutons d'export
  const panel = document.querySelector('.controls-panel');
  if (panel) {
    const saveBtn = btn('Enregistrer le projet', 'button ghost full');
    saveBtn.addEventListener('click', saveProject);
    panel.appendChild(saveBtn);
  }

  // ===== Fenêtre « Mes projets » =====
  const pm = makeModal('Mes projets');
  const pmSave = btn('＋ Enregistrer le projet actuel', 'button primary full');
  const pmSearchWrap = el('div', {
    style: 'position:relative;width:100%;margin:10px 0'
  });
  const pmSearchIcon = el('span', {
    'aria-hidden': 'true',
    style: 'position:absolute;left:13px;top:50%;transform:translateY(-50%);font-size:17px;line-height:1;color:#aeb8d0;pointer-events:none'
  }, '⌕');
  const pmSearch = el('input', {
    type: 'search',
    placeholder: 'Rechercher un projet…',
    'aria-label': 'Rechercher un projet',
    style: 'width:100%;box-sizing:border-box;margin:0;padding:11px 12px 11px 42px;border-radius:10px;border:1px solid #34405f;background:#10162a;color:#fff'
  });
  pmSearch.className = 'jv-project-search';
  pmSearchWrap.append(pmSearchIcon, pmSearch);
  const pmStatus = el('div', { color: '#aeb8d0', margin: '10px 0', lineHeight: '1.5' });
  pmStatus.className = 'jv-project-status';
  const pmList = el('div');
  pm.body.appendChild(pmSave);
  pm.body.appendChild(pmSearchWrap);
  pm.body.appendChild(pmStatus);
  pm.body.appendChild(pmList);
  pmSearch.addEventListener('input', () => {
    const q = pmSearch.value.trim().toLocaleLowerCase('fr');
    Array.from(pmList.children).forEach(card => {
      card.hidden = !!q && !(card.dataset.search || '').includes(q);
    });
  });

  pmSave.addEventListener('click', async () => {
    await saveProject();
    loadProjects();
  });

  function projectRow(r) {
    const row = el('div', {
      background: '#0c1325', border: '1px solid #293554', borderRadius: '10px', padding: '10px', margin: '8px 0'
    });
    row.className = 'jv-project-row';
    row.dataset.search = ((r.name || '') + ' ' + (r.video_name || '')).toLocaleLowerCase('fr');

    row.appendChild(el('div', { fontWeight: '800', fontSize: '13px', marginBottom: '4px' }, r.name));

    const date = r.updated_at ? new Date(r.updated_at).toLocaleDateString('fr-FR') : '';
    row.appendChild(el(
      'div',
      { color: '#8994ad', fontSize: '10px', lineHeight: '1.5' },
      (r.video_name ? 'Vidéo : ' + r.video_name + ' · ' : '') + date
    ));

    const actions = el('div', { display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '8px' });
    actions.className = 'jv-project-card-actions';
    const open = btn('Ouvrir', 'button primary', { padding: '8px 14px', fontSize: '11px' });
    const update = btn('Mettre à jour', 'button ghost', { padding: '8px 14px', fontSize: '11px' });
    const rename = btn('Renommer', 'button ghost', { padding: '8px 14px', fontSize: '11px' });
    const del = btn('Supprimer', 'button ghost', { padding: '8px 14px', fontSize: '11px' });

    update.addEventListener('click', () => {
      if (!confirm('Remplacer le contenu enregistré de « ' + r.name + ' » par le contenu actuel du studio ?')) return;
      updateProject(r);
    });
    rename.addEventListener('click', () => renameProject(r));

    open.addEventListener('click', async () => {
      try {
        const rows = await sb(
          'GET', 'projects?id=eq.' + encodeURIComponent(r.id) + '&select=name,video_name,data'
        );
        if (!rows.length) throw new Error('Projet introuvable.');
        openProject(rows[0]);
      } catch (e) {
        pmStatus.textContent = e.message;
      }
    });

    del.addEventListener('click', async () => {
      if (!confirm('Supprimer le projet « ' + r.name + ' » ?')) return;
      try {
        await sb('DELETE', 'projects?id=eq.' + encodeURIComponent(r.id));
        loadProjects();
      } catch (e) {
        pmStatus.textContent = e.message;
      }
    });

    actions.appendChild(open);
    actions.appendChild(update);
    actions.appendChild(rename);
    actions.appendChild(del);
    row.appendChild(actions);
    return row;
  }

  async function loadProjects() {
    pmStatus.textContent = 'Chargement...';
    pmList.innerHTML = '';
    pmSearch.value = '';

    try {
      const rows = await sb('GET', 'projects?select=id,name,video_name,updated_at&order=updated_at.desc&limit=50');
      pmStatus.textContent = rows.length
        ? rows.length + ' projet(s).'
        : 'Aucun projet pour le moment. Générez des sous-titres, puis touchez « Enregistrer le projet actuel ».';
      rows.forEach(r => pmList.appendChild(projectRow(r)));
    } catch (e) {
      pmStatus.textContent = e.message;
    }
  }

  function openProjects() {
    if (!hasSession()) {
      showToast('Connectez-vous pour retrouver vos projets.');
      openLogin();
      return;
    }
    pm.show();
    loadProjects();
  }

  // ===== Fenêtre « Paramètres » =====
  const sm = makeModal('Paramètres');

  // Le même parcours Auth est réutilisé pour ne jamais contourner le contrôle CAPTCHA.
  async function requestPasswordRecovery() {
    const s = readSession();
    const email = s && s.email ? String(s.email).trim() : '';
    if (!email) throw new Error('Adresse email du compte introuvable. Reconnectez-vous.');
    if (typeof window.JVOpenPasswordRecovery !== 'function') {
      throw new Error('Le formulaire sécurisé de récupération n’est pas encore prêt. Rechargez la page.');
    }
    window.JVOpenPasswordRecovery(email);
    return email;
  }

  async function openSettings() {
    sm.body.innerHTML = '';
    sm.show();

    if (!hasSession()) {
      sm.body.appendChild(el(
        'div', { color: '#aeb8d0', lineHeight: '1.5', margin: '0 0 12px' },
        'Vous n’êtes pas connecté. Connectez-vous pour voir votre formule, vos quotas et changer votre mot de passe.'
      ));
      const b = btn('Connexion / Inscription', 'button primary full');
      b.addEventListener('click', () => {
        sm.hide();
        openLogin();
      });
      sm.body.appendChild(b);
      return;
    }

    const info = el('div', { lineHeight: '1.8', color: '#c2c8d9', margin: '0 0 14px', whiteSpace: 'pre-wrap' }, 'Chargement du compte...');
    sm.body.appendChild(info);

    const me = await getMe();
    const s = readSession();

    if (me && me.enabled) {
      const lines = [
        'Email : ' + (me.email || (s && s.email) || ''),
        'Formule : ' + me.planName,
        'Vidéos ce mois-ci : ' + me.videosUsed + ' / ' + me.videosLimit,
        'Durée maximale par vidéo : ' + (me.maxSeconds >= 60 ? Math.round(me.maxSeconds / 60) + ' min' : me.maxSeconds + ' s'),
        'Générateurs aujourd’hui : ' + me.genUsed + ' / ' + me.genLimit
      ];
      if (me.planUntil) {
        lines.push('Formule valable jusqu’au : ' + new Date(me.planUntil).toLocaleDateString('fr-FR'));
      }
      info.textContent = lines.join('\n');
    } else {
      info.textContent = 'Compte connecté : ' + ((s && s.email) || '');
    }

    const plans = btn('Voir les formules', 'button ghost full', { marginBottom: '14px' });
    plans.addEventListener('click', () => {
      sm.hide();
      // La vitrine est masquée lorsque le studio est ouvert : demander d'abord
      // au gestionnaire de navigation de la réafficher avant le défilement.
      document.dispatchEvent(new CustomEvent('jv:show-pricing'));
    });
    sm.body.appendChild(plans);

    sm.body.appendChild(el('div', { fontWeight: '800', margin: '4px 0 8px' }, 'Changer le mot de passe'));

    sm.body.appendChild(el(
      'div',
      { color: '#66758e', lineHeight: '1.6', margin: '0 0 12px' },
      'Pour protéger votre compte, nous envoyons d’abord un lien de vérification à votre adresse email. Vous pourrez définir un nouveau mot de passe après avoir ouvert ce lien.'
    ));

    const pwBtn = btn('Continuer vers la vérification email', 'button primary full');
    const pwMsg = el('div', { color: '#465570', background: '#f6f8fc', border: '1px solid #e4e9f2', borderRadius: '9px', padding: '10px', margin: '8px 0 14px', lineHeight: '1.5' });

    pwBtn.addEventListener('click', async () => {
      pwBtn.disabled = true;
      pwMsg.textContent = 'Ouverture du contrôle de sécurité…';
      try {
        const email = await requestPasswordRecovery();
        pwMsg.textContent = 'La fenêtre de sécurité est ouverte pour ' + email + '. Validez le contrôle anti-robot, puis cliquez sur « Mot de passe oublié ? » pour recevoir le lien de vérification.';
      } catch (e) {
        pwMsg.textContent = e.message;
      } finally {
        pwBtn.disabled = false;
      }
    });

    sm.body.appendChild(pwBtn);
    sm.body.appendChild(pwMsg);

    const out = btn('Se déconnecter', 'button ghost full');
    out.addEventListener('click', () => {
      const lb = Array.from(document.querySelectorAll('button'))
        .find(x => x.textContent.trim() === 'Déconnexion');
      if (lb) lb.click();
      sm.hide();
    });
    sm.body.appendChild(out);
  }

  // ===== Paiement des formules (FedaPay) =====
  (async function showPayNote() {
    try {
      const res = await window.fetch(API_URL + '/api/config');
      const d = await res.json();
      const note = document.querySelector('.plans-note');
      if (note) {
        note.textContent =
          'Paiement sécurisé par FedaPay, en francs CFA, pour 30 jours : ' +
          'Starter 6 000 F, Pro 9 000 F, Business 15 000 F. ' +
          'Moyens de paiement proposés selon votre pays (Mobile Money, cartes). ' +
          'Pas de renouvellement automatique.';
      }
    } catch (e) { /* tant pis */ }
  })();

  async function buy(plan, b) {
    if (!hasSession()) {
      showToast('Connectez-vous ou créez un compte pour choisir une formule.');
      openLogin();
      return;
    }

    const old = b.textContent;
    b.disabled = true;
    b.textContent = 'Un instant...';

    try {
      const me = await getMe();
      if (!me) {
        showToast('Connexion nécessaire. Réessayez après vous être connecté.');
        return;
      }

      if (!me.enabled || !me.payments) {
        showToast('Le paiement en ligne sera activé prochainement.');
        return;
      }

      const res = await window.fetch(API_URL + '/api/me/pay/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan })
      });

      let d = {};
      try {
        d = await res.json();
      } catch (e) { /* réponse vide */ }

      if (!res.ok || !d.url) {
        showToast(d.error || 'Paiement impossible pour le moment. Réessayez.');
        return;
      }

      showToast('Redirection vers la page de paiement...');
      window.location.href = d.url;
    } catch (e) {
      showToast('Paiement impossible : ' + (e.message || 'erreur'));
    } finally {
      b.disabled = false;
      b.textContent = old;
    }
  }

  document.addEventListener('click', e => {
    const b = e.target && e.target.closest ? e.target.closest('.plan-button') : null;
    if (!b) return;

    e.stopImmediatePropagation();
    e.preventDefault();
    buy(String(b.dataset.plan || '').toLowerCase(), b);
  }, true);

  // Retour depuis la page de paiement : on attend la confirmation
  async function watchPayment() {
    showToast('Vérification de votre paiement...');

    const first = await getMe();
    if (!first || !first.enabled) return;

    const start = first.planUntil || null;

    for (let i = 0; i < 20; i++) {
      await sleep(6000);

      const me = await getMe();
      if (me && me.planUntil && me.planUntil !== start) {
        showToast('Paiement confirmé ! Formule ' + me.planName + ' active.');
        await sleep(2000);
        window.location.reload();
        return;
      }
    }

    showToast('Paiement en attente de confirmation. Rechargez la page dans quelques minutes.');
  }

  if (/[?&]pay=return/.test(window.location.search)) {
    try {
      history.replaceState(null, '', window.location.pathname);
    } catch (e) { /* rien */ }
    watchPayment();
  }
})();
