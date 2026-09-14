import { readFile } from 'node:fs/promises';

const css = await readFile('layout-fixes.css','utf8');
const rule = 'button,a,[role="button"],input,select,textarea{touch-action:manipulation}';
if (!css.includes(rule)) throw new Error('Touch ergonomics regression: manipulation touch action missing from interactive controls');
if (/touch-action\s*:\s*none/.test(css)) throw new Error('Touch ergonomics regression: touch gestures must not be globally disabled');
console.log('KZ touch ergonomics regression: Android-friendly manipulation touch action passed.');
