import { spawn } from 'child_process';
import { writeFileSync, existsSync } from 'fs';
import { resolve, relative } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const args = process.argv.slice(2);

if (args.length === 0) {
  console.error('Usage: npm run preview <example-file.tsx>');
  console.error('Example: npm run preview examples/legal/example-nda.tsx');
  process.exit(1);
}

const exampleFile = args[0];
const examplePath = resolve(process.cwd(), exampleFile);

if (!existsSync(examplePath)) {
  console.error(`Error: File not found: ${exampleFile}`);
  process.exit(1);
}

const projectRoot = resolve(__dirname, '../..');
const relativeExamplePath = relative(projectRoot, examplePath).replace(/\\/g, '/');

const entryContent = `
import React from 'react';
import ReactDOM from 'react-dom/client';
import ExampleDoc from '../${relativeExamplePath}';
import './styles/globals.css';

const root = document.getElementById('root');

if (root) {
  ReactDOM.createRoot(root).render(
    <React.StrictMode>
      <div className="gdoc-page">
        <ExampleDoc />
      </div>
    </React.StrictMode>
  );
} else {
  console.error('Root element not found!');
}
`;

const entryPath = resolve(projectRoot, 'preview/.preview-entry.tsx');
writeFileSync(entryPath, entryContent, 'utf-8');

console.log(`\n📄 Preview: ${exampleFile}\n`);

const viteProcess = spawn('npx', ['vite'], {
  cwd: resolve(projectRoot, 'preview'),
  stdio: 'inherit',
  shell: true,
});

viteProcess.on('exit', (code) => {
  process.exit(code || 0);
});

