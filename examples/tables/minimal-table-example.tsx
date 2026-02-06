import React from 'react';
import {
  GParagraph,
  GTextRun,
  GTable,
  GTableRow,
  GTableCell,
  Heading4,
} from '@react-gdoc/primitives';
import { P, S } from '@react-gdoc/shortcuts';

export default function MinimalTableExample() {
  return (
    <>
      <Heading4>
        Minimális táblázat példa
      </Heading4>

      <GTable>
        <GTableRow>
          <GTableCell>
            <P>Első oszlop</P>
          </GTableCell>
          <GTableCell>
            <P>Második <S style={{ bold: true }}>oszlop</S></P>
          </GTableCell>
        </GTableRow>
      </GTable>
    </>
  );
}

