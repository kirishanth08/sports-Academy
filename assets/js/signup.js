if(document.body){["theme","rtl","menu"].forEach(function(id){if(!document.getElementById(id)){var s=document.createElement("div");s.id=id;s.style.display="none";document.body.appendChild(s)}})}
const body=document.body,theme=document.getElementById("theme"),rtl=document.getElementById("rtl"),toast=document.getElementById("toast");

function showToast(msg){
toast.textContent=msg;
toast.classList.add("show");
clearTimeout(window.tt);
window.tt=setTimeout(()=>toast.classList.remove("show"),2600);
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

/* CTA Sign-up Button -> Dummy Page: Only shows success message, NO REDIRECT */
document.getElementById("signupForm").onsubmit=e=>{
e.preventDefault();
const password=document.getElementById("password").value;
const confirm=document.getElementById("confirmPassword").value;
if(password && confirm && password!==confirm){
showToast("Passwords do not match.");
return;
}
const email=document.getElementById("email").value.trim();
if(email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)){showToast("Please enter a valid email address.");return;}
if(!document.getElementById("terms").checked){showToast("Please accept the Terms to continue.");return;}

const typeBtn=document.querySelector(".account-type button.active");
const role=typeBtn?typeBtn.dataset.type:"student";
const firstName=(document.getElementById("firstName").value||"").trim();
const lastName=(document.getElementById("lastName").value||"").trim();
const name=(firstName+" "+lastName).trim()||"New Athlete";

const accounts=apexAuth.load();
const existingIndex=accounts.findIndex(x=>x.email.toLowerCase()===email.toLowerCase());
if(existingIndex>=0){
  accounts[existingIndex]={name:name,email:email.toLowerCase(),password:password,role:role};
} else {
  accounts.push({name:name,email:email.toLowerCase(),password:password,role:role});
}
apexAuth.save(accounts);
localStorage.setItem("apex-session",JSON.stringify({name:name,email:email,role:role}));

// Show in-page success feedback banner
const feedback=document.getElementById("authFeedback");
const title=document.getElementById("authFeedbackTitle");
const msg=document.getElementById("authFeedbackMsg");
if(feedback){
  if(title) title.textContent="Account Created Successfully!";
  if(msg) msg.textContent="Welcome to Apex Motion Academy, "+name+"! Your "+(role==="parent"?"Parent":"Student")+" account is active.";
  feedback.classList.add("show");
  feedback.scrollIntoView({behavior:"smooth",block:"nearest"});
}

// Toast notification
showToast("✓ Account created successfully!");

// Visual success state on CTA button
const submitBtn=document.querySelector("#signupForm button.submit");
if(submitBtn){
  const originalText=submitBtn.innerHTML;
  submitBtn.classList.add("success-state");
  submitBtn.innerHTML="✓ Account Created Successfully!";
  setTimeout(()=>{
    submitBtn.classList.remove("success-state");
    submitBtn.innerHTML=originalText;
  },3200);
}
};

document.querySelectorAll("[data-social]").forEach(btn=>{
btn.onclick=()=>{
  const prov=btn.dataset.social;
  showToast("✓ "+prov+" registration successful!");
  const feedback=document.getElementById("authFeedback");
  if(feedback){
    feedback.classList.add("show");
    const title=document.getElementById("authFeedbackTitle");
    const msg=document.getElementById("authFeedbackMsg");
    if(title) title.textContent=prov+" Sign Up Successful!";
    if(msg) msg.textContent="Account registered via "+prov+". Welcome to Apex Motion!";
  }
};
});

document.getElementById("termsLink").onclick=e=>{
e.preventDefault();
showToast("Terms of Service: All demo academy activities are for showcase.");
};
document.getElementById("privacyLink").onclick=e=>{
e.preventDefault();
showToast("Privacy Policy: Demo data is stored locally in your browser.");
};
