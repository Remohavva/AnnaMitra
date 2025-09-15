// Seed random demo data for TerraNova
(function(){
  const CROPS = ['Wheat','Rice','Maize','Soybean'];
  const LOCATIONS = ['Telangana','Punjab','Bihar','Madhya Pradesh','Maharashtra','Gujarat','Odisha','Uttar Pradesh'];
  const RESOURCES = ['Urea','DAP','Seeds','Pesticide','Herbicide','Irrigation Hours','Compost','Mulch'];

  function randomInt(min, max){ return Math.floor(Math.random()*(max-min+1))+min; }
  function randomChoice(arr){ return arr[Math.floor(Math.random()*arr.length)]; }
  function randomFloat(min, max, digits){ const n = (Math.random()*(max-min))+min; return Number(n.toFixed(digits ?? 2)); }

  function generateHistory(count){
    const history = [];
    for(let i=0;i<count;i++){
      const crop = randomChoice(CROPS);
      const area = String(randomInt(1,5));
      const base = {Wheat:2.8,Rice:3.2,Maize:2.4,Soybean:1.6}[crop] || 2.5;
      const estimateVal = randomFloat(base*0.8, base*1.2) * Number(area);
      const estimate = estimateVal.toFixed(2) + ' t/ha';
      const confidence = randomInt(80,98);
      const advice = confidence>90 ? 'Follow recommended fertilizer schedule; monitor for pests.' : 'Collect soil sample and avoid overwatering; use early pest traps.';
      const location = randomChoice(LOCATIONS);
      const daysAgo = randomInt(0,60);
      const timestamp = new Date(Date.now() - daysAgo*24*60*60*1000 - randomInt(0,86400000)).toISOString();
      history.push({ crop, location, area, estimate, confidence, advice, timestamp });
    }
    return history;
  }

  function generateResources(count){
    const resources = [];
    const used = new Set();
    for(let i=0;i<count;i++){
      const name = randomChoice(RESOURCES);
      if(used.has(name)) continue;
      used.add(name);
      const quantity = name==='Irrigation Hours' ? randomInt(5,40) + ' hrs' : randomInt(1,50) + (name==='Seeds'?' kg':' kg');
      resources.push({ name, quantity });
    }
    return resources;
  }

  function mergeIntoLocalStorage(key, items, max){
    let existing = [];
    try { existing = JSON.parse(localStorage.getItem(key)||'[]'); } catch(e){ existing = []; }
    if(!Array.isArray(existing)) existing = [];
    const merged = [ ...items, ...existing ].slice(0, max);
    localStorage.setItem(key, JSON.stringify(merged));
    return merged.length;
  }

  function seedDemoData(opts){
    const historyCount = Number((opts&&opts.historyCount) ?? 25);
    const resourceCount = Number((opts&&opts.resourceCount) ?? 6);
    const history = generateHistory(historyCount);
    const resources = generateResources(resourceCount);
    const hLen = mergeIntoLocalStorage('am_history', history, 100);
    localStorage.setItem('am_resources', JSON.stringify(resources));
    return { historySeeded: history.length, historyTotal: hLen, resourcesSeeded: resources.length };
  }

  function clearDemoData(){
    localStorage.removeItem('am_history');
    localStorage.removeItem('am_resources');
  }

  window.Seed = { generateHistory, generateResources, seedDemoData, clearDemoData };

  // Auto-seed if URL contains ?seed=true
  try {
    const params = new URLSearchParams(location.search);
    if(params.get('seed') === 'true'){
      seedDemoData({ historyCount: Number(params.get('h')||25), resourceCount: Number(params.get('r')||6) });
      // Do not alert; keep silent to avoid disrupting UX
    }
  } catch(e){}
})();


