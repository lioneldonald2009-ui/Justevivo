/* Detect real phone/tablet hardware even if the browser requests the desktop website. */
(() => {
  const apply=()=>{
    const screenWidth=Number(window.screen?.width||window.innerWidth||0);
    const screenHeight=Number(window.screen?.height||window.innerHeight||0);
    const touch=Number(navigator.maxTouchPoints||0)>0||("ontouchstart" in window);
    const mobileUA=/Android|iPhone|iPod|Mobile|Windows Phone/i.test(navigator.userAgent||"");
    const compactHardware=Math.min(screenWidth,screenHeight)<=900;
    const isPhoneOrTablet=mobileUA||(touch&&compactHardware);
    if(isPhoneOrTablet){
      document.documentElement.classList.add("jv-touch-device");
      document.body?.classList.add("jv-touch-mobile");
      const viewport=document.querySelector('meta[name="viewport"]');
      if(viewport)viewport.setAttribute("content","width=device-width, initial-scale=1, viewport-fit=cover");
    }
    if(!isPhoneOrTablet){
      document.documentElement.classList.remove("jv-touch-device");
      document.body?.classList.remove("jv-touch-mobile");
    }
  };
  apply();
  document.addEventListener("DOMContentLoaded",apply,{once:true});
  window.addEventListener("orientationchange",()=>setTimeout(apply,100),{passive:true});
})();
