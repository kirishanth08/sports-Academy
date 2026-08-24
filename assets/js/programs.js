if(document.body){["theme","rtl","menu"].forEach(function(id){if(!document.getElementById(id)){var s=document.createElement("div");s.id=id;s.style.display="none";document.body.appendChild(s)}})}
const body=document.body,theme=document.getElementById("theme"),rtl=document.getElementById("rtl"),menu=document.getElementById("menu");
theme.addEventListener("click",()=>{body.classList.toggle("dark");theme.textContent=body.classList.contains("dark")?"☀":"◐";localStorage.setItem("apex-programs-theme",body.classList.contains("dark")?"dark":"light")});
if(localStorage.getItem("apex-programs-theme")==="dark"){body.classList.add("dark");theme.textContent="☀"}
rtl.addEventListener("click",()=>{document.documentElement.dir=document.documentElement.dir==="rtl"?"ltr":"rtl"});
menu.addEventListener("click",()=>{
const n=document.getElementById("mobileNav");
if(n.innerHTML){n.innerHTML="";n.style.display="none";return}
n.innerHTML='<div style="padding:14px 22px;background:var(--white);border-top:1px solid var(--line);display:grid;gap:13px;font-size:13px;font-weight:700"><a href="index.html">Home 1</a><a href="home-2.html">Home 2</a><a href="about.html">About Us</a><a href="programs.html">Programs</a><a href="facilities.html">Facilities</a><a href="pricing.html">Pricing</a><a href="blog.html">Blog</a><a href="contact.html">Contact Us</a></div>';
n.style.display="block";
});
