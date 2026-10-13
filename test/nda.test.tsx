import assert from 'node:assert/strict';
import { test } from 'node:test';
import ExampleNDA from '../examples/legal/example-nda.js';
import { collectRequests, insertedText } from './helpers.js';

test('the NDA fixture still compiles to styled clauses and a signature table', async () => {
  const requests = await collectRequests(ExampleNDA({}));
  const text = insertedText(requests).join('\n');
  const table = requests.find((request) => request.insertTable)?.insertTable;

  assert.match(text, /Mutual Non-Disclosure Agreement/);
  assert.match(text, /Tech Solutions Ltd/);
  assert.match(text, /Innovation Corp/);
  assert.match(text, /Confidential Information/);
  assert.equal(table?.rows, 4);
  assert.equal(table?.columns, 2);
  assert.ok(requests.some((request) => request.updateTextStyle?.textStyle?.bold));
  assert.ok(requests.some((request) => request.updateParagraphStyle?.paragraphStyle?.alignment === 'JUSTIFIED'));
});
