import { readFile } from 'node:fs/promises';

const html = await readFile('dist/index.html','utf8');
const required = [
  ':where(button,a,summary,input,select,textarea,[tabindex]):focus-visible',
  'outline:3px solid var(--accent,#ffca3a)',
  '@media(prefers-reduced-motion:reduce)'
];
for (const token of required) {
  if (!html.includes(token)) throw new Error(`Accessibility regression: missing ${token}`);
}
console.log('KZ accessibility smoke test: focus-visible and reduced-motion protections passed.');
