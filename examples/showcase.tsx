import React from 'react';
import { GDocument } from '@react-gdoc/primitives';
import type { NamedStyle } from '@react-gdoc/primitives';
import { Heading1, Heading2 } from '@react-gdoc/headings';
import { P, S } from '@react-gdoc/shortcuts';
import { Table, TRow, TCell } from '@react-gdoc/tables';

const namedStyles: NamedStyle[] = [
  {
    namedStyleType: 'NORMAL_TEXT',
    textStyle: { weightedFontFamily: { fontFamily: 'Calibri', weight: 400 } },
  },
  {
    namedStyleType: 'HEADING_1',
    textStyle: { weightedFontFamily: { fontFamily: 'Calibri', weight: 400 } },
  },
  {
    namedStyleType: 'HEADING_2',
    textStyle: { weightedFontFamily: { fontFamily: 'Calibri', weight: 400 } },
  },
];

const fees = {
  workshop: 2400,
  website: 6800,
  audit: 1200,
};

function money(amount: number): string {
  return `$${amount.toLocaleString('en-US')}`;
}

export default function Showcase({ args = [] as string[] } = {}) {
  const client = args[0] || 'Harbor & Co.';
  const includeAudit = args[1] !== 'no-audit';
  const total = fees.workshop + fees.website + (includeAudit ? fees.audit : 0);

  return (
    <GDocument namedStyles={namedStyles}>
      <Heading1 className="text-center mb-2">
        <S className="text-blue-800">Proposal</S>
      </Heading1>
      <P className="text-center mb-6">
        Prepared for <S className="font-bold">{client}</S>
      </P>

      <Heading2>Scope</Heading2>
      <P className="mb-4">
        A three-week website engagement for <S className="italic">Lumen Market</S>.
        {includeAudit
          ? ' A content audit is included before design starts.'
          : ' Design starts from the existing site, without a content audit.'}
      </P>

      <Heading2>Investment</Heading2>
      <Table>
        <TRow>
          <TCell className="bg-blue-800">
            <P><S className="font-bold text-white">Work</S></P>
          </TCell>
          <TCell className="bg-blue-800">
            <P className="text-right"><S className="font-bold text-white">Fee</S></P>
          </TCell>
        </TRow>
        <TRow>
          <TCell><P>Brand workshop</P></TCell>
          <TCell><P className="text-right">{money(fees.workshop)}</P></TCell>
        </TRow>
        <TRow>
          <TCell><P>Website design</P></TCell>
          <TCell><P className="text-right">{money(fees.website)}</P></TCell>
        </TRow>
        {includeAudit && (
          <TRow>
            <TCell><P>Content audit</P></TCell>
            <TCell><P className="text-right">{money(fees.audit)}</P></TCell>
          </TRow>
        )}
        <TRow>
          <TCell className="bg-blue-50">
            <P><S className="font-bold">Total</S></P>
          </TCell>
          <TCell className="bg-blue-50">
            <P className="text-right"><S className="font-bold">{money(total)}</S></P>
          </TCell>
        </TRow>
      </Table>

      <P className="mt-6">
        Prepared by <S className="font-bold">Fieldnote Studio</S>. Valid for 14 days.
      </P>
    </GDocument>
  );
}
