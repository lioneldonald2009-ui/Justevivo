(() => {
  'use strict';
  const API_URL = 'https://justevivo-backend.onrender.com';
  const $ = id => document.getElementById(id);
  const emailInput = $('email'), codeInput = $('code');
  const message = $('message'), sendButton = $('send-code');
  let config = null, captchaToken = '', widgetId = null, turnstileLoading = false;

  function showMessage(text, error=false) {
    message.textContent = text;
    message.classList.toggle('error', error);
  }
  function showStep(name) {
    ['email','code','done'].forEach(id => $(`step-${id}`).hidden = id !== name);
    showMessage('');
  }
  function friendlyError(data) {
    const text = String(data.msg || data.message || data.error_description || data.error || '');
    const low = (String(data.code || data.error_code || '') + ' ' + text).toLowerCase();
    if (low.includes('captcha')) return 'La vérification anti-robot a expiré ou n’a pas été validée. Recommencez le contrôle.';
    if (low.includes('rate') || low.includes('too many')) return 'Trop de demandes. Patientez quelques minutes avant de réessayer.';
    if (low.includes('otp') || low.includes('token')) return 'Code incorrect ou expiré. Vérifiez le code reçu ou demandez-en un nouveau.';
    if (low.includes('user not found')) return 'Aucun compte ne correspond à cette adresse.';
    return text || 'Une erreur est survenue. Réessayez.';
  }
  async function auth(path, body, accessToken) {
    const headers = {'apikey':config.anonKey,'Content-Type':'application/json'};
    if (accessToken) headers.Authorization = 'Bearer ' + accessToken;
    const response = await fetch(config.url + '/auth/v1/' + path, {
      method:'POST', headers, body:JSON.stringify(body)
    });
    let data={}; try { data=await response.json(); } catch (_) {}
    if (!response.ok) throw new Error(friendlyError(data));
    return data;
  }
  function resetCaptcha() {
    captchaToken = '';
    if (window.turnstile && widgetId !== null) {
      try { window.turnstile.reset(widgetId); } catch (_) {}
    }
  }
  function renderCaptcha() {
    if (!config?.captchaSiteKey) {
      $('captcha-container').hidden = true;
      $('captcha-hint').textContent = 'La vérification anti-robot n’est pas requise sur cette configuration.';
      return;
    }
    if (window.turnstile) {
      if (widgetId === null) {
        widgetId = window.turnstile.render($('captcha-container'), {
          sitekey:config.captchaSiteKey, theme:'light',
          callback: token => { captchaToken=token; showMessage('Contrôle de sécurité validé.'); },
          'expired-callback': () => { captchaToken=''; showMessage('Le contrôle a expiré. Validez-le à nouveau.',true); },
          'error-callback': () => { captchaToken=''; showMessage('Le contrôle anti-robot n’a pas pu être chargé. Réessayez.',true); }
        });
      }
      return;
    }
    if (turnstileLoading) return;
    turnstileLoading = true;
    const script=document.createElement('script');
    script.src='https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
    script.async=true; script.defer=true;
    script.onload=()=>{turnstileLoading=false;renderCaptcha();};
    script.onerror=()=>{turnstileLoading=false;showMessage('Impossible de charger le contrôle anti-robot.',true);};
    document.head.appendChild(script);
  }
  async function loadConfig() {
    const response=await fetch(API_URL + '/api/config');
    if (!response.ok) throw new Error('Service de compte temporairement indisponible.');
    const data=await response.json();
    if (!data.enabled || !data.url || !data.anonKey) throw new Error('Le service de compte est indisponible.');
    config={url:data.url,anonKey:data.anonKey,captchaSiteKey:data.captchaSiteKey || ''};
    renderCaptcha();
  }
  async function sendCode({resend=false} = {}) {
    const email=emailInput.value.trim();
    if (!/^\S+@\S+\.\S+$/.test(email)) { showMessage('Saisissez une adresse email valide.',true); emailInput.focus(); return; }
    if (config.captchaSiteKey && !captchaToken) {
      showStep('email'); renderCaptcha();
      showMessage('Validez le contrôle anti-robot pour recevoir un nouveau code.',true); return;
    }
    sendButton.disabled=true;
    const resendButton=$('resend-code');
    if(resendButton) resendButton.disabled=true;
    showMessage(resend ? 'Envoi d’un nouveau code en cours…' : 'Envoi du code en cours…');
    try {
      await auth('recover',{email,captcha_token:captchaToken || undefined});
      $('masked-email').textContent=email;
      showStep('code');
      codeInput.value='';
      showMessage('Demande prise en compte. Utilisez uniquement le dernier code reçu : les codes précédents peuvent être invalidés.');
    } catch (error) {
      showMessage(error.message,true);
    } finally {
      sendButton.disabled=false;
      if(resendButton) resendButton.disabled=false;
      resetCaptcha();
    }
  }
  async function changePassword() {
    const email=emailInput.value.trim(), token=codeInput.value.trim();
    const password=$('password').value, confirmation=$('confirm-password').value;
    if (!/^\d{6}$/.test(token)) { showMessage('Entrez le code à 6 chiffres reçu par email.',true); codeInput.focus(); return; }
    if (password.length<8) { showMessage('Le mot de passe doit contenir au moins 8 caractères.',true); $('password').focus(); return; }
    if (password!==confirmation) { showMessage('Les deux mots de passe ne correspondent pas.',true); $('confirm-password').focus(); return; }
    const button=$('change-password'); button.disabled=true; showMessage('Vérification du code…');
    try {
      const verified=await auth('verify',{email,token,type:'recovery'});
      if (!verified.access_token) throw new Error('Le code a été accepté, mais aucune session de récupération n’a été retournée.');
      const response=await fetch(config.url + '/auth/v1/user',{
        method:'PUT',
        headers:{apikey:config.anonKey,Authorization:'Bearer '+verified.access_token,'Content-Type':'application/json'},
        body:JSON.stringify({password})
      });
      let data={}; try { data=await response.json(); } catch (_) {}
      if (!response.ok) throw new Error(friendlyError(data));
      showStep('done');
    } catch (error) { showMessage(error.message,true); }
    finally { button.disabled=false; }
  }
  document.querySelectorAll('.toggle-password').forEach(toggle => {
    toggle.addEventListener('click', () => {
      const field = $(toggle.dataset.target);
      const reveal = field.type === 'password';
      field.type = reveal ? 'text' : 'password';
      toggle.setAttribute('aria-pressed', String(reveal));
      toggle.setAttribute('aria-label', reveal ? 'Masquer le mot de passe' : 'Afficher le mot de passe');
      toggle.innerHTML = reveal
        ? '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 3l18 18"/><path d="M10.6 10.6a2 2 0 002.8 2.8"/><path d="M9.9 5.2A10.8 10.8 0 0112 5c6.4 0 10 7 10 7a16 16 0 01-3.1 3.9M6.2 6.2C3.5 8 2 12 2 12s3.6 7 10 7c1.4 0 2.7-.3 3.8-.8"/></svg>'
        : '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12Z"/><circle cx="12" cy="12" r="3"/></svg>';
    });
  });
  $('send-code').addEventListener('click',sendCode);
  $('change-password').addEventListener('click',changePassword);
  $('resend-code').addEventListener('click',()=>sendCode({resend:true}));
  $('go-login').addEventListener('click',()=>{window.location.href='studio.html';});
  emailInput.addEventListener('keydown',e=>{if(e.key==='Enter')sendCode();});
  codeInput.addEventListener('input',()=>{codeInput.value=codeInput.value.replace(/\D/g,'').slice(0,8);});
  $('confirm-password').addEventListener('keydown',e=>{if(e.key==='Enter')changePassword();});
  const initialEmail=new URLSearchParams(location.search).get('email');
  if(initialEmail) emailInput.value=initialEmail;
  loadConfig().catch(error=>showMessage(error.message,true));
})();