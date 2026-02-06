import React from 'react';
import { Heading1, Heading2 } from '@react-gdoc/primitives';
import { P, S } from '@react-gdoc/shortcuts';
import { Table, TRow, TCell } from '@react-gdoc/tables';

export default function TableExample() {
  return (
    <>
      <Heading1>
        Táblázat Példa
      </Heading1>

      <P>
        Ez a dokumentum különböző táblázat formázási lehetőségeket mutat be.
      </P>

      <Heading2>
        Egyszerű táblázat
      </Heading2>

      <Table>
        <TRow>
          <TCell style={{ contentAlignment: 'CENTER' }}>
            <P className="text-center">
              <S className="font-bold">Név</S>
            </P>
          </TCell>
          <TCell style={{ contentAlignment: 'CENTER' }}>
            <P className="text-center">
              <S className="font-bold">Életkor</S>
            </P>
          </TCell>
          <TCell style={{ contentAlignment: 'CENTER' }}>
            <P className="text-center">
              <S className="font-bold">Város</S>
            </P>
          </TCell>
        </TRow>
        <TRow>
          <TCell>
            <P>Kovács János</P>
          </TCell>
          <TCell>
            <P><S className="bg-red-500">35</S></P>
          </TCell>
          <TCell>
            <P><S className="italic">Budapest</S></P>
          </TCell>
        </TRow>
        <TRow>
          <TCell>
            <P><S className="font-bold">Nagy Péter</S></P>
          </TCell>
          <TCell>
            <P>28</P>
          </TCell>
          <TCell>
            <P><S className="bg-red-500">Debrecen</S></P>
          </TCell>
        </TRow>
        <TRow>
          <TCell>
            <P>Szabó Anna</P>
          </TCell>
          <TCell>
            <P>42</P>
          </TCell>
          <TCell>
            <P>Szeged</P>
          </TCell>
        </TRow>
      </Table>

      <Heading2>
        Pénzügyi táblázat
      </Heading2>

      <P>
        A következő táblázat egy pénzügyi összefoglalót mutat be:
      </P>

      <Table>
        <TRow>
          <TCell style={{ contentAlignment: 'CENTER' }}>
            <P className="text-center">
              <S className="font-bold">Hónap</S>
            </P>
          </TCell>
          <TCell style={{ contentAlignment: 'CENTER' }}>
            <P className="text-center">
              <S className="font-bold">Bevétel</S>
            </P>
          </TCell>
          <TCell style={{ contentAlignment: 'CENTER' }}>
            <P className="text-center">
              <S className="font-bold">Kiadás</S>
            </P>
          </TCell>
          <TCell style={{ contentAlignment: 'CENTER' }}>
            <P className="text-center">
              <S className="font-bold">Nyereség</S>
            </P>
          </TCell>
        </TRow>
        <TRow>
          <TCell>
            <P>Január</P>
          </TCell>
          <TCell>
            <P><S className="bg-red-500">1.500.000 Ft</S></P>
          </TCell>
          <TCell>
            <P>1.200.000 Ft</P>
          </TCell>
          <TCell>
            <P><S className="font-bold italic">300.000 Ft</S></P>
          </TCell>
        </TRow>
        <TRow>
          <TCell>
            <P>Február</P>
          </TCell>
          <TCell>
            <P>1.800.000 Ft</P>
          </TCell>
          <TCell>
            <P><S className="bg-red-500">1.350.000 Ft</S></P>
          </TCell>
          <TCell>
            <P>450.000 Ft</P>
          </TCell>
        </TRow>
        <TRow>
          <TCell>
            <P>Március</P>
          </TCell>
          <TCell>
            <P>2.100.000 Ft</P>
          </TCell>
          <TCell>
            <P>1.500.000 Ft</P>
          </TCell>
          <TCell>
            <P>600.000 Ft</P>
          </TCell>
        </TRow>
        <TRow>
          <TCell>
            <P>Összesen</P>
          </TCell>
          <TCell>
            <P>5.400.000 Ft</P>
          </TCell>
          <TCell>
            <P>4.050.000 Ft</P>
          </TCell>
          <TCell>
            <P>1.350.000 Ft</P>
          </TCell>
        </TRow>
      </Table>

      <Heading2>
        Táblázat összefoglaló cellákkal
      </Heading2>

      <Table>
        <TRow>
          <TCell style={{ contentAlignment: 'CENTER' }}>
            <P className="text-center">
              <S className="font-bold">Projekt</S>
            </P>
          </TCell>
          <TCell style={{ contentAlignment: 'CENTER' }}>
            <P className="text-center">
              <S className="font-bold">Státusz</S>
            </P>
          </TCell>
          <TCell style={{ contentAlignment: 'CENTER' }}>
            <P className="text-center">
              <S className="font-bold">Felelős</S>
            </P>
          </TCell>
        </TRow>
        <TRow>
          <TCell>
            <P>Webes alkalmazás fejlesztés</P>
          </TCell>
          <TCell>
            <P><S className="bg-red-500">Folyamatban</S></P>
          </TCell>
          <TCell>
            <P><S className="italic">Kovács János</S></P>
          </TCell>
        </TRow>
        <TRow>
          <TCell>
            <P>Mobilalkalmazás</P>
          </TCell>
          <TCell>
            <P>Tervezés</P>
          </TCell>
          <TCell>
            <P>Nagy Péter</P>
          </TCell>
        </TRow>
        <TRow>
          <TCell>
            <P>Adatbázis migráció</P>
          </TCell>
          <TCell>
            <P>Befejezve</P>
          </TCell>
          <TCell>
            <P>Szabó Anna</P>
          </TCell>
        </TRow>
      </Table>
    </>
  );
}
