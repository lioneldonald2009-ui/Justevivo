/* JUSTEVIVO — menu tiroir mobile accessible */
(() => {
  "use strict";
  const init=()=>{
    const studio=document.querySelector(".studio");
    const sidebar=studio?.querySelector(".jv-sidebar,.sidebar");
    if(!studio||!sidebar||document.querySelector(".jv-mobile-menu-toggle"))return;
    const toggle=document.createElement("button");
    toggle.type="button";toggle.className="jv-mobile-menu-toggle";
    toggle.setAttribute("aria-controls","jv-mobile-navigation");
    toggle.setAttribute("aria-expanded","false");
    toggle.innerHTML='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 6h16M4 12h16M4 18h16"/></svg><span>Menu</span>';
    sidebar.id="jv-mobile-navigation";
    const backdrop=document.createElement("button");
    backdrop.type="button";backdrop.className="jv-mobile-menu-backdrop";
    backdrop.setAttribute("aria-label","Fermer le menu");
    studio.parentNode.insertBefore(toggle,studio);
    document.body.appendChild(backdrop);
    const isMobile=()=>document.body.classList.contains("jv-touch-mobile")||window.matchMedia("(max-width: 760px)").matches;
    const close=()=>{document.body.classList.remove("jv-menu-open");toggle.setAttribute("aria-expanded","false");};
    const open=()=>{if(!isMobile())return;document.body.classList.add("jv-menu-open");toggle.setAttribute("aria-expanded","true");};
    toggle.addEventListener("click",()=>document.body.classList.contains("jv-menu-open")?close():open());
    backdrop.addEventListener("click",close);
    sidebar.addEventListener("click",event=>{if(event.target.closest(".side-link,.jv-sidebar-new"))close();});
    document.addEventListener("keydown",event=>{if(event.key==="Escape")close();});
    window.addEventListener("resize",()=>{if(!isMobile())close();});
  };
  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",init);else init();
})();
