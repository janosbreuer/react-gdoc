import React, { createContext, useContext } from 'react';
import type { TextStyle, ParagraphStyle } from './primitives/types';

interface ClassContextValue {
  textClasses?: string;
  paragraphClasses?: string;
  textStyle?: TextStyle;
  paragraphStyle?: ParagraphStyle;
}

const ClassContext = createContext<ClassContextValue>({});

export const ClassProvider: React.FC<{
  textClasses?: string;
  paragraphClasses?: string;
  textStyle?: TextStyle;
  paragraphStyle?: ParagraphStyle;
  children: React.ReactNode;
}> = ({ textClasses, paragraphClasses, textStyle, paragraphStyle, children }) => {
  const parentContext = useContext(ClassContext);
  
  const mergedTextClasses = textClasses 
    ? `${parentContext.textClasses || ''} ${textClasses}`.trim()
    : parentContext.textClasses;
    
  const mergedParagraphClasses = paragraphClasses
    ? `${parentContext.paragraphClasses || ''} ${paragraphClasses}`.trim()
    : parentContext.paragraphClasses;
  
  const mergedTextStyle = { ...parentContext.textStyle, ...textStyle };
  const mergedParagraphStyle = { ...parentContext.paragraphStyle, ...paragraphStyle };
  
  return (
    <ClassContext.Provider
      value={{
        textClasses: mergedTextClasses,
        paragraphClasses: mergedParagraphClasses,
        textStyle: mergedTextStyle,
        paragraphStyle: mergedParagraphStyle,
      }}
    >
      {children}
    </ClassContext.Provider>
  );
};

export function useClassContext() {
  return useContext(ClassContext);
}

