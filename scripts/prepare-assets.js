import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const rootDir = path.join(__dirname, '..');
const publicDir = path.join(rootDir, 'public');

// 1. Copy bookmarklet assets
const bookmarkletDest = path.join(publicDir, 'bookmarklet');
const extensionDir = path.join(rootDir, '..', 'snakey-extension');
const extensionChromeAssets = path.join(extensionDir, 'dist', 'chrome', 'assets');

try {
  console.log('Copying bookmarklet assets from extension...');
  if (!fs.existsSync(bookmarkletDest)) {
    fs.mkdirSync(bookmarkletDest, { recursive: true });
  }

  const jsSrc = path.join(extensionChromeAssets, 'index.js');
  const cssSrc = path.join(extensionChromeAssets, 'index.css');

  if (fs.existsSync(jsSrc) && fs.existsSync(cssSrc)) {
    fs.copyFileSync(jsSrc, path.join(bookmarkletDest, 'index.js'));
    fs.copyFileSync(cssSrc, path.join(bookmarkletDest, 'index.css'));
    console.log('Successfully copied bookmarklet assets to public/bookmarklet!');
  } else {
    console.warn('Warning: Extension chrome assets not found. Please build the extension first in "../snakey-extension".');
  }
} catch (error) {
  console.error('Failed to copy bookmarklet assets:', error);
}

// 2. Package extensions into ZIP files
const extensionDest = path.join(publicDir, 'extension');
try {
  console.log('Packaging browser extensions into ZIP files...');
  if (!fs.existsSync(extensionDest)) {
    fs.mkdirSync(extensionDest, { recursive: true });
  }

  const chromeDist = path.join(extensionDir, 'dist', 'chrome');
  const firefoxDist = path.join(extensionDir, 'dist', 'firefox');

  if (fs.existsSync(chromeDist)) {
    console.log('Zipping Chrome extension...');
    const zipChromeCmd = `cd ${chromeDist} && zip -r ${path.join(extensionDest, 'snakey-chrome.zip')} .`;
    execSync(zipChromeCmd, { stdio: 'inherit' });
    console.log('Chrome extension zipped successfully to public/extension/snakey-chrome.zip');
  } else {
    console.warn('Warning: Chrome build dist/chrome not found.');
  }

  if (fs.existsSync(firefoxDist)) {
    console.log('Zipping Firefox extension...');
    const zipFirefoxCmd = `cd ${firefoxDist} && zip -r ${path.join(extensionDest, 'snakey-firefox.zip')} .`;
    execSync(zipFirefoxCmd, { stdio: 'inherit' });
    console.log('Firefox extension zipped successfully to public/extension/snakey-firefox.zip');
  } else {
    console.warn('Warning: Firefox build dist/firefox not found.');
  }
} catch (error) {
  console.error('Failed to package extensions:', error);
}
