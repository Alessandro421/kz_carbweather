import { readFile } from 'node:fs/promises';

const manifest = JSON.parse(await readFile('manifest.webmanifest', 'utf8'));

if (manifest.display !== 'standalone') {
  throw new Error(`PWA launch regression: display=${manifest.display}, expected standalone`);
}
if (!manifest.launch_handler || manifest.launch_handler.client_mode !== 'navigate-existing') {
  throw new Error('PWA launch regression: launch_handler.client_mode must be navigate-existing');
}
if (manifest.start_url !== './' || manifest.scope !== './') {
  throw new Error('PWA launch regression: start_url/scope changed unexpectedly');
}

console.log('KZ PWA launch regression: standalone launch reuses the existing app client.');
