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
`;
  document.head.appendChild(css);

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

    const card = el('div', {
      width: '100%', maxWidth: '460px', background: '#10162a', border: '1px solid #34405f',
      borderRadius: '14px', padding: '16px', color: '#fff', fontFamily: 'inherit',
      fontSize: '12px', boxSizing: 'border-box', marginTop: '24px'
    });

    const title = el('div', { fontWeight: '800', fontSize: '16px', marginBottom: '10px' }, titleText);
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

  document.querySelectorAll('.side-link').forEach((link, i) => {
    if (ACTIONS[i]) link.addEventListener('click', () => go(ACTIONS[i][0]));
  });

  function go(id) {
    if (id === 'studio') {
      if (workspace) workspace.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else if (id === 'projects') {
      openProjects();
    } else if (id === 'styles') {
      currentTab = 'mine';
      renderGallery();
      const box = document.querySelector('.style-options');
      if (box) box.scrollIntoView({ behavior: 'smooth', block: 'center' });
      showToast('Vos styles enregistrés. Réglez un style, puis touchez « Enregistrer le style actuel ».');
    } else if (id === 'settings') {
      openSettings();
    }
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

    if (!segments.length) {
      showToast('Générez d’abord les sous-titres IA, puis enregistrez le projet.');
      return;
    }

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
  const pmStatus = el('div', { color: '#aeb8d0', margin: '10px 0', lineHeight: '1.5' });
  const pmList = el('div');
  pm.body.appendChild(pmSave);
  pm.body.appendChild(pmStatus);
  pm.body.appendChild(pmList);

  pmSave.addEventListener('click', async () => {
    await saveProject();
    loadProjects();
  });

  function projectRow(r) {
    const row = el('div', {
      background: '#0c1325', border: '1px solid #293554', borderRadius: '10px',
      padding: '10px', margin: '8px 0'
    });

    row.appendChild(el('div', { fontWeight: '800', fontSize: '13px', marginBottom: '4px' }, r.name));

    const date = r.updated_at ? new Date(r.updated_at).toLocaleDateString('fr-FR') : '';
    row.appendChild(el(
      'div',
      { color: '#8994ad', fontSize: '10px', lineHeight: '1.5' },
      (r.video_name ? 'Vidéo : ' + r.video_name + ' · ' : '') + date
    ));

    const actions = el('div', { display: 'flex', gap: '8px', marginTop: '8px' });
    const open = btn('Ouvrir', 'button primary', { padding: '8px 14px', fontSize: '11px' });
    const del = btn('Supprimer', 'button ghost', { padding: '8px 14px', fontSize: '11px' });

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
    actions.appendChild(del);
    row.appendChild(actions);
    return row;
  }

  async function loadProjects() {
    pmStatus.textContent = 'Chargement...';
    pmList.innerHTML = '';

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

  async function changePassword(pass) {
    const c = await getConf();
    const t = await token();
    if (c.disabled || !t) throw new Error('Connectez-vous d’abord.');

    const res = await window.fetch(c.url + '/auth/v1/user', {
      method: 'PUT',
      headers: { apikey: c.key, Authorization: 'Bearer ' + t, 'Content-Type': 'application/json' },
      body: JSON.stringify({ password: pass })
    });

    if (!res.ok) {
      let d = {};
      try {
        d = await res.json();
      } catch (e) { /* réponse vide */ }
      const low = String(d.msg || d.message || d.error_description || '').toLowerCase();
      if (low.includes('password')) throw new Error('Mot de passe refusé : choisissez-en un plus solide.');
      throw new Error('Changement impossible pour le moment.');
    }
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
      const p = document.getElementById('pricing');
      if (p) p.scrollIntoView({ behavior: 'smooth' });
    });
    sm.body.appendChild(plans);

    sm.body.appendChild(el('div', { fontWeight: '800', margin: '4px 0 8px' }, 'Changer le mot de passe'));

    const pw = document.createElement('input');
    pw.type = 'password';
    pw.placeholder = 'Nouveau mot de passe (8 caractères minimum)';
    pw.autocomplete = 'new-password';
    Object.assign(pw.style, {
      width: '100%', boxSizing: 'border-box', padding: '12px', background: '#0b1122',
      color: '#fff', border: '1px solid #34405f', borderRadius: '8px', fontSize: '14px',
      fontFamily: 'inherit', margin: '0 0 8px'
    });

    const pwBtn = btn('Enregistrer le mot de passe', 'button ghost full');
    const pwMsg = el('div', { color: '#aeb8d0', margin: '6px 0 14px', lineHeight: '1.5' });

    pwBtn.addEventListener('click', async () => {
      if (pw.value.length < 8) {
        pwMsg.textContent = 'Le mot de passe doit contenir au moins 8 caractères.';
        return;
      }

      pwBtn.disabled = true;
      pwMsg.textContent = 'Enregistrement...';

      try {
        await changePassword(pw.value);
        pw.value = '';
        pwMsg.textContent = 'Mot de passe modifié.';
      } catch (e) {
        pwMsg.textContent = e.message;
      } finally {
        pwBtn.disabled = false;
      }
    });

    sm.body.appendChild(pw);
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
      if (d && d.payments && note) {
        note.textContent =
          'Paiement sécurisé par FedaPay, en francs CFA, pour 30 jours : ' +
          'Starter 11 400 F, Pro 18 000 F, Business 28 800 F. ' +
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
