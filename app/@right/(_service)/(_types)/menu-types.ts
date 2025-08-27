// @/app/(_service)/types/menu-types.ts

import { PageData } from "./page-types";

export interface MenuCategory {  
  title: string;
  pages: PageData[];
  order?: number; 
}