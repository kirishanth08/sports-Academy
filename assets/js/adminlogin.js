const body=document.body;
const theme=document.getElementById("theme");
const rtl=document.getElementById("rtl");
const toast=document.getElementById("toast");

function showToast(msg){
toast.textContent=msg;
toast.classList.add("show");
clearTimeout(window.toastTimer);
window.toastTimer=setTimeout(()=>toast.classList.remove("show"),2600);
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

/* CTA Sign-in Button -> Dummy Page: Only shows success message, NO REDIRECT */
document.getElementById("adminLoginForm").onsubmit=e=>{
e.preventDefault();
const email=(document.getElementById("email").value||"").trim();
const account=apexAuth.find(email,"admin");
const name=account?account.name:"Academy Admin";

localStorage.setItem("apex-session",JSON.stringify({name:name,email:email||"admin@apexmotion.com",role:"admin"}));

// In-page success banner
const feedback=document.getElementById("authFeedback");
const title=document.getElementById("authFeedbackTitle");
const msg=document.getElementById("authFeedbackMsg");
if(feedback){
  if(title) title.textContent="Admin Sign In Successful!";
  if(msg) msg.textContent="Welcome back, "+name+"! You have signed in with administrator privileges.";
  feedback.classList.add("show");
  feedback.scrollIntoView({behavior:"smooth",block:"nearest"});
}

// Toast
showToast("✓ Admin sign-in successful!");

// Button state
const submitBtn=document.querySelector("#adminLoginForm button.submit");
if(submitBtn){
  const originalText=submitBtn.innerHTML;
  submitBtn.classList.add("success-state");
  submitBtn.innerHTML="✓ Admin Signed In Successfully!";
  setTimeout(()=>{
    submitBtn.classList.remove("success-state");
    submitBtn.innerHTML=originalText;
  },3200);
}
};
