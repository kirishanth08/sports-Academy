
document.addEventListener("DOMContentLoaded", () => {
  const body = document.body;
  const sidebar = document.querySelector(".admin-sidebar");
  const overlay = document.querySelector(".admin-overlay");
  const menu = document.querySelector(".admin-menu");
  const theme = document.querySelector("[data-theme]");
  const rtl = document.querySelector("[data-rtl]");

  const toast = (message) => {
    let t = document.getElementById("adminToast");
    if (!t) {
      t = document.createElement("div");
      t.id = "adminToast";
      t.style.cssText =
        "position:fixed;right:20px;bottom:20px;background:#3b163a;color:#fff;padding:12px 16px;border-radius:8px;font:700 12px 'DM Sans';z-index:9999;box-shadow:0 10px 30px #0003";
      document.body.appendChild(t);
    }
    t.textContent = message;
    t.style.opacity = "1";
    clearTimeout(window.__toastTimer);
    window.__toastTimer = setTimeout(() => t.style.opacity = "0", 2200);
  };

  // Dark mode
  const savedTheme = localStorage.getItem("apex-admin-theme");
  if (savedTheme === "dark") body.classList.add("dark");
  const syncTheme = () => {
    if (theme) theme.textContent = body.classList.contains("dark") ? "☀" : "◐";
  };
  syncTheme();
  theme?.addEventListener("click", () => {
    body.classList.toggle("dark");
    localStorage.setItem("apex-admin-theme", body.classList.contains("dark") ? "dark" : "light");
    syncTheme();
    toast(body.classList.contains("dark") ? "Dark mode enabled" : "Light mode enabled");
  });

  // RTL
  const savedDir = localStorage.getItem("apex-dir");
  if (savedDir) document.documentElement.dir = savedDir;
  const syncDir = () => {
    if (rtl) rtl.textContent = document.documentElement.dir === "rtl" ? "LTR" : "RTL";
  };
  syncDir();
  rtl?.addEventListener("click", () => {
    document.documentElement.dir = document.documentElement.dir === "rtl" ? "ltr" : "rtl";
    localStorage.setItem("apex-dir", document.documentElement.dir);
    syncDir();
    toast(document.documentElement.dir === "rtl" ? "RTL layout enabled" : "LTR layout enabled");
  });

  // Mobile sidebar
  menu?.addEventListener("click", () => {
    sidebar?.classList.toggle("open");
    overlay?.classList.toggle("show");
  });
  overlay?.addEventListener("click", () => {
    sidebar?.classList.remove("open");
    overlay?.classList.remove("show");
  });

  // Logout
  document.querySelectorAll("[data-logout]").forEach(btn => {
    btn.addEventListener("click", () => {
      if (confirm("Log out of the admin portal?")) location.href = "adminlogin.html";
    });
  });

  // Search/filter
  const search = document.querySelector("[data-search]");
  const rows = document.querySelectorAll("[data-row]");
  search?.addEventListener("input", () => {
    const q = search.value.trim().toLowerCase();
    rows.forEach(row => {
      row.style.display = !q || row.textContent.toLowerCase().includes(q) ? "" : "none";
    });
  });

  // Add New buttons perform a useful action instead of doing nothing.
  document.querySelectorAll("[data-add]").forEach(btn => {
    btn.addEventListener("click", () => {
      const target = btn.getAttribute("data-add");
      if (target) location.href = target;
      else toast("New entry form is ready to be connected.");
    });
  });

  // Save buttons
  document.querySelectorAll("[data-save]").forEach(btn => {
    btn.addEventListener("click", () => {
      const form = btn.closest("form") || document.querySelector("form");
      if (form && !form.checkValidity()) {
        form.reportValidity();
        return;
      }
      toast("Changes saved successfully.");
    });
  });

  // Help popup
  const popup = document.querySelector("#helpPopup");
  document.querySelectorAll("[data-help]").forEach(btn => {
    btn.addEventListener("click", e => {
      e.preventDefault();
      popup?.classList.add("show");
    });
  });
  document.querySelector("[data-close-help]")?.addEventListener("click", () => popup?.classList.remove("show"));
  popup?.addEventListener("click", e => {
    if (e.target === popup) popup.classList.remove("show");
  });

  document.querySelectorAll(".help-options button").forEach(btn => {
    btn.addEventListener("click", () => document.querySelector("#helpMessage")?.classList.add("show"));
  });

  document.querySelector("#helpSend")?.addEventListener("click", () => {
    const message = document.querySelector("#helpMessage");
    if (!message?.value.trim()) {
      message?.focus();
      return;
    }
    message.value = "";
    popup?.classList.remove("show");
    toast("Support request submitted.");
  });

  // Dashboard quick-action buttons.
  document.querySelectorAll(".quick-nav[data-href]").forEach(btn => {
    btn.addEventListener("click", () => {
      const href = btn.getAttribute("data-href");
      if (href) location.href = href;
    });
  });

  // Any remaining non-navigation buttons get visible feedback.
  document.querySelectorAll("button").forEach(btn => {
    if (
      btn.closest("#helpPopup") ||
      btn.hasAttribute("data-theme") ||
      btn.hasAttribute("data-rtl") ||
      btn.hasAttribute("data-help") ||
      btn.hasAttribute("data-close-help") ||
      btn.hasAttribute("data-logout") ||
      btn.hasAttribute("data-save") ||
      btn.hasAttribute("data-add") ||
      btn.classList.contains("admin-menu") ||
      btn.classList.contains("quick-nav")
    ) return;

    if (!btn.onclick && !btn.closest("form")) {
      btn.addEventListener("click", () => toast(btn.textContent.trim() + " selected"));
    }
  });

  // Keyboard-friendly links with placeholder hrefs.
  document.querySelectorAll('a[href="#"]').forEach(a => {
    if (a.hasAttribute("data-help")) return;
    a.addEventListener("click", e => {
      e.preventDefault();
      toast("This action is ready for backend integration.");
    });
  });
});

// Add New dropdowns
document.querySelectorAll(".add-dropdown").forEach(dropdown => {
  const toggle = dropdown.querySelector(".add-dropdown-toggle");

  toggle?.addEventListener("click", e => {
    e.stopPropagation();

    document.querySelectorAll(".add-dropdown.open").forEach(other => {
      if (other !== dropdown) other.classList.remove("open");
    });

    dropdown.classList.toggle("open");
  });

  dropdown.querySelectorAll("[data-dropdown-action]").forEach(action => {
    action.addEventListener("click", () => {
      const actionName = action.getAttribute("data-dropdown-action");
      dropdown.classList.remove("open");

      // These actions are intentionally front-end interactions for the HTML template.
      if (actionName.startsWith("Export")) {
        const table = document.querySelector(".admin-table");
        if (table) {
          const rows = [...table.querySelectorAll("tr")].map(row =>
            [...row.children].map(cell => `"${cell.innerText.replace(/"/g, '""')}"`).join(",")
          ).join("\n");

          const blob = new Blob([rows], {type:"text/csv;charset=utf-8"});
          const url = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = actionName.toLowerCase().replace(/\s+/g, "-") + ".csv";
          a.click();
          URL.revokeObjectURL(url);
        }
        toast(actionName + " completed");
        return;
      }

      toast(actionName + " selected");
    });
  });
});

document.addEventListener("click", e => {
  if (!e.target.closest(".add-dropdown")) {
    document.querySelectorAll(".add-dropdown.open").forEach(dropdown => {
      dropdown.classList.remove("open");
    });
  }
});
/* ===== delegated Add-row handling (robust fallback) ===== */
(function(){
  document.addEventListener("click",function(e){
    var t=e.target;
    var a=t.closest?t.closest("[data-dropdown-action]"):null;
    if(!a)return;
    var name=a.getAttribute("data-dropdown-action")||"";
    if(!/^Add/i.test(name))return;
    var table=document.querySelector(".admin-table");
    var rows=table?[].slice.call(table.querySelectorAll("tr")):[];
    if(rows.length>1){
      var clone=rows[rows.length-1].cloneNode(true);
      var fc=clone.querySelector("td");
      if(fc&&fc.innerText&&fc.innerText.trim().indexOf("NEW")!==0){fc.innerHTML="<strong>NEW</strong> &middot; "+fc.innerHTML;}
      rows[0].parentNode.insertBefore(clone,rows[0].nextSibling);
      var tst=document.getElementById("adminToast");
      if(tst){tst.textContent=name+": record added";tst.style.opacity="1";}
    }
  });
})();

/* ===== Add New entity popup ===== */
document.querySelectorAll("[data-add-entity]").forEach(btn => {
  btn.addEventListener("click", () => {
    const CONFIG={
      students:{title:"Add Student",toast:"Student added successfully.",fields:[
        {n:"name",l:"FULL NAME",req:true},{n:"program",l:"PROGRAM",req:true},
        {n:"level",l:"LEVEL / BATCH",ph:"e.g. Junior"},
        {n:"status",l:"STATUS",t:"select",opts:["Active","Paused","Alumni"]}],
        row:v=>["ST-"+Math.floor(1050+Math.random()*900),v.name,v.program+(v.level?" \u00b7 "+v.level:""),v.status||"Active"]},
      coaches:{title:"Add Coach",toast:"Coach added successfully.",fields:[
        {n:"name",l:"COACH NAME",req:true},{n:"sport",l:"SPORT",req:true},
        {n:"role",l:"ROLE",t:"select",opts:["Head Coach","Assistant Coach","Fitness Coach","Goalkeeping Coach"]},
        {n:"exp",l:"EXPERIENCE",ph:"e.g. 8 years"}],
        row:v=>[v.name,v.sport,v.role||"Assistant Coach",v.exp||"\u2014"]},
      programs:{title:"Add Program",toast:"Program added successfully.",fields:[
        {n:"sport",l:"SPORT",req:true},{n:"name",l:"PROGRAM NAME",req:true},
        {n:"age",l:"AGE GROUP",ph:"e.g. U-14"},
        {n:"count",l:"ESTIMATED STUDENTS",t:"number"}],
        row:v=>[v.sport,v.name,v.age||"Open",(v.count?v.count+" enrolled":"\u2014")]},
      schedules:{title:"Add Session",toast:"Session added successfully.",fields:[
        {n:"time",l:"TIME SLOT",ph:"e.g. Mon \u00b7 6:00 AM",req:true},
        {n:"session",l:"SESSION",req:true},
        {n:"coach",l:"COACH"},{n:"facility",l:"FACILITY"}],
        row:v=>[v.time,v.session,v.coach||"\u2014",v.facility||"\u2014"]},
      enrollments:{title:"New Enrollment",toast:"Enrollment added successfully.",fields:[
        {n:"student",l:"STUDENT NAME",req:true},{n:"program",l:"PROGRAM",req:true},
        {n:"date",l:"DATE",t:"date"}],
        row:v=>["EN-"+Math.floor(1000+Math.random()*9000),v.student,v.program,v.date||new Date().toLocaleDateString("en-US",{month:"short",day:"numeric",year:"numeric"})]},
      messages:{title:"Compose Message",toast:"Message created.",fields:[
        {n:"from",l:"FROM",req:true},{n:"subject",l:"SUBJECT",req:true},
        {n:"status",l:"STATUS",t:"select",opts:["Sent","Draft"]}],
        row:v=>[v.from,v.subject,new Date().toLocaleDateString("en-US",{month:"short",day:"numeric"}),v.status||"Sent"]},
      tournaments:{title:"Add Tournament / Trial",toast:"Event added successfully.",fields:[
        {n:"event",l:"EVENT NAME",req:true},{n:"date",l:"DATE",t:"date"},
        {n:"sport",l:"SPORT",req:true},
        {n:"status",l:"STATUS",t:"select",opts:["Upcoming","Open","Closed"]}],
        row:v=>[v.event,v.date||"TBA",v.sport,v.status||"Upcoming"]}
    };
    const t=((document.querySelector(".admin-title b")||{}).textContent)||"";
    let key=null;
    if(/student/i.test(t))key="students";
    else if(/coach/i.test(t))key="coaches";
    else if(/enroll/i.test(t))key="enrollments";
    else if(/message/i.test(t))key="messages";
    else if(/tournament/i.test(t))key="tournaments";
    else if(/schedule/i.test(t))key="schedules";
    else if(/program/i.test(t))key="programs";
    if(!key||!CONFIG[key]){return;}
    const cfg=CONFIG[key];
    let pop=document.getElementById("addEntityPopup");
    if(pop)pop.remove();
    pop=document.createElement("div");
    pop.className="help-popup show";
    pop.id="addEntityPopup";
    const fieldsHtml=cfg.fields.map(f=>{
      let ctrl;
      if(f.t==="select"){
        ctrl='<select name="'+f.n+'"><option value="">Select</option>'+f.opts.map(o=>'<option value="'+o+'">'+o+'</option>').join("")+'</select>';
      }else{
        ctrl='<input name="'+f.n+'" type="'+(f.t||"text")+'"'+(f.ph?' placeholder="'+f.ph+'"':"")+'>';
      }
      return '<div class="add-field"><label>'+f.l+'</label>'+ctrl+'</div>';
    }).join("");
    pop.innerHTML='<div class="help-box"><div class="help-head"><h2>'+cfg.title+'</h2>'+
      '<button class="help-close" type="button" aria-label="Close">\u00d7</button></div>'+
      '<div class="help-body"><div class="add-form">'+fieldsHtml+'</div></div>'+
      '<div class="help-footer"><button type="button" id="addEntityCancel" style="border:0;background:none;color:inherit;font:700 10px \'DM Sans\',sans-serif;padding:10px 14px;cursor:pointer;opacity:.7">CANCEL</button> '+
      '<button type="button" id="addEntitySave" style="border:0;background:#3b163a;color:#fff;border-radius:7px;padding:10px 15px;font-size:10px;font-weight:700;cursor:pointer">SAVE</button></div></div>';
    document.body.appendChild(pop);
    function showToast(msg){
      let tst=document.getElementById("adminToast");
      if(!tst){
        tst=document.createElement("div");tst.id="adminToast";
        tst.style.cssText="position:fixed;right:20px;bottom:20px;background:#3b163a;color:#fff;padding:11px 16px;border-radius:8px;font:700 11px 'DM Sans',sans-serif;z-index:120;box-shadow:0 10px 26px rgba(0,0,0,.25);opacity:0;transition:opacity .25s";
        document.body.appendChild(tst);
      }
      tst.textContent=msg;tst.style.opacity="1";
      clearTimeout(window.__at);window.__at=setTimeout(()=>tst.style.opacity="0",2400);
    }
    function close(){pop.classList.remove("show");}
    pop.querySelector(".help-close").addEventListener("click",close);
    pop.querySelector("#addEntityCancel").addEventListener("click",close);
    pop.addEventListener("click",e=>{if(e.target===pop)close();});
    pop.querySelector("#addEntitySave").addEventListener("click",()=>{
      const vals={};let ok=true;
      cfg.fields.forEach(f=>{
        const el=pop.querySelector('[name="'+f.n+'"]');
        const v=(el.value||"").trim();
        vals[f.n]=v;
        if(f.req&&!v){el.style.borderColor="#c0392b";ok=false;}else{el.style.borderColor="";}
      });
      if(!ok){showToast("Please fill all required fields.");return;}
      const tr=document.createElement("tr");
      tr.setAttribute("data-row","");
      cfg.row(vals).forEach(cell=>{const td=document.createElement("td");td.textContent=cell;tr.appendChild(td);});
      const tb=document.querySelector(".admin-table tbody");
      if(tb)tb.appendChild(tr);
      showToast(cfg.toast);
      close();
    });
  });
});