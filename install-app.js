(() => {
  const button = document.getElementById('installAppBtn');
  if (!button) return;

  let installPrompt = null;
  const isIOS = /iphone|ipad|ipod/i.test(navigator.userAgent) ||
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  const isStandalone = window.matchMedia('(display-mode: standalone)').matches ||
    window.navigator.standalone === true;

  if (isStandalone) {
    button.hidden = true;
    return;
  }

  window.addEventListener('beforeinstallprompt', (event) => {
    event.preventDefault();
    installPrompt = event;
    button.classList.add('is-install-ready');
    button.querySelector('span').textContent = 'Télécharger l’application';
  });

  window.addEventListener('appinstalled', () => {
    installPrompt = null;
    button.hidden = true;
  });

  button.addEventListener('click', async () => {
    if (installPrompt) {
      installPrompt.prompt();
      const choice = await installPrompt.userChoice;
      if (choice && choice.outcome === 'accepted') {
        button.querySelector('span').textContent = 'Installation lancée';
      }
      installPrompt = null;
      return;
    }

    let instructions;
    if (isIOS) {
      instructions = 'Pour installer JUSTEVIVO sur iPhone :\n1. Ouvre cette page dans Safari.\n2. Appuie sur le bouton Partager.\n3. Choisis « Sur l’écran d’accueil ».\n4. Appuie sur Ajouter.';
    } else if (/android/i.test(navigator.userAgent)) {
      instructions = 'Pour installer JUSTEVIVO sur Android :\n1. Ouvre cette page dans Chrome.\n2. Appuie sur le menu ⋮.\n3. Choisis « Installer l’application » ou « Ajouter à l’écran d’accueil ».';
    } else {
      instructions = 'Pour installer JUSTEVIVO sur ordinateur :\nOuvre le menu d’installation de ton navigateur (icône d’installation dans la barre d’adresse ou menu du navigateur), puis choisis « Installer JUSTEVIVO ».';
    }
    window.alert(instructions);
  });
})();