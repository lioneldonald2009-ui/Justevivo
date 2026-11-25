/* JUSTEVIVO · Gestion des sous-titres existants */
(() => {
  "use strict";
  const API = window.API_URL || "https://justevivo-backend.onrender.com";
  const videoInput = document.getElementById("videoInput");
  const editorGrid = document.querySelector(".editor-grid");
  if (!editorGrid || !videoInput) return;

  const panel = document.createElement("section");
  panel.id = "jvSubtitleManager";
  panel.className = "jv-subtitle-manager";
  panel.innerHTML = `
    <div class="jv-sm-head"><div><span class="jv-sm-kicker">OUTIL COMPLÉMENTAIRE</span><h3>Gérer les sous-titres existants</h3><p>Importez un fichier SRT/VTT ou analysez les pistes d'une vidéo.</p></div><span class="jv-sm-limit">Vidéo : 200 Mo max</span></div>
    <div class="jv-sm-actions">
      <label class="jv-sm-file">Importer SRT / VTT<input id="jvSubtitleFile" type="file" accept=".srt,.vtt,text/vtt,application/x-subrip"></label>
      <button type="button" id="jvInspectVideo" class="jv-sm-button">Analyser les pistes vidéo</button><button type="button" id="jvRemoveEmbedded" class="jv-sm-button jv-sm-danger">Retirer les pistes intégrées</button>
      <button type="button" id="jvExportSrt" class="jv-sm-button" disabled>Exporter SRT</button>
      <button type="button" id="jvExportVtt" class="jv-sm-button" disabled>Exporter VTT</button>
    </div>
    <div id="jvSubtitleStatus" class="jv-sm-status" role="status" aria-live="polite">Aucun sous-titre chargé.</div>
    <div id="jvSubtitleTracks" class="jv-sm-tracks" hidden></div>
    <div class="jv-sm-translate"><label for="jvSubtitleTarget">Traduire les sous-titres chargés</label><select id="jvSubtitleTarget"><option value="fr">Français</option><option value="en">Anglais</option><option value="es">Espagnol</option><option value="pt">Portugais</option><option value="de">Allemand</option><option value="it">Italien</option><option value="ar">Arabe</option><option value="nl">Néerlandais</option><option value="ru">Russe</option><option value="zh">Chinois simplifié</option><option value="ja">Japonais</option><option value="ko">Coréen</option><option value="tr">Turc</option><option value="hi">Hindi</option><option value="sw">Swahili</option></select><button type="button" id="jvTranslateLoaded" class="jv-sm-button" disabled>Traduire</button><button type="button" id="jvClearSubtitles" class="jv-sm-button jv-sm-danger" disabled>Tout supprimer</button></div>
    <div id="jvSubtitleList" class="jv-sm-list"><p class="jv-sm-empty">Les sous-titres importés apparaîtront ici pour modification.</p></div>
    <p class="jv-sm-note"><strong>À savoir :</strong> les pistes intégrées peuvent être détectées et extraites. Les sous-titres incrustés directement dans l'image sont des pixels : leur suppression propre nécessite une étape distincte de reconnaissance visuelle et de reconstruction, qui n'est pas encore activée.</p>
  `;
  editorGrid.insertAdjacentElement("afterend", panel);

  const $ = id => panel.querySelector("#" + id);
  let cues = [];
  let sourceLanguage = "auto";
  let loadedFormat = "srt";
  const status = message => { $("jvSubtitleStatus").textContent = message; };
  const api = async (path, options = {}) => {
    const response = await fetch(API + path, options);
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
  };
  function refresh() {
    $("jvSubtitleList").replaceChildren();
    if (!cues.length) {
      const empty = document.createElement("p"); empty.className = "jv-sm-empty"; empty.textContent = "Aucun sous-titre chargé."; $("jvSubtitleList").append(empty);
    } else {
      cues.forEach((cue, index) => {
        const row = document.createElement("article"); row.className = "jv-sm-cue";
        const timing = document.createElement("div"); timing.className = "jv-sm-time"; timing.textContent = "#" + (index + 1) + " · " + formatTime(cue.start) + " → " + formatTime(cue.end);
        const edit = document.createElement("textarea"); edit.rows = 2; edit.maxLength = 4000; edit.value = cue.text; edit.setAttribute("aria-label", "Texte du sous-titre " + (index + 1));
        edit.addEventListener("change", () => { cues[index].text = edit.value.trim(); });
        const remove = document.createElement("button"); remove.type = "button"; remove.className = "jv-sm-remove"; remove.textContent = "Supprimer"; remove.addEventListener("click", () => { cues.splice(index, 1); refresh(); status("Sous-titre supprimé de la liste."); });
        row.append(timing, edit, remove); $("jvSubtitleList").append(row);
      });
    }
    $("jvExportSrt").disabled = !cues.length; $("jvExportVtt").disabled = !cues.length;
    $("jvTranslateLoaded").disabled = !cues.length; $("jvClearSubtitles").disabled = !cues.length;
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
  refresh();
})();
