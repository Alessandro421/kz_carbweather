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

const app = (await Promise.all([
  'data.js',
  'tracks.js',
  'app-core.js',
  'app-telemetry.js',
  'race-ui.js',
  'cloud.js',
  'app-enhancements.js',
  'branding.js'
].map(read))).join('\n\n');

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

console.log('KZ CarbWeather build: single HTML runtime generated; track DB, cloud sync, compact branding and auth redirect handling included.');
