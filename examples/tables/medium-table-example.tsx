import React from 'react';
import {
  GParagraph,
  GTextRun,
  GTable,
  GTableRow,
  GTableCell,
  GHeading1,
  GHeading2,
  GHeading3,
  GHeading4,
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
};

export default function MediumTableExample() {
  return (
    <>
      <GHeading1>
        <GTextRun content="React-GDoc stílus példák" />
      </GHeading1>

      <GHeading2>
        <GTextRun content="Alcím – heading 2" />
      </GHeading2>

      <GHeading3>
        <GTextRun content="Alcím – heading 3" />
      </GHeading3>

      <GHeading4>
        <GTextRun content="Közepes táblázat példa (heading 4)" />
      </GHeading4>

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

      {/*  <GParagraph>
        <GTextRun content="Ez a dokumentum két táblázatot tartalmaz." />
      </GParagraph>

      <GHeading2>
        <GTextRun content="Első táblázat" />
      </GHeading2>

      <GTable>
        <GTableRow>
          <GTableCell>
            <GParagraph>
              <GTextRun content="Név" />
            </GParagraph>
          </GTableCell>
          <GTableCell>
            <GParagraph>
              <GTextRun content="Életkor" />
            </GParagraph>
          </GTableCell>
        </GTableRow>
        <GTableRow>
          <GTableCell>
            <GParagraph>
              <GTextRun content="Kovács János" />
            </GParagraph>
          </GTableCell>
          <GTableCell>
            <GParagraph>
              <GTextRun content="35" />
            </GParagraph>
          </GTableCell>
        </GTableRow>
        <GTableRow>
          <GTableCell>
            <GParagraph>
              <GTextRun content="Nagy Péter" />
            </GParagraph>
          </GTableCell>
          <GTableCell>
            <GParagraph>
              <GTextRun content="28" />
            </GParagraph>
          </GTableCell>
        </GTableRow>
      </GTable>

      <GHeading2>
        <GTextRun content="Második táblázat" />
      </GHeading2>

      <GTable>
        <GTableRow>
          <GTableCell>
            <GParagraph>
              <GTextRun content="Hónap" />
            </GParagraph>
          </GTableCell>
          <GTableCell>
            <GParagraph>
              <GTextRun content="Bevétel" />
            </GParagraph>
          </GTableCell>
        </GTableRow>
        <GTableRow>
          <GTableCell>
            <GParagraph>
              <GTextRun content="Január" />
            </GParagraph>
          </GTableCell>
          <GTableCell>
            <GParagraph>
              <GTextRun content="1.500.000 Ft" />
            </GParagraph>
          </GTableCell>
        </GTableRow>
        <GTableRow>
          <GTableCell>
            <GParagraph>
              <GTextRun content="Február" />
            </GParagraph>
          </GTableCell>
          <GTableCell>
            <GParagraph>
              <GTextRun content="1.800.000 Ft" />
            </GParagraph>
          </GTableCell>
        </GTableRow>
      </GTable> */}
    </>
  );
}

