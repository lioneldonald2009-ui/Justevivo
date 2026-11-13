/* JUSTEVIVO Photo Studio — montage photo, effets et export vidéo WebM */
(() => {
  "use strict";
  const boot = () => {
    const workspace=document.querySelector(".workspace"), sidebar=document.querySelector(".sidebar");
    if(!workspace||!sidebar||document.getElementById("jv-photo-studio")) return;
    const nav=document.createElement("button");
    nav.type="button";nav.className="side-link jv-extra-nav";nav.dataset.page="photo-studio";
    nav.innerHTML='<span aria-hidden="true">▧</span><span>Montage photo</span>';
    sidebar.appendChild(nav);
    const page=document.createElement("section");page.id="jv-photo-studio";page.className="workspace-page";page.hidden=true;
    page.innerHTML=`
      <style>
      #jv-photo-studio{padding:20px;color:var(--text,#182033)}#jv-photo-studio .jvp-grid{display:grid;grid-template-columns:minmax(0,1.4fr) minmax(260px,.8fr);gap:16px}
      #jv-photo-studio .jvp-card{background:var(--card,#fff);border:1px solid var(--border,#e5e7eb);border-radius:16px;padding:16px;min-width:0}
      #jv-photo-studio h2{margin:4px 0 8px}#jv-photo-studio p{color:var(--muted,#697386);font-size:13px}
      #jv-photo-studio canvas{width:100%;aspect-ratio:16/9;background:#111;border-radius:12px;display:block}
      #jv-photo-studio label{display:block;font-size:13px;font-weight:600;margin:12px 0 5px}
      #jv-photo-studio input,#jv-photo-studio select{max-width:100%;width:100%;padding:10px;border:1px solid var(--border,#d9deea);border-radius:9px;background:var(--input,#fff);color:inherit}
      #jv-photo-studio .jvp-row{display:flex;gap:8px;flex-wrap:wrap;align-items:center}
      #jv-photo-studio button{border:1px solid var(--border,#d9deea);border-radius:9px;padding:10px 13px;background:var(--surface,#f7f8fb);color:inherit;font-weight:600}
      #jv-photo-studio .primary{background:#6555e8;color:#fff;border-color:#6555e8}
      #jv-photo-studio .jvp-photo{display:flex;gap:9px;align-items:center;padding:8px;border:1px solid var(--border,#e5e7eb);border-radius:10px;margin-top:8px}
      #jv-photo-studio .jvp-photo img{width:54px;height:54px;object-fit:cover;border-radius:7px}#jv-photo-studio .jvp-photo span{font-size:12px;flex:1;overflow-wrap:anywhere}
      #jv-photo-studio .jvp-status{font-size:13px;min-height:22px;margin-top:10px}
      @media(max-width:760px){#jv-photo-studio .jvp-grid{grid-template-columns:1fr}#jv-photo-studio{padding:12px}}
      </style>
      <div style="margin-bottom:16px"><span style="font-size:11px;letter-spacing:.12em;color:#7667e8;font-weight:800">JUSTEVIVO CREATIVE STUDIO</span><h2>Montage photo & effets</h2><p>Transformez vos photos en une vidéo animée : ordre des images, transitions, filtres et texte personnalisé.</p></div>
      <div class="jvp-grid">
        <section class="jvp-card"><canvas id="jvp-canvas" width="1280" height="720"></canvas><div class="jvp-row" style="margin-top:12px"><button id="jvp-preview">▶ Prévisualiser</button><button id="jvp-stop">Ⅱ Arrêter</button><button id="jvp-export" class="primary">↓ Exporter la vidéo</button></div><div id="jvp-status" class="jvp-status" role="status" aria-live="polite">Ajoutez au moins deux photos pour commencer.</div><p>Export vidéo WebM. La disponibilité dépend du navigateur et de l'appareil. Le fichier original de vos photos reste intact.</p></section>
        <section class="jvp-card"><h3>1. Vos photos</h3><label>Importer plusieurs photos</label><input id="jvp-files" type="file" accept="image/*" multiple><div id="jvp-list"></div>
          <h3 style="margin-top:20px">2. Style du montage</h3>
          <label>Format</label><select id="jvp-ratio"><option value="16:9">Paysage · 16:9</option><option value="9:16">Vertical · 9:16</option><option value="1:1">Carré · 1:1</option></select>
          <label>Durée par photo</label><select id="jvp-duration"><option value="2">2 secondes</option><option value="3" selected>3 secondes</option><option value="4">4 secondes</option><option value="5">5 secondes</option><option value="6">6 secondes</option></select>
          <label>Transition</label><select id="jvp-transition"><option value="fade">Fondu enchaîné</option><option value="slide">Glissement</option><option value="zoom">Zoom progressif</option><option value="cut">Coupe directe</option></select>
          <label>Filtre visuel</label><select id="jvp-filter"><option value="none">Original</option><option value="warm">Chaleureux</option><option value="mono">Noir & blanc</option><option value="vivid">Vif</option><option value="soft">Doux</option><option value="cinema">Cinéma</option></select>
          <label>Texte sur la vidéo (facultatif)</label><input id="jvp-text" maxlength="100" placeholder="Votre titre ou votre message">
          <label>Position du texte</label><select id="jvp-text-position"><option value="bottom">Bas</option><option value="center">Centre</option><option value="top">Haut</option></select>
          <label>Couleur du texte</label><input id="jvp-text-color" type="color" value="#ffffff">
          <label>Musique (facultatif)</label><input id="jvp-music" type="file" accept="audio/*">
        </section>
      </div>`;
    workspace.appendChild(page);
    const $=id=>page.querySelector("#"+id),canvas=$("jvp-canvas"),ctx=canvas.getContext("2d");
    let photos=[],raf=0,recorder=null,parts=[],musicUrl=null,audio=null;
    const status=t=>$("jvp-status").textContent=t;
    const filters={none:"none",warm:"sepia(.25) saturate(1.2)",mono:"grayscale(1)",vivid:"saturate(1.5) contrast(1.08)",soft:"brightness(1.08) saturate(.82)",cinema:"contrast(1.15) saturate(.82) sepia(.12)"};
    const dims=()=>{const v=$("jvp-ratio").value;canvas.width=v==="9:16"?720:v==="1:1"?900:1280;canvas.height=v==="9:16"?1280:v==="1:1"?900:720;};
    const draw=(index,progress=0,transition="cut")=>{
      const p=photos[index];if(!p)return;
      const w=canvas.width,h=canvas.height;ctx.fillStyle="#111";ctx.fillRect(0,0,w,h);
      const drawOne=(photo,alpha,scale=1,offset=0)=>{
        const iw=photo.img.naturalWidth,ih=photo.img.naturalHeight,cover=Math.max(w/iw,h/ih)*scale,dw=iw*cover,dh=ih*cover;
        ctx.save();ctx.globalAlpha=alpha;ctx.filter=filters[$("jvp-filter").value]||"none";
        ctx.drawImage(photo.img,(w-dw)/2+offset,(h-dh)/2,dw,dh);ctx.restore();
      };
      const zoom=1+Math.min(.06,progress*.06);
      if(transition==="fade"&&progress>.78&&index<photos.length-1){drawOne(p,1,zoom);drawOne(photos[index+1],(progress-.78)/.22,1);}
      else if(transition==="slide"&&progress>.78&&index<photos.length-1){drawOne(p,1,1,-w*((progress-.78)/.22));drawOne(photos[index+1],1,1,w*(1-(progress-.78)/.22));}
      else drawOne(p,1,zoom);
      const txt=$("jvp-text").value.trim();if(txt){const size=Math.round(w*.045);ctx.save();ctx.font="700 "+size+"px Arial";ctx.textAlign="center";ctx.textBaseline="middle";const y=$("jvp-text-position").value==="top"?h*.13:$("jvp-text-position").value==="center"?h*.5:h*.86;ctx.shadowColor="rgba(0,0,0,.8)";ctx.shadowBlur=12;ctx.fillStyle=$("jvp-text-color").value;ctx.fillText(txt,w*.5,y,w*.88);ctx.restore();}
    };
    const render=async()=>{
      if(!photos.length){status("Importez des photos avant la prévisualisation.");return;}
      const each=Number($("jvp-duration").value)*1000,total=each*photos.length,start=performance.now();
      cancelAnimationFrame(raf);
      const tick=now=>{const elapsed=(now-start)%total,index=Math.floor(elapsed/each),progress=(elapsed%each)/each;draw(index,progress,$("jvp-transition").value);raf=requestAnimationFrame(tick);};
      raf=requestAnimationFrame(tick);status("Prévisualisation en cours. Durée totale : "+(total/1000)+" secondes.");
    };
    $("jvp-files").addEventListener("change",async e=>{
      const files=[...e.target.files].filter(f=>f.type.startsWith("image/"));
      for(const file of files){const url=URL.createObjectURL(file),img=new Image();img.src=url;await img.decode();photos.push({file,url,img});}
      $("jvp-list").replaceChildren();
      photos.forEach((p,i)=>{const row=document.createElement("div");row.className="jvp-photo";const img=document.createElement("img");img.src=p.url;const name=document.createElement("span");name.textContent=(i+1)+". "+p.file.name;const up=document.createElement("button");up.textContent="↑";up.disabled=i===0;up.onclick=()=>move(i,-1);const down=document.createElement("button");down.textContent="↓";down.disabled=i===photos.length-1;down.onclick=()=>move(i,1);const del=document.createElement("button");del.textContent="×";del.setAttribute("aria-label","Supprimer "+p.file.name);del.onclick=()=>{URL.revokeObjectURL(p.url);photos.splice(i,1);const list=$("jvp-list");list.replaceChildren();photos.forEach((q,z)=>{const r=document.createElement("div");r.className="jvp-photo";const im=document.createElement("img");im.src=q.url;const n=document.createElement("span");n.textContent=(z+1)+". "+q.file.name;const u=document.createElement("button");u.textContent="↑";u.disabled=z===0;u.onclick=()=>move(z,-1);const d=document.createElement("button");d.textContent="↓";d.disabled=z===photos.length-1;d.onclick=()=>move(z,1);const x=document.createElement("button");x.textContent="×";x.onclick=()=>{URL.revokeObjectURL(q.url);photos.splice(z,1);if(photos[0])draw(0);list.replaceChildren();};r.append(im,n,u,d,x);list.append(r);});if(photos[0])draw(0);status(photos.length+" photo(s) dans le montage.");};row.append(img,name,up,down,del);$("jvp-list").append(row);});
      dims();if(photos[0])draw(0);status(photos.length+" photo(s) prêtes. Vous pouvez changer leur ordre.");
    });
    function refresh(){const dt=new DataTransfer();photos.forEach(p=>dt.items.add(p.file));$("jvp-files").files=dt.files;$("jvp-files").dispatchEvent(new Event("change",{bubbles:true}));}
    function move(i,delta){const j=i+delta;if(j<0||j>=photos.length)return;[photos[i],photos[j]]=[photos[j],photos[i]];const list=$("jvp-list");list.replaceChildren();photos.forEach((p,k)=>{const row=document.createElement("div");row.className="jvp-photo";const im=document.createElement("img");im.src=p.url;const n=document.createElement("span");n.textContent=(k+1)+". "+p.file.name;const u=document.createElement("button");u.textContent="↑";u.disabled=k===0;u.onclick=()=>move(k,-1);const d=document.createElement("button");d.textContent="↓";d.disabled=k===photos.length-1;d.onclick=()=>move(k,1);const x=document.createElement("button");x.textContent="×";x.onclick=()=>{URL.revokeObjectURL(p.url);photos.splice(k,1);list.replaceChildren();photos.forEach((q,z)=>{const r=document.createElement("div");r.className="jvp-photo";r.textContent=(z+1)+". "+q.file.name;list.append(r);});if(photos[0])draw(0);};row.append(im,n,u,d,x);list.append(row);});draw(0);}
    $("jvp-ratio").addEventListener("change",()=>{dims();if(photos[0])draw(0);});
    ["jvp-filter","jvp-text","jvp-text-position","jvp-text-color"].forEach(id=>$(id).addEventListener("input",()=>{if(photos[0])draw(0);}));
    $("jvp-preview").onclick=render;$("jvp-stop").onclick=()=>{cancelAnimationFrame(raf);if(photos[0])draw(0);status("Prévisualisation arrêtée.");};
    $("jvp-music").addEventListener("change",e=>{if(musicUrl)URL.revokeObjectURL(musicUrl);const f=e.target.files[0];musicUrl=f?URL.createObjectURL(f):null;});
    $("jvp-export").onclick=async()=>{
      if(photos.length<1){status("Ajoutez au moins une photo.");return;}
      if(!canvas.captureStream||!window.MediaRecorder){status("L’export vidéo n’est pas pris en charge par ce navigateur. Essayez Chrome récent.");return;}
      cancelAnimationFrame(raf);const each=Number($("jvp-duration").value)*1000,total=each*photos.length,stream=canvas.captureStream(30);
      let mime=["video/webm;codecs=vp9","video/webm;codecs=vp8","video/webm"].find(t=>MediaRecorder.isTypeSupported(t));if(!mime){status("Format d’export non pris en charge sur cet appareil.");return;}
      let audioStream=null;
      if(musicUrl){try{audio=new Audio(musicUrl);audio.loop=true;audio.volume=.8;const ac=new AudioContext(),source=ac.createMediaElementSource(audio),dest=ac.createMediaStreamDestination();source.connect(dest);audioStream=dest.stream;await audio.play();audioStream.getAudioTracks().forEach(t=>stream.addTrack(t));}catch(_){status("La musique n’a pas pu être intégrée. Export sans musique.");}}
      parts=[];recorder=new MediaRecorder(stream,{mimeType:mime,videoBitsPerSecond:5000000});recorder.ondataavailable=e=>{if(e.data.size)parts.push(e.data);};recorder.onstop=()=>{const blob=new Blob(parts,{type:mime}),url=URL.createObjectURL(blob),a=document.createElement("a");a.href=url;a.download="justevivo-montage-photo.webm";a.click();setTimeout(()=>URL.revokeObjectURL(url),60000);if(audio){audio.pause();audio=null;}status("Montage exporté. Vous pouvez importer le fichier WebM dans l’éditeur principal.");};
      const start=performance.now();let frame=0;const tick=now=>{const elapsed=now-start;if(elapsed>=total){recorder.stop();return;}const index=Math.min(photos.length-1,Math.floor(elapsed/each)),progress=(elapsed%each)/each;draw(index,progress,$("jvp-transition").value);frame=requestAnimationFrame(tick);};draw(0);recorder.start(250);status("Export en cours… gardez cette page ouverte jusqu’au téléchargement.");frame=requestAnimationFrame(tick);
    };
    nav.addEventListener("click",()=>{document.querySelectorAll(".workspace-page").forEach(p=>p.hidden=true);const parts=[workspace.querySelector(".workspace-head"),workspace.querySelector(".upload-zone"),workspace.querySelector(".editor-grid"),workspace.querySelector(".demo-warning")].filter(Boolean);parts.forEach(p=>p.hidden=true);page.hidden=false;sidebar.querySelectorAll(".side-link").forEach(x=>x.classList.toggle("active",x===nav));const back=document.getElementById("jv-workspace-back");if(back)back.style.display="inline-flex";page.scrollIntoView({behavior:"smooth",block:"start"});});
  };
  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",boot);else boot();
})();