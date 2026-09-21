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
console.log('KZ startup preload priority regression passed.');
