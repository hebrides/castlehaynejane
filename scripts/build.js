'use strict';
// Build script: injects the header partial into each HTML page and outputs to _site/.
// Run: node scripts/build.js

const fs   = require('fs');
const path = require('path');

const root    = path.join(__dirname, '..');
const outDir  = path.join(root, '_site');
const partial = path.join(root, 'partials', 'header.html');

// Maps output filename → which nav href should receive id="active"
const pages = {
  'index.html':                'index.html',
  'about.html':                'about.html',
  'contact.html':              'contact.html',
  'events.html':               'events.html',
  'events2.html':              'events.html',
  'events-old.html':           'events.html',
  'support.html':              'support.html',
  'support_happy_camper.html': 'support.html',
  'support_benefactor.html':   'support.html',
  'support_trail_blazer.html': 'support.html',
  'support_angel.html':        'support.html',
  'volunteer.html':            'volunteer.html',
};

const navLinks = [
  'index.html', 'about.html', 'events.html',
  'support.html', 'volunteer.html', 'contact.html',
];

const headerTemplate = fs.readFileSync(partial, 'utf8');

fs.mkdirSync(outDir, { recursive: true });

let built = 0;
for (const [file, activePage] of Object.entries(pages)) {
  const srcPath = path.join(root, file);
  if (!fs.existsSync(srcPath)) continue;

  // Render header: swap each {{active:href}} token for the active page
  let header = headerTemplate;
  for (const href of navLinks) {
    header = header.replace(
      `{{active:${href}}}`,
      href === activePage ? 'id="active"' : ''
    );
  }
  // Clean up the extra space left by empty tokens: <li > → <li>
  header = header.replace(/<li >/g, '<li>');

  const html = fs.readFileSync(srcPath, 'utf8');
  fs.writeFileSync(path.join(outDir, file), html.replace('{{header}}', header.trim()));
  built++;
}

// Copy static asset directories unchanged
function copyDir(src, dest) {
  if (!fs.existsSync(src)) return;
  fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const from = path.join(src, entry.name);
    const to   = path.join(dest, entry.name);
    entry.isDirectory() ? copyDir(from, to) : fs.copyFileSync(from, to);
  }
}

for (const dir of ['css', 'js', 'fonts', 'media']) {
  copyDir(path.join(root, dir), path.join(outDir, dir));
}

console.log(`Build complete → _site/  (${built}/${Object.keys(pages).length} pages)`);
