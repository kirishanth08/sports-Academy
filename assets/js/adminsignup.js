const body=document.body,theme=document.getElementById("theme"),rtl=document.getElementById("rtl"),toast=document.getElementById("toast");

function showToast(msg){
toast.textContent=msg;toast.classList.add("show");
clearTimeout(window.tt);window.tt=setTimeout(()=>toast.classList.remove("show"),2600);
}

theme.onclick=()=>{
body.classList.toggle("dark");
const d=body.classList.contains("dark");
theme.textContent=d?"☀":"◐";
localStorage.setItem("apex-theme",d?"dark":"light");
showToast(d?"Dark mode enabled":"Light mode enabled");
};
if(localStorage.getItem("apex-theme")==="dark"){body.classList.add("dark");theme.textContent="☀"}

rtl.onclick=()=>{
const d=document.documentElement.dir==="rtl"?"ltr":"rtl";
document.documentElement.dir=d;
rtl.textContent=d==="rtl"?"LTR":"RTL";
localStorage.setItem("apex-dir",d);
showToast(d==="rtl"?"RTL layout enabled":"LTR layout enabled");
};
if(localStorage.getItem("apex-dir")){
const d=localStorage.getItem("apex-dir");
document.documentElement.dir=d;rtl.textContent=d==="rtl"?"LTR":"RTL";
}

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
document.getElementById("adminSignupForm").onsubmit=e=>{
e.preventDefault();
const password=document.getElementById("password").value;
const confirm=document.getElementById("confirmPassword").value;
if(password && confirm && password!==confirm){showToast("Passwords do not match.");return;}
const email=document.getElementById("email").value.trim();
if(email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)){showToast("Please enter a valid email address.");return;}
const roleSel=document.getElementById("role");
const firstName=(document.getElementById("firstName").value||"").trim();
const lastName=(document.getElementById("lastName").value||"").trim();
const name=(firstName+" "+lastName).trim()||"Academy Administrator";

const accounts=apexAuth.load();
const existingIndex=accounts.findIndex(x=>x.email.toLowerCase()===email.toLowerCase());
if(existingIndex>=0){
  accounts[existingIndex]={name:name,email:email.toLowerCase(),password:password,role:"admin",title:roleSel?roleSel.value:"Administrator"};
} else {
  accounts.push({name:name,email:email.toLowerCase(),password:password,role:"admin",title:roleSel?roleSel.value:"Administrator"});
}
apexAuth.save(accounts);
localStorage.setItem("apex-session",JSON.stringify({name:name,email:email,role:"admin",title:roleSel?roleSel.value:"Administrator"}));

// In-page success banner
const feedback=document.getElementById("authFeedback");
const title=document.getElementById("authFeedbackTitle");
const msg=document.getElementById("authFeedbackMsg");
if(feedback){
  if(title) title.textContent="Admin Account Created Successfully!";
  if(msg) msg.textContent="Welcome, "+name+"! Your staff account ("+(roleSel?roleSel.value:"Administrator")+") has been created.";
  feedback.classList.add("show");
  feedback.scrollIntoView({behavior:"smooth",block:"nearest"});
}

// Toast
showToast("✓ Admin account created successfully!");

// Button state
const submitBtn=document.querySelector("#adminSignupForm button.submit");
if(submitBtn){
  const originalText=submitBtn.innerHTML;
  submitBtn.classList.add("success-state");
  submitBtn.innerHTML="✓ Admin Account Created!";
  setTimeout(()=>{
    submitBtn.classList.remove("success-state");
    submitBtn.innerHTML=originalText;
  },3200);
}
};

document.getElementById("termsLink").onclick=e=>{
e.preventDefault();showToast("Staff terms: Academy administrator authorization acknowledged.");
};
document.getElementById("privacyLink").onclick=e=>{
e.preventDefault();showToast("Staff privacy policy: Academy operational data protected.");
};
