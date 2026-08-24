if(document.body){["theme","rtl","menu"].forEach(function(id){if(!document.getElementById(id)){var s=document.createElement("div");s.id=id;s.style.display="none";document.body.appendChild(s);}});}
const body=document.body;
const theme=document.getElementById("theme");
const rtl=document.getElementById("rtl");
const menu=document.getElementById("menu");
theme.onclick=()=>{body.classList.toggle("dark");theme.textContent=body.classList.contains("dark")?"☀":"◐";localStorage.setItem("apex-theme",body.classList.contains("dark")?"dark":"light")};
if(localStorage.getItem("apex-theme")==="dark"){body.classList.add("dark");theme.textContent="☀"}
rtl.onclick=()=>document.documentElement.dir=document.documentElement.dir==="rtl"?"ltr":"rtl";
menu.onclick=()=>{
const n=document.getElementById("mobileNav");
if(n.innerHTML){n.innerHTML="";return}
n.innerHTML='<div style="padding:14px 22px;background:var(--white);border-top:1px solid var(--line);display:grid;gap:13px;font-size:13px;font-weight:700"><a href="index.html">Home 1</a><a href="home-2.html">Home 2</a><a href="about.html">About Us</a><a href="programs.html">Programs</a><a href="coaches.html">Coaches</a><a href="facilities.html">Facilities</a><a href="pricing.html">Pricing</a><a href="blog.html">Blog</a><a href="contact.html">Contact Us</a></div>';
};
