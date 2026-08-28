import fs from 'node:fs';

const src=fs.readFileSync(new URL('../cloud.js',import.meta.url),'utf8');

const pullMatch=src.match(/async function pullBaselineCloud\(\)\{([\s\S]*?)\n\}/);
if(!pullMatch) throw new Error('pullBaselineCloud not found');
const pullBody=pullMatch[1];
if(!/if\(!cloudUser\)return false;/.test(pullBody)) throw new Error('pullBaselineCloud must return false when logged out');
if(!/const \{data,error\}=await cloud\.from\('baselines'\)/.test(pullBody)) throw new Error('pullBaselineCloud must capture Supabase errors');
if(!/if\(error\)throw error;/.test(pullBody)) throw new Error('pullBaselineCloud must throw on read errors');
if(!/if\(!data\?\.data\)return false;/.test(pullBody)) throw new Error('pullBaselineCloud must distinguish missing cloud baseline');
if(!/return true;/.test(pullBody)) throw new Error('pullBaselineCloud must report successful cloud restore');

const syncMatch=src.match(/async function syncAllCloud\(\)\{([\s\S]*?)\n\}/);
if(!syncMatch) throw new Error('syncAllCloud not found');
const syncBody=syncMatch[1];
const pullPos=syncBody.indexOf('await pullBaselineCloud()');
const savePos=syncBody.indexOf('await saveBaselineCloud()');
if(pullPos<0||savePos<0||pullPos>savePos) throw new Error('syncAllCloud must pull before fallback save');
if(!/const hasCloudBaseline=await pullBaselineCloud\(\);\s*if\(!hasCloudBaseline\)await saveBaselineCloud\(\);/.test(syncBody)) throw new Error('syncAllCloud must save local baseline only when cloud baseline is absent');

if(!/window\.saveBaseline=function\(\)\{[^}]*saveBaselineCloud\(\)/.test(src)) throw new Error('explicit Salva baseline must still persist to cloud');

console.log('baseline cloud sync regression: OK');
