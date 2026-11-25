/* JUSTEVIVO · Gestion des sous-titres existants */
(() => {
  "use strict";
  function initSubtitleManager() {
  if (document.getElementById("jvSubtitleManager")) return true;
  const API = window.API_URL || "https://justevivo-backend.onrender.com";
  const videoInput = document.getElementById("videoInput");
  const editorGrid = document.querySelector(".editor-grid");
  if (!editorGrid || !videoInput) return false;

  const panel = document.createElement("section");
  panel.id = "jvSubtitleManager";
  panel.className = "jv-subtitle-manager";
  panel.innerHTML = `
    <div class="jv-sm-head"><div><span class="jv-sm-kicker">OUTIL COMPLÉMENTAIRE</span><h3>Gérer les sous-titres existants</h3><p>Importez une vidéo : JUSTEVIVO lit les sous-titres déjà visibles dans l’image grâce à la reconnaissance visuelle OCR. L’audio n’est pas transcrit.</p></div><span class="jv-sm-limit">Vidéo : 200 Mo max</span></div>
    <div class="jv-sm-actions">
      <label class="jv-sm-file">Importer SRT / VTT<input id="jvSubtitleFile" type="file" accept=".srt,.vtt,text/vtt,application/x-subrip"></label>
      <button type="button" id="jvAnalyzeSubtitles" class="jv-sm-button jv-sm-primary">Détecter les sous-titres visibles (OCR)</button><button type="button" id="jvInspectVideo" class="jv-sm-button">Voir les pistes intégrées</button><button type="button" id="jvRemoveEmbedded" class="jv-sm-button jv-sm-danger">Retirer les pistes intégrées</button>
      <button type="button" id="jvExportSrt" class="jv-sm-button" disabled>Exporter SRT</button>
      <button type="button" id="jvExportVtt" class="jv-sm-button" disabled>Exporter VTT</button>
    </div>
    <div id="jvSubtitleStatus" class="jv-sm-status" role="status" aria-live="polite">Aucun sous-titre chargé.</div>
    <div id="jvSubtitleTracks" class="jv-sm-tracks" hidden></div>
    <div class="jv-sm-translate"><label for="jvSubtitleTarget">Traduire les sous-titres chargés</label><select id="jvSubtitleTarget"><option value="fr">Français</option><option value="en">Anglais</option><option value="es">Espagnol</option><option value="pt">Portugais</option><option value="de">Allemand</option><option value="it">Italien</option><option value="ar">Arabe</option><option value="nl">Néerlandais</option><option value="ru">Russe</option><option value="zh">Chinois simplifié</option><option value="ja">Japonais</option><option value="ko">Coréen</option><option value="tr">Turc</option><option value="hi">Hindi</option><option value="sw">Swahili</option></select><button type="button" id="jvTranslateLoaded" class="jv-sm-button" disabled>Traduire</button><button type="button" id="jvClearSubtitles" class="jv-sm-button jv-sm-danger" disabled>Tout supprimer</button></div>
    <div id="jvSubtitleList" class="jv-sm-list"><p class="jv-sm-empty">Les sous-titres importés apparaîtront ici pour modification.</p></div>
    <section class="jv-sm-replace">
      <div><span class="jv-sm-kicker">REMPLACEMENT VISUEL</span><h4>Remplacer les sous-titres incrustés dans l’image</h4><p class="jv-sm-note">Après la détection OCR, la zone des anciens sous-titres est préremplie automatiquement. Corrigez le texte si nécessaire : JUSTEVIVO nettoie cette zone puis dessine les sous-titres corrigés aux minutages détectés.</p></div>
      <div class="jv-sm-region">
        <label>X début (%)<input id="jvBurnX" type="number" min="0" max="95" value="10"></label>
        <label>Y début (%)<input id="jvBurnY" type="number" min="0" max="95" value="78"></label>
        <label>Largeur (%)<input id="jvBurnW" type="number" min="5" max="95" value="80"></label>
        <label>Hauteur (%)<input id="jvBurnH" type="number" min="2" max="50" value="14"></label>
      </div>
      <div class="jv-sm-region">
        <label>Couleur du texte<input id="jvBurnColor" type="color" value="#ffffff"></label>
        <label>Fond du texte<input id="jvBurnBox" type="color" value="#000000"></label>
        <label>Opacité du fond<input id="jvBurnOpacity" type="number" min="0" max="1" step="0.05" value="0.55"></label>
      </div>
      <div class="jv-sm-actions"><button type="button" id="jvReplaceBurned" class="jv-sm-button jv-sm-primary" disabled>Nettoyer et remplacer dans la vidéo</button></div>
      <p class="jv-sm-note">La vidéo source reste intacte. Le rendu est exporté en MP4. La détection automatique estime la zone et les minutages à partir d’images échantillonnées. Vérifiez le rendu avant publication.</p>
    </section>
    <p class="jv-sm-note"><strong>Limite d’import :</strong> 200 Mo par vidéo, également appliquée côté serveur aux outils de génération et de rendu vidéo. Les fichiers SRT/VTT restent limités à 5 Mo.</p>
  `;
  editorGrid.insertAdjacentElement("afterend", panel);

  const $ = id => panel.querySelector("#" + id);
  let cues = [];
  let sourceLanguage = "auto";
  let loadedFormat = "srt";
  const status = message => { $("jvSubtitleStatus").textContent = message; };
  const api = async (path, options = {}) => {
    let session = null;
    try { session = JSON.parse(localStorage.getItem("justevivo_session_v1") || "null"); } catch (_) {}
    if (session && session.expires_at && session.expires_at - Math.floor(Date.now()/1000) <= 90) {
      try { await fetch(API + "/api/me"); } catch (_) {}
      try { session = JSON.parse(localStorage.getItem("justevivo_session_v1") || "null"); } catch (_) {}
    }
    const headers = new Headers(options.headers || {});
    if (session && session.access_token) headers.set("Authorization", "Bearer " + session.access_token);
    const response = await fetch(API + path, { ...options, headers });
    if (!response.ok) {
      let data = {};
      try { data = await response.json(); } catch (_) {}
      throw new Error(data.error || "L'opération a échoué.");
    }
    return response;
  };
  const currentVideo = () => videoInput.files && Array.from(videoInput.files).find(file => file.type.startsWith("video/"));
  const setBusy = (busy, message) => {
    panel.querySelectorAll("button,.jv-sm-file").forEach(el => { if (el.tagName === "BUTTON") el.disabled = busy || (el.dataset.requiresCues === "true" && !cues.length); });
    if (message) status(message);
    if (!busy) refresh();
  };
  function refresh() {
    $("jvSubtitleList").replaceChildren();
    if (!cues.length) {
      const empty = document.createElement("p"); empty.className = "jv-sm-empty"; empty.textContent = "Aucun sous-titre chargé."; $("jvSubtitleList").append(empty);
    } else {
      cues.forEach((cue, index) => {
        const row = document.createElement("article"); row.className = "jv-sm-cue";
        const timing = document.createElement("div"); timing.className = "jv-sm-time"; timing.textContent = "#" + (index + 1) + " · " + formatTime(cue.start) + " → " + formatTime(cue.end);
        const preview = document.createElement("p"); preview.className = "jv-sm-preview"; preview.textContent = cue.text;
        const edit = document.createElement("textarea"); edit.rows = 2; edit.maxLength = 4000; edit.value = cue.text; edit.hidden = true; edit.setAttribute("aria-label", "Texte du sous-titre " + (index + 1));
        const actions = document.createElement("div"); actions.className = "jv-sm-cue-actions";
        const modify = document.createElement("button"); modify.type = "button"; modify.className = "jv-sm-button"; modify.textContent = "Modifier";
        const save = document.createElement("button"); save.type = "button"; save.className = "jv-sm-button jv-sm-primary"; save.textContent = "Enregistrer"; save.hidden = true;
        modify.addEventListener("click", () => { preview.hidden = true; edit.hidden = false; modify.hidden = true; save.hidden = false; edit.focus(); });
        save.addEventListener("click", () => { const value = edit.value.trim(); if (!value) { status("Le texte ne peut pas être vide. Utilisez Supprimer pour retirer cette ligne."); return; } cues[index].text = value; refresh(); status("Modification enregistrée."); });
        const remove = document.createElement("button"); remove.type = "button"; remove.className = "jv-sm-remove"; remove.textContent = "Supprimer"; remove.addEventListener("click", () => { cues.splice(index, 1); refresh(); status("Sous-titre supprimé de la liste."); });
        actions.append(modify, save, remove); row.append(timing, preview, edit, actions); $("jvSubtitleList").append(row);
      });
    }
    $("jvExportSrt").disabled = !cues.length; $("jvExportVtt").disabled = !cues.length;
    $("jvTranslateLoaded").disabled = !cues.length; $("jvClearSubtitles").disabled = !cues.length; $("jvReplaceBurned").disabled = !cues.length;
  }
  function formatTime(seconds) { const ms=Math.max(0,Math.round(seconds*1000)); const h=Math.floor(ms/3600000),m=Math.floor(ms%3600000/60000),s=Math.floor(ms%60000/1000); return [h,m,s].map(n=>String(n).padStart(2,"0")).join(":"); }
  function loadParsed(data) { cues = data.cues || []; loadedFormat = data.format || "srt"; refresh(); status(cues.length + " sous-titre(s) chargé(s). Vous pouvez modifier les textes ou supprimer des lignes."); }
  $("jvSubtitleFile").addEventListener("change", async event => {
    const file = event.target.files && event.target.files[0]; if (!file) return;
    if (file.size > 5 * 1024 * 1024) { status("Le fichier de sous-titres dépasse 5 Mo."); return; }
    const form = new FormData(); form.append("subtitle", file);
    try { setBusy(true, "Import du fichier en cours…"); const response = await api("/api/subtitles/import", { method:"POST", body:form }); loadParsed(await response.json()); }
    catch (error) { status(error.message); } finally { setBusy(false); }
  });
  $("jvAnalyzeSubtitles").addEventListener("click", async () => {
    const file = currentVideo();
    if (!file) { status("Sélectionnez d'abord une vidéo dans la zone d'import principale."); return; }
    if (file.size > 200 * 1024 * 1024) { status("La vidéo dépasse la limite de 200 Mo."); return; }
    const form = new FormData(); form.append("video", file);
    try {
      setBusy(true, "Lecture des images et reconnaissance OCR des sous-titres visibles…");
      const response = await api("/api/subtitles/analyze-video", { method:"POST", body:form });
      const data = await response.json();
      loadParsed({ format:"srt", cues:data.cues || [] });
      if (data.region) {
        $("jvBurnX").value = Math.round(data.region.x * 100);
        $("jvBurnY").value = Math.round(data.region.y * 100);
        $("jvBurnW").value = Math.round(data.region.width * 100);
        $("jvBurnH").value = Math.round(data.region.height * 100);
      }
      status((data.note || "Analyse OCR terminée.") + " (" + (data.count || 0) + " lignes détectées visuellement)");
    } catch (error) { status(error.message); }
    finally { setBusy(false); }
  });
  $("jvInspectVideo").addEventListener("click", async () => {
    const file = currentVideo(); if (!file) { status("Sélectionnez d'abord une vidéo dans la zone d'import principale."); return; }
    if (file.size > 200 * 1024 * 1024) { status("La vidéo dépasse la limite de 200 Mo."); return; }
    const form = new FormData(); form.append("video", file);
    try {
      setBusy(true, "Analyse des pistes de sous-titres…"); const response = await api("/api/subtitles/inspect-video", { method:"POST", body:form }); const data = await response.json();
      const box=$("jvSubtitleTracks"); box.replaceChildren(); box.hidden=false;
      if (!data.streams || !data.streams.length) { box.textContent = data.note || "Aucune piste séparée détectée."; }
      else {
        const heading=document.createElement("p"); heading.textContent="Pistes détectées :"; box.append(heading);
        data.streams.forEach(stream => {
          const line=document.createElement("div"); line.className="jv-sm-track";
          const label=document.createElement("span"); label.textContent="Piste " + stream.index + " · " + stream.language + " · " + stream.codec;
          const select=document.createElement("select"); select.innerHTML='<option value="srt">SRT</option><option value="vtt">VTT</option>';
          const extract=document.createElement("button"); extract.type="button"; extract.className="jv-sm-button"; extract.textContent="Extraire";
          extract.addEventListener("click", async () => {
            const fd=new FormData(); fd.append("video", file); fd.append("streamIndex", String(stream.index)); fd.append("format", select.value);
            try { extract.disabled=true; status("Extraction de la piste…"); const result=await api("/api/subtitles/extract-track",{method:"POST",body:fd}); const blob=await result.blob(); const url=URL.createObjectURL(blob); const a=document.createElement("a"); a.href=url; a.download="justevivo-sous-titres."+select.value; a.click(); URL.revokeObjectURL(url); status("Piste extraite. Le fichier peut être réimporté pour modification."); }
            catch(error){status(error.message);} finally{extract.disabled=false;}
          });
          line.append(label,select,extract); box.append(line);
        });
      }
      status(data.note || (data.streams.length + " piste(s) détectée(s)."));
    } catch(error) { status(error.message); } finally { setBusy(false); }
  });
  $("jvRemoveEmbedded").addEventListener("click", async () => {
    const file=currentVideo(); if(!file){status("Sélectionnez d'abord une vidéo dans la zone d'import principale.");return;}
    if(file.size>200*1024*1024){status("La vidéo dépasse la limite de 200 Mo.");return;}
    if(!confirm("Créer une nouvelle copie de la vidéo sans aucune piste de sous-titres intégrée ? Le fichier original restera inchangé."))return;
    const form=new FormData();form.append("video",file);
    try{setBusy(true,"Création d'une copie sans pistes de sous-titres…");const response=await api("/api/subtitles/remove-tracks",{method:"POST",body:form});const blob=await response.blob();const url=URL.createObjectURL(blob);const a=document.createElement("a");a.href=url;const ext=(file.name.split(".").pop()||"mp4").toLowerCase();a.download="justevivo-sans-sous-titres."+ext;a.click();URL.revokeObjectURL(url);status("Nouvelle copie prête. La vidéo originale n'a pas été modifiée.");}
    catch(error){status(error.message);}finally{setBusy(false);}
  });
  async function exportFile(format) {
    try { status("Préparation de l'export…"); const response=await api("/api/subtitles/export",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({cues,format})}); const blob=await response.blob(); const url=URL.createObjectURL(blob); const a=document.createElement("a"); a.href=url; a.download="justevivo-sous-titres."+format; a.click(); URL.revokeObjectURL(url); status("Export " + format.toUpperCase() + " prêt."); }
    catch(error){status(error.message);}
  }
  $("jvExportSrt").addEventListener("click",()=>exportFile("srt")); $("jvExportVtt").addEventListener("click",()=>exportFile("vtt"));
  $("jvClearSubtitles").addEventListener("click",()=>{ if(!confirm("Supprimer tous les sous-titres de la liste de travail ? Le fichier vidéo original ne sera pas modifié."))return; cues=[]; refresh(); status("Liste vidée. La vidéo originale reste intacte."); });
  $("jvTranslateLoaded").addEventListener("click", async () => {
    const targetLanguage=$("jvSubtitleTarget").value; if(!cues.length)return;
    try { setBusy(true,"Traduction des sous-titres…"); const response=await api("/api/translate",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({targetLanguage,sourceLanguage,segments:cues})}); const data=await response.json(); cues=data.segments || []; refresh(); status(cues.length + " sous-titre(s) traduit(s). Les minutages sont conservés."); }
    catch(error){status(error.message);} finally{setBusy(false);}
  });
  $("jvReplaceBurned").addEventListener("click", async () => {
    const file = currentVideo();
    if (!file) { status("Sélectionnez d'abord une vidéo dans la zone d'import principale."); return; }
    if (file.size > 200 * 1024 * 1024) { status("La vidéo dépasse la limite de 200 Mo."); return; }
    if (!cues.length) { status("Importez un fichier SRT/VTT ou chargez les sous-titres à remplacer."); return; }
    const regionValues = ["jvBurnX","jvBurnY","jvBurnW","jvBurnH"].map(id => Number($(id).value));
    if (regionValues.some(value => !Number.isFinite(value)) ||
        regionValues[0] < 0 || regionValues[1] < 0 || regionValues[2] <= 0 || regionValues[3] <= 0 ||
        regionValues[0] + regionValues[2] > 100 || regionValues[1] + regionValues[3] > 100) {
      status("Vérifiez les coordonnées de la zone en pourcentage."); return;
    }
    const form = new FormData();
    form.append("video", file);
    form.append("cues", JSON.stringify(cues));
    form.append("region", JSON.stringify({x:regionValues[0]/100,y:regionValues[1]/100,width:regionValues[2]/100,height:regionValues[3]/100}));
    form.append("style", JSON.stringify({color:$("jvBurnColor").value,boxColor:$("jvBurnBox").value,boxOpacity:Number($("jvBurnOpacity").value)}));
    try {
      setBusy(true, "Nettoyage de l’ancienne zone et rendu des nouveaux sous-titres…");
      const response = await api("/api/subtitles/replace-burned", {method:"POST",body:form});
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a"); a.href = url; a.download = "justevivo-sous-titres-remplaces.mp4"; a.click();
      setTimeout(() => URL.revokeObjectURL(url), 30000);
      status("Vidéo exportée avec les nouveaux sous-titres. Vérifiez le rendu avant publication.");
    } catch(error) { status(error.message); }
    finally { setBusy(false); }
  });
  refresh();
  return true;
  }
  window.JV_INIT_SUBTITLE_MANAGER = initSubtitleManager;
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initSubtitleManager, { once: true });
  } else {
    initSubtitleManager();
  }
})();
