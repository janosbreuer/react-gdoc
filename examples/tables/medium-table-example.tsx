import React from 'react';
import {
  GTable,
  GTableRow,
  GTableCell,
  Heading2,
  Heading4,
} from '@react-gdoc/primitives';
import { P, S } from '@react-gdoc/shortcuts';

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
        <S style={{ bold: true }}>félkövér</S>{' '}
        és{' '}
        <S style={{ italic: true }}>dőlt</S>
        .
      </P>

      <P>
        Többféle stílus:{' '}
        <S style={{ underline: true }}>aláhúzott</S>,{' '}
        <S style={{ strikethrough: true }}>áthúzott</S>,{' '}
        <S style={{ bold: true, italic: true }}>félkövér + dőlt</S>,{' '}
        <S style={{ bold: true, italic: true, underline: true }}>
          félkövér + dőlt + aláhúzott
        </S>{' '}
        és{' '}
        <S style={{ bold: true, strikethrough: true }}>
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
            <P><S style={{ bold: true }}>Nagy Péter</S></P>
          </GTableCell>
          <GTableCell>
            <P><S style={{...styles.redText, ...styles.bold}}>28</S></P>
          </GTableCell>
        </GTableRow>
      </GTable>
    </>
  );
}

