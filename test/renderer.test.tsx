import assert from 'node:assert/strict';
import { test } from 'node:test';
import React from 'react';
import { Heading1, Ol, Li, P, S, Table, TCell, TRow } from '../src/index.js';
import { GDocRenderer } from '../src/renderer/GDocRenderer.js';
import { collectRequests, insertedText } from './helpers.js';

test('inserts later paragraphs before earlier ones at the same index', async () => {
  const requests = await collectRequests(
    <>
      <P>First</P>
      <P>Second</P>
    </>
  );
  const text = insertedText(requests);
  assert.ok(text.indexOf('Second') < text.indexOf('First'));
  assert.ok(text.includes('\n'));
});

test('maps class names onto text and paragraph styles', async () => {
  const requests = await collectRequests(
    <P className="text-center">
      <S className="font-bold text-blue-800">Hello</S>
    </P>
  );
  const textStyle = requests.find((request) => request.updateTextStyle)?.updateTextStyle;
  const paragraphStyle = requests.find((request) => request.updateParagraphStyle)?.updateParagraphStyle;
  assert.equal(textStyle?.textStyle?.bold, true);
  assert.ok(textStyle?.textStyle?.foregroundColor);
  assert.equal(textStyle?.fields?.includes('bold'), true);
  assert.equal(paragraphStyle?.paragraphStyle?.alignment, 'CENTER');
  assert.equal(paragraphStyle?.paragraphStyle?.namedStyleType, 'NORMAL_TEXT');
});

test('keeps only the branch selected by component state', async () => {
  function Clause({ months }: { months: number }) {
    return months > 0
      ? <P>Probation {months}</P>
      : <P>No probation</P>;
  }
  const included = insertedText(await collectRequests(<Clause months={3} />));
  const omitted = insertedText(await collectRequests(<Clause months={0} />));
  assert.ok(included.some((text) => text.includes('Probation')));
  assert.equal(omitted.some((text) => text.includes('Probation')), false);
  assert.ok(omitted.some((text) => text.includes('No probation')));
});

test('creates bullets and a nesting tab for ordered lists', async () => {
  const requests = await collectRequests(
    <>
      <Heading1>Terms</Heading1>
      <Ol>
        <Li>One</Li>
        <Li nestingLevel={1}>Two</Li>
      </Ol>
    </>
  );
  const bullets = requests.find((request) => request.createParagraphBullets)?.createParagraphBullets;
  assert.equal(bullets?.bulletPreset, 'NUMBERED_DECIMAL_NESTED');
  assert.ok(insertedText(requests).includes('\t'));
  assert.ok(insertedText(requests).includes('One'));
  assert.ok(insertedText(requests).includes('Two'));
});

test('fills table cells from indexes returned by getDocument', async () => {
  const batches: Array<Array<{ insertText?: { location?: { index?: number }; text?: string }; insertTable?: { rows?: number; columns?: number } }>> = [];
  const renderer = new GDocRenderer(
    async (requests) => {
      batches.push(requests as typeof batches[number]);
    },
    async () => ({
      body: {
        content: [{
          startIndex: 1,
          endIndex: 20,
          table: {
            rows: 1,
            columns: 2,
            tableRows: [{
              tableCells: [
                { startIndex: 20, endIndex: 24 },
                { startIndex: 30, endIndex: 34 },
              ],
            }],
          },
        }],
      },
    })
  );

  await renderer.render(
    <Table>
      <TRow>
        <TCell><P>Left</P></TCell>
        <TCell><P>Right</P></TCell>
      </TRow>
    </Table>
  );

  assert.equal(batches[0].some((request) => request.insertTable?.rows === 1 && request.insertTable.columns === 2), true);
  const cellText = batches[1].filter((request) => request.insertText?.text === 'Left' || request.insertText?.text === 'Right');
  const indexes = cellText.map((request) => request.insertText?.location?.index).sort();
  assert.deepEqual(indexes, [21, 31]);
});

test('rejects when the fetched document does not contain the inserted tables', async () => {
  const renderer = new GDocRenderer(
    async () => {},
    async () => ({ body: { content: [] } })
  );
  await assert.rejects(
    renderer.render(
      <Table>
        <TRow>
          <TCell><P>A</P></TCell>
        </TRow>
      </Table>
    ),
    /number of tables/
  );
});
