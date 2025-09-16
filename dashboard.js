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

function readJson(key, fallback){
  try { return JSON.parse(localStorage.getItem(key) || JSON.stringify(fallback)); } catch(e){ return fallback; }
}

function writeJson(key, value){
  localStorage.setItem(key, JSON.stringify(value));
}

function formatDate(iso){
  try { const d = new Date(iso); return d.toLocaleString(); } catch(e){ return iso; }
}

function renderHistory(){
  const table = document.getElementById('historyTable');
  const rows = readJson('am_history', []).map((h, idx)=>`
    <tr>
      <td>${idx+1}</td>
      <td><span class="chip">${h.crop || '-'}</span></td>
      <td>${h.location || '-'}</td>
      <td>${h.area || '-'}</td>
      <td>${h.estimate || '-'}</td>
      <td>${h.confidence != null ? h.confidence + '%' : '-'}</td>
      <td>${formatDate(h.timestamp)}</td>
    </tr>
  `).join('');
  table.innerHTML = `
    <thead>
      <tr>
        <th>#</th>
        <th data-i18n="dash.tbl.crop">Crop</th>
        <th data-i18n="dash.tbl.location">Location</th>
        <th data-i18n="dash.tbl.area">Area</th>
        <th data-i18n="dash.tbl.estimate">Estimate</th>
        <th data-i18n="dash.tbl.confidence">Confidence</th>
        <th data-i18n="dash.tbl.when">When</th>
      </tr>
    </thead>
    <tbody>${rows || ''}</tbody>`;
}

function renderFarmer(){
  const info = readJson('am_farmer', { name:'', village:'', acres:'' });
  const sum = document.getElementById('farmerSummary');
  if(sum){
    const name = info.name || '-';
    const village = info.village || '-';
    const acres = info.acres ? info.acres + ' acres' : '-';
    sum.innerHTML = `<div class="chip">${name}</div> <div class="chip">${village}</div> <div class="chip">${acres}</div>`;
  }
  const nameEl = document.getElementById('farmerName');
  const villageEl = document.getElementById('farmerVillage');
  const acresEl = document.getElementById('farmerAcres');
  if(nameEl) nameEl.value = info.name || '';
  if(villageEl) villageEl.value = info.village || '';
  if(acresEl) acresEl.value = info.acres || '';
}

function renderResources(){
  const table = document.getElementById('resourceTable');
  const chips = document.getElementById('resourceChips');
  const data = readJson('am_resources', []);
  const rows = data.map((r, idx)=>`
    <tr>
      <td>${idx+1}</td>
      <td>${r.name}</td>
      <td>${r.quantity}</td>
      <td><button class="btn" data-del="${idx}">Remove</button></td>
    </tr>
  `).join('');
  table.innerHTML = `
    <thead>
      <tr>
        <th>#</th>
        <th data-i18n="dash.tbl.resource">Resource</th>
        <th data-i18n="dash.tbl.quantity">Quantity</th>
        <th></th>
      </tr>
    </thead>
    <tbody>${rows || ''}</tbody>`;
  chips.innerHTML = data.map(r=>`<span class="chip">${r.name}: ${r.quantity}</span>`).join('');

  table.addEventListener('click', (e)=>{
    const btn = e.target.closest('button[data-del]');
    if(!btn) return;
    const idx = Number(btn.getAttribute('data-del'));
    const fresh = readJson('am_resources', []);
    fresh.splice(idx,1);
    writeJson('am_resources', fresh);
    renderResources();
  });
}

document.getElementById('resourceForm').addEventListener('submit', (e)=>{
  e.preventDefault();
  const name = document.getElementById('resName').value.trim();
  const quantity = document.getElementById('resQty').value.trim();
  if(!name || !quantity) return;
  const data = readJson('am_resources', []);
  data.unshift({name, quantity});
  writeJson('am_resources', data.slice(0,200));
  (e.target).reset();
  renderResources();
});

document.getElementById('clearHistory').addEventListener('click', ()=>{
  if(confirm('Clear all past predictions on this device?')){
    localStorage.removeItem('am_history');
    renderHistory();
  }
});

renderResources();
renderHistory();
renderFarmer();

// Seed button (dashboard)
document.addEventListener('DOMContentLoaded', ()=>{
  const btn = document.getElementById('seedBtn');
  if(btn && window.Seed){
    btn.addEventListener('click', ()=>{
      window.Seed.seedDemoData({ historyCount: 30, resourceCount: 8 });
      renderResources();
      renderHistory();
    });
  }
  const farmerForm = document.getElementById('farmerForm');
  if(farmerForm){
    farmerForm.addEventListener('submit', (e)=>{
      e.preventDefault();
      const name = document.getElementById('farmerName').value.trim();
      const village = document.getElementById('farmerVillage').value.trim();
      const acres = document.getElementById('farmerAcres').value.trim();
      writeJson('am_farmer', { name, village, acres });
      renderFarmer();
    });
  }
});

