if(document.body){["theme","rtl","menu"].forEach(function(id){if(!document.getElementById(id)){var s=document.createElement("div");s.id=id;s.style.display="none";document.body.appendChild(s)}})}
const body=document.body,theme=document.getElementById("theme"),rtl=document.getElementById("rtl"),toast=document.getElementById("toast");

function showToast(msg){
toast.textContent=msg;
toast.classList.add("show");
clearTimeout(window.tt);
window.tt=setTimeout(()=>toast.classList.remove("show"),2300);
}

theme.onclick=()=>{
body.classList.toggle("dark");
let d=body.classList.contains("dark");
theme.textContent=d?"☀":"◐";
localStorage.setItem("apex-theme",d?"dark":"light");
showToast(d?"Dark mode enabled":"Light mode enabled");
};

if(localStorage.getItem("apex-theme")==="dark"){
body.classList.add("dark");
theme.textContent="☀";
}

rtl.onclick=()=>{
let d=document.documentElement.dir==="rtl"?"ltr":"rtl";
document.documentElement.dir=d;
rtl.textContent=d==="rtl"?"LTR":"RTL";
localStorage.setItem("apex-dir",d);
showToast(d==="rtl"?"RTL layout enabled":"LTR layout enabled");
};

if(localStorage.getItem("apex-dir")){
let d=localStorage.getItem("apex-dir");
document.documentElement.dir=d;
rtl.textContent=d==="rtl"?"LTR":"RTL";
}

document.querySelectorAll(".account-type button").forEach(btn=>{
btn.onclick=()=>{
document.querySelectorAll(".account-type button").forEach(x=>x.classList.remove("active"));
btn.classList.add("active");
showToast(btn.dataset.type==="parent"?"Parent account selected":"Student account selected");
};
});

document.querySelectorAll(".toggle-pass").forEach(btn=>{
btn.onclick=()=>{
const input=document.getElementById(btn.dataset.target);
input.type=input.type==="password"?"text":"password";
btn.textContent=input.type==="password"?"Show":"Hide";
};
});

window.apexAuth={
load(){try{return JSON.parse(localStorage.getItem("apex-accounts"))||[]}catch(err){return[]}},
save(a){localStorage.setItem("apex-accounts",JSON.stringify(a))},
find(email){return this.load().find(x=>x.email.toLowerCase()===String(email).toLowerCase())}
};
document.getElementById("signupForm").onsubmit=e=>{
e.preventDefault();
const password=document.getElementById("password").value;
const confirm=document.getElementById("confirmPassword").value;
if(password!==confirm){
showToast("Passwords do not match.");
return;
}
const email=document.getElementById("email").value.trim();
if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)){showToast("Please enter a valid email address.");return;}
if(!document.getElementById("terms").checked){showToast("Please accept the Terms to continue.");return;}
if(apexAuth.find(email)){
showToast("An account with this email already exists. Please sign in.");
return;
}
const typeBtn=document.querySelector(".account-type button.active");
const name=(document.getElementById("firstName").value.trim()+" "+document.getElementById("lastName").value.trim()).trim();
const accounts=apexAuth.load();
accounts.push({name:name,email:email.toLowerCase(),password:password,role:typeBtn?typeBtn.dataset.type:"student"});
apexAuth.save(accounts);
showToast("Account created! Redirecting you to sign in...");
setTimeout(()=>location.href="login.html?registered=1&email="+encodeURIComponent(email),900);
};

document.querySelectorAll("[data-social]").forEach(btn=>{
btn.onclick=()=>showToast(btn.dataset.social+" sign-up is ready to connect.");
});

document.getElementById("termsLink").onclick=e=>{
e.preventDefault();
showToast("Terms of Service can be connected here.");
};
document.getElementById("privacyLink").onclick=e=>{
e.preventDefault();
showToast("Privacy Policy can be connected here.");
};
