const body=document.body,toast=document.getElementById("toast");
function showToast(msg){if(!toast)return;toast.textContent=msg;toast.classList.add("show");clearTimeout(window.t);window.t=setTimeout(()=>toast.classList.remove("show"),2200)}


function scrollToHeading(i){document.querySelectorAll(".article-body h2")[i]?.scrollIntoView({behavior:"smooth",block:"start"})}
async function shareArticle(type){if(type==="copy"){await navigator.clipboard?.writeText(location.href);showToast("Article link copied")}else if(navigator.share){navigator.share({title:document.title,url:location.href})}else{await navigator.clipboard?.writeText(location.href);showToast("Article link copied")}}


document.querySelectorAll('[data-share]').forEach(function(btn){btn.addEventListener('click',function(){ if(typeof shareArticle==='function') shareArticle(btn.dataset.share); });});
document.querySelectorAll('[data-scroll-heading]').forEach(function(a){a.addEventListener('click',function(e){e.preventDefault();if(typeof scrollToHeading==='function')scrollToHeading(Number(a.dataset.scrollHeading));});});
