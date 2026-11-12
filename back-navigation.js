/* JUSTEVIVO — bouton de retour commun aux pages secondaires */
(() => {
  if (window.__jvBackButtonReady) return;
  window.__jvBackButtonReady = true;

  const isHome = /(?:^|\\/)index\\.html$/.test(location.pathname) || location.pathname === "/";
  if (isHome) return;

  const button = document.createElement("button");
  button.type = "button";
  button.className = "jv-global-back";
  button.setAttribute("aria-label", "Revenir à la page précédente");
  button.innerHTML = '<span aria-hidden="true">←</span><span>Retour</span>';
  button.addEventListener("click", () => {
    if (history.length > 1 && document.referrer && new URL(document.referrer).origin === location.origin) {
      history.back();
    } else {
      location.href = "/index.html";
    }
  });

  const style = document.createElement("style");
  style.textContent = `
    .jv-global-back{position:fixed;top:16px;left:16px;z-index:99999;display:inline-flex;align-items:center;gap:9px;min-height:42px;padding:0 15px;border:1px solid #e2e5ef;border-radius:12px;background:rgba(255,255,255,.96);color:#292344;box-shadow:0 5px 18px rgba(22,25,45,.10);font:700 13px/1 system-ui,-apple-system,Segoe UI,Arial,sans-serif;cursor:pointer;backdrop-filter:blur(12px);transition:transform .18s ease,box-shadow .18s ease}
    .jv-global-back span:first-child{font-size:22px;line-height:1;color:#7654ed}
    .jv-global-back:hover{transform:translateX(-2px);box-shadow:0 8px 22px rgba(22,25,45,.15)}
    .jv-global-back:focus-visible{outline:3px solid #9b8af5;outline-offset:3px}
    @media(max-width:600px){.jv-global-back{top:10px;left:10px;min-height:40px;padding:0 12px}}
  `;
  document.head.appendChild(style);
  document.body.appendChild(button);
})();