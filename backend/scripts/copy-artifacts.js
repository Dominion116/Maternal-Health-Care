// tsc only compiles .ts files, so the trained model's JSON weight files in
// src/ml/artifacts never make it into dist/. Copy them over as a build step.
const fs = require('fs');
const path = require('path');

const src = path.join(__dirname, '..', 'src', 'ml', 'artifacts');
const dest = path.join(__dirname, '..', 'dist', 'ml', 'artifacts');

if (!fs.existsSync(src)) {
  console.error(`[copy-artifacts] source directory not found: ${src}`);
  console.error('[copy-artifacts] run "npm run train-model" first.');
  process.exit(1);
}

fs.cpSync(src, dest, { recursive: true });
console.log(`[copy-artifacts] copied ${src} -> ${dest}`);
