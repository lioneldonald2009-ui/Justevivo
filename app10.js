
/* JUSTEVIVO · app10.js · Zoom dynamique des sous-titres en mode karaoké */
(() => {
  'use strict';

  let originalDrawCaption = null;
  let zoomEnabled = true;
  let installed = false;

  function installZoom() {
    if (installed || typeof window.drawCaption !== 'function') return;

    originalDrawCaption = window.drawCaption;

    window.drawCaption = function(ctx, w, h, t) {
      if (!zoomEnabled || window.displayMode !== 'karaoke') {
        return originalDrawCaption.apply(this, arguments);
      }

      const segments = window.segments;
      if (!Array.isArray(segments)) {
        return originalDrawCaption.apply(this, arguments);
      }

      const seg = segments.find(s =>
        t >= Number(s.start || 0) &&
        t <= Number(s.end || 0)
      );

      if (!seg) return originalDrawCaption.apply(this, arguments);

      const duration = Math.max(
        0.1,
        Number(seg.end) - Number(seg.start)
      );

      const elapsed = Math.max(0, t - Number(seg.start));
      const wordDuration = duration / Math.max(
        1,
        String(seg.text || '').trim().split(/\s+/).length
      );

      const phase = (elapsed % wordDuration) / wordDuration;
      const pulse = Math.sin(Math.PI * phase);
      const scale = 1 + pulse * 0.045;

      ctx.save();
      ctx.translate(w / 2, h * 0.82);
      ctx.scale(scale, scale);
      ctx.translate(-w / 2, -h * 0.82);

      try {
        return originalDrawCaption.apply(this, arguments);
      } finally {
        ctx.restore();
      }
    };

    installed = true;
    console.log('JUSTEVIVO : zoom dynamique installé');
  }

  function addControl() {
    if (document.getElementById('jvZoomDynamic')) return;

    const panel = document.querySelector(
      '.controls-panel, .editor-controls, #controls'
    );

    if (!panel) return;

    const box = document.createElement('label');
    box.style.cssText =
      'display:flex;align-items:center;gap:10px;padding:12px;margin:10px 0;border:1px solid #444;border-radius:10px;color:inherit;';

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.id = 'jvZoomDynamic';
    checkbox.checked = true;

    checkbox.addEventListener('change', () => {
      zoomEnabled = checkbox.checked;
      if (typeof window.showToast === 'function') {
        window.showToast(
          zoomEnabled ? 'Zoom dynamique activé' : 'Zoom dynamique désactivé'
        );
      }
    });

    const text = document.createElement('span');
    text.textContent = 'Activer le zoom au rythme des mots (karaoké)';

    box.append(checkbox, text);
    panel.appendChild(box);
  }

  function start() {
    installZoom();
    addControl();
  }

  start();
  setInterval(start, 1000);
})();
