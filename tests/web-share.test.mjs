import { readFile } from 'node:fs/promises';

const source = await readFile('branding.js', 'utf8');
const required = [
  "new File([blob],filename,{type:'image/jpeg'})",
  "navigator.share&&navigator.canShare?.({files:[file]})",
  "await navigator.share({files:[file],title:'KZ CarbWeather',text:t('subtitle')})",
  "if(error?.name==='AbortError')return",
  "download();"
];

for (const needle of required) {
  if (!source.includes(needle)) throw new Error(`Web Share regression missing: ${needle}`);
}

const shareIndex = source.indexOf("navigator.share&&navigator.canShare?.({files:[file]})");
const fallbackIndex = source.indexOf('download();', shareIndex);
if (shareIndex < 0 || fallbackIndex < shareIndex) throw new Error('Web Share fallback must remain after the native share attempt.');

console.log('KZ Web Share regression: native JPEG share, cancel handling and download fallback passed.');
