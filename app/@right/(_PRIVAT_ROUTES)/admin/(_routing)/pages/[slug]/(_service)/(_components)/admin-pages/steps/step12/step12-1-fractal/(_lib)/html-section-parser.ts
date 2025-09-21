
// @//Users/romanbolshiyanov/Documents/Code/Aifa/aifa-main/app/@right/(_PRIVAT_ROUTES)/admin/(_routing)/pages/[slug]/(_service)/(_components)/admin-pages/steps/step12/step12-1-fractal/(_lib)/html-section-parser.ts

import type { SectionInfo } from '@/app/@right/(_service)/(_types)/page-types';
import type { JSONContent } from '@tiptap/react';


/**
* Extracts plain text from the first <h2>...</h2> in HTML.
* Falls back to "Section {index}" (1-based) when no H2 is found or it's empty.
*/
export function extractH2Label(html: string, index: number): string {
 const match = html?.match(/<h2[^>]*>([\s\S]*?)<\/h2>/i);
 if (!match) return `Section ${index + 1}`;
 const h2Inner = match[1] ?? '';
 const text = stripHtml(h2Inner).trim();
 return text.length > 0 ? text : `Section ${index + 1}`;
}


/**
* Converts a minimal subset of HTML into a tiptap-compatible JSON document.
* Preserves paragraphs and headings (h1-h6). Unknown inline tags are stripped.
*/
export function htmlToTiptapJSON(html: string): JSONContent {
 const normalized = (html || '').trim();
 if (!normalized) return emptyDoc();


 const nodes: JSONContent[] = [];
 const blockRegex = /<(h[1-6]|p)[^>]*>([\s\S]*?)<\/\1>/gi;


 let lastIndex = 0;
 let match: RegExpExecArray | null;


 while ((match = blockRegex.exec(normalized)) !== null) {
   const [full, tag, inner] = match;


   // Push any plain text before this block as a paragraph
   if (match.index > lastIndex) {
     const stray = stripHtml(normalized.slice(lastIndex, match.index)).trim();
     if (stray) nodes.push(paragraph(stray));
   }


   const text = stripHtml(inner).trim();
   if (text) {
     if (tag.toLowerCase().startsWith('h')) {
       const level = Number(tag.slice(1));
       nodes.push(heading(level, text));
     } else {
       nodes.push(paragraph(text));
     }
   }


   lastIndex = match.index + full.length;
 }


 // Tail content after the last block
 if (lastIndex < normalized.length) {
   const tail = stripHtml(normalized.slice(lastIndex)).trim();
   if (tail) nodes.push(paragraph(tail));
 }


 if (nodes.length === 0) nodes.push(paragraph(''));


 return { type: 'doc', content: nodes };
}


/**
* Maps SectionInfo[] into ParsedSection[] ready for Step 12 editor consumption.
* Filters out sections with empty or missing tempMDXContent.
*/
export function parseSectionsForStep12(sections: SectionInfo[]): ParsedSection[] {
 return (sections || [])
   .filter(s => {
     // Filter out sections with empty or missing content
     const content = s.tempMDXContent?.trim();
     return content && content.length > 0;
   })
   .map((s, idx) => ({
     id: s.id,
     label: extractH2Label(s.tempMDXContent || '', idx),
     content: htmlToTiptapJSON(s.tempMDXContent || ''),
   }));
}


/** Consumer-friendly shape for Step 12 editors and selectors. */
export interface ParsedSection {
 id: string;
 label: string;
 content: JSONContent;
}


/* ----------------- Internal helpers ----------------- */


/** Strips HTML tags and decodes a small set of common entities. */
function stripHtml(input: string): string {
 const withLines = (input || '').replace(/<\s*br\s*\/?>/gi, '\n');
 const noTags = withLines.replace(/<[^>]+>/g, '');
 return decodeEntities(noTags);
}


function decodeEntities(text: string): string {
 return (text || '')
   .replace(/&nbsp;/g, ' ')
   .replace(/&amp;/g, '&')
   .replace(/&lt;/g, '<')
   .replace(/&gt;/g, '>')
   .replace(/&quot;/g, '"')
   .replace(/&#39;/g, "'");
}


function emptyDoc(): JSONContent {
 return { type: 'doc', content: [paragraph('')] };
}


function paragraph(text: string): JSONContent {
 return { type: 'paragraph', content: [{ type: 'text', text }] };
}


function heading(level: number, text: string): JSONContent {
 const safe = Math.min(6, Math.max(1, level || 2));
 return { type: 'heading', attrs: { level: safe }, content: [{ type: 'text', text }] };
}




