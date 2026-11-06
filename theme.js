(function(){
  if(window.__JV_THEME_READY__) return; window.__JV_THEME_READY__=true;
  const root=document.documentElement, key='justevivo-theme';
  let saved='dark'; try{saved=localStorage.getItem(key)||'dark'}catch(e){}
  function apply(mode){const theme=mode==='light'?'light':'dark';root.setAttribute('data-theme',theme);const meta=document.querySelector('meta[name="theme-color"]');if(meta)meta.content=theme==='light'?'#f4f6fc':'#090d18';const b=document.getElementById('jv-theme-toggle');if(b){b.setAttribute('aria-label',theme==='dark'?'Activer le mode clair':'Activer le mode sombre');b.innerHTML=theme==='dark'?'☀️ <span>Mode clair</span>':'🌙 <span>Mode sombre</span>';}}
  apply(saved);
  function add(){if(document.getElementById('jv-theme-toggle'))return;const b=document.createElement('button');b.type='button';b.id='jv-theme-toggle';b.className='theme-toggle';b.addEventListener('click',()=>{const next=root.getAttribute('data-theme')==='dark'?'light':'dark';apply(next);try{localStorage.setItem(key,next)}catch(e){}});document.body.appendChild(b);apply(root.getAttribute('data-theme'));}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',add,{once:true});else add();
})();
