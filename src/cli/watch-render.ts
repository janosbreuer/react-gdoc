import { watchFile } from 'fs';
import { resolve } from 'path';
import { runRenderFromRawArgs } from './render.js';

function printUsage(): never {
  console.error('Usage: npm run render:watch <path-to-tsx-file> [document-id] [--title=<title>] [--debug] [--args <arg1> <arg2> ...]');
  console.error('');
  console.error('Arguments:');
  console.error('  <path-to-tsx-file>     Required: Path to the TSX file to render and watch');
  console.error('  [document-id]           Optional: Google Docs document ID (if provided, document will be updated)');
  console.error('  --title=<title>         Optional: Document title (only used when creating new document)');
  console.error('  --debug                 Optional: Enable debug logging');
  console.error('  --args <arg1> <arg2>    Optional: Component arguments (everything after --args is passed to the component)');
  console.error('');
  console.error('Example:');
  console.error('  npm run render:watch examples/legal/example-nda.tsx DOC_ID --args 2');
  process.exit(1);
}

async function main() {
  const rawArgs = process.argv.slice(2);

  if (rawArgs.length === 0) {
    printUsage();
  }

  const tsxFileArg = rawArgs[0];
  const tsxPath = resolve(process.cwd(), tsxFileArg);

  console.log(`Initial render for: ${tsxFileArg}`);

  let currentDocumentId: string | undefined;

  try {
    currentDocumentId = await runRenderFromRawArgs(rawArgs);
    console.log('Initial render finished.');
  } catch (error) {
    console.error('Initial render failed:', error);
  }

  console.log(`Watching TSX file: ${tsxPath}`);
  console.log('Debounce: 1000ms');
  console.log('Press Ctrl+C to stop.');

  let debounceTimer: NodeJS.Timeout | null = null;
  let isRendering = false;
  let pendingRender = false;

  async function runDebouncedRender() {
    if (isRendering) {
      pendingRender = true;
      return;
    }

    isRendering = true;
    try {
      currentDocumentId = await runRenderFromRawArgs(rawArgs, currentDocumentId);
      console.log('Render finished.');
    } catch (error) {
      console.error('Render failed:', error);
    } finally {
      isRendering = false;
      if (pendingRender) {
        pendingRender = false;
        scheduleRender();
      }
    }
  }

  function scheduleRender() {
    if (isRendering) {
      pendingRender = true;
      console.log('Change detected during render, will run again after current render finishes.');
      return;
    }

    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }

    console.log('Change detected, scheduling render in 1s...');
    debounceTimer = setTimeout(() => {
      console.log('Starting debounced render...');
      void runDebouncedRender();
    }, 1000);
  }

  watchFile(tsxPath, { interval: 500 }, (curr, prev) => {
    if (curr.mtimeMs !== prev.mtimeMs) {
      scheduleRender();
    }
  });
}

main().catch((error) => {
  console.error('Unexpected error in watch-render:', error);
});


