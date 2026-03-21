/* ═══════════════════════════════════════════════
   ClimateRiskCard.js  — drop-in, zero HTML edits
   Usage: <script src="ClimateRiskCard.js"></script>
═══════════════════════════════════════════════ */

(function () {
  /* ── DATA ── */
  const DATA = {
    Kerala:      { drought:27, flood:16, overall:'LOW',    month:'March',
      info:'Receives heavy rainfall from both southwest and northeast monsoons. 2018 floods showed extreme vulnerability of low-lying areas.',
      tip:'Adopt water-efficient irrigation and drought-resilient crop varieties during dry spells.' },
    Assam:       { drought:18, flood:19, overall:'LOW',    month:'March',
      info:'The Brahmaputra river causes severe annual flooding affecting over 40% of the state. Flood risk is among the highest in India.',
      tip:'Plant flood-tolerant rice varieties like Swarna Sub1 and maintain elevated seedbeds.' },
    Rajasthan:   { drought:72, flood:5,  overall:'HIGH',   month:'March',
      info:'Thar Desert dominates the region with extreme heat and chronic water scarcity. Erratic monsoon creates severe drought conditions.',
      tip:'Use drip irrigation and grow drought-hardy crops like bajra, jowar, and moth beans.' },
    Maharashtra: { drought:38, flood:29, overall:'MEDIUM', month:'March',
      info:'Vidarbha and Marathwada face recurring drought while coastal Konkan sees heavy monsoon flooding each year.',
      tip:'Intercropping and rainwater harvesting can reduce risk exposure across the dual-risk zones.' },
    Punjab:      { drought:15, flood:22, overall:'LOW',    month:'March',
      info:'Highly irrigated agrarian belt, but groundwater depletion is a growing long-term risk. Flash floods from rivers affect border districts.',
      tip:'Shift to direct-seeded rice to reduce water usage and adopt soil moisture sensors.' },
    Odisha:      { drought:24, flood:55, overall:'HIGH',   month:'March',
      info:'One of the most cyclone-prone states in India. Mahanadi delta faces severe flooding and coastal erosion every monsoon.',
      tip:'Grow Swarna Sub1 paddy and install community-level early warning flood alert systems.' },
  };

  const RISK_COLOR = { LOW:'#16a34a', MEDIUM:'#d97706', HIGH:'#dc2626' };

  /* ── STYLES ── */
  const CSS = `
    #cri-fab {
      position:fixed; bottom:28px; right:28px; z-index:99998;
      width:52px; height:52px; border-radius:50%;
      background:linear-gradient(135deg,#3aaa5c,#1d7a3a);
      border:none; cursor:pointer; box-shadow:0 4px 18px rgba(58,170,92,.45);
      font-size:22px; display:flex; align-items:center; justify-content:center;
      transition:transform .2s, box-shadow .2s;
    }
    #cri-fab:hover { transform:scale(1.10); box-shadow:0 6px 24px rgba(58,170,92,.55); }

    #cri-overlay {
      display:none; position:fixed; inset:0; z-index:99999;
      background:rgba(0,0,0,.38); backdrop-filter:blur(3px);
      align-items:center; justify-content:center;
    }
    #cri-overlay.open { display:flex; }

    #cri-card {
      background:#fff; border-radius:20px; padding:22px 22px 20px;
      width:340px; max-width:94vw;
      box-shadow:0 12px 40px rgba(0,0,0,.18);
      font-family:'DM Sans',system-ui,sans-serif;
      animation:criSlide .35s cubic-bezier(.22,1,.36,1);
      position:relative;
    }
    @keyframes criSlide {
      from{opacity:0;transform:translateY(22px)}
      to  {opacity:1;transform:translateY(0)}
    }

    /* header */
    #cri-card .ch { display:flex; align-items:center; justify-content:space-between; margin-bottom:14px; }
    #cri-card .brand { display:flex; align-items:center; gap:7px; }
    #cri-card .b-icon {
      width:30px;height:30px;border-radius:8px;
      background:linear-gradient(135deg,#3aaa5c,#1d7a3a);
      display:flex;align-items:center;justify-content:center;font-size:15px;
      box-shadow:0 2px 8px rgba(58,170,92,.30);
    }
    #cri-card .b-name { font-size:15px;font-weight:700;color:#1d7a3a;letter-spacing:-.2px; }

    #cri-card .loc-badge {
      display:flex; align-items:center; gap:5px;
      background:#f4f4f5; border:1px solid #e4e4e7; border-radius:20px;
      padding:5px 11px 5px 8px; font-size:13px; font-weight:600; color:#3f3f46;
      cursor:pointer; transition:background .18s; position:relative;
    }
    #cri-card .loc-badge:hover { background:#e8e8ea; }

    /* state dropdown */
    #cri-dropdown {
      position:absolute; top:calc(100% + 6px); right:0; background:#fff;
      border:1px solid #e4e4e7; border-radius:12px; padding:6px;
      box-shadow:0 8px 24px rgba(0,0,0,.12); min-width:140px;
      display:none; z-index:10; flex-direction:column; gap:2px;
    }
    #cri-dropdown.open { display:flex; }
    #cri-dropdown button {
      background:none; border:none; text-align:left; padding:7px 10px;
      border-radius:8px; font-size:13px; font-weight:600; color:#3f3f46;
      cursor:pointer; font-family:inherit; transition:background .15s;
    }
    #cri-dropdown button:hover { background:#f4f4f5; }
    #cri-dropdown button.sel { background:#f0fdf4; color:#16a34a; }

    /* title */
    #cri-card .ct { margin-bottom:16px; }
    #cri-card .ct h3 { font-size:17px;font-weight:700;color:#18181b;display:flex;align-items:center;gap:7px;letter-spacing:-.3px; }
    #cri-card .ct p  { font-size:12.5px;color:#71717a;margin-top:3px; }

    /* metrics */
    #cri-card .metrics { display:grid; grid-template-columns:1fr 1fr 1fr; gap:10px; margin-bottom:14px; }
    #cri-card .mbox { border-radius:14px; padding:13px 12px 12px; border:1.5px solid transparent; }
    #cri-card .mbox.dr { background:#f0fdf4; border-color:#bbf7d0; }
    #cri-card .mbox.fl { background:#eff6ff; border-color:#bfdbfe; }
    #cri-card .mbox.ov { background:#fafafa; border-color:#e4e4e7; }
    #cri-card .mlabel { font-size:11.5px;font-weight:600;color:#71717a;display:flex;align-items:center;gap:4px;margin-bottom:6px; }
    #cri-card .mval   { font-size:22px;font-weight:600;line-height:1;margin-bottom:8px;letter-spacing:-1px; }
    #cri-card .mbox.dr .mval { color:#16a34a; }
    #cri-card .mbox.fl .mval { color:#2563eb; }
    #cri-card .mbox.ov .mval { font-size:17px;font-weight:700;letter-spacing:0; }
    #cri-card .track { height:4px;border-radius:999px;overflow:hidden; }
    #cri-card .mbox.dr .track { background:#bbf7d0; }
    #cri-card .mbox.fl .track { background:#bfdbfe; }
    #cri-card .fill { height:100%;border-radius:999px;width:0%;transition:width .9s cubic-bezier(.22,1,.36,1); }
    #cri-card .mbox.dr .fill { background:#16a34a; }
    #cri-card .mbox.fl .fill { background:#2563eb; }

    /* info / tip */
    #cri-card .ibox { border-radius:12px; padding:12px 14px; display:flex; gap:10px; align-items:flex-start; margin-bottom:10px; }
    #cri-card .ibox.blue { background:#eff6ff; border:1px solid #dbeafe; }
    #cri-card .ibox.yell { background:#fffbeb; border:1px solid #fde68a; }
    #cri-card .ibox .ico { font-size:14px; flex-shrink:0; margin-top:1px; }
    #cri-card .ibox.blue p { font-size:12.5px;color:#1e40af;font-weight:500;line-height:1.55; }
    #cri-card .ibox.yell p { font-size:12.5px;color:#92400e;font-weight:500;line-height:1.55; }

    /* close btn */
    #cri-close {
      position:absolute; top:14px; right:14px;
      background:#f4f4f5; border:none; border-radius:50%;
      width:26px; height:26px; cursor:pointer; font-size:14px;
      display:flex; align-items:center; justify-content:center;
      color:#71717a; transition:background .15s;
    }
    #cri-close:hover { background:#e4e4e7; }
  `;

  /* ── INJECT FONT + STYLES ── */
  const fontLink = document.createElement('link');
  fontLink.rel  = 'stylesheet';
  fontLink.href = 'https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap';
  document.head.appendChild(fontLink);

  const style = document.createElement('style');
  style.textContent = CSS;
  document.head.appendChild(style);

  /* ── FAB BUTTON ── */
  const fab = document.createElement('button');
  fab.id = 'cri-fab';
  fab.title = 'Climate Risk Index';
  fab.textContent = '🌿';
  document.body.appendChild(fab);

  /* ── OVERLAY ── */
  const overlay = document.createElement('div');
  overlay.id = 'cri-overlay';
  overlay.innerHTML = `
    <div id="cri-card">
      <button id="cri-close">✕</button>

      <!-- Header -->
      <div class="ch">
        <div class="brand">
          <div class="b-icon">🌿</div>
          <span class="b-name">SeedSense AI</span>
        </div>
        <div class="loc-badge" id="cri-loc-btn">
          <span>📍</span>
          <span id="cri-loc-label">Kerala</span>
          <div id="cri-dropdown">
            ${Object.keys(DATA).map(s=>`<button data-state="${s}">${s}</button>`).join('')}
          </div>
        </div>
      </div>

      <!-- Title -->
      <div class="ct">
        <h3>🌱 Climate Risk Index</h3>
        <p id="cri-subtitle">Based on March climate patterns</p>
      </div>

      <!-- Metrics -->
      <div class="metrics">
        <div class="mbox dr">
          <div class="mlabel">🌵 Drought</div>
          <div class="mval" id="cri-drought">27%</div>
          <div class="track"><div class="fill" id="cri-dbar"></div></div>
        </div>
        <div class="mbox fl">
          <div class="mlabel">🌊 Flood</div>
          <div class="mval" id="cri-flood">16%</div>
          <div class="track"><div class="fill" id="cri-fbar"></div></div>
        </div>
        <div class="mbox ov">
          <div class="mlabel">Overall Risk</div>
          <div class="mval" id="cri-overall">LOW</div>
        </div>
      </div>

      <!-- Info -->
      <div class="ibox blue"><span class="ico">ℹ️</span><p id="cri-info"></p></div>
      <div class="ibox yell"><span class="ico">💡</span><p id="cri-tip"></p></div>
    </div>
  `;
  document.body.appendChild(overlay);

  /* ── LOAD STATE ── */
  function loadState(name) {
    const d = DATA[name];
    document.getElementById('cri-loc-label').textContent = name;
    document.getElementById('cri-subtitle').textContent  = `Based on ${d.month} climate patterns`;
    document.getElementById('cri-drought').textContent   = d.drought + '%';
    document.getElementById('cri-flood').textContent     = d.flood   + '%';
    const ov = document.getElementById('cri-overall');
    ov.textContent  = d.overall;
    ov.style.color  = RISK_COLOR[d.overall];
    document.getElementById('cri-info').textContent = d.info;
    document.getElementById('cri-tip').textContent  = d.tip;
    // animate bars
    requestAnimationFrame(() => {
      document.getElementById('cri-dbar').style.width = d.drought + '%';
      document.getElementById('cri-fbar').style.width = d.flood   + '%';
    });
    // mark selected
    document.querySelectorAll('#cri-dropdown button').forEach(b =>
      b.classList.toggle('sel', b.dataset.state === name));
  }

  /* ── EVENTS ── */
  fab.addEventListener('click', () => {
    overlay.classList.add('open');
    setTimeout(() => loadState(document.getElementById('cri-loc-label').textContent), 80);
  });

  document.getElementById('cri-close').addEventListener('click', () =>
    overlay.classList.remove('open'));

  overlay.addEventListener('click', e => {
    if (e.target === overlay) overlay.classList.remove('open');
  });

  // Location badge toggles dropdown
  document.getElementById('cri-loc-btn').addEventListener('click', e => {
    e.stopPropagation();
    document.getElementById('cri-dropdown').classList.toggle('open');
  });

  document.querySelectorAll('#cri-dropdown button').forEach(btn => {
    btn.addEventListener('click', e => {
      e.stopPropagation();
      document.getElementById('cri-dropdown').classList.remove('open');
      loadState(btn.dataset.state);
    });
  });

  document.addEventListener('click', () =>
    document.getElementById('cri-dropdown').classList.remove('open'));

})();
