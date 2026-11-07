// JUSTEVIVO - Navigation du studio et tableau de bord (interface uniquement)
document.addEventListener("DOMContentLoaded", function () {
  const links = document.querySelectorAll(".sidebar .side-link");
  const workspace = document.querySelector(".workspace");
  const upload = document.querySelector(".upload-zone");
  const editor = document.querySelector(".editor-grid");
  const warning = document.querySelector(".demo-warning");
  const caption = document.getElementById("captionText");
  const controls = document.querySelector(".controls-panel");

  if (!workspace || links.length < 5) return;

  const pages = {};
  const make = (tag, className, text) => {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  };

  function createPage(id, title, description) {
    const page = document.createElement("section");
    page.className = "workspace-page";
    page.hidden = true;
    const heading = make("h3", "workspace-page-title", title);
    const intro = make("p", "workspace-page-intro", description);
    page.append(heading, intro);
    workspace.appendChild(page);
    pages[id] = page;
    return page;
  }

  // Tableau de bord : les données de compte proviennent de l'API déjà utilisée par l'application.
  const dashboard = createPage("dashboard", "Bienvenue sur JUSTEVIVO", "Votre espace de création, en un seul endroit.");
  const dashGrid = make("div", "dashboard-grid");
  const accountCard = make("article", "dashboard-card dashboard-account");
  accountCard.append(make("span", "dashboard-kicker", "VOTRE COMPTE"));
  const accountEmail = make("strong", "dashboard-value", "Compte non connecté");
  const accountPlan = make("p", "dashboard-muted", "Connectez-vous pour afficher votre formule et vos quotas.");
  accountCard.append(accountEmail, accountPlan);

  const quotaCard = make("article", "dashboard-card");
  quotaCard.append(make("span", "dashboard-kicker", "VIDÉOS CE MOIS-CI"));
  const quotaValue = make("strong", "dashboard-value", "—");
  const quotaNote = make("p", "dashboard-muted", "Votre consommation apparaîtra ici.");
  const quotaTrack = make("div", "dashboard-progress");
  const quotaFill = make("span", "dashboard-progress-fill");
  quotaTrack.appendChild(quotaFill);
  quotaCard.append(quotaValue, quotaNote, quotaTrack);
  dashGrid.append(accountCard, quotaCard);

  const dashActions = make("div", "dashboard-actions");
  const createVideo = make("button", "button primary", "＋  Créer une vidéo");
  createVideo.type = "button";
  createVideo.addEventListener("click", () => showPage("studio"));
  const openProjects = make("button", "button ghost", "Voir mes projets");
  openProjects.type = "button";
  openProjects.addEventListener("click", () => showPage("projects"));
  dashActions.append(createVideo, openProjects);
  const recent = make("article", "dashboard-card dashboard-recent");
  recent.append(make("h4", "dashboard-section-title", "Vos projets"));
  recent.append(make("p", "dashboard-muted", "Retrouvez vos créations enregistrées dans la rubrique Mes projets."));
  dashboard.append(dashGrid, dashActions, recent);

  async function refreshDashboard() {
    let session = null;
    try { session = JSON.parse(localStorage.getItem("justevivo_session_v1") || "null"); } catch (e) {}
    if (!session || !session.access_token) {
      accountEmail.textContent = "Compte non connecté";
      accountPlan.textContent = "Connectez-vous pour retrouver votre formule et vos quotas.";
      quotaValue.textContent = "—";
      quotaNote.textContent = "Les statistiques sont disponibles après connexion.";
      quotaFill.style.width = "0%";
      return;
    }

    accountEmail.textContent = session.email || "Compte connecté";
    accountPlan.textContent = "Chargement des informations de votre formule…";
    try {
      if (typeof API_URL === "undefined") throw new Error("API indisponible");
      const response = await fetch(API_URL + "/api/me");
      if (!response.ok) throw new Error("Impossible de récupérer le compte");
      const data = await response.json();
      if (!data || !data.enabled) throw new Error("Informations indisponibles");

      const plan = data.planName || data.plan || "Gratuit";
      accountPlan.textContent = "Formule " + plan + (data.isAdmin ? " · Accès administrateur" : "");
      const used = Number(data.videosUsed || 0);
      const limit = Number(data.videosLimit || 0);
      quotaValue.textContent = limit > 0 ? used + " / " + limit : (data.isAdmin ? "Illimité" : used + " vidéo(s)");
      quotaNote.textContent = limit > 0 ? Math.max(0, limit - used) + " vidéo(s) restante(s) ce mois-ci" : "Quota selon votre formule";
      quotaFill.style.width = limit > 0 ? Math.min(100, (used / limit) * 100) + "%" : "0%";
    } catch (error) {
      accountPlan.textContent = "Compte connecté · détails momentanément indisponibles";
      quotaValue.textContent = "—";
      quotaNote.textContent = "Réessayez dans quelques instants.";
      quotaFill.style.width = "0%";
    }
  }

  const projects = createPage("projects", "Mes projets", "Retrouvez ici vos projets enregistrés.");
  const save = make("button", "button primary full", "Enregistrer mon projet");
  save.type = "button";
  projects.appendChild(save);
  const projectList = make("div", "project-list");
  projects.appendChild(projectList);

  const styles = createPage("styles", "Styles de texte", "Choisissez et personnalisez vos sous-titres.");
  const styleOptions = controls && controls.querySelector(".style-options");
  if (styleOptions) styles.appendChild(styleOptions);

  const settings = createPage("settings", "Paramètres", "Réglages de votre studio JUSTEVIVO.");
  if (controls) controls.querySelectorAll("details").forEach(item => settings.appendChild(item));

  function showProjects() {
    projectList.replaceChildren();
    let saved = [];
    try { saved = JSON.parse(localStorage.getItem("justevivo_projects") || "[]"); } catch (e) {}
    if (!saved.length) {
      projectList.appendChild(make("p", "dashboard-muted", "Aucun projet enregistré pour le moment."));
      return;
    }
    saved.forEach((item, index) => {
      const card = make("article", "saved-project-card");
      card.append(make("h4", "", item.name || ("Projet " + (index + 1))));
      card.append(make("p", "dashboard-muted", item.text || "Projet sans texte"));
      const actions = make("div", "saved-project-actions");
      const open = make("button", "button primary", "Reprendre");
      open.type = "button";
      open.addEventListener("click", () => {
        if (caption) caption.value = item.text || "";
        showPage("studio");
      });
      const remove = make("button", "button ghost", "Supprimer");
      remove.type = "button";
      remove.addEventListener("click", () => {
        saved.splice(index, 1);
        localStorage.setItem("justevivo_projects", JSON.stringify(saved));
        showProjects();
      });
      actions.append(open, remove);
      card.appendChild(actions);
      projectList.appendChild(card);
    });
  }

  save.addEventListener("click", function () {
    const text = caption ? caption.value : "";
    if (!text.trim()) { alert("Ajoutez d'abord un texte de sous-titres."); return; }
    let saved = [];
    try { saved = JSON.parse(localStorage.getItem("justevivo_projects") || "[]"); } catch (e) {}
    saved.push({ name: "Projet " + (saved.length + 1), text, date: new Date().toISOString() });
    localStorage.setItem("justevivo_projects", JSON.stringify(saved));
    alert("Projet enregistré !");
    showProjects();
  });

  function showPage(page) {
    const studio = page === "studio";
    if (upload) upload.hidden = !studio;
    if (editor) editor.hidden = !studio;
    if (warning) warning.hidden = !studio;
    Object.keys(pages).forEach(id => { pages[id].hidden = id !== page; });

    links.forEach(link => link.classList.toggle("active", link.dataset.page === page));
    const title = workspace.querySelector(".workspace-head h3");
    const description = workspace.querySelector(".workspace-head p");
    const labels = {
      dashboard: ["Tableau de bord", "Votre activité et vos accès JUSTEVIVO."],
      studio: ["Créer une vidéo", "Importez une vidéo pour commencer."],
      projects: ["Mes projets", "Retrouvez vos projets enregistrés."],
      styles: ["Styles de texte", "Personnalisez vos sous-titres."],
      settings: ["Paramètres", "Configurez votre studio."]
    };
    if (title) title.textContent = labels[page][0];
    if (description) description.textContent = labels[page][1];
    if (page === "projects") showProjects();
    if (page === "dashboard") refreshDashboard();
  }

  links.forEach(link => {
    link.style.cursor = "pointer";
    link.addEventListener("click", () => showPage(link.dataset.page));
  });
  showPage("dashboard");
});
