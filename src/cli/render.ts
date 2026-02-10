import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { spawn } from 'child_process';
import { authenticate } from '../google/auth.js';
import { GoogleDocsClient } from '../google/client.js';
import { GDocRenderer } from '../renderer/GDocRenderer.js';
import React from 'react';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

interface ParsedArgs {
  file: string;
  documentId?: string;
  title?: string;
  componentArgs: string[];
  debug: boolean;
}

function openInBrowser(url: string) {
  const platform = process.platform;

  let command: string;
  let args: string[];

  if (platform === 'win32') {
    command = 'cmd';
    args = ['/c', 'start', '', url];
  } else if (platform === 'darwin') {
    command = 'open';
    args = [url];
  } else {
    command = 'xdg-open';
    args = [url];
  }

  const child = spawn(command, args, { stdio: 'ignore', detached: true });
  child.on('error', (err) => {
    console.error('Failed to open browser:', err);
  });
  child.unref();
}

function stripQuotes(value: string): string {
  return value.replace(/^["']|["']$/g, '');
}

function extractFlagValue(args: string[], i: number, flagName: string): { value: string; nextIndex: number } | null {
  const arg = args[i];
  const flagWithEquals = `--${flagName}=`;
  
  if (arg.startsWith(flagWithEquals)) {
    return {
      value: stripQuotes(arg.substring(flagWithEquals.length)),
      nextIndex: i + 1
    };
  }
  
  if (arg === `--${flagName}`) {
    if (i + 1 >= args.length) {
      console.error(`Error: --${flagName} requires a value`);
      process.exit(1);
    }
    return {
      value: stripQuotes(args[i + 1]),
      nextIndex: i + 2
    };
  }
  
  return null;
}

function printUsage(): never {
  console.error('Usage: npm run render <path-to-tsx-file> [document-id] [--title=<title>] [--debug] [--args <arg1> <arg2> ...]');
  console.error('');
  console.error('Arguments:');
  console.error('  <path-to-tsx-file>     Required: Path to the TSX file to render');
  console.error('  [document-id]           Optional: Google Docs document ID (if provided, document will be updated)');
  console.error('  --title=<title>         Optional: Document title (only used when creating new document)');
  console.error('  --debug                 Optional: Enable debug logging');
  console.error('  --args <arg1> <arg2>    Optional: Component arguments (everything after --args is passed to the component)');
  console.error('');
  console.error('Examples:');
  console.error('  npm run render src/legal/example-contract.tsx');
  console.error('  npm run render src/legal/example-contract.tsx DOC_ID');
  console.error('  npm run render src/legal/example-contract.tsx DOC_ID --title="My Document"');
  console.error('  npm run render src/legal/example-contract.tsx DOC_ID --debug');
  console.error('  npm run render src/legal/example-contract.tsx DOC_ID --args 2');
  process.exit(1);
}

function parseArgs(args: string[]): ParsedArgs {
  if (args.length === 0) {
    printUsage();
  }

  const parsed: ParsedArgs = {
    file: args[0],
    componentArgs: [],
    debug: false
  };

  let i = 1;
  while (i < args.length) {
    const arg = args[i];
    if (arg === '--debug') {
      parsed.debug = true;
      i += 1;
      continue;
    }
    
    const titleResult = extractFlagValue(args, i, 'title');
    if (titleResult) {
      parsed.title = titleResult.value;
      i = titleResult.nextIndex;
      continue;
    }
    
    if (arg === '--args') {
      parsed.componentArgs = args.slice(i + 1);
      break;
    }
    
    if (!parsed.documentId && !arg.startsWith('--')) {

      parsed.documentId = arg;
      i += 1;
      continue;
    }
    
    console.error(`Error: Unknown argument "${arg}"`);
    process.exit(1);
  }

  return parsed;
}

export async function runRenderFromArgs(args: ParsedArgs): Promise<string> {
  const tsxPath = resolve(process.cwd(), args.file);
  
  if (!tsxPath.endsWith('.tsx')) {
    console.error('Error: File must be a .tsx file');
    process.exit(1);
  }

  console.log(`Parsed arguments:`);
  console.log(`  File: ${args.file}`);
  console.log(`  Document ID: ${args.documentId || '(not provided)'}`);
  console.log(`  Title: ${args.title || '(not provided)'}`);
  console.log(`  Debug: ${args.debug}`);
  console.log(`  Component args: ${args.componentArgs.length > 0 ? JSON.stringify(args.componentArgs) : '(none)'}`);
  console.log(`Loading TSX file: ${tsxPath}`);
  
  let tsxContent: string;
  try {
    tsxContent = readFileSync(tsxPath, 'utf-8');
  } catch (error) {
    console.error(`Error reading file: ${error}`);
    process.exit(1);
  }

  console.log('Authenticating with Google...');
  const auth = await authenticate();
  const client = new GoogleDocsClient(auth);

  console.log('Rendering JSX to Google Docs requests...');
  
  try {
    const moduleUrl = `file://${tsxPath}?t=${Date.now()}`;
    const module = await import(moduleUrl);
    const DocumentComponent = module.default;
    
    if (!DocumentComponent) {
      throw new Error('TSX file must export a default component');
    }

    let element: React.ReactElement;
    if (typeof DocumentComponent === 'function') {
      const props: Record<string, any> = {
        args: args.componentArgs
      };
      
      console.log(`Component props: ${JSON.stringify(props)}`);
      
      const result = DocumentComponent(props);
      if (React.isValidElement(result)) {
        element = result;
      } else {
        throw new Error('Component must return a React element');
      }
    } else if (React.isValidElement(DocumentComponent)) {
      element = DocumentComponent;
    } else {
      throw new Error('Default export must be a React component or element');
    }

    let finalDocumentId: string;
    let replaceRange: { startIndex: number, endIndex: number } | null = null;

    if (args.documentId) {
      console.log(`Updating existing document: ${args.documentId}`);

      const document = await client.getDocument(args.documentId);
      if (!document) {
        console.error('Error: Document not found');
        process.exit(1);
      }
      const endIndex = document.body?.content?.[document.body.content.length - 1]?.endIndex;
      if (!endIndex) {
        console.error('Error: End index not found');
        process.exit(1);
      }
      replaceRange = { startIndex: 1, endIndex: endIndex - 1 };

      finalDocumentId = args.documentId;
    } else {
      const title = args.title || `Document ${new Date().toISOString()}`;
      console.log(`Creating new document: ${title}`);
      finalDocumentId = await client.createDocument(title);
      console.log(`Document created with ID: ${finalDocumentId}`);
    }

    const renderer = new GDocRenderer(
      async (requests) => { await client.batchUpdate(finalDocumentId, requests); },
      async () => { return await client.getDocument(finalDocumentId); },
      args.debug
    );

    console.log('Starting render...');
    const renderStartTime = Date.now();
    await renderer.render(element, replaceRange);
    const renderEndTime = Date.now();
    const renderDuration = renderEndTime - renderStartTime;
    console.log(`Render completed in ${renderDuration}ms (${(renderDuration / 1000).toFixed(2)}s)`);

    const documentUrl = `https://docs.google.com/document/d/${finalDocumentId}/edit`;
    console.log(`Document ${args.documentId ? 'updated' : 'created'} successfully!`);
    console.log(`View at: ${documentUrl}`);

    if (!args.documentId) {
      console.log('Opening document in browser...');
      openInBrowser(documentUrl);
    }

    return finalDocumentId;
  } catch (error) {
    console.error('Error rendering document:', error);
    process.exit(1);
  }
}

export async function runRenderFromRawArgs(rawArgs: string[], overrideDocumentId?: string): Promise<string> {
  const args = parseArgs(rawArgs);

  if (overrideDocumentId && !args.documentId) {
    args.documentId = overrideDocumentId;
  }

  return await runRenderFromArgs(args);
}

async function main() {
  const rawArgs = process.argv.slice(2);
  await runRenderFromRawArgs(rawArgs);
}

if (process.argv[1] === __filename) {
  main().catch(console.error);
}

