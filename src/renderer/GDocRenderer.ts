import React from 'react';
import { RequestBuilder } from './RequestBuilder';
import type { VirtualNode, VirtualNodeType } from './VirtualNode';
import type { Request, Document } from '../components/primitives/types';
import { docs_v1 } from 'googleapis';

type TextStyle = docs_v1.Schema$TextStyle;
type BatchUpdateFn = (requests: Request[]) => Promise<void>;
type GetDocumentFn = () => Promise<Document>;

interface StackItem {
  combinedStyle: TextStyle;
  rollback: TextStyle;
}

interface QueuedTable {
  id: string;
  node: VirtualNode;
  startIndex: number;
}

const KNOWN_VIRTUAL_NODE_TYPES: VirtualNodeType[] = [
  'GTextRun', 'GParagraph', 'GPageBreak', 'GColumnBreak', 'GHorizontalRule',
  'GFootnoteReference', 'GEquation', 'GInlineObject', 'GTable', 'GTableRow',
  'GTableCell', 'GSectionBreak', 'GListItem', 'GImage'
];

export class GDocRenderer {
  private tableQueue: QueuedTable[] = [];
  private styleStack: StackItem[] = [];
  
  // Alapértelmezett stílus a "tiszta" állapothoz
  private readonly defaultStyle: TextStyle = {
    bold: false,
    italic: false,
    underline: false,
    strikethrough: false,
    fontSize: { magnitude: 11, unit: 'PT' },
    foregroundColor: { color: { rgbColor: { red: 0, green: 0, blue: 0 } } },
  };

  constructor(
    private batchUpdate: BatchUpdateFn,
    private getDocument: GetDocumentFn
  ) {}

  // --- Stílus Stack Kezelés ---

  private getCurrentStyle(): TextStyle {
    return this.styleStack.length > 0 
      ? this.styleStack[this.styleStack.length - 1].combinedStyle 
      : this.defaultStyle;
  }

  private pushStyle(newProps: TextStyle) {
    const current = this.getCurrentStyle();
    const rollback: TextStyle = {};

    // Kiszámoljuk a rollback-et: mit kell majd visszaállítani
    Object.keys(newProps).forEach((key) => {
      const k = key as keyof TextStyle;
      // Elmentjük a jelenlegi értéket, mielőtt felülírnánk
      rollback[k] = current[k] !== undefined ? current[k] : (this.defaultStyle as any)[k];
    });

    const combined = { ...current, ...newProps };
    this.styleStack.push({ combinedStyle: combined, rollback });
  }

  private popStyle() {
    return this.stackPop();
  }

  private stackPop(): TextStyle | undefined {
    const item = this.styleStack.pop();
    return item?.rollback;
  }

  // --- Renderelési Logika ---

  async render(element: React.ReactElement): Promise<void> {
    this.tableQueue = [];
    this.styleStack = [];
    
    const requestBuilder = new RequestBuilder();
    const virtualNode = this.jsxToVirtualNode(element);
    if (!virtualNode) return;

    // Fázis 1: Tartalom beszúrása
    this.renderInsertPhase(virtualNode, requestBuilder, 1);
    
    const initialRequests = requestBuilder.getAllRequests();
    if (initialRequests.length > 0) {
      await this.batchUpdate(initialRequests);
    }
    
    // Itt jöhetne a Fázis 2 (táblázatok kitöltése), ha szükséges
  }

  private renderInsertPhase(
    node: VirtualNode | null, 
    requestBuilder: RequestBuilder,
    startIndex: number = 0
  ): number {
    if (!node) return 0;

    let length = 0;

    switch (node.type) {
      case 'GTextRun':
        length = this.handleTextRun(node, requestBuilder, startIndex);
        break;
      case 'GParagraph':
        length = this.handleParagraph(node, requestBuilder, startIndex);
        break;
      case 'GPageBreak':
        length = this.handlePageBreak(requestBuilder, startIndex);
        break;
      case 'GImage':
        length = this.handleImage(node, requestBuilder, startIndex);
        break;
      case 'GTable':
        this.handleTableSkeleton(node, startIndex);
        length = 0;
        break;
      // ... egyéb típusok (GSectionBreak, GListItem, stb.)
      default:
        // Fragment vagy ismeretlen típus: gyerekeinek feldolgozása fordított sorrendben
        // (A reverse fontos, mert a Google Docs indexei eltolódnak beszúráskor)
        if (node.children) {
          [...node.children].reverse().forEach(child => { 
            length += this.renderInsertPhase(child, requestBuilder, startIndex);
          });
        }
        break;
    }

    return length;
  }

  private handleTextRun(node: VirtualNode, requestBuilder: RequestBuilder, startIndex: number): number {
    const content = node.props.content || '';
    if (content.length === 0) return 0;

    const localStyle = node.props.style || node.props.textStyle || {};
    
    // 1. Pusholjuk az új stílust a stack-re
    this.pushStyle(localStyle);
    const activeStyle = this.getCurrentStyle();

    // 2. Beszúrás
    requestBuilder.addInsertText(content, startIndex);
    
    // 3. Formázás alkalmazása a teljes aktuális stílussal
    // A 'fields: "*"' helyett érdemesebb felsorolni, de a kényelem kedvéért itt most az összes stack-elt mezőt küldjük
    const fields = Object.keys(activeStyle).join(',');
    requestBuilder.addUpdateTextStyle(startIndex, startIndex + content.length, activeStyle);

    // 4. Pop - kikerülünk a scope-ból
    this.popStyle();

    return content.length;
  }

  private handleParagraph(node: VirtualNode, requestBuilder: RequestBuilder, startIndex: number): number {
    let length = 0;
    
    // Új sor beszúrása
    requestBuilder.addInsertText('\n', startIndex);
    length += 1;

    // Gyerekek feldolgozása (szöveg a paragrafuson belül)
    if (node.children) {
      [...node.children].reverse().forEach(child => {
        length += this.renderInsertPhase(child, requestBuilder, startIndex);
      });
    }
    
    const style = node.props.style || node.props.paragraphStyle;
    if (style) {
      // Paragrafus stílus alkalmazása a teljes tartományra
      requestBuilder.addUpdateParagraphStyle(startIndex, startIndex + length - 1, style);
    }
    
    return length;
  }

  // --- Segédfüggvények (JSX konverzió és Skeleton) ---

  private handleTableSkeleton(node: VirtualNode, startIndex: number): void {
    this.tableQueue.push({
      id: `table_${this.tableQueue.length}`,
      node: node,
      startIndex: startIndex
    });
  }

  private handlePageBreak(requestBuilder: RequestBuilder, startIndex: number): number {
    requestBuilder.addInsertPageBreak(startIndex);
    return 1;
  }

  private handleImage(node: VirtualNode, requestBuilder: RequestBuilder, startIndex: number): number {
    const { url, base64, width, height } = node.props;
    const source = url || (base64 ? `data:image/png;base64,${base64}` : null);
    
    if (source) {
      requestBuilder.addInsertInlineImage(source, startIndex, width, height);
      return 1;
    }
    return 0;
  }

  private jsxToVirtualNode(element: React.ReactElement | React.ReactNode): VirtualNode | null {
    if (!element || typeof element === 'boolean') return null;

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
        children: element.map(child => this.jsxToVirtualNode(child)).filter((n): n is VirtualNode => n !== null),
      };
    }

    if (React.isValidElement(element)) {
      const type = element.type as any;
      const typeName = this.getComponentTypeName(type);
      const props = element.props || {};
      const children = React.Children.toArray(props.children || []);

      // Funkcionális komponensek kezelése (Fragment-szerűen kibontva)
      if (typeof type === 'function' && typeName === 'Fragment') {
        try {
          const result = type(props);
          return this.jsxToVirtualNode(result);
        } catch (e) {
          console.warn("Component render error:", e);
        }
      }

      return {
        type: typeName,
        props: { ...props, children: undefined },
        children: children.map(child => this.jsxToVirtualNode(child)).filter((n): n is VirtualNode => n !== null),
      };
    }

    return null;
  }

  private getComponentTypeName(type: any): VirtualNodeType {
    if (typeof type === 'string') return type as VirtualNodeType;
    const name = type.displayName || type.name;
    if (KNOWN_VIRTUAL_NODE_TYPES.includes(name)) return name;
    return 'Fragment';
  }
}