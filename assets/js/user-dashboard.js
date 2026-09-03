const toast = document.getElementById("toast");
function showToast(message){
  if(!toast) return;
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(window.__toastTimer);
  window.__toastTimer = setTimeout(() => toast.classList.remove("show"), 1800);
}

document.querySelectorAll("[data-menu]").forEach(btn => {
  btn.addEventListener("click", () => document.getElementById("sidebar")?.classList.toggle("open"));
});

if(localStorage.getItem("apex-theme")==="dark"){document.body.classList.add("dark");}
document.querySelectorAll("[data-theme]").forEach(btn => {
  btn.addEventListener("click", () => {
    document.body.classList.toggle("dark");
    const dark=document.body.classList.contains("dark");
    localStorage.setItem("apex-theme", dark ? "dark" : "light");
    showToast(dark ? "Dark mode enabled." : "Light mode enabled.");
  });
});

document.querySelectorAll("[data-rtl]").forEach(btn => {
  btn.addEventListener("click", () => {
    document.documentElement.dir = document.documentElement.dir === "rtl" ? "ltr" : "rtl";
    showToast(document.documentElement.dir === "rtl" ? "RTL layout enabled" : "LTR layout enabled");
  });
});

document.querySelectorAll("[data-notifications]").forEach(btn => {
  btn.addEventListener("click", () => showToast("You have 3 new training updates."));
});

document.querySelectorAll(".nav a").forEach(link => {
  link.addEventListener("click", e => {
    if(link.dataset.modal === "support") {
      e.preventDefault();
      document.getElementById("supportModal")?.classList.add("show");
      return;
    }
    if(link.getAttribute("href") === "#") {
      e.preventDefault();
    }
  });
});

document.querySelectorAll("[data-support-open]").forEach(btn => {
  btn.addEventListener("click", () => document.getElementById("supportModal")?.classList.add("show"));
});
document.querySelectorAll("[data-support-close]").forEach(btn => {
  btn.addEventListener("click", () => document.getElementById("supportModal")?.classList.remove("show"));
});
document.getElementById("supportModal")?.addEventListener("click", e => {
  if(e.target.id === "supportModal") e.currentTarget.classList.remove("show");
});
document.getElementById("supportForm")?.addEventListener("submit", e => {
  e.preventDefault();
  e.currentTarget.reset();
  document.getElementById("supportModal")?.classList.remove("show");
  showToast("Support request submitted successfully.");
});

document.querySelectorAll("form[data-demo-form]").forEach(form => {
  form.addEventListener("submit", e => {
    e.preventDefault();
    form.reset();
    showToast("Changes saved successfully.");
  });
});

document.querySelectorAll("[data-action]").forEach(btn => {
  btn.addEventListener("click", () => {
    const destination = btn.dataset.action;
    if(destination) window.location.href = destination;
  });
});
/* portal logout */
document.querySelectorAll("[data-logout]").forEach(btn => {
  btn.addEventListener("click", e => {
    e.preventDefault();
    if (confirm("Log out of the student portal?")) {
      localStorage.removeItem("apex-session");
      location.href = "login.html";
    }
  });
});

/* personalized greeting from auth session */
(function () {
  let s = null;
  try { s = JSON.parse(localStorage.getItem("apex-session")); } catch (err) {}
  if (s && s.name) {
    const h = document.querySelector(".welcome h1");
    if (h) {
      const hr = new Date().getHours();
      const g = hr < 12 ? "Good morning" : hr < 18 ? "Good afternoon" : "Good evening";
      h.textContent = g + ", " + s.name.split(" ")[0] + ".";
    }
  }
})();
/* company logo -> home page */
(function(){
  const brand=document.querySelector(".brand,.admin-brand");
  if(brand){brand.style.cursor="pointer";brand.title="Back to home";brand.addEventListener("click",()=>location.href="index.html");}
})();
/* ---- profile save / load (user-profile.html only) ---- */
(function(){
  var form=document.querySelector("form[data-profile]");
  if(!form) return;
  var saved={};
  try{ saved=JSON.parse(localStorage.getItem("apex-profile")||"{}"); }catch(e){}
  var keys=["name","dob","email","phone","address"];
  var inputs=[].slice.call(form.querySelectorAll("input,textarea"));
  inputs.forEach(function(inp,i){ if(saved[keys[i]]) inp.value=saved[keys[i]]; });

  form.addEventListener("submit",function(e){
    e.preventDefault();
    var data={};
    inputs.forEach(function(inp,i){ data[keys[i]]=inp.value; });
    localStorage.setItem("apex-profile",JSON.stringify(data));
    /* update sidebar name + greeting immediately */
    var sideName=document.querySelector(".sidebar-bottom strong");
    if(sideName&&data.name) sideName.textContent=data.name;
    try{
      var s=JSON.parse(localStorage.getItem("apex-session"));
      if(s){ s.name=data.name; localStorage.setItem("apex-session",JSON.stringify(s)); }
    }catch(x){}
    /* update greeting if present */
    var wh=document.querySelector(".welcome h1");
    if(wh&&data.name){
      var hr=new Date().getHours();
      var g=hr<12?"Good morning":hr<18?"Good afternoon":"Good evening";
      wh.textContent=g+", "+data.name.split(" ")[0]+".";
    }
    showToast("Profile updated successfully.");
  });
})();

/* ---- inline editable dashboard values (data-editable elements) ---- */
(function(){
  var key="apex-dash-data";
  var page="user-dashboard";
  var editables=[].slice.call(document.querySelectorAll("[data-editable]"));
  if(!editables.length) return;
  var saved={};
  try{ saved=JSON.parse(localStorage.getItem(key)||"{}")[page]||{}; }catch(e){}
  editables.forEach(function(el,i){
    if(saved[i]!==undefined) el.innerHTML=saved[i];
    el.setAttribute("contenteditable","true");
    el.style.outline="none";
    el.style.borderRadius="4px";
    el.addEventListener("focus",function(){
      el.style.boxShadow="0 0 0 2px rgba(240,201,134,.45)";
    });
    el.addEventListener("blur",function(){
      el.style.boxShadow="none";
      var store={};
      try{ store=JSON.parse(localStorage.getItem(key)||"{}"); }catch(e){}
      store[page]={};
      editables.forEach(function(e2,j){ store[page][j]=e2.innerHTML; });
      localStorage.setItem(key,JSON.stringify(store));
      showToast("Dashboard updated.");
    });
  });
})();