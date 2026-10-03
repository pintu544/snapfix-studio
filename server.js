// SnapFix Studio — static file server for Railway.
// Serves the Vite build output in ./dist on process.env.PORT (Railway injects it).
// Uses the `serve` package's local binary; falls back with a clear error.

import { spawn } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import fs from 'node:fs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dist = path.join(__dirname, 'dist');

if (!fs.existsSync(dist)) {
  console.error('dist/ not found — run `npm run build` first.');
  process.exit(1);
}

const port = process.env.PORT || 3000;
const bin = path.join(__dirname, 'node_modules', '.bin', 'serve');

const child = spawn(bin, ['-s', 'dist', '-l', String(port)], { stdio: 'inherit' });
child.on('error', (err) => {
  console.error('Failed to start static server:', err.message);
  process.exit(1);
});
child.on('exit', (code) => process.exit(code ?? 1));
