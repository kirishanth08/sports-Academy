const body=document.body;
const theme=document.getElementById("theme");
const rtl=document.getElementById("rtl");
const toast=document.getElementById("toast");

function showToast(msg){
toast.textContent=msg;
toast.classList.add("show");
clearTimeout(window.toastTimer);
window.toastTimer=setTimeout(()=>toast.classList.remove("show"),2300);
}

theme.onclick=()=>{
body.classList.toggle("dark");
const dark=body.classList.contains("dark");
theme.textContent=dark?"☀":"◐";
localStorage.setItem("apex-theme",dark?"dark":"light");
showToast(dark?"Dark mode enabled":"Light mode enabled");
};

if(localStorage.getItem("apex-theme")==="dark"){
body.classList.add("dark");
theme.textContent="☀";
}

rtl.onclick=()=>{
const direction=document.documentElement.dir==="rtl"?"ltr":"rtl";
document.documentElement.dir=direction;
rtl.textContent=direction==="rtl"?"LTR":"RTL";
localStorage.setItem("apex-dir",direction);
showToast(direction==="rtl"?"RTL layout enabled":"LTR layout enabled");
};

if(localStorage.getItem("apex-dir")){
const direction=localStorage.getItem("apex-dir");
document.documentElement.dir=direction;
rtl.textContent=direction==="rtl"?"LTR":"RTL";
}

document.getElementById("togglePass").onclick=()=>{
const input=document.getElementById("password");
const btn=document.getElementById("togglePass");
input.type=input.type==="password"?"text":"password";
btn.textContent=input.type==="password"?"Show":"Hide";
};

document.getElementById("forgot").onclick=e=>{
e.preventDefault();
showToast("Password reset flow can be connected here.");
};

window.apexAuth={
load(){try{return JSON.parse(localStorage.getItem("apex-accounts"))||[]}catch(err){return[]}},
find(email,role){return this.load().find(a=>a.email.toLowerCase()===String(email).toLowerCase()&&(!role||a.role===role))}
};
(function(){const q=new URLSearchParams(location.search);
if(q.get("email"))document.getElementById("email").value=q.get("email");
if(q.get("registered")==="1")showToast("Admin account created - please sign in.");
})();
document.getElementById("adminLoginForm").onsubmit=e=>{
e.preventDefault();
const email=document.getElementById("email").value.trim(),password=document.getElementById("password").value;
const account=apexAuth.find(email,"admin");
if(!account){showToast("No admin account found with this email.");return}
if(account.password!==password){showToast("Incorrect password. Please try again.");return}
localStorage.setItem("apex-session",JSON.stringify({name:account.name,email:account.email,role:"admin"}));
showToast("Welcome back, "+account.name+"!");
setTimeout(()=>location.href="admin-dashboard.html",800);
};
