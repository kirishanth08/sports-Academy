const body=document.body,toast=document.getElementById("toast");
function showToast(msg){if(!toast)return;toast.textContent=msg;toast.classList.add("show");clearTimeout(window.t);window.t=setTimeout(()=>toast.classList.remove("show"),2200)}

document.getElementById("notifyForm").addEventListener("submit",e=>{e.preventDefault();showToast("You're on the launch list.");e.target.reset()});
