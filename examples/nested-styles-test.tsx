import React from 'react';
import { P, S } from '@react-gdoc/shortcuts';

export default function NestedStylesTest() {
  return (
    <>
      

      <P>
        Test 2 - Nested S components:{' '}
        <S className="font-bold">
          bold text with{' '}
          <S className="italic">nested italic</S>
        </S>
        . 
      </P>
{/* 
      <P>
        Test 3 - Multiple nested levels:{' '}
        <S className="text-blue-500">
          blue text with{' '}
          <S className="font-bold">
            bold and{' '}
            <S className="italic">bold italic</S>
          </S>
        </S>
        .
      </P>

      <P>
        Test 4 - Text between nested components:{' '}
        <S className="font-bold">
          Start bold{' '}
          <S className="text-red-500">red inside bold</S>
          {' '}end bold
        </S>
        .
      </P>

      <P>
        Test 5 - Single nested:{' '}
        <S className="font-bold">
          <S className="italic">only italic inside bold</S>
        </S>
        .
      </P> */}
    </>
  );
}

