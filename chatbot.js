document.getElementById('year').textContent = new Date().getFullYear();

// Theme + i18n init
(function(){
  // theme
  const savedTheme = localStorage.getItem('am_theme') || 'dark';
  document.documentElement.setAttribute('data-theme', savedTheme);
  const themeToggle = document.getElementById('themeToggle');
  if(themeToggle){ themeToggle.checked = savedTheme==='light'; themeToggle.addEventListener('change',()=>{ const next = themeToggle.checked?'light':'dark'; localStorage.setItem('am_theme', next); document.documentElement.setAttribute('data-theme', next); }); }
  // i18n
  if(typeof i18nInit==='function') i18nInit();
})();

const chat = document.getElementById('chat');
const form = document.getElementById('chatForm');
const input = document.getElementById('chatText');

function appendBubble(text, who){
  const div = document.createElement('div');
  div.className = 'bubble ' + who;
  div.innerHTML = text;
  chat.appendChild(div);
  chat.scrollTop = chat.scrollHeight;
}

function getHistory(){ try{ return JSON.parse(localStorage.getItem('am_history')||'[]'); }catch(e){ return [] } }
function setHistory(h){ localStorage.setItem('am_history', JSON.stringify(h.slice(0,100))); }

function predictFromAnswers(state){
  const base = {Wheat:2.8,Rice:3.2,Maize:2.4,Soybean:1.6}[state.crop] || 2.5;
  const estVal = (base * Number(state.area||1));
  const conf = Math.min(98, Math.round(82 + Math.random()*14));
  const advice = conf>90 ? 'Irrigate lightly and apply NPK at recommended dose next week.' : 'Conduct soil test, avoid overwatering, and deploy early pest traps.';
  return { estimate: estVal.toFixed(2) + ' t/ha', confidence: conf, advice };
}

async function runFlow(){
  const state = {};
  appendBubble('Hi! Which crop are you growing? (Wheat/Rice/Maize/Soybean)', 'bot');
  state.crop = await ask();
  appendBubble('Great. Which village or district are you in?', 'bot');
  state.location = await ask();
  appendBubble('How big is your field area (in acres)?', 'bot');
  state.area = await ask();

  appendBubble('Thanks! Calculating your advisory…', 'bot');
  await delay(600);
  const res = predictFromAnswers(state);
  appendBubble(`<strong>Estimate:</strong> ${res.estimate}<br><span class="muted">Confidence: ${res.confidence}%</span><br><strong>Advice:</strong> ${res.advice}`, 'bot');

  const entry = { crop: capitalize(state.crop||'Wheat'), location: state.location||'Unknown', area: state.area||'1', estimate: res.estimate, confidence: res.confidence, advice: res.advice, timestamp: new Date().toISOString() };
  const h = getHistory(); h.unshift(entry); setHistory(h);
}

function delay(ms){ return new Promise(r=>setTimeout(r,ms)); }
function capitalize(s){ s=String(s||''); return s.charAt(0).toUpperCase()+s.slice(1).toLowerCase(); }

function ask(){
  return new Promise(resolve=>{
    function onSubmit(e){
      e.preventDefault();
      const text = (input.value||'').trim();
      if(!text) return;
      appendBubble(text, 'user');
      input.value = '';
      form.removeEventListener('submit', onSubmit);
      resolve(text);
    }
    form.addEventListener('submit', onSubmit);
  });
}

// Welcome
appendBubble('Welcome to TerraNova advisory chat. I will ask a few questions to tailor your prediction.', 'bot');
runFlow();

