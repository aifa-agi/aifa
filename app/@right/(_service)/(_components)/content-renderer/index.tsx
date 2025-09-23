// @/app/@right/(_service)/(_components)/content-renderer/index.tsx

"use client";

import React, { createRef, useEffect, useRef } from "react";
import { ExtendedSection } from "../../(_types)/section-types";
import { TipTapNode, TipTapDocument } from "./types";
import { useRouter, useSearchParams } from "next/navigation";
import { useAppContext } from "@/contexts/app-context";
import { useRightSidebar } from "@/contexts/right-sidebar-context";
import { useInteractiveSections } from "@/app/@right/(_service)/hooks/useInteractiveSections";
import { InteractiveSection } from "@/components/shared/interactive-section";
import { Button } from "@/components/ui/button";

// Импортируем все стили TipTap
import "@/components/tiptap/tiptap-node/blockquote-node/blockquote-node.scss";
import "@/components/tiptap/tiptap-node/code-block-node/code-block-node.scss";
import "@/components/tiptap/tiptap-node/heading-node/heading-node.scss";
import "@/components/tiptap/tiptap-node/horizontal-rule-node/horizontal-rule-node.scss";
import "@/components/tiptap/tiptap-node/image-node/image-node.scss";
import "@/components/tiptap/tiptap-node/list-node/list-node.scss";
import "@/components/tiptap/tiptap-node/paragraph-node/paragraph-node.scss";
import BlurImage from "../shared/blur-image";
import { getBlurDataURL, placeholderBlurhash } from "../../(_libs)/(_utils)/utils";
import Image from "next/image";
import { useTranslation } from "../../(_libs)/translation";

// Wrapper для максимальной ширины
function MaxWidthWrapper({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`mx-auto w-full max-w-screen-xl px-2.5 md:px-4 ${className}`}>
      {children}
    </div>
  );
}

// Типы для изображений страницы
export interface PageImage {
  href: string;
  alt?: string;
}

export interface ContentRendererProps {
  sections: ExtendedSection[];
  heroImage?: PageImage;
}

// Интерфейс для навигационных секций
interface NavigationSection {
  id: string;
  h2Title: string;
  shortTitle: string;
}

// Функция для извлечения первого H2 заголовка из TipTap документа
function extractFirstH2Heading(document: TipTapDocument): string | null {
  if (!document?.content) {
    return null;
  }

  for (const node of document.content) {
    if (node.type === "heading" && node.attrs?.level === 2 && node.content) {
      const headingText = extractTextFromNode(node);
      if (headingText.trim()) {
        return headingText.trim();
      }
    }
  }

  return null;
}

// Функция для извлечения текста из узла
function extractTextFromNode(node: TipTapNode): string {
  if (node.type === "text" && node.text) {
    return node.text;
  }

  if (node.content && Array.isArray(node.content)) {
    return node.content
      .map(childNode => extractTextFromNode(childNode))
      .join(" ");
  }

  return "";
}


// Компонент для отображения героического изображения
function HeroImage({ image }: { image: PageImage }) {
  return (
    <div className="hero-image-container mb-8">
      <div className="relative w-full h-64 md:h-80 lg:h-96 overflow-hidden rounded-lg 2xl:rounded-t-xl 2xl:rounded-b-none">
        <Image
          alt={image.alt || "Aifa dev image"}
          className="aspect-[1200/630] border-b object-cover md:rounded-t-xl"
          width={1200}
          height={630}
          priority
          placeholder="blur"
          src={image.href}
          sizes="(max-width: 768px) 770px, 1000px"
        />

      </div>
    </div>
  );
}



// Компонент навигационных кнопок для экранов до 2xl
function SectionNavigationButtons({
  navigationSections,
  onNavigate
}: {
  navigationSections: NavigationSection[];
  onNavigate: (sectionId: string) => void;
}) {
  if (navigationSections.length === 0) {
    return null;
  }

  return (
    <div className="sticky top-0 z-40 mb-6 2xl:hidden">
      <div className="overflow-x-auto custom-scrollbar">
        <div className="flex gap-4 min-w-fit bg-background py-2">
          {navigationSections.map(({ id, shortTitle }) => (
            <Button
              key={id}
              onClick={() => onNavigate(id)}
              variant="outline"
              className="whitespace-nowrap flex-shrink-0"
            >
              {shortTitle}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}

// Компонент боковой навигации для широких экранов
function SidebarTableOfContents({
  navigationSections,
  onNavigate,
}: {
  navigationSections: NavigationSection[];
  onNavigate: (sectionId: string) => void;
}) {
  if (navigationSections.length === 0) {
    return null;
  }


  const { t } = useTranslation();
  return (
    <div className="space-y-1">
      <h3 className="text-sm font-medium text-muted-foreground mb-3">
        {t("Contents")}
      </h3>
      <nav className="space-y-1">
        {navigationSections.map(({ id, h2Title }) => (
          <a
            key={id}
            onClick={(e) => {
              e.preventDefault();
              onNavigate(id);
            }}
            href={`#${id}`}
            className="block text-sm text-muted-foreground hover:text-foreground transition-colors py-1 leading-tight line-clamp-1 cursor-pointer"
            title={h2Title}
          >
            {h2Title}
          </a>
        ))}
      </nav>
    </div>
  );
}

// Компонент разделителя секций
function SectionSeparator() {
  return (
    <div className="section-separator">
      <div className="h-6" />
      <div className="w-full h-px bg-gray-200 dark:bg-gray-700" />
      <div className="h-9" />
    </div>
  );
}

// Исправленный рендерер для заголовков с padding для H2
function renderHeading(node: TipTapNode, index: number): React.ReactNode {
  const level = node.attrs?.level || 1;
  const textAlign = node.attrs?.textAlign;
  const content = node.content?.map((child, childIndex) => renderTipTapNode(child, childIndex)) || [];

  const style = textAlign ? { textAlign: textAlign as React.CSSProperties['textAlign'] } : undefined;

  // Добавляем padding для H2 заголовков: справа 36px, сверху 4px
  const h2Style = level === 2
    ? { ...style, paddingRight: '36px', paddingTop: '4px' }
    : style;

  // Правильный способ создания динамических заголовков
  switch (level) {
    case 1:
      return <h1 key={index} style={style}>{content}</h1>;
    case 2:
      return <h2 key={index} style={h2Style}>{content}</h2>;
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
function renderSection(
  section: ExtendedSection,
  index: number,
  isLastSection: boolean,
  sectionRef: React.RefObject<HTMLElement | null>,
  isSendMode: boolean,
  isHovered: boolean,
  isMobile: boolean,
  onHover: (id: string | null) => void,
  onActivate: (id: string) => void,
  onSend: (id: string) => void
): React.ReactNode {
  const { id, bodyContent } = section;

  return (
    <React.Fragment key={id || index}>
      <InteractiveSection
        id={id || `section-${index}`}
        ref={sectionRef}
        isSendMode={isSendMode}
        isHovered={isHovered}
        isMobile={isMobile}
        onHover={onHover}
        onActivate={onActivate}
        onSend={onSend}
      >
        {/* Контент секции с правильным классом для TipTap стилей */}
        {bodyContent && (
          <div className="tiptap ProseMirror">
            {renderTipTapDocument(bodyContent as TipTapDocument)}
          </div>
        )}
      </InteractiveSection>

      {/* Добавляем разделитель после каждой секции, кроме последней */}
      {!isLastSection && <SectionSeparator />}
    </React.Fragment>
  );
}

// Основной компонент ContentRenderer
export default function ContentRenderer({ sections, heroImage }: ContentRendererProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setInteractionContext } = useAppContext();
  const { isOpen, closeDrawer } = useRightSidebar();


  const {
    sendModeSectionId,
    setSendModeSectionId,
    hoveredSectionId,
    setHoveredSectionId,
    isMobile,
  } = useInteractiveSections();

  // Создание рефов для всех секций
  const sectionRefs = useRef<
    Record<string, React.RefObject<HTMLElement | null>>
  >(
    sections.reduce(
      (acc, section) => {
        const sectionId = section.id || `section-${sections.indexOf(section)}`;
        acc[sectionId] = createRef<HTMLElement>();
        return acc;
      },
      {} as Record<string, React.RefObject<HTMLElement | null>>
    )
  );

  // Извлечение навигационных секций
  const navigationSections: NavigationSection[] = sections
    .map((section, index) => {
      const sectionId = section.id || `section-${index}`;
      const h2Title = section.bodyContent
        ? extractFirstH2Heading(section.bodyContent as TipTapDocument)
        : null;

      if (!h2Title) return null;

      return {
        id: sectionId,
        h2Title,
        shortTitle: h2Title.substring(0, 10) + (h2Title.length > 10 ? '...' : '')
      };
    })
    .filter((item): item is NavigationSection => item !== null);

  const scrollTo = searchParams.get("scroll-to");

  // Эффект для прокрутки к секции
  useEffect(() => {
    if (!scrollTo) return;

    const ref = sectionRefs.current[scrollTo];
    if (ref?.current) {
      // Небольшая задержка для обеспечения корректного рендеринга
      const scrollTimer = setTimeout(() => {
        ref.current?.scrollIntoView({ behavior: "smooth", block: "start" });
        setSendModeSectionId(scrollTo);
      }, 100);

      // Таймер для сброса состояния и очистки URL
      const resetTimer = setTimeout(() => {
        setSendModeSectionId(null);
        // Используем shallow routing для очистки параметра
        const currentPath = window.location.pathname;
        const currentSearch = new URLSearchParams(window.location.search);
        currentSearch.delete("scroll-to");
        const newUrl = currentSearch.toString()
          ? `${currentPath}?${currentSearch.toString()}`
          : currentPath;

        router.push(newUrl, { scroll: false });
      }, 3500);

      return () => {
        clearTimeout(scrollTimer);
        clearTimeout(resetTimer);
      };
    }
  }, [scrollTo, setSendModeSectionId, router]);

  // Обработчик клика по кнопке навигации с shallow routing
  const handleNavigationClick = (sectionId: string) => {
    // Получаем текущий путь и параметры
    const currentPath = window.location.pathname;
    const currentSearch = new URLSearchParams(window.location.search);

    // Устанавливаем новый параметр scroll-to
    currentSearch.set("scroll-to", sectionId);

    // Формируем новый URL
    const newUrl = `${currentPath}?${currentSearch.toString()}`;

    // Используем shallow routing для предотвращения полной перезагрузки
    router.push(newUrl, { scroll: false });
  };

  // Обработчик отправки в чат
  const handleSendClick = (sectionId: string) => {
    const pageName = "Content Page";
    setInteractionContext(pageName, sectionId);
    if (isMobile && isOpen) {
      closeDrawer();
    }
    setTimeout(() => setSendModeSectionId(null), 1000);
  };

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
      <div className="relative">
        {/* Декоративная линия только для 2xl+ */}
        <div className="absolute top-52 w-full border-t hidden 2xl:block" />

        {/* Единая структура с условным grid layout */}
        <div className="2xl:block">
          <MaxWidthWrapper className="2xl:grid 2xl:grid-cols-4 2xl:gap-10 pt-8 max-md:px-0">
            {/* Основной контейнер с условными стилями */}
            <div className={`
              mx-auto max-w-4xl px-6 py-8 
              2xl:relative 2xl:col-span-3 2xl:mb-10 2xl:flex 2xl:flex-col 2xl:space-y-8 
              2xl:bg-background  2xl:px-0 2xl:py-0 2xl:max-w-none 2xl:mx-0
            `}>

              {/* Героическое изображение */}
              {heroImage && <HeroImage image={heroImage} />}

              {/* Контейнер контента с условным отступом */}
              <div className="2xl:px-[.8rem] 2xl:pb-10 2xl:md:px-8">

                {/* Навигационные кнопки для экранов до 2xl */}
                <SectionNavigationButtons
                  navigationSections={navigationSections}
                  onNavigate={handleNavigationClick}
                />

                {/* Рендеринг интерактивных секций */}
                {sections.map((section, index) => {
                  const sectionId = section.id || `section-${index}`;
                  const sectionRef = sectionRefs.current[sectionId];
                  const isLastSection = index === sections.length - 1;

                  return renderSection(
                    section,
                    index,
                    isLastSection,
                    sectionRef,
                    sendModeSectionId === sectionId,
                    hoveredSectionId === sectionId,
                    isMobile,
                    setHoveredSectionId,
                    setSendModeSectionId,
                    handleSendClick
                  );
                })}
              </div>
            </div>

            {/* Боковая навигация только для 2xl+ */}
            <div className="sticky top-20 col-span-1 mt-52 hidden 2xl:flex flex-col divide-y divide-muted self-start pb-24">
              <SidebarTableOfContents
                navigationSections={navigationSections}
                onNavigate={handleNavigationClick}
              />
            </div>
          </MaxWidthWrapper>
        </div>
      </div>
    </div>
  );
}
