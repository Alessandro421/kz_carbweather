const tests = [
  './safe-area.test.mjs',
  './accessibility-focus.test.mjs',
  './live-status-accessibility.test.mjs',
  './web-share.test.mjs',
  './backup-import.test.mjs',
  './pwa-launch-handler.test.mjs',
  './touch-ergonomics.test.mjs',
  './color-scheme.test.mjs',
  './sw-navigation-cache.test.mjs',
  './standalone-overscroll.test.mjs',
  './startup-preload-priority.test.mjs'
];
for (const test of tests) await import(test);
console.log(`KZ regression suite: ${tests.length} tests passed.`);
