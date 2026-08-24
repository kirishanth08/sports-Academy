(function () {
  var html = document.documentElement;
  html.classList.add("js-anim");
  document.addEventListener("DOMContentLoaded", function () {
    var selectors = [
      ".hero-grid > div", ".hero-visual",
      ".section-head", ".head",
      ".split > div", ".perf > div", ".dashboard",
      ".steps article", ".sport-grid > a",
      ".nums > div", ".featured-card",
      ".blog-grid > article", ".journal-categories",
      ".newsletter-grid > div", ".cta-box > div",
      ".batch", ".highlight", ".level-card", ".coach-card",
      ".plan", ".info-row", ".rule", ".session",
      ".admin-card", ".admin-head", ".help-box"
    ];
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("in-view");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });

    selectors.forEach(function (sel) {
      var nodes = document.querySelectorAll(sel);
      nodes.forEach(function (el, i) {
        if (el.hasAttribute("data-anim")) return;
        if (el.closest(".site-nav") || el.closest(".admin-sidebar") || el.closest(".site-header")) return;
        el.setAttribute("data-anim", "");
        el.style.transitionDelay = ((i % 6) * 80) + "ms";
        io.observe(el);
      });
    });
  });
})();

/* ===== hover lift + 3D tilt engine ===== */
(function(){
  function initTilt(){
    if(window.DISABLE_TILT)return;
    if(window.matchMedia&&window.matchMedia("(hover: none)").matches)return;
    if(window.matchMedia&&window.matchMedia("(prefers-reduced-motion: reduce)").matches)return;
    var sels=".post,.card,.price-card,.coach,.program,.facility,.featured-card,.level-card,.batch,.help-box,[class*=card],.sport-grid>a,.steps article,.faq-item,.side-card,.highlight,.plan,.info-row,.rule";
    document.querySelectorAll(sels).forEach(function(el){
      if(el.hasAttribute("data-tilt"))return;
      el.setAttribute("data-tilt","");
      el.style.transition="transform .25s ease,box-shadow .3s ease";
      var rect=null;
      el.addEventListener("mouseenter",function(){rect=el.getBoundingClientRect();el.style.boxShadow="0 26px 50px -22px rgba(59,22,58,.45)";});
      el.addEventListener("mousemove",function(e){
        if(!rect)rect=el.getBoundingClientRect();
        var x=(e.clientX-rect.left)/rect.width-.5;
        var y=(e.clientY-rect.top)/rect.height-.5;
        el.style.transform="perspective(850px) rotateX("+(-y*6.5).toFixed(2)+"deg) rotateY("+(x*8.5).toFixed(2)+"deg) translateY(-6px)";
      });
      el.addEventListener("mouseleave",function(){
        el.style.transform="";
        el.style.boxShadow="";
        setTimeout(function(){el.style.transition=""},300);
      });
    });
  }
  document.addEventListener("DOMContentLoaded",initTilt);
  window.addEventListener("load",function(){setTimeout(initTilt,400)});
})();
