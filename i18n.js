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
    },
    details: { title: 'Details', desc: 'TerraNova brings together weather, satellite and historical data to guide sowing, irrigation, fertilizer and pest control decisions with clear, farmer-friendly steps.' },
    insights: { title: 'Historical Insights', subtitle: 'Based on your recent runs on this device.', avg: 'Average Estimate', best: 'Highest Estimate', count: 'Predictions Count' },
    featuresX: {
      title: 'Features Offered',
      localWeather: { title:'Local weather-aware', desc:'Advisory adapts to your village’s forecast and rainfall patterns.' },
      soil: { title:'Soil & stage guidance', desc:'Actions tailored for crop stage with simple soil health tips.' },
      alerts: { title:'Pest and disease alerts', desc:'Early warnings from satellite and community signals.' },
      offline: { title:'Offline-first', desc:'Save advisories and view without continuous internet.' },
      translations: { title:'Multilingual support', desc:'Switch languages instantly in the header.' },
      dashboard: { title:'Resource dashboard', desc:'Track inputs and view all past predictions.' }
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
    },
    details: { title: 'विवरण', desc: 'TerraNova मौसम, उपग्रह और ऐतिहासिक डेटा को जोड़कर बुवाई, सिंचाई, खाद और कीट नियंत्रण के निर्णयों के लिए स्पष्ट, किसान-अनुकूल कदम सुझाता है।' },
    insights: { title: 'ऐतिहासिक जानकारियाँ', subtitle: 'इस डिवाइस पर आपके हाल के रन के आधार पर।', avg: 'औसत अनुमान', best: 'उच्चतम अनुमान', count: 'पूर्वानुमान संख्या' },
    featuresX: {
      title: 'प्रस्तुत सुविधाएँ',
      localWeather: { title:'स्थानीय मौसम-सचेत', desc:'सलाह आपके गाँव के पूर्वानुमान और वर्षा के अनुसार बदलती है।' },
      soil: { title:'मृदा और चरण मार्गदर्शन', desc:'फसल चरण के अनुसार क्रियाएँ और सरल मृदा स्वास्थ्य सुझाव।' },
      alerts: { title:'कीट और रोग अलर्ट', desc:'उपग्रह और सामुदायिक संकेतों से समय पर चेतावनी।' },
      offline: { title:'ऑफ़लाइन-पहले', desc:'सलाह सहेजें और बिना निरंतर इंटरनेट के देखें।' },
      translations: { title:'बहुभाषी समर्थन', desc:'हेडर से तुरंत भाषा बदलें।' },
      dashboard: { title:'संसाधन डैशबोर्ड', desc:'इनपुट ट्रैक करें और सभी पूर्वानुमान देखें।' }
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

