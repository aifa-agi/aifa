// @/app/@right/(_service)/(_types)\page-transformer-custom-types/custom-double-presentation-types.ts

export interface DoublePresentationCustomSection {
  id: string;
  type: "double-presentation-section";
  metaData: {
    metaTitle: string;
    metaDescription: string;
  };
  leftItem: {
    mediaUrl: string;
    title: string;
    description: string;
  };
  rightItem: {
    mediaUrl: string;
    title: string;
    description: string;
  };
}
