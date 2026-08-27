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

/*
  app-telemetry.js historically bootstrapped the application at file scope.
  In the single-file bundle that means startup happens before the modules that
  follow it have finished their own initialization. Strip that legacy boot line
  and run one guarded bootstrap after every module has been evaluated.
*/
const preparedSources = jsSources.map((source, index) => {
  if (jsFiles[index] !== 'app-telemetry.js') return source;
  return source
    .split('\n')
    .filter(line => !line.startsWith("$('logDate').value="))
    .join('\n');
});

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

await Promise.all([
  writeFile('dist/index.html', html),
  copyFile('manifest.webmanifest', 'dist/manifest.webmanifest'),
  copyFile('sw.js', 'dist/sw.js')
]);

console.log('KZ CarbWeather build: single HTML runtime generated; guarded end-of-bundle startup enabled.');
