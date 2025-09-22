// Page generation service for creating Next.js page.tsx files
// Critical template generator - preserve exact formatting and structure

import type { PageUploadPayload, ExtendedSection } from "@/app/@right/(_service)/(_types)/section-types";
import { generateMetadataFromSection } from "@/app/@right/(_service)/(_components)/content-renderer/utils";

/**
 * Generates complete page.tsx content with embedded sections data and metadata
 * Production-critical function - preserve exact template structure and formatting
 * 
 * @param firstPartHref - First part of the URL path (category)
 * @param secondPartHref - Second part of the URL path (subcategory)
 * @param payload - Complete page data including pageMetadata and sections
 * @returns string - Complete TypeScript/React page component code
 */
export function generatePageTsxContent(
  firstPartHref: string,
  secondPartHref: string,
  payload: PageUploadPayload
): string {
  const { pageMetadata, sections } = payload;
  
  // Use metadata from payload or fallback from first section
  let finalMetadata = {
    title: pageMetadata.title || "Страница без заголовка",
    description: pageMetadata.description || "Описание отсутствует", 
    keywords: pageMetadata.keywords || [],
    images: pageMetadata.images || []
  };

  // Fallback: if page metadata is empty, try to extract from first section
  if (!pageMetadata.title && !pageMetadata.description && sections.length > 0) {
    const fallbackMetadata = generateMetadataFromSection(sections[0]);
    finalMetadata = {
      title: fallbackMetadata.title,
      description: fallbackMetadata.description,
      keywords: fallbackMetadata.keywords,
      images: fallbackMetadata.images
    };
  }

  // Create JSON string for sections with proper formatting
  const sectionsJson = JSON.stringify(sections, null, 2);

  const pageContent = `// Auto-generated page - do not edit manually
// Generated on: ${new Date().toISOString()}
// Source href: /${firstPartHref}/${secondPartHref}
// Page metadata: ${pageMetadata.title || 'No title'} | ${sections.length} sections

import { Metadata } from "next";
import ContentRenderer from "@/app/@right/(_service)/(_components)/content-renderer";

// Встроенные данные секций
const sections = ${sectionsJson};

// Генерация метаданных для SEO из pageMetadata
export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "${finalMetadata.title.replace(/"/g, '\\"')}",
    description: "${finalMetadata.description.replace(/"/g, '\\"')}",
    keywords: ${JSON.stringify(finalMetadata.keywords)},
    
    // Open Graph метатеги
    openGraph: {
      title: "${finalMetadata.title.replace(/"/g, '\\"')}",
      description: "${finalMetadata.description.replace(/"/g, '\\"')}",
      type: "article",
      url: "/${firstPartHref}/${secondPartHref}",
      ${finalMetadata.images.length > 0 ? `images: [
        {
          url: "${finalMetadata.images[0].href}",
          alt: "${finalMetadata.images[0].alt?.replace(/"/g, '\\"') || ''}",
        }
      ],` : ''}
    },
    
    // Twitter метатеги
    twitter: {
      card: "summary_large_image",
      title: "${finalMetadata.title.replace(/"/g, '\\"')}",
      description: "${finalMetadata.description.replace(/"/g, '\\"')}",
      ${finalMetadata.images.length > 0 ? `images: ["${finalMetadata.images[0].href}"],` : ''}
    },
    
    // Дополнительные метатеги
    alternates: {
      canonical: "/${firstPartHref}/${secondPartHref}",
    },
    
    // Метаданные для поисковых роботов
    robots: {
      index: true,
      follow: true,
    },
    
    // Автор и издатель (можно настроить через env)
    authors: [{ name: process.env.SITE_AUTHOR || "Site Author" }],
  };
}

// Основной компонент страницы
export default function Page() {
  return (
    <article className="page-content">
      {/* Заголовок страницы */}
      <header className="page-header mb-8">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-gray-100 mb-4 leading-tight">
          ${finalMetadata.title.replace(/"/g, '\\"')}
        </h1>
        
        {/* Описание страницы */}
        <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-400 leading-relaxed max-w-4xl">
          ${finalMetadata.description.replace(/"/g, '\\"')}
        </p>
      </header>

      {/* Контент секций */}
      <div className="page-sections">
        <ContentRenderer sections={sections} />
      </div>
    </article>
  );
}
`;

  return pageContent;
}
