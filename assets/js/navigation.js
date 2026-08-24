(function () {
  "use strict";

  // Keep local HTML navigation reliable in both file:// previews and hosted builds.
  const aliases = {
    "home1.html": "index.html",
    "home-1.html": "index.html",
    "home1-hero-balanced.html": "index.html",
    "home2.html": "home-2.html",
    "admin-login.html": "adminlogin.html",
    "admin-signup.html": "adminsignup.html"
  };

  document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll("a[href]").forEach(function (link) {
      const raw = link.getAttribute("href");
      if (!raw || raw.startsWith("#") || /^(https?:|mailto:|tel:|javascript:)/i.test(raw)) return;

      const hash = raw.includes("#") ? raw.substring(raw.indexOf("#")) : "";
      const path = raw.split("#")[0];
      const file = path.split("/").pop().toLowerCase();

      if (aliases[file]) {
        const prefix = path.substring(0, path.length - file.length);
        link.setAttribute("href", prefix + aliases[file] + hash);
      }
    });
  });
})();
/* company logo -> home page (dashboards) */
(function(){
  function goHome(){
    const brand=document.querySelector(".brand,.admin-brand");
    if(brand&&!brand.dataset.homeBound){
      brand.dataset.homeBound="1";
      brand.style.cursor="pointer";
      brand.title="Back to home";
      brand.addEventListener("click",function(){location.href="index.html";});
    }
  }
  if(document.readyState==="loading"){document.addEventListener("DOMContentLoaded",goHome);}else{goHome();}
})();