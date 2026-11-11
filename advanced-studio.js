/* JUSTEVIVO — Production IA : scripts de tournage et composition FFmpeg. */
(() => {
  "use strict";
  const init = () => {
    const panel = document.getElementById("jv-creative-suite");
    const view = panel && panel.querySelector('[data-view="production"]');
    if (!view || view.dataset.jvProductionReady === "1") return;
    view.dataset.jvProductionReady = "1";
    const $ = id => document.getElementById(id);
    const videoInput = $("videoInput");
    const scriptButton = $("jv-generate-script");
    const scriptStatus = $("jv-script-status");
    const scriptResult = $("jv-script-result");
    const composeButton = $("jv-compose-video");
    const composeStatus = $("jv-compose-status");
    const composeResult = $("jv-compose-result");
    let currentBrief = null;

    const makeButton = (label, action, cls) => {
      const b = document.createElement("button");
      b.type = "button"; b.className = cls || "jv-action"; b.textContent = label;
      b.addEventListener("click", action); return b;
    };
    const copyText = async text => {
      try { await navigator.clipboard.writeText(text); return true; }
      catch (_) {
        const area = document.createElement("textarea"); area.value = text;
        area.style.position = "fixed"; area.style.opacity = "0";
        document.body.appendChild(area); area.select();
        const ok = document.execCommand("copy"); area.remove(); return ok;
      }
    };
    const downloadText = (name, text) => {
      const url = URL.createObjectURL(new Blob([text], {type:"text/plain;charset=utf-8"}));
      const a = document.createElement("a"); a.href = url; a.download = name;
      document.body.appendChild(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(url), 30000);
    };
    const briefAsText = b => [
      "ACCROCHE\n" + (b.hook || ""),
      "VOIX OFF\n" + (b.voiceover || ""),
      "PLAN DE TOURNAGE\n" + (b.scenes || []).map((s,i) => (i+1)+". "+(s.time||"")+" — "+(s.visual||"")+"\nTexte écran : "+(s.onScreenText||"")+"\nDirection : "+(s.direction||"")).join("\n\n"),
      "APPEL À L’ACTION\n" + (b.cta || ""),
      "LÉGENDE\n" + (b.caption || ""),
      "HASHTAGS\n" + (Array.isArray(b.hashtags) ? b.hashtags.join(" ") : b.hashtags || "")
    ].join("\n\n");

    scriptButton.addEventListener("click", async () => {
      const topic = $("jv-script-topic").value.trim();
      if (topic.length < 5) { scriptStatus.textContent = "Décrivez votre sujet en au moins quelques mots."; return; }
      scriptButton.disabled = true; scriptButton.textContent = "Création du brief IA…";
      scriptStatus.textContent = "Le moteur IA prépare l’accroche, la voix off et le découpage des scènes.";
      scriptResult.replaceChildren(); currentBrief = null;
      try {
        const response = await fetch(API_URL + "/api/creative/generate-script", {
          method:"POST", headers:{"Content-Type":"application/json"},
          body:JSON.stringify({
            topic, platform:$("jv-script-platform").value,
            duration:$("jv-script-duration").value, tone:$("jv-script-tone").value,
            objective:$("jv-script-objective").value, language:"français"
          })
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || "La génération du script a échoué.");
        currentBrief = data.brief;
        $("jv-broll-script").value = briefAsText(currentBrief);
        const heading = document.createElement("h4"); heading.textContent = "Votre brief de production";
        const hook = document.createElement("blockquote"); hook.textContent = "ACCROCHE — " + (currentBrief.hook || "");
        const voiceTitle = document.createElement("h5"); voiceTitle.textContent = "Texte de la voix off";
        const voice = document.createElement("p"); voice.className = "jv-script-voice"; voice.textContent = currentBrief.voiceover || "";
        const scenesTitle = document.createElement("h5"); scenesTitle.textContent = "Découpage des scènes";
        const scenes = document.createElement("div"); scenes.className = "jv-script-scenes";
        (currentBrief.scenes || []).forEach((scene,index) => {
          const card = document.createElement("article");
          const h = document.createElement("strong"); h.textContent = (scene.time || "Scène "+(index+1)) + " · " + (scene.visual || "Plan à définir");
          const on = document.createElement("p"); on.textContent = "Texte à l’écran : " + (scene.onScreenText || "—");
          const dir = document.createElement("small"); dir.textContent = scene.direction || "";
          card.append(h,on,dir); scenes.appendChild(card);
        });
        const cta = document.createElement("p"); cta.textContent = "APPEL À L’ACTION — " + (currentBrief.cta || "");
        const caption = document.createElement("p"); caption.textContent = "LÉGENDE — " + (currentBrief.caption || "");
        const actions = document.createElement("div"); actions.className = "jv-script-actions";
        actions.append(
          makeButton("Copier la voix off", () => copyText(currentBrief.voiceover || "")),
          makeButton("Copier le brief complet", () => copyText(briefAsText(currentBrief))),
          makeButton("Télécharger le brief .txt", () => downloadText("justevivo-brief-video.txt", briefAsText(currentBrief)))
        );
        const listen = makeButton("▶ Écouter la voix off", () => {
          if (!("speechSynthesis" in window)) { scriptStatus.textContent = "La synthèse vocale n’est pas disponible sur cet appareil."; return; }
          window.speechSynthesis.cancel();
          const utterance = new SpeechSynthesisUtterance(currentBrief.voiceover || "");
          utterance.lang = "fr-FR"; utterance.rate = 1;
          window.speechSynthesis.speak(utterance);
        });
        actions.appendChild(listen);
        const tags = document.createElement("p"); tags.className = "jv-script-tags";
        tags.textContent = Array.isArray(currentBrief.hashtags) ? currentBrief.hashtags.join(" ") : String(currentBrief.hashtags || "");
        scriptResult.append(heading,hook,voiceTitle,voice,scenesTitle,scenes,cta,caption,tags,actions);
        scriptStatus.textContent = "Brief prêt. Vérifiez les formulations et les scènes avant tournage.";
      } catch (error) {
        scriptStatus.textContent = error.message || "Une erreur est survenue.";
      } finally {
        scriptButton.disabled = false; scriptButton.textContent = "✦ Générer le script et le plan de tournage";
      }
    });

    const brollButton = $("jv-generate-broll");
    const brollStatus = $("jv-broll-status");
    const brollResult = $("jv-broll-result");
    brollButton.addEventListener("click", async () => {
      const script = $("jv-broll-script").value.trim();
      if (script.length < 20) { brollStatus.textContent = "Ajoutez un script ou une description plus complète."; return; }
      brollButton.disabled = true; brollButton.textContent = "Analyse des scènes…";
      brollStatus.textContent = "Le directeur photo IA transforme le texte en plans visuels et recherches de B-roll.";
      brollResult.replaceChildren();
      try {
        const response = await fetch(API_URL + "/api/creative/suggest-broll", {
          method: "POST", headers: {"Content-Type":"application/json"},
          body: JSON.stringify({script, platform:$("jv-broll-platform").value, style:$("jv-broll-style").value})
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || "La génération du storyboard a échoué.");
        (data.scenes || []).forEach((scene,index) => {
          const card = document.createElement("article");
          const title = document.createElement("strong");
          title.textContent = (scene.time || "Plan "+(index+1)) + " · " + (scene.shotType || "Plan de coupe");
          const visual = document.createElement("p"); visual.textContent = scene.visual || "";
          const voice = document.createElement("small"); voice.textContent = "Voix / passage : " + (scene.voiceLine || "—");
          const search = document.createElement("p"); search.textContent = "Recherche stock : " + (scene.searchQuery || "—");
          const transition = document.createElement("p"); transition.textContent = "Transition : " + (scene.transition || "Coupe simple");
          const overlay = document.createElement("p"); overlay.textContent = "Texte écran : " + (scene.onScreenText || "—");
          const prompt = document.createElement("p"); prompt.textContent = "Prompt visuel : " + (scene.aiVisualPrompt || "—");
          const actions = document.createElement("div"); actions.className = "jv-script-actions";
          actions.append(
            makeButton("Copier recherche stock", () => copyText(scene.searchQuery || "")),
            makeButton("Copier prompt visuel", () => copyText(scene.aiVisualPrompt || "")),
            makeButton("Copier le plan", () => copyText([title.textContent,visual.textContent,search.textContent,transition.textContent,overlay.textContent,prompt.textContent].join("\n")))
          );
          card.append(title,visual,voice,search,transition,overlay,prompt,actions);
          brollResult.appendChild(card);
        });
        brollStatus.textContent = (data.count || 0) + " plans préparés. Les requêtes et prompts sont prêts à copier dans vos outils de recherche ou de génération visuelle.";
      } catch (error) {
        brollStatus.textContent = error.message || "Erreur pendant la création du storyboard.";
      } finally {
        brollButton.disabled = false; brollButton.textContent = "✦ Générer le storyboard B-roll";
      }
    });

    $("jv-compose-volume").addEventListener("input", event => {
      $("jv-compose-volume-label").textContent = event.target.value + " %";
    });
    composeButton.addEventListener("click", async () => {
      const main = videoInput && videoInput.files && videoInput.files[0];
      const broll = $("jv-compose-broll").files[0];
      const audio = $("jv-compose-audio").files[0];
      if (!main || !main.type.startsWith("video/")) { composeStatus.textContent = "Importez d’abord la vidéo principale dans le studio."; return; }
      if (!broll && !audio) { composeStatus.textContent = "Ajoutez au moins un B-roll ou une piste audio."; return; }
      const form = new FormData();
      form.append("video",main,main.name);
      if (broll) form.append("broll",broll,broll.name);
      if (audio) form.append("audio",audio,audio.name);
      form.append("brollStart",$("jv-broll-start").value);
      form.append("brollEnd",$("jv-broll-end").value);
      form.append("brollScale",$("jv-broll-scale").value);
      form.append("brollPosition",$("jv-broll-position").value);
      form.append("audioVolume",String(Number($("jv-compose-volume").value)/100));
      composeButton.disabled = true; composeButton.textContent = "Rendu FFmpeg en cours…";
      composeStatus.textContent = "Le serveur assemble vos pistes. Gardez cette page ouverte pendant le traitement.";
      composeResult.replaceChildren();
      try {
        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), 12*60*1000);
        let response;
        try { response = await fetch(API_URL + "/api/video/compose", {method:"POST",body:form,signal:controller.signal}); }
        finally { clearTimeout(timer); }
        if (!response.ok) {
          let data={}; try { data=await response.json(); } catch (_) {}
          throw new Error(data.error || "La composition vidéo a échoué.");
        }
        const blob = await response.blob();
        if (!blob.size) throw new Error("Le fichier exporté est vide.");
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a"); link.href=url;
        link.download="justevivo-video-composee.mp4"; link.className="jv-action jv-action-primary";
        link.textContent="↓ Télécharger la vidéo composée";
        composeResult.appendChild(link);
        const preview = document.createElement("video"); preview.controls=true; preview.src=url;
        preview.className="jv-compose-preview"; composeResult.appendChild(preview);
        composeStatus.textContent = "Composition terminée. Le fichier original n’a pas été modifié.";
        link.addEventListener("click",()=>setTimeout(()=>URL.revokeObjectURL(url),60000),{once:true});
      } catch (error) {
        composeStatus.textContent = error.name==="AbortError" ? "Le rendu a dépassé 12 minutes. Réessayez avec une vidéo plus courte." : (error.message || "Erreur pendant le rendu.");
      } finally {
        composeButton.disabled = false; composeButton.textContent = "▶ Assembler et exporter le MP4";
      }
    });
  };
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
