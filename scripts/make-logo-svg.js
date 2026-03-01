'use strict';
const opentype = require('opentype.js');
const fs       = require('fs');
const path     = require('path');

const root     = path.join(__dirname, '..');
const font     = opentype.loadSync(path.join(root, 'fonts/Lora/italic.ttf'));
const fontSize = 36;
const leading  = fontSize * 1.0;  // matches CSS line-height: 1
const pad      = 4;                // breathing room around all edges
const lines    = ["Castle Hayne Jane\u2019s", "Family Farm"];

// ── Pass 1: measure each line at x=0 ─────────────────────────────────────
const baselines = lines.map((_, i) => fontSize + i * leading);
const boxes     = lines.map((text, i) =>
  font.getPath(text, 0, baselines[i], fontSize).getBoundingBox()
);

// Canvas width = widest line + padding on both sides
const lineWidths = boxes.map(b => b.x2 - b.x1);
const maxLineW   = Math.max(...lineWidths);
const W          = maxLineW + pad * 2;
const H          = Math.max(...boxes.map(b => b.y2)) + pad;

// ── Pass 2: render each line centered within W ────────────────────────────
const pathTags = lines.map((text, i) => {
  const bb    = boxes[i];
  const lineW = bb.x2 - bb.x1;
  // Center: (W - lineW) / 2, then subtract bb.x1 to account for any left bearing
  const x     = (W - lineW) / 2 - bb.x1;
  const p     = font.getPath(text, x, baselines[i], fontSize);
  p.fill      = 'currentColor';
  return p.toSVG(2);
}).join('\n  ');

const svg =
`<svg xmlns="http://www.w3.org/2000/svg"
     viewBox="0 0 ${W.toFixed(2)} ${H.toFixed(2)}"
     role="img"
     aria-label="Castle Hayne Jane\u2019s Family Farm">
  <title>Castle Hayne Jane\u2019s Family Farm</title>
  ${pathTags}
</svg>`;

const out = path.join(root, 'media/logo.svg');
fs.writeFileSync(out, svg);
console.log(`Saved: media/logo.svg  (${W.toFixed(1)} \u00d7 ${H.toFixed(1)} viewBox)`);
