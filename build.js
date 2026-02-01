const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const browsers = ['chrome', 'firefox'];
const distDir = path.join(__dirname, 'dist');

// Files to include in build
const files = [
  'popup.html',
  'popup.js',
  'content.js',
  'browser-polyfill.js',
  'icons'
];

// Clean and create dist directory
if (fs.existsSync(distDir)) {
  fs.rmSync(distDir, { recursive: true });
}
fs.mkdirSync(distDir);

browsers.forEach(browser => {
  const browserDir = path.join(distDir, browser);
  fs.mkdirSync(browserDir);

  // Copy manifest
  const manifestSrc = path.join(__dirname, `manifest.${browser}.json`);
  const manifestDest = path.join(browserDir, 'manifest.json');
  fs.copyFileSync(manifestSrc, manifestDest);

  // Copy common files
  files.forEach(file => {
    const src = path.join(__dirname, file);
    const dest = path.join(browserDir, file);

    if (fs.existsSync(src)) {
      if (fs.statSync(src).isDirectory()) {
        copyDir(src, dest);
      } else {
        fs.copyFileSync(src, dest);
      }
    }
  });

  console.log(`Built ${browser} extension in dist/${browser}/`);
});

function copyDir(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  const entries = fs.readdirSync(src);

  entries.forEach(entry => {
    const srcPath = path.join(src, entry);
    const destPath = path.join(dest, entry);

    if (fs.statSync(srcPath).isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  });
}

console.log('\nBuild complete!');
console.log('- dist/chrome/ -> Upload to Chrome Web Store, Edge Add-ons, Opera Add-ons');
console.log('- dist/firefox/ -> Upload to Firefox Add-ons');
