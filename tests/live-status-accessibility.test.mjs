import fs from 'node:fs';
import assert from 'node:assert/strict';

const html=fs.readFileSync(new URL('../index.html',import.meta.url),'utf8');
assert.match(html,/getElementById\('weatherMsg'\)/,'weather status target missing');
assert.match(html,/setAttribute\('role','status'\)/,'weather status role missing');
assert.match(html,/setAttribute\('aria-live','polite'\)/,'polite live region missing');
assert.match(html,/setAttribute\('aria-atomic','true'\)/,'atomic live region missing');
console.log('live status accessibility regression passed');
