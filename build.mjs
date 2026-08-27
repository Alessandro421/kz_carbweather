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
  'i18n.js'
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
const smokeCode = `${preparedSources[jsFiles.indexOf('data.js')]}\n${preparedSources[jsFiles.indexOf('app-core.js')]}\ninitComponentDB();\nreturn {\n  bMain:{value:bMain.value,count:bMain.options.length},\n};`;
/* data/app-core use document.getElementById through $, so inspect via document after execution. */
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

await Promise.all([
  writeFile('dist/index.html', html),
  copyFile('manifest.webmanifest', 'dist/manifest.webmanifest'),
  copyFile('sw.js', 'dist/sw.js')
]);

console.log('KZ CarbWeather build: syntax, runtime select population, i18n and structural smoke checks passed.');
