import React from 'react';
import { Heading1, Heading2 } from '@react-gdoc/primitives';
import { P } from '@react-gdoc/shortcuts';
import { ContractHeader, Section, Clause } from './components';

/**
 * Teszt fájl a komponensek összeállításának ellenőrzéséhez.
 * Ez a fájl segít debugolni, hogy a komponensek helyesen épülnek-e fel.
 */
export default function TestComponents() {
  return (
    <>
      <Heading1>
        Teszt Dokumentum
      </Heading1>

      <P>
        Ez egy egyszerű teszt bekezdés.
      </P>

      <Heading2>
        Teszt Section
      </Heading2>

      <P>
        Ez egy másik bekezdés a section után.
      </P>

      <ContractHeader 
        title="Teszt Szerződés Címe"
        parties={["Teszt Fél 1", "Teszt Fél 2"]}
        date="2026. január 30."
        location="Budapest"
      />

      <P>
        Ez egy bekezdés a ContractHeader után.
      </P>

      <Section title="Teszt Szakasz">
        <P>
          Ez egy bekezdés a Section-ben.
        </P>
      </Section>

      <Clause number={1} title="Teszt Záradék">
        <P>
          Ez egy bekezdés a Clause-ben.
        </P>
      </Clause>
    </>
  );
}

