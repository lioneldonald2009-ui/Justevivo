/* JUSTEVIVO Photo Studio — montage photo, effets et export vidéo WebM */
(() => {
  "use strict";
  const boot = () => {
    const workspace=document.querySelector(".workspace"), sidebar=document.querySelector(".sidebar");
    if(!workspace||!sidebar||document.getElementById("jv-photo-studio")) return;
    const nav=document.createElement("button");
    nav.type="button";nav.className="side-link jv-extra-nav";nav.dataset.page="photo-studio";
    nav.innerHTML='<span aria-hidden="true">▧</span><span>Montage photo</span>';
    const mediaLink=sidebar.querySelector('.side-link[data-page="media"]');if(mediaLink)mediaLink.insertAdjacentElement("afterend",nav);else sidebar.appendChild(nav);
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
      #jv-photo-studio .jvp-photo img,#jv-photo-studio .jvp-photo video{width:54px;height:54px;object-fit:cover;border-radius:7px}#jv-photo-studio .jvp-photo span{font-size:12px;flex:1;overflow-wrap:anywhere}
      #jv-photo-studio .jvp-status{font-size:13px;min-height:22px;margin-top:10px}
      #jv-photo-studio .jvp-template-library{background:var(--card,#fff);border:1px solid var(--border,#e5e7eb);border-radius:18px;padding:16px;margin-bottom:16px}
      #jv-photo-studio .jvp-template-head{display:flex;justify-content:space-between;align-items:center;gap:12px;flex-wrap:wrap}
      #jv-photo-studio .jvp-template-head h3{margin:2px 0 4px}
      #jv-photo-studio .jvp-template-head input{max-width:290px}
      #jv-photo-studio .jvp-template-categories{display:flex;gap:7px;overflow-x:auto;padding:12px 0;scrollbar-width:thin}
      #jv-photo-studio .jvp-template-categories button{white-space:nowrap;border-radius:999px;padding:7px 12px;font-size:12px}
      #jv-photo-studio .jvp-template-categories button.active{background:#6555e8;color:white;border-color:#6555e8}
      #jv-photo-studio .jvp-template-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:12px}
      #jv-photo-studio .jvp-template-card{border:1px solid var(--border,#e5e7eb);border-radius:13px;overflow:hidden;min-width:0;background:var(--surface,#fff)}
      #jv-photo-studio .jvp-template-cover{height:118px;position:relative;overflow:hidden;display:flex;align-items:center;justify-content:center;color:white}
      #jv-photo-studio .jvp-template-cover:before,#jv-photo-studio .jvp-template-cover:after{content:"";position:absolute;border:1px solid rgba(255,255,255,.35);border-radius:50%;width:125px;height:125px;animation:jvp-float 5s ease-in-out infinite}
      #jv-photo-studio .jvp-template-cover:after{width:75px;height:75px;animation-delay:-2s}
      #jv-photo-studio .jvp-template-emoji{font-size:42px;z-index:1;filter:drop-shadow(0 5px 8px rgba(0,0,0,.2));animation:jvp-bob 2.5s ease-in-out infinite}
      #jv-photo-studio .jvp-template-duration{position:absolute;right:8px;bottom:7px;background:rgba(0,0,0,.42);padding:3px 7px;border-radius:6px;font-size:10px;z-index:2}
      #jv-photo-studio .jvp-template-info{padding:10px}
      #jv-photo-studio .jvp-template-info strong{font-size:12px;display:block}
      #jv-photo-studio .jvp-template-info p{font-size:10px;line-height:1.35;margin:4px 0 9px;min-height:27px}
      #jv-photo-studio .jvp-template-info button{width:100%;padding:8px 6px;font-size:11px;background:#6555e8;color:#fff;border-color:#6555e8}
      #jv-photo-studio .jvp-template-card.active{border-color:#6555e8;box-shadow:0 0 0 2px rgba(101,85,232,.15)}
      #jv-photo-studio .jvp-template-empty{padding:18px;text-align:center;color:var(--muted,#697386);grid-column:1/-1}
      #jv-photo-studio .jvp-template-status{font-size:12px;color:var(--muted,#697386);margin-top:10px}
      @keyframes jvp-float{0%,100%{transform:translate(-12px,8px) scale(.92)}50%{transform:translate(14px,-9px) scale(1.08)}}
      @keyframes jvp-bob{0%,100%{transform:translateY(2px) scale(.98)}50%{transform:translateY(-7px) scale(1.08)}}
      @media(max-width:900px){#jv-photo-studio .jvp-template-grid{grid-template-columns:repeat(3,minmax(0,1fr))}}
      @media(max-width:620px){#jv-photo-studio .jvp-template-grid{grid-template-columns:repeat(2,minmax(0,1fr))}#jv-photo-studio .jvp-template-cover{height:100px}#jv-photo-studio .jvp-template-head input{max-width:none}}
      @media(max-width:760px){#jv-photo-studio .jvp-grid{grid-template-columns:1fr}#jv-photo-studio{padding:12px}}
      </style>
      <div style="margin-bottom:16px"><span style="font-size:11px;letter-spacing:.12em;color:#7667e8;font-weight:800">JUSTEVIVO CREATIVE STUDIO</span><h2>Montage photo & effets</h2><p>Transformez vos photos en une vidéo animée : ordre des images, transitions, filtres et texte personnalisé.</p></div>
      <section class="jvp-template-library">
        <div class="jvp-template-head"><div><span style="font-size:10px;letter-spacing:.1em;color:#7667e8;font-weight:800">INSPIRATION & CRÉATION RAPIDE</span><h3>Modèles vidéo prêts à utiliser</h3><p>Choisissez un modèle animé, ajoutez vos médias et laissez JUSTEVIVO composer votre vidéo.</p></div><input id="jvp-template-search" type="search" placeholder="Rechercher : anniversaire, voyage…"></div>
        <div id="jvp-template-categories" class="jvp-template-categories" aria-label="Catégories de modèles"></div>
        <div id="jvp-template-grid" class="jvp-template-grid"></div>
        <div id="jvp-template-status" class="jvp-template-status" aria-live="polite">Sélectionnez « Utiliser ce modèle » pour préparer votre montage.</div>
      </section>
      <div class="jvp-grid">
        <section class="jvp-card"><canvas id="jvp-canvas" width="1280" height="720"></canvas><div class="jvp-row" style="margin-top:12px"><button id="jvp-preview">▶ Prévisualiser</button><button id="jvp-stop">Ⅱ Arrêter</button><button id="jvp-export" class="primary">↓ Exporter la vidéo</button></div><div id="jvp-status" class="jvp-status" role="status" aria-live="polite">Ajoutez au moins deux photos pour commencer.</div><p>Export vidéo WebM. La disponibilité dépend du navigateur et de l'appareil. Le fichier original de vos photos reste intact.</p></section>
        <section class="jvp-card"><h3>1. Vos photos</h3><label>Importer photos et vidéos (sélection multiple)</label><input id="jvp-files" type="file" accept="image/*,video/*" multiple><div id="jvp-list"></div>
          <h3 style="margin-top:20px">Personnaliser le modèle choisi</h3>
          <label>Format</label><select id="jvp-ratio"><option value="16:9">Paysage · 16:9</option><option value="9:16">Vertical · 9:16</option><option value="1:1">Carré · 1:1</option></select>
          <label>Durée par photo</label><select id="jvp-duration"><option value="2">2 secondes</option><option value="3" selected>3 secondes</option><option value="4">4 secondes</option><option value="5">5 secondes</option><option value="6">6 secondes</option></select>
          <label>Transition</label><select id="jvp-transition"><option value="fade">Fondu enchaîné</option><option value="slide">Glissement</option><option value="zoom">Zoom progressif</option><option value="cut">Coupe directe</option></select>
          <label>Filtre visuel</label><select id="jvp-filter"><option value="none">Original</option><option value="warm">Chaleureux</option><option value="mono">Noir & blanc</option><option value="vivid">Vif</option><option value="soft">Doux</option><option value="cinema">Cinéma</option><option value="vintage">Vintage</option><option value="cool">Froid</option></select>
          <label>Effet de mouvement</label><select id="jvp-effect"><option value="none">Aucun</option><option value="kenburns">Zoom lent (Ken Burns)</option><option value="zoom">Zoom avant</option><option value="pulse">Zoom doux</option></select><label>Intensité de l’effet</label><input id="jvp-intensity" type="range" min="1" max="15" value="6"><label>Texte sur la vidéo (facultatif)</label><input id="jvp-text" maxlength="100" placeholder="Votre titre ou votre message">
          <label>Position du texte</label><select id="jvp-text-position"><option value="bottom">Bas</option><option value="center">Centre</option><option value="top">Haut</option></select>
          <label>Couleur du texte</label><input id="jvp-text-color" type="color" value="#ffffff">
          <h3 style="margin-top:20px">3. Bibliothèque musicale</h3>
          <p>Recherchez une musique libre pour vos montages. Les licences et crédits sont affichés avant l’ajout.</p>
          <label for="jvp-music-search">Rechercher une musique</label>
          <div class="jvp-row"><input id="jvp-music-search" type="search" placeholder="Ex. afrobeat, piano, ambiance..." style="flex:1;min-width:0"><button id="jvp-music-search-btn" type="button" class="primary">Rechercher</button></div>
          <div id="jvp-music-results" aria-live="polite"></div>
          <div id="jvp-music-selected" class="jvp-status">Aucune musique sélectionnée.</div>
          <audio id="jvp-music-preview" controls style="width:100%;margin-top:8px;display:none"></audio>
          <label>Ou importer votre propre musique</label><input id="jvp-music" type="file" accept="audio/*">
        </section>
      </div>`;
    workspace.appendChild(page);
    const $=id=>page.querySelector("#"+id),canvas=$("jvp-canvas"),ctx=canvas.getContext("2d");
    let photos=[],raf=0,recorder=null,parts=[],musicUrl=null,audio=null,audioContext=null,selectedTrack=null,musicCredit="",activeVideoIndex=-1,activeTemplate=null;
    const status=t=>$("jvp-status").textContent=t;
    const filters={none:"none",warm:"sepia(.25) saturate(1.2)",mono:"grayscale(1)",vivid:"saturate(1.5) contrast(1.08)",soft:"brightness(1.08) saturate(.82)",cinema:"contrast(1.15) saturate(.82) sepia(.12)",vintage:"sepia(.38) contrast(.94) saturate(.8)",cool:"hue-rotate(12deg) saturate(.9) contrast(1.04)"};
    const dims=()=>{const v=$("jvp-ratio").value;canvas.width=v==="9:16"?720:v==="1:1"?900:1280;canvas.height=v==="9:16"?1280:v==="1:1"?900:720;};
    const draw=(index,progress=0,transition="cut")=>{
      const p=photos[index];if(!p)return;
      const w=canvas.width,h=canvas.height;ctx.fillStyle="#111";ctx.fillRect(0,0,w,h);
      const drawOne=(photo,alpha,scale=1,offset=0)=>{
        const source=photo.kind==="video"?photo.video:photo.img;const iw=photo.kind==="video"?(source.videoWidth||1):source.naturalWidth,ih=photo.kind==="video"?(source.videoHeight||1):source.naturalHeight,cover=Math.max(w/iw,h/ih)*scale,dw=iw*cover,dh=ih*cover;
        ctx.save();ctx.globalAlpha=alpha;ctx.filter=filters[$("jvp-filter").value]||"none";
        ctx.drawImage(source,(w-dw)/2+offset,(h-dh)/2,dw,dh);ctx.restore();
      };
      const intensity=Number($("jvp-intensity")?.value||6)/100;const effect=$("jvp-effect")?.value||"kenburns";const zoom=1+(effect==="none"?0:Math.min(.15,intensity*(effect==="zoom"?1.5:effect==="pulse"?.5+Math.sin(progress*Math.PI*2)*.5:progress)));
      const template=activeTemplate||{};
      const drawTile=(photo,x,y,tw,th)=>{
        const source=photo.kind==="video"?photo.video:photo.img,iw=photo.kind==="video"?(source.videoWidth||1):source.naturalWidth,ih=photo.kind==="video"?(source.videoHeight||1):source.naturalHeight,cover=Math.max(tw/iw,th/ih)*1.04,dw=iw*cover,dh=ih*cover;
        ctx.save();ctx.beginPath();ctx.rect(x,y,tw,th);ctx.clip();ctx.filter=filters[$("jvp-filter").value]||"none";ctx.drawImage(source,x+(tw-dw)/2,y+(th-dh)/2,dw,dh);ctx.restore();
      };
      if((template.layout==="trio"||template.layout==="family")&&photos.length){
        const chosen=photos.slice(0,template.layout==="trio"?3:4),gap=Math.max(5,Math.round(w*.008)),count=chosen.length;
        if(template.layout==="trio"){
          const tileW=(w-gap*(count-1))/count;chosen.forEach((item,i)=>drawTile(item,i*(tileW+gap),0,tileW,h));
        }else{
          const cols=2,rows=2,tileW=(w-gap)/2,tileH=(h-gap)/2;
          chosen.forEach((item,i)=>drawTile(item,(i%cols)*(tileW+gap),Math.floor(i/cols)*(tileH+gap),tileW,tileH));
          if(count===1)drawTile(chosen[0],0,0,w,h);
        }
        ctx.save();ctx.strokeStyle="rgba(255,255,255,.9)";ctx.lineWidth=Math.max(3,gap*.65);
        if(template.layout==="trio"){for(let i=1;i<count;i++){const x=i*(w/count);ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,h);ctx.stroke();}}
        else{ctx.beginPath();ctx.moveTo(w/2,0);ctx.lineTo(w/2,h);ctx.moveTo(0,h/2);ctx.lineTo(w,h/2);ctx.stroke();}
        ctx.restore();
      }else if(transition==="fade"&&progress>.78&&index<photos.length-1){drawOne(p,1,zoom);drawOne(photos[index+1],(progress-.78)/.22,1);}
      else if(transition==="slide"&&progress>.78&&index<photos.length-1){drawOne(p,1,1,-w*((progress-.78)/.22));drawOne(photos[index+1],1,1,w*(1-(progress-.78)/.22));}
      else drawOne(p,1,zoom);
      if(template.decoration==="confetti"||template.decoration==="sparkles"||template.decoration==="hearts"||template.decoration==="balloons"){
        ctx.save();ctx.textAlign="center";ctx.textBaseline="middle";
        for(let i=0;i<26;i++){const seed=(i*37%101)/101,x=(seed*.92+.04)*w,y=((progress*1.25+seed*1.7)%1)*h;
          if(template.decoration==="confetti"){ctx.fillStyle=(template.palette||["#ffd166","#ef476f","#06d6a0","#fff"])[i%((template.palette||["#ffd166","#ef476f","#06d6a0","#fff"]).length)];ctx.save();ctx.translate(x,y);ctx.rotate((i+progress*8)*.6);ctx.fillRect(-4,-8,8,16);ctx.restore();}
          else {ctx.font=Math.max(16,Math.round(w*.035))+"px Arial";ctx.fillStyle=template.accent||"#fff";ctx.globalAlpha=.35+.45*Math.abs(Math.sin(progress*6+i));ctx.fillText(template.decoration==="hearts"?"♥":template.decoration==="balloons"?"🎈":"✦",x,y);}
        }ctx.restore();
      }
      const txt=$("jvp-text").value.trim();if(txt){const size=Math.round(w*.045);const anim=template.textAnimation||"fade";let scale=1,alpha=1,offsetY=0;if(anim==="pop")scale=.72+.28*Math.min(1,progress*5);if(anim==="bounce"){scale=.9+.1*Math.abs(Math.sin(progress* Math.PI*3));offsetY=-Math.abs(Math.sin(progress*Math.PI*3))*h*.018;}if(anim==="fade")alpha=Math.min(1,progress*4);if(anim==="slide")offsetY=(1-Math.min(1,progress*4))*h*.12;
        ctx.save();ctx.translate(w*.5,h*.5+offsetY);ctx.scale(scale,scale);ctx.globalAlpha=alpha;ctx.font=(template.textWeight||"700")+" "+size+"px "+(template.font||"Arial");ctx.textAlign="center";ctx.textBaseline="middle";const y=$("jvp-text-position").value==="top"?-h*.37:$("jvp-text-position").value==="center"?0:h*.36;ctx.shadowColor="rgba(0,0,0,.8)";ctx.shadowBlur=12;ctx.fillStyle=template.accent||$("jvp-text-color").value;ctx.fillText(txt,0,y,w*.88);ctx.restore();}
      if(musicCredit){ctx.save();ctx.font=Math.max(12,Math.round(w*.012))+"px Arial";ctx.textAlign="center";ctx.textBaseline="bottom";ctx.fillStyle="rgba(255,255,255,.92)";ctx.shadowColor="#000";ctx.shadowBlur=5;ctx.fillText("Musique : "+musicCredit,w*.5,h-12,w*.94);ctx.restore();}
    };
    const render=async()=>{
      if(!photos.length){status("Importez des photos ou des vidéos avant la prévisualisation.");return;}
      const durations=photos.map(p=>p.kind==="video"?Math.max(.2,(p.trimEnd||p.duration)-(p.trimStart||0))*1000:Number(p.duration||$("jvp-duration").value)*1000),total=durations.reduce((a,b)=>a+b,0),start=performance.now();activeVideoIndex=-1;
      cancelAnimationFrame(raf);
      const tick=now=>{const elapsed=(now-start)%total;let local=elapsed,index=0;while(index<durations.length-1&&local>=durations[index]){local-=durations[index];index++;}const item=photos[index];if(item.kind==="video"){if(activeVideoIndex!==index){photos.forEach((p,k)=>{if(p.kind==="video"){if(k===index){p.video.currentTime=p.trimStart||0;p.video.play().catch(()=>{});}else p.video.pause();}});activeVideoIndex=index;}}else{photos.forEach(p=>{if(p.kind==="video")p.video.pause();});activeVideoIndex=-1;}draw(index,local/durations[index],$("jvp-transition").value);raf=requestAnimationFrame(tick);};
      raf=requestAnimationFrame(tick);status("Prévisualisation en cours. Durée totale : "+(total/1000)+" secondes.");
    };
    $("jvp-files").addEventListener("change",async e=>{
      const files=[...e.target.files].filter(f=>f.type.startsWith("image/")||f.type.startsWith("video/"));
      for(const file of files){const url=URL.createObjectURL(file);if(file.type.startsWith("video/")){const video=document.createElement("video");video.preload="auto";video.playsInline=true;video.src=url;await new Promise((resolve,reject)=>{video.onloadeddata=resolve;video.onerror=()=>reject(new Error("Impossible de lire "+file.name));});const duration=Number.isFinite(video.duration)&&video.duration>0?video.duration:5;photos.push({file,url,video,kind:"video",duration,trimStart:0,trimEnd:duration});}else{const img=new Image();img.src=url;await img.decode();photos.push({file,url,img,kind:"image",duration:Number($("jvp-duration").value)});}}
      $("jvp-list").replaceChildren();
      photos.forEach((p,i)=>{const row=document.createElement("div");row.className="jvp-photo";const img=p.kind==="video"?document.createElement("video"):document.createElement("img");img.className="jvp-thumb";if(p.kind==="video"){img.muted=true;img.preload="metadata";img.src=p.url;}else img.src=p.url;const name=document.createElement("span");name.textContent=(i+1)+". "+p.file.name;const up=document.createElement("button");up.textContent="↑";up.disabled=i===0;up.onclick=()=>move(i,-1);const down=document.createElement("button");down.textContent="↓";down.disabled=i===photos.length-1;down.onclick=()=>move(i,1);const del=document.createElement("button");del.textContent="×";del.setAttribute("aria-label","Supprimer "+p.file.name);del.onclick=()=>{URL.revokeObjectURL(p.url);photos.splice(i,1);const list=$("jvp-list");list.replaceChildren();photos.forEach((q,z)=>{const r=document.createElement("div");r.className="jvp-photo";const im=q.kind==="video"?document.createElement("video"):document.createElement("img");im.className="jvp-thumb";if(q.kind==="video"){im.muted=true;im.preload="metadata";im.src=q.url;}else im.src=q.url;const n=document.createElement("span");n.textContent=(z+1)+". "+q.file.name;const u=document.createElement("button");u.textContent="↑";u.disabled=z===0;u.onclick=()=>move(z,-1);const d=document.createElement("button");d.textContent="↓";d.disabled=z===photos.length-1;d.onclick=()=>move(z,1);const x=document.createElement("button");x.textContent="×";x.onclick=()=>{URL.revokeObjectURL(q.url);photos.splice(z,1);if(photos[0])draw(0);list.replaceChildren();};r.append(im,n,u,d,x);list.append(r);});if(photos[0])draw(0);status(photos.length+" photo(s) dans le montage.");};row.append(img,name,up,down,del);$("jvp-list").append(row);});
      dims();if(photos[0])draw(0);status(photos.length+" photo(s) prêtes. Vous pouvez changer leur ordre.");
    });
    function refresh(){const dt=new DataTransfer();photos.forEach(p=>dt.items.add(p.file));$("jvp-files").files=dt.files;$("jvp-files").dispatchEvent(new Event("change",{bubbles:true}));}
    function move(i,delta){const j=i+delta;if(j<0||j>=photos.length)return;[photos[i],photos[j]]=[photos[j],photos[i]];const list=$("jvp-list");list.replaceChildren();photos.forEach((p,k)=>{const row=document.createElement("div");row.className="jvp-photo";const im=p.kind==="video"?document.createElement("video"):document.createElement("img");im.className="jvp-thumb";if(p.kind==="video"){im.muted=true;im.preload="metadata";im.src=p.url;}else im.src=p.url;const n=document.createElement("span");n.textContent=(k+1)+". "+p.file.name;const u=document.createElement("button");u.textContent="↑";u.disabled=k===0;u.onclick=()=>move(k,-1);const d=document.createElement("button");d.textContent="↓";d.disabled=k===photos.length-1;d.onclick=()=>move(k,1);const x=document.createElement("button");x.textContent="×";x.onclick=()=>{URL.revokeObjectURL(p.url);photos.splice(k,1);list.replaceChildren();photos.forEach((q,z)=>{const r=document.createElement("div");r.className="jvp-photo";r.textContent=(z+1)+". "+q.file.name;list.append(r);});if(photos[0])draw(0);};row.append(im,n,u,d,x);list.append(row);});draw(0);}
    $("jvp-ratio").addEventListener("change",()=>{dims();if(photos[0])draw(0);});
    $("jvp-duration").addEventListener("change",()=>{photos.forEach(item=>{if(item.kind==="image")item.duration=Number($("jvp-duration").value);});});
    ["jvp-filter","jvp-effect","jvp-intensity","jvp-text","jvp-text-position","jvp-text-color"].forEach(id=>$(id).addEventListener("input",()=>{if(photos[0])draw(0);}));
    $("jvp-preview").onclick=render;$("jvp-stop").onclick=()=>{cancelAnimationFrame(raf);photos.forEach(p=>{if(p.kind==="video")p.video.pause();});activeVideoIndex=-1;if(photos[0])draw(0);status("Prévisualisation arrêtée.");};
    $("jvp-music").addEventListener("change",e=>{if(musicUrl)URL.revokeObjectURL(musicUrl);const f=e.target.files[0];musicUrl=f?URL.createObjectURL(f):null;selectedTrack=null;musicCredit=f?"Fichier importé par l’utilisateur":"";$("jvp-music-selected").textContent=f?"Musique personnelle : "+f.name:"Aucune musique sélectionnée.";});
    const musicResults=$("jvp-music-results"),musicPreview=$("jvp-music-preview");
    $("jvp-music-search-btn").addEventListener("click",async()=>{
      const q=$("jvp-music-search").value.trim();if(q.length<2){status("Saisissez au moins deux caractères pour rechercher une musique.");return;}
      musicResults.textContent="Recherche de musiques libres en cours…";
      try{
        const response=await window.fetch(API_URL+"/api/music/search?q="+encodeURIComponent(q));
        const data=await response.json();if(!response.ok)throw new Error(data.error||"Recherche impossible.");
        musicResults.replaceChildren();
        if(!data.tracks||!data.tracks.length){musicResults.textContent="Aucun résultat avec une licence compatible. Essayez un autre terme.";return;}
        data.tracks.forEach(track=>{
          const card=document.createElement("div");card.className="jvp-photo";card.style.alignItems="flex-start";
          const info=document.createElement("span");info.style.whiteSpace="normal";info.innerHTML="";
          const title=document.createElement("strong");title.textContent=track.name;
          const meta=document.createElement("small");meta.textContent=" — "+track.artist+" · "+(track.license?.[0]?.name||"Licence à vérifier");
          const source=document.createElement("a");source.href=track.sourceUrl;source.target="_blank";source.rel="noopener noreferrer";source.textContent="Voir la licence et la source";source.style.display="block";source.style.fontSize="11px";
          info.append(title,meta,source);
          const preview=document.createElement("button");preview.type="button";preview.textContent="▶";preview.title="Écouter un aperçu";preview.onclick=()=>{musicPreview.src=track.previewUrl;musicPreview.style.display="block";musicPreview.play().catch(()=>status("Lecture de l’aperçu impossible sur cet appareil."));};
          const add=document.createElement("button");add.type="button";add.className="primary";add.textContent="Ajouter";add.onclick=async()=>{
            add.disabled=true;add.textContent="Téléchargement…";
            try{
              const dl=await window.fetch(API_URL+"/api/music/download/"+encodeURIComponent(track.id));
              if(!dl.ok){const err=await dl.json().catch(()=>({}));throw new Error(err.error||"Téléchargement impossible.");}
              const blob=await dl.blob();if(musicUrl)URL.revokeObjectURL(musicUrl);musicUrl=URL.createObjectURL(blob);
              selectedTrack=track;musicCredit=track.name+" — "+track.artist+" ("+(track.license?.[0]?.name||"licence libre")+")";
              $("jvp-music-selected").textContent="Ajoutée : "+musicCredit+". Crédit intégré au montage; consultez la source pour les conditions complètes.";
              $("jvp-music").value="";status("Musique ajoutée au montage photo.");add.textContent="Ajoutée";
            }catch(error){status(error.message);add.disabled=false;add.textContent="Réessayer";}
          };
          card.append(info,preview,add);musicResults.append(card);
        });
        status(data.notice||"Musiques trouvées. Vérifiez les conditions de chaque piste.");
      }catch(error){musicResults.textContent=error.message;status("La recherche musicale a échoué.");}
    });
    $("jvp-export").onclick=async()=>{
      if(photos.length<1){status("Ajoutez au moins une photo ou une vidéo.");return;}
      if(!canvas.captureStream||!window.MediaRecorder){status("L’export vidéo n’est pas pris en charge par ce navigateur. Essayez Chrome récent.");return;}
      cancelAnimationFrame(raf);const durations=photos.map(p=>p.kind==="video"?Math.max(.2,(p.trimEnd||p.duration)-(p.trimStart||0))*1000:Number(p.duration||$("jvp-duration").value)*1000),total=durations.reduce((a,b)=>a+b,0),stream=canvas.captureStream(30);
      let mime=["video/webm;codecs=vp9","video/webm;codecs=vp8","video/webm"].find(t=>MediaRecorder.isTypeSupported(t));if(!mime){status("Format d’export non pris en charge sur cet appareil.");return;}
      let audioStream=null;photos.filter(p=>p.kind==="video").forEach(p=>{try{const capture=p.video.captureStream?p.video.captureStream():null;if(capture)capture.getAudioTracks().forEach(track=>stream.addTrack(track));}catch(_){}});
      if(musicUrl){try{audio=new Audio(musicUrl);audio.loop=true;audio.volume=.8;audioContext=new (window.AudioContext||window.webkitAudioContext)();if(audioContext.state==="suspended")await audioContext.resume();const source=audioContext.createMediaElementSource(audio),dest=audioContext.createMediaStreamDestination();source.connect(dest);audioStream=dest.stream;await audio.play();audioStream.getAudioTracks().forEach(t=>stream.addTrack(t));}catch(_){status("La musique n’a pas pu être intégrée. Export sans musique.");}}
      parts=[];recorder=new MediaRecorder(stream,{mimeType:mime,videoBitsPerSecond:5000000});recorder.ondataavailable=e=>{if(e.data.size)parts.push(e.data);};recorder.onstop=()=>{const blob=new Blob(parts,{type:mime}),url=URL.createObjectURL(blob),a=document.createElement("a");a.href=url;a.download="justevivo-montage-photo.webm";a.click();setTimeout(()=>URL.revokeObjectURL(url),60000);photos.forEach(p=>{if(p.kind==="video")p.video.pause();});if(audio){audio.pause();audio.src="";audio=null;}if(audioContext){audioContext.close().catch(()=>{});audioContext=null;}status("Montage exporté. Vous pouvez importer le fichier WebM dans l’éditeur principal.");};
      const start=performance.now();let frame=0;activeVideoIndex=-1;const tick=now=>{const elapsed=now-start;if(elapsed>=total){recorder.stop();return;}let local=elapsed,index=0;while(index<durations.length-1&&local>=durations[index]){local-=durations[index];index++;}const item=photos[index];if(item.kind==="video"){if(activeVideoIndex!==index){photos.forEach((p,k)=>{if(p.kind==="video"){if(k===index){p.video.currentTime=p.trimStart||0;p.video.play().catch(()=>{});}else p.video.pause();}});activeVideoIndex=index;}}else{photos.forEach(p=>{if(p.kind==="video")p.video.pause();});activeVideoIndex=-1;}draw(index,local/durations[index],$("jvp-transition").value);frame=requestAnimationFrame(tick);};draw(0);recorder.start(250);status("Export en cours… gardez cette page ouverte jusqu’au téléchargement.");frame=requestAnimationFrame(tick);
    };
    const templateCatalog=[
      {id:"birthday-party",name:"Joyeux anniversaire",category:"Anniversaire",emoji:"🎂",desc:"Confettis, texte animé et ambiance festive",duration:"3",ratio:"9:16",transition:"zoom",filter:"vivid",effect:"pulse",intensity:"9",title:"Joyeux anniversaire !",position:"center",decoration:"confetti",textAnimation:"bounce",accent:"#ffe08a",palette:["#ff5d8f","#ffd166","#06d6a0","#ffffff"],cover:"linear-gradient(135deg,#5b247a,#e64c7b,#ffb36b)"},
      {id:"birthday-elegant",name:"Anniversaire élégant",category:"Anniversaire",emoji:"🥂",desc:"Or, lumière douce et typographie raffinée",duration:"4",ratio:"9:16",transition:"fade",filter:"warm",effect:"kenburns",intensity:"5",title:"Une journée inoubliable",position:"center",decoration:"sparkles",textAnimation:"fade",font:"Georgia",accent:"#ffe2a8",cover:"linear-gradient(135deg,#1d2337,#82633d,#e8c98c)"},
      {id:"birthday-kids",name:"Anniversaire enfant",category:"Anniversaire",emoji:"🎈",desc:"Ballons, couleurs joyeuses et animation rebond",duration:"2",ratio:"9:16",transition:"slide",filter:"vivid",effect:"zoom",intensity:"10",title:"C'est ta journée !",position:"center",decoration:"balloons",textAnimation:"bounce",accent:"#fff4a8",cover:"linear-gradient(135deg,#00a6a6,#65c7f7,#f6a6d7)"},
      {id:"wedding",name:"Notre mariage",category:"Mariage",emoji:"💍",desc:"Romantique, doux et cinématique",duration:"5",ratio:"16:9",transition:"fade",filter:"soft",effect:"kenburns",intensity:"4",title:"Notre belle histoire",position:"bottom",decoration:"sparkles",textAnimation:"fade",font:"Georgia",accent:"#fff0d6",cover:"linear-gradient(135deg,#594b50,#b69b91,#e9d8c5)"},
      {id:"love-story",name:"Love story",category:"Amour",emoji:"❤️",desc:"Cœurs animés et souvenirs à deux",duration:"3",ratio:"9:16",transition:"fade",filter:"warm",effect:"pulse",intensity:"6",title:"Toi & moi",position:"center",decoration:"hearts",textAnimation:"pop",font:"Georgia",accent:"#ffd5df",cover:"linear-gradient(135deg,#5e1835,#b52c62,#f58ba8)"},
      {id:"valentine",name:"Saint-Valentin",category:"Amour",emoji:"💌",desc:"Un message d'amour en vidéo",duration:"3",ratio:"9:16",transition:"zoom",filter:"vivid",effect:"kenburns",intensity:"5",title:"Joyeuse Saint-Valentin",position:"bottom",decoration:"hearts",textAnimation:"slide",accent:"#ffe3eb",cover:"linear-gradient(135deg,#7b102e,#d8345f,#f7a6b8)"},
      {id:"travel-vlog",name:"Travel vlog",category:"Voyage",emoji:"🌍",desc:"Rythme dynamique pour vos escapades",duration:"2",ratio:"9:16",transition:"slide",filter:"vivid",effect:"zoom",intensity:"8",title:"New adventures",position:"bottom",decoration:"sparkles",textAnimation:"slide",accent:"#ffffff",cover:"linear-gradient(135deg,#006d77,#83c5be,#ffddd2)"},
      {id:"summer-holiday",name:"Vacances d'été",category:"Voyage",emoji:"🏝️",desc:"Couleurs solaires et souvenirs lumineux",duration:"3",ratio:"16:9",transition:"fade",filter:"warm",effect:"kenburns",intensity:"5",title:"Summer memories",position:"bottom",decoration:"sparkles",textAnimation:"pop",accent:"#fff2c6",cover:"linear-gradient(135deg,#0077b6,#00b4d8,#ffd166)"},
      {id:"family-memories",name:"Souvenirs en famille",category:"Souvenirs",emoji:"👨‍👩‍👧‍👦",desc:"Un album vidéo tendre et chaleureux",duration:"5",ratio:"16:9",transition:"fade",filter:"warm",effect:"kenburns",intensity:"4",title:"Nos plus beaux moments",position:"bottom",decoration:"sparkles",textAnimation:"fade",font:"Georgia",accent:"#fff0d4",cover:"linear-gradient(135deg,#5b6b45,#a7b77b,#e4cda7)"},
      {id:"best-friends",name:"Meilleurs amis",category:"Souvenirs",emoji:"🫶",desc:"Montage fun pour vos meilleurs moments",duration:"2",ratio:"9:16",transition:"zoom",filter:"vivid",effect:"pulse",intensity:"8",title:"Les meilleurs souvenirs",position:"center",decoration:"confetti",textAnimation:"bounce",accent:"#fff4a8",cover:"linear-gradient(135deg,#4c3c91,#9179e6,#f58fb5)"},
      {id:"product-showcase",name:"Présentation produit",category:"Business",emoji:"🛍️",desc:"Mettez un produit en valeur en quelques secondes",duration:"3",ratio:"1:1",transition:"cut",filter:"soft",effect:"kenburns",intensity:"3",title:"Découvrez notre nouveauté",position:"bottom",decoration:"sparkles",textAnimation:"pop",accent:"#ffffff",cover:"linear-gradient(135deg,#1e3a5f,#4776a8,#9fc5e8)"},
      {id:"flash-sale",name:"Promotion flash",category:"Business",emoji:"🔥",desc:"Annonce commerciale verticale et percutante",duration:"2",ratio:"9:16",transition:"slide",filter:"vivid",effect:"zoom",intensity:"10",title:"OFFRE EXCLUSIVE",position:"center",decoration:"confetti",textAnimation:"bounce",accent:"#fff2a8",cover:"linear-gradient(135deg,#7f1d1d,#ea580c,#facc15)"},
      {id:"brand-story",name:"Présentation de marque",category:"Business",emoji:"✨",desc:"Une identité visuelle propre et premium",duration:"4",ratio:"16:9",transition:"fade",filter:"cinema",effect:"kenburns",intensity:"4",title:"Notre histoire",position:"center",decoration:"sparkles",textAnimation:"fade",font:"Georgia",accent:"#f7e7c6",cover:"linear-gradient(135deg,#172554,#475569,#c4b5a5)"},
      {id:"graduation",name:"Félicitations diplômé",category:"Événements",emoji:"🎓",desc:"Célébrez une réussite avec une animation festive",duration:"3",ratio:"9:16",transition:"zoom",filter:"warm",effect:"pulse",intensity:"7",title:"Félicitations !",position:"center",decoration:"confetti",textAnimation:"bounce",accent:"#ffe8a3",cover:"linear-gradient(135deg,#111827,#4338ca,#d4a84f)"},
      {id:"baby-welcome",name:"Bienvenue bébé",category:"Événements",emoji:"🍼",desc:"Un montage tendre pour une naissance",duration:"4",ratio:"9:16",transition:"fade",filter:"soft",effect:"kenburns",intensity:"3",title:"Bienvenue parmi nous",position:"bottom",decoration:"sparkles",textAnimation:"fade",font:"Georgia",accent:"#fff4e6",cover:"linear-gradient(135deg,#9bbbd4,#e9c9d5,#f5e6c8)"},
      {id:"party-invitation",name:"Invitation à une fête",category:"Événements",emoji:"🎉",desc:"Créez une invitation vidéo animée",duration:"2",ratio:"9:16",transition:"zoom",filter:"vivid",effect:"pulse",intensity:"7",title:"Tu es invité(e) !",position:"center",decoration:"confetti",textAnimation:"pop",accent:"#fff1a8",cover:"linear-gradient(135deg,#312e81,#7c3aed,#ec4899)"},
      {id:"new-year",name:"Bonne année",category:"Fêtes",emoji:"🎆",desc:"Feux d'artifice et vœux animés",duration:"3",ratio:"9:16",transition:"fade",filter:"cinema",effect:"zoom",intensity:"6",title:"Bonne année !",position:"center",decoration:"sparkles",textAnimation:"pop",accent:"#ffe7a3",cover:"linear-gradient(135deg,#071a52,#1e3a8a,#b7791f)"},
      {id:"christmas",name:"Joyeux Noël",category:"Fêtes",emoji:"🎄",desc:"Une carte vidéo festive et chaleureuse",duration:"4",ratio:"16:9",transition:"fade",filter:"warm",effect:"kenburns",intensity:"4",title:"Joyeux Noël",position:"center",decoration:"sparkles",textAnimation:"fade",font:"Georgia",accent:"#fff0d0",cover:"linear-gradient(135deg,#064e3b,#166534,#991b1b)"},
      {id:"fitness-motivation",name:"Motivation sportive",category:"Lifestyle",emoji:"💪",desc:"Un montage énergique pour vos performances",duration:"2",ratio:"9:16",transition:"cut",filter:"vivid",effect:"zoom",intensity:"10",title:"Dépasse tes limites",position:"center",decoration:"sparkles",textAnimation:"bounce",accent:"#ffffff",cover:"linear-gradient(135deg,#111827,#334155,#f97316)"},
      {id:"cinematic-recap",name:"Récap cinématique",category:"Lifestyle",emoji:"🎬",desc:"Un résumé vidéo au style film",duration:"4",ratio:"16:9",transition:"fade",filter:"cinema",effect:"kenburns",intensity:"5",title:"Les moments forts",position:"bottom",decoration:"sparkles",textAnimation:"fade",font:"Georgia",accent:"#fff2dd",cover:"linear-gradient(135deg,#111827,#374151,#a16207)"},
      {id:"best-trio",name:"Best Trio",category:"Amis & Famille",emoji:"🫶",desc:"Une composition en trois portraits pour votre trio préféré",duration:"3",ratio:"16:9",transition:"fade",filter:"vivid",effect:"pulse",intensity:"5",title:"BEST TRIO",position:"bottom",decoration:"sparkles",textAnimation:"pop",font:"Georgia",accent:"#fff0c8",layout:"trio",cover:"linear-gradient(135deg,#3b1d72,#8d4de8,#f2a1c4)"},
      {id:"family-reunion",name:"La famille réunie",category:"Amis & Famille",emoji:"👨‍👩‍👧‍👦",desc:"Un tableau de famille chaleureux avec plusieurs portraits",duration:"4",ratio:"16:9",transition:"fade",filter:"warm",effect:"kenburns",intensity:"4",title:"La famille réunie",position:"bottom",decoration:"sparkles",textAnimation:"fade",font:"Georgia",accent:"#fff1d7",layout:"family",cover:"linear-gradient(135deg,#536b45,#a8b77a,#e5c99c)"},
      {id:"family-portrait",name:"Portrait de famille",category:"Amis & Famille",emoji:"🏡",desc:"Un montage souvenir pour toutes les générations",duration:"4",ratio:"1:1",transition:"fade",filter:"soft",effect:"kenburns",intensity:"3",title:"Nos plus beaux liens",position:"bottom",decoration:"hearts",textAnimation:"fade",font:"Georgia",accent:"#fff5e6",layout:"family",cover:"linear-gradient(135deg,#7c5a43,#d4a77b,#f1dfc4)"},
      {id:"name-intro",name:"Présentation de prénom",category:"Portraits & Prénoms",emoji:"✨",desc:"Présentez un prénom avec une animation élégante",duration:"3",ratio:"9:16",transition:"fade",filter:"soft",effect:"kenburns",intensity:"4",title:"Prénom",position:"center",decoration:"sparkles",textAnimation:"pop",font:"Georgia",accent:"#fff0cf",cover:"linear-gradient(135deg,#243b70,#8666c5,#e9b9d0)"},
      {id:"family-names",name:"Les prénoms de la famille",category:"Portraits & Prénoms",emoji:"💞",desc:"Une introduction animée pour afficher les prénoms de vos proches",duration:"4",ratio:"16:9",transition:"fade",filter:"warm",effect:"pulse",intensity:"3",title:"Notre famille : Emma · Noah · Lina",position:"center",decoration:"sparkles",textAnimation:"slide",font:"Georgia",accent:"#fff3df",cover:"linear-gradient(135deg,#4b365f,#9c6c9f,#e6c1a8)"}
    ];
    const categories=["Tous",...new Set(templateCatalog.map(t=>t.category))];let activeCategory="Tous";
    const categoryBox=$("jvp-template-categories"),templateGrid=$("jvp-template-grid");
    let lastTemplateText="";
    function applyTemplate(t){
      activeTemplate=t;$("jvp-ratio").value=t.ratio;$("jvp-duration").value=t.duration;$("jvp-transition").value=t.transition;$("jvp-filter").value=t.filter;$("jvp-effect").value=t.effect;$("jvp-intensity").value=t.intensity;$("jvp-text-position").value=t.position;$("jvp-text-color").value=t.accent;
      const textField=$("jvp-text");if(!textField.value.trim()||textField.value===lastTemplateText)textField.value=t.title;lastTemplateText=t.title;
      photos.forEach(item=>{if(item.kind==="image")item.duration=Number(t.duration);});
      templateGrid.querySelectorAll(".jvp-template-card").forEach(card=>card.classList.toggle("active",card.dataset.id===t.id));
      dims();if(photos.length)draw(0);
      $("jvp-template-status").textContent="Modèle « "+t.name+" » sélectionné. Ajoutez vos photos/vidéos ou prévisualisez votre création.";
      status("Modèle « "+t.name+" » appliqué. Vous pouvez modifier le texte, la musique et les effets.");
    }
    function renderTemplateCards(){
      const query=$("jvp-template-search").value.trim().toLocaleLowerCase();
      const items=templateCatalog.filter(t=>(activeCategory==="Tous"||t.category===activeCategory)&&(!query||(t.name+" "+t.category+" "+t.desc).toLocaleLowerCase().includes(query)));
      templateGrid.replaceChildren();
      if(!items.length){const empty=document.createElement("div");empty.className="jvp-template-empty";empty.textContent="Aucun modèle trouvé. Essayez un autre mot-clé.";templateGrid.append(empty);return;}
      items.forEach(t=>{
        const card=document.createElement("article");card.className="jvp-template-card"+(activeTemplate?.id===t.id?" active":"");card.dataset.id=t.id;
        const cover=document.createElement("div");cover.className="jvp-template-cover";cover.style.background=t.cover;
        const emoji=document.createElement("span");emoji.className="jvp-template-emoji";emoji.textContent=t.emoji;
        const duration=document.createElement("span");duration.className="jvp-template-duration";duration.textContent=t.duration+" s / média";
        cover.append(emoji,duration);
        const info=document.createElement("div");info.className="jvp-template-info";
        const name=document.createElement("strong");name.textContent=t.name;
        const desc=document.createElement("p");desc.textContent=t.desc;
        const use=document.createElement("button");use.type="button";use.textContent="Utiliser ce modèle";use.addEventListener("click",()=>applyTemplate(t));
        info.append(name,desc,use);card.append(cover,info);templateGrid.append(card);
      });
    }
    categories.forEach(category=>{const button=document.createElement("button");button.type="button";button.textContent=category;button.className=category==="Tous"?"active":"";button.addEventListener("click",()=>{activeCategory=category;categoryBox.querySelectorAll("button").forEach(b=>b.classList.toggle("active",b===button));renderTemplateCards();});categoryBox.append(button);});
    $("jvp-template-search").addEventListener("input",renderTemplateCards);renderTemplateCards();
    nav.addEventListener("click",()=>{window.location.assign("index.html#photo-studio");});
    const openPhotoStudio=()=>{if (!(window.location.hash === "#photo-studio")) return;workspace.querySelectorAll(".workspace-page").forEach(view=>{if(view.id!=="jv-photo-studio")view.hidden=true;});const dashboard=document.getElementById("dashboard");if(dashboard)dashboard.hidden=true;page.hidden=false;};
    window.addEventListener("hashchange",openPhotoStudio);openPhotoStudio();
  };
  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",boot);else boot();
})();