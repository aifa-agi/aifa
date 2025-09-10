// @/app/admin/pages/[slug]/(_service)/(_components)/system-instruction-generator.tsx

import { MenuCategory } from "@/app/@right/(_service)/(_types)/menu-types";
import { PageData } from "@/app/@right/(_service)/(_types)/page-types";
import { DEFAULT_CONTENT_STRUCTURE } from "@/config/default-page-structure-config";
import { appConfig } from "@/config/appConfig";
import { useMemo } from "react";

interface SystemInstructionGeneratorProps {
  pageData: {
    page: PageData;
    category: MenuCategory;
  } | null;
  slug: string;
  writingStyle: string;
  contentFormat: string;
  customRequirements: string;
  writingStyles: Array<{
    value: string;
    label: string;
    description: string;
  }>;
  contentFormats: Array<{
    value: string;
    label: string;
    description: string;
  }>;
}

export function useSystemInstructionGenerator({
  pageData,
  slug,
  writingStyle,
  contentFormat,
  customRequirements,
  writingStyles,
  contentFormats,
}: SystemInstructionGeneratorProps) {
  return useMemo(() => {
    if (!pageData?.page) {
      return "";
    }

    const { page, category } = pageData;
    const selectedStyle = writingStyles.find((s) => s.value === writingStyle);
    const selectedFormat = contentFormats.find(
      (f) => f.value === contentFormat
    );

    // Enhanced image distribution strategy
    const totalImages = page.images?.length || 0;
    const usableImages = totalImages > 1 ? totalImages - 1 : 0; // Reserve first image for H1

    const getImageDistributionInstructions = () => {
      if (totalImages < 2) {
        return `IMAGE PLACEMENT: ${totalImages} images available (insufficient - minimum 2 required). Remove all img tags from structure. First image reserved for H1 title.`;
      }

      return `IMAGE PLACEMENT: ${totalImages} total images. Reserved for H1: 1 image. Available for structure: ${usableImages} images. Priority: H2 headings first, then H3. Use ![Alt text](image-reference-id) format.`;
    };

    // Generate available images list
    const imagesList =
      page.images
        ?.map(
          (img, index) =>
            `${index + 1}. ID: "${img.id}", Alt: "${img.alt || "Not specified"}"`
        )
        .join("\n") || "No images available";

    // Helper function to recursively update actualContent fields
    const updateContentStructure = (structure: any): any => {
      if (Array.isArray(structure)) {
        return structure.map((item) => updateContentStructure(item));
      }

      if (typeof structure === "object" && structure !== null) {
        const updated = { ...structure };

        // Update actualContent if it exists and is empty
        if (updated.additionalData?.actualContent === "") {
          updated.additionalData.actualContent =
            "need generate helpful content";
        }

        // Recursively update nested structures
        if (updated.realContentStructure) {
          updated.realContentStructure = updateContentStructure(
            updated.realContentStructure
          );
        }

        return updated;
      }

      return structure;
    };

    // Update the default structure
    const updatedStructure = updateContentStructure(DEFAULT_CONTENT_STRUCTURE);

    return `/**
 * =============================================================================
 * CONTENT STRUCTURE MATRIX FILLING SYSTEM
 * Task: Fill the provided content structure matrix with contextual data
 * =============================================================================
 */

/**
 * PAGE CONTEXT DATA
 */
PAGE_DATA: {
  title: "${page.title || page.linkName || "Untitled Page"}",
  description: "${page.description || ""}",
  slug: "${slug}",
  keywords: [${page.keywords?.map((k) => `"${k}"`).join(", ") || ""}],
  intent: "${page.intent || ""}",
  taxonomy: "${page.taxonomy || ""}",
  attention: "${page.attention || ""}",
  audiences: "${page.audiences || ""}",
  category: "${category?.title || ""}",
  
  images: [
${imagesList
  .split("\n")
  .map((line) => `    ${line}`)
  .join("\n")}
  ],
  
  writingStyle: "${selectedStyle?.label || ""}" - ${selectedStyle?.description || ""},
  contentFormat: "${selectedFormat?.label || ""}" - ${selectedFormat?.description || ""},
  customRequirements: "${customRequirements.trim()}"
}

/**
 * OUTPUT REQUIREMENTS
 */
OUTPUT_LANGUAGE: "${appConfig.lang}"
OUTPUT_FORMAT: "MARKDOWN"
${getImageDistributionInstructions()}

/**
 * =============================================================================
 * MATRIX FILLING INSTRUCTIONS
 * =============================================================================
 */

CRITICAL: You must fill the provided content structure matrix below. Take the existing structure AS-IS and fill ONLY the empty fields with appropriate content based on the page context.

MATRIX FILLING RULES:

1. PRESERVE STRUCTURE:
   - Keep the exact same JSON structure, order, and nesting
   - Do not add or remove any elements
   - Do not change any existing non-empty values
   - Fill only empty strings ("") and empty arrays ([])
   - actualContent fields marked as "need generate helpful content" should remain as-is

2. TOP-LEVEL FIELDS (H2 elements only):
   - classification: Content type (e.g., "Introduction", "Tutorial", "Comparison", "Conclusion")
   - keywords: Array of 3-5 specific keywords relevant to this section
   - taxonomy: Content classification for this section
   - attention: Why readers should care about this specific section (1-2 sentences)
   - intent: What this section aims to achieve (1 sentence)
   - audiences: Target audience for this section (be specific)
   - selfPrompt: Complete instructions for generating this entire section including nested content
   - designDescription: Visual design notes for this section
   - connectedDesignSectionId: Unique ID for this design section
   - additionalData.actualContent: Keep as "need generate helpful content"

3. CODE TAG USAGE:
   - code tags are not limited to programming code only
   - Use code tags for any copyable information: phone numbers, addresses, booking references, exact instructions
   - Examples: contact details, reservation codes, step-by-step commands, URLs, email addresses
   - Format as copyable text blocks that users can easily select and copy

4. NESTED LEVEL FIELDS:
   - Only fill empty strings ("") and empty arrays ([])
   - Keep actualContent as "need generate helpful content" where present
   - Do not add top-level exclusive fields to nested elements

5. SELFPROMPT REQUIREMENTS (H2 only):
   Each H2 selfPrompt must include:
   - Page context: title, description, target audience
   - Writing style: ${selectedStyle?.description || "professional and engaging"}
   - Content format requirements
   - Specific keywords to include naturally
   - Complete Markdown formatting instructions for entire section
   - Word count distribution across nested elements
   - Language: ${appConfig.lang}
   - Success criteria for the complete section
   - Instructions for all nested content (paragraphs, lists, images, etc.)
   - Note that actualContent fields are marked for content generation

6. CONTENT RELEVANCE:
   - All content must relate to: "${page.title}" - ${page.description}
   - Keywords should be relevant to page topic and section purpose
   - Classification should match content type and page intent
   - Attention should highlight unique value of each section

${
  customRequirements
    ? `
7. CUSTOM REQUIREMENTS:
   "${customRequirements}"
   Integrate these requirements into relevant sections' selfPrompts and classifications.
`
    : ""
}

/**
 * =============================================================================
 * MATRIX TO FILL
 * =============================================================================
 */

${JSON.stringify(updatedStructure, null, 2)}

/**
 * =============================================================================
 * RESPONSE FORMAT
 * =============================================================================
 */

CRITICAL REQUIREMENTS:
□ Return ONLY the JSON array (same structure as above)
□ Fill ALL empty strings and arrays with appropriate content
□ Preserve existing structure and word count limits
□ Keep actualContent as "need generate helpful content" where present
□ Use ${appConfig.lang} language for all content
□ Apply page context to all fields
□ Ensure selfPrompts are complete and autonomous
□ No wrapper objects, no additional text, just the filled JSON array

VALIDATION CHECKLIST:
□ Structure identical to provided matrix
□ All empty fields filled with relevant content except actualContent
□ actualContent fields remain as "need generate helpful content"
□ Keywords specific to each section
□ SelfPrompts complete and actionable
□ Language consistent (${appConfig.lang})
□ Content relevant to "${page.title}"
□ Classifications match section purposes
□ Word count limits preserved

Return the filled matrix now:`;
  }, [
    pageData,
    slug,
    writingStyle,
    contentFormat,
    customRequirements,
    writingStyles,
    contentFormats,
  ]);
}
