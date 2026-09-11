const body=document.body,toast=document.getElementById("toast");
function showToast(msg){if(!toast)return;toast.textContent=msg;toast.classList.add("show");clearTimeout(window.t);window.t=setTimeout(()=>toast.classList.remove("show"),2200)}

const billing=document.getElementById("billingToggle"),priceArea=document.querySelector(".pricing");
billing.onclick=()=>{billing.classList.toggle("yearly");priceArea.classList.toggle("yearly");showToast(billing.classList.contains("yearly")?"Annual pricing selected — save 15%":"Monthly pricing selected")};

document.querySelectorAll(".faq-q").forEach(btn=>btn.onclick=()=>{const item=btn.parentElement;document.querySelectorAll(".faq-item.open").forEach(x=>{if(x!==item)x.classList.remove("open")});item.classList.toggle("open")});

/* ========== helpers ========== */
function hasSession(){try{const s=JSON.parse(localStorage.getItem("apex-session"));return s&&s.name}catch(e){return false}}

/* ========== cart (localStorage) ========== */
const CART_KEY="apex-cart";
function getCart(){try{return JSON.parse(localStorage.getItem(CART_KEY)||"[]")}catch(e){return[]}}
function saveCart(c){localStorage.setItem(CART_KEY,JSON.stringify(c))}
function cartCount(){return getCart().length}
function updateBadge(){
  const b=document.querySelector(".cart-badge");
  const btn=document.querySelector("[data-cart-toggle]");
  const n=cartCount();
  if(b){
    b.textContent=n;
    b.classList.toggle("show",n>0);
  }
  if(btn){
    if(n>0){
      btn.style.display="inline-flex";
      btn.classList.add("visible");
    }else{
      btn.style.display="none";
      btn.classList.remove("visible");
    }
  }
}

/* ========== plan data from DOM ========== */
const planData={};
document.querySelectorAll(".price-card").forEach(card=>{
  const name=card.querySelector(".plan").textContent.trim();
  const desc=card.querySelector(".plan-desc").textContent.trim();
  const monthly=card.querySelector(".monthly-price").textContent.trim();
  const yearly=card.querySelector(".yearly-price").textContent.trim();
  const sessions=card.querySelector(".billing-note").textContent.trim();
  const feats=[];card.querySelectorAll(".features div").forEach(d=>feats.push(d.textContent.trim()));
  planData[name]={name,desc,monthly,yearly,sessions,features:feats};
});

/* ========== Choose button → add to cart + open cart ========== */
document.querySelectorAll(".choose").forEach(btn=>{
  btn.addEventListener("click",function(e){
    e.preventDefault();
    const name=this.dataset.plan;
    const d=planData[name];
    if(!d)return;
    const cart=getCart();
    const exists=cart.findIndex(i=>i.plan===name&&i.billing==="monthly");
    if(exists>=0){showToast(name+" already in cart.");openCart();return;}
    cart.push({plan:name,billing:"monthly",price:d.monthly});
    saveCart(cart);
    updateBadge();
    showToast(name+" plan added to cart.");
    openCart();
  });
});

/* ========== plan details modal ========== */
const planModal=document.getElementById("planModal");
const planTitle=document.getElementById("planModalTitle");
const planDesc=document.getElementById("planModalDesc");
const planPrice=document.getElementById("planModalPrice");
const planSessions=document.getElementById("planModalSessions");
const planFeatures=document.getElementById("planModalFeatures");
const planAdd=document.getElementById("planModalAdd");
let currentPlan=null,currentBilling="monthly";

document.querySelectorAll('input[name="planBilling"]').forEach(r=>{
  r.addEventListener("change",function(){
    currentBilling=this.value;
    const d=planData[currentPlan];
    const price=currentBilling==="yearly"?d.yearly:d.monthly;
    planPrice.textContent=price;
    planAdd.textContent="Add to Cart — "+price;
  });
});

document.querySelector("[data-plan-close]").addEventListener("click",closePlanModal);
planModal.addEventListener("click",function(e){if(e.target===planModal)closePlanModal()});
function closePlanModal(){planModal.classList.remove("open");body.style.overflow=""}

planAdd.addEventListener("click",function(){
  if(!currentPlan)return;
  const d=planData[currentPlan];
  const price=currentBilling==="yearly"?d.yearly:d.monthly;
  const cart=getCart();
  const exists=cart.findIndex(i=>i.plan===currentPlan&&i.billing===currentBilling);
  if(exists>=0){showToast("Already in cart.");closePlanModal();openCart();return;}
  cart.push({plan:currentPlan,billing:currentBilling,price:price});
  saveCart(cart);
  updateBadge();
  closePlanModal();
  showToast(currentPlan+" plan added to cart.");
  openCart();
});

/* ========== cart panel ========== */
const cartPanel=document.getElementById("cartPanel");
const cartOverlay=document.getElementById("cartOverlay");
const cartBody=document.getElementById("cartBody");
const cartTotal=document.getElementById("cartTotal");

document.querySelector("[data-cart-toggle]").addEventListener("click",openCart);
document.querySelector("[data-cart-close]").addEventListener("click",closeCart);
cartOverlay.addEventListener("click",closeCart);
function openCart(){renderCart();cartPanel.classList.add("open");cartOverlay.classList.add("open");body.style.overflow="hidden"}
function closeCart(){cartPanel.classList.remove("open");cartOverlay.classList.remove("open");body.style.overflow=""}

function renderCart(){
  const items=getCart();
  if(!items.length){
    cartBody.innerHTML='<div class="cart-empty"><p style="margin:0 0 16px">Your cart is empty.</p><button type="button" class="btn-gold" style="width:auto;display:inline-block;padding:10px 22px;font-size:13px;margin:0 auto" id="continueShoppingBtn">Continue Browsing</button></div>';
    cartTotal.textContent="₹0";
    document.getElementById("cartCheckout").style.display="none";
    const csBtn=document.getElementById("continueShoppingBtn");
    if(csBtn) csBtn.addEventListener("click",closeCart);
    return;
  }
  let html="",total=0;
  items.forEach((it,i)=>{
    const raw=parseInt(it.price.replace(/[^0-9]/g,""))||0;
    total+=raw;
    html+='<div class="cart-item"><div class="cart-item-info"><h3>'+it.plan+" Plan</h3><p>"+it.price+' / athlete</p><div class="cart-item-billing">'+(it.billing==="yearly"?"Annual billing":"Monthly billing")+'</div><button class="cart-item-remove" data-remove="'+i+'">Remove</button></div><div class="cart-item-price">'+it.price+"</div></div>";
  });
  cartBody.innerHTML=html;
  cartTotal.textContent="₹"+total.toLocaleString("en-IN");
  document.getElementById("cartCheckout").style.display="block";
  cartBody.querySelectorAll("[data-remove]").forEach(btn=>{
    btn.addEventListener("click",function(){
      const idx=parseInt(this.dataset.remove);
      const cart=getCart();cart.splice(idx,1);saveCart(cart);updateBadge();renderCart();showToast("Removed from cart.");
    });
  });
}

/* ========== Proceed to Payment → login check ========== */
const loginRequiredModal=document.getElementById("loginRequiredModal");
document.querySelector("[data-login-close]").addEventListener("click",closeLoginRequired);
loginRequiredModal.addEventListener("click",function(e){if(e.target===loginRequiredModal)closeLoginRequired()});
function closeLoginRequired(){loginRequiredModal.classList.remove("open");body.style.overflow=""}

document.getElementById("loginRequiredBtn").addEventListener("click",function(){
  closeLoginRequired();closeCart();
  location.href="login.html?redirect=pricing.html";
});

document.getElementById("cartCheckout").addEventListener("click",function(){
  if(!cartCount())return;
  closeCart();
  if(!hasSession()){
    loginRequiredModal.classList.add("open");
    body.style.overflow="hidden";
    return;
  }
  openCheckout();
});

/* ========== checkout modal ========== */
const checkoutModal=document.getElementById("checkoutModal");
const checkoutSummary=document.getElementById("checkoutSummary");
const checkoutForm=document.getElementById("checkoutForm");
const checkoutSuccess=document.getElementById("checkoutSuccess");

function openCheckout(){
  const items=getCart();let total=0;
  let html="";
  items.forEach(it=>{
    const raw=parseInt(it.price.replace(/[^0-9]/g,""))||0;
    total+=raw;
    html+="<div><span>"+it.plan+" ("+(it.billing==="yearly"?"Annual":"Monthly")+")</span><strong>"+it.price+"</strong></div>";
  });
  html+="<div><span>Total</span><strong>₹"+total.toLocaleString("en-IN")+"</strong></div>";
  checkoutSummary.innerHTML=html;
  checkoutForm.style.display="block";
  checkoutSuccess.style.display="none";
  checkoutModal.classList.add("open");
  body.style.overflow="hidden";
}

document.querySelector("[data-checkout-close]").addEventListener("click",closeCheckout);
checkoutModal.addEventListener("click",function(e){if(e.target===checkoutModal)closeCheckout()});
function closeCheckout(){checkoutModal.classList.remove("open");body.style.overflow=""}

/* card number formatting */
document.getElementById("cardNum")?.addEventListener("input",function(){
  let v=this.value.replace(/\D/g,"").substring(0,16);
  this.value=v.replace(/(\d{4})(?=\d)/g,"$1 ");
});
document.getElementById("cardExp")?.addEventListener("input",function(){
  let v=this.value.replace(/\D/g,"").substring(0,4);
  if(v.length>=3)v=v.substring(0,2)+"/"+v.substring(2);
  this.value=v;
});

checkoutForm.addEventListener("submit",function(e){
  e.preventDefault();
  checkoutForm.style.display="none";
  checkoutSuccess.style.display="block";
  saveCart([]);updateBadge();
  showToast("Payment successful!");
});

/* ========== auto-open checkout if redirected from login ========== */
(function(){
  const q=new URLSearchParams(location.search);
  if(q.get("checkout")==="1"&&cartCount()&&hasSession()){
    openCheckout();
    history.replaceState(null,"","pricing.html");
  }
})();

updateBadge();
