import assert from 'node:assert/strict';
import { test } from 'node:test';
import React from 'react';
import * as api from '../src/index.js';
import { Heading1, P, renderDocument, type DocsClient, type Request } from '../src/index.js';

test('root export exposes the supported API and hides authentication and unfinished components', () => {
  assert.equal(typeof api.renderDocument, 'function');
  assert.equal(typeof api.Heading1, 'function');
  assert.equal(typeof api.P, 'function');
  assert.equal(typeof api.S, 'function');
  assert.equal(typeof api.Table, 'function');
  assert.equal(typeof api.GDocument, 'function');
  assert.equal('authenticate' in api, false);
  assert.equal('GPageBreak' in api, false);
  assert.equal('GImage' in api, false);
  assert.equal('GSectionBreak' in api, false);
});

test('creates a document and returns its id', async () => {
  const calls: string[] = [];
  const client: DocsClient = {
    async createDocument(title) {
      calls.push(`create:${title}`);
      return 'doc-created';
    },
    async batchUpdate(documentId, requests) {
      calls.push(`batch:${documentId}:${requests.length}`);
    },
    async getDocument() {
      calls.push('get');
      return { body: { content: [] } };
    },
  };

  const result = await renderDocument(<Heading1>Hello</Heading1>, {
    client,
    title: 'Created title',
  });

  assert.equal(result.documentId, 'doc-created');
  assert.equal(calls[0], 'create:Created title');
  assert.equal(calls.some((call) => call.startsWith('batch:doc-created:')), true);
  assert.equal(calls.includes('get'), false);
});

test('replaces an existing document body and does not create one', async () => {
  const batches: Request[][] = [];
  let created = false;
  const client: DocsClient = {
    async createDocument() {
      created = true;
      return 'should-not-create';
    },
    async batchUpdate(_documentId, requests) {
      batches.push(requests);
    },
    async getDocument() {
      return { body: { content: [{ endIndex: 12, startIndex: 0 }] } };
    },
  };

  const result = await renderDocument(<P>Updated</P>, {
    client,
    documentId: 'doc-existing',
    title: 'Ignored',
  });

  assert.equal(created, false);
  assert.equal(result.documentId, 'doc-existing');
  assert.equal(batches[0][0].deleteContentRange?.range?.startIndex, 1);
  assert.equal(batches[0][0].deleteContentRange?.range?.endIndex, 11);
  assert.ok(batches.flat().some((request) => request.insertText?.text === 'Updated'));
});

test('propagates Docs client failures', async () => {
  const client: DocsClient = {
    async createDocument() {
      return 'doc-1';
    },
    async batchUpdate() {
      throw new Error('docs down');
    },
    async getDocument() {
      return { body: { content: [] } };
    },
  };

  await assert.rejects(
    renderDocument(<P>Hello</P>, { client, title: 'Hello' }),
    /docs down/
  );
});

test('refuses to start authentication by itself', async () => {
  await assert.rejects(
    renderDocument(<P>Hello</P>, {}),
    /options\.client or options\.auth/
  );
});
