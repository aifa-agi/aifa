// @/app/admin/pages/[slug]/(_service)/(_utils)/file-tree-transformer.ts

import { ContentStructure } from "@/app/@right/(_service)/(_types)/page-types";

export type TreeNode = {
  id: string;
  name: string;
  isSelectable?: boolean;
  children?: TreeNode[];
};

/**
 * Transforms ContentStructure array to TreeNode array for TOC component
 * ИСПРАВЛЕНО: Правильная логика для раскрываемого дерева
 */
export function fileTreeDataTransformer(
  contentStructures: ContentStructure[]
): TreeNode[] {
  function transformContentStructure(
    structure: ContentStructure,
    index: number,
    depth: number = 0
  ): TreeNode {
    // Generate unique ID
    const nodeId =
      structure.additionalData?.position?.order?.toString() ||
      `content-${depth}-${index}`;

    // Use tag as name, fallback to classification or generic name
    const nodeName: string =
      structure.tag || structure.classification || `content-${index}`;

    // Transform children recursively if they exist
    const children: TreeNode[] = [];
    if (
      structure.realContentStructure &&
      structure.realContentStructure.length > 0
    ) {
      children.push(
        ...structure.realContentStructure.map((child, childIndex) =>
          transformContentStructure(child, childIndex, depth + 1)
        )
      );
    }

    // ИСПРАВЛЕНИЕ: Логика isSelectable зависит от контекста
    const hasChildren = children.length > 0;

    const treeNode: TreeNode = {
      id: nodeId,
      name: nodeName,
      // ИСПРАВЛЕНО: Не устанавливаем isSelectable для раскрываемых узлов
      // Или устанавливаем в зависимости от логики приложения
      ...(hasChildren ? {} : { isSelectable: true }), // Листовые узлы селектируемые
    };

    // Add children only if they exist
    if (hasChildren) {
      treeNode.children = children;
    }

    return treeNode;
  }

  return contentStructures.map((structure, index) =>
    transformContentStructure(structure, index)
  );
}

/**
 * Альтернативная версия с более детальной логикой раскрытия
 */
export function fileTreeDataTransformerWithExpandLogic(
  contentStructures: ContentStructure[]
): TreeNode[] {
  function transformWithExpandLogic(
    structure: ContentStructure,
    index: number,
    depth: number = 0
  ): TreeNode {
    const nodeId = `${structure.classification || "content"}-${depth}-${index}`;
    const nodeName: string =
      structure.tag || structure.classification || `content-${index}`;

    // Transform children recursively
    const children: TreeNode[] = [];
    if (
      structure.realContentStructure &&
      structure.realContentStructure.length > 0
    ) {
      children.push(
        ...structure.realContentStructure.map((child, childIndex) =>
          transformWithExpandLogic(child, childIndex, depth + 1)
        )
      );
    }

    const hasChildren = children.length > 0;
    const isLeafNode = !hasChildren;

    // Логика селектируемости:
    // - Папки (узлы с детьми) - не селектируемые, но раскрываемые
    // - Файлы (листовые узлы) - селектируемые
    const treeNode: TreeNode = {
      id: nodeId,
      name: nodeName,
    };

    // Добавляем isSelectable только для листовых узлов
    if (isLeafNode) {
      treeNode.isSelectable = true;
    }
    // Для узлов с детьми НЕ добавляем isSelectable (undefined)
    // Это позволяет им быть раскрываемыми

    if (hasChildren) {
      treeNode.children = children;
    }

    return treeNode;
  }

  return contentStructures.map((structure, index) =>
    transformWithExpandLogic(structure, index)
  );
}

/**
 * Версия, полностью совместимая с оригинальным поведением
 */
export function fileTreeDataTransformerCompatible(
  contentStructures: ContentStructure[]
): TreeNode[] {
  function transformCompatible(
    structure: ContentStructure,
    index: number,
    depth: number = 0
  ): TreeNode {
    const nodeId =
      structure.additionalData?.position?.order?.toString() ||
      `content-${depth}-${index}`;

    const nodeName: string =
      structure.tag || structure.classification || `content-${index}`;

    // Process children
    const children: TreeNode[] = [];
    if (
      structure.realContentStructure &&
      structure.realContentStructure.length > 0
    ) {
      children.push(
        ...structure.realContentStructure.map((child, childIndex) =>
          transformCompatible(child, childIndex, depth + 1)
        )
      );
    }

    // ИСПРАВЛЕНО: Точно как в оригинальных данных
    const treeNode: TreeNode = {
      id: nodeId,
      name: nodeName,
      // НЕ добавляем isSelectable вообще - пусть компонент сам решает
    };

    // Добавляем детей если есть
    if (children.length > 0) {
      treeNode.children = children;
    }

    return treeNode;
  }

  return contentStructures.map((structure, index) =>
    transformCompatible(structure, index)
  );
}

/**
 * Отладочная версия для понимания структуры
 */
export function fileTreeDataTransformerDebug(
  contentStructures: ContentStructure[]
): TreeNode[] {
  function transformDebug(
    structure: ContentStructure,
    index: number,
    depth: number = 0
  ): TreeNode {
    const nodeId = `debug-${depth}-${index}`;

    // Добавляем информацию о глубине и типе в название
    const baseTag =
      structure.tag || structure.classification || `content-${index}`;
    const debugInfo = `[D${depth}] `;
    const childrenInfo = structure.realContentStructure?.length
      ? ` (${structure.realContentStructure.length} children)`
      : " (leaf)";

    const nodeName: string = `${debugInfo}${baseTag}${childrenInfo}`;

    const children: TreeNode[] = [];
    if (
      structure.realContentStructure &&
      structure.realContentStructure.length > 0
    ) {
      children.push(
        ...structure.realContentStructure.map((child, childIndex) =>
          transformDebug(child, childIndex, depth + 1)
        )
      );
    }

    return {
      id: nodeId,
      name: nodeName,
      ...(children.length > 0 ? { children } : {}),
    };
  }

  return contentStructures.map((structure, index) =>
    transformDebug(structure, index)
  );
}
