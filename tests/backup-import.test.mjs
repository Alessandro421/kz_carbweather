import { readFile } from 'node:fs/promises';

const source = await readFile('index.html', 'utf8');
const required = [
  'const BACKUP_MAX_BYTES=2*1024*1024;',
  "parsed.schema!=='kz-carbweather-backup'||parsed.version!==1",
  "!isPlainObject(parsed.baseline)||!isPlainObject(parsed.testSetup)||!Array.isArray(parsed.trackLogs)",
  'if(parsed.trackLogs.length>5000)',
  "const oldBaseline=localStorage.getItem('cw_baseline'),oldLogs=localStorage.getItem('cw_logs');",
  "throw Error('Spazio locale insufficiente: il backup precedente è stato mantenuto.');",
  'window.KZBackupImportGuard={validateBackup,maxBytes:BACKUP_MAX_BYTES};'
];

for (const needle of required) {
  if (!source.includes(needle)) throw new Error(`Backup import regression missing: ${needle}`);
}

const validateIndex=source.indexOf('const safe=validateBackup(JSON.parse(text));');
const writeIndex=source.indexOf("localStorage.setItem('cw_baseline',baselineJSON);");
if(validateIndex<0||writeIndex<0||validateIndex>writeIndex)throw new Error('Backup validation must complete before local data is overwritten.');

console.log('KZ backup import regression: size/schema validation, sanitization and rollback protection passed.');
