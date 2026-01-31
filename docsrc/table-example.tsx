import React from 'react';
import {
  GParagraph,
  GTextRun,
  GTable,
  GTableRow,
  GTableCell,
  GHeading1,
  GHeading2,
} from '../src/primitives';

export default function TableExample() {
  return (
    <>
      <GHeading1>
        <GTextRun content="Táblázat Példa" />
      </GHeading1>

      <GParagraph>
        <GTextRun content="Ez a dokumentum különböző táblázat formázási lehetőségeket mutat be." />
      </GParagraph>

      <GHeading2>
        <GTextRun content="Egyszerű táblázat" />
      </GHeading2>

      <GTable>
        <GTableRow>
          <GTableCell style={{ contentAlignment: 'CENTER' }}>
            <GParagraph style={{ alignment: 'CENTER' }}>
              <GTextRun content="Név" style={{ bold: true }} />
            </GParagraph>
          </GTableCell>
          <GTableCell style={{ contentAlignment: 'CENTER' }}>
            <GParagraph style={{ alignment: 'CENTER' }}>
              <GTextRun content="Életkor" style={{ bold: true }} />
            </GParagraph>
          </GTableCell>
          <GTableCell style={{ contentAlignment: 'CENTER' }}>
            <GParagraph style={{ alignment: 'CENTER' }}>
              <GTextRun content="Város" style={{ bold: true }} />
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
              <GTextRun content="35" style={{ backgroundColor: { color: { rgbColor: { red: 1, green: 0, blue: 0 } } } }} />
            </GParagraph>
          </GTableCell>
          <GTableCell>
            <GParagraph>
              <GTextRun content="Budapest" style={{ italic: true }} />
            </GParagraph>
          </GTableCell>
        </GTableRow>
        <GTableRow>
          <GTableCell>
            <GParagraph>
              <GTextRun content="Nagy Péter" style={{ bold: true }} />
            </GParagraph>
          </GTableCell>
          <GTableCell>
            <GParagraph>
              <GTextRun content="28" />
            </GParagraph>
          </GTableCell>
          <GTableCell>
            <GParagraph>
              <GTextRun content="Debrecen" style={{ backgroundColor: { color: { rgbColor: { red: 1, green: 0, blue: 0 } } } }} />
            </GParagraph>
          </GTableCell>
        </GTableRow>
        <GTableRow>
          <GTableCell>
            <GParagraph>
              <GTextRun content="Szabó Anna" />
            </GParagraph>
          </GTableCell>
          <GTableCell>
            <GParagraph>
              <GTextRun content="42" />
            </GParagraph>
          </GTableCell>
          <GTableCell>
            <GParagraph>
              <GTextRun content="Szeged" />
            </GParagraph>
          </GTableCell>
        </GTableRow>
      </GTable>

      <GHeading2>
        <GTextRun content="Pénzügyi táblázat" />
      </GHeading2>

      <GParagraph>
        <GTextRun content="A következő táblázat egy pénzügyi összefoglalót mutat be:" />
      </GParagraph>

      <GTable>
        <GTableRow>
          <GTableCell style={{ contentAlignment: 'CENTER' }}>
            <GParagraph style={{ alignment: 'CENTER' }}>
              <GTextRun content="Hónap" style={{ bold: true }} />
            </GParagraph>
          </GTableCell>
          <GTableCell style={{ contentAlignment: 'CENTER' }}>
            <GParagraph style={{ alignment: 'CENTER' }}>
              <GTextRun content="Bevétel" style={{ bold: true }} />
            </GParagraph>
          </GTableCell>
          <GTableCell style={{ contentAlignment: 'CENTER' }}>
            <GParagraph style={{ alignment: 'CENTER' }}>
              <GTextRun content="Kiadás" style={{ bold: true }} />
            </GParagraph>
          </GTableCell>
          <GTableCell style={{ contentAlignment: 'CENTER' }}>
            <GParagraph style={{ alignment: 'CENTER' }}>
              <GTextRun content="Nyereség" style={{ bold: true }} />
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
              <GTextRun content="1.500.000 Ft" style={{ backgroundColor: { color: { rgbColor: { red: 1, green: 0, blue: 0 } } } }} />
            </GParagraph>
          </GTableCell>
          <GTableCell>
            <GParagraph>
              <GTextRun content="1.200.000 Ft" />
            </GParagraph>
          </GTableCell>
          <GTableCell>
            <GParagraph>
              <GTextRun content="300.000 Ft" style={{ bold: true, italic: true }} />
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
          <GTableCell>
            <GParagraph>
              <GTextRun content="1.350.000 Ft" style={{ backgroundColor: { color: { rgbColor: { red: 1, green: 0, blue: 0 } } } }} />
            </GParagraph>
          </GTableCell>
          <GTableCell>
            <GParagraph>
              <GTextRun content="450.000 Ft" />
            </GParagraph>
          </GTableCell>
        </GTableRow>
        <GTableRow>
          <GTableCell>
            <GParagraph>
              <GTextRun content="Március" />
            </GParagraph>
          </GTableCell>
          <GTableCell>
            <GParagraph>
              <GTextRun content="2.100.000 Ft" />
            </GParagraph>
          </GTableCell>
          <GTableCell>
            <GParagraph>
              <GTextRun content="1.500.000 Ft" />
            </GParagraph>
          </GTableCell>
          <GTableCell>
            <GParagraph>
              <GTextRun content="600.000 Ft" />
            </GParagraph>
          </GTableCell>
        </GTableRow>
        <GTableRow>
          <GTableCell>
            <GParagraph>
              <GTextRun content="Összesen" />
            </GParagraph>
          </GTableCell>
          <GTableCell>
            <GParagraph>
              <GTextRun content="5.400.000 Ft" />
            </GParagraph>
          </GTableCell>
          <GTableCell>
            <GParagraph>
              <GTextRun content="4.050.000 Ft" />
            </GParagraph>
          </GTableCell>
          <GTableCell>
            <GParagraph>
              <GTextRun content="1.350.000 Ft" />
            </GParagraph>
          </GTableCell>
        </GTableRow>
      </GTable>

      <GHeading2>
        <GTextRun content="Táblázat összefoglaló cellákkal" />
      </GHeading2>

      <GTable>
        <GTableRow>
          <GTableCell style={{ contentAlignment: 'CENTER' }}>
            <GParagraph style={{ alignment: 'CENTER' }}>
              <GTextRun content="Projekt" style={{ bold: true }} />
            </GParagraph>
          </GTableCell>
          <GTableCell style={{ contentAlignment: 'CENTER' }}>
            <GParagraph style={{ alignment: 'CENTER' }}>
              <GTextRun content="Státusz" style={{ bold: true }} />
            </GParagraph>
          </GTableCell>
          <GTableCell style={{ contentAlignment: 'CENTER' }}>
            <GParagraph style={{ alignment: 'CENTER' }}>
              <GTextRun content="Felelős" style={{ bold: true }} />
            </GParagraph>
          </GTableCell>
        </GTableRow>
        <GTableRow>
          <GTableCell>
            <GParagraph>
              <GTextRun content="Webes alkalmazás fejlesztés" />
            </GParagraph>
          </GTableCell>
          <GTableCell>
            <GParagraph>
              <GTextRun content="Folyamatban" style={{ backgroundColor: { color: { rgbColor: { red: 1, green: 0, blue: 0 } } } }} />
            </GParagraph>
          </GTableCell>
          <GTableCell>
            <GParagraph>
              <GTextRun content="Kovács János" style={{ italic: true }} />
            </GParagraph>
          </GTableCell>
        </GTableRow>
        <GTableRow>
          <GTableCell>
            <GParagraph>
              <GTextRun content="Mobilalkalmazás" />
            </GParagraph>
          </GTableCell>
          <GTableCell>
            <GParagraph>
              <GTextRun content="Tervezés" />
            </GParagraph>
          </GTableCell>
          <GTableCell>
            <GParagraph>
              <GTextRun content="Nagy Péter" />
            </GParagraph>
          </GTableCell>
        </GTableRow>
        <GTableRow>
          <GTableCell>
            <GParagraph>
              <GTextRun content="Adatbázis migráció" />
            </GParagraph>
          </GTableCell>
          <GTableCell>
            <GParagraph>
              <GTextRun content="Befejezve" />
            </GParagraph>
          </GTableCell>
          <GTableCell>
            <GParagraph>
              <GTextRun content="Szabó Anna" />
            </GParagraph>
          </GTableCell>
        </GTableRow>
      </GTable>
    </>
  );
}

