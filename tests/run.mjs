const tests = [
  './safe-area.test.mjs',
  './accessibility-focus.test.mjs',
  './web-share.test.mjs',
  './backup-import.test.mjs',
  './pwa-launch-handler.test.mjs',
  './touch-ergonomics.test.mjs',
  './color-scheme.test.mjs'
];
for (const test of tests) await import(test);
console.log(`KZ regression suite: ${tests.length} tests passed.`);
