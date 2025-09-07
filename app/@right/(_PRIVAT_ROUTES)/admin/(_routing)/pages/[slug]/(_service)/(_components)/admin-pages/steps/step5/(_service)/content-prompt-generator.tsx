// @/app/admin/pages/[slug]/(_service)/(_components)/article-generator-instruction.tsx

import { MenuCategory } from "@/app/@right/(_service)/(_types)/menu-types";
import { PageData } from "@/app/@right/(_service)/(_types)/page-types";
import { useMemo } from "react";

interface ArticleGeneratorInstructionProps {
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

export function useArticleGeneratorInstruction({
  pageData,
  slug,
  writingStyle,
  contentFormat,
  customRequirements,
  writingStyles,
  contentFormats,
}: ArticleGeneratorInstructionProps) {
  return useMemo(() => {
    if (!pageData?.page) {
      return "";
    }

    const { page, category } = pageData;
    const selectedStyle = writingStyles.find((s) => s.value === writingStyle);
    const selectedFormat = contentFormats.find(
      (f) => f.value === contentFormat
    );

    // ✅ Compact user-focused prompt generation
    return `Create document using the following user information:

**TOPIC**: "${page.title || page.linkName || "Untitled Page"}"

**PAGE CONTEXT**:
- Description: ${page.description || "No specific description provided"}
- Keywords: ${page.keywords?.join(", ") || "No specific keywords"}
- Target audience: ${page.audiences || "General audience"}
- Content purpose: ${page.intent || "Informative content"}
- Page taxonomy: ${page.taxonomy || "General"}
- Category: ${category?.title || "Uncategorized"}

**PERSONALIZATION SETTINGS**:
- Writing style: ${selectedStyle?.description || writingStyle}
- Content format: ${selectedFormat?.description || contentFormat}
${customRequirements ? `- Additional requirements: ${customRequirements}` : ""}

**CONTENT GENERATION REQUIREMENTS**:

1. **Structure Compliance**: Use the document structure defined in system instructions - maintain hierarchical organization and follow all contentRequirements for each element.

2. **Content Validation**: 
   - Verify each paragraph contains minimum 150 words
   - Ensure lists have 3-7 meaningful items (8+ words each)
   - Confirm headers reflect content that follows
   - Check all elements provide practical value

3. **Quality Standards**:
   - Write comprehensive, detailed content
   - Include specific examples and practical advice  
   - Use active voice and clear structure
   - Integrate keywords naturally throughout content
   - Maintain consistent tone matching writing style

4. **Technical Requirements**:
   - Generate substantial content (aim for comprehensive coverage)
   - Follow markdown formatting standards
   - Ensure content flows logically between sections
   - Create meaningful connections between elements

5. **Completion Validation**:
   - Review that each structural element has been fully developed
   - Confirm content matches specified audience and purpose
   - Verify adherence to personalization settings
   - Ensure no placeholder text or incomplete sections

Generate complete, comprehensive article content following these specifications and the structural template provided in system instructions.`;
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
