import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { GDocRenderer } from '../renderer/GDocRenderer.js';
import React from 'react';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * Debug script a komponens összeállítás teszteléséhez.
 * Kiírja a virtual node struktúrát és a generált request-eket.
 */
async function main() {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    console.error('Usage: npm run debug-render <path-to-tsx-file>');
    process.exit(1);
  }

  const tsxPath = resolve(process.cwd(), args[0]);
  
  if (!tsxPath.endsWith('.tsx')) {
    console.error('Error: File must be a .tsx file');
    process.exit(1);
  }

  console.log(`Loading TSX file: ${tsxPath}`);
  
  let tsxContent: string;
  try {
    tsxContent = readFileSync(tsxPath, 'utf-8');
  } catch (error) {
    console.error(`Error reading file: ${error}`);
    process.exit(1);
  }

  try {
    const module = await import(`file://${tsxPath}`);
    const DocumentComponent = module.default;
    
    if (!DocumentComponent) {
      throw new Error('TSX file must export a default component');
    }

    let element: React.ReactElement;
    if (typeof DocumentComponent === 'function') {
      const result = DocumentComponent({});
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

    console.log('\n=== React Element Structure ===');
    console.log(JSON.stringify(element, (key, value) => {
      if (key === 'type' && typeof value === 'function') {
        return value.name || 'Function';
      }
      if (key === '_owner' || key === '_store') {
        return undefined;
      }
      return value;
    }, 2));

    const renderer = new GDocRenderer();
    const requests = renderer.render(element);
    
    console.log(`\n=== Generated ${requests.length} requests ===`);
    
    requests.forEach((request, index) => {
      console.log(`\nRequest ${index}:`);
      console.log(JSON.stringify(request, null, 2));
    });

    if (requests.length === 0) {
      console.warn('\n⚠️  Warning: No requests generated!');
    }

    // Számoljuk meg a különböző típusú request-eket
    const requestTypes: Record<string, number> = {};
    requests.forEach(req => {
      const type = Object.keys(req)[0];
      requestTypes[type] = (requestTypes[type] || 0) + 1;
    });

    console.log('\n=== Request Summary ===');
    Object.entries(requestTypes).forEach(([type, count]) => {
      console.log(`${type}: ${count}`);
    });

  } catch (error) {
    console.error('Error rendering document:', error);
    process.exit(1);
  }
}

main().catch(console.error);

