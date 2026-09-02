import { readFile } from 'node:fs/promises';

const [html, css] = await Promise.all([
  readFile('index.html', 'utf8'),
  readFile('styles.css', 'utf8')
]);

if (!html.includes('viewport-fit=cover')) {
  throw new Error('Safe-area regression: viewport-fit=cover is missing');
}

for (const side of ['top', 'right', 'bottom', 'left']) {
  if (!css.includes(`env(safe-area-inset-${side})`)) {
    throw new Error(`Safe-area regression: safe-area-inset-${side} is missing`);
  }
}

if (!css.includes('.toastStack') || !css.includes('.appModalOverlay')) {
  throw new Error('Safe-area regression: fixed overlays are not covered');
}

console.log('KZ safe-area regression: viewport, content, toast and modal safe zones passed.');
