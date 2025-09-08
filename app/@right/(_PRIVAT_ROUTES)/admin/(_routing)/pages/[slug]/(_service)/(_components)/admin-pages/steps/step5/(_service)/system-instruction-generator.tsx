// @/app/admin/pages/[slug]/(_service)/(_components)/system-instruction-generator.tsx

import { MenuCategory } from "@/app/@right/(_service)/(_types)/menu-types";
import {
  ContentStructure,
  PageData,
} from "@/app/@right/(_service)/(_types)/page-types";
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
        return `
IMAGE PLACEMENT STRATEGY:
- Total available images: ${totalImages} (INSUFFICIENT - minimum 2 required)
- RESULT: Remove ALL img tags from content structure
- Focus on text-based content elements only
- Use blockquotes, code blocks, and lists for visual variety
- First image (if any) should be placed manually under H1 title outside this structure`;
      }

      return `
IMAGE PLACEMENT STRATEGY:
- Total available images: ${totalImages}
- Reserved for H1: 1 image (first image - outside content structure)
- Available for content structure: ${usableImages} images
- PRIORITY 1: Place images under ## (H2) headings first
- PRIORITY 2: Place remaining images under ### (H3) headings  
- PRIORITY 3: If images exceed available slots, distribute evenly
- Each image should reference actual images from pageData.images (index 1-${totalImages - 1} for content structure)
- Use descriptive alt text based on image context and surrounding content`;
    };

    // HTML to Markdown conversion mapping
    const getMarkdownInstructions = () => `
MARKDOWN CONVERSION REQUIREMENTS:
- h1 → # Heading 1
- h2 → ## Heading 2  
- h3 → ### Heading 3
- h4 → #### Heading 4
- p → Regular paragraph text (no special markup)
- ul → - Unordered list item
- ol → 1. Numbered list item
- li → Individual list item content
- blockquote → > Quoted text
- code → \`\`\`language
  Code block content
  \`\`\`
- table → | Column 1 | Column 2 | Column 3 |
           |----------|----------|----------|
           | Data 1   | Data 2   | Data 3   |
- img → ![Alt text description](image-reference-id)
- strong → **Bold text**
- em → *Italic text*

MARKDOWN FORMATTING RULES:
- Use proper spacing between sections
- Add blank lines before and after headings
- Ensure proper table formatting with alignment
- Use backticks for inline code: \`code\`
- Use triple backticks for code blocks with language specification
- Images should have descriptive alt text
- Lists should have proper indentation for nested items`;

    const expandContentStructure = (
      structure: ContentStructure[],
      level = 0
    ): string => {
      if (!structure || structure.length === 0) {
        return level === 0 ? "aiRecommendContentStructure: []" : "";
      }

      const indent = "  ".repeat(level + 1);
      const items = structure
        .map((item, index) => {
          let result = `${indent}{\n`;

          if (item.tag) result += `${indent}  tag: "${item.tag}",\n`;

          if (item.keywords)
            result += `${indent}  keywords: [${item.keywords.map((k) => `"${k}"`).join(", ")}],\n`;
          if (item.intent) result += `${indent}  intent: "${item.intent}",\n`;
          if (item.taxonomy)
            result += `${indent}  taxonomy: "${item.taxonomy}",\n`;
          if (item.attention)
            result += `${indent}  attention: "${item.attention}",\n`;
          if (item.audiences)
            result += `${indent}  audiences: "${item.audiences}",\n`;
          if (item.selfPrompt)
            result += `${indent}  selfPrompt: "${item.selfPrompt}",\n`;

          // Add linksToSource support
          if (item.linksToSource && item.linksToSource.length > 0)
            result += `${indent}  linksToSource: [${item.linksToSource.map((link) => `"${link}"`).join(", ")}],\n`;

          if (item.additionalData?.actualContent) {
            result += `${indent}  actualContent: "${item.additionalData.actualContent}",\n`;
          }
          if (item.additionalData?.minWords) {
            result += `${indent}  minWords: ${item.additionalData.minWords},\n`;
          }
          if (item.additionalData?.maxWords) {
            result += `${indent}  maxWords: ${item.additionalData.maxWords},\n`;
          }

          if (
            item.realContentStructure &&
            item.realContentStructure.length > 0
          ) {
            result += `${indent}  realContentStructure: [\n`;
            result += expandContentStructure(
              item.realContentStructure,
              level + 2
            );
            result += `\n${indent}  ],\n`;
          }

          result += `${indent}}`;
          return result;
        })
        .join(",\n");

      return level === 0
        ? `aiRecommendContentStructure: [\n${items}\n]`
        : items;
    };

    // Generate available images list
    const imagesList =
      page.images
        ?.map(
          (img, index) =>
            `${index + 1}. ID: "${img.id}", Alt: "${img.alt || "Not specified"}", Href: "${img.href || "Not specified"}"`
        )
        .join("\n") || "No images available";

    return `/**
 * =============================================================================
 * ENHANCED AI CONTENT STRUCTURE GENERATION SYSTEM
 * Task: Generate autonomous content blocks with research-enhanced sources
 * =============================================================================
 */

/**
 * =============================================================================
 * AUTONOMOUS CONTENT BLOCKS CONCEPT
 * =============================================================================
 */

CRITICAL UNDERSTANDING REQUIRED:
Each element in aiRecommendContentStructure MUST become a COMPLETELY AUTONOMOUS block
that can be passed to a separate AI model for content generation WITHOUT access 
to original page data or other structure elements. Each block will include curated
source links for research-based content generation.

AUTONOMY PRINCIPLE:
- Each element = standalone task for AI
- selfPrompt MUST contain ALL necessary information
- linksToSource provide curated research materials
- NO external dependencies or references to other data
- Result: ready-to-use prompt for content generation with sources

AUTONOMY SUCCESS CRITERIA:
✓ Element can be understood WITHOUT reading other elements
✓ selfPrompt contains ALL contextual information needed
✓ linksToSource provide specific, relevant research materials
✓ Can be passed to different AI model independently
✓ Other model will receive sufficient context for generation
✓ All formatting and style requirements are specified
✓ Target audience and intent are clearly defined

/**
 * PRIMARY OBJECTIVE:
 * Generate content structure that outputs in MARKDOWN format with intelligent
 * image distribution strategy, ensures COMPLETE AUTONOMY of each content block,
 * and provides curated source links for research-enhanced content generation.
 */

/**
 * =============================================================================
 * COMPLETE PAGE DATA (REAL VALUES)
 * =============================================================================
 */

REAL PAGE DATA: {
  title: "${page.title || page.linkName || "Untitled Page"}",
  linkName: "${page.linkName || ""}",
  description: "${page.description || ""}",
  slug: "${slug}",
  href: "${page.href || `/${slug}`}",
  keywords: [${page.keywords?.map((k) => `"${k}"`).join(", ") || ""}],
  isPublished: ${page.isPublished || false},
  type: "${page.type || ""}",
  intent: "${page.intent || ""}",
  taxonomy: "${page.taxonomy || ""}",
  attention: "${page.attention || ""}",
  audiences: "${page.audiences || ""}",
  
  category: {
    title: "${category?.title || ""}"
  },
  
  images: [
${imagesList
  .split("\n")
  .map((line) => `    ${line}`)
  .join("\n")}
  ],
  
  personalization: {
    writingStyle: {
      value: "${writingStyle}",
      label: "${selectedStyle?.label || ""}",
      description: "${selectedStyle?.description || ""}"
    },
    contentFormat: {
      value: "${contentFormat}",
      label: "${selectedFormat?.label || ""}",
      description: "${selectedFormat?.description || ""}"
    },
    customRequirements: "${customRequirements.trim()}"
  },

  ${expandContentStructure(page.aiRecommendContentStructure || [])}
}

/**
 * =============================================================================
 * LANGUAGE AND OUTPUT FORMAT SETTINGS
 * =============================================================================
 */

OUTPUT_LANGUAGE: "${appConfig.lang}"
OUTPUT_FORMAT: "MARKDOWN"

- Generate ALL content in "${appConfig.lang}" language
- Output MUST be in Markdown format, NOT HTML
- Use proper Markdown syntax for all elements
- Maintain cultural context and idioms appropriate for "${appConfig.lang}" speakers

${getImageDistributionInstructions()}

${getMarkdownInstructions()}

/**
 * =============================================================================
 * SOURCE LINKS REQUIREMENTS FOR RESEARCH-ENHANCED CONTENT
 * =============================================================================
 */

CRITICAL: Each content element MUST include curated source links for research

MANDATORY linksToSource REQUIREMENTS:
1. DIVERSE AND UNIQUE SOURCES:
   - Each element should have 3-5 unique, relevant source links
   - Avoid duplicate sources across different elements
   - Prioritize authoritative, recent sources (2024-2025)
   - Include mix of: official sites, industry reports, expert articles

2. SOURCE RELEVANCE:
   - Links must directly relate to the specific element's topic
   - Sources should contain information needed for that particular section
   - Prioritize sources with practical, actionable information
   - Include both general overview and specific detail sources

3. SOURCE QUALITY CRITERIA:
   - Official ferry company websites and schedules
   - Government tourism and transport authorities
   - Reputable travel guides and industry publications
   - Recent news articles about ferry services
   - Family travel blogs with verified experiences
   - Maritime safety and regulation sources

EXAMPLE OF PROPER linksToSource:
For a section about "Ferry Routes and Schedules":
linksToSource: [
  "https://www.navieraarmas.com/en/routes/mainland-canary-islands",
  "https://www.fredolsen.es/en/routes-schedules-tenerife-2025",
  "https://turismo.gobiernodecanarias.org/en/maritime-transport",
  "https://www.puertosdeestado.es/ferry-connections-canary-islands",
  "https://www.tenerife-information.co.uk/ferry-travel-guide"
]

INVALID linksToSource EXAMPLES:
❌ Generic travel sites without specific ferry information
❌ Outdated sources (pre-2024)
❌ Duplicate links used in other elements
❌ Sources in wrong languages for target audience
❌ Unreliable or promotional-only sources

/**
 * =============================================================================
 * SELF-PROMPT REQUIREMENTS FOR AUTONOMY
 * =============================================================================
 */

CRITICAL: selfPrompt MUST BE COMPLETELY SELF-SUFFICIENT

MANDATORY selfPrompt COMPONENTS:
1. PAGE CONTEXT:
   - Include page title: "${page.title || page.linkName}"
   - Include page description: "${page.description}"
   - Include page intent: "${page.intent}"

2. WRITING SPECIFICATIONS:
   - Writing style: "${selectedStyle?.label} (${selectedStyle?.description})"
   - Content format: "${selectedFormat?.label} (${selectedFormat?.description})"
   - Target audience: "${page.audiences || "General audience"}"

3. TECHNICAL REQUIREMENTS:
   - Specific Markdown formatting requirements
   - Word count limits (minWords/maxWords)
   - Keywords to include: specify exact keywords for this element
   - Language: "${appConfig.lang}"

4. CONTEXTUAL INFORMATION:
   - What this element should achieve (intent)
   - Why it matters for the reader (attention)
   - How it fits into overall content strategy

5. RESEARCH INSTRUCTIONS:
   - Reference to using provided linksToSource for current information
   - Instructions to extract and synthesize information from sources
   - Guidelines for citing and integrating research findings

EXAMPLE OF PROPER AUTONOMOUS selfPrompt:
"Create an introduction section for the article '${page.title}' about ${page.description}. 
Writing style: ${selectedStyle?.description || "professional and engaging"}. 
Target audience: ${page.audiences || "general readers"}. 
Format: Markdown with ## heading followed by 2-3 paragraphs. 
Include keywords: [specify exact keywords]. 
Length: 200-300 words. 
Tone: informative yet accessible. 
Purpose: hook readers and establish article credibility. 
Context: This is the opening section that follows the main title. 
Research: Use provided linksToSource to gather current information about ferry services, schedules, and family travel options. Synthesize information from multiple sources to create comprehensive, up-to-date content.
Language: ${appConfig.lang}. 
Expected output: ## Introduction heading with compelling content that introduces the topic and previews key points."

INVALID selfPrompt EXAMPLES (DO NOT USE):
❌ "Write introduction" (missing context)
❌ "Create content for this section" (no specifications)
❌ "Generate text about the topic" (no formatting requirements)
❌ "Write according to page data" (external dependency)

/**
 * =============================================================================
 * CONTENT VALIDATION AND QUALITY REQUIREMENTS
 * =============================================================================
 */

MANDATORY VALIDATION REQUIREMENTS:
1. AUTONOMY VALIDATION:
   - Each element can work independently
   - selfPrompt contains complete instructions
   - linksToSource provide relevant research materials
   - No references to external data or other elements
   - Clear success criteria for content generation

2. SOURCE VALIDATION:
   - Each element has 3-5 unique, authoritative source links
   - Sources are directly relevant to the element's topic
   - No duplicate sources across different elements
   - Sources are accessible and recent (2024-2025 preferred)
   - Mix of official, industry, and expert sources

3. MARKDOWN FORMAT COMPLIANCE:
   - All generated content must use proper Markdown syntax
   - Verify correct heading hierarchy (# → ## → ### → ####)
   - Ensure proper spacing and formatting
   - Use appropriate Markdown elements for each content type

4. FACTUAL ACCURACY:
   - Verify all generated content aligns with provided title and description
   - Ensure consistency with page intent, taxonomy, and audience data
   - Cross-reference generated content with existing keywords
   - Validate that content serves the specified page purpose

5. STRUCTURE INTEGRITY:
   - Maintain hierarchical logic (## → ### → ####)
   - Ensure proper nesting of content elements
   - Validate word count ranges for each element type
   - Check that all required fields are populated

6. CONTENT QUALITY:
   - Generate human-like, engaging content that matches writing style
   - Avoid repetitive phrases and maintain variety
   - Ensure proper flow between sections
   - Create meaningful connections between content blocks

7. IMAGE DISTRIBUTION COMPLIANCE:
   - Follow image placement strategy exactly
   - Use proper Markdown image syntax: ![alt](reference)
   - Include descriptive alt text for accessibility
   - Reference correct image indices from pageData.images

AUTONOMY VALIDATION CHECKLIST:
For each structure element, verify:
□ Can this element be understood WITHOUT reading other elements?
□ Does selfPrompt contain ALL necessary information for generation?
□ Does linksToSource contain 3-5 unique, relevant source links?
□ Are sources authoritative and recent?
□ Do links provide specific information needed for this element?
□ Are sources diverse and non-duplicated across elements?
□ Can I pass ONLY this element to another AI model successfully?
□ Will another AI model receive sufficient context for quality generation?
□ Are all format, style, and technical requirements specified?
□ Is the target audience clearly defined within the element?
□ Are success criteria and expected outcomes clearly stated?
□ Will ChatGPT be able to extract useful content from these links?

QUALITY CONTROL CHECKLIST:
□ Content matches page title and description
□ Writing style is consistent throughout
□ All required fields are filled with meaningful content
□ Word counts fall within specified ranges
□ Images are properly distributed according to strategy
□ Content flows logically from section to section
□ Generated text is factually consistent
□ Language and localization are correct
□ Markdown formatting is valid and consistent
□ Each element is completely autonomous
□ Source links are unique and relevant per element

/**
 * =============================================================================
 * PRACTICAL EXAMPLE OF AUTONOMOUS ELEMENT
 * =============================================================================
 */

EXAMPLE OF CORRECTLY FILLED AUTONOMOUS ELEMENT:
{
  tag: "h2",
  keywords: ["SEO optimization", "search engines", "website ranking", "organic traffic"],
  intent: "Educate beginners about fundamental SEO principles and their importance",
  taxonomy: "Educational content / SEO basics",
  attention: "Essential knowledge every website owner needs to improve search visibility",
  audiences: "Beginner webmasters, small business owners, content creators without technical background",
  selfPrompt: "Create a comprehensive section titled 'Understanding SEO Fundamentals' for an article about website optimization. Page context: '${page.title}' - ${page.description}. Target audience: complete beginners to SEO without technical experience. Writing style: ${selectedStyle?.description || "clear, friendly, and educational without jargon"}. Format: Markdown with ## heading followed by 3-4 informative paragraphs (400-500 words total). Include these keywords naturally: SEO optimization, search engines, website ranking, organic traffic. Structure: Start with definition of SEO, explain why it matters, provide 2-3 actionable tips, end with encouraging statement. Tone: supportive mentor helping newcomers. Research: Use provided linksToSource to gather current SEO best practices, algorithm updates, and beginner-friendly strategies. Synthesize information from multiple sources to create comprehensive, up-to-date content. Language: ${appConfig.lang}. Success criteria: reader understands what SEO is and feels motivated to learn more. Expected markdown output: ## Understanding SEO Fundamentals followed by well-structured paragraphs with practical examples.",
  linksToSource: [
    "https://developers.google.com/search/docs/fundamentals/seo-starter-guide",
    "https://moz.com/beginners-guide-to-seo",
    "https://searchengineland.com/seo-guide-basics-21642",
    "https://backlinko.com/seo-this-year",
    "https://ahrefs.com/blog/seo-basics/"
  ],
  actualContent: "",
  minWords: 400,
  maxWords: 500,
  realContentStructure: []
}

/**
 * =============================================================================
 * AI TASK: AUTONOMOUS CONTENT STRUCTURE EXPANSION
 * =============================================================================
 */

YOUR PRIMARY TASK:
1. Study the REAL PAGE DATA above thoroughly
2. Take the existing aiRecommendContentStructure (if any)
3. Fill ALL fields for EVERY element with COMPLETE AUTONOMOUS INFORMATION
4. If aiRecommendContentStructure is empty - create complete structure from scratch
5. Preserve ALL existing fields without changes
6. Apply image distribution strategy based on available images (minimum 2 required)
7. Ensure each element passes autonomy validation
8. Generate content instructions that output in MARKDOWN format
9. Provide curated source links for each element

DETAILED FILLING REQUIREMENTS:

FOR EACH CONTENT ELEMENT, PROVIDE:
- keywords: Specific, relevant keywords for THIS particular element (not generic page keywords)
- intent: Clear, specific goal this element should achieve in the overall content strategy
- taxonomy: Precise content classification for this element (e.g., "Introduction/Hook", "Tutorial/Step-by-step", "Conclusion/Call-to-action")
- attention: Compelling reason why readers should care about THIS specific section
- audiences: Detailed description of who will benefit most from THIS particular element
- linksToSource: Array of 3-5 unique, authoritative source URLs that contain specific information needed for generating this particular element. Sources must be:
  * Directly relevant to the element's topic
  * Recent and authoritative (2024-2025 preferred)
  * Diverse (no duplicates with other elements)
  * Accessible and in appropriate language
  * Containing practical, actionable information
- selfPrompt: COMPLETE, AUTONOMOUS instructions that include:
  * Full page context (title, description, intent)
  * Specific writing style and format requirements
  * Target audience for this element
  * Exact keywords to include
  * Word count requirements
  * Markdown formatting specifications
  * Research instructions for using linksToSource
  * Success criteria and expected outcome
  * Tone and voice guidelines
  * Language specification
  * Examples of expected output structure

CRITICAL CONTEXT TO INCLUDE IN EVERY selfPrompt:
- Page context: title="${page.title}", description="${page.description}"
- Writing style: ${selectedStyle?.label} (${selectedStyle?.description})
- Content format: ${selectedFormat?.label} (${selectedFormat?.description})
- Target audience: ${page.audiences || "General audience"}
- Specific Markdown formatting requirements with examples
- Research instructions for using provided source links
- Quality criteria for this element type
- Language: ${appConfig.lang}
- Success metrics for generated content

CRITICAL: linksToSource are essential for subsequent content generation phase. Each link will be accessed by ChatGPT to extract current, factual information. Select sources that contain specific, practical information relevant to this exact element.

${
  customRequirements
    ? `
USER'S CUSTOM REQUIREMENTS:
"${customRequirements}"

MANDATORY: Integrate these requirements into appropriate structure elements.
Each relevant selfPrompt MUST incorporate these custom requirements with specific instructions on how to implement them.
`
    : ""
}

=============================================================================
 * RESPONSE FORMAT AND VALIDATION
 * =============================================================================
 */

CRITICAL REQUIREMENTS:
1. RETURN ONLY VALID JSON ARRAY (NOT OBJECT)
2. PRESERVE ALL EXISTING FIELDS
3. FILL ALL NEW FIELDS WITH COMPLETE AUTONOMOUS INFORMATION
4. DO NOT ADD COMMENTS IN JSON
5. ENSURE COMPLETE AUTONOMY OF EACH ELEMENT
6. PROVIDE CURATED SOURCE LINKS FOR EACH ELEMENT
7. APPLY IMAGE DISTRIBUTION STRATEGY (2+ images minimum)
8. GENERATE IN "${appConfig.lang}" LANGUAGE
9. ENSURE MARKDOWN OUTPUT FORMAT INSTRUCTIONS

// ✅ ИСПРАВЛЕННЫЙ ФОРМАТ ОТВЕТА:
RESPONSE FORMAT - RETURN ONLY THE ARRAY (NO WRAPPER OBJECT):
[
  {
    "tag": "h2",
    "keywords": ["keyword1", "keyword2"],
    "intent": "specific intent for this element",
    "taxonomy": "content classification",
    "attention": "why readers should care",
    "audiences": "target audience for this element",
    "selfPrompt": "complete autonomous instructions...",
    "linksToSource": [
      "https://source1.com",
      "https://source2.com",
      "https://source3.com"
    ],
    "additionalData": {
      "minWords": 200,
      "maxWords": 400,
      "actualContent": ""
    },
    "realContentStructure": []
  }
  // Additional elements here...
]

CRITICAL: DO NOT wrap the array in an object with "aiRecommendContentStructure" field.
Return ONLY the ContentStructure array directly.

FINAL VALIDATION BEFORE RESPONDING:
□ JSON is a direct array, NOT an object
□ Array contains ContentStructure elements
□ No wrapper object with "aiRecommendContentStructure"
□ JSON is syntactically valid
□ All existing data is preserved without modification
□ New fields are meaningfully filled with detailed information
□ Each element has 3-5 unique, relevant source links
□ No duplicate sources across different elements
□ Sources are authoritative and accessible
□ Image strategy is correctly applied (meets 2+ images minimum threshold)
□ EVERY element passes autonomy validation checklist
□ Content validation requirements are comprehensively addressed
□ Language setting is respected throughout
□ Markdown formatting requirements are detailed in each selfPrompt
□ Research instructions are included in each selfPrompt
□ Quality standards are exceeded
□ selfPrompt fields contain COMPLETE autonomous instructions
□ Each element can work independently without external context
□ Custom requirements are properly integrated where applicable

AUTONOMY FINAL CHECK:
Ask yourself for each element: "If I gave ONLY this single element with its linksToSource to ChatGPT with no other context, would it be able to generate high-quality, properly formatted, research-based content that perfectly fits the intended purpose?"

If the answer is anything other than "YES" - the element needs more detailed information or better source links.

BEGIN COMPREHENSIVE ANALYSIS AND AUTONOMOUS STRUCTURE GENERATION WITH RESEARCH SOURCES NOW!

IMPORTANT: Your response must be a valid JSON array that starts with [ and ends with ], containing ContentStructure objects.`;
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
