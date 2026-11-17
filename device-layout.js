/* JUSTEVIVO — sélection du mode d’interface selon l’appareil physique.
   Le mode ne dépend pas uniquement de la largeur de la fenêtre : Chrome peut
   demander le « site pour ordinateur » sur un téléphone. */
(() => {
  const classify = () => {
    const ua = navigator.userAgent || "";
    const mobileUA = /Android|iPhone|iPod|Mobile|Windows Phone/i.test(ua);
    const tabletUA = /iPad|Tablet/i.test(ua);
    const touch = Number(navigator.maxTouchPoints || 0) > 0 || ("ontouchstart" in window);
    const physicalWidth = Number(window.screen && (window.screen.width || window.screen.availWidth)) || 0;
    const physicalHeight = Number(window.screen && (window.screen.height || window.screen.availHeight)) || 0;
    const compactHardware = Math.min(physicalWidth || window.innerWidth, physicalHeight || window.innerHeight) <= 900;
    const mobileDevice = mobileUA || tabletUA || (touch && compactHardware);
    const root = document.documentElement;
    const apply = () => {
      const body = document.body;
      if (!body) return;
      root.classList.toggle("jv-device-mobile", mobileDevice);
      root.classList.toggle("jv-device-desktop", !mobileDevice);
      body.classList.toggle("jv-device-mobile", mobileDevice);
      body.classList.toggle("jv-device-desktop", !mobileDevice);
      body.classList.toggle("jv-touch-mobile", mobileDevice); // compatibilité avec les styles mobiles existants
      root.dataset.jvDevice = mobileDevice ? "mobile" : "desktop";
      body.dataset.jvDevice = mobileDevice ? "mobile" : "desktop";
      const viewport = document.querySelector('meta[name="viewport"]');
      if (viewport) viewport.setAttribute("content", "width=device-width, initial-scale=1, viewport-fit=cover");
    };
    apply();
    if (!document.body) document.addEventListener("DOMContentLoaded", apply, { once: true });
  };
  classify();
  window.addEventListener("orientationchange", () => window.setTimeout(classify, 120), { passive: true });
})();
