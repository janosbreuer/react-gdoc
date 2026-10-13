import React from 'react';
import { GDocRenderer } from '../renderer/GDocRenderer.js';
import { createDocsClient, type DocsClient, type GoogleDocsAuth } from '../google/client.js';

export interface RenderDocumentOptions {
  client?: DocsClient;
  auth?: GoogleDocsAuth;
  documentId?: string;
  title?: string;
  debug?: boolean;
}

export interface RenderDocumentResult {
  documentId: string;
}

export async function renderDocument(
  element: React.ReactElement,
  options: RenderDocumentOptions = {}
): Promise<RenderDocumentResult> {
  if (!React.isValidElement(element)) {
    throw new Error('renderDocument expected a React element.');
  }

  const client = options.client ?? (options.auth ? createDocsClient(options.auth) : undefined);
  if (!client) {
    throw new Error(
      'renderDocument requires options.client or options.auth. react-gdoc does not start an OAuth flow.'
    );
  }

  let documentId = options.documentId;
  let replaceRange: { startIndex: number; endIndex: number } | null = null;

  if (documentId) {
    const document = await client.getDocument(documentId);
    const endIndex = document.body?.content?.[document.body.content.length - 1]?.endIndex;
    if (!endIndex) {
      throw new Error('The document has no body end index, so its contents cannot be replaced.');
    }
    replaceRange = { startIndex: 1, endIndex: endIndex - 1 };
  } else {
    documentId = await client.createDocument(options.title || `Document ${new Date().toISOString()}`);
  }

  const renderer = new GDocRenderer(
    async (requests) => {
      await client.batchUpdate(documentId, requests);
    },
    async () => client.getDocument(documentId),
    options.debug ?? false
  );

  await renderer.render(element, replaceRange);
  return { documentId };
}
