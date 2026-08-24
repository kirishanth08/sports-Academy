const body=document.body,sidebar=document.getElementById("sidebar"),overlay=document.getElementById("overlay");
const menu=document.getElementById("menu"),theme=document.getElementById("theme"),rtl=document.getElementById("rtl");

function toast(msg){
let t=document.getElementById("toast");
if(!t){t=document.createElement("div");t.id="toast";t.style.cssText="position:fixed;right:22px;bottom:22px;background:#3B163A;color:#fff;padding:12px 17px;border-radius:8px;font:700 11px DM Sans;z-index:100;box-shadow:0 10px 30px #0002";document.body.appendChild(t)}
t.textContent=msg;t.style.opacity="1";clearTimeout(window.x);window.x=setTimeout(()=>t.style.opacity="0",2200)
}
menu.onclick=()=>{sidebar.classList.toggle("open");overlay.classList.toggle("show")}
overlay.onclick=()=>{sidebar.classList.remove("open");overlay.classList.remove("show")};

theme.onclick=()=>{
body.classList.toggle("dark");const d=body.classList.contains("dark");
theme.textContent=d?"☀":"◐";localStorage.setItem("apex-theme",d?"dark":"light");toast(d?"Dark mode enabled":"Light mode enabled")
};
if(localStorage.getItem("apex-theme")==="dark"){body.classList.add("dark");theme.textContent="☀"}

rtl.onclick=()=>{
const d=document.documentElement.dir==="rtl"?"ltr":"rtl";
document.documentElement.dir=d;rtl.textContent=d==="rtl"?"LTR":"RTL";localStorage.setItem("apex-dir",d);toast(d==="rtl"?"RTL layout enabled":"LTR layout enabled")
};
if(localStorage.getItem("apex-dir")){const d=localStorage.getItem("apex-dir");document.documentElement.dir=d;rtl.textContent=d==="rtl"?"LTR":"RTL"}

document.getElementById("notification").onclick=()=>toast("You have 4 new academy notifications.");
document.getElementById("logout").onclick=()=>{if(confirm("Log out of the admin portal?")){localStorage.removeItem("apex-session");location.href="adminlogin.html"}};

/* personalized greeting from auth session */
(function(){
let s=null;try{s=JSON.parse(localStorage.getItem("apex-session"))}catch(err){}
if(s&&s.name){const h=document.querySelector("h1");
if(h){const hr=new Date().getHours();const g=hr<12?"Good morning":hr<18?"Good afternoon":"Good evening";
h.textContent=g+", "+s.name.split(" ")[0]+"."}}
})();

document.querySelectorAll(".nav a").forEach(a=>{
a.addEventListener("click",()=>{if(window.innerWidth<=1100){sidebar.classList.remove("open");overlay.classList.remove("show")}});
});


// Help & Support popup
const helpPopup=document.getElementById('helpPopup');
document.querySelectorAll('[data-help], [data-module="admin-help"]').forEach(el=>el.addEventListener('click',e=>{e.preventDefault();helpPopup?.classList.add('show')}));
document.querySelector('[data-close-help]')?.addEventListener('click',()=>helpPopup?.classList.remove('show'));
helpPopup?.addEventListener('click',e=>{if(e.target===helpPopup)helpPopup.classList.remove('show')});
document.getElementById('helpSend')?.addEventListener('click',()=>{const m=document.getElementById('helpMessage');if(!m?.value.trim()){m?.focus();return}helpPopup.classList.remove('show');m.value='';toast('Support request submitted.');});

document.querySelectorAll(".quick-nav[data-href]").forEach(btn => {
  btn.addEventListener("click", () => {
    const target = btn.getAttribute("data-href");
    if (target) window.location.href = target;
  });
});
