import { readFile } from 'node:fs/promises';
import assert from 'node:assert/strict';

const html = await readFile('dist/index.html', 'utf8');
const preloads = [...html.matchAll(/<link\s+rel="preload"[^>]+as="script"[^>]*>/g)].map(match => match[0]);
assert.equal(preloads.length, 2, 'expected exactly two startup script preloads');
for (const preload of preloads) {
  assert.match(preload, /fetchpriority="high"/, 'startup script preload must retain high fetch priority');
}
assert.ok(preloads.some(tag => tag.includes('jszip@3.10.1/dist/jszip.min.js')), 'JSZip preload missing');
assert.ok(preloads.some(tag => tag.includes('@supabase/supabase-js@2')), 'Supabase preload missing');

const startupScripts = [...html.matchAll(/<script\s+src="https:\/\/cdn\.jsdelivr\.net\/npm\/(?:jszip@3\.10\.1\/dist\/jszip\.min\.js|@supabase\/supabase-js@2)"[^>]*><\/script>/g)].map(match => match[0]);
assert.equal(startupScripts.length, 2, 'expected both startup dependency script tags');
for (const script of startupScripts) {
  assert.match(script, /fetchpriority="high"/, 'startup dependency script must retain high fetch priority');
}
console.log('KZ startup preload/script priority regression passed.');
