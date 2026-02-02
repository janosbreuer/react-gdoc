import React from 'react';
import {
  GParagraph,
  GTextRun,
  GTable,
  GTableRow,
  GTableCell,
  GHeading1,
  GHeading2,
  GHeading4,
} from '@react-gdoc/primitives';
import { P } from '@react-gdoc/P';
import { S } from '@react-gdoc/shortcuts';

export default function MediumTableExample() {
  return (
    <>
      <GHeading4>
        <GTextRun content="Közepes táblázat példa" />
      </GHeading4>

    <P>Hello world <S style={['bold']}>bold</S></P>
    <P>Hello world <S style={['italic']}>italic</S></P>
    <P>Hello world <S style={['underline']}>underline</S></P>
    <P>Hello world <S style={['strikethrough']}>strikethrough</S></P>
    <P>Hello world <S style={['bold', 'italic']}>bold italic</S></P>
    <P>Hello world <S style={['bold', 'italic', 'underline']}>bold italic underline</S></P>
    <P>Hello world <S style={['bold', 'italic', 'underline', 'strikethrough']}>bold italic underline strikethrough</S></P>

      {/* <GParagraph>
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

