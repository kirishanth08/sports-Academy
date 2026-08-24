if(document.body){["theme","rtl","menu"].forEach(function(id){if(!document.getElementById(id)){var s=document.createElement("div");s.id=id;s.style.display="none";document.body.appendChild(s);}});}
const body=document.body;
const theme=document.getElementById("theme");
const rtl=document.getElementById("rtl");
const menu=document.getElementById("menu");
const toast=document.getElementById("toast");

function showToast(message){
  toast.textContent=message;
  toast.classList.add("show");
  clearTimeout(window.toastTimer);
  window.toastTimer=setTimeout(()=>toast.classList.remove("show"),2200);
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
  const next=document.documentElement.dir==="rtl"?"ltr":"rtl";
  document.documentElement.dir=next;
  rtl.textContent=next==="rtl"?"LTR":"RTL";
  localStorage.setItem("apex-dir",next);
  showToast(next==="rtl"?"RTL layout enabled":"LTR layout enabled");
};

const savedDir=localStorage.getItem("apex-dir");
if(savedDir){
  document.documentElement.dir=savedDir;
  rtl.textContent=savedDir==="rtl"?"LTR":"RTL";
}

menu.onclick=()=>{
  const n=document.getElementById("mobileNav");
  if(n.innerHTML){n.innerHTML="";return}
  n.innerHTML='<div style="padding:14px 22px;background:var(--white);border-top:1px solid var(--line);display:grid;gap:13px;font-size:14px;font-weight:700"><a href="index.html">Home 1</a><a href="home-2.html">Home 2</a><a href="about.html">About Us</a><a href="programs.html">Programs</a><a href="coaches.html">Coaches</a><a href="facilities.html">Facilities</a><a href="pricing.html">Pricing</a><a href="blog.html">Blog</a><a href="contact.html">Contact Us</a><a href="login.html">Login</a><a href="register.html">Sign Up</a></div>';
};

const sessions=[...document.querySelectorAll(".session")];
const sportFilter=document.getElementById("sportFilter");

function filterSessions(){
  const value=sportFilter.value;
  let count=0;
  sessions.forEach(session=>{
    const visible=value==="all" || session.dataset.sport===value;
    session.style.display=visible?"grid":"none";
    if(visible) count++;
  });
  showToast(value==="all"?`Showing all ${count} sessions`:`Showing ${count} ${value} session${count===1?"":"s"}`);
}
sportFilter.addEventListener("change",filterSessions);

let weekOffset=0;

function formatDay(date){
  return date.toLocaleDateString("en-US",{weekday:"short"}).toUpperCase();
}
function formatMonth(date){
  return date.toLocaleDateString("en-US",{month:"short"}).toUpperCase();
}
function renderWeek(){
  const base=new Date();
  base.setHours(12,0,0,0);
  const day=base.getDay();
  const mondayOffset=(day+6)%7;
  base.setDate(base.getDate()-mondayOffset+(weekOffset*7));

  const grid=document.getElementById("dayGrid");
  grid.innerHTML="";
  for(let i=0;i<7;i++){
    const d=new Date(base);
    d.setDate(base.getDate()+i);
    const el=document.createElement("div");
    el.className="day"+(weekOffset===0 && i===mondayOffset?" today":"");
    el.innerHTML=`<b>${formatDay(d)}</b><strong>${d.getDate()}</strong>`;
    grid.appendChild(el);
  }

  const label=weekOffset===0?"This Week":weekOffset>0?`Week +${weekOffset}`:`Week ${weekOffset}`;
  document.getElementById("currentWeek").textContent=label;
}

document.getElementById("prevWeek").onclick=()=>{
  weekOffset--;
  renderWeek();
  showToast("Previous week selected");
};
document.getElementById("nextWeek").onclick=()=>{
  weekOffset++;
  renderWeek();
  showToast("Next week selected");
};
document.getElementById("currentWeek").onclick=()=>{
  weekOffset=0;
  renderWeek();
  showToast("Returned to this week");
};

renderWeek();

/* Make informational footer social items clickable. */
document.querySelectorAll("footer p").forEach(p=>{
  if(p.textContent.includes("Instagram")){
    p.innerHTML='<a href="https://instagram.com/" target="_blank" rel="noopener noreferrer">◎ Instagram</a> &nbsp; <a href="https://youtube.com/" target="_blank" rel="noopener noreferrer">◉ YouTube</a>';
  }
});
