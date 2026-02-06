import React from 'react';
import { Heading4 } from '@react-gdoc/primitives';
import { P, S } from '@react-gdoc/shortcuts';
import { Table, TRow, TCell } from '@react-gdoc/tables';

export default function MinimalTableExample() {
  return (
    <>
      <Heading4>
        Minimális táblázat példa
      </Heading4>

      <Table>
        <TRow>
          <TCell>
            <P>Első oszlop</P>
          </TCell>
          <TCell>
            <P>Második <S className="font-bold">oszlop</S></P>
          </TCell>
        </TRow>
      </Table>
    </>
  );
}

