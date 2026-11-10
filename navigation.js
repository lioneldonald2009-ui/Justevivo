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
      <div class="workspace-page-heading">
        <h3>Tableau de bord</h3>
        <p>Votre activité et vos accès JUSTEVIVO.</p>
      </div>
      <div class="dashboard-grid">
        <article class="dashboard-card dashboard-account">
          <span class="dashboard-kicker">VOTRE COMPTE</span>
          <strong class="dashboard-value" id="jv-account-email">Chargement…</strong>
          <p class="dashboard-muted" id="jv-account-plan">Informations de votre formule</p>
        </article>
        <article class="dashboard-card">
          <span class="dashboard-kicker">VIDÉOS CE MOIS-CI</span>
          <strong class="dashboard-value" id="jv-quota-value">—</strong>
          <p class="dashboard-muted" id="jv-quota-note">Votre consommation apparaîtra ici.</p>
          <div class="dashboard-progress"><span class="dashboard-progress-fill" id="jv-quota-fill"></span></div>
        </article>
      </div>
      <section class="dashboard-recent" aria-labelledby="jv-dashboard-recent-title">
        <div class="dashboard-recent-head">
          <h4 id="jv-dashboard-recent-title">Projets récents</h4>
          <button type="button" class="button ghost" id="jv-dashboard-refresh">Actualiser</button>
        </div>
        <div id="jv-dashboard-recent-list" class="dashboard-recent-list" aria-live="polite">
          <p class="dashboard-muted">Chargement des projets…</p>
        </div>
      </section>
      <div class="dashboard-actions">
        <button type="button" class="button primary" id="jv-dashboard-create">＋ Créer une vidéo</button>
        <button type="button" class="button ghost" id="jv-dashboard-projects">Voir tous mes projets</button>
      </div>`;
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
    const email = document.getElementById("jv-account-email");
    const plan = document.getElementById("jv-account-plan");
    const quota = document.getElementById("jv-quota-value");
    const note = document.getElementById("jv-quota-note");
    const fill = document.getElementById("jv-quota-fill");
    const recent = document.getElementById("jv-dashboard-recent-list");
    let session = null;
    try { session = JSON.parse(localStorage.getItem("justevivo_session_v1") || "null"); } catch (_) {}
    if (!session || !session.access_token) {
      email.textContent = "Compte non connecté";
      plan.textContent = "Connectez-vous pour retrouver votre formule.";
      quota.textContent = "—";
      note.textContent = "Statistiques disponibles après connexion.";
      fill.style.width = "0%";
      recent.textContent = "Connectez-vous pour afficher vos projets récents.";
      return;
    }

    email.textContent = session.email || "Compte connecté";
    recent.textContent = "Chargement des projets…";
    const authHeaders = { Authorization: "Bearer " + session.access_token };
    const tasks = await Promise.allSettled([
      fetch(API_URL + "/api/me", { headers: authHeaders, cache: "no-store" }),
      fetch(API_URL + "/api/config", { cache: "no-store" })
    ]);

    if (tasks[0].status === "fulfilled" && tasks[0].value.ok) {
      try {
        const data = await tasks[0].value.json();
        if (!data || !data.enabled) throw new Error("Données de compte indisponibles");
        plan.textContent = "Formule " + (data.planName || data.plan || "Gratuit");
        const used = Number(data.videosUsed || 0);
        const limit = Number(data.videosLimit || 0);
        quota.textContent = limit > 0 ? used + " / " + limit : (data.isAdmin ? "Illimité" : String(used));
        note.textContent = limit > 0 ? Math.max(0, limit - used) + " vidéo(s) restante(s)" : "Quota selon votre formule";
        fill.style.width = limit > 0 ? Math.min(100, used / limit * 100) + "%" : "0%";
      } catch (_) {
        plan.textContent = "Informations du compte indisponibles";
        quota.textContent = "—";
        note.textContent = "Impossible de lire votre formule pour le moment.";
        fill.style.width = "0%";
      }
    } else {
      plan.textContent = "Session à actualiser";
      quota.textContent = "—";
      note.textContent = "Reconnectez-vous si les informations ne se chargent pas.";
      fill.style.width = "0%";
    }

    // Les projets sont stockés dans Supabase : utiliser la clé publique et le jeton
    // de la session, comme le module « Mes projets » du studio.
    try {
      const configResponse = tasks[1].status === "fulfilled" ? tasks[1].value : null;
      if (!configResponse || !configResponse.ok) throw new Error("Configuration indisponible");
      const config = await configResponse.json();
      if (!config.url || !config.anonKey) throw new Error("Configuration du compte incomplète");
      const projectsResponse = await fetch(
        config.url + "/rest/v1/projects?select=id,name,video_name,updated_at&order=updated_at.desc&limit=5",
        { headers: { apikey: config.anonKey, Authorization: "Bearer " + session.access_token }, cache: "no-store" }
      );
      if (!projectsResponse.ok) throw new Error(projectsResponse.status === 401 ? "Session expirée : reconnectez-vous." : "Chargement des projets impossible.");
      const projects = await projectsResponse.json();
      recent.innerHTML = "";
      if (!Array.isArray(projects) || !projects.length) {
        const empty = document.createElement("p");
        empty.className = "dashboard-muted";
        empty.textContent = "Aucun projet enregistré pour le moment. Créez une vidéo puis enregistrez votre projet dans le studio.";
        recent.appendChild(empty);
      } else {
        projects.forEach(project => {
          const item = document.createElement("article");
          item.className = "dashboard-project-item";
          const title = document.createElement("strong");
          title.textContent = project.name || "Projet sans titre";
          const meta = document.createElement("span");
          const date = project.updated_at ? new Date(project.updated_at).toLocaleDateString("fr-FR") : "";
          meta.textContent = [project.video_name, date].filter(Boolean).join(" · ");
          item.append(title, meta);
          recent.appendChild(item);
        });
      }
    } catch (error) {
      recent.textContent = error.message || "Impossible de charger les projets récents.";
    }
  }
  document.getElementById("jv-dashboard-create").addEventListener("click", () => {
    showStudio();
    workspace.scrollIntoView({ behavior: "smooth", block: "start" });
  });
  document.getElementById("jv-dashboard-refresh").addEventListener("click", refreshDashboard);
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
