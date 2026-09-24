(function(){
"use strict";
document.addEventListener("DOMContentLoaded",function(){
  const root=document.documentElement, body=document.body;
  const themeBtns=document.querySelectorAll("[data-theme-toggle]");
  const rtlBtns=document.querySelectorAll("[data-rtl-toggle]");
  const menu=document.querySelector(".nav-menu");
  const links=document.querySelector(".nav-links");
  const home=document.querySelector(".nav-home");
  const homeBtn=document.querySelector(".nav-drop-btn");

  function applyTheme(){
    const dark=localStorage.getItem("apex-theme")==="dark";
    body.classList.toggle("dark",dark);
    themeBtns.forEach(b=>b.textContent=dark?"☀":"◐");
  }
  function applyDir(){
    const dir=localStorage.getItem("apex-dir")||"ltr";
    root.dir=dir;
    rtlBtns.forEach(b=>b.textContent=dir==="rtl"?"LTR":"RTL");
  }
  applyTheme(); applyDir();

  themeBtns.forEach(btn=>btn.addEventListener("click",function(){
    localStorage.setItem("apex-theme",body.classList.contains("dark")?"light":"dark");
    applyTheme();
  }));
  rtlBtns.forEach(btn=>btn.addEventListener("click",function(){
    localStorage.setItem("apex-dir",root.dir==="rtl"?"ltr":"rtl");
    applyDir();
  }));

  if(menu && links){
    menu.addEventListener("click",function(){
      const open=links.classList.toggle("open");
      menu.setAttribute("aria-expanded",open?"true":"false");
    });
  }
  if(home && homeBtn){
    homeBtn.addEventListener("click",function(e){
      e.preventDefault();
      const open=home.classList.toggle("open");
      homeBtn.setAttribute("aria-expanded",open?"true":"false");
    });
    document.addEventListener("click",function(e){
      if(!home.contains(e.target)){
        home.classList.remove("open");
        homeBtn.setAttribute("aria-expanded","false");
      }
    });
  }
  document.querySelectorAll(".nav-links a").forEach(a=>a.addEventListener("click",function(){
    if(links) links.classList.remove("open");
    if(home) home.classList.remove("open");
  }));
});
})();
/* ===== footer privacy/terms overlay ===== */
(function(){
  var texts={
    "Privacy":{t:"Privacy Policy",b:"<p>Apex Motion Academy collects only the information you submit through our forms: name, contact details and training interests.</p><p>Data is used solely to respond to enquiries, manage enrolments and improve our programmes. We never sell personal information to third parties.</p><p>Browser storage is used only for interface preferences such as dark mode and layout direction.</p><p>Questions? Email privacy@apexmotion.example</p>"},
    "Terms":{t:"Terms of Use",b:"<p>By using this site you agree to use its content for personal, non-commercial purposes related to youth sports training.</p><p>Programme availability, schedules and pricing may change; confirmed enrolments are governed by the agreement signed at registration.</p><p>All content (text, imagery, logos) belongs to Apex Motion Academy and may not be reproduced without permission.</p><p>Questions? Email legal@apexmotion.example</p>"}
  };
  document.addEventListener("click",function(e){
    var tgt=e.target;
    var a=tgt.closest?tgt.closest('.site-footer-legal a[href="404.html"]'):null;
    if(!a)return;
    e.preventDefault();
    var key=(a.textContent||"").trim();
    var d=texts[key]||{t:key,b:"<p>This section is being prepared.</p>"};
    var ov=document.getElementById("legalOverlay");
    if(!ov){
      ov=document.createElement("div");ov.id="legalOverlay";
      ov.innerHTML='<div class="legal-card"><button id="legalClose" aria-label="Close">&times;</button><h3></h3><div class="legal-body"></div></div>';
      document.body.appendChild(ov);
      var st=document.createElement("style");
      st.textContent="#legalOverlay{position:fixed;inset:0;background:rgba(23,19,22,.55);display:none;place-items:center;z-index:999;padding:20px}#legalOverlay.open{display:grid}.legal-card{background:#fff;color:#171516;max-width:520px;width:100%;border-radius:16px;padding:26px 26px 22px;position:relative;font-family:'DM Sans',sans-serif;box-shadow:0 30px 80px rgba(0,0,0,.35)}#legalOverlay h3{font:700 22px 'Space Grotesk',sans-serif;margin:0 0 12px}#legalOverlay .legal-body p{font-size:13px;line-height:1.7;margin:0 0 10px}#legalClose{position:absolute;top:8px;right:12px;border:0;background:none;font-size:24px;cursor:pointer;line-height:1;color:inherit}";
      document.head.appendChild(st);
    }
    ov.querySelector("h3").textContent=d.t;
    ov.querySelector(".legal-body").innerHTML=d.b;
    ov.querySelector("#legalClose").onclick=function(){ov.classList.remove("open");};
    ov.onclick=function(ev){if(ev.target===ov){ov.classList.remove("open");}};
    ov.classList.add("open");
  });
})();

/* ===== navbar auth buttons: always keep Login and Sign Up visible as usual (no profile display) ===== */
(function(){
  function render(){
    document.querySelectorAll(".nav-login,.nav-signup").forEach(function(el){el.style.display="";});
    var old=document.getElementById("navAvatar");if(old)old.remove();
  }
  if(document.readyState==="loading"){document.addEventListener("DOMContentLoaded",render);}else{render();}
})();