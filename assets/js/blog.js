const body=document.body,toast=document.getElementById("toast");
function showToast(msg){if(!toast)return;toast.textContent=msg;toast.classList.add("show");clearTimeout(window.t);window.t=setTimeout(()=>toast.classList.remove("show"),2200)}


const posts=[...document.querySelectorAll("#posts .post")],filter=document.getElementById("filter"),search=document.getElementById("search"),empty=document.getElementById("empty");
function filterPosts(topic){
  const q=search.value.toLowerCase().trim();let count=0;
  posts.forEach(p=>{const matchesTopic=topic==="all"||p.dataset.topic===topic;const matchesText=p.innerText.toLowerCase().includes(q);const show=matchesTopic&&matchesText;p.classList.toggle("hidden",!show);if(show)count++});
  empty.style.display=count?"none":"block";
}
filter.onchange=()=>{filterPosts(filter.value);document.querySelectorAll(".category").forEach(c=>c.classList.toggle("active",c.dataset.category===filter.value));showToast(filter.value==="all"?"Showing all articles":`Showing ${filter.value} articles`)};
search.oninput=()=>filterPosts(filter.value);
document.querySelectorAll(".category").forEach(c=>c.onclick=()=>{filter.value=c.dataset.category;filterPosts(c.dataset.category);document.querySelectorAll(".category").forEach(x=>x.classList.remove("active"));c.classList.add("active");document.getElementById("posts").scrollIntoView({behavior:"smooth",block:"start"});showToast(c.dataset.category==="all"?"Showing all articles":`Showing ${c.dataset.category} articles`)});
document.getElementById("subscribe").onsubmit=e=>{e.preventDefault();const email=document.getElementById("email").value;showToast(`Thanks — ${email} is subscribed`);e.target.reset()};
