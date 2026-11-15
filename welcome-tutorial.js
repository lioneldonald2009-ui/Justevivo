(function () {
  "use strict";
  const steps = [
    {
      kicker: "00:00 – 00:35 · BIENVENUE",
      title: "Bienvenue dans JUSTEVIVO",
      body: "JUSTEVIVO rassemble des outils pour préparer, monter et exporter vos contenus vidéo, ainsi qu’un espace créatif pour vos photos et compositions. Vous pouvez l’utiliser dans votre navigateur. Pour profiter du grand aperçu, de la timeline et des panneaux de réglages, l’ordinateur est recommandé.",
      bullets: ["Ouvrez le site et connectez-vous pour retrouver votre espace personnel.", "Depuis l’accueil, découvrez les fonctionnalités, les tarifs et les démonstrations.", "Le bouton « Tutoriel » reste accessible en haut de la page."]
    },
    {
      kicker: "00:35 – 01:15 · VOTRE ESPACE",
      title: "Comprendre le tableau de bord",
      body: "Dans le studio principal, le menu latéral donne accès aux espaces de travail : compte, projets, éditeur vidéo, modèles, scènes, audio, export, bibliothèque média, Magic Clips, Brand Kit, timeline, assistant de production et paramètres.",
      bullets: ["Mon compte affiche votre formule et votre utilisation lorsque vous êtes connecté.", "Mes projets permet de retrouver les projets enregistrés.", "Formules & abonnement présente les offres et le renouvellement.", "Les réglages de compte et de sécurité se trouvent dans Paramètres."]
    },
    {
      kicker: "01:15 – 02:05 · MONTAGE VIDÉO",
      title: "Créer votre première vidéo",
      body: "Ouvrez l’éditeur vidéo, importez une ou plusieurs vidéos ou photos, puis travaillez le contenu dans les panneaux de l’éditeur. Vous pouvez préparer les sous-titres, personnaliser leur apparence, organiser les scènes et régler le son.",
      bullets: ["Importez vos fichiers depuis votre ordinateur ou appareil.", "Lancez la transcription et les sous-titres automatiques lorsque l’outil est disponible.", "Corrigez le texte, choisissez la langue et traduisez les sous-titres si nécessaire.", "Ajustez couleurs, typographies et styles animés ; utilisez les outils audio et les coupes.", "Prévisualisez le résultat, puis ouvrez Export pour choisir les réglages disponibles et enregistrer le rendu."]
    },
    {
      kicker: "02:05 – 02:55 · MONTAGE PHOTO",
      title: "Transformer vos photos en création",
      body: "Depuis Creative Studio, choisissez « Éditer une photo » ou « Montage photo ». Vous pouvez partir de vos médias ou d’un modèle, puis personnaliser votre composition. Le Montage Studio permet aussi de créer une séquence à partir de photos et de vidéos.",
      bullets: ["Dans Creative Studio : explorez Créer, Modèles, AI Lab, Bibliothèque et Réglages.", "Dans Montage Studio : importez vos images et vidéos, puis organisez-les dans la timeline.", "Ajoutez du texte, de l’audio, des effets et choisissez le format vertical, carré ou paysage.", "Utilisez lecture, annuler/rétablir, enregistrer et exporter pour finaliser votre création."]
    },
    {
      kicker: "02:55 – 03:35 · OUTILS COMPLÉMENTAIRES",
      title: "Les outils qui accélèrent votre production",
      body: "Selon les modules disponibles dans votre espace, vous pouvez retrouver Magic Clips pour repérer des extraits, B-Roll pour rechercher des ressources vidéo, Brand Kit pour conserver vos éléments visuels, ainsi que l’assistant de production pour préparer scripts, accroches et idées de scènes.",
      bullets: ["Bibliothèque média : gérez les ressources utiles à vos montages.", "Timeline : visualisez et organisez les éléments de votre séquence.", "Traduction et doublage : certaines options de voix restent partielles ou dépendent de l’appareil.", "La génération vidéo entièrement par IA, notamment les vidéos longues jusqu’à 10 minutes, n’est pas annoncée comme active tant que le moteur fournisseur n’est pas opérationnel."]
    },
    {
      kicker: "03:35 – 04:15 · ABONNEMENTS",
      title: "Choisir une formule et profiter de l’offre",
      body: "Le compte gratuit permet de découvrir le studio avec des limites. Les formules payantes augmentent les quotas et les capacités selon le plan. La campagne spéciale novembre–décembre 2026 propose 30 % de réduction aux 60 premiers abonnements éligibles.",
      bullets: ["Starter : 15 $/mois, Pro : 20 $/mois, Business : 30 $/mois au tarif normal.", "Avec la promotion : 10,50 $, 14 $ et 21 $ pour le premier mois uniquement.", "La réduction est réservée aux 60 premiers paiements d’abonnement confirmés et prend fin au 31 décembre 2026 ou lorsque le quota est atteint.", "Le compteur public indique les abonnements confirmés ; le renouvellement suivant revient au tarif normal."]
    },
    {
      kicker: "04:15 – 04:40 · CONSEIL FINAL",
      title: "La meilleure expérience : sur ordinateur",
      body: "Pour un travail précis, privilégiez un ordinateur avec un navigateur récent et une connexion stable. Gardez vos fichiers sources à portée de main, enregistrez régulièrement vos projets et vérifiez les paramètres d’export avant de télécharger votre vidéo.",
      bullets: ["Commencez par un petit projet test pour prendre en main les outils.", "Ne fermez pas l’éditeur pendant un export en cours.", "Connectez-vous pour accéder aux fonctions liées au compte et à l’abonnement."]
    }
  ];

  function init() {
    const trigger = document.getElementById("jvWelcomeTutorialOpen");
    if (!trigger || document.getElementById("jvWelcomeTutorial")) return;
    const style = document.createElement("link");
    style.rel = "stylesheet";
    style.href = "welcome-tutorial.css?v=1";
    document.head.appendChild(style);

    const dialog = document.createElement("section");
    dialog.id = "jvWelcomeTutorial";
    dialog.className = "jv-tutorial-backdrop";
    dialog.hidden = true;
    dialog.setAttribute("role", "dialog");
    dialog.setAttribute("aria-modal", "true");
    dialog.setAttribute("aria-labelledby", "jvTutorialTitle");
    dialog.innerHTML = `
      <div class="jv-tutorial-window">
        <header class="jv-tutorial-head">
          <div><span class="jv-tutorial-brand">JUSTEVIVO · GUIDE DE BIENVENUE</span><span class="jv-tutorial-duration">PARCOURS COMPLET · MOINS DE 5 MINUTES</span></div>
          <button type="button" class="jv-tutorial-close" aria-label="Fermer le tutoriel">×</button>
        </header>
        <div class="jv-tutorial-progress"><i id="jvTutorialProgress"></i></div>
        <div class="jv-tutorial-layout">
          <aside class="jv-tutorial-steps" aria-label="Étapes du tutoriel">
            <div class="jv-tutorial-step-list" id="jvTutorialStepList"></div>
          </aside>
          <main class="jv-tutorial-content">
            <span class="jv-tutorial-kicker" id="jvTutorialKicker"></span>
            <h2 id="jvTutorialTitle"></h2>
            <p id="jvTutorialBody"></p>
            <ul id="jvTutorialBullets"></ul>
            <div class="jv-tutorial-foot">
              <span id="jvTutorialCounter">Étape 1 sur 7</span>
              <div><button type="button" class="jv-tutorial-prev" id="jvTutorialPrev">Précédent</button><button type="button" class="jv-tutorial-next" id="jvTutorialNext">Suivant →</button></div>
            </div>
          </main>
        </div>
      </div>`;
    document.body.appendChild(dialog);

    const $ = id => document.getElementById(id);
    let current = 0;
    let previousFocus = null;
    const stepList = $("jvTutorialStepList");
    steps.forEach((step, index) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "jv-tutorial-step";
      button.innerHTML = `<span>0${index + 1}</span><b>${step.title}</b>`;
      button.addEventListener("click", () => render(index));
      stepList.appendChild(button);
    });

    function render(index) {
      current = Math.max(0, Math.min(steps.length - 1, index));
      const step = steps[current];
      $("jvTutorialKicker").textContent = step.kicker;
      $("jvTutorialTitle").textContent = step.title;
      $("jvTutorialBody").textContent = step.body;
      $("jvTutorialBullets").replaceChildren();
      step.bullets.forEach(item => {
        const li = document.createElement("li");
        li.textContent = item;
        $("jvTutorialBullets").appendChild(li);
      });
      $("jvTutorialCounter").textContent = "Étape " + (current + 1) + " sur " + steps.length;
      $("jvTutorialProgress").style.width = ((current + 1) / steps.length * 100) + "%";
      $("jvTutorialPrev").disabled = current === 0;
      $("jvTutorialNext").textContent = current === steps.length - 1 ? "Terminer ✓" : "Suivant →";
      stepList.querySelectorAll("button").forEach((button, i) => {
        button.classList.toggle("active", i === current);
        button.setAttribute("aria-current", i === current ? "step" : "false");
      });
    }
    function close() {
      dialog.hidden = true;
      document.body.classList.remove("jv-tutorial-open");
      if (previousFocus && previousFocus.focus) previousFocus.focus();
    }
    function open() {
      previousFocus = document.activeElement;
      dialog.hidden = false;
      document.body.classList.add("jv-tutorial-open");
      render(0);
      $("jvTutorialNext").focus();
    }
    trigger.addEventListener("click", open);
    dialog.querySelector(".jv-tutorial-close").addEventListener("click", close);
    dialog.addEventListener("click", event => { if (event.target === dialog) close(); });
    $("jvTutorialPrev").addEventListener("click", () => render(current - 1));
    $("jvTutorialNext").addEventListener("click", () => current === steps.length - 1 ? close() : render(current + 1));
    document.addEventListener("keydown", event => {
      if (dialog.hidden) return;
      if (event.key === "Escape") close();
      if (event.key === "ArrowRight") render(current + 1);
      if (event.key === "ArrowLeft") render(current - 1);
    });
    render(0);
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();