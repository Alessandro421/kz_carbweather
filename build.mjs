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
  'branding.js'
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

/* Build gate 2: the exact concatenated browser bundle must parse. */
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

/* Build gate 3: critical controls and startup call must be in final HTML. */
for (const id of ['bMain','bNeedle','bAtom','bIdle','bIdleB','bSlide','tMain','tNeedle','tAtom','tIdle','tIdleB','tSlide']) {
  if (!html.includes(`id=\"${id}\"`)) throw new Error(`Smoke test: missing #${id}`);
}
if (!app.includes('initComponentDB()')) throw new Error('Smoke test: initComponentDB is not invoked');

await Promise.all([
  writeFile('dist/index.html', html),
  copyFile('manifest.webmanifest', 'dist/manifest.webmanifest'),
  copyFile('sw.js', 'dist/sw.js')
]);

console.log('KZ CarbWeather build: all JS syntax and structural smoke checks passed.');
