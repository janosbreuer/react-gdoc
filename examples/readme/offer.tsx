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

const candidate = 'Maya Chen';
const role = 'Product Designer';
const probationMonths = 3;

export default function Offer() {
  const onProbation = probationMonths > 0;

  return (
    <GDocument namedStyles={namedStyles}>
      <Heading1 className="mb-2">Offer of employment</Heading1>
      <P className="mb-6">
        Fieldnote Studio offers <S className="font-bold">{candidate}</S> the position of {role},
        starting 2 November 2026.
      </P>

      <Heading2>Probation</Heading2>
      {onProbation ? (
        <P>
          The first <S className="font-bold">{probationMonths} months</S> are a probationary period.
          During that time, either party may end the employment with one week of notice.
        </P>
      ) : (
        <P>
          This offer includes no probationary period. Notice follows the employment agreement.
        </P>
      )}
    </GDocument>
  );
}
