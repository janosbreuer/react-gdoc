import React from 'react';
import { Cursor } from './Cursor';
import { RequestBuilder } from './RequestBuilder';
import type { VirtualNode, FormatInfo, VirtualNodeType } from './VirtualNode';
import type { Request } from '../google/types';
import { docs_v1 } from 'googleapis';

export class GDocRenderer {
  private cursor: Cursor;
  private requestBuilder: RequestBuilder;
  private formatInfos: FormatInfo[] = [];

  constructor() {
    this.cursor = new Cursor(1);
    this.requestBuilder = new RequestBuilder(this.cursor);
  }

  render(element: React.ReactElement): Request[] {
    this.cursor.reset();
    this.formatInfos = [];
    const virtualNode = this.jsxToVirtualNode(element);
    this.renderInsertPhase(virtualNode);
    this.renderFormatPhase();
    return this.requestBuilder.getAllRequests();
  }

  private jsxToVirtualNode(element: React.ReactElement | React.ReactNode): VirtualNode | null {
    if (element === null || element === undefined || typeof element === 'boolean') {
      return null;
    }

    if (typeof element === 'string' || typeof element === 'number') {
      return {
        type: 'GTextRun',
        props: { content: String(element) },
        children: [],
      };
    }

    if (Array.isArray(element)) {
      return {
        type: 'Fragment',
        props: {},
        children: element.map(child => this.jsxToVirtualNode(child)).filter((node): node is VirtualNode => node !== null),
      };
    }

    if (React.isValidElement(element)) {
      const type = element.type as any;
      
      // Ha a komponens Fragment-et ad vissza (pl. React.Fragment vagy <>), 
      // akkor közvetlenül rendereljük a children-eket
      if (type === React.Fragment || (type && type.$$typeof && type.$$typeof.toString().includes('Fragment'))) {
        const props = element.props || {};
        const children = React.Children.toArray(props.children || []);
        return {
          type: 'Fragment',
          props: {},
          children: children.map(child => this.jsxToVirtualNode(child)).filter((node): node is VirtualNode => node !== null),
        };
      }
      
      const typeName = this.getComponentTypeName(type);
      
      // Ha a komponens egy függvény (React komponens) és nem egy ismert primitív típus, 
      // akkor meghívjuk és a visszatérési értéket rendereljük
      if (typeof type === 'function' && typeName === 'Fragment') {
        const props = element.props || {};
        try {
          const result = type(props);
          // Ha a komponens Fragment-et vagy tömböt ad vissza, rendereljük
          if (React.isValidElement(result) || Array.isArray(result)) {
            return this.jsxToVirtualNode(result);
          }
          // Ha null vagy undefined, akkor nincs mit renderelni
          if (result === null || result === undefined) {
            return null;
          }
        } catch (e) {
          // Ha a komponens meghívása hibát dob, akkor Fragment-ként kezeljük
          console.warn(`Warning: Component ${type.name || 'Unknown'} threw an error, treating as Fragment:`, e);
        }
      }
      
      // Ha a komponens GHeading típusú, akkor meghívjuk és a visszatérési értékből kinyerjük a style-t
      if (typeof type === 'function' && typeName.startsWith('GHeading')) {
        const props = element.props || {};
        try {
          const result = type(props);
          if (React.isValidElement(result)) {
            const resultNode = this.jsxToVirtualNode(result);
            if (resultNode && resultNode.type === 'GParagraph' && resultNode.props.style) {
              // A GHeading komponens GParagraph-ként van implementálva namedStyleType-tel
              // Átmásoljuk a style-t a heading node-ba
              return {
                ...resultNode,
                type: typeName,
                props: {
                  ...resultNode.props,
                  style: resultNode.props.style,
                },
              };
            }
          }
        } catch (e) {
          // Ha a komponens meghívása hibát dob, folytatjuk normál módon
        }
      }
      
      const props = element.props || {};
      const children = React.Children.toArray(props.children || []);

      return {
        type: typeName,
        props: { ...props, children: undefined },
        children: children.map(child => this.jsxToVirtualNode(child)).filter((node): node is VirtualNode => node !== null),
      };
    }

    return null;
  }

  private getComponentTypeName(type: any): VirtualNodeType {
    if (typeof type === 'string') {
      return type as VirtualNodeType;
    }

    if (type && type.name) {
      const name = type.name;
      // Csak az ismert primitív típusokat kezeljük közvetlenül
      const knownTypes: VirtualNodeType[] = [
        'GTextRun', 'GParagraph', 'GPageBreak', 'GColumnBreak', 'GHorizontalRule',
        'GFootnoteReference', 'GEquation', 'GInlineObject', 'GTable', 'GTableRow',
        'GTableCell', 'GSectionBreak', 'GListItem', 'GImage',
        'GHeading1', 'GHeading2', 'GHeading3', 'GHeading4', 'GHeading5', 'GHeading6'
      ];
      if (name.startsWith('G') && knownTypes.includes(name as VirtualNodeType)) {
        return name as VirtualNodeType;
      }
      
      // HTML-szerű shortcut komponensek (P, B, I, BI) Fragment-ként kezeljük
      // hogy meghívódjanak és renderelődjenek
      if (name === 'P' || name === 'B' || name === 'I' || name === 'BI') {
        return 'Fragment';
      }
    }

    if (type && type.displayName) {
      const displayName = type.displayName;
      const knownTypes: VirtualNodeType[] = [
        'GTextRun', 'GParagraph', 'GPageBreak', 'GColumnBreak', 'GHorizontalRule',
        'GFootnoteReference', 'GEquation', 'GInlineObject', 'GTable', 'GTableRow',
        'GTableCell', 'GSectionBreak', 'GListItem', 'GImage',
        'GHeading1', 'GHeading2', 'GHeading3', 'GHeading4', 'GHeading5', 'GHeading6'
      ];
      if (displayName.startsWith('G') && knownTypes.includes(displayName as VirtualNodeType)) {
        return displayName as VirtualNodeType;
      }
      
      // HTML-szerű shortcut komponensek
      if (displayName === 'P' || displayName === 'B' || displayName === 'I' || displayName === 'BI') {
        return 'Fragment';
      }
    }

    return 'Fragment';
  }

  private renderInsertPhase(node: VirtualNode | null): void {
    if (!node) return;

    const startIndex = this.cursor.getPosition();

    switch (node.type) {
      case 'GTextRun':
        this.handleTextRun(node, startIndex);
        break;
      case 'GParagraph':
        this.handleParagraph(node, startIndex);
        break;
      case 'GPageBreak':
        this.handlePageBreak(startIndex);
        break;
      case 'GColumnBreak':
        this.handleColumnBreak(startIndex);
        break;
      case 'GHorizontalRule':
        this.handleHorizontalRule(startIndex);
        break;
      case 'GEquation':
        this.handleEquation(node, startIndex);
        break;
      case 'GImage':
        this.handleImage(node, startIndex);
        break;
      case 'GTable':
        this.handleTable(node, startIndex);
        break;
      case 'GTableRow':
        this.handleTableRow(node);
        break;
      case 'GTableCell':
        this.handleTableCell(node);
        break;
      case 'GSectionBreak':
        this.handleSectionBreak(node, startIndex);
        break;
      case 'GListItem':
        this.handleListItem(node, startIndex);
        break;
      case 'GHeading1':
      case 'GHeading2':
      case 'GHeading3':
      case 'GHeading4':
      case 'GHeading5':
      case 'GHeading6':
        this.handleHeading(node, startIndex);
        break;
      case 'Fragment':
        node.children?.forEach(child => this.renderInsertPhase(child));
        break;
      default:
        // Ismeretlen komponensek esetén is rendereljük a children-eket
        // Ez lehetővé teszi, hogy a custom komponensek (pl. GContractHeader) működjenek
        if (node.children && node.children.length > 0) {
          node.children.forEach(child => this.renderInsertPhase(child));
        }
        break;
    }

    const endIndex = this.cursor.getPosition();
    node.startIndex = startIndex;
    node.endIndex = endIndex;

    if (node.type === 'GTextRun' && (node.props.style || node.props.textStyle)) {
      this.formatInfos.push({
        node,
        startIndex,
        endIndex,
        textStyle: node.props.style || node.props.textStyle,
      });
    } else if (node.type === 'GParagraph' && (node.props.style || node.props.paragraphStyle)) {
      this.formatInfos.push({
        node,
        startIndex,
        endIndex,
        paragraphStyle: node.props.style || node.props.paragraphStyle,
      });
    } else if (node.type.startsWith('GHeading')) {
      // A GHeading komponensek stílusát külön kezeljük a handleHeading metódusban
      // Itt nem kell hozzáadni, mert a handleHeading már hozzáadja
    }
  }

  private handleTextRun(node: VirtualNode, startIndex: number): void {
    const content = node.props.content || '';
    if (content) {
      this.requestBuilder.addInsertText(content, startIndex);
      this.cursor.advance(content.length);
    }
  }

  private handleParagraph(node: VirtualNode, startIndex: number): void {
    node.children?.forEach(child => this.renderInsertPhase(child));
    this.requestBuilder.addInsertText('\n', this.cursor.getPosition());
    this.cursor.advance(1);
  }

  private handlePageBreak(startIndex: number): void {
    this.requestBuilder.addInsertPageBreak(startIndex);
    this.cursor.advance(1);
  }

  private handleColumnBreak(startIndex: number): void {
    this.requestBuilder.addInsertColumnBreak(startIndex);
    this.cursor.advance(1);
  }

  private handleHorizontalRule(startIndex: number): void {
    this.requestBuilder.addInsertHorizontalRule(startIndex);
    this.cursor.advance(1);
  }

  private handleEquation(node: VirtualNode, startIndex: number): void {
    const equation = node.props.equation || '';
    if (equation) {
      this.requestBuilder.addInsertText(equation, startIndex);
      this.cursor.advance(equation.length);
    }
  }

  private handleImage(node: VirtualNode, startIndex: number): void {
    const url = node.props.url;
    const base64 = node.props.base64;
    const width = node.props.width;
    const height = node.props.height;

    if (url) {
      this.requestBuilder.addInsertInlineImage(url, startIndex, width, height);
      this.cursor.advance(1);
    } else if (base64) {
      const dataUri = `data:image/png;base64,${base64}`;
      this.requestBuilder.addInsertInlineImage(dataUri, startIndex, width, height);
      this.cursor.advance(1);
    }
  }

  private handleTable(node: VirtualNode, startIndex: number): void {
    const rows = node.props.rows || 1;
    const columns = node.props.columns || 1;

    if (node.children && node.children.length > 0) {
      const actualRows = node.children.length;
      const firstRow = node.children[0];
      const actualColumns = firstRow.children?.length || 1;
      this.requestBuilder.addInsertTable(actualRows, actualColumns, startIndex);
      this.cursor.advance(1);
      node.children.forEach(row => this.renderInsertPhase(row));
    } else {
      this.requestBuilder.addInsertTable(rows, columns, startIndex);
      this.cursor.advance(1);
    }
    
    const afterTableIndex = this.cursor.getPosition();
    this.requestBuilder.addInsertText('\n', afterTableIndex);
    this.cursor.advance(1);
  }

  private handleTableRow(node: VirtualNode): void {
    node.children?.forEach(cell => this.renderInsertPhase(cell));
  }

  private handleTableCell(node: VirtualNode): void {
    node.children?.forEach(child => this.renderInsertPhase(child));
  }

  private handleSectionBreak(node: VirtualNode, startIndex: number): void {
    this.cursor.advance(1);
  }

  private handleListItem(node: VirtualNode, startIndex: number): void {
    node.children?.forEach(child => this.renderInsertPhase(child));
    const endIndex = this.cursor.getPosition();
    
    const nestingLevel = node.props.nestingLevel || 0;
    const listId = node.props.listId;
    const ordered = node.props.ordered || false;
    
    this.formatInfos.push({
      node,
      startIndex,
      endIndex,
      paragraphStyle: {
        bullet: {
          listId: listId,
          nestingLevel: nestingLevel,
          ordered: ordered,
        } as any,
      } as any,
    });
  }

  private handleHeading(node: VirtualNode, startIndex: number): void {
    // Rendereljük a children-eket (pl. GTextRun-okat)
    node.children?.forEach(child => this.renderInsertPhase(child));
    
    // Beszúrunk egy newline-t a heading végére
    const beforeNewlineIndex = this.cursor.getPosition();
    this.requestBuilder.addInsertText('\n', beforeNewlineIndex);
    this.cursor.advance(1);
    const endIndex = this.cursor.getPosition();
    
    // A GHeading komponensek GParagraph-ként vannak implementálva namedStyleType-tel
    // Alkalmazzuk a heading stílust a teljes tartalomra (startIndex-től endIndex-ig, de a newline nélkül)
    if (node.props.style && node.props.style.namedStyleType) {
      this.formatInfos.push({
        node,
        startIndex,
        endIndex: beforeNewlineIndex,
        paragraphStyle: node.props.style,
      });
    } else {
      // Ha nincs style prop, akkor a GHeading típus alapján állítjuk be
      const headingLevel = node.type.replace('GHeading', '');
      const namedStyleType = `HEADING_${headingLevel}` as const;
      this.formatInfos.push({
        node,
        startIndex,
        endIndex: beforeNewlineIndex,
        paragraphStyle: { namedStyleType },
      });
    }
  }

  private renderFormatPhase(): void {
    for (const formatInfo of this.formatInfos) {
      if (formatInfo.textStyle) {
        this.requestBuilder.addUpdateTextStyle(
          formatInfo.startIndex,
          formatInfo.endIndex,
          formatInfo.textStyle
        );
      }
      if (formatInfo.paragraphStyle) {
        const styleCopy = { ...formatInfo.paragraphStyle };
        const bullet = (styleCopy as any).bullet;
        delete (styleCopy as any).bullet;

        if (Object.keys(styleCopy).length > 0) {
          this.requestBuilder.addUpdateParagraphStyle(
            formatInfo.startIndex,
            formatInfo.endIndex,
            styleCopy
          );
        }

        if (bullet) {
          const nestingLevel = bullet.nestingLevel || 0;
          const ordered = bullet.ordered || false;
          this.requestBuilder.addCreateParagraphBullets(
            formatInfo.startIndex,
            formatInfo.endIndex,
            nestingLevel,
            ordered
          );
        }
      }
    }
  }
}

