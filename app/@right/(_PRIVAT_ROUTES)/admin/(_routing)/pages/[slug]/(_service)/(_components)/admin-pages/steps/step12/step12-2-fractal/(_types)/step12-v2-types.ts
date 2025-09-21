// @/app/@right/(_PRIVAT_ROUTES)/admin/(_routing)/pages/[slug]/(_service)/(_components)/admin-pages/steps/step12/step12-2-fractal/(_types)/step12-v2-types.ts
export type SectionId = string;

export type JSONContent = Record<string, any>;

/**
 * Section state for V2 - sections loaded from file system
 * Key difference: content comes from TipTap JSON files, no HTML parsing needed
 */
export type SectionStateV2 = {
  id: SectionId;
  label: string;
  hasData: boolean; // true if content exists in file system
  isLoading: boolean; // loading state during file system read
  content: JSONContent | null; // TipTap JSON from file system
};

/**
 * Editor state for V2 - manages file system sections
 */
export type SectionEditorStateV2 = {
  sections: SectionStateV2[];
  activeId: SectionId;
  saving: boolean;
};

/**
 * Editor API for V2 - adapted for SectionProvider integration
 */
export type SectionEditorApiV2 = {
  setActive: (id: SectionId) => void;
  loadSectionData: (id: SectionId) => Promise<void>;
  updateSectionContent: (id: SectionId, content: JSONContent) => void;
  isAllReady: () => boolean;
  resetAllFlags: () => void;
  setSaving: (v: boolean) => void;
  getMergedDoc: () => JSONContent;
};

/**
 * Combined context value for V2
 */
export type SectionEditorContextValueV2 = SectionEditorStateV2 & SectionEditorApiV2;

/**
 * File system section data structure - matches ExtendedSection from filesystem
 */
export interface FileSystemSection {
  id: string;
  bodyContent: JSONContent;
  order?: number;
  keywords?: string[];
}

/**
 * Payload for saving sections back to file system
 */
export interface FileSystemSectionPayload {
  href: string;
  sections: FileSystemSection[];
}
