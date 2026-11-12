(() => {
  const button = document.getElementById('installAppBtn');
  if (!button) return;

  let installPrompt = null;
  const isIOS = /iphone|ipad|ipod/i.test(navigator.userAgent) ||
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  const isAndroid = /android/i.test(navigator.userAgent);
  const isStandalone = window.matchMedia('(display-mode: standalone)').matches ||
    window.navigator.standalone === true;

  if (isStandalone) {
    button.hidden = true;
    return;
  }

  function showInstallHelp(title, message) {
    let overlay = document.getElementById('jv-install-help');
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.id = 'jv-install-help';
      overlay.innerHTML = '<div class="jv-install-panel" role="dialog" aria-modal="true" aria-labelledby="jv-install-title"><button type="button" class="jv-install-close" aria-label="Fermer">×</button><h2 id="jv-install-title"></h2><div class="jv-install-message"></div><button type="button" class="jv-install-ok">J’ai compris</button></div>';
      const style = document.createElement('style');
      style.textContent = '#jv-install-help{position:fixed;inset:0;z-index:2147483000;background:rgba(5,9,25,.72);display:grid;place-items:center;padding:18px;font-family:Arial,sans-serif}#jv-install-help .jv-install-panel{position:relative;width:min(100%,440px);background:#fff;color:#17213a;border-radius:20px;padding:26px;box-shadow:0 20px 70px #0005}#jv-install-help h2{font-size:21px;margin:0 32px 14px 0}#jv-install-help .jv-install-message{font-size:15px;line-height:1.65;white-space:pre-line;color:#4b5568}#jv-install-help button{cursor:pointer;border:0;border-radius:10px;padding:11px 16px;font-weight:700}#jv-install-help .jv-install-ok{margin-top:18px;background:#6b4df6;color:white}#jv-install-help .jv-install-close{position:absolute;right:14px;top:12px;background:#f1f2f7;color:#333;font-size:22px;padding:4px 10px}';
      document.head.appendChild(style);
      document.body.appendChild(overlay);
      const close = () => overlay.remove();
      overlay.querySelector('.jv-install-close').addEventListener('click', close);
      overlay.querySelector('.jv-install-ok').addEventListener('click', close);
      overlay.addEventListener('click', event => { if (event.target === overlay) close(); });
    }
    overlay.querySelector('#jv-install-title').textContent = title;
    overlay.querySelector('.jv-install-message').textContent = message;
  }

  window.addEventListener('beforeinstallprompt', event => {
    event.preventDefault();
    installPrompt = event;
    button.classList.add('is-install-ready');
    const label = button.querySelector('span');
    if (label) label.textContent = 'Installer sur cet appareil';
    button.setAttribute('aria-label', 'Installer JUSTEVIVO AI maintenant');
  });

  window.addEventListener('appinstalled', () => {
    installPrompt = null;
    button.hidden = true;
    showInstallHelp('JUSTEVIVO est installé', 'L’application est maintenant installée sur cet appareil. Tu peux la retrouver depuis le menu Démarrer ou les applications.');
  });

  button.addEventListener('click', async event => {
    event.preventDefault();
    event.stopPropagation();

    if (installPrompt) {
      try {
        const promptEvent = installPrompt;
        installPrompt = null;
        await promptEvent.prompt();
        const choice = await promptEvent.userChoice;
        if (choice?.outcome === 'accepted') {
          const label = button.querySelector('span');
          if (label) label.textContent = 'Installation acceptée';
        } else {
          showInstallHelp('Installation non terminée', 'Tu as fermé ou annulé la fenêtre d’installation. Tu peux réessayer en appuyant sur ce bouton.');
        }
      } catch (error) {
        console.error('JUSTEVIVO installation:', error);
        showInstallHelp('Installation indisponible', 'Le navigateur n’a pas pu ouvrir la fenêtre d’installation. Recharge la page puis réessaie. Tu peux aussi utiliser le menu du navigateur.');
      }
      return;
    }

    if (isIOS) {
      showInstallHelp('Installer sur iPhone / iPad', '1. Ouvre JUSTEVIVO dans Safari.\n2. Appuie sur le bouton Partager.\n3. Choisis « Sur l’écran d’accueil ».\n4. Appuie sur Ajouter.');
    } else if (isAndroid) {
      showInstallHelp('Installer sur Android', '1. Ouvre JUSTEVIVO dans Chrome.\n2. Appuie sur le menu ⋮ en haut à droite.\n3. Choisis « Installer l’application » ou « Ajouter à l’écran d’accueil ».');
    } else {
      const browser = /edg\//i.test(navigator.userAgent) ? 'Microsoft Edge' :
        /chrome|chromium/i.test(navigator.userAgent) ? 'Google Chrome' :
        /firefox/i.test(navigator.userAgent) ? 'Firefox' :
        /safari/i.test(navigator.userAgent) ? 'Safari' : 'ton navigateur';
      showInstallHelp('Installer JUSTEVIVO sur ordinateur', 'Sur '+browser+' :\n1. Vérifie que tu as ouvert https://justevivo.pages.dev/\n2. Dans la barre d’adresse, cherche l’icône Installer (écran avec une flèche +) et clique dessus.\n3. Si elle n’apparaît pas, ouvre le menu ⋮ en haut à droite puis « Diffuser, enregistrer et partager » ou « Installer JUSTEVIVO » selon la version du navigateur.\n4. Confirme avec « Installer ».\n\nSi l’option n’apparaît toujours pas, recharge la page avec Ctrl + Shift + R et réessaie avec Chrome ou Edge à jour. Firefox ne propose pas l’installation PWA de la même manière.');
    }
  });
})();
