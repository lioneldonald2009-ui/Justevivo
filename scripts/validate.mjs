import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

const root = process.cwd();
const ignored = new Set(['.git', '.github', 'node_modules', 'www', 'android', 'ios', 'dist', 'coverage']);
const extensions = new Set(['.js', '.mjs', '.cjs']);
const files = [];

function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.isDirectory()) {
      if (!ignored.has(entry.name)) walk(path.join(dir, entry.name));
    } else if (entry.isFile() && extensions.has(path.extname(entry.name))) {
      files.push(path.join(dir, entry.name));
    }
  }
}
walk(root);

let failed = false;
for (const file of files) {
  const result = spawnSync(process.execPath, ['--check', file], { encoding: 'utf8' });
  if (result.status !== 0) {
    failed = true;
    console.error('\nSYNTAX ERROR:', path.relative(root, file));
    console.error(result.stderr || result.stdout);
  }
}
if (failed) process.exitCode = 1;
else console.log('Syntax OK:', files.length, 'JavaScript/TypeScript source files.');

const read = name => fs.readFileSync(path.join(root, name), 'utf8');
const checks = [
  ['multi-file image/video input', /id="videoInput"[^>]*multiple/.test(read('index.html'))],
  ['photo preview element', /id="imagePreview"/.test(read('index.html'))],
  ['persistent media bin', /justevivo-media-bin-v1/.test(read('editor-essentials.js')) && /window\.JV_MEDIA_BIN/.test(read('editor-essentials.js'))],
  ['photo preview lifecycle', /function attachProjectPhoto/.test(read('app.js')) && /function detachProjectMedia/.test(read('app.js'))],
  ['authenticated MP4 finalization client', /isVideoFinalize/.test(read('app5.js')) && /\/api\/video\/finalize/.test(read('app3.js'))],
  ['service worker cache revision', /justevivo-shell-v14/.test(read('sw.js'))],
  ['reference vertical sidebar on tablet', /navigation latérale verticale sur tablettes/.test(read('jv-v7-unified-ui.css')) && /max-width:760px/.test(read('jv-v7-unified-ui.css')) && /grid-template-columns:188px minmax\(0,1fr\)/.test(read('jv-v7-unified-ui.css'))],
  ['visible independent sidebar scrolling', /\.studio > \.jv-sidebar[\s\S]*?overflow-y:auto!important/.test(read('studio-viewport.css'))],
  ['dubbing menu opens its dedicated tool', /data-jv-feature="dubbing"/.test(read('index.html')) && /dataset\.jvFeature === "dubbing"/.test(read('navigation.js'))],
  ['dashboard return control preserves editor state', /Retour au tableau de bord sans fermer le projet/.test(read('navigation.js'))],
  ['production feature views are made visible when opened', /suite\.hidden = false;/.test(read('navigation.js')) && /studioParts\.forEach\(el => \{ el\.hidden = true; \}\)/.test(read('navigation.js'))],
  ['audio sidebar opens the full audio and voice panel', /function openAudioStudio\(\)/.test(read('navigation.js')) && /jv-editor-panel-tab\[data-panel="audio"\]/.test(read('navigation.js'))],
  ['voice synthesis handles delayed device voices and playback errors', /voiceschanged/.test(read('audio-studio.js')) && /speechSynthesis\.resume\(\)/.test(read('audio-studio.js')) && /utterance\.onerror/.test(read('audio-studio.js'))],
  ['audio player resets volume after playback', /audio\.addEventListener\("ended"/.test(read('audio-studio.js'))],
  ['photo studio accepts mixed image and video media', /accept="image\/\*,video\/\*"/.test(read('photo-studio.js')) && /kind:"video"/.test(read('photo-studio.js'))],
  ['photo studio includes reusable editing templates and effects', /id="jvp-template-grid"/.test(read('photo-studio.js')) && /templateCatalog/.test(read('photo-studio.js')) && /jvp-effect/.test(read('photo-studio.js'))],
  ['photo studio exports a mixed media timeline', /const durations=photos\.map/.test(read('photo-studio.js')) && /captureStream\(30\)/.test(read('photo-studio.js'))],
  ['animated template library includes occasion categories and use action', /id="jvp-template-grid"/.test(read('photo-studio.js')) && /Utiliser ce modèle/.test(read('photo-studio.js')) && /category:"Anniversaire"/.test(read('photo-studio.js')) && /category:"Voyage"/.test(read('photo-studio.js'))],
  ['selected templates apply settings and animated decorations', /function applyTemplate\(t\)/.test(read('photo-studio.js')) && /decoration==="confetti"/.test(read('photo-studio.js')) && /textAnimation/.test(read('photo-studio.js'))],
  ['mobile drawer', read('mobile-drawer.js').includes('jv-mobile-menu-toggle') && read('mobile-drawer.js').includes('aria-expanded')],
  ['mobile responsive width', read('mobile-drawer-fix.css').includes('overflow-x:hidden') && read('mobile-drawer-fix.css').includes('zoom:1')],
  ['family collage templates', read('photo-studio.js').includes('layout:"trio"') && read('photo-studio.js').includes('layout:"family"') && read('photo-studio.js').includes('const drawTile=')],
  ['name presentation template', read('photo-studio.js').includes('Portraits & Prénoms') && read('photo-studio.js').includes('lastTemplateText')],
  ['standalone montage page loads its dedicated editor and styles', read('montage.html').includes('montage-editor.js') && read('montage.html').includes('montage.css')],
  ['photo montage opens in a separate tab', read('photo-studio.js').includes('window.open("montage.html","_blank")')],
  ['standalone editor provides timeline, templates and per-scene controls', read('montage-editor.js').includes('function renderTimeline()') && read('montage-editor.js').includes('function renderTemplatePanel()') && read('montage-editor.js').includes('Textes & titres de la scène')],
  ['standalone editor supports audio search, sound effects and video export', read('montage-editor.js').includes('/api/music/search') && read('montage-editor.js').includes('function playSfx') && read('montage-editor.js').includes('new MediaRecorder')],
  ['standalone editor supports quality, speed, framing and positioning controls', read('montage-editor.js').includes('Qualité de sortie') && read('montage-editor.js').includes('Position horizontale') && read('montage-editor.js').includes('Vitesse')],
  ['montage tool buttons clear and switch the inspector panel', /function renderInspectorForTool\(tool\)\{const tabMap/.test(read('montage-editor.js')) && /inspector\.replaceChildren\(\)/.test(read('montage-editor.js')) && /renderInspectorForTool\(b\.dataset\.tool\)/.test(read('montage-editor.js'))],
  ['desktop marketing page restores vertical scrolling and scrollbar', /overflow-y: scroll !important/.test(read('studio-viewport.css')) && /position: relative !important/.test(read('studio-viewport.css')) && /scrollbar-gutter: stable/.test(read('studio-viewport.css'))],
  ['montage editor asset cache revisions are refreshed', /montage-editor\.js\?v=4/.test(read('montage.html')) && /montage\.css\?v=4/.test(read('montage.html')) && /studio-viewport\.css\?v=6/.test(read('index.html'))],
  ['dedicated subtitle lane with editable timed captions', /id="subtitleTrack"/.test(read('montage.html')) && /function addSubtitle\(\)/.test(read('montage-editor.js')) && /function renderSubtitleTrack\(\)/.test(read('montage-editor.js')) && /state\.subtitles\.find\(x=>time>=x\.start&&time<=x\.end\)/.test(read('montage-editor.js'))],
  ['clip keyframes interpolate zoom and position during preview and export', /function keyframeValues\(c,local\)/.test(read('montage-editor.js')) && /animated=keyframeValues\(c,local\)/.test(read('montage-editor.js')) && /Ajouter une image-clé/.test(read('montage-editor.js'))],
  ['keyframes and subtitle tracks persist in history and local project saves', /keyframes:c\.keyframes\|\|\[\]/.test(read('montage-editor.js')) && /subtitles:state\.subtitles/.test(read('montage-editor.js'))],
  ['audio multipiste supports file import, per-track gain, mute, solo and timeline offset', /audioTracks:\[\]/.test(read('montage-editor.js')) && /function addAudioFiles\(files\)/.test(read('montage-editor.js')) && /function syncAudioTracks\(time\)/.test(read('montage-editor.js')) && /Piste\(s\) audio ajoutée/.test(read('montage-editor.js'))],
  ['audio lane renders even when the video timeline is empty', (() => { const s=read('montage-editor.js'); const start=s.indexOf('function renderTimeline()'); const end=s.indexOf('function escapeHtml', start); const timeline=s.slice(start,end); return start>=0 && timeline.includes('if(!state.clips.length)') && timeline.includes('$("audioTrack").replaceChildren()') && timeline.indexOf('$("audioTrack").replaceChildren()') > timeline.indexOf('if(!state.clips.length)'); })()],
  ['separate video, subtitle and audio timeline lanes', /id="timelineTrack"/.test(read('montage.html')) && /id="subtitleTrack"/.test(read('montage.html')) && /id="audioTrack"/.test(read('montage.html'))],
  ['device-aware responsive mode handles mobile desktop-site browsers', read('index.html').includes('responsive-overrides.css?v=1') && read('index.html').includes('device-layout.js?v=1') && /jv-touch-mobile/.test(read('device-layout.js'))],
  ['mobile layout switches to a compact one-column view and drawer menu', /body\.jv-touch-mobile \.studio\{display:block/.test(read('responsive-overrides.css')) && /jv-touch-mobile/.test(read('mobile-drawer.js'))],
  ['desktop document scrolling is enabled with a visible scrollbar', /overflow-y:auto!important/.test(read('responsive-overrides.css')) && /::-webkit-scrollbar-thumb/.test(read('responsive-overrides.css'))],
  ['photo montage is positioned beside the media library', /mediaLink\.insertAdjacentElement\("afterend",nav\)/.test(read('photo-studio.js'))],
  ['Windows desktop packaging does not require a publishing token', /electron-builder --win nsis portable --publish never/.test(read('.github/workflows/build-windows.yml'))],
  ['iOS simulator workflow targets generated Xcode project', /xcodebuild -project ios\/App\/App\.xcodeproj/.test(read('.github/workflows/build-native.yml'))]
];
for (const [label, ok] of checks) {
  console.log((ok ? 'PASS ' : 'FAIL ') + label);
  if (!ok) failed = true;
}
if (failed) process.exitCode = 1;
