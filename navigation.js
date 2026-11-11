// JUSTEVIVO V6 — navigation unifiée : dashboard séparé, studio persistant.
document.addEventListener("DOMContentLoaded", function () {
  const sidebar = document.querySelector(".sidebar");
  const links = Array.from(document.querySelectorAll(".sidebar .side-link"));
  const workspace = document.querySelector(".workspace");
  const upload = document.querySelector(".upload-zone");
  const editor = document.querySelector(".editor-grid");
  const warning = document.querySelector(".demo-warning");
  if (!sidebar || !workspace || !editor) return;

  // Le dashboard est une vue d'accueil distincte. Toutes les autres rubriques
  // conservent le studio et son aperçu vidéo à l'écran.
  let dashboard = document.getElementById("jv-dashboard-view");
  if (!dashboard) {
    dashboard = document.createElement("section");
    dashboard.id = "jv-dashboard-view";
    dashboard.className = "workspace-page";
    dashboard.hidden = true;
    dashboard.innerHTML = `
      <div class="jv-account-heading"><div><span class="jv-account-eyebrow">JUSTEVIVO AI · ESPACE PERSONNEL</span><h3>Bonjour <span id="jv-account-firstname">Mariano</span> 👋</h3><p>Gérez votre profil, vos créations, votre abonnement et vos outils IA.</p></div><button type="button" class="jv-create-main" id="jv-dashboard-create">＋ Créer une vidéo IA</button></div>
      <div class="jv-account-overview">
        <article class="jv-account-profile"><div class="jv-profile-top"><div class="jv-avatar" id="jv-account-avatar">MG</div><div><strong id="jv-account-display-name">Votre compte</strong><span id="jv-account-role">Créateur JUSTEVIVO</span></div><span class="jv-online-dot"></span></div><div class="jv-profile-details"><div>✉ <span id="jv-account-email">Chargement…</span></div><div>♛ <span id="jv-account-plan">Formule en cours de chargement</span></div><div>◷ <span>Votre espace de création vidéo</span></div></div><button type="button" class="jv-profile-edit" id="jv-open-account-settings">⚙ Gérer mon compte et ma sécurité</button></article>
        <article class="jv-usage-card"><div class="jv-card-heading"><div><span class="jv-card-kicker">VOTRE ACTIVITÉ</span><h4>Mon utilisation ce mois-ci</h4></div><span class="jv-live-chip">● En direct</span></div><div class="jv-usage-content"><div class="jv-usage-ring" id="jv-usage-ring"><div><strong id="jv-usage-percent">0%</strong><span id="jv-usage-ratio">0 / —</span><small>Vidéos générées</small></div></div><div class="jv-usage-metrics"><div><b>▣</b><span><strong>Vidéos générées</strong><small id="jv-quota-value">—</small></span></div><div><b>◷</b><span><strong>Durée maximale</strong><small id="jv-duration-limit">—</small></span></div><div><b>✧</b><span><strong>Générations IA</strong><small id="jv-generation-quota">—</small></span></div><div><b>☁</b><span><strong>Stockage</strong><small id="jv-storage-quota">Selon formule</small></span></div></div></div><div class="jv-usage-foot"><span id="jv-quota-note">Chargement des quotas…</span><div class="jv-usage-progress"><i id="jv-quota-fill"></i></div></div></article>
        <article class="jv-quick-card"><div class="jv-card-heading"><div><span class="jv-card-kicker">POUR ALLER PLUS VITE</span><h4>Accès rapides</h4></div></div><div class="jv-quick-grid"><button data-jv-action="new"><b>＋</b><span>Nouvelle vidéo</span></button><button data-jv-action="captions"><b>CC</b><span>Sous-titres IA</span></button><button data-jv-action="styles"><b>✦</b><span>Styles & modèles</span></button><button data-jv-action="audio"><b>♫</b><span>Audio & voix</span></button><button data-jv-action="translate"><b>文</b><span>Traduction</span></button><button data-jv-action="export"><b>⇧</b><span>Exporter</span></button></div></article>
      </div>
      <section class="jv-account-promo"><div><span>LE STUDIO VIDÉO IA TOUT-EN-UN</span><h3>Créez des vidéos plus captivantes, en moins de temps.</h3><p>Sous-titres dynamiques, personnalisation, traduction et outils de montage réunis dans votre espace JUSTEVIVO.</p><button type="button" id="jv-promo-create">Créer mon projet →</button></div><div class="jv-promo-art"><div class="jv-promo-screen"><div class="jv-screen-top"><i></i><i></i><i></i><span>JUSTEVIVO STUDIO</span></div><div class="jv-screen-video"><b>VOTRE HISTOIRE<br><em>PREND VIE.</em></b></div><div class="jv-screen-timeline"><i></i><i></i><i></i><i></i></div></div><div class="jv-promo-tags"><span>✦ Sous-titres IA</span><span>◈ Styles animés</span><span>⇧ Export vidéo</span></div></div></section>
      <section class="jv-plan-area"><div class="jv-section-title"><div><span>CHOISISSEZ VOTRE FORMULE</span><h3>Nos abonnements</h3><p>Des offres évolutives pour les créateurs et les équipes.</p></div><button type="button" id="jv-see-all-plans">Voir les détails et conditions →</button></div><div class="jv-plan-cards">
        <article><span class="jv-plan-name">GRATUIT</span><strong>0 FCFA <small>/ mois</small></strong><p>Pour découvrir le studio.</p><ul><li>3 vidéos / mois</li><li>Durée max. 1 minute</li><li>Sous-titres IA</li><li>Outils essentiels</li></ul><span class="jv-plan-current">Essai gratuit</span></article>
        <article class="jv-plan-featured"><span class="jv-plan-popular">POPULAIRE</span><span class="jv-plan-name">STARTER</span><strong>$10 <small>/ mois</small></strong><p>Pour créer régulièrement.</p><ul><li>25 vidéos / mois</li><li>Jusqu’à 5 minutes / vidéo</li><li>Sous-titres automatiques</li><li>Export sans filigrane</li></ul><button type="button" data-jv-plan="Starter">Voir Starter</button></article>
        <article><span class="jv-plan-name">PRO</span><strong>$15 <small>/ mois</small></strong><p>Pour les créateurs actifs.</p><ul><li>50 vidéos / mois</li><li>Jusqu’à 10 minutes / vidéo</li><li>Outils IA avancés</li><li>Modèles animés</li></ul><button type="button" data-jv-plan="Pro">Voir Pro</button></article>
        <article><span class="jv-plan-name">BUSINESS</span><strong>$25 <small>/ mois</small></strong><p>Pour les équipes.</p><ul><li>110 vidéos / mois</li><li>Jusqu’à 30 minutes / vidéo</li><li>Personnalisation avancée</li><li>Export HD</li></ul><button type="button" data-jv-plan="Business">Voir Business</button></article>
      </div><p class="jv-plan-disclaimer">Tarifs affichés selon la configuration actuelle de la page publique. Le paiement en ligne reste à valider avant l’ouverture des souscriptions.</p></section>
      <section class="jv-feature-directory"><div class="jv-section-title"><div><span>VOTRE BOÎTE À OUTILS</span><h3>Fonctionnalités JUSTEVIVO</h3><p>Outils disponibles et modules en préparation.</p></div></div><div class="jv-feature-grid">
        <article data-status="available"><b>CC</b><strong>Sous-titres automatiques</strong><small>Transcription et personnalisation</small><em>Disponible</em></article><article data-status="available"><b>✦</b><strong>Styles & animations</strong><small>Styles visuels et mots actifs</small><em>Disponible</em></article><article data-status="available"><b>✂</b><strong>Montage & scènes</strong><small>Découpage et séquences</small><em>Outils du studio</em></article><article data-status="available"><b>文</b><strong>Traduction des sous-titres</strong><small>Traduction des textes vidéo</small><em>Disponible</em></article><article data-status="available"><b>♫</b><strong>Audio & voix</strong><small>Outils audio de l’éditeur</small><em>Selon intégration</em></article><article data-status="available"><b>▣</b><strong>Export vidéo</strong><small>Prévisualisation et export</small><em>Disponible</em></article>
        <article data-status="planned"><b>⚡</b><strong>Magic Clips</strong><small>Découpage automatique en clips</small><em>À développer</em></article><article data-status="planned"><b>◉</b><strong>B-Roll intelligent</strong><small>Séquences complémentaires IA</small><em>À développer</em></article><article data-status="planned"><b>◈</b><strong>Doublage IA multilingue</strong><small>Voix traduites et synchronisées</small><em>À intégrer</em></article><article data-status="planned"><b>▤</b><strong>Brand Kit & templates</strong><small>Identité de marque et modèles</small><em>À compléter</em></article><article data-status="planned"><b>◷</b><strong>Publication & calendrier</strong><small>Planification des réseaux sociaux</small><em>À intégrer</em></article><article data-status="planned"><b>♧</b><strong>Équipe & collaboration</strong><small>Espaces clients et partage</small><em>À développer</em></article>
      </div></section>
      <section class="dashboard-recent jv-recent-projects"><div class="dashboard-recent-head"><div><span class="jv-card-kicker">VOTRE HISTORIQUE</span><h4>Projets récents</h4></div><button type="button" class="button ghost" id="jv-dashboard-refresh">Actualiser</button></div><div id="jv-dashboard-recent-list" class="dashboard-recent-list" aria-live="polite"><p class="dashboard-muted">Chargement des projets…</p></div></section>`;
    workspace.insertBefore(dashboard, workspace.querySelector(".upload-zone"));
    workspace.insertBefore(dashboard, workspace.querySelector(".upload-zone"));
  }

  const editorHeading = workspace.querySelector(".workspace-head");
  const studioParts = [editorHeading, upload, editor, warning].filter(Boolean);

  function setActive(page) {
    links.forEach(link => link.classList.toggle("active", link.dataset.page === page));
  }

  function showDashboard() {
    dashboard.hidden = false;
    studioParts.forEach(el => { el.hidden = true; });
    setActive("dashboard");
    refreshDashboard();
    workspace.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function showStudio() {
    dashboard.hidden = true;
    studioParts.forEach(el => { el.hidden = false; });
  }

  async function refreshDashboard() {
    const email=document.getElementById("jv-account-email"), plan=document.getElementById("jv-account-plan"), quota=document.getElementById("jv-quota-value"), note=document.getElementById("jv-quota-note"), fill=document.getElementById("jv-quota-fill"), recent=document.getElementById("jv-dashboard-recent-list");
    let session=null; try{session=JSON.parse(localStorage.getItem("justevivo_session_v1")||"null")}catch(_){}
    const initials=v=>String(v||"JV").split(/[.@ _-]+/).filter(Boolean).slice(0,2).map(x=>x[0].toUpperCase()).join("");
    const count=(u,l,unlimited)=>Number(u||0).toLocaleString("fr-FR")+" / "+(unlimited||Number(l)>=100000000?"Illimité":Number(l||0).toLocaleString("fr-FR"));
    if(!session||!session.access_token){email.textContent="Compte non connecté";plan.textContent="Connectez-vous pour retrouver votre formule.";quota.textContent="—";note.textContent="Statistiques disponibles après connexion.";fill.style.width="0%";document.getElementById("jv-account-display-name").textContent="Bienvenue sur JUSTEVIVO";document.getElementById("jv-account-avatar").textContent="JV";document.getElementById("jv-account-firstname").textContent="créateur";document.getElementById("jv-usage-ratio").textContent="Connectez-vous";document.getElementById("jv-duration-limit").textContent="—";document.getElementById("jv-generation-quota").textContent="—";document.getElementById("jv-storage-quota").textContent="—";recent.textContent="Connectez-vous pour afficher vos projets récents.";return;}
    const token=session.access_token;email.textContent=session.email||"Compte connecté";document.getElementById("jv-account-display-name").textContent=session.email||"Compte JUSTEVIVO";document.getElementById("jv-account-avatar").textContent=initials(session.email);document.getElementById("jv-account-firstname").textContent=(session.email||"Créateur").split("@")[0].split(/[._-]/)[0];recent.textContent="Chargement des projets…";
    const tasks=await Promise.allSettled([fetch(API_URL+"/api/me",{headers:{Authorization:"Bearer "+token},cache:"no-store"}),fetch(API_URL+"/api/config",{cache:"no-store"})]);
    if(tasks[0].status==="fulfilled"&&tasks[0].value.ok){try{const d=await tasks[0].value.json();if(!d||!d.enabled)throw Error();const admin=!!d.isAdmin,used=Number(d.videosUsed||0),limit=Number(d.videosLimit||0),gu=Number(d.genUsed||0),gl=Number(d.genLimit||0),unlimited=admin||limit>=100000000,ratio=limit>0&&!unlimited?Math.min(100,used/limit*100):0;plan.textContent="Formule : "+(d.planName||d.plan||(admin?"Administrateur":"Gratuit"));document.getElementById("jv-account-role").textContent=admin?"Administrateur":"Membre JUSTEVIVO";quota.textContent=count(used,limit,unlimited);document.getElementById("jv-usage-ratio").textContent=count(used,limit,unlimited);document.getElementById("jv-usage-percent").textContent=unlimited?"∞":Math.round(ratio)+"%";document.getElementById("jv-usage-ring").style.setProperty("--jv-usage-progress",ratio+"%");document.getElementById("jv-duration-limit").textContent=admin||Number(d.maxSeconds)>=100000000?"Illimitée":(Number(d.maxSeconds||0)>=60?Math.round(Number(d.maxSeconds)/60)+" min":Number(d.maxSeconds||0)+" s");document.getElementById("jv-generation-quota").textContent=count(gu,gl,admin||gl>=100000000);document.getElementById("jv-storage-quota").textContent=d.storageLimit?Number(d.storageLimit).toLocaleString("fr-FR")+" Go":"Selon votre formule";note.textContent=unlimited?"Aucune limite de vidéos pour ce compte":Math.max(0,limit-used)+" vidéo(s) restante(s)";fill.style.width=ratio+"%";}catch(_){plan.textContent="Informations du compte indisponibles";quota.textContent="—";note.textContent="Impossible de lire votre formule pour le moment.";}}else{plan.textContent="Session à actualiser";quota.textContent="—";note.textContent="Reconnectez-vous si nécessaire.";}
    try{const cr=tasks[1].status==="fulfilled"?tasks[1].value:null;if(!cr||!cr.ok)throw Error("Configuration indisponible");const cfg=await cr.json();if(!cfg.url||!cfg.anonKey)throw Error("Configuration incomplète");const pr=await fetch(cfg.url+"/rest/v1/projects?select=id,name,video_name,updated_at&order=updated_at.desc&limit=5",{headers:{apikey:cfg.anonKey,Authorization:"Bearer "+token},cache:"no-store"});if(!pr.ok)throw Error(pr.status===401?"Session expirée : reconnectez-vous.":"Chargement des projets impossible.");const projects=await pr.json();recent.innerHTML="";if(!Array.isArray(projects)||!projects.length){const p=document.createElement("p");p.className="dashboard-muted";p.textContent="Aucun projet enregistré. Créez une vidéo puis enregistrez-la dans le studio.";recent.appendChild(p);}else projects.forEach(x=>{const item=document.createElement("article");item.className="dashboard-project-item";const title=document.createElement("strong");title.textContent=x.name||"Projet sans titre";const meta=document.createElement("span");meta.textContent=[x.video_name,x.updated_at?new Date(x.updated_at).toLocaleDateString("fr-FR"):""].filter(Boolean).join(" · ");item.append(title,meta);recent.appendChild(item);});}catch(err){recent.textContent=err.message||"Impossible de charger les projets récents.";}
  }
  document.getElementById("jv-dashboard-create").addEventListener("click", () => {
    showStudio();
    workspace.scrollIntoView({ behavior: "smooth", block: "start" });
  });
  document.getElementById("jv-dashboard-refresh").addEventListener("click", refreshDashboard);
  document.getElementById("jv-promo-create").addEventListener("click",()=>{showStudio();workspace.scrollIntoView({behavior:"smooth",block:"start"});});
  document.getElementById("jv-open-account-settings").addEventListener("click",()=>{showStudio();const tab=document.querySelector('.jv-editor-panel-tab[data-panel="settings"]');if(tab)tab.click();});
  document.getElementById("jv-see-all-plans").addEventListener("click",()=>{const p=document.getElementById("pricing");if(p){p.scrollIntoView({behavior:"smooth",block:"start"});history.replaceState(null,"","#pricing");}});
  dashboard.querySelectorAll("[data-jv-plan]").forEach(b=>b.addEventListener("click",()=>{const p=document.getElementById("pricing");if(p){p.scrollIntoView({behavior:"smooth",block:"start"});history.replaceState(null,"","#pricing");}}));
  dashboard.querySelectorAll("[data-jv-action]").forEach(b=>b.addEventListener("click",()=>{const a=b.dataset.jvAction;if(a==="new"){showStudio();return;}showStudio();const p=a==="captions"?"text":a==="styles"?"styles":a==="audio"?"audio":a==="export"?"export":"text";const tab=document.querySelector('.jv-editor-panel-tab[data-panel="'+p+'"]');if(tab)tab.click();if(a==="translate"){const tr=document.getElementById("translateSubtitlesButton");if(tr)tr.click();}}));

  document.getElementById("jv-dashboard-projects").addEventListener("click", () => {
    showStudio();
    const projects = links.find(link => link.dataset.page === "projects");
    if (projects) projects.click();
  });

  links.forEach(link => {
    link.addEventListener("click", () => {
      if (link.dataset.page === "dashboard") {
        showDashboard();
      } else {
        showStudio();
      }
    });
  });

  // Les CTA du site pointent vers #studio : ils doivent aussi réactiver le studio
  // après que le tableau de bord a masqué les éléments de montage.
  document.querySelectorAll('a[href="#studio"]').forEach(link => {
    link.addEventListener("click", () => {
      showStudio();
      const studio = document.getElementById("studio");
      if (studio) requestAnimationFrame(() => studio.scrollIntoView({behavior:"smooth", block:"start"}));
    });
  });

  // Entrée initiale : conserver le dashboard comme page d'accueil.
  showDashboard();
});
