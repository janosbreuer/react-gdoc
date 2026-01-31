import React from 'react';
import { GParagraph, GTextRun, GHeading1, GHeading2 } from '../primitives';
import { GContractHeader, GSection, GClause } from './components';

/**
 * Teszt fájl a komponensek összeállításának ellenőrzéséhez.
 * Ez a fájl segít debugolni, hogy a komponensek helyesen épülnek-e fel.
 */
export default function TestComponents() {
  return (
    <>
      <GHeading1>
        <GTextRun content="Teszt Dokumentum" />
      </GHeading1>

      <GParagraph>
        <GTextRun content="Ez egy egyszerű teszt bekezdés." />
      </GParagraph>

      <GHeading2>
        <GTextRun content="Teszt Section" />
      </GHeading2>

      <GParagraph>
        <GTextRun content="Ez egy másik bekezdés a section után." />
      </GParagraph>

      <GContractHeader 
        title="Teszt Szerződés Címe"
        parties={["Teszt Fél 1", "Teszt Fél 2"]}
        date="2026. január 30."
        location="Budapest"
      />

      <GParagraph>
        <GTextRun content="Ez egy bekezdés a ContractHeader után." />
      </GParagraph>

      <GSection title="Teszt Szakasz">
        <GParagraph>
          <GTextRun content="Ez egy bekezdés a Section-ben." />
        </GParagraph>
      </GSection>

      <GClause number={1} title="Teszt Záradék">
        <GParagraph>
          <GTextRun content="Ez egy bekezdés a Clause-ben." />
        </GParagraph>
      </GClause>
    </>
  );
}

