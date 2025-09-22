// @/app/@right/(_service)/(_components)/content-renderer/index.tsx

import React from "react";
import { ExtendedSection } from "../../(_types)/section-types";
import { TipTapNode, TipTapDocument } from "./types";

// Импортируем все стили TipTap
import "@/components/tiptap/tiptap-node/blockquote-node/blockquote-node.scss";
import "@/components/tiptap/tiptap-node/code-block-node/code-block-node.scss";
import "@/components/tiptap/tiptap-node/heading-node/heading-node.scss";
import "@/components/tiptap/tiptap-node/horizontal-rule-node/horizontal-rule-node.scss";
import "@/components/tiptap/tiptap-node/image-node/image-node.scss";
import "@/components/tiptap/tiptap-node/list-node/list-node.scss";
import "@/components/tiptap/tiptap-node/paragraph-node/paragraph-node.scss";

export interface ContentRendererProps {
  sections: ExtendedSection[];
}

// Исправленный рендерер для заголовков
function renderHeading(node: TipTapNode, index: number): React.ReactNode {
  const level = node.attrs?.level || 1;
  const textAlign = node.attrs?.textAlign;
  const content = node.content?.map((child, childIndex) => renderTipTapNode(child, childIndex)) || [];

  const style = textAlign ? { textAlign: textAlign as React.CSSProperties['textAlign'] } : undefined;

  // Правильный способ создания динамических заголовков
  switch (level) {
    case 1:
      return <h1 key={index} style={style}>{content}</h1>;
    case 2:
      return <h2 key={index} style={style}>{content}</h2>;
    case 3:
      return <h3 key={index} style={style}>{content}</h3>;
    case 4:
      return <h4 key={index} style={style}>{content}</h4>;
    case 5:
      return <h5 key={index} style={style}>{content}</h5>;
    case 6:
      return <h6 key={index} style={style}>{content}</h6>;
    default:
      return <h1 key={index} style={style}>{content}</h1>;
  }
}

// Исправленный рендерер для параграфов
function renderParagraph(node: TipTapNode, index: number): React.ReactNode {
  const textAlign = node.attrs?.textAlign;
  const content = node.content?.map((child, childIndex) => renderTipTapNode(child, childIndex)) || [];

  const style = textAlign ? { textAlign: textAlign as React.CSSProperties['textAlign'] } : undefined;

  return (
    <p key={index} style={style}>
      {content}
    </p>
  );
}

// Рендерер для blockquote
function renderBlockquote(node: TipTapNode, index: number): React.ReactNode {
  const content = node.content?.map((child, childIndex) => renderTipTapNode(child, childIndex)) || [];

  return (
    <blockquote key={index}>
      {content}
    </blockquote>
  );
}

// Рендерер для code block
function renderCodeBlock(node: TipTapNode, index: number): React.ReactNode {
  const language = node.attrs?.language || "";
  const content = node.content?.map(child => child.text || "").join("") || "";

  return (
    <pre key={index}>
      <code className={language ? `language-${language}` : ""}>
        {content}
      </code>
    </pre>
  );
}

// Рендерер для horizontal rule
function renderHorizontalRule(index: number): React.ReactNode {
  return <hr key={index} />;
}

// Рендерер для изображений
function renderImage(node: TipTapNode, index: number): React.ReactNode {
  const src = node.attrs?.src || "";
  const alt = node.attrs?.alt || "";
  const title = node.attrs?.title;

  if (!src) return null;

  return (
    <img key={index} src={src} alt={alt} title={title} />
  );
}

// Рендерер для списков
function renderList(node: TipTapNode, index: number): React.ReactNode {
  const isOrdered = node.type === "orderedList";
  const content = node.content?.map((child, childIndex) => renderTipTapNode(child, childIndex)) || [];

  if (isOrdered) {
    return (
      <ol key={index}>
        {content}
      </ol>
    );
  }

  return (
    <ul key={index}>
      {content}
    </ul>
  );
}

// Рендерер для элементов списка
function renderListItem(node: TipTapNode, index: number): React.ReactNode {
  const content = node.content?.map((child, childIndex) => renderTipTapNode(child, childIndex)) || [];

  return (
    <li key={index}>
      {content}
    </li>
  );
}

// Рендерер для текста
function renderText(node: TipTapNode, index: number): React.ReactNode {
  return node.text || "";
}

// Основная функция рендеринга узла
function renderTipTapNode(node: TipTapNode, index: number): React.ReactNode {
  switch (node.type) {
    case "heading":
      return renderHeading(node, index);

    case "paragraph":
      return renderParagraph(node, index);

    case "blockquote":
      return renderBlockquote(node, index);

    case "codeBlock":
      return renderCodeBlock(node, index);

    case "horizontalRule":
      return renderHorizontalRule(index);

    case "image":
      return renderImage(node, index);

    case "bulletList":
    case "orderedList":
      return renderList(node, index);

    case "listItem":
      return renderListItem(node, index);

    case "text":
      return renderText(node, index);

    default:
      console.warn(`Unknown TipTap node type: ${node.type}`);
      return (
        <div key={index} className="p-2 bg-yellow-50 border border-yellow-200 rounded text-sm">
          [Неподдерживаемый тип: {node.type}]
        </div>
      );
  }
}

// Компонент для рендеринга TipTap документа
function renderTipTapDocument(document: TipTapDocument): React.ReactNode[] {
  if (!document?.content) {
    return [];
  }

  return document.content.map((node, index) => renderTipTapNode(node, index));
}

// Компонент для рендеринга отдельной секции
function renderSection(section: ExtendedSection, index: number): React.ReactNode {
  const { id, bodyContent, title, description } = section;

  return (
    <section key={id || index} className="mb-12 last:mb-0">
      {/* Заголовок секции если есть */}
      {title && (
        <header className="mb-6">
          <h1 className="text-3xl font-bold mb-3 text-gray-900 dark:text-gray-100">
            {title}
          </h1>
          {description && (
            <p className="text-xl text-gray-600 dark:text-gray-400 leading-relaxed">
              {description}
            </p>
          )}
        </header>
      )}

      {/* Контент секции с правильным классом для TipTap стилей */}
      {bodyContent && (
        <div className="tiptap ProseMirror">
          {renderTipTapDocument(bodyContent as TipTapDocument)}
        </div>
      )}
    </section>
  );
}

// Основной компонент ContentRenderer
export default function ContentRenderer({ sections }: ContentRendererProps) {
  if (!sections || sections.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center">
        <div className="w-16 h-16 mb-4 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
          <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
          Контент не найден
        </h2>
        <p className="text-gray-500 dark:text-gray-400">
          Нет доступных секций для отображения
        </p>
      </div>
    );
  }

  return (
    <div className="content-renderer">
      <main className="mx-auto max-w-4xl px-6 py-8">
        {sections.map((section, index) => renderSection(section, index))}
      </main>
    </div>
  );
}
