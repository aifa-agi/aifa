// File: @/app/admin/pages/[slug]/(_service)/(_components)/system-instruction-generator.tsx

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

/**
 * Understanding (step-by-step) [1]
 * 1) Keep all inputs and structure intact; only enhance the generated SYSTEM instruction text. [1]
 * 2) Sanitize user-provided Custom Requirements to prevent breaking the template (escape quotes, collapse newlines). [1]
 * 3) Define an explicit H2 selfPrompt suffix that embeds page-level settings (writing style, content format, custom requirements). [1]
 * 4) Add strict rules in MATRIX and CRITICAL REQUIREMENTS: every H2 selfPrompt MUST end with this exact suffix literal. [1]
 * 5) Preserve all other business rules (word budgets, SEO metadata, no content generation, image rules). [1]
 */

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

    // Helper: sanitize user input to keep instruction integrity (escape quotes, remove newlines) [1]
    const sanitizeForInstruction = (input: string) =>
      input
        .replace(/\\/g, "\\\\")
        .replace(/"/g, '\\"')
        .replace(/\r?\n/g, " ")
        .trim(); // [1]

    const sanitizedCustom = sanitizeForInstruction(customRequirements || ""); // [1]

    // Enhanced image distribution strategy (unchanged) [1]
    const totalImages = page.images?.length || 0;
    const usableImages = totalImages > 1 ? totalImages - 1 : 0; // Reserve first image for H1 [1]
    const getImageDistributionInstructions = () => {
      if (totalImages < 2) {
        return `IMAGE PLACEMENT: ${totalImages} images available (insufficient - minimum 2 required). Remove all img tags from structure. First image reserved for H1 title.`;
      }
      return `IMAGE PLACEMENT: ${totalImages} total images. Reserved for H1: 1 image. Available for structure: ${usableImages} images. Priority: H2 headings first, then H3. Use !Alt text format.`;
    };

    // Generate available images list (unchanged) [1]
    const imagesList =
      page.images
        ?.map(
          (img, index) =>
            `${index + 1}. ID: "${img.id}", Alt: "${img.alt || "Not specified"}"`
        )
        .join("\n") || "No images available";

    // Helper: ensure actualContent placeholders in default structure (unchanged) [1]
    const updateContentStructure = (structure: any): any => {
      if (Array.isArray(structure)) {
        return structure.map((item) => updateContentStructure(item));
      }
      if (typeof structure === "object" && structure !== null) {
        const updated = { ...structure };
        // Normalize placeholder [1]
        if (updated.additionalData?.actualContent === "") {
          updated.additionalData.actualContent =
            "need generate helpful content";
        }
        if (updated.realContentStructure) {
          updated.realContentStructure = updateContentStructure(
            updated.realContentStructure
          );
        }
        return updated;
      }
      return structure;
    };

    // Update the default structure (unchanged) [1]
    const updatedStructure = updateContentStructure(DEFAULT_CONTENT_STRUCTURE);

    // Define explicit H2 selfPrompt suffix literal to be appended by the model (in Russian, as requested) [1]
    const h2SelfPromptSuffixLiteral =
      `• также следует учитывать пользовательские настройки, сделанные ко всей странице: ` +
      `writing-style:{title:${selectedStyle?.label || ""}, description:${selectedStyle?.description || ""}}, ` +
      `content-format:{title:${selectedFormat?.label || ""}, description:${selectedFormat?.description || ""}}, ` +
      `custom requirements and specifications:{${sanitizedCustom || "—"}} •`; // [1]

    return `/**
* =============================================================================
* CONTENT STRUCTURE MATRIX FILLING SYSTEM (SEO-ORIENTED, ALL LEVELS)
* Task: Fill the provided content structure matrix with contextual SEO metadata
* =============================================================================
*/
/**
* PAGE CONTEXT DATA
*/
PAGE_DATA: {
  title: "${page.title || page.linkName || "Untitled Page"}",
  description: "${page.description || ""}",
  slug: "${slug}",
  keywords: [${page.keywords?.map((k) => `"${k}"`).join(", ") || ""}],... intent: "${page.intent || ""}",
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
  customRequirements: "${sanitizedCustom}"
}
/**
* OUTPUT REQUIREMENTS
*/
OUTPUT_LANGUAGE: "${appConfig.lang}"
OUTPUT_FORMAT: "JSON"
${getImageDistributionInstructions()}
/**
* =============================================================================
* MATRIX FILLING INSTRUCTIONS (APPLY TO ALL ELEMENTS)
* =============================================================================
*/
CRITICAL: Fill the provided content structure matrix below. Preserve all nodes and their order. You MAY add missing optional metadata fields (keywords, intent, audiences, taxonomy, attention, selfPrompt, classification) to ANY existing element, but MUST NOT add or remove nodes (no new elements, no deletions).
MATRIX FILLING RULES:
1) PRESERVE STRUCTURE
- Keep the exact same JSON structure, order, and nesting of nodes (no new nodes, no deletions).
- You MAY introduce missing optional metadata fields on existing nodes.
- Do not change any existing non-empty values.
- Fill all empty strings ("") and empty arrays ([]); set absent optional fields with proper values.
- additionalData.actualContent MUST remain "need generate helpful content" on ALL levels (do NOT generate body content at this step).
2) REQUIRED FIELDS FOR ALL ELEMENTS
- For EVERY element (h2, h3, h4, p, ul, ol, li, blockquote, code, table, thead, tbody, tr, td, th, img) provide:
  • keywords: array of 2–5 concise, relevant, non-duplicative terms (LSI encouraged).
  • intent: one sentence stating the purpose of THIS element.
  • audiences: targeted readers for THIS element (specific where applicable).
  • taxonomy: concise semantic/functional category for THIS element.
  • attention: one short, value-oriented sentence explaining why THIS element matters.
  • selfPrompt: autonomous, actionable instruction to generate THIS element’s content later
    (include constraints, formatting, do/do-not list; reference PAGE_DATA when helpful).
- classification:
  • For headings (h2/h3/h4): use semantic type (e.g., "Guide", "HowTo", "Comparison", "FAQ", "Summary").
  • For technical tags: use "technical" or omit if not meaningful.
2.1) H2 SELFPROMPT MANDATORY PAGE-SETTINGS SUFFIX
- Define H2_SELFPROMPT_SUFFIX (literal, copy exactly):
  "${h2SelfPromptSuffixLiteral}"
- For EVERY H2 node: append this suffix LITERALLY at the END of selfPrompt without modifications (keep spaces, bullets, braces, punctuation exactly).
3) WORD BUDGETS FOR HEADINGS (STRICT)
- Set advisory budgets at heading nodes:
  • H2: additionalData.minWords = 1300, additionalData.maxWords = 1500.
  • H3: additionalData.minWords = 400,  additionalData.maxWords = 1000.
  • H4: additionalData.minWords = 350,  additionalData.maxWords = 500.
- Do NOT generate body content; additionalData.actualContent stays as "need generate helpful content".
4) WORD BUDGETS FOR NON-HEADINGS (ADVISORY)
- If existing min/max are present and non-zero — preserve them.
- If zero or missing, set reasonable advisory bounds by type:
  • p           : 60–160 words
  • li          : 8–30 words
  • ul/ol (body): minWords 40–120, maxWords 80–240 (for the list as a whole)
  • blockquote  : 18–60 words
  • code        : use 10–120 words as proxy (do not output code now; only metadata)
  • table       : 20–120 words (accompanying description; table cells not generated now)
  • img         : 0–0 is acceptable (alt/metadata covers semantics)
5) WORD BUDGET DISTRIBUTION (PARENT → CHILDREN)
- For ANY heading node (h2/h3/h4), the sum of children’s minWords MUST be within the parent’s minWords..maxWords.
- The sum of children’s maxWords MUST NOT exceed the parent’s maxWords.
- If some children already have explicit min/max, adjust remaining siblings to keep the sums within the parent budget.
- If a heading has no children, keep its own budget as set above (no content generation now).
6) SEO OPTIMIZATION (LSI & CONSISTENCY)
- Use PAGE_DATA keywords naturally (no stuffing); include LSI/synonyms on element level.
- Ensure metadata across hierarchy is consistent and non-contradictory.
- Tailor intent/audiences/taxonomy/attention to each element’s role in the user journey.
- selfPrompt must include clear formatting constraints (Markdown/MDX heading levels, list usage, code fences policy, tables/images placement).
7) CODE TAG USAGE (COPYABLE INFO)
- The code tag can represent copyable text beyond programming code (phones, addresses, booking refs, commands, URLs, emails).
- Do NOT generate any actual content now; only metadata + advisory min/max + placeholder.
${
  sanitizedCustom
    ? `
8) CUSTOM REQUIREMENTS:
"${sanitizedCustom}"
- Integrate these requirements into EACH element’s selfPrompt and metadata where relevant.
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
□ Return ONLY the JSON array (same structure and node order).
□ Fill ALL elements with SEO metadata: keywords, intent, audiences, taxonomy, attention, selfPrompt.
□ Provide classification for headings; "technical" for non-semantic tags when meaningful.
□ Ensure additionalData.minWords/maxWords are present for EVERY node.
□ Headings budgets set as: H2 (1300–1500), H3 (400–1000), H4 (350–500).
□ Children’s min/max sums MUST fit within the parent’s budget (both sums).
□ Keep additionalData.actualContent == "need generate helpful content" everywhere.
□ Language/metadata must be coherent with "${appConfig.lang}".
□ Do NOT generate body content at this step.
□ For EVERY H2: selfPrompt MUST end with H2_SELFPROMPT_SUFFIX exactly as defined (literal match).
VALIDATION CHECKLIST:
□ Structure identical (no new nodes, no deletions).
□ ALL nodes have complete SEO metadata (keywords/intent/audiences/taxonomy/attention/selfPrompt).
□ Headings/min/max match required budgets; children sums fit within parent budgets.
□ Non-headings have reasonable advisory min/max if previously zero/missing.
□ No keyword stuffing; LSI present where helpful; terminology consistent.
□ Language consistent (${appConfig.lang}); relevance to "${page.title}" maintained.
□ H2 selfPrompts end with the exact defined suffix including bullets and braces.
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
