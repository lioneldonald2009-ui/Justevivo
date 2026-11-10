/* JUSTEVIVO — interface de montage intelligent connectée au moteur FFmpeg. */
(() => {
  const init = () => {
    const timeline = document.querySelector('#jv-creative-suite [data-view="timeline"]');
    if (!timeline || document.getElementById("jv-smart-cut-card")) return;
    const card = document.createElement("article");
    card.id = "jv-smart-cut-card";
    card.className = "jv-tool-card jv-smart-cut-card";
    card.innerHTML = [
      '<div class="jv-smart-cut-heading"><div><span class="jv-eyebrow">MONTAGE AUTOMATIQUE</span><h4>Supprimer les silences</h4><p>JUSTEVIVO analyse la piste audio, détecte les pauses et reconstruit une nouvelle vidéo sans les silences détectés.</p></div><span class="jv-coming">TRAITEMENT SERVEUR</span></div>',
      '<div class="jv-smart-cut-options">',
      '<label>Sensibilité audio<select id="jv-cut-threshold" class="jv-text-input"><option value="-32">Faible — coupe uniquement les silences nets</option><option value="-38" selected>Équilibrée — recommandée</option><option value="-44">Élevée — détecte les sons faibles</option></select></label>',
      '<label>Pause minimale<select id="jv-cut-minimum" class="jv-text-input"><option value="0.5">0,5 seconde</option><option value="0.7" selected>0,7 seconde</option><option value="1">1 seconde</option><option value="1.2">1,2 seconde</option></select></label>',
      '<label>Conserver autour de la parole<select id="jv-cut-padding" class="jv-text-input"><option value="0.08">0,08 seconde</option><option value="0.12" selected>0,12 seconde — recommandé</option><option value="0.2">0,20 seconde</option><option value="0.3">0,30 seconde</option></select></label>',
      '</div>',
      '<button type="button" class="jv-action jv-action-primary" id="jv-run-smart-cut">✂ Analyser et supprimer les silences</button>',
      '<p class="jv-note">La vidéo source n’est jamais écrasée. Une nouvelle vidéo MP4 est générée et téléchargée. Les coupures automatiques peuvent nécessiter une vérification manuelle.</p>',
      '<div id="jv-smart-cut-status" class="jv-feedback" role="status" aria-live="polite"></div>',
      '<div id="jv-smart-cut-result" class="jv-smart-cut-result" hidden></div>'
    ].join("");
    timeline.appendChild(card);

    const button = card.querySelector("#jv-run-smart-cut");
    const status = card.querySelector("#jv-smart-cut-status");
    const resultBox = card.querySelector("#jv-smart-cut-result");
    button.addEventListener("click", async () => {
      const input = document.getElementById("videoInput");
      const file = input && input.files && input.files[0];
      if (!file) {
        status.textContent = "Importez d’abord votre vidéo dans le studio principal.";
        status.style.color = "#b45309";
        return;
      }
      if (!file.type.startsWith("video/")) {
        status.textContent = "Le fichier sélectionné n’est pas une vidéo reconnue.";
        status.style.color = "#b45309";
        return;
      }
      if (file.size > 200 * 1024 * 1024) {
        status.textContent = "La vidéo dépasse la limite serveur de 200 Mo.";
        status.style.color = "#b45309";
        return;
      }
      button.disabled = true;
      button.textContent = "Analyse audio et reconstruction en cours…";
      status.style.color = "#7057f5";
      status.textContent = "Envoi sécurisé de la vidéo, analyse des silences puis rendu MP4. Ne fermez pas cette page.";
      resultBox.hidden = true;
      resultBox.innerHTML = "";
      const form = new FormData();
      form.append("video", file, file.name);
      form.append("thresholdDb", card.querySelector("#jv-cut-threshold").value);
      form.append("minSilenceSeconds", card.querySelector("#jv-cut-minimum").value);
      form.append("paddingSeconds", card.querySelector("#jv-cut-padding").value);
      try {
        const response = await fetch(API_URL + "/api/video/remove-silence", { method: "POST", body: form });
        if (!response.ok) {
          let message = "Le montage intelligent a échoué.";
          try { const data = await response.json(); if (data.error) message = data.error; } catch (_) {}
          throw new Error(message);
        }
        const blob = await response.blob();
        if (!blob.size) throw new Error("Le serveur a renvoyé un fichier vide.");
        const url = URL.createObjectURL(blob);
        const original = Number(response.headers.get("X-JV-Original-Duration") || 0);
        const kept = Number(response.headers.get("X-JV-Output-Duration") || 0);
        const removed = Number(response.headers.get("X-JV-Removed-Duration") || 0);
        const silences = Number(response.headers.get("X-JV-Detected-Silences") || 0);
        const fmt = n => { const v=Math.max(0,Math.round(n)); return String(Math.floor(v/60)).padStart(2,"0")+":"+String(v%60).padStart(2,"0"); };
        const link = document.createElement("a");
        link.href = url;
        link.download = "justevivo-smart-cut.mp4";
        link.className = "jv-action jv-action-primary";
        link.textContent = "↓ Télécharger la vidéo montée";
        resultBox.hidden = false;
        resultBox.innerHTML = '<strong>Votre nouvelle vidéo est prête.</strong><div class="jv-smart-cut-stats"><span>Durée initiale <b>'+fmt(original)+'</b></span><span>Durée finale <b>'+fmt(kept)+'</b></span><span>Temps retiré <b>'+fmt(removed)+'</b></span><span>Pauses détectées <b>'+silences+'</b></span></div>';
        resultBox.appendChild(link);
        const preview = document.createElement("video");
        preview.controls = true;
        preview.preload = "metadata";
        preview.src = url;
        preview.className = "jv-smart-cut-preview";
        resultBox.appendChild(preview);
        status.style.color = "#16866e";
        status.textContent = "Traitement terminé. La vidéo originale reste intacte.";
        link.addEventListener("click", () => setTimeout(() => URL.revokeObjectURL(url), 60000), { once: true });
      } catch (error) {
        status.style.color = "#b45309";
        status.textContent = error.message || "Impossible de traiter cette vidéo. Réessayez.";
      } finally {
        button.disabled = false;
        button.textContent = "✂ Analyser et supprimer les silences";
      }
    });
  };
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
