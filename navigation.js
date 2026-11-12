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
      <div class="jv-account-heading"><div><span class="jv-account-eyebrow">JUSTEVIVO AI · ESPACE PERSONNEL</span><h3>Mon compte</h3><p>Gérez votre profil, votre abonnement, votre utilisation et la sécurité de votre compte.</p></div><div class="jv-heading-actions"><button type="button" class="jv-create-main" id="jv-dashboard-create">＋ Créer une vidéo IA</button><button type="button" class="jv-new-features-trigger" id="jv-new-features-trigger" aria-expanded="false">✦ Nouveautés</button></div></div>
      <div class="jv-account-overview">
        <article class="jv-account-profile"><div class="jv-profile-top"><div class="jv-avatar" id="jv-account-avatar">MG</div><div><strong id="jv-account-display-name">Votre compte</strong><span id="jv-account-role">Créateur JUSTEVIVO</span></div><span class="jv-online-dot"></span></div><div class="jv-profile-details"><div>✉ <span id="jv-account-email">Chargement…</span></div><div>♛ <span id="jv-account-plan">Formule en cours de chargement</span></div><div>◷ <span>Votre espace de création vidéo</span></div></div><button type="button" class="jv-profile-edit" id="jv-open-account-settings">⚙ Gérer mon compte et ma sécurité</button></article>
        <article class="jv-usage-card"><div class="jv-card-heading"><div><span class="jv-card-kicker">VOTRE ACTIVITÉ</span><h4>Mon utilisation ce mois-ci</h4></div><span class="jv-live-chip">● En direct</span></div><div class="jv-usage-content"><div class="jv-usage-ring" id="jv-usage-ring"><div><strong id="jv-usage-percent">0%</strong><span id="jv-usage-ratio">0 / —</span><small>Vidéos générées</small></div></div><div class="jv-usage-metrics"><div><b>▣</b><span><strong>Vidéos générées</strong><small id="jv-quota-value">—</small></span></div><div><b>◷</b><span><strong>Durée maximale</strong><small id="jv-duration-limit">—</small></span></div><div><b>✧</b><span><strong>Générations IA</strong><small id="jv-generation-quota">—</small></span></div><div><b>☁</b><span><strong>Stockage</strong><small id="jv-storage-quota">Selon formule</small></span></div></div></div><div class="jv-usage-foot"><span id="jv-quota-note">Chargement des quotas…</span><div class="jv-usage-progress"><i id="jv-quota-fill"></i></div></div></article>
        <article class="jv-quick-card"><div class="jv-card-heading"><div><span class="jv-card-kicker">POUR ALLER PLUS VITE</span><h4>Accès rapides</h4></div></div><div class="jv-quick-grid"><button data-jv-action="new"><b>＋</b><span>Nouvelle vidéo</span></button><button data-jv-action="captions"><b>CC</b><span>Sous-titres IA</span></button><button data-jv-action="styles"><b>✦</b><span>Styles & modèles</span></button><button data-jv-action="audio"><b>♫</b><span>Audio & voix</span></button><button data-jv-action="translate"><b>文</b><span>Traduction</span></button><button data-jv-action="export"><b>⇧</b><span>Exporter</span></button></div></article>
      </div>
      <section class="jv-account-promo"><div><span>LE STUDIO VIDÉO IA TOUT-EN-UN</span><h3>Créez des vidéos plus captivantes, en moins de temps.</h3><p>Sous-titres dynamiques, personnalisation, traduction et outils de montage réunis dans votre espace JUSTEVIVO.</p><button type="button" id="jv-promo-create">Créer mon projet →</button></div><div class="jv-promo-art"><div class="jv-promo-screen"><div class="jv-screen-top"><i></i><i></i><i></i><span>JUSTEVIVO STUDIO</span></div><div class="jv-screen-video"><b>VOTRE HISTOIRE<br><em>PREND VIE.</em></b></div><div class="jv-screen-timeline"><i></i><i></i><i></i><i></i></div></div><div class="jv-promo-tags"><span>✦ Sous-titres IA</span><span>◈ Styles animés</span><span>⇧ Export vidéo</span></div></div></section>
      <section class="jv-plan-area"><div class="jv-section-title"><div><span>CHOISISSEZ VOTRE FORMULE</span><h3>Nos abonnements</h3><p>Des offres évolutives pour les créateurs et les équipes.</p></div><button type="button" id="jv-see-all-plans">Voir les détails et conditions →</button></div><div class="jv-plan-cards">
        <article><span class="jv-plan-name">GRATUIT</span><strong>0 FCFA <small>/ mois</small></strong><p>Pour découvrir le studio.</p><ul><li>3 vidéos / mois</li><li>Durée max. 1 minute</li><li>Sous-titres IA</li><li>Outils essentiels</li></ul><span class="jv-plan-current">Essai gratuit</span></article>
        <article class="jv-plan-featured"><span class="jv-plan-popular">POPULAIRE</span><span class="jv-plan-name">STARTER</span><strong>$15 <small>/ mois</small></strong><p>Pour créer régulièrement.</p><ul><li>25 vidéos / mois</li><li>Jusqu’à 5 minutes / vidéo</li><li>Sous-titres automatiques</li><li>Export sans filigrane</li></ul><button type="button" data-jv-plan="Starter">Voir Starter</button></article>
        <article><span class="jv-plan-name">PRO</span><strong>$20 <small>/ mois</small></strong><p>Pour les créateurs actifs.</p><ul><li>50 vidéos / mois</li><li>Jusqu’à 10 minutes / vidéo</li><li>Outils IA avancés</li><li>Modèles animés</li></ul><button type="button" data-jv-plan="Pro">Voir Pro</button></article>
        <article><span class="jv-plan-name">BUSINESS</span><strong>$30 <small>/ mois</small></strong><p>Pour les équipes.</p><ul><li>110 vidéos / mois</li><li>Jusqu’à 30 minutes / vidéo</li><li>Personnalisation avancée</li><li>Export HD</li></ul><button type="button" data-jv-plan="Business">Voir Business</button></article>
      <article class="jv-plan-featured"><span class="jv-plan-popular">ÉDITEUR + VIDÉO IA</span><span class="jv-plan-name">ALL-IN-ONE</span><strong>9 900 FCFA <small>/ mois</small></strong><p>Pour créer et générer avec l’IA.</p><ul><li>Éditeur JUSTEVIVO complet</li><li>Jusqu’à 10 minutes par projet final</li><li>100 crédits vidéo IA / mois</li><li>Scènes texte-vers-vidéo</li></ul><button type="button" data-jv-plan="All-in-One">Découvrir ALL-IN-ONE</button></article></div><p class="jv-plan-disclaimer">Les crédits IA inclus sont consommés selon la durée et le modèle choisis. Les générations supplémentaires nécessiteront des crédits complémentaires. Le paiement en ligne reste à valider avant l’ouverture des souscriptions.</p></section>
      <section class="jv-feature-directory"><div class="jv-section-title"><div><span>VOTRE BOÎTE À OUTILS</span><h3>Fonctionnalités JUSTEVIVO</h3><p>Outils disponibles et modules en préparation.</p></div></div><div class="jv-feature-grid">
        <article data-status="available"><b>CC</b><strong>Sous-titres automatiques</strong><small>Transcription et personnalisation</small><em>Disponible</em></article><article data-status="available"><b>✦</b><strong>Styles & animations</strong><small>Styles visuels et mots actifs</small><em>Disponible</em></article><article data-status="available"><b>✂</b><strong>Montage & scènes</strong><small>Découpage et séquences</small><em>Outils du studio</em></article><article data-status="available"><b>文</b><strong>Traduction des sous-titres</strong><small>Traduction des textes vidéo</small><em>Disponible</em></article><article data-status="available"><b>♫</b><strong>Audio & voix</strong><small>Amélioration audio et réglages de pistes</small><em>Disponible · FFmpeg</em></article><article data-status="available"><b>▣</b><strong>Export vidéo</strong><small>Prévisualisation et export</small><em>Disponible</em></article>
        <article data-status="available"><b>⚡</b><strong>Magic Clips</strong><small>Analyse Whisper, sélection de passages et export FFmpeg</small><em>Disponible · Whisper + FFmpeg</em></article><article data-status="available"><b>◉</b><strong>B-Roll gratuit</strong><small>Recherche vidéo Wikimedia Commons avec licence et attribution</small><em>Disponible · Bibliothèque gratuite</em></article><article data-status="available"><b>▤</b><strong>Timeline de montage</strong><small>Repères et organisation des séquences</small><em>Disponible</em></article><article data-status="available"><b>▧</b><strong>Bibliothèque média</strong><small>Import de vidéos, images et ressources</small><em>Disponible</em></article><article data-status="partial"><b>◈</b><strong>Traduction & doublage vocal</strong><small>Traduction IA et synthèse vocale locale</small><em>Traduction + voix appareil</em></article><article data-status="available"><b>▤</b><strong>Brand Kit</strong><small>Enregistrement des couleurs et réglages de marque</small><em>Disponible</em></article><article data-status="partial"><b>◷</b><strong>Calendrier & publication assistée</strong><small>Planification, export calendrier et ouverture des plateformes</small><em>Publication assistée · API sociales à autoriser</em></article><article data-status="partial"><b>♧</b><strong>Projets partagés</strong><small>Invitations sécurisées et modification collaborative des projets</small><em>Partage & édition partagée</em></article>
      </div></section>
      <section class="dashboard-recent jv-recent-projects"><div class="dashboard-recent-head"><div><span class="jv-card-kicker">VOTRE HISTORIQUE</span><h4>Projets récents</h4></div><div><button type="button" class="button ghost" id="jv-dashboard-projects">Tous mes projets</button> <button type="button" class="button ghost" id="jv-dashboard-refresh">Actualiser</button></div></div><div id="jv-dashboard-recent-list" class="dashboard-recent-list" aria-live="polite"><p class="dashboard-muted">Chargement des projets…</p></div></section>`;
    workspace.insertBefore(dashboard, workspace.querySelector(".upload-zone"));
  }


  // Page dédiée aux formules et à l'abonnement.
  let subscriptionPage = document.getElementById("jv-subscription-page");
  if (!subscriptionPage) {
    subscriptionPage = document.createElement("section");
    subscriptionPage.id = "jv-subscription-page";
    subscriptionPage.className = "workspace-page jv-subscription-page";
    subscriptionPage.hidden = true;
    subscriptionPage.innerHTML = `
      <div class="jv-account-heading"><div><span class="jv-account-eyebrow">JUSTEVIVO AI · OFFRES</span><h3>Formules & abonnement</h3><p>Comparez les offres et consultez les limites de votre espace.</p></div><button type="button" class="jv-profile-edit" id="jv-subscription-back">← Retour au tableau de bord</button></div>
      <div class="jv-subscription-current"><div><span class="jv-card-kicker">VOTRE FORMULE ACTUELLE</span><h4 id="jv-subscription-current-plan">Chargement de votre formule…</h4><p id="jv-subscription-current-note">Les informations de votre compte seront affichées ici.</p></div><button type="button" id="jv-subscription-refresh">Actualiser mon compte</button></div>
      <div class="jv-subscription-grid">
        <article><span class="jv-subscription-tag">DÉCOUVERTE</span><h4>Gratuit</h4><strong>0 FCFA <small>/ mois</small></strong><p>Pour découvrir JUSTEVIVO.</p><ul><li>3 vidéos par mois</li><li>Jusqu'à 1 minute par vidéo</li><li>Sous-titres IA essentiels</li><li>Accès au studio</li></ul><span class="jv-subscription-current-label">Essai gratuit</span></article>
        <article><span class="jv-subscription-tag">POUR COMMENCER</span><h4>Starter</h4><strong>15 $ <small>/ mois</small></strong><p>Pour publier régulièrement.</p><ul><li>25 vidéos par mois</li><li>Jusqu'à 5 minutes par vidéo</li><li>Sous-titres automatiques</li><li>Styles essentiels</li><li>Export sans filigrane</li></ul><button type="button" data-subscription-plan="Starter">Choisir Starter</button></article>
        <article class="is-featured"><span class="jv-subscription-tag">LE PLUS POPULAIRE</span><h4>Pro</h4><strong>20 $ <small>/ mois</small></strong><p>Pour les créateurs actifs.</p><ul><li>50 vidéos par mois</li><li>Jusqu'à 10 minutes par vidéo</li><li>Outils IA avancés</li><li>Modèles de texte animés</li><li>Export sans filigrane</li></ul><button type="button" data-subscription-plan="Pro">Choisir Pro</button></article>
        <article><span class="jv-subscription-tag">POUR LES ÉQUIPES</span><h4>Business</h4><strong>30 $ <small>/ mois</small></strong><p>Pour les productions soutenues.</p><ul><li>110 vidéos par mois</li><li>Jusqu'à 30 minutes par vidéo</li><li>Outils IA avancés</li><li>Personnalisation avancée</li><li>Export HD sans filigrane</li></ul><button type="button" data-subscription-plan="Business">Choisir Business</button></article>
        <article class="is-featured"><span class="jv-subscription-tag">ÉDITEUR + GÉNÉRATEUR IA</span><h4>ALL-IN-ONE</h4><strong>9 900 FCFA <small>/ mois</small></strong><p>Pour créer et générer des vidéos IA.</p><ul><li>Éditeur complet</li><li>Projets finaux jusqu’à 10 minutes</li><li>100 crédits vidéo IA / mois</li><li>Génération de scènes IA</li></ul><button type="button" data-subscription-plan="All-in-One">Choisir ALL-IN-ONE</button></article>
      </div>
      <p class="jv-subscription-notice">Paiement sécurisé par Dodo Payments · Abonnement mensuel renouvelé automatiquement. Votre formule JUSTEVIVO sera activée après confirmation sécurisée du paiement.</p>`;
    workspace.insertBefore(subscriptionPage, workspace.querySelector(".upload-zone"));
  }

  const editorHeading = workspace.querySelector(".workspace-head");
  const studioParts = [editorHeading, upload, editor, warning].filter(Boolean);

  function setActive(page) {
    links.forEach(link => link.classList.toggle("active", link.dataset.page === page));
  }

  // Bouton de retour commun aux vues internes du studio.
  let workspaceBack = document.getElementById("jv-workspace-back");
  if (!workspaceBack) {
    workspaceBack = document.createElement("button");
    workspaceBack.id = "jv-workspace-back";
    workspaceBack.type = "button";
    workspaceBack.className = "jv-workspace-back";
    workspaceBack.innerHTML = '<span aria-hidden="true">←</span> Retour au tableau de bord';
    workspaceBack.setAttribute("aria-label", "Retour au tableau de bord");
    workspaceBack.style.cssText = "display:none;align-items:center;gap:9px;margin:0 0 14px;padding:10px 15px;border:1px solid #dfe3ef;border-radius:11px;background:#fff;color:#30294b;font:700 13px system-ui;cursor:pointer;box-shadow:0 3px 12px #17203310";
    workspace.insertBefore(workspaceBack, workspace.firstChild);
    workspaceBack.addEventListener("click", showDashboard);
  }

  function showDashboard() {
    subscriptionPage.hidden = true;
    if (typeof featurePage !== "undefined" && featurePage) featurePage.hidden = true;
    dashboard.hidden = false;
    studioParts.forEach(el => { el.hidden = true; });
    setActive("dashboard");
    refreshDashboard();
    workspace.scrollIntoView({ behavior: "smooth", block: "start" });
  }


  function showSubscription() {
    dashboard.hidden = true;
    if (typeof featurePage !== "undefined" && featurePage) featurePage.hidden = true;
    subscriptionPage.hidden = false;
    studioParts.forEach(el => { el.hidden = true; });
    setActive("pricing");
    const email=document.getElementById("jv-account-email");
    const current=document.getElementById("jv-subscription-current-plan");
    const note=document.getElementById("jv-subscription-current-note");
    const plan=document.getElementById("jv-account-plan");
    current.textContent=plan?plan.textContent:"Formule de votre compte";
    note.textContent=email&&email.textContent?"Compte : "+email.textContent:"Connectez-vous pour consulter vos informations personnelles.";
    subscriptionPage.scrollIntoView({behavior:"smooth",block:"start"});
  }

  function showStudio() {
    subscriptionPage.hidden = true;
    if (typeof featurePage !== "undefined" && featurePage) featurePage.hidden = true;
    dashboard.hidden = true;
    studioParts.forEach(el => { el.hidden = false; });
  }

  async function refreshDashboard() {
    const email=document.getElementById("jv-account-email"), plan=document.getElementById("jv-account-plan"), quota=document.getElementById("jv-quota-value"), note=document.getElementById("jv-quota-note"), fill=document.getElementById("jv-quota-fill"), recent=document.getElementById("jv-dashboard-recent-list");
    let session=null; try{session=JSON.parse(localStorage.getItem("justevivo_session_v1")||"null")}catch(_){}
    const initials=v=>String(v||"JV").split(/[.@ _-]+/).filter(Boolean).slice(0,2).map(x=>x[0].toUpperCase()).join("");
    const count=(u,l,unlimited)=>Number(u||0).toLocaleString("fr-FR")+" / "+(unlimited||Number(l)>=100000000?"Illimité":Number(l||0).toLocaleString("fr-FR"));
    if(!session||!session.access_token){email.textContent="Compte non connecté";plan.textContent="Connectez-vous pour retrouver votre formule.";quota.textContent="—";note.textContent="Statistiques disponibles après connexion.";fill.style.width="0%";document.getElementById("jv-account-display-name").textContent="Bienvenue sur JUSTEVIVO";document.getElementById("jv-account-avatar").textContent="JV";document.getElementById("jv-usage-ratio").textContent="Connectez-vous";document.getElementById("jv-duration-limit").textContent="—";document.getElementById("jv-generation-quota").textContent="—";document.getElementById("jv-storage-quota").textContent="—";recent.textContent="Connectez-vous pour afficher vos projets récents.";return;}
    const token=session.access_token;email.textContent=session.email||"Compte connecté";document.getElementById("jv-account-display-name").textContent=session.email||"Compte JUSTEVIVO";document.getElementById("jv-account-avatar").textContent=initials(session.email);recent.textContent="Chargement des projets…";
    const tasks=await Promise.allSettled([fetch(API_URL+"/api/me",{headers:{Authorization:"Bearer "+token},cache:"no-store"}),fetch(API_URL+"/api/config",{cache:"no-store"})]);
    if(tasks[0].status==="fulfilled"&&tasks[0].value.ok){try{const d=await tasks[0].value.json();if(!d||!d.enabled)throw Error();const admin=!!d.isAdmin,used=Number(d.videosUsed||0),limit=Number(d.videosLimit||0),gu=Number(d.genUsed||0),gl=Number(d.genLimit||0),unlimited=admin||limit>=100000000,ratio=limit>0&&!unlimited?Math.min(100,used/limit*100):0;plan.textContent="Formule : "+(d.planName||d.plan||(admin?"Administrateur":"Gratuit"));document.getElementById("jv-account-role").textContent=admin?"Administrateur":"Membre JUSTEVIVO";quota.textContent=count(used,limit,unlimited);document.getElementById("jv-usage-ratio").textContent=count(used,limit,unlimited);document.getElementById("jv-usage-percent").textContent=unlimited?"∞":Math.round(ratio)+"%";document.getElementById("jv-usage-ring").style.setProperty("--jv-usage-progress",ratio+"%");document.getElementById("jv-duration-limit").textContent=admin||Number(d.maxSeconds)>=100000000?"Illimitée":(Number(d.maxSeconds||0)>=60?Math.round(Number(d.maxSeconds)/60)+" min":Number(d.maxSeconds||0)+" s");document.getElementById("jv-generation-quota").textContent=count(gu,gl,admin||gl>=100000000);document.getElementById("jv-storage-quota").textContent=d.storageLimit?Number(d.storageLimit).toLocaleString("fr-FR")+" Go":"Selon votre formule";note.textContent=unlimited?"Aucune limite de vidéos pour ce compte":Math.max(0,limit-used)+" vidéo(s) restante(s)";fill.style.width=ratio+"%";}catch(_){plan.textContent="Informations du compte indisponibles";quota.textContent="—";note.textContent="Impossible de lire votre formule pour le moment.";}}else{plan.textContent="Session à actualiser";quota.textContent="—";note.textContent="Reconnectez-vous si nécessaire.";}
    try{const cr=tasks[1].status==="fulfilled"?tasks[1].value:null;if(!cr||!cr.ok)throw Error("Configuration indisponible");const cfg=await cr.json();if(!cfg.url||!cfg.anonKey)throw Error("Configuration incomplète");const pr=await fetch(cfg.url+"/rest/v1/projects?select=id,name,video_name,updated_at&order=updated_at.desc&limit=5",{headers:{apikey:cfg.anonKey,Authorization:"Bearer "+token},cache:"no-store"});if(!pr.ok)throw Error(pr.status===401?"Session expirée : reconnectez-vous.":"Chargement des projets impossible.");const projects=await pr.json();recent.innerHTML="";if(!Array.isArray(projects)||!projects.length){const p=document.createElement("p");p.className="dashboard-muted";p.textContent="Aucun projet enregistré. Créez une vidéo puis enregistrez-la dans le studio.";recent.appendChild(p);}else projects.forEach(x=>{const item=document.createElement("article");item.className="dashboard-project-item";const title=document.createElement("strong");title.textContent=x.name||"Projet sans titre";const meta=document.createElement("span");meta.textContent=[x.video_name,x.updated_at?new Date(x.updated_at).toLocaleDateString("fr-FR"):""].filter(Boolean).join(" · ");item.append(title,meta);recent.appendChild(item);});}catch(err){recent.textContent=err.message||"Impossible de charger les projets récents.";}
  }
  const sidebarNew = document.querySelector(".jv-sidebar-new");
  if (sidebarNew) sidebarNew.addEventListener("click", () => { showStudio(); workspace.scrollIntoView({behavior:"smooth",block:"start"}); });
  document.getElementById("jv-dashboard-create").addEventListener("click", () => {
    showStudio();
    workspace.scrollIntoView({ behavior: "smooth", block: "start" });
  });
  document.getElementById("jv-dashboard-refresh").addEventListener("click", refreshDashboard);
  document.getElementById("jv-promo-create").addEventListener("click",()=>{showStudio();workspace.scrollIntoView({behavior:"smooth",block:"start"});});
  document.getElementById("jv-open-account-settings").addEventListener("click",()=>{showStudio();const tab=document.querySelector('.jv-editor-panel-tab[data-panel="settings"]');if(tab)tab.click();});
  document.getElementById("jv-see-all-plans").addEventListener("click",showSubscription);
  dashboard.querySelectorAll("[data-jv-plan]").forEach(b=>b.addEventListener("click",showSubscription));
  document.getElementById("jv-subscription-back").addEventListener("click",showDashboard);
  document.getElementById("jv-subscription-refresh").addEventListener("click",async()=>{await refreshDashboard();showSubscription();});
  subscriptionPage.querySelectorAll("[data-subscription-plan]").forEach(b=>b.addEventListener("click",async()=>{
    const plan=String(b.dataset.subscriptionPlan||"").toLowerCase().replace(/-/g,"_");
    const note=document.getElementById("jv-subscription-current-note");
    let session=null;try{session=JSON.parse(localStorage.getItem("justevivo_session_v1")||"null")}catch(_){}
    if(!session||!session.access_token){note.textContent="Connectez-vous et confirmez votre adresse e-mail avant de souscrire à une formule.";note.scrollIntoView({behavior:"smooth",block:"nearest"});return;}
    const label=b.textContent;b.disabled=true;b.textContent="Préparation du paiement…";note.textContent="Connexion sécurisée à Dodo Payments…";
    try{
      const response=await fetch(API_URL+"/api/me/pay/create",{method:"POST",headers:{"Content-Type":"application/json",Authorization:"Bearer "+session.access_token},body:JSON.stringify({plan})});
      const data=await response.json().catch(()=>({}));
      if(!response.ok)throw new Error(data.error||"Le paiement n'est pas disponible pour le moment.");
      const url=new URL(data.checkoutUrl||"");
      if(url.protocol!=="https:"||!url.hostname.endsWith("dodopayments.com"))throw new Error("Lien de paiement non reconnu. Contactez le support.");
      note.textContent="Redirection vers le paiement sécurisé…";window.location.assign(url.href);
    }catch(e){note.textContent=e.message||"Impossible de lancer le paiement. Réessayez.";}
    finally{b.disabled=false;b.textContent=label;}
  }));
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
      } else if (link.dataset.page === "pricing") {
        showSubscription();
      } else if (link.dataset.page === "upcoming") {
        showDashboard();
        const features = dashboard.querySelector(".jv-feature-directory");
        if (features) features.scrollIntoView({behavior:"smooth",block:"start"});
      } else {
        showStudio();
        if (link.dataset.page === "production") {
          const productionTab = document.querySelector('#jv-creative-suite .jv-suite-tabs [data-tab="production"]');
          if (productionTab) productionTab.click();
          const productionView = document.querySelector('#jv-creative-suite [data-view="production"]');
          if (productionView) productionView.scrollIntoView({behavior:"smooth",block:"start"});
          setActive("production");
          return;
        }
        const panel = link.dataset.jvPanel;
        if (panel) {
          const tab = document.querySelector('.jv-editor-panel-tab[data-panel="' + panel + '"]');
          if (tab) tab.click();
        }
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


  // Centre des nouveautés : accès direct aux outils récemment ajoutés.
  const featureStyle=document.createElement("style");
  featureStyle.textContent=`
    .jv-heading-actions{display:flex;gap:9px;align-items:center;flex-wrap:wrap}
    .jv-new-features-trigger{border:1px solid #e5dafa;background:#f6f0ff;color:#743bd1;border-radius:12px;padding:11px 15px;font:700 13px system-ui;cursor:pointer}
    .jv-new-features-trigger:hover{background:#eee3ff}
    .jv-feature-hub{position:fixed;z-index:9998;inset:0;background:#10132380;display:grid;place-items:center;padding:18px}
    .jv-feature-hub[hidden]{display:none}
    .jv-feature-hub-card{width:min(560px,100%);max-height:85vh;overflow:auto;background:#fff;color:#25233a;border-radius:20px;padding:22px;box-shadow:0 24px 80px #090b1c55}
    .jv-feature-hub-head{display:flex;justify-content:space-between;align-items:center;gap:12px;margin-bottom:16px}
    .jv-feature-hub-head h3{margin:0;font-size:20px}
    .jv-feature-hub-close{border:0;background:#f1eff7;border-radius:10px;padding:8px 12px;font-size:18px;cursor:pointer}
    .jv-feature-hub-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px}
    .jv-feature-hub-grid button{display:flex;align-items:center;gap:12px;text-align:left;border:1px solid #e8e5ef;background:#fff;border-radius:13px;padding:13px;cursor:pointer;color:#28243b}
    .jv-feature-hub-grid button b{display:grid;place-items:center;width:38px;height:38px;flex:0 0 38px;border-radius:11px;background:#f3eaff;color:#8446d8;font-size:19px}
    .jv-feature-hub-grid small{display:block;color:#77758a;margin-top:3px;font-size:11px}
    .jv-feature-hub-note{font-size:12px;color:#77758a;line-height:1.5;margin:16px 0 0}
    .jv-feature-page{background:#fff;border:1px solid #e8e5ef;border-radius:18px;padding:22px;margin-bottom:18px}
    .jv-feature-page h3{margin:4px 0 8px}.jv-feature-page p{color:#77758a;line-height:1.55}
    .jv-feature-form{display:grid;gap:12px;max-width:620px}.jv-feature-form label{display:grid;gap:6px;font-size:13px;font-weight:700}
    .jv-feature-form input,.jv-feature-form select,.jv-feature-form textarea{width:100%;box-sizing:border-box;border:1px solid #dedbe8;border-radius:10px;padding:11px;font:inherit;background:#fff;color:#25233a}
    .jv-feature-form button,.jv-feature-action{border:0;border-radius:10px;background:#7542d3;color:white;padding:11px 15px;font-weight:700;cursor:pointer}
    .jv-broll-results{display:grid;grid-template-columns:repeat(auto-fit,minmax(210px,1fr));gap:12px;margin-top:14px}.jv-broll-card{border:1px solid #e8e5ef;border-radius:14px;padding:10px;min-width:0}.jv-broll-card video{width:100%;max-height:220px;object-fit:cover;border-radius:9px;background:#111}.jv-broll-card a,.jv-feature-note{font-size:12px;color:#7542d3}.jv-feature-note{display:block;margin-top:14px;line-height:1.5}.jv-schedule-item{display:flex;justify-content:space-between;gap:12px;padding:12px 0;border-bottom:1px solid #eeeaf4;font-size:13px}
    .jv-feature-grid article[data-feature]{cursor:pointer;transition:transform .15s,border-color .15s}.jv-feature-grid article[data-feature]:hover{transform:translateY(-2px);border-color:#bda2ef}
    @media(max-width:520px){.jv-feature-hub-grid{grid-template-columns:1fr}.jv-feature-page{padding:16px}}
  `;
  document.head.appendChild(featureStyle);
  const featureHub=document.createElement("div");
  featureHub.className="jv-feature-hub";featureHub.id="jv-feature-hub";featureHub.hidden=true;
  featureHub.innerHTML='<div class="jv-feature-hub-card" role="dialog" aria-modal="true" aria-labelledby="jv-feature-hub-title"><div class="jv-feature-hub-head"><h3 id="jv-feature-hub-title">Nouveautés JUSTEVIVO</h3><button type="button" class="jv-feature-hub-close" aria-label="Fermer">×</button></div><div class="jv-feature-hub-grid"><button data-feature-go="ai-video"><b>🎬</b><span>Génération vidéo IA<small>Créer des scènes à partir d’un texte</small></span></button><button data-feature-go="production"><b>✦</b><span>Production IA<small>Outils de création assistée</small></span></button><button data-feature-go="broll"><b>◉</b><span>B-Roll & médias<small>Ajouter des plans complémentaires</small></span></button><button data-feature-go="dubbing"><b>文</b><span>Traduction & doublage<small>Traduire puis travailler la voix</small></span></button><button data-feature-go="calendar"><b>◷</b><span>Calendrier éditorial<small>Planifier vos publications</small></span></button><button data-feature-go="team"><b>♧</b><span>Partager un projet<small>Inviter un collaborateur par e-mail</small></span></button></div><p class="jv-feature-hub-note">Les vidéos B-Roll proviennent de Wikimedia Commons : vérifiez les licences avant usage. Les projets partagés permettent une édition collaborative enregistrée ; la synchronisation caractère par caractère n’est pas activée. La publication automatique exige les autorisations officielles des plateformes.</p></div>';
  document.body.appendChild(featureHub);
  const featureTrigger=document.getElementById("jv-new-features-trigger");
  const closeFeatureHub=()=>{featureHub.hidden=true;featureTrigger.setAttribute("aria-expanded","false");};
  featureTrigger.addEventListener("click",()=>{featureHub.hidden=!featureHub.hidden;featureTrigger.setAttribute("aria-expanded",String(!featureHub.hidden));});
  featureHub.querySelector(".jv-feature-hub-close").addEventListener("click",closeFeatureHub);
  featureHub.addEventListener("click",e=>{if(e.target===featureHub)closeFeatureHub();});
  document.addEventListener("keydown",e=>{if(e.key==="Escape")closeFeatureHub();});

  let featurePage=document.getElementById("jv-feature-workspace");
  if(!featurePage){featurePage=document.createElement("section");featurePage.id="jv-feature-workspace";featurePage.className="workspace-page";featurePage.hidden=true;workspace.insertBefore(featurePage,workspace.querySelector(".upload-zone"));}
  function openFeaturePage(html){
    showStudio();featurePage.hidden=false;studioParts.forEach(el=>{el.hidden=true;});featurePage.innerHTML='<div class="jv-feature-page"><button type="button" class="jv-profile-edit" id="jv-feature-back">← Retour au studio</button><span class="jv-account-eyebrow">JUSTEVIVO · OUTILS</span>'+html+'</div>';
    featurePage.querySelector("#jv-feature-back").addEventListener("click",()=>{featurePage.hidden=true;studioParts.forEach(el=>{el.hidden=false;});});
    setActive("dashboard");featurePage.scrollIntoView({behavior:"smooth",block:"start"});
  }
  function openCalendar(){
    const platformUrls={Instagram:"https://www.instagram.com/",Facebook:"https://www.facebook.com/",TikTok:"https://www.tiktok.com/upload",YouTube:"https://studio.youtube.com/",LinkedIn:"https://www.linkedin.com/feed/"};
    let items=[];
    let calendarClient=null,calendarChannel=null;
    openFeaturePage('<h3>Calendrier éditorial & publication</h3><p>Les publications planifiées sont enregistrées dans votre compte JUSTEVIVO et restent accessibles sur vos appareils. La mise en ligne automatique sera activée après connexion officielle de chaque réseau social.</p><form class="jv-feature-form" id="jv-calendar-form"><label>Réseau<select name="network"><option>Instagram</option><option>Facebook</option><option>TikTok</option><option>YouTube</option><option>LinkedIn</option></select></label><label>Titre de la publication<input name="title" required maxlength="120" placeholder="Ex. Présentation du nouveau produit"></label><label>Date et heure<input name="date" type="datetime-local" required></label><label>Légende / texte<textarea name="caption" rows="3" maxlength="3000" placeholder="Votre texte prêt à publier…"></textarea></label><button type="submit">Enregistrer la programmation</button></form><p id="jv-calendar-status" aria-live="polite">Chargement de votre calendrier…</p><div class="jv-dub-actions"><button type="button" class="jv-feature-action" id="jv-calendar-ics">Exporter les rappels (.ics)</button><button type="button" class="jv-profile-edit" id="jv-calendar-export">Exporter les publications (.csv)</button></div><h4>Publications planifiées</h4><div id="jv-calendar-list"></div><p class="jv-feature-note">Important : la programmation est enregistrée sur le serveur. Pour publier automatiquement, vous devrez connecter vos comptes Meta, TikTok, YouTube ou LinkedIn et autoriser JUSTEVIVO. Ces autorisations développeur sont gratuites, mais les identifiants OAuth doivent être créés par le propriétaire des comptes. Aucune publication n’est envoyée sans cette connexion.</p>');
    const form=featurePage.querySelector("#jv-calendar-form"),list=featurePage.querySelector("#jv-calendar-list"),status=featurePage.querySelector("#jv-calendar-status");
    async function db(method,path,body){
      const token=featureToken();if(!token)throw new Error("Connectez-vous pour accéder au calendrier partagé.");
      const cfg=await fetch(featureApi()+"/api/config").then(x=>x.json());
      if(!cfg.enabled)throw new Error("La base de données n’est pas disponible.");
      const headers={apikey:cfg.anonKey,Authorization:"Bearer "+token};
      if(body!==undefined)headers["Content-Type"]="application/json";
      const res=await fetch(cfg.url+"/rest/v1/"+path,{method,headers,body:body===undefined?undefined:JSON.stringify(body)});
      if(!res.ok){const err=await res.json().catch(()=>({}));throw new Error(err.message||err.error||"Erreur d’accès au calendrier.");}
      return res.status===204?[]:res.json().catch(()=>[]);
    }
    const decodeUser=()=>{try{return JSON.parse(decodeURIComponent(escape(atob(featureToken().split(".")[1].replace(/-/g,"+").replace(/_/g,"/"))))).sub}catch(_){return null}};
    const render=()=>{
      list.replaceChildren();
      if(!items.length){list.textContent="Aucune publication programmée.";return;}
      items.sort((a,b)=>a.scheduled_at.localeCompare(b.scheduled_at)).forEach(item=>{
        const row=document.createElement("div");row.className="jv-schedule-item";
        const info=document.createElement("span");info.textContent=item.network+" · "+item.title+" — "+new Date(item.scheduled_at).toLocaleString("fr-FR")+" · "+(item.status==="published"?"Publiée":item.status==="failed"?"Échec":item.status==="needs_connection"?"Connexion requise":"Programmée");
        const actions=document.createElement("span");
        const publish=document.createElement("button");publish.type="button";publish.className="jv-profile-edit";publish.textContent="Ouvrir le réseau";
        publish.addEventListener("click",async()=>{if(item.caption&&navigator.clipboard){try{await navigator.clipboard.writeText(item.caption)}catch(_){}}window.open(platformUrls[item.network]||"https://www.facebook.com/","_blank","noopener");});
        const del=document.createElement("button");del.type="button";del.textContent="Supprimer";del.className="jv-profile-edit";
        del.addEventListener("click",async()=>{try{await db("DELETE","scheduled_posts?id=eq."+encodeURIComponent(item.id));items=items.filter(x=>x.id!==item.id);render();status.textContent="Publication supprimée.";}catch(e){status.textContent=e.message;}});
        actions.append(publish,del);row.append(info,actions);list.append(row);
      });
    };
    async function load(){
      try{
        items=await db("GET","scheduled_posts?select=id,network,title,caption,scheduled_at,status,created_at&order=scheduled_at.asc");
        render();status.textContent="Calendrier synchronisé avec votre compte.";
        const cfg=await fetch(featureApi()+"/api/config").then(x=>x.json());
        const token=featureToken();
        if(window.supabase?.createClient&&cfg.enabled&&token){
          calendarClient=window.supabase.createClient(cfg.url,cfg.anonKey,{auth:{persistSession:false,autoRefreshToken:false},global:{headers:{Authorization:"Bearer "+token}}});
          calendarClient.realtime.setAuth(token);
          calendarChannel=calendarClient.channel("jv-scheduled-posts-"+(decodeUser()||"user")).on("postgres_changes",{event:"*",schema:"public",table:"scheduled_posts"},()=>load()).subscribe();
        }
      }catch(e){status.textContent=e.message;}
    }
    form.addEventListener("submit",async e=>{
      e.preventDefault();const data=Object.fromEntries(new FormData(form).entries());
      if(!data.title.trim()||!data.date)return;
      const userId=decodeUser();if(!userId){status.textContent="Session invalide. Reconnectez-vous.";return;}
      const scheduledAt=new Date(data.date).toISOString();
      if(new Date(scheduledAt)<=new Date()){status.textContent="Choisissez une date future.";return;}
      const submit=form.querySelector('button[type="submit"]');submit.disabled=true;status.textContent="Enregistrement sur le serveur…";
      try{
        const created=await db("POST","scheduled_posts",{user_id:userId,network:data.network,title:data.title.trim(),caption:data.caption||"",scheduled_at:scheduledAt,status:"scheduled"});
        if(created?.[0])items.push(created[0]);else await load();
        form.reset();render();status.textContent="Publication programmée et sauvegardée dans votre compte. La mise en ligne attend la connexion officielle du réseau.";
      }catch(err){status.textContent=err.message;}finally{submit.disabled=false;}
    });
    featurePage.querySelector("#jv-calendar-ics").addEventListener("click",()=>{
      const esc=s=>String(s||"").replace(/\\/g,"\\\\").replace(/\n/g,"\\n").replace(/,/g,"\\,").replace(/;/g,"\\;");
      const stamp=d=>new Date(d).toISOString().replace(/[-:]/g,"").replace(/\.\d{3}/,"Z");
      const events=items.map((x,i)=>"BEGIN:VEVENT\r\nUID:justevivo-"+x.id+"@justevivo\r\nDTSTAMP:"+stamp(new Date())+"\r\nDTSTART:"+stamp(x.scheduled_at)+"\r\nSUMMARY:"+esc(x.network+" · "+x.title)+"\r\nDESCRIPTION:"+esc(x.caption)+"\r\nEND:VEVENT").join("\r\n");
      const blob=new Blob(["BEGIN:VCALENDAR\r\nVERSION:2.0\r\nPRODID:-//JUSTEVIVO//Editorial Calendar//FR\r\n"+events+"\r\nEND:VCALENDAR"],{type:"text/calendar;charset=utf-8"});const url=URL.createObjectURL(blob),a=document.createElement("a");a.href=url;a.download="justevivo-calendrier.ics";a.click();setTimeout(()=>URL.revokeObjectURL(url),10000);
    });
    featurePage.querySelector("#jv-calendar-export").addEventListener("click",()=>{
      const rows=[["Réseau","Titre","Date","Légende","Statut"],...items.map(x=>[x.network,x.title,x.scheduled_at,x.caption,x.status])];
      const csv=rows.map(row=>row.map(v=>'"'+String(v||"").replace(/"/g,'""')+'"').join(",")).join("\r\n");
      const url=URL.createObjectURL(new Blob(["\ufeff"+csv],{type:"text/csv;charset=utf-8"})),a=document.createElement("a");a.href=url;a.download="justevivo-publications.csv";a.click();setTimeout(()=>URL.revokeObjectURL(url),10000);
    });
    load();
  }
  function openTeam(){
    openFeaturePage('<h3>Projets partagés & collaboration</h3><p>Vous pouvez inviter un autre utilisateur à consulter ou modifier un projet JUSTEVIVO. L’invitation est sécurisée, liée à son adresse e-mail et valable 7 jours.</p><ol><li>Ouvrez « Mes projets » dans le menu du studio.</li><li>Choisissez le projet puis « Partager / inviter ».</li><li>Saisissez l’adresse e-mail du collaborateur et choisissez lecture seule ou modification.</li><li>Envoyez le lien d’invitation. Le collaborateur doit se connecter avec cette adresse e-mail.</li></ol><p>Les projets partagés sont enregistrés dans le même espace et peuvent être modifiés par les personnes autorisées. Les fichiers vidéo locaux doivent être importés séparément sur chaque appareil.</p><button type="button" class="jv-feature-action" id="jv-open-projects">Ouvrir Mes projets</button><p class="jv-feature-note">La coédition est basée sur des projets partagés et des sauvegardes communes. Les curseurs et la synchronisation instantanée en direct ne sont pas encore activés.</p>');
    featurePage.querySelector("#jv-open-projects").addEventListener("click",()=>{const link=links.find(x=>x.dataset.page==="projects");if(link)link.click();});
  }

  const featureApi=()=>typeof API_URL!=="undefined"?API_URL:"https://justevivo-backend.onrender.com";
  const featureToken=()=>{try{return JSON.parse(localStorage.getItem("justevivo_session_v1")||"null")?.access_token||""}catch(_){return ""}};
  async function featureFetch(path,options={}){
    const t=featureToken();if(!t)throw new Error("Connectez-vous pour utiliser cet outil.");
    const response=await fetch(featureApi()+path,{...options,headers:{Authorization:"Bearer "+t,...(options.headers||{})}});
    if(!response.ok){const data=await response.json().catch(()=>({}));throw new Error(data.error||"Service momentanément indisponible.");}
    return response;
  }
  async function openBroll(){
    openFeaturePage('<h3>B-Roll gratuit</h3><p>Recherchez des vidéos sur Wikimedia Commons, bibliothèque publique gratuite. Vérifiez la licence et les conditions d’attribution affichées pour chaque fichier avant toute utilisation commerciale.</p><form class="jv-feature-form" id="jv-broll-form"><label>Mot-clé<input name="q" required minlength="2" placeholder="Ex. cuisine, entrepreneuriat, nature…"></label><label>Format<select name="orientation"><option value="all">Tous les formats</option><option value="portrait">Vertical</option><option value="landscape">Paysage</option><option value="square">Carré</option></select></label><button type="submit">Rechercher des vidéos gratuites</button></form><p id="jv-broll-status" aria-live="polite"></p><div id="jv-broll-results" class="jv-broll-results"></div>');
    const form=featurePage.querySelector("#jv-broll-form"),status=featurePage.querySelector("#jv-broll-status"),results=featurePage.querySelector("#jv-broll-results");
    form.addEventListener("submit",async e=>{e.preventDefault();const d=new FormData(form);status.textContent="Recherche dans Wikimedia Commons…";results.replaceChildren();try{const response=await featureFetch("/api/media/broll?q="+encodeURIComponent(d.get("q"))+"&orientation="+encodeURIComponent(d.get("orientation")));const data=await response.json();status.textContent=data.total_results+" vidéo(s) trouvée(s).";data.videos.forEach(v=>{const card=document.createElement("article");card.className="jv-broll-card";const video=document.createElement("video");video.controls=true;video.preload="none";video.playsInline=true;video.src=v.url;if(v.thumbnail)video.poster=v.thumbnail;const title=document.createElement("strong");title.textContent=v.title;const meta=document.createElement("p");meta.textContent=(v.width&&v.height?v.width+" × "+v.height+" · ":"")+v.license;const author=document.createElement("p");author.textContent="Auteur : "+v.artist;const source=document.createElement("a");source.href=v.pageUrl;source.target="_blank";source.rel="noopener";source.textContent="Voir la licence et la source";const download=document.createElement("a");download.href=v.url;download.target="_blank";download.rel="noopener";download.textContent="Ouvrir / télécharger la vidéo";card.append(video,title,meta,author,source,document.createElement("br"),download);results.append(card);});if(!data.videos.length)status.textContent="Aucun fichier vidéo correspondant. Essayez un mot-clé en anglais.";}catch(err){status.textContent=err.message;}});
  }
  async function openDubbing(){
    openFeaturePage('<h3>Traduction & doublage multilingue</h3><p>Traduisez vos scripts avec le moteur Groq déjà configuré pour JUSTEVIVO, puis écoutez la version traduite avec les voix installées sur votre appareil. Vous pouvez copier ou télécharger le texte traduit.</p><form class="jv-feature-form" id="jv-dub-form"><label>Texte original<textarea name="text" rows="6" required maxlength="5000" placeholder="Collez votre script ou transcription…"></textarea></label><label>Langue source<select name="source"><option value="auto">Détection automatique</option><option value="fr">Français</option><option value="en">Anglais</option><option value="pt">Portugais</option><option value="es">Espagnol</option><option value="de">Allemand</option><option value="it">Italien</option><option value="ar">Arabe</option></select></label><label>Langue cible<select name="target"><option value="fr">Français</option><option value="en">Anglais</option><option value="pt">Portugais</option><option value="es">Espagnol</option><option value="de">Allemand</option><option value="it">Italien</option><option value="ar">Arabe</option><option value="ja">Japonais</option><option value="zh">Chinois</option><option value="ru">Russe</option></select></label><button type="submit" id="jv-dub-translate">Traduire le texte</button></form><label class="jv-feature-form" style="margin-top:14px">Texte traduit<textarea id="jv-dub-output" rows="6" readonly placeholder="La traduction apparaîtra ici…"></textarea></label><div class="jv-dub-actions"><button type="button" class="jv-feature-action" id="jv-dub-copy" disabled>Copier la traduction</button><button type="button" class="jv-feature-action" id="jv-dub-download" disabled>Télécharger TXT</button><button type="button" class="jv-feature-action" id="jv-dub-speak" disabled>▶ Écouter</button><button type="button" class="jv-profile-edit" id="jv-dub-stop">■ Arrêter</button></div><label class="jv-feature-form" style="margin-top:12px">Voix installée<select id="jv-device-voice"></select></label><p id="jv-dub-status" aria-live="polite"></p><p class="jv-feature-note">La traduction IA utilise le quota quotidien et la clé Groq déjà configurée sur JUSTEVIVO. La synthèse vocale locale est gratuite ; les voix disponibles dépendent de votre téléphone ou ordinateur. L’export audio MP3 n’est pas inclus dans cette fonction.</p>');
    const form=featurePage.querySelector("#jv-dub-form"),status=featurePage.querySelector("#jv-dub-status"),output=featurePage.querySelector("#jv-dub-output"),voiceSelect=featurePage.querySelector("#jv-device-voice"),translate=featurePage.querySelector("#jv-dub-translate"),copy=featurePage.querySelector("#jv-dub-copy"),download=featurePage.querySelector("#jv-dub-download"),speak=featurePage.querySelector("#jv-dub-speak"),stop=featurePage.querySelector("#jv-dub-stop");
    const loadVoices=()=>{if(!("speechSynthesis" in window))return;const previous=voiceSelect.value;voiceSelect.replaceChildren();speechSynthesis.getVoices().forEach((v,i)=>{const o=document.createElement("option");o.value=String(i);o.textContent=v.name+" ("+v.lang+")";voiceSelect.append(o);});if(previous)voiceSelect.value=previous;};
    loadVoices();if("speechSynthesis" in window)speechSynthesis.onvoiceschanged=loadVoices;
    form.addEventListener("submit",async e=>{e.preventDefault();const d=new FormData(form),text=String(d.get("text")||"").trim();if(!text)return;translate.disabled=true;status.textContent="Traduction en cours…";output.value="";[copy,download,speak].forEach(x=>x.disabled=true);try{const response=await featureFetch("/api/video/translate-clips",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({sourceLanguage:d.get("source"),targetLanguage:d.get("target"),candidates:[{start:0,end:1,text}]})});const result=await response.json();output.value=result.candidates?.[0]?.translatedText||"";if(!output.value)throw new Error("Le moteur n’a pas retourné de traduction.");[copy,download,speak].forEach(x=>x.disabled=false);status.textContent="Traduction terminée. Vous pouvez copier, télécharger ou écouter le résultat.";}catch(err){status.textContent=err.message;}finally{translate.disabled=false;}});
    copy.addEventListener("click",async()=>{if(!output.value)return;try{await navigator.clipboard.writeText(output.value);status.textContent="Traduction copiée.";}catch(_){output.select();status.textContent="Sélectionnez le texte puis copiez-le.";}});
    download.addEventListener("click",()=>{if(!output.value)return;const blob=new Blob([output.value],{type:"text/plain;charset=utf-8"}),url=URL.createObjectURL(blob),a=document.createElement("a");a.href=url;a.download="justevivo-traduction.txt";a.click();setTimeout(()=>URL.revokeObjectURL(url),10000);});
    speak.addEventListener("click",()=>{if(!output.value||!("speechSynthesis" in window)){status.textContent="Synthèse vocale indisponible sur cet appareil.";return;}speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(output.value),lang=String(new FormData(form).get("target")||"fr");u.lang=({fr:"fr-FR",en:"en-US",pt:"pt-PT",es:"es-ES",de:"de-DE",it:"it-IT",ar:"ar-SA",ja:"ja-JP",zh:"zh-CN",ru:"ru-RU"})[lang]||"fr-FR";const selected=speechSynthesis.getVoices()[Number(voiceSelect.value)];if(selected)u.voice=selected;u.onend=()=>{status.textContent="Lecture terminée."};speechSynthesis.speak(u);});
    stop.addEventListener("click",()=>{if("speechSynthesis" in window)speechSynthesis.cancel();status.textContent="Lecture arrêtée.";});
  }
  function goFeature(name){
    closeFeatureHub();
    if(name==="ai-video"||name==="production"){showStudio();featurePage.hidden=true;studioParts.forEach(el=>{el.hidden=false;});const nav=links.find(l=>l.dataset.page===name);if(nav)nav.click();return;}
    if(name==="broll"){openBroll();return;}
    if(name==="dubbing"){openDubbing();return;}if(name==="calendar"){openCalendar();return;}if(name==="team"){openTeam();return;}
  }
  featureHub.querySelectorAll("[data-feature-go]").forEach(b=>b.addEventListener("click",()=>goFeature(b.dataset.featureGo)));
  dashboard.querySelectorAll(".jv-feature-grid article").forEach(card=>{
    const title=(card.querySelector("strong")?.textContent||"").toLowerCase();
    const feature=title.includes("b-roll")?"broll":title.includes("doublage")?"dubbing":title.includes("publication")?"calendar":title.includes("collaboration")?"team":null;
    if(feature){card.dataset.feature=feature;card.setAttribute("role","button");card.setAttribute("tabindex","0");const activate=()=>goFeature(feature);card.addEventListener("click",activate);card.addEventListener("keydown",e=>{if(e.key==="Enter"||e.key===" "){e.preventDefault();activate();}});}
  });

  // Entrée initiale : conserver le dashboard comme page d'accueil.
  showDashboard();
});
