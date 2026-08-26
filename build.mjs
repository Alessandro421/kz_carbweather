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

if (!template.includes('<!--KZ_UI-->')) {
  throw new Error('index.html: marker <!--KZ_UI--> missing');
}

const html = template.replace('<!--KZ_UI-->', uiParts.join('\n'));
const app = (await Promise.all([
  'data.js',
  'app-core.js',
  'app-telemetry.js',
  'race-ui.js',
  'cloud.js'
].map(read))).join('\n\n');
const css = (await Promise.all([
  'styles.css',
  'race.css',
  'cloud.css'
].map(read))).join('\n\n');

await Promise.all([
  writeFile('dist/index.html', html),
  writeFile('dist/app.js', app),
  writeFile('dist/styles.css', css),
  copyFile('manifest.webmanifest', 'dist/manifest.webmanifest'),
  copyFile('sw.js', 'dist/sw.js')
]);

console.log(`KZ CarbWeather build: ${uiParts.length} UI fragments -> index.html; 5 JS sources -> app.js; 3 CSS sources -> styles.css`);
