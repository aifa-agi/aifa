// @/app/@right/(_service)/(_components)/content-renderer/types.ts

// Базовые типы для TipTap узлов
export interface TipTapNodeAttrs {
  level?: number;
  textAlign?: string | null;
  language?: string;
  src?: string;
  alt?: string;
  title?: string;
  [key: string]: any;
}

export interface TipTapNode {
  type: string;
  attrs?: TipTapNodeAttrs;
  content?: TipTapNode[];
  text?: string;
}

export interface TipTapDocument {
  type: "doc";
  content: TipTapNode[];
}

// Специфичные типы узлов для лучшей типизации
export interface HeadingNode extends TipTapNode {
  type: "heading";
  attrs: {
    level: 1 | 2 | 3 | 4 | 5 | 6;
    textAlign?: string | null;
  };
  content: TipTapNode[];
}

export interface ParagraphNode extends TipTapNode {
  type: "paragraph";
  attrs?: {
    textAlign?: string | null;
  };
  content: TipTapNode[];
}

export interface TextNode extends TipTapNode {
  type: "text";
  text: string;
}

export interface BlockquoteNode extends TipTapNode {
  type: "blockquote";
  content: TipTapNode[];
}

export interface CodeBlockNode extends TipTapNode {
  type: "codeBlock";
  attrs?: {
    language?: string;
  };
  content: TipTapNode[];
}

export interface ImageNode extends TipTapNode {
  type: "image";
  attrs: {
    src: string;
    alt?: string;
    title?: string;
  };
}

export interface BulletListNode extends TipTapNode {
  type: "bulletList";
  content: ListItemNode[];
}

export interface OrderedListNode extends TipTapNode {
  type: "orderedList";
  content: ListItemNode[];
}

export interface ListItemNode extends TipTapNode {
  type: "listItem";
  content: TipTapNode[];
}

export interface HorizontalRuleNode extends TipTapNode {
  type: "horizontalRule";
}

// Утилитарные функции для проверки типов
export function isHeading(node: TipTapNode): node is HeadingNode {
  return node.type === "heading";
}

export function isParagraph(node: TipTapNode): node is ParagraphNode {
  return node.type === "paragraph";
}

export function isText(node: TipTapNode): node is TextNode {
  return node.type === "text";
}

export function isBlockquote(node: TipTapNode): node is BlockquoteNode {
  return node.type === "blockquote";
}

export function isCodeBlock(node: TipTapNode): node is CodeBlockNode {
  return node.type === "codeBlock";
}

export function isImage(node: TipTapNode): node is ImageNode {
  return node.type === "image";
}

export function isList(node: TipTapNode): node is BulletListNode | OrderedListNode {
  return node.type === "bulletList" || node.type === "orderedList";
}

export function isHorizontalRule(node: TipTapNode): node is HorizontalRuleNode {
  return node.type === "horizontalRule";
}
