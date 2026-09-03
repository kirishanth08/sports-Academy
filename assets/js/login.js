if(document.body){["theme","rtl","menu"].forEach(function(id){if(!document.getElementById(id)){var s=document.createElement("div");s.id=id;s.style.display="none";document.body.appendChild(s)}})}
const body=document.body,theme=document.getElementById("theme"),rtl=document.getElementById("rtl"),toast=document.getElementById("toast");
function showToast(msg){toast.textContent=msg;toast.classList.add("show");clearTimeout(window.tt);window.tt=setTimeout(()=>toast.classList.remove("show"),2200)}
theme.onclick=()=>{body.classList.toggle("dark");let d=body.classList.contains("dark");theme.textContent=d?"☀":"◐";localStorage.setItem("apex-theme",d?"dark":"light");showToast(d?"Dark mode enabled":"Light mode enabled")};
if(localStorage.getItem("apex-theme")==="dark"){body.classList.add("dark");theme.textContent="☀"}
rtl.onclick=()=>{let d=document.documentElement.dir==="rtl"?"ltr":"rtl";document.documentElement.dir=d;rtl.textContent=d==="rtl"?"LTR":"RTL";localStorage.setItem("apex-dir",d);showToast(d==="rtl"?"RTL layout enabled":"LTR layout enabled")};
if(localStorage.getItem("apex-dir")){let d=localStorage.getItem("apex-dir");document.documentElement.dir=d;rtl.textContent=d==="rtl"?"LTR":"RTL"}

document.getElementById("togglePass").onclick=()=>{let i=document.getElementById("password"),b=document.getElementById("togglePass");i.type=i.type==="password"?"text":"password";b.textContent=i.type==="password"?"Show":"Hide"};
document.querySelectorAll(".login-tabs button").forEach(b=>b.onclick=()=>{document.querySelectorAll(".login-tabs button").forEach(x=>x.classList.remove("active"));b.classList.add("active");showToast(b.dataset.role==="parent"?"Parent login selected":"Student login selected")});
window.apexAuth={
load(){try{return JSON.parse(localStorage.getItem("apex-accounts"))||[]}catch(err){return[]}},
find(email,role){return this.load().find(a=>a.email.toLowerCase()===String(email).toLowerCase()&&(!role||a.role===role))}
};
(function(){const q=new URLSearchParams(location.search);
if(q.get("email"))document.getElementById("email").value=q.get("email");
if(q.get("registered")==="1")showToast("Account created - please sign in.");
})();
document.getElementById("loginForm").onsubmit=e=>{
e.preventDefault();
const email=document.getElementById("email").value.trim(),password=document.getElementById("password").value;
const account=apexAuth.find(email);
if(!account){showToast("No account found with this email. Please sign up first.");return}
if(account.role==="admin"){showToast("This is an admin account. Use the Admin sign-in page.");return}
if(account.password!==password){showToast("Incorrect password. Please try again.");return}
localStorage.setItem("apex-session",JSON.stringify({name:account.name,email:account.email,role:account.role}));
showToast("Welcome back, "+account.name+"!");
const redirect=new URLSearchParams(location.search).get("redirect");
setTimeout(()=>location.href=redirect||"user-dashboard.html",800)};
document.getElementById("forgot").onclick=e=>{e.preventDefault();showToast("Password reset instructions would be sent here.")};
document.querySelectorAll("[data-social]").forEach(b=>b.onclick=()=>showToast(b.dataset.social+" sign-in is ready to connect."));
/* preserve redirect param on signup link */
(function(){const q=new URLSearchParams(location.search);const r=q.get("redirect");if(r){document.querySelectorAll('a[href="signup.html"]').forEach(a=>{a.href="signup.html?redirect="+encodeURIComponent(r)});}})();
