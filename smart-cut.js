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


    const repetitionCard = document.createElement("article");
    repetitionCard.className = "jv-tool-card jv-smart-cut-card jv-repetition-card";
    repetitionCard.innerHTML = [
      '<div class="jv-smart-cut-heading"><div><span class="jv-eyebrow">MONTAGE ASSISTÉ PAR IA</span><h4>Détecter les répétitions</h4><p>Repère les mots répétés à la suite, comme « je, je pense ». Tu choisis précisément lesquels retirer : aucune coupe n’est appliquée sans validation.</p></div><span class="jv-coming">WHISPER + VALIDATION</span></div>',
      '<button type="button" class="jv-action jv-action-primary" id="jv-analyze-repetitions">⌕ Analyser les répétitions</button>',
      '<p class="jv-note">Certaines répétitions sont volontaires. Écoute le passage et coche uniquement celles qui sont accidentelles.</p>',
      '<div id="jv-repetition-status" class="jv-feedback" role="status" aria-live="polite"></div>',
      '<div id="jv-repetition-list" class="jv-repetition-list"></div>',
      '<button type="button" class="jv-action jv-action-primary" id="jv-apply-repetition-cuts" disabled>✂ Appliquer les coupes sélectionnées</button>',
      '<div id="jv-repetition-result" class="jv-smart-cut-result" hidden></div>'
    ].join("");
    timeline.appendChild(repetitionCard);

    const analyzeRepetitions = repetitionCard.querySelector("#jv-analyze-repetitions");
    const applyRepetitions = repetitionCard.querySelector("#jv-apply-repetition-cuts");
    const repetitionStatus = repetitionCard.querySelector("#jv-repetition-status");
    const repetitionList = repetitionCard.querySelector("#jv-repetition-list");
    const repetitionResult = repetitionCard.querySelector("#jv-repetition-result");
    let repetitionCandidates = [];
    const getVideoForRepetition = () => {
      const input = document.getElementById("videoInput");
      const file = input && input.files && input.files[0];
      if (!file || !file.type.startsWith("video/")) throw new Error("Importez d’abord une vidéo dans le studio principal.");
      if (file.size > 200 * 1024 * 1024) throw new Error("La vidéo dépasse la limite serveur de 200 Mo.");
      return file;
    };
    const formatTime = value => {
      const seconds = Math.max(0, Number(value) || 0);
      const minutes = Math.floor(seconds / 60);
      const rest = (seconds - minutes * 60).toFixed(1).padStart(4, "0");
      return String(minutes).padStart(2, "0") + ":" + rest;
    };
    const selectedRepetitions = () => Array.from(repetitionList.querySelectorAll("input[type=checkbox]:checked"))
      .map(input => repetitionCandidates[Number(input.dataset.index)])
      .filter(Boolean);
    analyzeRepetitions.addEventListener("click", async () => {
      let file;
      try { file = getVideoForRepetition(); } catch (error) { repetitionStatus.textContent = error.message; return; }
      analyzeRepetitions.disabled = true;
      analyzeRepetitions.textContent = "Analyse Whisper en cours…";
      applyRepetitions.disabled = true;
      repetitionStatus.textContent = "Transcription et recherche des répétitions consécutives…";
      repetitionList.replaceChildren();
      repetitionResult.hidden = true;
      const form = new FormData();
      form.append("video", file, file.name);
      try {
        const response = await fetch(API_URL + "/api/video/analyze-repetitions", { method: "POST", body: form });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || "Analyse impossible.");
        repetitionCandidates = Array.isArray(data.candidates) ? data.candidates : [];
        if (!repetitionCandidates.length) {
          repetitionStatus.textContent = data.message || "Aucune répétition évidente détectée.";
          return;
        }
        repetitionStatus.textContent = repetitionCandidates.length + " répétition(s) potentielle(s). Vérifie et sélectionne celles à retirer.";
        repetitionCandidates.forEach((candidate, index) => {
          const row = document.createElement("label");
          row.className = "jv-repetition-item";
          const checkbox = document.createElement("input");
          checkbox.type = "checkbox";
          checkbox.dataset.index = String(index);
          checkbox.addEventListener("change", () => { applyRepetitions.disabled = selectedRepetitions().length === 0; });
          const details = document.createElement("span");
          const heading = document.createElement("strong");
          heading.textContent = candidate.word + " → " + candidate.repeatedWord + " · " + formatTime(candidate.start);
          const context = document.createElement("small");
          context.textContent = candidate.context || "Contexte non disponible";
          details.append(heading, context);
          row.append(checkbox, details);
          repetitionList.appendChild(row);
        });
      } catch (error) {
        repetitionStatus.textContent = error.message || "Erreur pendant l’analyse.";
      } finally {
        analyzeRepetitions.disabled = false;
        analyzeRepetitions.textContent = "⌕ Analyser les répétitions";
      }
    });
    applyRepetitions.addEventListener("click", async () => {
      let file;
      try { file = getVideoForRepetition(); } catch (error) { repetitionStatus.textContent = error.message; return; }
      const selected = selectedRepetitions();
      if (!selected.length) return;
      applyRepetitions.disabled = true;
      applyRepetitions.textContent = "Reconstruction de la vidéo…";
      repetitionStatus.textContent = "Les passages sélectionnés sont retirés et la vidéo est reconstruite.";
      const form = new FormData();
      form.append("video", file, file.name);
      form.append("cuts", JSON.stringify(selected.map(item => ({ start: item.start, end: item.end }))));
      try {
        const response = await fetch(API_URL + "/api/video/apply-repetition-cuts", { method: "POST", body: form });
        if (!response.ok) {
          let message = "Impossible d’appliquer les coupes.";
          try { const data = await response.json(); if (data.error) message = data.error; } catch (_) {}
          throw new Error(message);
        }
        const blob = await response.blob();
        if (!blob.size) throw new Error("Le serveur a renvoyé un fichier vide.");
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = "justevivo-repetition-clean.mp4";
        link.className = "jv-action jv-action-primary";
        link.textContent = "↓ Télécharger la vidéo corrigée";
        const preview = document.createElement("video");
        preview.controls = true;
        preview.preload = "metadata";
        preview.src = url;
        preview.className = "jv-smart-cut-preview";
        repetitionResult.replaceChildren();
        const summary = document.createElement("strong");
        summary.textContent = selected.length + " répétition(s) retirée(s). Écoute le résultat avant de l’utiliser.";
        repetitionResult.append(summary, link, preview);
        repetitionResult.hidden = false;
        repetitionStatus.textContent = "Montage terminé. Le fichier original reste intact.";
        link.addEventListener("click", () => setTimeout(() => URL.revokeObjectURL(url), 60000), { once: true });
      } catch (error) {
        repetitionStatus.textContent = error.message || "Erreur pendant le montage.";
      } finally {
        applyRepetitions.disabled = false;
        applyRepetitions.textContent = "✂ Appliquer les coupes sélectionnées";
      }
    });

    const fillerCard = document.createElement("article");
    fillerCard.className = "jv-tool-card jv-smart-cut-card jv-filler-cut-card";
    fillerCard.innerHTML = [
      '<div class="jv-smart-cut-heading"><div><span class="jv-eyebrow">MONTAGE PAR LA PAROLE</span><h4>Supprimer les hésitations</h4><p>Whisper repère les hésitations vocales horodatées (euh, heu, hum, hmm, uh, um), puis JUSTEVIVO retire uniquement ces petits passages.</p></div><span class="jv-coming">WHISPER + FFMPEG</span></div>',
      '<button type="button" class="jv-action jv-action-primary" id="jv-run-filler-cut">✦ Nettoyer les hésitations</button>',
      '<p class="jv-note">La détection automatique peut se tromper selon la langue, l’accent ou le bruit. Vérifiez toujours le résultat. La vidéo source reste intacte.</p>',
      '<div id="jv-filler-status" class="jv-feedback" role="status" aria-live="polite"></div>',
      '<div id="jv-filler-result" class="jv-smart-cut-result" hidden></div>'
    ].join("");
    timeline.appendChild(fillerCard);

    const fillerButton = fillerCard.querySelector("#jv-run-filler-cut");
    const fillerStatus = fillerCard.querySelector("#jv-filler-status");
    const fillerResult = fillerCard.querySelector("#jv-filler-result");
    fillerButton.addEventListener("click", async () => {
      const input = document.getElementById("videoInput");
      const file = input && input.files && input.files[0];
      if (!file || !file.type.startsWith("video/")) {
        fillerStatus.textContent = "Importez d’abord une vidéo dans le studio principal.";
        fillerStatus.style.color = "#b45309";
        return;
      }
      if (file.size > 200 * 1024 * 1024) {
        fillerStatus.textContent = "La vidéo dépasse la limite serveur de 200 Mo.";
        fillerStatus.style.color = "#b45309";
        return;
      }
      fillerButton.disabled = true;
      fillerButton.textContent = "Transcription Whisper et montage en cours…";
      fillerStatus.style.color = "#7057f5";
      fillerStatus.textContent = "Extraction audio, repérage des hésitations et reconstruction vidéo. Ne fermez pas cette page.";
      fillerResult.hidden = true;
      fillerResult.innerHTML = "";
      const form = new FormData();
      form.append("video", file, file.name);
      try {
        const response = await fetch(API_URL + "/api/video/remove-fillers", { method: "POST", body: form });
        if (!response.ok) {
          let message = "Le nettoyage des hésitations a échoué.";
          try { const data = await response.json(); if (data.error) message = data.error; } catch (_) {}
          throw new Error(message);
        }
        const blob = await response.blob();
        if (!blob.size) throw new Error("Le serveur a renvoyé un fichier vide.");
        const url = URL.createObjectURL(blob);
        const original = Number(response.headers.get("X-JV-Original-Duration") || 0);
        const kept = Number(response.headers.get("X-JV-Output-Duration") || 0);
        const removed = Number(response.headers.get("X-JV-Removed-Duration") || 0);
        const count = Number(response.headers.get("X-JV-Detected-Fillers") || 0);
        const fmt = n => { const v=Math.max(0,Math.round(n)); return String(Math.floor(v/60)).padStart(2,"0")+":"+String(v%60).padStart(2,"0"); };
        const link = document.createElement("a");
        link.href = url;
        link.download = "justevivo-clean-speech.mp4";
        link.className = "jv-action jv-action-primary";
        link.textContent = "↓ Télécharger la vidéo nettoyée";
        fillerResult.hidden = false;
        fillerResult.innerHTML = '<strong>Nettoyage terminé.</strong><div class="jv-smart-cut-stats"><span>Durée initiale <b>'+fmt(original)+'</b></span><span>Durée finale <b>'+fmt(kept)+'</b></span><span>Temps retiré <b>'+fmt(removed)+'</b></span><span>Hésitations <b>'+count+'</b></span></div>';
        fillerResult.appendChild(link);
        const preview = document.createElement("video");
        preview.controls = true;
        preview.preload = "metadata";
        preview.src = url;
        preview.className = "jv-smart-cut-preview";
        fillerResult.appendChild(preview);
        fillerStatus.style.color = "#16866e";
        fillerStatus.textContent = "Traitement terminé. Écoutez le résultat avant de l’utiliser.";
        link.addEventListener("click", () => setTimeout(() => URL.revokeObjectURL(url), 60000), { once: true });
      } catch (error) {
        fillerStatus.style.color = "#b45309";
        fillerStatus.textContent = error.message || "Impossible de nettoyer cette vidéo. Réessayez.";
      } finally {
        fillerButton.disabled = false;
        fillerButton.textContent = "✦ Nettoyer les hésitations";
      }
    });


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
