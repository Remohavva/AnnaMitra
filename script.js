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

form.addEventListener('submit', (e)=>{
  e.preventDefault();
  const crop = document.getElementById('crop').value || 'Wheat';
  const location = document.getElementById('location').value || 'Unknown';
  const area = document.getElementById('area').value || '1';

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

demoBtn.addEventListener('click', ()=>{
  document.getElementById('crop').value = 'Rice';
  document.getElementById('location').value = 'Telangana';
  document.getElementById('area').value = '2';
  form.dispatchEvent(new Event('submit', {cancelable:true}));
});

resetBtn.addEventListener('click', ()=>{
  form.reset();
  result.style.display = 'none';
});

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
});