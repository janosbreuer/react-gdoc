import React from 'react';
import {
  GImage,
  GPageBreak,
  Heading1,
  Heading2,
} from '@react-gdoc/primitives';
import { P, S } from '@react-gdoc/shortcuts';
import { Table, TRow, TCell } from '@react-gdoc/tables';

export default function ExampleDocument() {
  return (
    <>
      <Heading1>
        React-GDoc Example Document
      </Heading1>

      <P>
        This is an example document generated using the React-GDoc framework.
      </P>

      <Heading2>
        Introduction
      </Heading2>

      <P>
        The React-GDoc framework allows you to create Google Docs documents using JSX syntax.
      </P>

      <P>
        You can use various components like{' '}
        <S className="font-bold">bold text</S>
        ,{' '}
        <S className="italic">italic text</S>
        , and more!
      </P>

      <Heading2>
        Table Example
      </Heading2>

      <Table>
        <TRow className="text-center font-bold text-red-500">
          <TCell>
            <P>Column 1</P>
          </TCell>
          <TCell>
            <P>Column 2</P>
          </TCell>
          <TCell>
            <P>Column 3</P>
          </TCell>
        </TRow>
        <TRow>
          <TCell>
            <P>Row 1, Cell 1</P>
          </TCell>
          <TCell>
            <P>Row 1, Cell 2</P>
          </TCell>
          <TCell>
            <P>Row 1, Cell 3</P>
          </TCell>
        </TRow>
        <TRow>
          <TCell>
            <P>Row 2, Cell 1</P>
          </TCell>
          <TCell>
            <P>Row 2, Cell 2</P>
          </TCell>
          <TCell>
            <P>Row 2, Cell 3</P>
          </TCell>
        </TRow>
      </Table>

      <GPageBreak />

      <Heading2>
        Page Break Example
      </Heading2>

      <P>
        The previous page break should have created a new page.
      </P>
    </>
  );
}

