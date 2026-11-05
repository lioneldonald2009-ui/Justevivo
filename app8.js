
// JUSTEVIVO — app8.js
// Barre d'outils du studio — correction de la recherche des scènes
(function () {
  "use strict";

  const TOOL_ID = "justevivo-editor-toolbar";
  let initialized = false;

  const css = `
    #${TOOL_ID}{
      display:flex;gap:8px;align-items:stretch;overflow-x:auto;
      padding:10px;margin:16px 0 14px;background:#0b1122;
      border:1px solid #293554;border-radius:13px;
      scrollbar-width:thin
    }
    #${TOOL_ID} .jv-tool{
      flex:0 0 82px;min-height:66px;padding:9px 7px;
      display:flex;flex-direction:column;align-items:center;
      justify-content:center;gap:6px;color:#aeb8d0;
      background:#121a30;border:1px solid #35415f;
      border-radius:10px;font:700 10px/1.2 Arial,sans-serif;
      cursor:pointer;transition:background .18s,border-color .18s
    }
    #${TOOL_ID} .jv-tool:hover{
      border-color:#9b65ff;background:#211a3d
    }
    #${TOOL_ID} .jv-tool[aria-pressed="true"]{
      color:#eadfff;border-color:#a879ff;background:#302052;
      box-shadow:0 0 0 1px #a879ff33 inset
    }
    #${TOOL_ID} .jv-tool-icon{font-size:19px;line-height:1}
    #${TOOL_ID} .jv-tool-label{white-space:nowrap}
    .jv-tool-focus{
      outline:2px solid #a879ff!important;outline-offset:3px
    }
    @media(max-width:600px){
      #${TOOL_ID}{margin:12px 0;padding:8px;gap:7px}
      #${TOOL_ID} .jv-tool{flex-basis:72px;min-height:62px}
    }
  `;

  function addStyles() {
    if (document.getElementById("justevivo-app8-css")) return;
    const style = document.createElement("style");
    style.id = "justevivo-app8-css";
    style.textContent = css;
    document.head.appendChild(style);
  }

  // Recherche dans toutes les sections, pas seulement dans workspace.
  function findSceneSection() {
    return Array.from(document.querySelectorAll("details")).find(el => {
      const summary = el.querySelector("summary");
      if (!summary) return false;

      const title = summary.textContent
        .replace(/\s+/g, " ")
        .trim()
        .toLowerCase();

      return title.includes("scènes") && title.includes("coupures");
    });
  }

  function focusCaption() {
    const caption = document.getElementById("captionText");
    if (!caption) {
      if (typeof showToast === "function") {
        showToast("La zone de texte est introuvable.");
      }
      return;
    }

    caption.scrollIntoView({ behavior: "smooth", block: "center" });
    caption.focus({ preventScroll: true });
    caption.classList.add("jv-tool-focus");

    setTimeout(() => {
      caption.classList.remove("jv-tool-focus");
    }, 1200);
  }

  function clickSidebarStyles() {
    const links = Array.from(
      document.querySelectorAll(".sidebar .side-link")
    );

    const styleLink = links.find(el =>
      /styles de texte/i.test(el.textContent)
    );

    if (styleLink) styleLink.click();

    const options = document.querySelector(".style-options");

    if (options) {
      options.scrollIntoView({
        behavior: "smooth",
        block: "center"
      });

      options.classList.add("jv-tool-focus");

      setTimeout(() => {
        options.classList.remove("jv-tool-focus");
      }, 1200);
    }
  }

  // Attend la création de la section par app7.js.
  function openScenes(mode) {
    let attempts = 0;
    const maxAttempts = 40;

    function tryOpen() {
      const section = findSceneSection();

      if (section) {
        section.open = true;

        section.scrollIntoView({
          behavior: "smooth",
          block: "center"
        });

        if (mode === "cuts") {
          const clearButton = Array.from(
            section.querySelectorAll("button")
          ).find(btn =>
            /annuler toutes les coupures/i.test(btn.textContent)
          );

          if (clearButton && clearButton.previousElementSibling) {
            clearButton.previousElementSibling.scrollIntoView({
              behavior: "smooth",
              block: "center"
            });
          }
        }

        return;
      }

      attempts++;

      if (attempts < maxAttempts) {
        setTimeout(tryOpen, 250);
      } else {
        if (typeof showToast === "function") {
          showToast(
            "La section Scènes et coupures n'a pas été créée. Vérifie le chargement de app7.js."
          );
        } else {
          alert(
            "La section Scènes et coupures n'a pas été créée. Vérifie le chargement de app7.js."
          );
        }
      }
    }

    tryOpen();
  }

  function openExport() {
    if (typeof exportVideo !== "function") {
      if (typeof showToast === "function") {
        showToast("La fonction d'export n'est pas disponible.");
      }
      return;
    }

    try {
      const result = exportVideo();

      if (result && typeof result.catch === "function") {
        result.catch(err => console.error("JUSTEVIVO export:", err));
      }
    } catch (err) {
      console.error("JUSTEVIVO export:", err);

      if (typeof showToast === "function") {
        showToast(
          "Impossible de lancer l'export. Vérifie la vidéo et les sous-titres."
        );
      }
    }
  }

  function activate(button) {
    document.querySelectorAll(
      "#" + TOOL_ID + " .jv-tool"
    ).forEach(btn => {
      btn.setAttribute(
        "aria-pressed",
        String(btn === button)
      );
    });
  }

  function addToolbar() {
    const workspace = document.querySelector(".workspace");
    const head = workspace &&
      workspace.querySelector(".workspace-head");

    if (!workspace || !head ||
        document.getElementById(TOOL_ID)) {
      return false;
    }

    const toolbar = document.createElement("nav");
    toolbar.id = TOOL_ID;
    toolbar.setAttribute(
      "aria-label",
      "Outils de montage JUSTEVIVO"
    );

    const tools = [
      {
        id: "montage",
        icon: "▣",
        label: "Montage",
        action: () => {
          const link = document.querySelector(
            ".sidebar .side-link"
          );
          if (link) link.click();

          const upload = document.querySelector(".upload-zone");
          if (upload) {
            upload.scrollIntoView({
              behavior: "smooth",
              block: "center"
            });
          }
        }
      },
      {
        id: "text",
        icon: "T",
        label: "Texte",
        action: focusCaption
      },
      {
        id: "styles",
        icon: "✦",
        label: "Styles",
        action: clickSidebarStyles
      },
      {
        id: "scenes",
        icon: "▧",
        label: "Scènes",
        action: () => openScenes("scenes")
      },
      {
        id: "cuts",
        icon: "✂",
        label: "Coupures",
        action: () => openScenes("cuts")
      },
      {
        id: "export",
        icon: "⇧",
        label: "Exporter",
        action: openExport
      }
    ];

    tools.forEach((tool, index) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "jv-tool";
      button.dataset.tool = tool.id;
      button.setAttribute(
        "aria-pressed",
        String(index === 0)
      );

      const icon = document.createElement("span");
      icon.className = "jv-tool-icon";
      icon.setAttribute("aria-hidden", "true");
      icon.textContent = tool.icon;

      const label = document.createElement("span");
      label.className = "jv-tool-label";
      label.textContent = tool.label;

      button.append(icon, label);

      button.addEventListener("click", () => {
        activate(button);
        tool.action();
      });

      toolbar.appendChild(button);
    });

    head.insertAdjacentElement("afterend", toolbar);
    return true;
  }

  function init() {
    if (initialized) return;

    addStyles();
    initialized = addToolbar();
  }

  function start() {
    init();

    if (initialized) return;

    const observer = new MutationObserver(() => {
      init();

      if (initialized) {
        observer.disconnect();
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });

    setTimeout(() => observer.disconnect(), 30000);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start, {
      once: true
    });
  } else {
    start();
  }
})();
