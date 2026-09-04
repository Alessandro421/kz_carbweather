import { mkdir, readFile, rm, writeFile, copyFile } from 'node:fs/promises';

const read = path => readFile(path, 'utf8');

await rm('dist', { recursive: true, force: true });
await mkdir('dist', { recursive: true });

const [template, ...uiParts] = await Promise.all([
  read('index.html'),
  read('ui1.html'),
  read('ui2.html'),
  read('ui3.html')
]);

for (const marker of ['<!--KZ_UI-->','<!--KZ_CSS-->','<!--KZ_JS-->']) {
  if (!template.includes(marker)) throw new Error(`index.html: marker ${marker} missing`);
}

const jsFiles = [
  'data.js',
  'tracks.js',
  'app-core.js',
  'app-telemetry.js',
  'race-ui.js',
  'cloud.js',
  'app-enhancements.js',
  'branding.js',
  'i18n.js',
  'network-status.js'
];

const jsSources = await Promise.all(jsFiles.map(read));

const preparedSources = jsSources.map((source, index) => {
  const file = jsFiles[index];
  if (file === 'app-core.js') {
    /* Repair the historical extra closing brace on updateMobileHero in source. */
    return source.split('\n').map(line =>
      line.startsWith('function updateMobileHero()') && line.endsWith('}}')
        ? line.slice(0,-1)
        : line
    ).join('\n');
  }
  if (file === 'app-telemetry.js') {
    /* Startup must happen once, after all bundled modules are evaluated. */
    return source
      .split('\n')
      .filter(line => !line.startsWith("$('logDate').value="))
      .join('\n');
  }
  return source;
});

/* Build gate 1: every source must parse independently. */
for (let i=0;i<preparedSources.length;i++) {
  try { new Function(preparedSources[i]); }
  catch (error) {
    console.error(`KZ source syntax check failed: ${jsFiles[i]}`);
    throw error;
  }
}

/*
  Build gate 2: execute the real component DB initialization against a tiny DOM.
  This catches the exact regression where the baseline/test selects rendered empty.
*/
const makeInput = (value='') => ({value:String(value),textContent:'',min:'',max:'',step:'',className:'',classList:{toggle(){},contains(){return false}},addEventListener(){}});
const makeSelect = () => {
  const el = makeInput('');
  el.options=[];
  let html='';
  Object.defineProperty(el,'innerHTML',{get(){return html},set(v){html=String(v);if(v==='')el.options.length=0}});
  el.appendChild = option => { el.options.push(option); if(!el.value) el.value=String(option.value??''); return option; };
  return el;
};
const smokeIds = ['bMain','tMain','bNeedle','tNeedle','bAtom','tAtom','bIdle','tIdle','bIdleB','tIdleB','bSlide','tSlide'];
const smokeElements = new Map(smokeIds.map(id=>[id,makeSelect()]));
for (const [id,value] of Object.entries({bClip:3,tClip:3,bA:'',bB:'',bC:'',tA:'',tB:'',tC:'',bNeedleInfo:'',tNeedleInfo:''})) smokeElements.set(id,makeInput(value));
const smokeDocument = {
  getElementById:id=>smokeElements.get(id)||null,
  createElement:tag=>tag==='option'?{value:'',textContent:''}:makeInput('')
};
try {
  new Function('window','document','localStorage', `${preparedSources[jsFiles.indexOf('data.js')]}\n${preparedSources[jsFiles.indexOf('app-core.js')]}\ninitComponentDB();`)(
    {}, smokeDocument, {getItem:()=>null,setItem(){},removeItem(){}}
  );
} catch (error) {
  console.error('KZ component DB runtime smoke test crashed');
  throw error;
}
const expected = {
  bMain:'180', tMain:'180', bNeedle:'K98', tNeedle:'K100', bAtom:'DP268', tAtom:'DP268',
  bIdle:'60', tIdle:'60', bIdleB:'48', tIdleB:'48', bSlide:'50', tSlide:'50'
};
for (const [id,value] of Object.entries(expected)) {
  const el=smokeElements.get(id);
  if (!el || el.options.length===0) throw new Error(`Runtime smoke test: #${id} has no options`);
  if (el.value!==value) throw new Error(`Runtime smoke test: #${id}=${el.value}, expected ${value}`);
}
console.log('KZ runtime smoke test: component selects populated with expected defaults.');

/* Build gate 2b: execute the isolated i18n runtime and verify real static + dynamic translations. */
const i18nWindow={};
const i18nDocument={readyState:'loading',addEventListener(){}};
try {
  new Function('window','document','localStorage','Node','MutationObserver', preparedSources[jsFiles.indexOf('i18n.js')])(
    i18nWindow,
    i18nDocument,
    {getItem:()=>null,setItem(){},removeItem(){}},
    {TEXT_NODE:3,ELEMENT_NODE:1,DOCUMENT_FRAGMENT_NODE:11,DOCUMENT_NODE:9},
    class { observe(){} }
  );
} catch (error) {
  console.error('KZ i18n runtime smoke test crashed');
  throw error;
}
if (!i18nWindow.KZI18N) throw new Error('Runtime smoke test: KZI18N API missing');
const translationCases=[
  ['Setup di riferimento','en','Reference setup'],
  ['Setup di riferimento','es','Configuración de referencia'],
  ['Setup di riferimento','de','Referenz-Setup'],
  ['Tacca · 5 tacche fisiche · step 0,5','en','Clip · 5 physical positions · step 0.5'],
  ['Correzioni suggerite: minimo 60→62 · tacca 3→3.5.','es','Correcciones sugeridas: baja 60→62 · clip 3→3.5.'],
  ['ALFANO 7 · 12 giri classificati · 840 campioni T2','de','ALFANO 7 · 12 gewertete Runden · 840 T2-Messwerte'],
  ['Login per sincronizzare PC e smartphone.','de','Anmelden, um PC und Smartphone zu synchronisieren.']
];
for (const [source,target,want] of translationCases) {
  const got=i18nWindow.KZI18N.translate(source,target);
  if (got!==want) throw new Error(`i18n smoke test ${target}: ${JSON.stringify(got)} != ${JSON.stringify(want)}`);
}
if (i18nWindow.KZI18N.supported.join(',')!=='it,en,es,de') throw new Error('Runtime smoke test: language set is incomplete');
console.log('KZ i18n smoke test: IT/EN/ES/DE static and dynamic translations passed.');

/* Build gate 2c: network-state layer must expose explicit offline/online UI without issuing requests. */
const networkEvents={};
const networkMessages={weather:'',cloud:'',status:'',toast:''};
const networkDocument={
  readyState:'complete',
  documentElement:{lang:'en',dataset:{}},
  getElementById:id=>id==='weatherMsg'?{textContent:networkMessages.weather}:null,
  addEventListener(){}
};
const networkWindow={
  KZI18N:{getLanguage:()=> 'en'},
  addEventListener:(name,fn)=>{networkEvents[name]=fn}
};
const networkNavigator={onLine:false};
try {
  new Function('window','document','navigator','setInlineMessage','cloudStatus','cloudMsg','showToast','updateCloudUI', preparedSources[jsFiles.indexOf('network-status.js')])(
    networkWindow,
    networkDocument,
    networkNavigator,
    (_id,text)=>{networkMessages.weather=text},
    text=>{networkMessages.status=text},
    text=>{networkMessages.cloud=text},
    text=>{networkMessages.toast=text},
    ()=>{networkMessages.status='ONLINE'}
  );
} catch (error) {
  console.error('KZ network-state runtime smoke test crashed');
  throw error;
}
if (!networkWindow.KZNetworkStatus) throw new Error('Runtime smoke test: KZNetworkStatus API missing');
if (networkDocument.documentElement.dataset.network!=='offline') throw new Error('Runtime smoke test: offline dataset state missing');
if (networkMessages.status!=='OFFLINE') throw new Error('Runtime smoke test: cloud offline state missing');
if (!networkMessages.weather.startsWith('Offline:')) throw new Error('Runtime smoke test: weather offline message missing');
if (!networkEvents.online||!networkEvents.offline) throw new Error('Runtime smoke test: network listeners missing');
networkNavigator.onLine=true;
networkEvents.online();
if (networkDocument.documentElement.dataset.network!=='online') throw new Error('Runtime smoke test: online dataset state missing');
console.log('KZ network-state smoke test: explicit offline/online state passed.');

/* Build gate 2d: GPS handling must preflight denied permission and distinguish standard geolocation failures. */
const enhancementSource=preparedSources[jsFiles.indexOf('app-enhancements.js')];
for (const needle of [
  "navigator.permissions.query({name:'geolocation'})",
  "permission.state==='denied'",
  "error?.code===1",
  "error?.code===2",
  "error?.code===3",
  "GPS lookup timed out",
  "Standortzugriff ist deaktiviert"
]) {
  if (!enhancementSource.includes(needle)) throw new Error(`GPS regression gate missing: ${needle}`);
}
console.log('KZ GPS regression gate: permission preflight, error context and multilingual copy passed.');

const bootstrap = String.raw`
(function(){
  if (window.__kzAppInitialized) return;
  window.__kzAppInitialized = true;

  const reportInitError = (label, error) => {
    console.error('[KZ init]', label, error);
    const msg = document.getElementById('weatherMsg');
    if (msg && !msg.classList.contains('error')) {
      msg.textContent = 'Errore inizializzazione app: ' + label + '. Ricarica la pagina.';
      msg.classList.add('error');
    }
  };
  const safe = (label, fn) => {
    try { return fn(); }
    catch (error) { reportInitError(label, error); return undefined; }
  };

  const savedBaseline = (() => {
    try { return JSON.parse(localStorage.getItem('cw_baseline') || '{}') || {}; }
    catch { return {}; }
  })();

  const restoreNumericSelect = (id, scale, fallback) => {
    const el = document.getElementById(id);
    if (!el) return;
    const options = Array.from(el.options).map(o => o.value);
    const raw = savedBaseline[id];
    if (raw != null && options.includes(String(raw))) {
      el.value = String(raw);
      return;
    }
    if (raw != null && Number.isFinite(Number(raw))) {
      el.value = String(nearestNumeric(scale, Number(raw)));
      return;
    }
    if (!el.value) el.value = String(fallback);
  };

  const restoreExactSelect = (id, fallback) => {
    const el = document.getElementById(id);
    if (!el) return;
    const options = Array.from(el.options).map(o => o.value);
    const raw = savedBaseline[id];
    if (raw != null && options.includes(String(raw))) el.value = String(raw);
    else if (!el.value || !options.includes(el.value)) el.value = String(fallback);
  };

  safe('component database', () => initComponentDB());
  safe('baseline', () => {
    loadBaseline();
    restoreNumericSelect('bMain', MAIN_JETS, 180);
    restoreNumericSelect('bIdle', IDLE_KZ, 60);
    restoreNumericSelect('bIdleB', IDLE_B, 48);
    restoreExactSelect('bNeedle', 'K98');
    restoreExactSelect('bAtom', 'DP268');
    restoreExactSelect('bSlide', '50');
  });
  safe('needle geometry', () => {
    loadNeedleGeometry('b');
    loadNeedleGeometry('t');
  });
  safe('track log', () => renderLogs());
  safe('initial calculations', () => {
    calcCorrection();
    compareSetup();
    updateMobileHero();
  });
  safe('default fields', () => {
    const date = document.getElementById('logDate');
    if (date && !date.value) date.value = new Date().toISOString().slice(0,10);
    const low = document.getElementById('egtLow');
    const high = document.getElementById('egtHigh');
    if (low) low.addEventListener('input', () => { const x=document.getElementById('egtLowLabel'); if(x)x.textContent=low.value; });
    if (high) high.addEventListener('input', () => { const x=document.getElementById('egtHighLabel'); if(x)x.textContent=high.value; });
  });
  safe('carburetor listeners', () => {
    document.getElementById('bNeedle')?.addEventListener('change',()=>{loadNeedleGeometry('b');compareSetup();calculateSuggestedSetup()});
    document.getElementById('tNeedle')?.addEventListener('change',()=>{loadNeedleGeometry('t');compareSetup()});
    ['bTemp','bPress','bRh','bMain','bAtom','bIdle','bIdleB','bClip','bAir','bSlide'].forEach(id=>document.getElementById(id)?.addEventListener('change',()=>{calcCorrection();compareSetup()}));
    ['tMain','tAtom','tIdle','tIdleB','tClip','tAir','tSlide'].forEach(id=>document.getElementById(id)?.addEventListener('change',compareSetup));
  });

  if ('serviceWorker' in navigator) {
    window.addEventListener('load',()=>navigator.serviceWorker.register('sw.js').catch(()=>{}),{once:true});
  }
})();
`;

const app = [...preparedSources, bootstrap].join('\n\n');

/* Build gate 3: the exact concatenated browser bundle must parse. */
try { new Function(app); }
catch (error) {
  console.error('KZ bundle JavaScript syntax check failed');
  throw error;
}

const css = (await Promise.all([
  'styles.css',
  'race.css',
  'cloud.css',
  'layout-fixes.css',
  'branding.css'
].map(read))).join('\n\n');

const html = template
  .replace('<!--KZ_UI-->', uiParts.join('\n'))
  .replace('<!--KZ_CSS-->', css)
  .replace('<!--KZ_JS-->', app);

/* Build gate 4: critical controls, i18n selector and startup call must be in final HTML/bundle. */
for (const id of ['bMain','bNeedle','bAtom','bIdle','bIdleB','bSlide','tMain','tNeedle','tAtom','tIdle','tIdleB','tSlide']) {
  if (!html.includes(`id=\"${id}\"`)) throw new Error(`Smoke test: missing #${id}`);
}
if (!app.includes('initComponentDB()')) throw new Error('Smoke test: initComponentDB is not invoked');
if (!app.includes("select.id='languageSelect'")) throw new Error('Smoke test: language selector is not bundled');
if (!app.includes("SUPPORTED=['it','en','es','de']")) throw new Error('Smoke test: IT/EN/ES/DE language set is incomplete');
if (!app.includes('window.KZI18N')) throw new Error('Smoke test: i18n runtime API is not bundled');
if (!app.includes('window.KZNetworkStatus')) throw new Error('Smoke test: network status runtime API is not bundled');

await Promise.all([
  writeFile('dist/index.html', html),
  copyFile('manifest.webmanifest', 'dist/manifest.webmanifest'),
  copyFile('sw.js', 'dist/sw.js')
]);

console.log('KZ CarbWeather build: syntax, runtime select population, i18n, network state, GPS context and structural smoke checks passed.');
