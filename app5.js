// ===== JUSTEVIVO · app5.js · comptes et quotas =====
(function () {
  const KEY = 'justevivo_session_v1';
  const origFetch = window.fetch.bind(window);

  let cfg = { enabled: false, ready: false, captchaSiteKey: '' };
  let session = null;
  let me = null;
  let jobId = newJobId();
  let tries = 0;
  let cfgPromise = null;

  function newJobId() {
    return 'j' + Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
  }

  try {
    const raw = localStorage.getItem(KEY);
    const s = raw ? JSON.parse(raw) : null;
    if (s && s.access_token && s.refresh_token) session = s;
  } catch (e) {
    session = null;
  }

  function saveSession(s) {
    session = s;
    try {
      if (s) localStorage.setItem(KEY, JSON.stringify(s));
      else localStorage.removeItem(KEY);
    } catch (e) { /* stockage indisponible */ }
  }

  function fmtSec(s) {
    return s >= 60 ? Math.round(s / 60) + ' min' : s + ' s';
  }

  function mk(tag, css, text) {
    const e = document.createElement(tag);
    if (css) Object.assign(e.style, css);
    if (text !== undefined) e.textContent = text;
    return e;
  }

  // ===== Connexion (API d'authentification Supabase) =====
  function authError(d) {
    const code = String(d.error_code || d.code || '');
    const msg = String(d.msg || d.error_description || d.message || d.error || '');
    const low = (code + ' ' + msg).toLowerCase();

    if (low.includes('invalid_credentials') || low.includes('invalid login')) return 'Email ou mot de passe incorrect.';
    if (low.includes('already')) return 'Un compte existe déjà avec cet email. Connectez-vous.';
    if (low.includes('weak_password') || low.includes('password should')) return 'Mot de passe trop faible : 8 caractères minimum.';
    if (low.includes('not_confirmed') || low.includes('not confirmed')) return 'Confirmez d’abord votre email (regardez votre boîte mail).';
    if (low.includes('rate') || low.includes('too many')) return 'Trop d’essais. Réessayez dans quelques minutes.';
    if (low.includes('signup') && low.includes('disabled')) return 'Les inscriptions sont fermées pour le moment.';
    if (low.includes('invalid') && low.includes('email')) return 'Adresse email invalide.';
    return msg || 'Une erreur est survenue. Réessayez.';
  }

  async function authCall(path, body, token) {
    const headers = { apikey: cfg.key, 'Content-Type': 'application/json' };
    if (token) headers.Authorization = 'Bearer ' + token;

    let res;
    try {
      res = await origFetch(cfg.url + '/auth/v1/' + path, {
        method: 'POST',
        headers,
        body: JSON.stringify(body || {})
      });
    } catch (e) {
      throw new Error('Connexion impossible. Vérifiez votre réseau.');
    }

    let data = {};
    try {
      data = await res.json();
    } catch (e) { /* réponse vide */ }

    if (!res.ok) throw new Error(authError(data));
    return data;
  }

  // Mise à jour du mot de passe uniquement avec le jeton temporaire reçu par email.
  async function updateRecoveredPassword(accessToken, password) {
    let res;
    try {
      res = await origFetch(cfg.url + '/auth/v1/user', {
        method: 'PUT',
        headers: {
          apikey: cfg.key,
          Authorization: 'Bearer ' + accessToken,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ password })
      });
    } catch (e) {
      throw new Error('Connexion impossible. Vérifiez votre réseau.');
    }
    let data = {};
    try { data = await res.json(); } catch (e) {}
    if (!res.ok) throw new Error(authError(data));
    return data;
  }

  function toSession(d, fallbackEmail) {
    return {
      access_token: d.access_token,
      refresh_token: d.refresh_token,
      expires_at: d.expires_at || Math.floor(Date.now() / 1000) + (d.expires_in || 3600),
      email: (d.user && d.user.email) || fallbackEmail || ''
    };
  }

  async function getToken() {
    if (!session) return '';

    const now = Math.floor(Date.now() / 1000);
    if (session.expires_at - now > 60) return session.access_token;

    try {
      const d = await authCall('token?grant_type=refresh_token', { refresh_token: session.refresh_token });
      saveSession(toSession(d, session.email));
      return session.access_token;
    } catch (e) {
      saveSession(null);
      me = null;
      renderBar();
      return '';
    }
  }

  // ===== Barre du compte (au-dessus de la zone d'import) =====
  const bar = mk('div', {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '10px',
    flexWrap: 'wrap',
    padding: '10px 12px',
    margin: '0 0 14px',
    border: '1px solid #293554',
    borderRadius: '12px',
    background: '#121a30',
    fontSize: '11px',
    color: '#c2c8d9'
  });
  bar.className = 'jv-account-bar';
  const barText = mk('div', { minWidth: '0', overflowWrap: 'anywhere', lineHeight: '1.5', flex: '1' });
  const barBtns = mk('div', { display: 'flex', gap: '8px' });
  const loginBtn = document.createElement('button');
  loginBtn.type = 'button';
  loginBtn.className = 'button primary';
  loginBtn.textContent = 'Connexion / Inscription';
  Object.assign(loginBtn.style, { padding: '8px 12px', fontSize: '11px' });

  const logoutBtn = document.createElement('button');
  logoutBtn.type = 'button';
  logoutBtn.className = 'button ghost';
  logoutBtn.textContent = 'Déconnexion';
  Object.assign(logoutBtn.style, { padding: '8px 12px', fontSize: '11px' });

  barBtns.appendChild(loginBtn);
  barBtns.appendChild(logoutBtn);
  bar.appendChild(barText);
  bar.appendChild(barBtns);

  const zone = document.querySelector('.upload-zone');
  if (zone && zone.parentNode) zone.parentNode.insertBefore(bar, zone);

  const sideBottom = document.querySelector('.side-bottom');

  function renderBar() {
    if (cfg.ready && !cfg.enabled) {
      bar.style.display = 'none';
      return;
    }

    bar.style.display = 'flex';

    if (!cfg.ready) {
      barText.textContent = session && session.email
        ? 'Connecté : ' + session.email
        : 'Chargement du compte...';
      loginBtn.style.display = 'none';
      logoutBtn.style.display = session ? '' : 'none';
      return;
    }

    if (!session) {
      barText.textContent = 'Créez un compte gratuit pour générer vos sous-titres et suivre vos quotas.';
      loginBtn.style.display = '';
      logoutBtn.style.display = 'none';
      if (sideBottom) sideBottom.textContent = 'Non connecté';
      return;
    }

    loginBtn.style.display = 'none';
    logoutBtn.style.display = '';

    if (me) {
      barText.textContent = me.isAdmin
        ? session.email + ' · Administrateur JUSTEVIVO · Tous les accès illimités'
        : session.email + ' · Formule ' + me.planName + ' · ' +
          me.videosUsed + '/' + me.videosLimit + ' vidéos ce mois-ci · ' +
          'durée max ' + fmtSec(me.maxSeconds);
      if (sideBottom) sideBottom.textContent = me.isAdmin ? 'Administrateur · Accès illimité' : 'Formule ' + me.planName;
    } else {
      barText.textContent = 'Connecté : ' + (session.email || '');
      if (sideBottom) sideBottom.textContent = 'Connecté';
    }
  }

  async function refreshMe() {
    if (!cfg.enabled || !session) {
      me = null;
      renderBar();
      return;
    }

    try {
      const res = await window.fetch(API_URL + '/api/me');
      if (!res.ok) throw new Error('me');
      const d = await res.json();
      me = d && d.enabled ? d : null;
    } catch (e) {
      me = null;
    }

    renderBar();
  }

  // ===== Fenêtre de connexion =====
  const modal = mk('div', {
    position: 'fixed', top: '0', left: '0', right: '0', bottom: '0',
    background: 'rgba(4,7,16,0.9)', zIndex: '10000', display: 'none',
    justifyContent: 'center', alignItems: 'flex-start', padding: '12px', overflowY: 'auto'
  });

  modal.className = 'jv-auth-modal';
  const card = mk('div', {
    width: '100%', maxWidth: '400px', background: '#10162a', border: '1px solid #34405f',
    borderRadius: '14px', padding: '16px', color: '#fff', fontFamily: 'inherit',
    fontSize: '12px', boxSizing: 'border-box', marginTop: '40px'
  });

  card.className = 'jv-auth-card';
  const title = mk('div', { fontWeight: '800', fontSize: '16px', marginBottom: '6px' }, 'Connexion');
  title.className = 'jv-auth-title';
  const msg = mk('div', { color: '#aeb8d0', margin: '6px 0 10px', lineHeight: '1.5' });
  msg.className = 'jv-auth-message';

  const FIELD = {
    width: '100%', boxSizing: 'border-box', padding: '12px', background: '#0b1122',
    color: '#fff', border: '1px solid #34405f', borderRadius: '8px', fontSize: '14px',
    fontFamily: 'inherit', marginBottom: '10px'
  };

  const emailInput = document.createElement('input');
  emailInput.type = 'email';
  emailInput.placeholder = 'Votre email';
  emailInput.autocomplete = 'email';
  emailInput.className = 'jv-auth-field';
  Object.assign(emailInput.style, FIELD);

  const passWrap = document.createElement('div');
  Object.assign(passWrap.style, {
    position: 'relative', width: '100%', marginBottom: '10px'
  });

  const passInput = document.createElement('input');
  passInput.type = 'password';
  passInput.placeholder = 'Mot de passe (8 caractères minimum)';
  passInput.autocomplete = 'current-password';
  passInput.className = 'jv-auth-field';
  Object.assign(passInput.style, FIELD, {
    width: '100%', boxSizing: 'border-box', paddingRight: '88px', marginBottom: '0'
  });

  const passToggle = document.createElement('button');
  passToggle.type = 'button';
  passToggle.textContent = 'Afficher';
  passToggle.setAttribute('aria-label', 'Afficher le mot de passe');
  passToggle.setAttribute('aria-pressed', 'false');
  Object.assign(passToggle.style, {
    position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)',
    border: '0', background: 'transparent', color: '#c9b8ff', cursor: 'pointer',
    font: 'inherit', fontSize: '12px', fontWeight: '800', padding: '8px 4px'
  });
  passToggle.addEventListener('click', () => {
    const visible = passInput.type === 'password';
    passInput.type = visible ? 'text' : 'password';
    passToggle.textContent = visible ? 'Masquer' : 'Afficher';
    passToggle.setAttribute('aria-label', visible ? 'Masquer le mot de passe' : 'Afficher le mot de passe');
    passToggle.setAttribute('aria-pressed', visible ? 'true' : 'false');
    passInput.focus();
  });
  passWrap.append(passInput, passToggle);

  const signInBtn = document.createElement('button');
  signInBtn.type = 'button';
  signInBtn.className = 'button primary full';
  signInBtn.textContent = 'Se connecter';

  const signUpBtn = document.createElement('button');
  signUpBtn.type = 'button';
  signUpBtn.className = 'button ghost full';
  signUpBtn.textContent = 'Créer un compte gratuit';

  const forgotPasswordBtn = document.createElement('button');
  forgotPasswordBtn.type = 'button';
  forgotPasswordBtn.className = 'button ghost full';
  forgotPasswordBtn.textContent = 'Mot de passe oublié ?';

  const recoveryFields = document.createElement('div');
  recoveryFields.hidden = true;
  const newPasswordInput = document.createElement('input');
  newPasswordInput.type = 'password';
  newPasswordInput.placeholder = 'Nouveau mot de passe (8 caractères minimum)';
  newPasswordInput.autocomplete = 'new-password';
  newPasswordInput.className = 'jv-auth-field';
  Object.assign(newPasswordInput.style, FIELD);
  const confirmPasswordInput = document.createElement('input');
  confirmPasswordInput.type = 'password';
  confirmPasswordInput.placeholder = 'Confirmer le nouveau mot de passe';
  confirmPasswordInput.autocomplete = 'new-password';
  confirmPasswordInput.className = 'jv-auth-field';
  Object.assign(confirmPasswordInput.style, FIELD);
  recoveryFields.append(newPasswordInput, confirmPasswordInput);

  const updatePasswordBtn = document.createElement('button');
  updatePasswordBtn.type = 'button';
  updatePasswordBtn.className = 'button primary full';
  updatePasswordBtn.textContent = 'Confirmer le nouveau mot de passe';
  updatePasswordBtn.hidden = true;

  const captchaWrap = document.createElement('div');
  captchaWrap.className = 'jv-captcha-wrap';
  captchaWrap.hidden = true;
  const captchaContainer = document.createElement('div');
  captchaContainer.id = 'jv-turnstile-widget';
  captchaWrap.appendChild(captchaContainer);

  const closeBtn = document.createElement('button');
  closeBtn.type = 'button';
  closeBtn.className = 'button ghost full';
  closeBtn.textContent = 'Fermer';

  [title, msg, emailInput, passWrap, captchaWrap, signInBtn, signUpBtn, forgotPasswordBtn,
   recoveryFields, updatePasswordBtn, closeBtn].forEach(e => card.appendChild(e));

  let captchaWidgetId = null;
  let captchaToken = '';
  let captchaScriptLoading = false;

  function renderCaptchaWidget() {
    if (!cfg.captchaSiteKey || modal.style.display !== 'flex') {
      captchaWrap.hidden = true;
      return;
    }
    captchaWrap.hidden = false;
    if (window.turnstile) {
      if (captchaWidgetId === null) {
        captchaWidgetId = window.turnstile.render(captchaContainer, {
          sitekey: cfg.captchaSiteKey,
          theme: 'light',
          callback: token => { captchaToken = token; },
          'expired-callback': () => { captchaToken = ''; },
          'error-callback': () => { captchaToken = ''; msg.textContent = 'La vérification anti-robot a échoué. Réessayez.'; }
        });
      } else {
        try { window.turnstile.reset(captchaWidgetId); } catch (_) {}
      }
      return;
    }
    if (captchaScriptLoading) return;
    captchaScriptLoading = true;
    const script = document.createElement('script');
    script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
    script.async = true;
    script.defer = true;
    script.onload = () => { captchaScriptLoading = false; renderCaptchaWidget(); };
    script.onerror = () => {
      captchaScriptLoading = false;
      msg.textContent = 'Impossible de charger la vérification anti-robot. Vérifiez votre connexion.';
    };
    document.head.appendChild(script);
  }

  function requireCaptchaToken() {
    if (!cfg.captchaSiteKey) return '';
    if (!captchaToken) throw new Error('Validez le contrôle anti-robot avant de continuer.');
    return captchaToken;
  }

  function resetCaptcha() {
    captchaToken = '';
    if (window.turnstile && captchaWidgetId !== null) {
      try { window.turnstile.reset(captchaWidgetId); } catch (_) {}
    }
  }
  modal.appendChild(card);
  document.body.appendChild(modal);

  const pageVisibilityStyle = document.createElement('style');
  pageVisibilityStyle.textContent = '[hidden]{display:none!important}';
  document.head.appendChild(pageVisibilityStyle);

  const landingSections = Array.from(document.querySelectorAll(
    'body > .topbar, body > main > .hero, body > main > .feature-strip, ' +
    'body > main > .marketing-showcase, body > main > .marketing-features, ' +
    'body > main > .marketing-usecases, body > main > .how-section, ' +
    'body > main > .marketing-faq, body > main > .plans-section, body > footer'
  ));
  const studioSection = document.querySelector('.studio-section');
  let pageMode = 'landing';

  function setPageMode(mode) {
    pageMode = mode;
    landingSections.forEach(el => { el.hidden = mode !== 'landing'; });
    if (studioSection) studioSection.hidden = mode !== 'studio';
    if (mode === 'studio' && studioSection) {
      studioSection.scrollIntoView({ behavior: 'auto', block: 'start' });
    }
  }

  function openAuth(text) {
    setPageMode('auth');
    msg.textContent = text || 'Connectez-vous ou créez un compte gratuit.';
    title.textContent = 'Connexion / Inscription';
    Object.assign(modal.style, {
      position: 'fixed', inset: '0', padding: '20px',
      alignItems: 'center', justifyContent: 'center', overflowY: 'auto'
    });
    Object.assign(card.style, { marginTop: '0', maxWidth: '460px', padding: '24px' });
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
    if (!recoveryAccessToken) renderCaptchaWidget();
    setTimeout(() => emailInput.focus(), 60);
  }

  function closeAuth() {
    modal.style.display = 'none';
    document.body.style.overflow = '';
    passInput.value = '';
    newPasswordInput.value = '';
    confirmPasswordInput.value = '';
    recoveryAccessToken = '';
    emailInput.hidden = false;
    passWrap.hidden = false;
    signInBtn.hidden = false;
    signUpBtn.hidden = false;
    forgotPasswordBtn.hidden = false;
    recoveryFields.hidden = true;
    updatePasswordBtn.hidden = true;
    captchaWrap.hidden = true;
    resetCaptcha();
    window.history.replaceState({}, document.title, window.location.pathname + window.location.search);
    if (pageMode === 'auth') setPageMode('landing');
  }

  closeBtn.addEventListener('click', closeAuth);
  modal.addEventListener('click', e => {
    if (e.target === modal) closeAuth();
  });
  passInput.addEventListener('keydown', e => {
    if (e.key === 'Enter') {
      e.preventDefault();
      signInBtn.click();
    }
  });

  function readForm() {
    const email = emailInput.value.trim();
    const pass = passInput.value;

    if (!/^\S+@\S+\.\S+$/.test(email)) {
      msg.textContent = 'Entrez une adresse email valide.';
      return null;
    }
    if (pass.length < 8) {
      msg.textContent = 'Le mot de passe doit contenir au moins 8 caractères.';
      return null;
    }
    return { email, pass };
  }

  function busy(on) {
    signInBtn.disabled = on;
    signUpBtn.disabled = on;
  }

  async function finishLogin(d, email) {
    saveSession(toSession(d, email));
    modal.style.display = 'none';
    document.body.style.overflow = '';
    passInput.value = '';
    setPageMode('studio');
    renderBar();
    showToast('Connecté.');
    await refreshMe();
  }

  signInBtn.addEventListener('click', async () => {
    if (!cfg.enabled) {
      msg.textContent = 'Les comptes ne sont pas disponibles pour le moment.';
      return;
    }

    const f = readForm();
    if (!f) return;

    busy(true);
    msg.textContent = 'Connexion en cours...';

    try {
      const captcha = requireCaptchaToken();
      const d = await authCall('token?grant_type=password', { email: f.email, password: f.pass, captcha_token: captcha || undefined });
      if (!d.user || !d.user.email_confirmed_at) {
        throw new Error('Votre adresse email n’est pas encore confirmée. Ouvrez le message envoyé par JUSTEVIVO, puis réessayez.');
      }
      await finishLogin(d, f.email);
    } catch (e) {
      msg.textContent = e.message;
    } finally {
      resetCaptcha();
      busy(false);
    }
  });

  signUpBtn.addEventListener('click', async () => {
    if (!cfg.enabled) {
      msg.textContent = 'Les comptes ne sont pas disponibles pour le moment.';
      return;
    }

    const f = readForm();
    if (!f) return;

    busy(true);
    msg.textContent = 'Création du compte...';

    try {
      const captcha = requireCaptchaToken();
      const d = await authCall('signup', { email: f.email, password: f.pass, captcha_token: captcha || undefined });

      if (d.access_token && d.user && d.user.email_confirmed_at) {
        await finishLogin(d, f.email);
      } else {
        // Ne jamais ouvrir une session JUSTEVIVO tant que l'email n'est pas confirmé.
        if (d.access_token) {
          try { await authCall('logout', {}, d.access_token); } catch (_) {}
        }
        msg.textContent =
          'Compte créé. Confirmez votre adresse email depuis le message envoyé par JUSTEVIVO (vérifiez aussi les spams), puis connectez-vous.';
      }
    } catch (e) {
      msg.textContent = e.message;
    } finally {
      resetCaptcha();
      busy(false);
    }
  });

  loginBtn.addEventListener('click', () => openAuth());

  forgotPasswordBtn.addEventListener('click', async () => {
    if (!cfg.enabled) {
      msg.textContent = 'La récupération du compte est indisponible pour le moment.';
      return;
    }
    const email = emailInput.value.trim();
    if (!/^\\S+@\\S+\\.\\S+$/.test(email)) {
      msg.textContent = 'Saisissez d’abord votre adresse email pour recevoir le lien de vérification.';
      emailInput.focus();
      return;
    }
    forgotPasswordBtn.disabled = true;
    msg.textContent = 'Envoi du lien de vérification en cours…';
    try {
      const redirect = window.location.origin + window.location.pathname + window.location.search;
      const captcha = requireCaptchaToken();
      await authCall('recover?redirect_to=' + encodeURIComponent(redirect), { email, captcha_token: captcha || undefined });
      msg.textContent = 'Si cette adresse correspond à un compte, un email de vérification vient d’être envoyé. Ouvrez le lien reçu pour autoriser le changement de mot de passe.';
    } catch (e) {
      msg.textContent = e.message;
    } finally {
      resetCaptcha();
      forgotPasswordBtn.disabled = false;
    }
  });

  let recoveryAccessToken = '';
  function showRecoveryForm(token) {
    recoveryAccessToken = token;
    openAuth('Votre adresse email a été vérifiée via le lien sécurisé. Choisissez maintenant un nouveau mot de passe.');
    title.textContent = 'Nouveau mot de passe';
    emailInput.hidden = true;
    passWrap.hidden = true;
    signInBtn.hidden = true;
    signUpBtn.hidden = true;
    forgotPasswordBtn.hidden = true;
    recoveryFields.hidden = false;
    updatePasswordBtn.hidden = false;
    newPasswordInput.focus();
  }

  updatePasswordBtn.addEventListener('click', async () => {
    const password = newPasswordInput.value;
    const confirmation = confirmPasswordInput.value;
    if (!recoveryAccessToken) {
      msg.textContent = 'Le lien de vérification est absent ou expiré. Demandez un nouvel email.';
      return;
    }
    if (password.length < 8) {
      msg.textContent = 'Le nouveau mot de passe doit contenir au moins 8 caractères.';
      return;
    }
    if (password !== confirmation) {
      msg.textContent = 'Les deux mots de passe ne correspondent pas.';
      confirmPasswordInput.focus();
      return;
    }
    updatePasswordBtn.disabled = true;
    msg.textContent = 'Mise à jour sécurisée du mot de passe…';
    try {
      if (cfgPromise) await cfgPromise;
      if (!cfg.enabled) throw new Error('Le service de comptes est indisponible. Réessayez dans quelques instants.');
      await updateRecoveredPassword(recoveryAccessToken, password);
      recoveryAccessToken = '';
      newPasswordInput.value = '';
      confirmPasswordInput.value = '';
      window.history.replaceState({}, document.title, window.location.pathname + window.location.search);
      recoveryFields.hidden = true;
      updatePasswordBtn.hidden = true;
      emailInput.hidden = false;
      passWrap.hidden = false;
      signInBtn.hidden = false;
      signUpBtn.hidden = false;
      forgotPasswordBtn.hidden = false;
      emailInput.value = emailInput.value || '';
      title.textContent = 'Mot de passe modifié';
      msg.textContent = 'Votre mot de passe a été modifié. Vous pouvez maintenant vous connecter avec votre nouveau mot de passe.';
    } catch (e) {
      msg.textContent = e.message + ' Si le lien a expiré, demandez-en un nouveau.';
    } finally {
      updatePasswordBtn.disabled = false;
    }
  });

  // Permet aux paramètres d'ouvrir le même parcours sécurisé de récupération.
  window.JVOpenPasswordRecovery = function (email) {
    openAuth('Vérifiez votre identité avant de changer le mot de passe. Validez le contrôle anti-robot, puis demandez le lien email.');
    emailInput.value = String(email || '').trim();
    forgotPasswordBtn.focus();
  };

  // Supabase renvoie le jeton de récupération dans le fragment URL après le clic email.
  function detectRecoveryLink() {
    const hash = new URLSearchParams(window.location.hash.replace(/^#/, ''));
    const type = hash.get('type');
    const token = hash.get('access_token');
    const error = hash.get('error_description');
    if (type === 'recovery' && token) {
      showRecoveryForm(token);
    } else if (error && /expired|invalid/i.test(error)) {
      openAuth('Le lien de vérification est invalide ou expiré. Demandez un nouvel email de récupération.');
    }
  }

  document.addEventListener('click', e => {
    const cta = e.target && e.target.closest ? e.target.closest('a[href="#studio"], button[data-open-studio]') : null;
    if (!cta) return;
    e.preventDefault();
    if (session && session.access_token) setPageMode('studio');
    else openAuth('Créez votre compte ou connectez-vous pour accéder à votre espace de travail.');
  });

  logoutBtn.addEventListener('click', async () => {
    const token = session ? session.access_token : '';
    saveSession(null);
    me = null;
    renderBar();
    showToast('Déconnecté.');

    if (token && cfg.enabled) {
      try {
        await authCall('logout', {}, token);
      } catch (e) { /* déjà déconnecté */ }
    }
  });

  // ===== Proposer de changer de formule =====
  function offerUpgrade(text) {
    const go = confirm(text + '\n\nVoir les formules ?');
    if (go) {
      const p = document.getElementById('pricing');
      if (p) p.scrollIntoView({ behavior: 'smooth' });
    }
  }

  function handleApiError(d) {
    if (!d) return;

    if (d.code === 'AUTH') {
      saveSession(null);
      me = null;
      renderBar();
      openAuth(d.error);
    } else if (d.code === 'QUOTA' || d.code === 'DURATION') {
      refreshMe();
      offerUpgrade(d.error);
    }
  }

  // ===== Ajout automatique de la connexion aux appels du serveur =====
  window.fetch = async function (input, init) {
    const url = typeof input === 'string' ? input : ((input && input.url) || '');
    const isApi = url.indexOf(API_URL + '/api/') === 0;
    const isMe = isApi && url.indexOf('/api/me') > 0;
    const isTranscribe = isApi && url.indexOf('/api/transcribe') > 0;
    const isGenerate = isApi && url.indexOf('/api/generate') > 0;
    const isTranslate = isApi && url.indexOf('/api/translate') > 0;

    if (!(isMe || isTranscribe || isGenerate || isTranslate)) return origFetch(input, init);

    if (cfgPromise) await cfgPromise;
    if (!cfg.enabled) return origFetch(input, init);

    const token = await getToken();

    if (!token) {
      if (!isMe) openAuth('Connectez-vous pour utiliser cette fonction.');
      return new Response(
        JSON.stringify({ error: 'Connectez-vous pour utiliser cette fonction.', code: 'AUTH' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    init = Object.assign({}, init);
    const h = new Headers(init.headers || {});
    h.set('Authorization', 'Bearer ' + token);
    init.headers = h;

    if (isTranscribe && init.body instanceof FormData) {
      init.body.append('jobId', jobId);
      init.body.append('totalSeconds', String(Math.round(videoPreview.duration || 0)));
    }

    const res = await origFetch(input, init);

    if (res.status === 401 || res.status === 403) {
      res.clone().json().then(handleApiError).catch(() => {});
    } else if (res.ok && (isTranscribe || isGenerate || isTranslate)) {
      setTimeout(refreshMe, 600);
    }

    return res;
  };

  // Le studio n'est visible qu'après authentification depuis la page de présentation.
  if (studioSection) studioSection.hidden = true;
  if (session && session.access_token) setPageMode('studio');

  // ===== Blocage avant le travail lourd : connexion et durée =====
  document.addEventListener('click', e => {
    const b = e.target && e.target.closest ? e.target.closest('button') : null;
    if (!b || !b.parentElement || !b.parentElement.classList.contains('controls-panel')) return;
    if (b.textContent.trim() !== 'Générer les sous-titres IA') return;

    if (!cfg.ready) {
      e.stopImmediatePropagation();
      e.preventDefault();
      showToast('Connexion au serveur en cours... réessayez dans quelques secondes.');
      return;
    }

    if (!cfg.enabled) return;

    if (!session) {
      e.stopImmediatePropagation();
      e.preventDefault();
      openAuth('Créez un compte gratuit ou connectez-vous pour générer des sous-titres.');
      return;
    }

    const dur = videoPreview.duration;
    if (me && isFinite(dur) && dur > me.maxSeconds + 5) {
      e.stopImmediatePropagation();
      e.preventDefault();
      offerUpgrade(
        'Cette vidéo dure ' + fmtSec(Math.round(dur)) + ', mais la formule ' + me.planName +
        ' autorise ' + fmtSec(me.maxSeconds) + ' maximum.'
      );
      return;
    }

    // Chaque génération compte pour une vidéo
    jobId = newJobId();
  }, true);

  // ===== Chargement de la configuration =====
  function loadConfig() {
    tries++;

    cfgPromise = (async () => {
      try {
        const res = await origFetch(API_URL + '/api/config');
        const d = await res.json();

        if (d && d.enabled && d.url && d.anonKey) {
          cfg = { enabled: true, ready: true, url: d.url, key: d.anonKey, captchaSiteKey: d.captchaSiteKey || '' };
          if (modal.style.display === 'flex' && !recoveryAccessToken) renderCaptchaWidget();
        } else {
          cfg = { enabled: false, ready: true };
        }
      } catch (e) {
        if (tries < 4) {
          setTimeout(loadConfig, 20000);
        } else {
          cfg = { enabled: false, ready: true };
        }
        return;
      }

      renderBar();
      if (cfg.enabled && session) refreshMe();
    })();

    return cfgPromise;
  }

  renderBar();
  loadConfig();
  detectRecoveryLink();
})();
