import React from 'react';
import {
  GParagraph,
  GTextRun,
  GTable,
  GTableRow,
  GTableCell,
} from '@react-gdoc/primitives';

export default function MinimalTableExample() {
  return (
    <>
      <GParagraph>
        <GTextRun content="Minimális táblázat példa" />
      </GParagraph>

      <GTable>
        <GTableRow>
          <GTableCell>
            <GParagraph>
              <GTextRun content="Első oszlop" />
            </GParagraph>
          </GTableCell>
          <GTableCell>
            <GParagraph>
              <GTextRun content="Második oszlop" />
            </GParagraph>
          </GTableCell>
        </GTableRow>
      </GTable>
    </>
  );
}

