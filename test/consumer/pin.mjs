import { readFileSync, writeFileSync } from 'node:fs';

const sha = process.argv[2];
if (!sha || !/^[0-9a-f]{40}$/i.test(sha)) {
  console.error('Usage: node pin.mjs <40-character commit sha already on GitHub>');
  console.error('Do not invent a SHA. npm install fails while the dependency is PENDING_PUSH.');
  process.exit(1);
}

const packageUrl = new URL('./package.json', import.meta.url);
const pkg = JSON.parse(readFileSync(packageUrl, 'utf8'));
pkg.dependencies['react-gdoc'] = `github:janosbreuer/react-gdoc#${sha.toLowerCase()}`;
writeFileSync(packageUrl, `${JSON.stringify(pkg, null, 2)}\n`);
console.log(pkg.dependencies['react-gdoc']);
console.log('Next: npm install');
console.log('Commit that pin in a follow-up commit. It should point at the library commit, not at the pin commit itself.');
