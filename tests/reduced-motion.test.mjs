import { readFile } from 'node:fs/promises';
import assert from 'node:assert/strict';
const css=await readFile('branding.css','utf8');
assert.match(css,/@media\(prefers-reduced-motion:reduce\)/,'reduced-motion media query missing');
console.log('KZ reduced-motion regression passed.');
