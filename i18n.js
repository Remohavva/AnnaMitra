// Simple client-side i18n
const I18N_DICTIONARIES = {
  en: {
    nav: { home: 'Home', about: 'About', features: 'Features', how: 'How it Works', contact: 'Contact', dashboard: 'Dashboard', cta: 'Get Advisory' },
    hero: { chip: '🌾 Farmer-friendly • Offline-first', title: 'Predict crop yield with localized AI advice.', desc: 'TerraNova combines satellite data, historical yields and local weather to give tailored predictions and simple actions farmers can take to improve yield — fertilizer timing, irrigation advice, and pest alerts.', demo: 'Try Demo' },
    features: {
      f1: { title: 'Accurate forecasts', desc: 'Short- and long-term yield estimates with confidence bands and simple recommendations.' },
      f2: { title: 'Actionable advisory', desc: 'Step-by-step guidance tuned for crop, stage, and local conditions.' },
      f3: { title: 'Offline support', desc: 'Download advisories and use basic features without continuous internet.' }
    },
    form: { title: 'Get instant advisory', subtitle: 'Enter location & crop to see a quick estimate and recommendations.', crop: { placeholder: 'Select crop' }, location: 'Village or District', area: 'Area (in acres)', submit: 'Run Prediction', reset: 'Reset' },
    crops: { wheat: 'Wheat', rice: 'Rice', maize: 'Maize', soybean: 'Soybean' },
    how: { title: 'How it works', desc: 'We blend open weather APIs, satellite indices (NDVI), and historical yields. The model provides a confidence interval and converts technical signals into simple actions farmers can perform.' },
    contact: { title: 'Contact Us', desc: 'For partnerships, feedback or support — reach out at <a href="mailto:info@terranova.org">info@terranova.org</a>' },
    footer: { tagline: 'Built for smallholder farmers • Open to research partners' },
    dash: {
      clear: 'Clear History', addResource: 'Add Resource', resources: 'Your Resources', history: 'Past Predictions', subtitle: 'Latest 100 runs stored on this device.',
      tbl: { crop:'Crop', location:'Location', area:'Area', estimate:'Estimate', confidence:'Confidence', when:'When', resource:'Resource', quantity:'Quantity' }
    }
  },
  hi: {
    nav: { home: 'मुखपृष्ठ', about: 'परिचय', features: 'विशेषताएँ', how: 'यह कैसे काम करता है', contact: 'संपर्क', dashboard: 'डैशबोर्ड', cta: 'सलाह लें' },
    hero: { chip: '🌾 किसान-अनुकूल • ऑफ़लाइन समर्थन', title: 'स्थानीयकृत एआई सलाह के साथ फसल उपज का अनुमान लगाएँ।', desc: 'TerraNova उपग्रह डेटा, ऐतिहासिक उपज और स्थानीय मौसम को मिलाकर अनुकूलित अनुमान और सरल कार्य देता है — खाद डालने का समय, सिंचाई सलाह, और कीट चेतावनी।', demo: 'डेमो आज़माएँ' },
    features: {
      f1: { title: 'सटीक पूर्वानुमान', desc: 'लंबी और छोटी अवधि के अनुमान, भरोसे के साथ और सरल सिफारिशें।' },
      f2: { title: 'कार्यान्वयन योग्य सलाह', desc: 'फसल, चरण और स्थानीय स्थितियों के अनुसार चरण-दर-चरण मार्गदर्शन।' },
      f3: { title: 'ऑफ़लाइन समर्थन', desc: 'सलाह डाउनलोड करें और बिना निरंतर इंटरनेट के मूल सुविधाएँ उपयोग करें।' }
    },
    form: { title: 'तुरंत सलाह प्राप्त करें', subtitle: 'स्थान और फसल दर्ज करें और अनुमान व सिफारिशें देखें।', crop: { placeholder: 'फसल चुनें' }, location: 'गाँव या ज़िला', area: 'क्षेत्र (एकड़ में)', submit: 'पूर्वानुमान चलाएँ', reset: 'रीसेट' },
    crops: { wheat: 'गेहूं', rice: 'धान', maize: 'मक्का', soybean: 'सोयाबीन' },
    how: { title: 'यह कैसे काम करता है', desc: 'हम ओपन वेदर एपीआई, उपग्रह सूचकांक (NDVI) और ऐतिहासिक उपज मिलाते हैं। मॉडल भरोसे का स्तर देता है और तकनीकी संकेतों को सरल कार्यों में बदलता है।' },
    contact: { title: 'संपर्क करें', desc: 'साझेदारियों, प्रतिक्रिया या सहायता के लिए — लिखें <a href="mailto:info@terranova.org">info@terranova.org</a>' },
    footer: { tagline: 'लघु किसानो के लिए • शोध भागीदारी के लिए खुला' },
    dash: {
      clear: 'इतिहास साफ़ करें', addResource: 'संसाधन जोड़ें', resources: 'आपके संसाधन', history: 'पिछले पूर्वानुमान', subtitle: 'नवीनतम 100 रन इस डिवाइस पर संग्रहीत हैं।',
      tbl: { crop:'फसल', location:'स्थान', area:'क्षेत्र', estimate:'अनुमान', confidence:'भरोसा', when:'कब', resource:'संसाधन', quantity:'मात्रा' }
    }
  }
};

function i18nApply(lang){
  const dict = I18N_DICTIONARIES[lang] || I18N_DICTIONARIES.en;
  document.querySelectorAll('[data-i18n]').forEach(el=>{
    const path = el.getAttribute('data-i18n');
    const attr = el.getAttribute('data-i18n-attr');
    const value = path.split('.').reduce((o,k)=> (o||{})[k], dict);
    if(value==null) return;
    if(attr){
      el.setAttribute(attr, value);
    } else {
      el.innerHTML = value;
    }
  });
  const sel = document.getElementById('langSelect');
  if(sel) sel.value = lang;
}

function i18nInit(){
  const saved = localStorage.getItem('am_lang') || 'en';
  i18nApply(saved);
  const sel = document.getElementById('langSelect');
  if(sel){
    sel.addEventListener('change', ()=>{
      const lang = sel.value;
      localStorage.setItem('am_lang', lang);
      i18nApply(lang);
    });
  }
}

document.addEventListener('DOMContentLoaded', i18nInit);

