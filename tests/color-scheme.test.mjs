import { readFile } from 'node:fs/promises';

const html = await readFile('dist/index.html','utf8');
if (!html.includes('<meta name="color-scheme" content="dark">')) throw new Error('Color scheme regression: native dark scheme metadata missing');
if (!html.includes('<meta name="theme-color" content="#050607">')) throw new Error('Color scheme regression: app theme color missing');
console.log('KZ color scheme regression: Android/native dark controls metadata passed.');
