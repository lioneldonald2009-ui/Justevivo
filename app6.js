// ===== JUSTEVIVO · app6.js · paiement des formules =====
(function () {
  const SESSION_KEY = 'justevivo_session_v1';
  const sleep = ms => new Promise(r => setTimeout(r, ms));

  async function getMe() {
    try {
      const res = await window.fetch(API_URL + '/api/me');
      if (!res.ok) return null;
      return await res.json();
    } catch (e) {
      return null;
    }
  }

  function hasSession() {
    try {
      return !!localStorage.getItem(SESSION_KEY);
    } catch (e) {
      return false;
    }
  }

  function openLogin() {
    const b = Array.from(document.querySelectorAll('button'))
      .find(x => x.textContent.trim() === 'Connexion / Inscription');
    if (b) b.click();
  }

  // Message sous les tarifs, une fois le paiement activé sur le serveur
  (async function showPayNote() {
    try {
      const res = await window.fetch(API_URL + '/api/config');
      const d = await res.json();
      const note = document.querySelector('.plans-note');
      if (d && d.payments && note) {
        note.textContent =
          'Paiement sécurisé par FedaPay, en francs CFA, pour 30 jours : ' +
          'Starter 5 400 F, Pro 12 000 F, Business 22 800 F. ' +
          'Moyens de paiement proposés selon votre pays (Mobile Money, cartes). ' +
          'Pas de renouvellement automatique.';
      }
    } catch (e) { /* tant pis */ }
  })();

  async function buy(plan, btn) {
    if (!hasSession()) {
      showToast('Connectez-vous ou créez un compte pour choisir une formule.');
      openLogin();
      return;
    }

    const old = btn.textContent;
    btn.disabled = true;
    btn.textContent = 'Un instant...';

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
      btn.disabled = false;
      btn.textContent = old;
    }
  }

  // Les boutons « Choisir ... » lancent le paiement
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
    if (start && first.plan !== 'free') {
      // la première réponse a déjà pu activer la formule : on compare ensuite
    }

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
