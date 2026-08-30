import { copyFile, mkdir, readFile } from 'node:fs/promises';

const assets=[
  {src:'icons/icon-192.png',size:192,purpose:'any'},
  {src:'icons/icon-512.png',size:512,purpose:'any maskable'}
];

const manifest=JSON.parse(await readFile('manifest.webmanifest','utf8'));
const manifestIcons=Array.isArray(manifest.icons)?manifest.icons:[];

for(const asset of assets){
  const icon=manifestIcons.find(x=>x.src===asset.src);
  if(!icon)throw new Error(`PWA icon missing from manifest: ${asset.src}`);
  if(icon.sizes!==`${asset.size}x${asset.size}`)throw new Error(`PWA icon size metadata mismatch: ${asset.src}`);
  if(icon.type!=='image/png')throw new Error(`PWA icon MIME mismatch: ${asset.src}`);
  if(icon.purpose!==asset.purpose)throw new Error(`PWA icon purpose mismatch: ${asset.src}`);

  const png=await readFile(asset.src);
  if(png.length<24||png.toString('ascii',1,4)!=='PNG')throw new Error(`Invalid PNG: ${asset.src}`);
  const width=png.readUInt32BE(16),height=png.readUInt32BE(20);
  if(width!==asset.size||height!==asset.size)throw new Error(`PWA icon dimensions mismatch: ${asset.src} is ${width}x${height}`);
}

const sw=await readFile('sw.js','utf8');
for(const asset of assets){
  if(!sw.includes(`'./${asset.src}'`))throw new Error(`PWA icon missing from service-worker precache: ${asset.src}`);
}

await mkdir('dist/icons',{recursive:true});
await Promise.all(assets.map(x=>copyFile(x.src,`dist/${x.src}`)));
console.log('KZ PWA asset gate: Android 192/512 PNG icons, maskable metadata and offline precache passed.');
