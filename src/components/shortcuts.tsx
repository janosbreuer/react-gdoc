import React from 'react';
import { GParagraph, GTextRun } from './primitives';
import type { ParagraphStyle, TextStyle } from './primitives/types';

/**
 * HTML-szerű shortcut komponensek az egyszerűbb szintaxisért.
 * Ezek a komponensek a primitívek wrapper-jei.
 */

export interface PProps {
  style?: ParagraphStyle;
  children?: React.ReactNode;
}

export const P: React.FC<PProps> = ({ style, children }) => {
  // Ha a children string, akkor GTextRun-ként rendereljük
  // Ha React element vagy tömb, akkor közvetlenül rendereljük
  if (typeof children === 'string') {
    return (
      <GParagraph style={style}>
        <GTextRun content={children} />
      </GParagraph>
    );
  }
  
  // Ha tömb vagy React element, akkor közvetlenül rendereljük
  return (
    <GParagraph style={style}>
      {children}
    </GParagraph>
  );
};

export type StyleOption = 'bold' | 'italic' | 'underline' | 'strikethrough';

export interface SProps {
  style?: StyleOption[];
  children?: React.ReactNode;
}

export const S: React.FC<SProps> = ({ style = [], children }) => {
  const textStyle: TextStyle = {};
  
  if (style.includes('bold')) {
    textStyle.bold = true;
  }
  if (style.includes('italic')) {
    textStyle.italic = true;
  }
  if (style.includes('underline')) {
    textStyle.underline = true;
  }
  if (style.includes('strikethrough')) {
    textStyle.strikethrough = true;
  }
  
  if (typeof children === 'string') {
    return <GTextRun content={children} style={textStyle} />;
  }
  
  // Ha nem string, akkor a children-eket rendereljük (pl. <S style={['bold']}><S style={['italic']}>text</S></S>)
  return <>{children}</>;
};

