import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const rootDir = path.join(__dirname, '..');
const publicDir = path.join(rootDir, 'public');
const bookmarkletDest = path.join(publicDir, 'bookmarklet');

const extensionDir = path.join(rootDir, '..', 'snakey-extension');
const extensionAssets = path.join(extensionDir, 'dist', 'chrome', 'assets');

try {
  console.log('Copying bookmarklet assets from extension...');
  if (!fs.existsSync(bookmarkletDest)) {
    fs.mkdirSync(bookmarkletDest, { recursive: true });
  }

  const jsSrc = path.join(extensionAssets, 'index.js');
  const cssSrc = path.join(extensionAssets, 'index.css');

  if (fs.existsSync(jsSrc) && fs.existsSync(cssSrc)) {
    fs.copyFileSync(jsSrc, path.join(bookmarkletDest, 'index.js'));
    fs.copyFileSync(cssSrc, path.join(bookmarkletDest, 'index.css'));
    console.log('Successfully copied bookmarklet assets to public/bookmarklet!');
  } else {
    console.warn('Warning: Extension assets not found. Please build the extension first in "../snakey-extension".');
  }
} catch (error) {
  console.error('Failed to copy bookmarklet assets:', error);
}
