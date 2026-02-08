import React from 'react';
import { GParagraph, GTextRun, GList } from './primitives';
import type { ParagraphStyle, TextStyle } from './primitives/types';
import { parseTextClasses, parseParagraphClasses, splitClasses } from '../utils/parseClasses';

/**
 * HTML-szerű shortcut komponensek az egyszerűbb szintaxisért.
 * Ezek a komponensek a primitívek wrapper-jei.
 */

export interface PProps {
  className?: string;
  style?: ParagraphStyle;
  children?: React.ReactNode;
}

/**
 * Egyszerű bekezdés komponens - HTML-szerű szintaxis.
 * A GParagraph primitívet használja.
 */
export const P: React.FC<PProps> = ({ className, style, children, ...props }) => {
  const { paragraphClasses, textClasses } = className ? splitClasses(className) : { paragraphClasses: '', textClasses: '' };
  const classStyle = paragraphClasses ? parseParagraphClasses(paragraphClasses) : {};
  
  const mergedStyle: ParagraphStyle = {
    ...classStyle,
    ...style,
  };
  
  const processedChildren = React.Children.map(children, (child) => {
    if (typeof child === 'string') {
      return textClasses ? (
        <GTextRun content={child} style={parseTextClasses(textClasses)} />
      ) : (
        <GTextRun content={child} />
      );
    }
    if (React.isValidElement(child)) {
      if (child.type === GTextRun && textClasses) {
        const classStyle = parseTextClasses(textClasses);
        const mergedStyle: TextStyle = {
          ...classStyle,
          ...(child.props.style || {}),
        };
        return React.cloneElement(child, {
          ...child.props,
          style: mergedStyle,
        } as any);
      }
      if (textClasses) {
        return React.cloneElement(child, {
          ...child.props,
          className: child.props.className 
            ? `${textClasses} ${child.props.className}`.trim()
            : textClasses,
        } as any);
      }
    }
    return child;
  });

  return (
    <GParagraph {...props} style={mergedStyle} listItemStyle={{ nestingLevel: 0 }}>
      {processedChildren}
    </GParagraph>
  );
};

export interface SProps {
  className?: string;
  style?: TextStyle;
  children?: React.ReactNode;
}

export const S: React.FC<SProps> = ({ className, style, children }) => {
  const classStyle = className ? parseTextClasses(className) : {};
  
  const mergedStyle: TextStyle = {
    ...classStyle,
    ...style,
  };
  
  const flattenSChildren = (children: React.ReactNode, parentClassName?: string, parentStyle?: TextStyle): React.ReactNode[] => {
    const result: React.ReactNode[] = [];
    
    React.Children.forEach(children, (child) => {
      if (typeof child === 'string' || typeof child === 'number') {
        const mergedClassName = parentClassName || '';
        const mergedClassStyle = mergedClassName ? parseTextClasses(mergedClassName) : {};
        const mergedStyle: TextStyle = {
          ...mergedClassStyle,
          ...parentStyle,
        };
        result.push(<GTextRun key={result.length} content={String(child)} style={mergedStyle} />);
      } else if (React.isValidElement(child)) {
        const childType = child.type as any;
        const isSComponent = childType === S || (typeof childType === 'function' && (childType.name === 'S' || childType.displayName === 'S'));
        
        if (isSComponent) {
          const childClassName = child.props.className || '';
          const childStyle = child.props.style || {};
          const mergedClassName = parentClassName && childClassName
            ? `${parentClassName} ${childClassName}`.trim()
            : parentClassName || childClassName;
          const mergedClassStyle = mergedClassName ? parseTextClasses(mergedClassName) : {};
          const mergedStyle: TextStyle = {
            ...mergedClassStyle,
            ...parentStyle,
            ...childStyle,
          };
          
          const nestedChildren = flattenSChildren(child.props.children, mergedClassName, mergedStyle);
          result.push(...nestedChildren);
        } else if (child.type === GTextRun) {
          const mergedClassName = parentClassName || '';
          const mergedClassStyle = mergedClassName ? parseTextClasses(mergedClassName) : {};
          const mergedStyle: TextStyle = {
            ...mergedClassStyle,
            ...parentStyle,
            ...(child.props.style || {}),
          };
          result.push(
            React.cloneElement(child, {
              ...child.props,
              style: mergedStyle,
            } as any)
          );
        } else {
          const mergedClassName = parentClassName || '';
          result.push(
            React.cloneElement(child, {
              ...child.props,
              className: child.props.className && mergedClassName
                ? `${mergedClassName} ${child.props.className}`.trim()
                : mergedClassName || child.props.className,
              style: child.props.style && parentStyle
                ? { ...parentStyle, ...child.props.style }
                : parentStyle || child.props.style,
            } as any)
          );
        }
      } else {
        result.push(child);
      }
    });
    
    return result;
  };
  
  if (typeof children === 'string') {
    return <GTextRun content={children} style={mergedStyle} />;
  }
  
  const flattened = flattenSChildren(children, className, mergedStyle);
  
  if (flattened.length === 0) {
    return null;
  }
  
  if (flattened.length === 1) {
    return flattened[0] as React.ReactElement;
  }
  
  return <>{flattened}</>;
};

export const Br: React.FC = () => {
  return <GTextRun content={'\u000b'} />;
};

export interface LiProps extends PProps {
  nestingLevel?: number;
}

export const Li: React.FC<LiProps> = ({ className, style, children, nestingLevel = 0, ...props }) => {
  const { paragraphClasses, textClasses } = className ? splitClasses(className) : { paragraphClasses: '', textClasses: '' };
  const classStyle = paragraphClasses ? parseParagraphClasses(paragraphClasses) : {};
  
  const mergedStyle: ParagraphStyle = {
    ...classStyle,
    ...style,
  };
  
  const processedChildren = React.Children.map(children, (child) => {
    if (typeof child === 'string') {
      return textClasses ? (
        <GTextRun content={child} style={parseTextClasses(textClasses)} />
      ) : (
        <GTextRun content={child} />
      );
    }
    if (React.isValidElement(child)) {
      if (child.type === GTextRun && textClasses) {
        const classStyle = parseTextClasses(textClasses);
        const mergedStyle: TextStyle = {
          ...classStyle,
          ...(child.props.style || {}),
        };
        return React.cloneElement(child, {
          ...child.props,
          style: mergedStyle,
        } as any);
      }
      if (textClasses) {
        return React.cloneElement(child, {
          ...child.props,
          className: child.props.className 
            ? `${textClasses} ${child.props.className}`.trim()
            : textClasses,
        } as any);
      }
    }
    return child;
  });

  return (
    <GParagraph {...props} style={mergedStyle} listItemStyle={{ nestingLevel }}>
      {processedChildren}
    </GParagraph>
  );
};

export interface ListProps {
  bulletPreset?: string;
  children?: React.ReactNode;
}

export const List: React.FC<ListProps> = ({ bulletPreset = 'BULLET_DISC_CIRCLE_SQUARE', children }) => {
  return <GList bulletPreset={bulletPreset}>{children}</GList>;
};

export interface UlProps {
  children?: React.ReactNode;
}

export const Ul: React.FC<UlProps> = ({ ...props }) => {
  return <GList bulletPreset="BULLET_DISC_CIRCLE_SQUARE" {...props} />;
};

export interface OlProps {
  children?: React.ReactNode;
}

export const Ol: React.FC<OlProps> = ({ ...props }) => {
  return <GList bulletPreset="NUMBERED_DECIMAL_NESTED" {...props} />;
};

