const body=document.body,toast=document.getElementById("toast");
function showToast(msg){if(!toast)return;toast.textContent=msg;toast.classList.add("show");clearTimeout(window.t);window.t=setTimeout(()=>toast.classList.remove("show"),2200)}


const billing=document.getElementById("billingToggle"),priceArea=document.querySelector(".pricing");
billing.onclick=()=>{billing.classList.toggle("yearly");priceArea.classList.toggle("yearly");showToast(billing.classList.contains("yearly")?"Annual pricing selected — save 15%":"Monthly pricing selected")};

document.querySelectorAll(".faq-q").forEach(btn=>btn.onclick=()=>{const item=btn.parentElement;document.querySelectorAll(".faq-item.open").forEach(x=>{if(x!==item)x.classList.remove("open")});item.classList.toggle("open")});

document.querySelectorAll(".choose").forEach(btn=>btn.onclick=(e)=>{showToast(btn.dataset.plan+" plan selected");});
