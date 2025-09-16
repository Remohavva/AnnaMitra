document.getElementById('year').textContent = new Date().getFullYear();

// Theme handling
function applyTheme(theme){
  document.documentElement.setAttribute('data-theme', theme);
  const toggle = document.getElementById('themeToggle');
  if(toggle){ toggle.checked = theme === 'light'; }
}
function initTheme(){
  const saved = localStorage.getItem('am_theme') || 'dark';
  applyTheme(saved);
  const toggle = document.getElementById('themeToggle');
  if(toggle){
    toggle.addEventListener('change', ()=>{
      const next = toggle.checked ? 'light' : 'dark';
      localStorage.setItem('am_theme', next);
      applyTheme(next);
    });
  }
}
initTheme();

const form = document.getElementById('advisoryForm');
const result = document.getElementById('result');
const demoBtn = document.getElementById('demoBtn');
const resetBtn = document.getElementById('resetBtn');

function showResult(payload){
  if(!result) return;
  result.style.display = 'block';
  result.innerHTML = `
    <div style="padding:12px;border-radius:10px;background:rgba(255,255,255,0.02);border:1px solid rgba(255,255,255,0.03)">
      <strong>Estimate:</strong> ${payload.estimate}
      <div class="muted">Confidence: ${payload.confidence}%</div>
      <div style="margin-top:8px"><strong>Quick advice:</strong> ${payload.advice}</div>
    </div>`;
  result.scrollIntoView({behavior:'smooth',block:'center'});
}

function getHistory(){
  try { return JSON.parse(localStorage.getItem('am_history')||'[]'); } catch(e){ return []; }
}

function addToHistory(entry){
  const history = getHistory();
  history.unshift(entry);
  localStorage.setItem('am_history', JSON.stringify(history.slice(0,100)));
}

if(form){
  form.addEventListener('submit', (e)=>{
    e.preventDefault();
    const crop = (document.getElementById('crop')||{}).value || 'Wheat';
    const location = (document.getElementById('location')||{}).value || 'Unknown';
    const area = (document.getElementById('area')||{}).value || '1';

    const base = {Wheat:2.8,Rice:3.2,Maize:2.4,Soybean:1.6}[crop] || 2.5;
    const est = (base * Number(area)).toFixed(2);
    const conf = Math.min(98, Math.round(80 + Math.random()*15));
    const advice = conf>90 ? 'Follow recommended fertilizer schedule; monitor for pests.' : 'Collect soil sample and avoid overwatering; use early pest traps.';

    const payload = {estimate: est + ' t/ha', confidence: conf, advice};
    showResult(payload);

    const historyEntry = {
      crop,
      location,
      area,
      estimate: payload.estimate,
      confidence: payload.confidence,
      advice: payload.advice,
      timestamp: new Date().toISOString()
    };
    addToHistory(historyEntry);
  });
}

if(demoBtn && form){
  demoBtn.addEventListener('click', ()=>{
    const cropEl = document.getElementById('crop');
    const locEl = document.getElementById('location');
    const areaEl = document.getElementById('area');
    if(cropEl) cropEl.value = 'Rice';
    if(locEl) locEl.value = 'Telangana';
    if(areaEl) areaEl.value = '2';
    form.dispatchEvent(new Event('submit', {cancelable:true}));
  });
}

if(resetBtn && form){
  resetBtn.addEventListener('click', ()=>{
    form.reset();
    if(result) result.style.display = 'none';
  });
}

window.addEventListener('keydown',(e)=>{ if(e.key==='c') demoBtn.click(); });

// Insights chart
function parseEstimate(est){
  if(!est) return NaN;
  const num = parseFloat(String(est).replace(/[^0-9.]/g,''));
  return isNaN(num) ? NaN : num;
}

function renderInsights(){
  const canvas = document.getElementById('historyChart');
  if(!canvas) return;
  const ctx = canvas.getContext('2d');
  // Ensure canvas matches display width for crisp rendering
  try{ const rect = canvas.getBoundingClientRect(); if(rect.width){ canvas.width = Math.floor(rect.width*window.devicePixelRatio||1); canvas.height = Math.floor(160*(window.devicePixelRatio||1)); } }catch(e){}
  const history = (function(){ try{ return JSON.parse(localStorage.getItem('am_history')||'[]'); }catch(e){return []} })();
  const last = history.slice(0,20).reverse();
  const values = last.map(h=>parseEstimate(h.estimate)).filter(v=>!isNaN(v));
  const labels = last.map((_,i)=>i+1);

  // Stats
  const avg = values.length? (values.reduce((a,b)=>a+b,0)/values.length).toFixed(2) : '-';
  const max = values.length? Math.max(...values).toFixed(2) : '-';
  const count = history.length;
  const avgEl = document.getElementById('avgEst'); if(avgEl) avgEl.textContent = typeof avg==='string'?avg:(avg+'');
  const maxEl = document.getElementById('maxEst'); if(maxEl) maxEl.textContent = typeof max==='string'?max:(max+'');
  const cntEl = document.getElementById('runCount'); if(cntEl) cntEl.textContent = String(count);

  // Clear
  ctx.clearRect(0,0,canvas.width,canvas.height);
  // Draw axes
  const w = canvas.width; const h = canvas.height; const pad = 24;
  ctx.strokeStyle = 'rgba(255,255,255,0.2)';
  if(document.documentElement.getAttribute('data-theme')==='light') ctx.strokeStyle = 'rgba(0,0,0,0.2)';
  ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(pad, h-pad); ctx.lineTo(w-pad, h-pad); ctx.moveTo(pad, h-pad); ctx.lineTo(pad, pad); ctx.stroke();

  if(values.length<2) return;
  const minV = Math.min(...values);
  const maxV = Math.max(...values);
  const span = (maxV-minV) || 1;
  const xStep = (w - pad*2) / (values.length-1);

  // Line
  ctx.beginPath();
  ctx.strokeStyle = '#22c55e';
  ctx.lineWidth = 2;
  values.forEach((v, i)=>{
    const x = pad + i*xStep;
    const y = h - pad - ((v - minV) / span) * (h - pad*2);
    if(i===0) ctx.moveTo(x,y); else ctx.lineTo(x,y);
  });
  ctx.stroke();

  // Points
  ctx.fillStyle = '#16a34a';
  values.forEach((v, i)=>{
    const x = pad + i*xStep;
    const y = h - pad - ((v - minV) / span) * (h - pad*2);
    ctx.beginPath(); ctx.arc(x,y,2.5,0,Math.PI*2); ctx.fill();
  });

  // Crop-wise average bar chart
  const cropCanvas = document.getElementById('cropChart');
  if(cropCanvas){
    try{ const r = cropCanvas.getBoundingClientRect(); if(r.width){ cropCanvas.width = Math.floor(r.width*(window.devicePixelRatio||1)); cropCanvas.height = Math.floor(160*(window.devicePixelRatio||1)); } }catch(e){}
    const cctx = cropCanvas.getContext('2d');
    cctx.clearRect(0,0,cropCanvas.width,cropCanvas.height);
    const byCrop = {};
    (history||[]).slice(0,60).forEach(item=>{
      const crop = item.crop || 'Other';
      const val = parseEstimate(item.estimate);
      if(isNaN(val)) return;
      if(!byCrop[crop]) byCrop[crop] = {sum:0,count:0};
      byCrop[crop].sum += val; byCrop[crop].count += 1;
    });
    const cropNames = Object.keys(byCrop);
    const cropAvgs = cropNames.map(k=> byCrop[k].sum / byCrop[k].count);
    const cw = cropCanvas.width, ch = cropCanvas.height, cpad = 28;
    cctx.strokeStyle = (document.documentElement.getAttribute('data-theme')==='light') ? 'rgba(0,0,0,0.2)' : 'rgba(255,255,255,0.2)';
    cctx.lineWidth = 1; cctx.beginPath(); cctx.moveTo(cpad, ch-cpad); cctx.lineTo(cw-cpad, ch-cpad); cctx.moveTo(cpad, ch-cpad); cctx.lineTo(cpad, cpad); cctx.stroke();
    if(cropAvgs.length){
      const maxBar = Math.max(...cropAvgs);
      const barAreaW = cw - cpad*2; const barW = Math.max(14, Math.min(60, barAreaW / (cropAvgs.length*1.6)));
      const gap = barW*0.6; let x = cpad + gap/2;
      cctx.fillStyle = '#22c55e';
      cropAvgs.forEach((v,i)=>{
        const bh = ((v/maxBar) * (ch - cpad*2));
        const y = ch - cpad - bh;
        cctx.fillRect(x, y, barW, bh);
        // labels
        cctx.fillStyle = (document.documentElement.getAttribute('data-theme')==='light') ? '#0b1220' : '#e6eef6';
        cctx.font = '10px Inter, system-ui';
        const label = cropNames[i].length>8? cropNames[i].slice(0,8)+'…' : cropNames[i];
        cctx.textAlign = 'center'; cctx.fillText(label, x + barW/2, ch - cpad + 12);
        cctx.fillStyle = '#22c55e';
        x += barW + gap;
      });
    }
  }

  // Confidence distribution chart
  const confCanvas = document.getElementById('confChart');
  if(confCanvas){
    try{ const r2 = confCanvas.getBoundingClientRect(); if(r2.width){ confCanvas.width = Math.floor(r2.width*(window.devicePixelRatio||1)); confCanvas.height = Math.floor(160*(window.devicePixelRatio||1)); } }catch(e){}
    const kctx = confCanvas.getContext('2d');
    kctx.clearRect(0,0,confCanvas.width,confCanvas.height);
    const confs = (history||[]).slice(0,100).map(h=>Number(h.confidence)).filter(v=>!isNaN(v));
    const buckets = [0,0,0,0]; // 80-84, 85-89, 90-94, 95-100
    confs.forEach(v=>{
      if(v<85) buckets[0]++; else if(v<90) buckets[1]++; else if(v<95) buckets[2]++; else buckets[3]++;
    });
    const labelsK = ['80-84','85-89','90-94','95-100'];
    const kw = confCanvas.width, kh = confCanvas.height, kpad = 28;
    kctx.strokeStyle = (document.documentElement.getAttribute('data-theme')==='light') ? 'rgba(0,0,0,0.2)' : 'rgba(255,255,255,0.2)';
    kctx.lineWidth = 1; kctx.beginPath(); kctx.moveTo(kpad, kh-kpad); kctx.lineTo(kw-kpad, kh-kpad); kctx.moveTo(kpad, kh-kpad); kctx.lineTo(kpad, kpad); kctx.stroke();
    const maxCount = Math.max(1, ...buckets);
    const barAreaW2 = kw - kpad*2; const barW2 = Math.max(20, Math.min(70, barAreaW2 / (buckets.length*1.6)));
    const gap2 = barW2*0.6; let x2 = kpad + gap2/2;
    labelsK.forEach((lab, i)=>{
      const v = buckets[i];
      const bh = ((v/maxCount) * (kh - kpad*2));
      const y = kh - kpad - bh;
      kctx.fillStyle = '#10b981';
      kctx.fillRect(x2, y, barW2, bh);
      kctx.fillStyle = (document.documentElement.getAttribute('data-theme')==='light') ? '#0b1220' : '#e6eef6';
      kctx.font = '10px Inter, system-ui';
      kctx.textAlign = 'center'; kctx.fillText(lab, x2 + barW2/2, kh - kpad + 12);
      x2 += barW2 + gap2;
    });
  }
}

window.addEventListener('load', renderInsights);

// Seed button (home)
document.addEventListener('DOMContentLoaded', ()=>{
  const btn = document.getElementById('seedBtn');
  if(btn && window.Seed){
    btn.addEventListener('click', ()=>{
      window.Seed.seedDemoData({ historyCount: 30, resourceCount: 8 });
      renderInsights();
    });
  }
  // Auto-seed minimal data if chart empty
  try{
    const history = JSON.parse(localStorage.getItem('am_history')||'[]');
    if((!history || history.length===0) && window.Seed){
      window.Seed.seedDemoData({ historyCount: 10, resourceCount: 5 });
      renderInsights();
    }
  }catch(e){}

  // Interactive features list behavior
  const toggles = document.querySelectorAll('.feature-toggle');
  toggles.forEach(btn=>{
    btn.addEventListener('click', ()=>{
      const expanded = btn.getAttribute('aria-expanded') === 'true';
      btn.setAttribute('aria-expanded', String(!expanded));
      const panel = btn.parentElement && btn.parentElement.querySelector('.feature-panel');
      if(panel){
        if(expanded){ panel.setAttribute('hidden',''); }
        else { panel.removeAttribute('hidden'); }
      }
    });
  });
});