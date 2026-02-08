import React from 'react';
import { Ol, Li, Ul, S, P } from '@react-gdoc/shortcuts';

export default function OrderedListExample() {
  return (
    <>
      <P>Simple ordered list:</P>
      <Ol>
        <Li>First item</Li>
        <Li nestingLevel={1}>Second item</Li>
        <Li>Third <S className="font-bold">bold</S> item</Li>
      </Ol>

      {/* <P>Simple unordered list:</P>
      <Ul>
        <Li>First item</Li>
        <Li>Second item</Li>
        <Li>Third <S className="font-bold">bold</S> item</Li>
      </Ul> */}
    </>
  );
}

