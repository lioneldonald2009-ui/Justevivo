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
      <div class="dashboard-actions">
        <button type="button" class="button primary" id="jv-dashboard-create">＋ Créer une vidéo</button>
        <button type="button" class="button ghost" id="jv-dashboard-projects">Voir mes projets</button>
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
    let session = null;
    try { session = JSON.parse(localStorage.getItem("justevivo_session_v1") || "null"); } catch (_) {}
    if (!session || !session.access_token) {
      email.textContent = "Compte non connecté";
      plan.textContent = "Connectez-vous pour retrouver votre formule.";
      quota.textContent = "—";
      note.textContent = "Statistiques disponibles après connexion.";
      fill.style.width = "0%";
      return;
    }
    email.textContent = session.email || "Compte connecté";
    try {
      if (typeof API_URL === "undefined") throw new Error("API indisponible");
      const response = await fetch(API_URL + "/api/me");
      if (!response.ok) throw new Error("API indisponible");
      const data = await response.json();
      if (!data || !data.enabled) throw new Error("Données indisponibles");
      plan.textContent = "Formule " + (data.planName || data.plan || "Gratuit");
      const used = Number(data.videosUsed || 0);
      const limit = Number(data.videosLimit || 0);
      quota.textContent = limit > 0 ? used + " / " + limit : (data.isAdmin ? "Illimité" : String(used));
      note.textContent = limit > 0 ? Math.max(0, limit - used) + " vidéo(s) restante(s)" : "Quota selon votre formule";
      fill.style.width = limit > 0 ? Math.min(100, used / limit * 100) + "%" : "0%";
    } catch (_) {
      plan.textContent = "Compte connecté · informations indisponibles";
      quota.textContent = "—";
      note.textContent = "Réessayez dans quelques instants.";
      fill.style.width = "0%";
    }
  }

  document.getElementById("jv-dashboard-create").addEventListener("click", () => {
    showStudio();
    workspace.scrollIntoView({ behavior: "smooth", block: "start" });
  });
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
