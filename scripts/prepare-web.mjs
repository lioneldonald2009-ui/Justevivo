import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const out = path.join(root, 'www');
const excluded = new Set([
  '.git', '.github', 'node_modules', 'www', 'android', 'ios',
  'dist', 'coverage', '.DS_Store'
]);

fs.rmSync(out, { recursive: true, force: true });
fs.mkdirSync(out, { recursive: true });

function copyDirectory(source, destination) {
  for (const entry of fs.readdirSync(source, { withFileTypes: true })) {
    if (excluded.has(entry.name)) continue;
    const from = path.join(source, entry.name);
    const to = path.join(destination, entry.name);
    if (entry.isDirectory()) {
      fs.mkdirSync(to, { recursive: true });
      copyDirectory(from, to);
    } else if (entry.isFile()) {
      fs.copyFileSync(from, to);
    }
  }
}

copyDirectory(root, out);
if (!fs.existsSync(path.join(out, 'index.html'))) {
  throw new Error('index.html is missing: cannot prepare the Capacitor web bundle.');
}
console.log('JUSTEVIVO web assets prepared in ./www');
