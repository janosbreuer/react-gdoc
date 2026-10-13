import React from 'react';
import { GDocument } from '@react-gdoc/primitives';
import type { NamedStyle } from '@react-gdoc/primitives';
import { Heading1 } from '@react-gdoc/headings';
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
];

const lines = [
  ['Discovery', 3, 2400],
  ['Design', 8, 6400],
  ['Handoff', 2, 1600],
] as const;

function usd(amount: number): string {
  return `$${amount.toLocaleString('en-US')}`;
}

export default function FeeSchedule() {
  const totalDays = lines.reduce((sum, [, days]) => sum + days, 0);
  const totalFee = lines.reduce((sum, [, , fee]) => sum + fee, 0);

  return (
    <GDocument namedStyles={namedStyles}>
      <Heading1 className="mb-2">Fee schedule</Heading1>
      <P className="mb-4 text-slate-600">Lumen Market website</P>

      <Table>
        <TRow>
          <TCell className="bg-slate-200"><P><S className="font-bold">Work</S></P></TCell>
          <TCell className="bg-slate-200"><P className="text-right"><S className="font-bold">Days</S></P></TCell>
          <TCell className="bg-slate-200"><P className="text-right"><S className="font-bold">Fee</S></P></TCell>
        </TRow>
        {lines.map(([work, days, fee]) => (
          <TRow key={work}>
            <TCell><P>{work}</P></TCell>
            <TCell><P className="text-right">{days}</P></TCell>
            <TCell><P className="text-right">{usd(fee)}</P></TCell>
          </TRow>
        ))}
        <TRow>
          <TCell><P><S className="font-bold">Total</S></P></TCell>
          <TCell><P className="text-right"><S className="font-bold">{totalDays}</S></P></TCell>
          <TCell><P className="text-right"><S className="font-bold">{usd(totalFee)}</S></P></TCell>
        </TRow>
      </Table>
    </GDocument>
  );
}
