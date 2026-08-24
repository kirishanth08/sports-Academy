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