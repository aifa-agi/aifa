// @/app/@right/(_service)/(_types)/social-link-types.ts
import { ComponentType, SVGProps } from "react";

export type SocialLink = {
  title: string;
  url: string;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
};
