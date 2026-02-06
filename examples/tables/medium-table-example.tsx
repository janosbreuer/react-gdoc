import React from 'react';
import { Heading2, Heading4 } from '@react-gdoc/primitives';
import { P, S } from '@react-gdoc/shortcuts';
import { Table, TRow, TCell } from '@react-gdoc/tables';

export default function MediumTableExample() {
  return (
    <>
      <Heading4>
        React-GDoc stílus példák
      </Heading4>

      <P>
        Egyszerű bekezdés{' '}
        <S className="font-bold">félkövér</S>{' '}
        és{' '}
        <S className="italic">dőlt</S>
        .
      </P>

      <P>
        Többféle stílus:{' '}
        <S className="underline">aláhúzott</S>,{' '}
        <S className="line-through">áthúzott</S>,{' '}
        <S className="font-bold italic">félkövér + dőlt</S>,{' '}
        <S className="font-bold italic underline">
          félkövér + dőlt + aláhúzott
        </S>{' '}
        és{' '}
        <S className="font-bold line-through">
          félkövér + áthúzott
        </S>
        .
      </P>

      <P>
        Színes szöveg: <S className="text-red-500">piros szöveg</S> és <S className="bg-yellow-400">sárga háttér</S>.
      </P>

      <Heading2>Táblázat példa</Heading2>

      <Table>
        <TRow>
          <TCell>
            <P>Név</P>
          </TCell>
          <TCell>
            <P>Életkor</P>
          </TCell>
        </TRow>
        <TRow>
          <TCell>
            <P>Kovács János</P>
          </TCell>
          <TCell>
            <P>35</P>
          </TCell>
        </TRow>
        <TRow>
          <TCell>
            <P><S className="font-bold">Nagy Péter</S></P>
          </TCell>
          <TCell>
            <P><S className="text-red-500 font-bold">28</S></P>
          </TCell>
        </TRow>
      </Table>
    </>
  );
}

