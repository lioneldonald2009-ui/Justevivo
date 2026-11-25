/* JUSTEVIVO — contrôle centralisé des versions.
 * Fail-open en cas d'indisponibilité du serveur pour éviter tout verrouillage accidentel.
 */
(() => {
  'use strict';
  const BUILD_VERSION = '1.0.53';
  const MANIFEST_URL = 'https://justevivo-backend.onrender.com/api/app-version';
  const CHECK_INTERVAL_MS = 5 * 60 * 1000;
  let overlay = null;
  let checking = false;

  const isNative = !!(window.Capacitor &&
    typeof window.Capacitor.isNativePlatform === 'function' &&
    window.Capacitor.isNativePlatform());

  function compareVersions(a, b) {
    const pa = String(a || '0').split('.').map(n => parseInt(n, 10) || 0);
    const pb = String(b || '0').split('.').map(n => parseInt(n, 10) || 0);
    for (let i = 0; i < Math.max(pa.length, pb.length); i++) {
      const diff = (pa[i] || 0) - (pb[i] || 0);
      if (diff) return diff;
    }
    return 0;
  }

  function showRequiredUpdate(manifest) {
    if (overlay) return;
    overlay = document.createElement('div');
    overlay.id = 'jv-required-update';
    overlay.setAttribute('role', 'alertdialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.innerHTML = `
      <section class="jv-update-card">
        <div class="jv-update-icon" aria-hidden="true">↻</div>
        <p class="jv-update-eyebrow">JUSTEVIVO · MISE À JOUR</p>
        <h1>Une nouvelle version est nécessaire</h1>
        <p class="jv-update-copy"></p>
        <p class="jv-update-version"></p>
        <a class="jv-update-action" target="_blank" rel="noopener">Mettre à jour JUSTEVIVO</a>
        <button class="jv-update-retry" type="button">Vérifier à nouveau</button>
        <p class="jv-update-footnote"></p>
      </section>`;
    const style = document.createElement('style');
    style.id = 'jv-update-styles';
    style.textContent = `
      #jv-required-update{position:fixed;inset:0;z-index:2147483647;display:grid;place-items:center;padding:22px;background:rgba(5,9,22,.96);color:#172033;font-family:Inter,Arial,sans-serif}
      #jv-required-update .jv-update-card{box-sizing:border-box;width:min(100%,470px);padding:32px 26px;border-radius:22px;background:#fff;text-align:center;box-shadow:0 24px 90px #0008}
      #jv-required-update .jv-update-icon{display:grid;place-items:center;width:58px;height:58px;margin:0 auto 18px;border-radius:18px;background:#eeeaff;color:#6746e8;font-size:32px}
      #jv-required-update .jv-update-eyebrow{font-size:11px;font-weight:800;letter-spacing:1.8px;color:#6b50d9}
      #jv-required-update h1{font-size:25px;line-height:1.2;margin:12px 0}
      #jv-required-update .jv-update-copy{color:#5c6577;line-height:1.6}
      #jv-required-update .jv-update-version{font-size:13px;color:#6b7280}
      #jv-required-update .jv-update-action,#jv-required-update .jv-update-retry{box-sizing:border-box;display:block;width:100%;padding:14px 18px;border:0;border-radius:12px;font-weight:800;text-decoration:none;cursor:pointer}
      #jv-required-update .jv-update-action{margin-top:22px;background:#6848e8;color:white}
      #jv-required-update .jv-update-retry{margin-top:10px;background:#f0eff7;color:#343047}
      #jv-required-update .jv-update-footnote{margin:15px 0 0;color:#788092;font-size:12px;line-height:1.5}
    `;
    document.head.appendChild(style);
    document.body.appendChild(overlay);
    overlay.querySelector('.jv-update-copy').textContent =
      manifest.message || 'Une version plus récente est disponible. Installez-la pour continuer à utiliser JUSTEVIVO.';
    overlay.querySelector('.jv-update-version').textContent =
      'Version installée : ' + BUILD_VERSION + ' · Version requise : ' + manifest.minimumVersion;
    const action = overlay.querySelector('.jv-update-action');
    const updateUrl = isNative && manifest.androidApkUrl
      ? manifest.androidApkUrl
      : (manifest.updateUrl || 'https://justevivo.pages.dev/');
    action.href = updateUrl;
    action.textContent = isNative && !manifest.androidApkUrl
      ? 'Ouvrir le site JUSTEVIVO'
      : 'Mettre à jour JUSTEVIVO';
    overlay.querySelector('.jv-update-footnote').textContent = isNative
      ? (manifest.androidApkUrl
        ? 'Après téléchargement, autorisez l’installation de la mise à jour Android. Vos données de compte restent associées à votre compte.'
        : 'La mise à jour Android doit être publiée avec la même signature que votre application actuelle. Le lien d’installation sera activé dès que le nouvel APK signé sera disponible.')
      : 'Après la mise à jour, rechargez JUSTEVIVO pour reprendre votre travail.';
    overlay.querySelector('.jv-update-retry').addEventListener('click', () => {
      window.location.reload();
    });
    document.body.appendChild(overlay);
  }

  async function checkVersion() {
    if (checking || document.visibilityState === 'hidden') return;
    checking = true;
    try {
      const response = await fetch(MANIFEST_URL, {
        cache: 'no-store',
        headers: { 'Accept': 'application/json' }
      });
      if (!response.ok) return;
      const manifest = await response.json();
      if (!manifest || !manifest.minimumVersion) return;
      if (compareVersions(BUILD_VERSION, manifest.minimumVersion) < 0 && (!isNative || manifest.androidApkUrl)) {
        showRequiredUpdate(manifest);
      }
    } catch (error) {
      // Fail-open : une panne de contrôle de version ne doit jamais bloquer les clients.
      console.warn('JUSTEVIVO version check temporarily unavailable:', error);
    } finally {
      checking = false;
    }
  }

  checkVersion();
  window.addEventListener('focus', checkVersion);
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') checkVersion();
  });
  window.setInterval(checkVersion, CHECK_INTERVAL_MS);
  window.JUSTEVIVO_APP_VERSION = BUILD_VERSION;
})();
