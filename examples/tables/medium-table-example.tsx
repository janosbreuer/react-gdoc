import React from 'react';
import {
  GParagraph,
  GTextRun,
  GTable,
  GTableRow,
  GTableCell,
  Heading1,
  Heading2,
  Heading3,
  Heading4,
} from '@react-gdoc/primitives';
import { P } from '@react-gdoc/P';
import { S } from '@react-gdoc/shortcuts';

const styles = {
  redText: {
    foregroundColor: {
      color: { rgbColor: { red: 1, green: 0, blue: 0 } },
    },
  },
  yellowBackground: {
    backgroundColor: {
      color: { rgbColor: { red: 1, green: 1, blue: 0 } },
    },
  },
  bold: {
    bold: true,
  },
};

export default function MediumTableExample() {
  return (
    <>
      <Heading4>
        React-GDoc stílus példák
      </Heading4>

      <P>
        Egyszerű bekezdés{' '}
        <S style={['bold']}>félkövér</S>{' '}
        és{' '}
        <S style={['italic']}>dőlt</S>
        .
      </P>

      <P>
        Többféle stílus:{' '}
        <S style={['underline']}>aláhúzott</S>,{' '}
        <S style={['strikethrough']}>áthúzott</S>,{' '}
        <S style={['bold', 'italic']}>félkövér + dőlt</S>,{' '}
        <S style={['bold', 'italic', 'underline']}>
          félkövér + dőlt + aláhúzott
        </S>{' '}
        és{' '}
        <S style={['bold', 'strikethrough']}>
          félkövér + áthúzott
        </S>
        .
      </P>

      <P>
        Színes szöveg: <S style={styles.redText}>piros szöveg</S> és <S style={styles.yellowBackground}>sárga háttér</S>.
      </P>

      <Heading2>Táblázat példa</Heading2>

      <GTable>
        <GTableRow>
          <GTableCell>
            <P>Név</P>
          </GTableCell>
          <GTableCell>
            <P>Életkor</P>
          </GTableCell>
        </GTableRow>
        <GTableRow>
          <GTableCell>
            <P>Kovács János</P>
          </GTableCell>
          <GTableCell>
            <P>35</P>
          </GTableCell>
        </GTableRow>
        <GTableRow>
          <GTableCell>
            <P><S style={['bold']}>Nagy Péter</S></P>
          </GTableCell>
          <GTableCell>
            <P><S style={{...styles.redText, ...styles.bold}}>28</S></P>
          </GTableCell>
        </GTableRow>
      </GTable>
    </>
  );
}

