const videoInput=document.getElementById('videoInput');
const videoPreview=document.getElementById('videoPreview');
const placeholder=document.getElementById('placeholderPreview');
const fileName=document.getElementById('fileName');
const captionText=document.getElementById('captionText');
const captionPreview=document.getElementById('captionPreview');
const previewFrame=document.getElementById('previewFrame');
const colorInput=document.getElementById('captionColor');
const toast=document.getElementById('toast');
let activeStyle='pop';
function showToast(message){toast.textContent=message;toast.classList.add('show');clearTimeout(showToast.timer);showToast.timer=setTimeout(()=>toast.classList.remove('show'),2600)}
videoInput.addEventListener('change',()=>{
  const file=videoInput.files && videoInput.files[0]; if(!file)return;
  if(!file.type.startsWith('video/')){showToast('Choisissez un fichier vidéo valide.');return;}
  const url=URL.createObjectURL(file);videoPreview.src=url;videoPreview.hidden=false;placeholder.hidden=true;fileName.textContent=file.name;showToast('Vidéo chargée dans l’aperçu local.');
});
function updateCaption(){
  const words=captionText.value.trim().split(/\s+/).filter(Boolean);
  const safe=words.map(w=>w.replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c])));
  if(!safe.length){captionPreview.textContent='VOTRE TEXTE';return;}
  const split=Math.ceil(safe.length/2);
  captionPreview.innerHTML=safe.slice(0,split).join(' ')+'<br><b>'+safe.slice(split).join(' ')+'</b>';
  captionPreview.style.setProperty('--accent',colorInput.value);
  captionPreview.querySelector('b')?.style.setProperty('color',colorInput.value);
  previewFrame.classList.remove('pop','neon','clean');previewFrame.classList.add(activeStyle);
}
document.querySelectorAll('.style-option').forEach(button=>button.addEventListener('click',()=>{
  document.querySelectorAll('.style-option').forEach(b=>b.classList.remove('selected'));
  button.classList.add('selected');activeStyle=button.dataset.style;updateCaption();
}));
document.getElementById('previewButton').addEventListener('click',()=>{updateCaption();showToast('Aperçu actualisé.');});
captionText.addEventListener('input',updateCaption);colorInput.addEventListener('input',updateCaption);
document.getElementById('notifyButton').addEventListener('click',()=>showToast('Les abonnements seront activés après la mise en place du paiement.'));
updateCaption();