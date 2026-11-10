/* JUSTEVIVO Creative Suite — extension additive, sans remplacer les modules existants. */
(() => {
  const ready = () => {
    const workspace = document.querySelector(".workspace");
    const sidebar = document.querySelector(".sidebar");
    const video = document.getElementById("videoPreview");
    const upload = document.querySelector(".upload-zone");
    const editor = document.querySelector(".editor-grid");
    if (!workspace || !sidebar || !video || !upload || !editor) return;

    const navItems = [
      ["media","▧","Bibliothèque média"],
      ["audio","♫","Audio & effets"],
      ["brand","✧","Brand Kit"],
      ["clips","▣","Magic Clips"]
    ];
    navItems.forEach(([page,icon,label]) => {
      if (sidebar.querySelector('[data-page="'+page+'"]')) return;
      const el=document.createElement("button");
      el.type="button"; el.className="side-link jv-extra-nav"; el.dataset.page=page;
      el.innerHTML="<span aria-hidden=\"true\">"+icon+"</span><span>"+label+"</span>";
      sidebar.appendChild(el);
    });

    const panel=document.createElement("section");
    panel.id="jv-creative-suite"; panel.className="jv-suite"; panel.hidden=true;
    panel.innerHTML=`
      <div class="jv-suite-head">
        <div><span class="jv-eyebrow">JUSTEVIVO CREATIVE SUITE</span><h3 id="jv-suite-title">Bibliothèque média</h3><p id="jv-suite-description">Centralisez vos vidéos, images et ressources de montage.</p></div>
        <span class="jv-suite-status"><i></i> ESPACE DE CRÉATION</span>
      </div>
      <div class="jv-suite-tabs" role="tablist" aria-label="Outils de création">
        <button type="button" data-tab="media" class="active">Médias</button>
        <button type="button" data-tab="audio">Audio</button>
        <button type="button" data-tab="brand">Brand Kit</button>
        <button type="button" data-tab="clips">Magic Clips</button>
        <button type="button" data-tab="timeline">Timeline</button>
      </div>
      <div class="jv-suite-view" data-view="media">
        <div class="jv-suite-grid">
          <article class="jv-tool-card jv-upload-card"><div class="jv-tool-icon">＋</div><h4>Importer des médias</h4><p>Ajoutez des vidéos, images et éléments B-roll depuis votre appareil.</p><label class="jv-file-button">Choisir des fichiers<input id="jv-media-input" type="file" accept="video/*,image/*" multiple></label></article>
          <article class="jv-tool-card"><div class="jv-tool-icon">▧</div><h4>Mes ressources</h4><p id="jv-media-count">Aucun média supplémentaire importé.</p><div id="jv-media-list" class="jv-asset-list"><span class="jv-empty">Vos fichiers apparaîtront ici.</span></div></article>
          <article class="jv-tool-card"><div class="jv-tool-icon">✦</div><h4>B-roll contextuel</h4><p>Préparez des plans d'illustration pour enrichir votre vidéo principale.</p><button type="button" class="jv-action" data-action="broll-hint">Comment ajouter un B-roll ?</button><small class="jv-note">Les suggestions automatiques par IA nécessitent le moteur d'analyse vidéo.</small></article>
        </div>
      </div>
      <div class="jv-suite-view" data-view="audio" hidden>
        <div class="jv-suite-grid">
          <article class="jv-tool-card"><div class="jv-tool-icon">♫</div><h4>Musique de fond</h4><p>Importez une piste audio locale et écoutez-la pendant le montage.</p><label class="jv-file-button">Importer une musique<input id="jv-audio-input" type="file" accept="audio/*"></label><div id="jv-audio-name" class="jv-asset-list"><span class="jv-empty">Aucune piste chargée.</span></div><audio id="jv-audio-preview" controls hidden></audio></article>
          <article class="jv-tool-card"><div class="jv-tool-icon">◖</div><h4>Mixage</h4><p>Réglez le niveau de la piste musicale locale.</p><label class="jv-range-label" for="jv-audio-volume">Volume musique <output id="jv-audio-volume-value">35 %</output></label><input id="jv-audio-volume" type="range" min="0" max="100" value="35"><label class="jv-check"><input id="jv-audio-muted" type="checkbox"> Couper la musique</label></article>
          <article class="jv-tool-card"><div class="jv-tool-icon">✧</div><h4>Amélioration audio</h4><p>Nettoyez la piste audio de votre vidéo avant de l’exporter.</p><label class="jv-check"><input id="jv-audio-denoise" type="checkbox" checked> Réduction du bruit de fond</label><label class="jv-check"><input id="jv-audio-normalize" type="checkbox" checked> Équilibrage automatique du volume</label><button type="button" class="jv-action jv-action-primary" id="jv-enhance-audio">Améliorer l’audio de ma vidéo</button><p id="jv-audio-enhance-status" class="jv-feedback" role="status" aria-live="polite"></p><div id="jv-audio-enhance-result" class="jv-clip-list"></div><small class="jv-note">Traitement FFmpeg réel côté serveur. L’isolation vocale avancée par IA nécessite un moteur de séparation dédié et n’est pas simulée.</small></article>
        </div>
      </div>
      <div class="jv-suite-view" data-view="brand" hidden>
        <div class="jv-brand-layout">
          <article class="jv-tool-card"><h4>Votre identité visuelle</h4><p>Enregistrez vos réglages pour les réutiliser dans vos prochains montages.</p><label class="jv-range-label">Nom de la marque</label><input id="jv-brand-name" class="jv-text-input" placeholder="Ex. Ma marque"><label class="jv-range-label">Couleur principale</label><input id="jv-brand-primary" type="color" value="#7657f5"><label class="jv-range-label">Couleur secondaire</label><input id="jv-brand-secondary" type="color" value="#23b7c9"><label class="jv-range-label">Police préférée</label><select id="jv-brand-font" class="jv-text-input"><option value="DM Sans">DM Sans</option><option value="Arial">Arial</option><option value="Georgia">Georgia</option><option value="Trebuchet MS">Trebuchet MS</option></select><button type="button" class="jv-action jv-action-primary" data-action="save-brand">Enregistrer mon Brand Kit</button><p id="jv-brand-feedback" class="jv-feedback" aria-live="polite"></p></article>
          <article class="jv-tool-card jv-brand-preview"><span class="jv-eyebrow">APERÇU DE MARQUE</span><div id="jv-brand-swatch"><strong id="jv-brand-preview-name">VOTRE MARQUE</strong><span>CRÉEZ AVEC VOTRE IDENTITÉ</span></div><p class="jv-note">Les préférences sont enregistrées dans ce navigateur. La synchronisation entre appareils sera ajoutée avec le stockage cloud.</p></article>
        </div>
      </div>
      <div class="jv-suite-view" data-view="clips" hidden>
        <div class="jv-clips-intro"><div><span class="jv-eyebrow">EXTRAITS INTELLIGENTS</span><h4>Transformez une longue vidéo en plusieurs clips.</h4><p>Whisper analyse la parole et propose des passages courts à fort potentiel. Vous gardez le choix avant chaque export.</p></div><span class="jv-coming jv-ready">WHISPER + FFmpeg ACTIFS</span></div>
        <div class="jv-tool-card">
          <div class="jv-clip-controls"><label>Durée cible<select id="jv-clip-duration" class="jv-text-input"><option value="15">15 secondes</option><option value="30" selected>30 secondes</option><option value="45">45 secondes</option><option value="60">60 secondes</option></select></label><button type="button" class="jv-action jv-action-primary" id="jv-analyze-clips" data-action="analyze-clips">✦ Analyser les meilleurs passages</button></div>
          <p class="jv-note">L’analyse utilise la transcription horodatée, la densité de parole et des formulations accrocheuses. Les suggestions restent indicatives : vérifiez chaque passage avant de l’exporter.</p>
          <p id="jv-clips-status" class="jv-feedback" aria-live="polite">Importez une vidéo dans le studio, puis lancez l’analyse.</p>
          <div id="jv-clips-list" class="jv-clip-list"><span class="jv-empty">Aucun extrait analysé.</span></div>
        </div>
      </div>
      <div class="jv-suite-view" data-view="timeline" hidden>
        <div class="jv-tool-card jv-timeline-card"><div class="jv-timeline-head"><div><h4>Timeline de montage</h4><p>Contrôlez la lecture, le point de lecture et les limites de votre séquence.</p></div><div class="jv-player-actions"><button type="button" data-action="play">▶ Lecture</button><button type="button" data-action="pause">Ⅱ Pause</button><button type="button" data-action="split">✂ Ajouter un point de coupe</button></div></div><div class="jv-time-row"><span id="jv-current-time">00:00</span><input id="jv-playhead" type="range" min="0" max="100" value="0"><span id="jv-total-time">00:00</span></div><div class="jv-track-label">PISTE VIDÉO PRINCIPALE</div><div class="jv-track"><div id="jv-main-clip" class="jv-main-clip">Vidéo principale</div><div id="jv-cut-markers"></div></div><div class="jv-trim-grid"><label>Début de séquence <output id="jv-trim-start-value">0.0 s</output><input id="jv-trim-start" type="range" min="0" max="100" value="0"></label><label>Fin de séquence <output id="jv-trim-end-value">100 %</output><input id="jv-trim-end" type="range" min="0" max="100" value="100"></label></div><button type="button" class="jv-action" data-action="preview-trim">Prévisualiser la zone sélectionnée</button><p class="jv-note">Les repères et limites sont non destructifs : le fichier source n'est pas modifié.</p><div id="jv-timeline-feedback" class="jv-feedback" aria-live="polite"></div></div>
      </div>
      <div class="jv-suite-footer"><span>Les outils locaux sont utilisables avec vos fichiers.</span><button type="button" data-action="save-session">Enregistrer la configuration du montage</button></div>
    `;
    workspace.appendChild(panel);

    const $=(s)=>panel.querySelector(s);
    const views=["media","audio","brand","clips","timeline"];
    const titles={media:["Bibliothèque média","Vos ressources visuelles et vos plans d'illustration."],audio:["Audio & effets","Préparez et mixez vos pistes audio."],brand:["Brand Kit","Enregistrez une identité visuelle cohérente."],clips:["Magic Clips","Préparez des extraits courts à partir d'une longue vidéo."],timeline:["Timeline de montage","Organisez vos repères et votre séquence vidéo."]};
    const setView=(name)=>{
      views.forEach(v=>{const el=$('[data-view="'+v+'"]');el.hidden=v!==name;});
      panel.querySelectorAll("[data-tab]").forEach(b=>b.classList.toggle("active",b.dataset.tab===name));
      $("#jv-suite-title").textContent=titles[name][0];$("#jv-suite-description").textContent=titles[name][1];
    };
    panel.querySelectorAll("[data-tab]").forEach(b=>b.addEventListener("click",()=>setView(b.dataset.tab)));

    let mediaFiles=[],cuts=[],audioUrl=null,brollUrl=null,magicClipCandidates=[];
    const fmt=(n)=>{n=Math.max(0,Number(n)||0);return String(Math.floor(n/60)).padStart(2,"0")+":"+String(Math.floor(n%60)).padStart(2,"0");};
    const duration=()=>Number.isFinite(video.duration)?video.duration:0;
    const syncTime=()=>{const d=duration(),t=video.currentTime||0;$("#jv-playhead").max=Math.max(1,d);$("#jv-playhead").value=Math.min(t,d||0);$("#jv-current-time").textContent=fmt(t);$("#jv-total-time").textContent=fmt(d);$("#jv-trim-start").max=Math.max(1,d);$("#jv-trim-end").max=Math.max(1,d);$("#jv-trim-end").value=d||100;$("#jv-trim-end-value").textContent=fmt(d);};
    video.addEventListener("loadedmetadata",syncTime);video.addEventListener("timeupdate",syncTime);
    $("#jv-playhead").addEventListener("input",e=>{video.currentTime=Number(e.target.value);});
    $("#jv-trim-start").addEventListener("input",e=>{$("#jv-trim-start-value").textContent=Number(e.target.value).toFixed(1)+" s";});
    $("#jv-trim-end").addEventListener("input",e=>{$("#jv-trim-end-value").textContent=fmt(e.target.value);});
    $("#jv-media-input").addEventListener("change",e=>{
      [...e.target.files].forEach(file=>{const url=URL.createObjectURL(file);mediaFiles.push({file,url});});
      $("#jv-media-count").textContent=mediaFiles.length+" média(s) importé(s) dans cette session.";
      $("#jv-media-list").innerHTML=mediaFiles.map((m,i)=>'<button type="button" class="jv-asset" data-asset="'+i+'">'+(m.file.type.startsWith("video/")?"▶":"▧")+" "+m.file.name+'</button>').join("");
      $("#jv-media-list").querySelectorAll("[data-asset]").forEach(b=>b.addEventListener("click",()=>applyBroll(mediaFiles[Number(b.dataset.asset)])));
    });
    function applyBroll(item){
      if(!item)return;
      if(brollUrl)URL.revokeObjectURL(brollUrl);brollUrl=item.url;
      let overlay=document.getElementById("jv-broll-overlay");
      if(!overlay){overlay=document.createElement(item.file.type.startsWith("video/")?"video":"img");overlay.id="jv-broll-overlay";overlay.muted=true;overlay.loop=true;overlay.autoplay=true;overlay.playsInline=true;document.getElementById("previewFrame").appendChild(overlay);}
      if(item.file.type.startsWith("video/")){if(overlay.tagName!=="VIDEO"){const n=document.createElement("video");n.id=overlay.id;n.muted=true;n.loop=true;n.autoplay=true;n.playsInline=true;overlay.replaceWith(n);overlay=n;}overlay.src=item.url;overlay.play().catch(()=>{});}
      else {if(overlay.tagName!=="IMG"){const n=document.createElement("img");n.id=overlay.id;overlay.replaceWith(n);overlay=n;}overlay.src=item.url;}
      $("#jv-timeline-feedback").textContent="B-roll chargé dans l'aperçu. Ajustez son placement dans votre composition.";
      setView("timeline");
    }
    $("#jv-audio-input").addEventListener("change",e=>{
      const f=e.target.files[0];if(!f)return;if(audioUrl)URL.revokeObjectURL(audioUrl);audioUrl=URL.createObjectURL(f);
      $("#jv-audio-preview").src=audioUrl;$("#jv-audio-preview").hidden=false;$("#jv-audio-name").textContent=f.name;
    });
    $("#jv-audio-volume").addEventListener("input",e=>{const v=Number(e.target.value);$("#jv-audio-volume-value").textContent=v+" %";$("#jv-audio-preview").volume=v/100;});
    $("#jv-audio-muted").addEventListener("change",e=>{$("#jv-audio-preview").muted=e.target.checked;});
    $("#jv-enhance-audio").addEventListener("click",async()=>{
      const input=document.getElementById("videoInput"),file=input&&input.files&&input.files[0];
      const status=$("#jv-audio-enhance-status"),result=$("#jv-audio-enhance-result"),button=$("#jv-enhance-audio");
      if(!file||!file.type.startsWith("video/")){status.textContent="Importez d’abord une vidéo dans le studio principal.";return;}
      if(file.size>200*1024*1024){status.textContent="La vidéo dépasse la limite serveur de 200 Mo.";return;}
      if(!$("#jv-audio-denoise").checked&&!$("#jv-audio-normalize").checked){status.textContent="Activez au moins un traitement audio.";return;}
      const form=new FormData();form.append("video",file,file.name);form.append("denoise",String($("#jv-audio-denoise").checked));form.append("normalize",String($("#jv-audio-normalize").checked));
      button.disabled=true;button.textContent="Traitement audio en cours…";status.textContent="Réduction du bruit et équilibrage de la piste audio. La vidéo originale reste intacte.";result.replaceChildren();
      try{
        const response=await fetch(API_URL+"/api/video/enhance-audio",{method:"POST",body:form});
        if(!response.ok){let data={};try{data=await response.json();}catch(_){}throw new Error(data.error||"Le traitement audio a échoué.");}
        const blob=await response.blob();if(!blob.size)throw new Error("Le fichier exporté est vide.");
        const url=URL.createObjectURL(blob),link=document.createElement("a");link.href=url;link.download="justevivo-audio-ameliore.mp4";link.className="jv-action jv-action-primary";link.textContent="↓ Télécharger la vidéo avec audio amélioré";result.appendChild(link);status.textContent="Traitement terminé. Écoutez le fichier exporté avant publication.";
        link.addEventListener("click",()=>setTimeout(()=>URL.revokeObjectURL(url),60000),{once:true});
      }catch(error){status.textContent=error.message||"Erreur pendant le traitement audio.";}
      finally{button.disabled=false;button.textContent="Améliorer l’audio de ma vidéo";}
    });
    const brandFields=["#jv-brand-name","#jv-brand-primary","#jv-brand-secondary","#jv-brand-font"];
    const syncBrand=()=>{$("#jv-brand-preview-name").textContent=$("#jv-brand-name").value.trim()||"VOTRE MARQUE";$("#jv-brand-swatch").style.background="linear-gradient(135deg,"+$("#jv-brand-primary").value+","+$("#jv-brand-secondary").value+")";$("#jv-brand-swatch").style.fontFamily=$("#jv-brand-font").value;};
    brandFields.forEach(s=>$(s).addEventListener("input",syncBrand));
    try{const saved=JSON.parse(localStorage.getItem("justevivo_brand_kit_v1")||"null");if(saved){$("#jv-brand-name").value=saved.name||"";$("#jv-brand-primary").value=saved.primary||"#7657f5";$("#jv-brand-secondary").value=saved.secondary||"#23b7c9";$("#jv-brand-font").value=saved.font||"DM Sans";syncBrand();}}catch(_){}
    function addCut(t){if(!duration()){ $("#jv-timeline-feedback").textContent="Importez d'abord une vidéo pour ajouter un repère.";return;}cuts.push(t);cuts.sort((a,b)=>a-b);$("#jv-cut-markers").innerHTML=cuts.map(x=>'<i title="Coupe à '+fmt(x)+'" style="left:'+(x/duration()*100)+'%"></i>').join("");$("#jv-timeline-feedback").textContent="Repère ajouté à "+fmt(t)+". Le fichier source n'a pas été modifié.";}
    panel.addEventListener("click",async e=>{
      const b=e.target.closest("[data-action]");if(!b)return;
      const a=b.dataset.action;
      if(a==="play"){video.play().catch(()=>{});}
      if(a==="pause")video.pause();
      if(a==="split")addCut(video.currentTime||0);
      if(a==="preview-trim"){const d=duration(),s=Number($("#jv-trim-start").value),end=Number($("#jv-trim-end").value);if(!d){$("#jv-timeline-feedback").textContent="Importez une vidéo avant de régler la séquence.";return;}if(s>=end){$("#jv-timeline-feedback").textContent="Le début doit être placé avant la fin.";return;}video.currentTime=s;video.play().catch(()=>{});$("#jv-timeline-feedback").textContent="Prévisualisation de "+fmt(s)+" à "+fmt(end)+". Le découpage n'est pas encore exporté.";}
      if(a==="broll-hint")alert("Importez vos images ou vidéos dans la bibliothèque, puis sélectionnez un média pour le charger dans l'aperçu comme B-roll.");
      if(a==="save-brand"){const obj={name:$("#jv-brand-name").value,primary:$("#jv-brand-primary").value,secondary:$("#jv-brand-secondary").value,font:$("#jv-brand-font").value};localStorage.setItem("justevivo_brand_kit_v1",JSON.stringify(obj));$("#jv-brand-feedback").textContent="Brand Kit enregistré sur cet appareil.";syncBrand();}
      if(a==="analyze-clips"){
        const input=document.getElementById("videoInput"),file=input&&input.files&&input.files[0];
        const button=$("#jv-analyze-clips"),status=$("#jv-clips-status"),list=$("#jv-clips-list");
        if(!file||!file.type.startsWith("video/")){status.textContent="Importez d’abord une vidéo dans le studio principal.";return;}
        if(file.size>200*1024*1024){status.textContent="La vidéo dépasse la limite serveur de 200 Mo.";return;}
        const form=new FormData();form.append("video",file,file.name);form.append("targetSeconds",$("#jv-clip-duration").value);
        button.disabled=true;button.textContent="Analyse Whisper en cours…";status.textContent="Transcription de la vidéo et repérage des passages…";list.replaceChildren();
        try{
          const response=await fetch(API_URL+"/api/video/analyze-clips",{method:"POST",body:form});
          const data=await response.json();if(!response.ok)throw new Error(data.error||"L’analyse des extraits a échoué.");
          magicClipCandidates=Array.isArray(data.candidates)?data.candidates:[];
          if(!magicClipCandidates.length){status.textContent="Aucun passage exploitable n’a été trouvé.";list.textContent="Essayez une vidéo contenant davantage de parole.";return;}
          status.textContent=magicClipCandidates.length+" extrait(s) proposé(s). Vérifiez le texte et les horaires avant export.";
          const sourcePreviewUrl=URL.createObjectURL(file);\n          magicClipCandidates.forEach((clip,index)=>{
            const card=document.createElement("article");card.className="jv-magic-clip";
            const head=document.createElement("div");head.className="jv-magic-clip-head";
            const title=document.createElement("strong");title.textContent="Extrait "+(index+1)+" · "+fmt(clip.start)+" — "+fmt(clip.end);
            const score=document.createElement("span");score.className="jv-clip-score";score.textContent="Score indicatif "+clip.score+"/100";head.append(title,score);
            const transcript=document.createElement("p");transcript.textContent=clip.text||"Transcription indisponible";
            const player=document.createElement("video");player.className="jv-clip-preview-player";player.controls=true;player.playsInline=true;player.preload="metadata";player.hidden=true;player.src=sourcePreviewUrl;
            const actions=document.createElement("div");actions.className="jv-magic-clip-actions";
            const preview=document.createElement("button");preview.type="button";preview.className="jv-action";preview.textContent="▶ Prévisualiser";preview.addEventListener("click",async()=>{
              player.hidden=false;
              try{if(player.readyState===0)await new Promise((resolve,reject)=>{player.addEventListener("loadedmetadata",resolve,{once:true});player.addEventListener("error",()=>reject(new Error("Impossible de charger l’aperçu vidéo.")),{once:true});player.load();});player.currentTime=Math.max(0,Number(clip.start)||0);await player.play();preview.textContent="Ⅱ Pause";}catch(error){status.textContent=error.message||"La prévisualisation est indisponible.";}
            });
            player.addEventListener("pause",()=>{preview.textContent="▶ Prévisualiser";});
            player.addEventListener("ended",()=>{preview.textContent="▶ Revoir l’extrait";});
            const exportBtn=document.createElement("button");exportBtn.type="button";exportBtn.className="jv-action jv-action-primary";exportBtn.textContent="↓ Exporter ce clip";exportBtn.addEventListener("click",async()=>{
              exportBtn.disabled=true;exportBtn.textContent="Préparation…";status.textContent="Export du clip en cours. Ne fermez pas cette page.";
              const exportForm=new FormData();exportForm.append("video",file,file.name);exportForm.append("start",String(clip.start));exportForm.append("end",String(clip.end));
              const controller=new AbortController();const timeout=setTimeout(()=>controller.abort(),5*60*1000);
              try{
                exportBtn.textContent="Export FFmpeg…";
                const result=await fetch(API_URL+"/api/video/render-clip",{method:"POST",body:exportForm,signal:controller.signal});
                if(!result.ok){let err={};try{err=await result.json();}catch(_){}throw new Error(err.error||"L’export du clip a échoué (HTTP "+result.status+").");}
                const blob=await result.blob();if(!blob.size)throw new Error("Le fichier exporté est vide.");
                const url=URL.createObjectURL(blob),link=document.createElement("a");link.href=url;link.download="justevivo-clip-"+String(index+1).padStart(2,"0")+".mp4";document.body.appendChild(link);link.click();link.remove();setTimeout(()=>URL.revokeObjectURL(url),60000);
                exportBtn.textContent="✓ Clip exporté";status.textContent="Export terminé : le téléchargement du clip a été lancé.";
              }catch(error){exportBtn.textContent="Réessayer l’export";status.textContent=error.name==="AbortError"?"L’export a dépassé 5 minutes. Réessayez avec un extrait plus court ou une vidéo moins lourde.":(error.message||"Erreur d’export.");}
              finally{clearTimeout(timeout);exportBtn.disabled=false;}
            });
            actions.append(preview,exportBtn);card.append(head,transcript,player,actions);list.appendChild(card);
          });
        }catch(error){status.textContent=error.message||"L’analyse a échoué.";list.textContent="Aucun extrait disponible.";}
        finally{button.disabled=false;button.textContent="✦ Analyser les meilleurs passages";}
      }
      if(a==="save-session"){const state={cuts,trimStart:Number($("#jv-trim-start").value),trimEnd:Number($("#jv-trim-end").value),duration:duration(),savedAt:new Date().toISOString()};localStorage.setItem("justevivo_edit_session_v1",JSON.stringify(state));$("#jv-timeline-feedback").textContent="Configuration de montage enregistrée dans ce navigateur.";}
    });
    function showPage(page){
      const isExtra=views.includes(page);
      panel.hidden=!isExtra;
      const head=workspace.querySelector(".workspace-head");
      const parts=[head,upload,editor,workspace.querySelector(".demo-warning")].filter(Boolean);
      parts.forEach(el=>el.hidden=isExtra);
      if(isExtra){setView(page);workspace.querySelectorAll(".side-link").forEach(l=>l.classList.toggle("active",l.dataset.page===page));panel.scrollIntoView({behavior:"smooth",block:"nearest"});}
      else if(page==="studio"){workspace.querySelectorAll(".side-link").forEach(l=>l.classList.toggle("active",l.dataset.page==="studio"));}
    }
    sidebar.querySelectorAll(".side-link").forEach(link=>link.addEventListener("click",()=>{
      const p=link.dataset.page;
      if(views.includes(p))showPage(p);
      else if(p==="studio"){showPage("studio");}
      else if(p==="dashboard"){panel.hidden=true;}
    }));
    document.querySelectorAll('a[href="#studio"]').forEach(a=>a.addEventListener("click",()=>showPage("studio")));
    $("#jv-brand-swatch").style.background="linear-gradient(135deg,#7657f5,#23b7c9)";
    syncBrand();syncTime();
  };
  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",ready);else ready();
})();
