import fs from 'node:fs';
import assert from 'node:assert/strict';

const css=fs.readFileSync(new URL('../layout-fixes.css',import.meta.url),'utf8');
assert.match(css,/@media\s*\(display-mode\s*:\s*standalone\)/,'standalone display-mode guard is required');
assert.match(css,/html,body\s*\{\s*overscroll-behavior-y\s*:\s*none\s*\}/,'installed PWA must suppress vertical overscroll');
console.log('standalone overscroll regression: passed');
