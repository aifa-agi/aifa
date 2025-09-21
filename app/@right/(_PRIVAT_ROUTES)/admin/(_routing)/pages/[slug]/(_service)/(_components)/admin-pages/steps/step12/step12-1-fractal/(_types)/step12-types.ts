//  @/app/@right/(_PRIVAT_ROUTES)/admin/(_routing)/pages/[slug]/(_service)/(_components)/admin-pages/steps/step12/step12-1-fractal/(_types)/step12-types.ts
export type SectionId = string;
export type JSONContent = Record<string, any>;


export type SectionState = {
 id: SectionId;
 label: string;
 hasData: boolean;     // green indicator (data present/edited)
 isLoading: boolean;   // loading while first-time fetch
 content: JSONContent | null; // null => not loaded yet
};


export type SectionEditorState = {
 sections: SectionState[];
 activeId: SectionId;
 saving: boolean;
};


export type SectionEditorApi = {
 setActive: (id: SectionId) => void;
 loadSectionData: (id: SectionId) => Promise<void>;
 updateSectionContent: (id: SectionId, content: JSONContent) => void;
 isAllReady: () => boolean;
 resetAllFlags: () => void;
 setSaving: (v: boolean) => void;
 getMergedDoc: () => JSONContent;
};


export type SectionEditorContextValue = SectionEditorState & SectionEditorApi;


