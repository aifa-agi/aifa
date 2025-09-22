// @/app/config/badge-config.ts

export const ALL_BADGES: BadgeName[] = [
  "NEW",
  "AD",
  "UPDATED",
  "IMPORTANT",
  "BLOG"
];

export type BadgeName =
  | "NEW"
  | "AD"
  | "UPDATED"
  | "IMPORTANT"
  | "BLOG"
