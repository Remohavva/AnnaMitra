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