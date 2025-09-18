// @/app/(_service)/types/menu-types.ts

import { PageData } from "./page-types";

export interface MenuCategory {
  title: string;      // русское название для отображения
  href?: string;      // необязательное поле с url категории (латиница)
  pages: PageData[];
  order?: number;
}