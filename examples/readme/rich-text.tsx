import React from 'react';
import { GDocument } from '@react-gdoc/primitives';
import type { NamedStyle } from '@react-gdoc/primitives';
import { Heading1, Heading2 } from '@react-gdoc/headings';
import { P, S } from '@react-gdoc/shortcuts';

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

export default function RichText() {
  return (
    <GDocument namedStyles={namedStyles}>
      <Heading1 className="mb-2">Project update</Heading1>
      <P className="mb-6 text-slate-600">Lumen Market · 13 October 2026</P>

      <Heading2>This week</Heading2>
      <P className="mb-4">
        Discovery is complete. Design is <S className="font-bold">in progress</S>, and the
        next review is <S className="text-blue-800">Thursday, 16 October</S>.
      </P>
      <P>
        Please send comments before the review. The scope stays with the pages already agreed.
      </P>
    </GDocument>
  );
}
