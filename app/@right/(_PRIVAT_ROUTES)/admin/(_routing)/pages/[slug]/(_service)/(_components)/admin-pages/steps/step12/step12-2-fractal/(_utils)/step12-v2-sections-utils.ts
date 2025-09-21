// @/app/@right/(_PRIVAT_ROUTES)/admin/(_routing)/pages/[slug]/(_service)/(_components)/admin-pages/steps/step12/step12-2-fractal/(_utils)/step12-v2-sections-utils.ts/**
 

import type { JSONContent } from "@tiptap/react";
import type { SectionStateV2 } from "../(_types)/step12-v2-types";

/**
 * Merges multiple TipTap JSON documents into a single document
 * Used for creating unified preview of all sections
 */
export function mergeDocs(sections: SectionStateV2[]): JSONContent {
  const realSections = sections.filter(s => s.id !== "all" && s.content);
  
  if (realSections.length === 0) {
    return {
      type: "doc",
      content: [
        {
          type: "paragraph",
          content: [
            {
              type: "text",
              text: ""
            }
          ]
        }
      ]
    };
  }

  const mergedContent: JSONContent[] = [];
  
  realSections.forEach((section, index) => {
    if (!section.content?.content) return;
    
    // Add section content
    mergedContent.push(...section.content.content);
    
    // Add separator between sections (except last)
    if (index < realSections.length - 1) {
      mergedContent.push({
        type: "horizontalRule"
      });
    }
  });

  return {
    type: "doc",
    content: mergedContent
  };
}

/**
 * Validates TipTap JSON content structure
 * Ensures content from file system is valid for editor
 */
export function isValidTipTapContent(content: any): content is JSONContent {
  if (!content || typeof content !== "object") return false;
  
  // Must have type property
  if (!content.type || typeof content.type !== "string") return false;
  
  // Doc type must have content array
  if (content.type === "doc") {
    return Array.isArray(content.content);
  }
  
  return true;
}

/**
 * Creates empty TipTap JSON document
 * Used as fallback when section has no content
 */
export function createEmptyDoc(): JSONContent {
  return {
    type: "doc",
    content: [
      {
        type: "paragraph",
        content: [
          {
            type: "text",
            text: ""
          }
        ]
      }
    ]
  };
}

/**
 * Extracts text content from TipTap JSON for display purposes
 * Used for generating section labels and previews
 */
export function extractTextFromTipTap(content: JSONContent): string {
  if (!content?.content) return "";
  
  const extractFromNode = (node: any): string => {
    if (node.type === "text") {
      return node.text || "";
    }
    
    if (node.content && Array.isArray(node.content)) {
      return node.content.map(extractFromNode).join("");
    }
    
    return "";
  };
  
  return content.content.map(extractFromNode).join(" ").trim();
}

/**
 * Validates all sections are ready for saving
 * Checks that all sections have valid content
 */
export function areAllSectionsV2Ready(sections: SectionStateV2[]): boolean {
  const realSections = sections.filter(s => s.id !== "all");
  
  if (realSections.length === 0) return false;
  
  return realSections.every(section => {
    return section.hasData && 
           section.content && 
           isValidTipTapContent(section.content);
  });
}

/**
 * Counts total sections excluding synthetic "all" section
 * Used for progress indicators
 */
export function getRealSectionsCount(sections: SectionStateV2[]): number {
  return sections.filter(s => s.id !== "all").length;
}

/**
 * Gets section by ID with null safety
 * Used throughout the application for safe section access
 */
export function findSectionV2ById(sections: SectionStateV2[], id: string): SectionStateV2 | null {
  return sections.find(s => s.id === id) || null;
}

/**
 * Creates section label from TipTap content
 * Extracts first heading or uses fallback
 */
export function generateSectionLabel(content: JSONContent | null, fallbackIndex: number): string {
  if (!content?.content) {
    return `Section ${fallbackIndex + 1}`;
  }
  
  // Look for first heading
  for (const node of content.content) {
    if (node.type?.startsWith("heading") && node.content) {
      const text = extractTextFromTipTap({ type: "doc", content: node.content });
      if (text.trim()) {
        return text.trim();
      }
    }
  }
  
  // Fallback to first paragraph
  for (const node of content.content) {
    if (node.type === "paragraph" && node.content) {
      const text = extractTextFromTipTap({ type: "doc", content: node.content });
      if (text.trim()) {
        const truncated = text.trim().substring(0, 50);
        return truncated.length < text.trim().length ? `${truncated}...` : truncated;
      }
    }
  }
  
  return `Section ${fallbackIndex + 1}`;
}
