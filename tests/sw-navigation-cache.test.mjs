import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const sw=await readFile(new URL('../sw.js',import.meta.url),'utf8');
assert.match(sw,/const CACHE='kz-carbweather-v2\.4-appshell'/,'service-worker cache version must advance');
assert.match(sw,/ASSETS\.map\(asset=>new Request\(asset,\{cache:'reload'\}\)\)/,'install should bypass the HTTP cache when refreshing the app shell');
assert.match(sw,/const isNavigation=e\.request\.mode==='navigate'/,'navigation requests should be identified once');
assert.match(sw,/e\.preloadResponse\.catch\(\(\)=>undefined\)\.then\(r=>r\|\|fetch\(e\.request\)\)/,'a failed navigation preload should fall back to a normal network fetch before offline cache');
assert.match(sw,/c\.put\(isNavigation\?'\.\/index\.html':e\.request,copy\)/,'successful navigations should refresh the canonical app shell instead of creating URL variants');
assert.match(sw,/if\(isNavigation\)return cache\.match\('\.\/index\.html'\)/,'offline navigation should resolve to the canonical cached app shell');
console.log('Service-worker navigation cache regression: passed.');
