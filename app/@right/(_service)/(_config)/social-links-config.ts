// @/app/@right/(_service)/(_config)/social-links-config.ts
import { GitHubIcon, XIcon } from "@/components/shared/icons";
import { SocialLink } from "../(_types)/social-link-types";

export const socialLinks: SocialLink[] = [
  {
    title: "GitHub",
    url: "https://github.com/aifa-agi/aifa",
    icon: GitHubIcon,
  },
  {
    title: "X",
    url: "https://x.com/aifa_agi",
    icon: XIcon,
  },
  // ...другие соцсети
];
