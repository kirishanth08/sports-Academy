if(document.body){["theme","rtl","menu"].forEach(function(id){if(!document.getElementById(id)){var s=document.createElement("div");s.id=id;s.style.display="none";document.body.appendChild(s)}})}
const body=document.body,theme=document.getElementById("theme"),rtl=document.getElementById("rtl"),toast=document.getElementById("toast");
function showToast(msg){toast.textContent=msg;toast.classList.add("show");clearTimeout(window.tt);window.tt=setTimeout(()=>toast.classList.remove("show"),2600)}
theme.onclick=()=>{body.classList.toggle("dark");let d=body.classList.contains("dark");theme.textContent=d?"☀":"◐";localStorage.setItem("apex-theme",d?"dark":"light");showToast(d?"Dark mode enabled":"Light mode enabled")};
if(localStorage.getItem("apex-theme")==="dark"){body.classList.add("dark");theme.textContent="☀"}
rtl.onclick=()=>{let d=document.documentElement.dir==="rtl"?"ltr":"rtl";document.documentElement.dir=d;rtl.textContent=d==="rtl"?"LTR":"RTL";localStorage.setItem("apex-dir",d);showToast(d==="rtl"?"RTL layout enabled":"LTR layout enabled")};
if(localStorage.getItem("apex-dir")){let d=localStorage.getItem("apex-dir");document.documentElement.dir=d;rtl.textContent=d==="rtl"?"LTR":"RTL"}

document.getElementById("togglePass").onclick=()=>{let i=document.getElementById("password"),b=document.getElementById("togglePass");i.type=i.type==="password"?"text":"password";b.textContent=i.type==="password"?"Show":"Hide"};
document.querySelectorAll(".login-tabs button").forEach(b=>b.onclick=()=>{document.querySelectorAll(".login-tabs button").forEach(x=>x.classList.remove("active"));b.classList.add("active");showToast(b.dataset.role==="parent"?"Parent login selected":"Student login selected")});

window.apexAuth={
load(){try{return JSON.parse(localStorage.getItem("apex-accounts"))||[]}catch(err){return[]}},
find(email,role){
  const found=this.load().find(a=>a.email.toLowerCase()===String(email).toLowerCase()&&(!role||a.role===role));
  if(found)return found;
  const p=document.getElementById("password")?document.getElementById("password").value:"";
  return {name:"Athlete User",email:email||"user@apexmotion.com",password:p,role:role||"student"};
}
};
(function(){const q=new URLSearchParams(location.search);
if(q.get("email"))document.getElementById("email").value=q.get("email");
if(q.get("registered")==="1")showToast("Account created - please sign in.");
})();

/* CTA Sign-in Button -> Zero validation dummy: accepts any email & password */
if(typeof window.triggerLoginSuccess === "function"){
  document.getElementById("loginForm").onsubmit=window.triggerLoginSuccess;
}

document.getElementById("forgot").onclick=e=>{e.preventDefault();showToast("Password reset instructions would be sent here.")};
document.querySelectorAll("[data-social]").forEach(b=>b.onclick=()=>{
  const prov=b.dataset.social;
  showToast("✓ "+prov+" sign-in successful!");
  const feedback=document.getElementById("authFeedback");
  if(feedback){
    feedback.style.display="flex";
    feedback.classList.add("show");
    const title=document.getElementById("authFeedbackTitle");
    const msg=document.getElementById("authFeedbackMsg");
    if(title) title.textContent=prov+" Sign In Successful!";
    if(msg) msg.textContent="Authenticated with "+prov+". Welcome to Apex Motion!";
  }
});
/* preserve redirect param on signup link */
(function(){const q=new URLSearchParams(location.search);const r=q.get("redirect");if(r){document.querySelectorAll('a[href="signup.html"]').forEach(a=>{a.href="signup.html?redirect="+encodeURIComponent(r)});}})();
