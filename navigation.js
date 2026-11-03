// JUSTEVIVO - Navigation des menus
document.addEventListener("DOMContentLoaded", function () {
  const links = document.querySelectorAll(".sidebar .side-link");
  const workspace = document.querySelector(".workspace");
  const upload = document.querySelector(".upload-zone");
  const editor = document.querySelector(".editor-grid");
  const warning = document.querySelector(".demo-warning");
  const caption = document.getElementById("captionText");
  const controls = document.querySelector(".controls-panel");

  if (!workspace || links.length < 4) return;

  const pages = {};

  function createPage(id, title, description) {
    const page = document.createElement("section");
    page.hidden = true;
    page.style.marginTop = "20px";
    page.innerHTML = "<h3>" + title + "</h3><p>" + description + "</p>";
    workspace.appendChild(page);
    pages[id] = page;
    return page;
  }

  const projects = createPage(
    "projects",
    "Mes projets",
    "Retrouve ici tes projets enregistrés."
  );

  const save = document.createElement("button");
  save.textContent = "Enregistrer mon projet";
  save.className = "button primary full";
  projects.appendChild(save);

  const projectList = document.createElement("div");
  projects.appendChild(projectList);

  const styles = createPage(
    "styles",
    "Styles de texte",
    "Choisis et personnalise tes sous-titres."
  );

  const styleOptions = controls.querySelector(".style-options");
  if (styleOptions) styles.appendChild(styleOptions);

  const settings = createPage(
    "settings",
    "Paramètres",
    "Réglages de ton studio JUSTEVIVO."
  );

  const settingDetails = controls.querySelectorAll("details");
  settingDetails.forEach(item => settings.appendChild(item));

  function showProjects() {
    projectList.innerHTML = "";
    let saved = [];

    try {
      saved = JSON.parse(localStorage.getItem("justevivo_projects") || "[]");
    } catch (e) {}

    if (!saved.length) {
      projectList.textContent = "Aucun projet enregistré pour le moment.";
      return;
    }

    saved.forEach((item, index) => {
      const card = document.createElement("div");
      card.style.padding = "12px";
      card.style.marginTop = "10px";
      card.style.border = "1px solid #555";
      card.style.borderRadius = "10px";

      const title = document.createElement("h4");
      title.textContent = item.name;

      const text = document.createElement("p");
      text.textContent = item.text;

      const open = document.createElement("button");
      open.textContent = "Reprendre";
      open.onclick = function () {
        caption.value = item.text;
        showPage("studio");
      };

      const remove = document.createElement("button");
      remove.textContent = "Supprimer";
      remove.style.marginLeft = "8px";
      remove.onclick = function () {
        saved.splice(index, 1);
        localStorage.setItem("justevivo_projects", JSON.stringify(saved));
        showProjects();
      };

      card.append(title, text, open, remove);
      projectList.appendChild(card);
    });
  }

  save.onclick = function () {
    const text = caption ? caption.value : "";

    if (!text.trim()) {
      alert("Ajoute d'abord un texte de sous-titres.");
      return;
    }

    let saved = [];
    try {
      saved = JSON.parse(localStorage.getItem("justevivo_projects") || "[]");
    } catch (e) {}

    saved.push({
      name: "Projet " + (saved.length + 1),
      text: text,
      date: new Date().toISOString()
    });

    localStorage.setItem("justevivo_projects", JSON.stringify(saved));
    alert("Projet enregistré !");
    showProjects();
  };

  function showPage(page) {
    const studio = page === "studio";

    if (upload) upload.hidden = !studio;
    if (editor) editor.hidden = !studio;
    if (warning) warning.hidden = !studio;

    Object.keys(pages).forEach(id => {
      pages[id].hidden = id !== page;
    });

    links.forEach((link, index) => {
      link.classList.toggle(
        "active",
        ["studio", "projects", "styles", "settings"][index] === page
      );
    });

    const title = workspace.querySelector(".workspace-head h3");
    const description = workspace.querySelector(".workspace-head p");

    if (title) {
      title.textContent = {
        studio: "Créer une vidéo",
        projects: "Mes projets",
        styles: "Styles de texte",
        settings: "Paramètres"
      }[page];
    }

    if (description) {
      description.textContent = {
        studio: "Importe une vidéo pour commencer.",
        projects: "Retrouve tes projets enregistrés.",
        styles: "Personnalise tes sous-titres.",
        settings: "Configure ton studio."
      }[page];
    }

    if (page === "projects") showProjects();
  }

  ["studio", "projects", "styles", "settings"].forEach((page, index) => {
    links[index].style.cursor = "pointer";
    links[index].addEventListener("click", () => showPage(page));
  });

  showPage("studio");
});
