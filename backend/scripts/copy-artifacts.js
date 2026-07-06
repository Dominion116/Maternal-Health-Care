// tsc only compiles .ts files, so the trained model's JSON data files under
// src/ml (weights/vocab/classes in artifacts/, plus intents.json) never make
// it into dist/. Walk src/ml and copy every .json file to the matching path
// under dist/ml as a build step.
const fs = require('fs');
const path = require('path');

const srcRoot = path.join(__dirname, '..', 'src', 'ml');
const destRoot = path.join(__dirname, '..', 'dist', 'ml');

if (!fs.existsSync(srcRoot)) {
  console.error(`[copy-artifacts] source directory not found: ${srcRoot}`);
  process.exit(1);
}

let copied = 0;

function copyJsonFiles(srcDir, destDir) {
  for (const entry of fs.readdirSync(srcDir, { withFileTypes: true })) {
    const srcPath = path.join(srcDir, entry.name);
    const destPath = path.join(destDir, entry.name);

    if (entry.isDirectory()) {
      copyJsonFiles(srcPath, destPath);
    } else if (entry.name.endsWith('.json')) {
      fs.mkdirSync(destDir, { recursive: true });
      fs.copyFileSync(srcPath, destPath);
      copied += 1;
    }
  }
}

copyJsonFiles(srcRoot, destRoot);

if (copied === 0) {
  console.error(`[copy-artifacts] no .json files found under ${srcRoot} — did "npm run train-model" run?`);
  process.exit(1);
}

console.log(`[copy-artifacts] copied ${copied} JSON file(s) from ${srcRoot} -> ${destRoot}`);
