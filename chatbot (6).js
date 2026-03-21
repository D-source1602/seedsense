/**
 * SeedSenseCalc — SeedSense India Farm Calculator
 * ──────────────────────────────────────────────
 * 3 built-in calculators for Indian farmers:
 *   🧪 Soil pH Correction
 *   💧 Irrigation Water Requirement
 *   🌾 Seed Rate per Hectare
 *
 * No API key needed. No chat. Pure calculations.
 * Add ONE line before </body>:  <script src="chatbot.js"></script>
 */

(function () {
  "use strict";

  /* ── COLORS ──────────────────────────────────────────────────── */
  const C = {
    green:      "#2d6a4f",
    greenMid:   "#40916c",
    greenLight: "#52b788",
    cream:      "#f8f5ef",
    white:      "#ffffff",
    text:       "#1b1b1b",
    muted:      "#6b7280",
    saffron:    "#e07b39",
    border:     "#c4e0d0",
  };

  /* ── FONT ────────────────────────────────────────────────────── */
  if (!document.getElementById("kc-font")) {
    const l = document.createElement("link");
    l.id = "kc-font"; l.rel = "stylesheet";
    l.href = "https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&family=Playfair+Display:wght@600&display=swap";
    document.head.appendChild(l);
  }

  /* ── ANIMATIONS (only keyframes need a stylesheet) ───────────── */
  if (!document.getElementById("kc-anim")) {
    const s = document.createElement("style");
    s.id = "kc-anim";
    s.textContent = `
      @keyframes kc-pulse   { 0%,100%{transform:scale(1);opacity:1} 50%{transform:scale(1.3);opacity:.7} }
      @keyframes kc-breathe { 0%,100%{opacity:1} 50%{opacity:.4} }
      #kc-bubble:hover       { transform:scale(1.1) translateY(-2px) !important; }
      .kc-tab:hover          { background:#f0f9f4 !important; }
      .kc-calc-btn:hover     { opacity:0.88 !important; }
      .kc-notif              { animation:kc-pulse 2s infinite; }
      .kc-live-dot           { animation:kc-breathe 2.5s ease-in-out infinite; }
      .kc-scroll::-webkit-scrollbar       { width:4px; }
      .kc-scroll::-webkit-scrollbar-thumb { background:#c4e0d0; border-radius:4px; }
    `;
    document.head.appendChild(s);
  }

  /* ── INIT ────────────────────────────────────────────────────── */
  function init() {
    if (document.getElementById("kc-root")) return;

    /* anchor root */
    const root = el("div", { id:"kc-root" });
    css(root, { position:"fixed", bottom:"0", right:"0", width:"0", height:"0", zIndex:"2147483647", pointerEvents:"none" });
    document.body.appendChild(root);

    /* ══ BUBBLE ══════════════════════════════════════════════════ */
    const bubble = el("button", { id:"kc-bubble", "aria-label":"Open SeedSenseCalc" });
    css(bubble, {
      position:"fixed", bottom:"28px", right:"28px",
      width:"62px", height:"62px", borderRadius:"50%",
      background:`linear-gradient(135deg,${C.green},${C.greenLight})`,
      border:"none", cursor:"pointer", outline:"none",
      display:"flex", alignItems:"center", justifyContent:"center",
      boxShadow:"0 6px 24px rgba(45,106,79,0.3),0 2px 8px rgba(0,0,0,0.15)",
      zIndex:"2147483647", pointerEvents:"all", overflow:"visible",
      transition:"transform 0.3s cubic-bezier(0.34,1.56,0.64,1)",
    });
    bubble.innerHTML = `
      <span class="kc-notif" style="display:none;position:absolute;top:4px;right:4px;width:12px;height:12px;background:#f87171;border-radius:50%;border:2px solid white;"></span>
      <span class="kc-ico-open"  style="position:absolute;transition:transform 0.3s ease,opacity 0.3s ease;">
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/>
        </svg>
      </span>
      <span class="kc-ico-close" style="position:absolute;transform:rotate(-90deg) scale(0);opacity:0;transition:transform 0.3s ease,opacity 0.3s ease;">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round">
          <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
        </svg>
      </span>`;
    document.body.appendChild(bubble);

    /* ══ PANEL WINDOW ════════════════════════════════════════════ */
    const win = el("div", { id:"kc-window" });
    css(win, {
      position:"fixed", bottom:"102px", right:"28px",
      width:"390px", maxWidth:"calc(100vw - 40px)",
      height:"560px", maxHeight:"calc(100vh - 120px)",
      background:C.cream, borderRadius:"18px",
      boxShadow:"0 20px 60px rgba(0,0,0,0.18),0 4px 16px rgba(45,106,79,0.22)",
      display:"flex", flexDirection:"column", overflow:"hidden",
      zIndex:"2147483646", fontFamily:"'DM Sans',sans-serif",
      transform:"scale(0.85) translateY(20px)", transformOrigin:"bottom right",
      opacity:"0", pointerEvents:"none",
      transition:"transform 0.35s cubic-bezier(0.34,1.4,0.64,1),opacity 0.25s ease",
      boxSizing:"border-box",
    });

    /* ── Header ── */
    const hdr = el("div");
    css(hdr, {
      background:`linear-gradient(135deg,#1b4332 0%,${C.green} 55%,${C.greenMid} 100%)`,
      padding:"14px 16px 12px", display:"flex", alignItems:"center",
      gap:"11px", flexShrink:"0", position:"relative", overflow:"hidden",
    });
    hdr.innerHTML = `
      <div style="width:44px;height:44px;border-radius:12px;background:linear-gradient(135deg,#b7e4c7,${C.greenLight});display:flex;align-items:center;justify-content:center;font-size:22px;flex-shrink:0;box-shadow:0 2px 10px rgba(0,0,0,0.25);border:2px solid rgba(255,255,255,0.2);">🌾</div>
      <div style="flex:1;">
        <div style="font-family:'Playfair Display',serif;font-size:16px;font-weight:600;color:white;line-height:1.2;">SeedSenseCalc</div>
        <div style="display:flex;align-items:center;gap:5px;margin-top:2px;">
          <div class="kc-live-dot" style="width:7px;height:7px;border-radius:50%;background:#4ade80;box-shadow:0 0 6px #4ade80;"></div>
          <span style="font-size:11px;color:#b7e4c7;">Indian Farm Calculator</span>
        </div>
        <div style="display:flex;gap:4px;margin-top:5px;flex-wrap:wrap;">
          <span style="background:rgba(255,255,255,0.12);border:1px solid rgba(255,255,255,0.2);border-radius:10px;padding:2px 7px;font-size:10px;color:rgba(255,255,255,0.85);">🇮🇳 India Data</span>
          <span style="background:rgba(255,255,255,0.12);border:1px solid rgba(255,255,255,0.2);border-radius:10px;padding:2px 7px;font-size:10px;color:rgba(255,255,255,0.85);">🧮 3 Calculators</span>
          <span style="background:rgba(255,255,255,0.12);border:1px solid rgba(255,255,255,0.2);border-radius:10px;padding:2px 7px;font-size:10px;color:rgba(255,255,255,0.85);">⚡ Free</span>
        </div>
      </div>`;
    win.appendChild(hdr);

    /* ── Tab Bar ── */
    const tabBar = el("div");
    css(tabBar, { display:"flex", background:C.white, borderBottom:"2px solid #e8f4ed", flexShrink:"0" });

    const tabs = [
      { id:"ph",    label:"🧪 pH Fixer"  },
      { id:"water", label:"💧 Irrigation" },
      { id:"seed",  label:"🌾 Seed Rate"  },
    ];
    tabs.forEach((t, i) => {
      const btn = el("button", { "data-tab": t.id });
      btn.className = "kc-tab";
      btn.textContent = t.label;
      css(btn, {
        flex:"1", padding:"10px 4px", fontSize:"11.5px", fontWeight:"500",
        color: i===0 ? C.green : C.muted,
        background:"none", border:"none",
        borderBottom: i===0 ? `2px solid ${C.green}` : "2px solid transparent",
        marginBottom:"-2px", cursor:"pointer",
        fontFamily:"'DM Sans',sans-serif", transition:"all 0.2s", whiteSpace:"nowrap",
      });
      tabBar.appendChild(btn);
    });
    win.appendChild(tabBar);

    /* ── Calculator Panels ── */
    const phPanel    = buildPhPanel();
    const waterPanel = buildWaterPanel();
    const seedPanel  = buildSeedPanel();

    [phPanel, waterPanel, seedPanel].forEach((p, i) => {
      p.className = "kc-scroll";
      css(p, {
        flex:"1", overflowY:"auto", padding:"16px 14px",
        flexDirection:"column", gap:"14px", boxSizing:"border-box",
        display: i===0 ? "flex" : "none",
      });
      win.appendChild(p);
    });

    /* ── Footer ── */
    const footer = el("div");
    footer.textContent = "SeedSenseCalc · SeedSense 🌿 · Made for Indian Farmers";
    css(footer, {
      textAlign:"center", fontSize:"10px", color:"#adb8b2",
      padding:"8px", background:C.white, borderTop:"1px solid #e8f4ed", flexShrink:"0",
    });
    win.appendChild(footer);

    document.body.appendChild(win);

    /* ══ STATE ═══════════════════════════════════════════════════ */
    let isOpen = false;

    /* ══ TOGGLE ══════════════════════════════════════════════════ */
    function toggle() {
      isOpen = !isOpen;
      css(win, {
        opacity:       isOpen ? "1" : "0",
        transform:     isOpen ? "scale(1) translateY(0)" : "scale(0.85) translateY(20px)",
        pointerEvents: isOpen ? "all" : "none",
      });
      const icoOpen  = bubble.querySelector(".kc-ico-open");
      const icoClose = bubble.querySelector(".kc-ico-close");
      icoOpen.style.transform  = isOpen ? "rotate(90deg) scale(0)" : "rotate(0) scale(1)";
      icoOpen.style.opacity    = isOpen ? "0" : "1";
      icoClose.style.transform = isOpen ? "rotate(0) scale(1)"    : "rotate(-90deg) scale(0)";
      icoClose.style.opacity   = isOpen ? "1" : "0";
      if (isOpen) bubble.querySelector(".kc-notif").style.display = "none";
    }

    bubble.addEventListener("click", (e) => { e.stopPropagation(); toggle(); });
    document.addEventListener("click", (e) => {
      if (isOpen && !win.contains(e.target) && !bubble.contains(e.target)) toggle();
    });

    /* ══ TAB SWITCHING ═══════════════════════════════════════════ */
    tabBar.addEventListener("click", (e) => {
      const btn = e.target.closest("[data-tab]");
      if (!btn) return;
      const target = btn.dataset.tab;
      tabBar.querySelectorAll(".kc-tab").forEach(b => {
        b.style.color        = b.dataset.tab===target ? C.green : C.muted;
        b.style.borderBottom = b.dataset.tab===target ? `2px solid ${C.green}` : "2px solid transparent";
      });
      phPanel.style.display    = target==="ph"    ? "flex" : "none";
      waterPanel.style.display = target==="water" ? "flex" : "none";
      seedPanel.style.display  = target==="seed"  ? "flex" : "none";
    });

    /* ── mobile ── */
    function mobileCheck() {
      if (window.innerWidth <= 480) {
        css(win, { bottom:"0", right:"0", width:"100vw", maxWidth:"100vw", height:"100dvh", maxHeight:"100dvh", borderRadius:"0" });
      }
    }
    mobileCheck();
    window.addEventListener("resize", mobileCheck);

    /* ── notif dot ── */
    setTimeout(() => { if (!isOpen) bubble.querySelector(".kc-notif").style.display="block"; }, 2500);

    /* ══ pH LOGIC ════════════════════════════════════════════════ */
    const cropPH  = {
      rice:{ideal:6.0}, wheat:{ideal:6.5}, cotton:{ideal:7.0}, sugarcane:{ideal:6.8},
      maize:{ideal:6.5}, groundnut:{ideal:6.0}, mustard:{ideal:6.5}, pulses:{ideal:6.5},
      soybean:{ideal:6.4}, potato:{ideal:5.8},
    };
    const soilBuf = { sandy:0.5, loamy:1.0, clay:2.0 };

    phPanel.querySelector("#kc-ph-btn").addEventListener("click", () => {
      const cur  = parseFloat(phPanel.querySelector("#kc-ph-cur").value);
      const crop = phPanel.querySelector("#kc-ph-crop").value;
      const soil = phPanel.querySelector("#kc-ph-soil").value;
      const area = parseFloat(phPanel.querySelector("#kc-ph-area").value);
      const res  = phPanel.querySelector("#kc-ph-res");
      const val  = phPanel.querySelector("#kc-ph-val");
      const sub  = phPanel.querySelector("#kc-ph-sub");
      res.style.display = "block";
      if (!cur||!crop||!area) { val.textContent="⚠️ Please fill in all fields."; sub.textContent=""; return; }
      const ideal=cropPH[crop].ideal, diff=ideal-cur, buf=soilBuf[soil];
      if (Math.abs(diff)<0.2) {
        val.textContent = "✅ pH is already ideal!";
        sub.textContent = `Your soil pH ${cur} is perfect for ${crop}. No amendment needed.`;
      } else if (diff>0) {
        const lime=(diff*buf*area).toFixed(2), cost=Math.round(lime*1800);
        val.textContent = `${lime} tonnes of Agricultural Lime`;
        sub.textContent = `To raise pH ${cur} → ${ideal} for ${crop} on ${area} ha\nEstimated cost: ₹${cost.toLocaleString('en-IN')}\nApply 2–3 weeks before sowing, mix into top 15 cm of soil.`;
      } else {
        const s=(Math.abs(diff)*200*area).toFixed(0), cost=Math.round(s*35);
        val.textContent = `${s} kg of Gypsum / Sulphur`;
        sub.textContent = `To lower pH ${cur} → ${ideal} for ${crop} on ${area} ha\nEstimated cost: ₹${cost.toLocaleString('en-IN')}\nApply 3–4 weeks before sowing. Retest pH after 6 weeks.`;
      }
    });

    /* ══ WATER LOGIC ═════════════════════════════════════════════ */
    const cropWater = {
      rice:{avg:9}, wheat:{avg:5.5}, cotton:{avg:7}, sugarcane:{avg:9},
      maize:{avg:6}, groundnut:{avg:4.5}, vegetables:{avg:5}, pulses:{avg:4},
    };
    const irrigEff = { drip:0.90, sprinkler:0.75, flood:0.50 };
    const seasonSc = { summer:1.0, kharif:0.75, rabi:0.85 };

    waterPanel.querySelector("#kc-water-btn").addEventListener("click", () => {
      const crop = waterPanel.querySelector("#kc-water-crop").value;
      const meth = waterPanel.querySelector("#kc-water-meth").value;
      const area = parseFloat(waterPanel.querySelector("#kc-water-area").value);
      const seas = waterPanel.querySelector("#kc-water-seas").value;
      const res  = waterPanel.querySelector("#kc-water-res");
      const val  = waterPanel.querySelector("#kc-water-val");
      const sub  = waterPanel.querySelector("#kc-water-sub");
      res.style.display = "block";
      if (!area) { val.textContent="⚠️ Please enter field area."; sub.textContent=""; return; }
      const mm = cropWater[crop].avg * seasonSc[seas];
      const L  = (mm * area * 10000) / irrigEff[meth];
      val.textContent = `${Math.round(L).toLocaleString('en-IN')} Litres / Day`;
      sub.textContent =
        `= ${(L/1000).toFixed(1)} m³/day for ${area} ha of ${crop}\n` +
        `Season: ${seas} | Method: ${meth} (${irrigEff[meth]*100}% efficiency)\n` +
        `≈ ${Math.round(L/(area*2.47)).toLocaleString('en-IN')} litres/acre/day\n` +
        `≈ ${Math.round(L/(area*20)).toLocaleString('en-IN')} litres/bigha/day`;
    });

    /* ══ SEED LOGIC ══════════════════════════════════════════════ */
    const seedDB = {
      rice_t:  {rate:22,  unit:"kg", cost:60,   space:"20×15 cm",   note:"Nursery: 500–600 g/m². Use certified seed."},
      rice_d:  {rate:45,  unit:"kg", cost:60,   space:"20×15 cm",   note:"Pre-germinate seeds before direct seeding."},
      wheat:   {rate:112, unit:"kg", cost:30,   space:"22.5 cm rows",note:"HD-2967, GW-496, PBW-343 popular varieties."},
      maize:   {rate:22,  unit:"kg", cost:280,  space:"60×25 cm",   note:"Hybrid seed only — do NOT save for next season."},
      bajra:   {rate:4.5, unit:"kg", cost:120,  space:"45×15 cm",   note:"Kharif crop. Very drought tolerant."},
      jowar:   {rate:11,  unit:"kg", cost:80,   space:"45×15 cm",   note:"Dual purpose: grain + fodder."},
      cotton:  {rate:3.5, unit:"kg", cost:1200, space:"90×60 cm",   note:"Buy certified Bt cotton. RCH-2, Bunny, Jackpot."},
      groundnut:{rate:90, unit:"kg", cost:70,   space:"30×10 cm",   note:"Shell just before sowing. Treat with Rhizobium."},
      soybean: {rate:75,  unit:"kg", cost:65,   space:"45×5 cm",    note:"Inoculate with Bradyrhizobium. JS-9305, NRC-37."},
      mustard: {rate:5.5, unit:"kg", cost:90,   space:"30×15 cm",   note:"Rabi crop, sow Oct–Nov. Pusa Bold, RH-30."},
      arhar:   {rate:17,  unit:"kg", cost:130,  space:"75×30 cm",   note:"Mixed with soybean in MP/Maharashtra."},
      moong:   {rate:22,  unit:"kg", cost:120,  space:"30×10 cm",   note:"Short duration 60–65 days."},
      urad:    {rate:22,  unit:"kg", cost:110,  space:"30×10 cm",   note:"Kharif season. Fixes nitrogen naturally."},
      onion:   {rate:9,   unit:"kg", cost:200,  space:"15×10 cm",   note:"Raise nursery first, transplant at 6 weeks."},
      tomato:  {rate:350, unit:"g",  cost:2500, space:"60×45 cm",   note:"Nursery raised. Transplant at 25–30 days."},
    };

    seedPanel.querySelector("#kc-seed-btn").addEventListener("click", () => {
      const crop = seedPanel.querySelector("#kc-seed-crop").value;
      const area = parseFloat(seedPanel.querySelector("#kc-seed-area").value);
      const germ = parseFloat(seedPanel.querySelector("#kc-seed-germ").value)||85;
      const res  = seedPanel.querySelector("#kc-seed-res");
      const val  = seedPanel.querySelector("#kc-seed-val");
      const sub  = seedPanel.querySelector("#kc-seed-sub");
      res.style.display = "block";
      if (!area) { val.textContent="⚠️ Please enter field area."; sub.textContent=""; return; }
      const d    = seedDB[crop];
      const adj  = d.unit==="g" ? (d.rate*area*(85/germ)).toFixed(0) : (d.rate*area*(85/germ)).toFixed(1);
      const cost = d.unit==="g" ? Math.round((adj/1000)*d.cost) : Math.round(adj*d.cost);
      val.textContent = d.unit==="g" ? `${adj} grams` : `${adj} kg`;
      sub.textContent =
        `For ${area} ha at ${germ}% germination\n` +
        `Approx seed cost: ₹${cost.toLocaleString('en-IN')}\n` +
        `Recommended spacing: ${d.space}\n` +
        `💡 ${d.note}`;
    });

  } // end init()

  /* ══ PANEL BUILDERS ══════════════════════════════════════════ */
  function buildPhPanel() {
    const p = document.createElement("div"); p.id = "kc-ph-panel";
    p.innerHTML = card("🧪 Soil pH Correction",
      row("Current Soil pH", num("kc-ph-cur","e.g. 5.2","3","10","0.1")) +
      row("Crop to Grow", sel("kc-ph-crop",`
        <option value="">-- Select Crop --</option>
        <option value="rice">Rice (ideal 5.5–6.5)</option>
        <option value="wheat">Wheat (ideal 6.0–7.5)</option>
        <option value="cotton">Cotton (ideal 6.0–8.0)</option>
        <option value="sugarcane">Sugarcane (ideal 6.0–7.5)</option>
        <option value="maize">Maize (ideal 5.8–7.0)</option>
        <option value="groundnut">Groundnut (ideal 5.5–6.5)</option>
        <option value="mustard">Mustard (ideal 6.0–7.5)</option>
        <option value="pulses">Pulses / Dal (ideal 6.0–7.5)</option>
        <option value="soybean">Soybean (ideal 6.0–6.8)</option>
        <option value="potato">Potato (ideal 5.0–6.5)</option>`)) +
      row("Soil Type", sel("kc-ph-soil",`
        <option value="sandy">Sandy / Desert (Rajasthan, Coastal)</option>
        <option value="loamy">Loamy / Alluvial (UP, Punjab, Bihar)</option>
        <option value="clay">Clay / Black Cotton (Maharashtra, MP, Gujarat)</option>`)) +
      row("Field Area (Hectares)", num("kc-ph-area","e.g. 2.5","0.1","","0.1")) +
      btn("kc-ph-btn","⚗️ Calculate Amendment Needed") +
      res("kc-ph-res","kc-ph-val","kc-ph-sub","Soil Amendment Required")
    );
    return p;
  }

  function buildWaterPanel() {
    const p = document.createElement("div"); p.id = "kc-water-panel";
    p.innerHTML = card("💧 Irrigation Water Requirement",
      row("Crop", sel("kc-water-crop",`
        <option value="rice">Rice (8–10 mm/day)</option>
        <option value="wheat">Wheat (5–6 mm/day)</option>
        <option value="cotton">Cotton (6–8 mm/day)</option>
        <option value="sugarcane">Sugarcane (8–10 mm/day)</option>
        <option value="maize">Maize (5–7 mm/day)</option>
        <option value="groundnut">Groundnut (4–5 mm/day)</option>
        <option value="vegetables">Vegetables (4–6 mm/day)</option>
        <option value="pulses">Pulses (3–5 mm/day)</option>`)) +
      row("Irrigation Method", sel("kc-water-meth",`
        <option value="drip">Drip Irrigation (90% efficient)</option>
        <option value="sprinkler">Sprinkler (75% efficient)</option>
        <option value="flood">Flood / Surface (50% efficient)</option>`)) +
      row("Field Area (Hectares)", num("kc-water-area","e.g. 1.5","0.1","","0.1")) +
      row("Season", sel("kc-water-seas",`
        <option value="summer">Summer / Zaid (peak demand)</option>
        <option value="kharif">Kharif / Monsoon (25% rain offset)</option>
        <option value="rabi">Rabi / Winter (15% demand reduction)</option>`)) +
      btn("kc-water-btn","💧 Calculate Water Needed") +
      res("kc-water-res","kc-water-val","kc-water-sub","Daily Irrigation Requirement")
    );
    return p;
  }

  function buildSeedPanel() {
    const p = document.createElement("div"); p.id = "kc-seed-panel";
    p.innerHTML = card("🌾 Seed Rate per Hectare",
      row("Crop", sel("kc-seed-crop",`
        <option value="rice_t">Rice – Transplanted</option>
        <option value="rice_d">Rice – Direct Seeded</option>
        <option value="wheat">Wheat</option>
        <option value="maize">Maize (Hybrid)</option>
        <option value="bajra">Bajra / Pearl Millet</option>
        <option value="jowar">Jowar / Sorghum</option>
        <option value="cotton">Cotton (Hybrid / Bt)</option>
        <option value="groundnut">Groundnut</option>
        <option value="soybean">Soybean</option>
        <option value="mustard">Mustard / Rapeseed</option>
        <option value="arhar">Arhar / Tur Dal</option>
        <option value="moong">Moong Dal</option>
        <option value="urad">Urad Dal</option>
        <option value="onion">Onion</option>
        <option value="tomato">Tomato</option>`)) +
      row("Field Area (Hectares)", num("kc-seed-area","e.g. 3.0","0.1","","0.1")) +
      row("Seed Germination % (default 85%)", num("kc-seed-germ","85","50","100","1")) +
      btn("kc-seed-btn","🌱 Calculate Seeds Needed") +
      res("kc-seed-res","kc-seed-val","kc-seed-sub","Seed Requirement")
    );
    return p;
  }

  /* ══ TINY HELPERS ════════════════════════════════════════════ */
  const IS = "border:1.5px solid #c4e0d0;border-radius:9px;padding:7px 10px;font-size:12.5px;font-family:'DM Sans',sans-serif;color:#1b1b1b;background:#f9fdfb;outline:none;width:100%;box-sizing:border-box;";

  function card(title, body) {
    return `<div style="background:white;border-radius:14px;padding:15px 16px;box-shadow:0 2px 10px rgba(0,0,0,0.07);border:1px solid #e8f4ed;box-sizing:border-box;">
      <div style="font-size:14px;font-weight:600;color:#2d6a4f;margin-bottom:14px;padding-bottom:10px;border-bottom:1px solid #e8f4ed;">${title}</div>
      ${body}
    </div>`;
  }
  function row(label, input) {
    return `<div style="display:flex;flex-direction:column;gap:5px;margin-bottom:10px;">
      <label style="font-size:11.5px;color:#6b7280;font-weight:500;">${label}</label>${input}
    </div>`;
  }
  function num(id, ph, min, max, step) {
    return `<input id="${id}" type="number" placeholder="${ph}" min="${min||""}" max="${max||""}" step="${step||"any"}" style="${IS}">`;
  }
  function sel(id, opts) {
    return `<select id="${id}" style="${IS}">${opts}</select>`;
  }
  function btn(id, label) {
    return `<button id="${id}" class="kc-calc-btn" style="width:100%;background:linear-gradient(135deg,#2d6a4f,#40916c);color:white;border:none;border-radius:10px;padding:10px;font-size:13px;font-weight:600;cursor:pointer;font-family:'DM Sans',sans-serif;margin-top:4px;transition:opacity 0.2s;">${label}</button>`;
  }
  function res(boxId, valId, subId, title) {
    return `<div id="${boxId}" style="display:none;background:linear-gradient(135deg,#e9f7ef,#d1fae5);border:1px solid #a7f3d0;border-radius:12px;padding:12px 14px;margin-top:12px;">
      <div style="font-size:11px;color:#4b7a5a;font-weight:600;margin-bottom:5px;">📊 ${title}</div>
      <div id="${valId}" style="font-size:19px;font-weight:700;color:#2d6a4f;line-height:1.3;"></div>
      <div id="${subId}" style="font-size:11.5px;color:#374151;margin-top:7px;white-space:pre-line;line-height:1.7;border-top:1px solid rgba(167,243,208,0.5);padding-top:7px;"></div>
    </div>`;
  }
  function el(tag, attrs) {
    const e = document.createElement(tag);
    if (attrs) Object.entries(attrs).forEach(([k,v]) => {
      if (k==="id") e.id=v;
      else if (k.startsWith("aria-")) e.setAttribute(k,v);
      else if (k==="data-tab") e.dataset.tab=v;
      else e[k]=v;
    });
    return e;
  }
  function css(el, styles) { Object.assign(el.style, styles); }

  /* ══ BOOT ════════════════════════════════════════════════════ */
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();

})();
