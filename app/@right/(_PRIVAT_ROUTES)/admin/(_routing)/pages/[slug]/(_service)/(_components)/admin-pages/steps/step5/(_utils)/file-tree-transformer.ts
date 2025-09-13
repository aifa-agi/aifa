// @/app/admin/pages/[slug]/(_service)/(_utils)/file-tree-transformer.ts

import { ContentStructure } from "@/app/@right/(_service)/(_types)/page-types";

export type TreeNode = {
  id: string;
  name: string;
  isSelectable?: boolean;
  children?: TreeNode[];
};

/**
 * Generates unique node ID using available ContentStructure fields
 * Приоритет: structure.id -> structure.order -> fallback к индексу
 */
function generateNodeId(
  structure: ContentStructure,
  index: number,
  depth: number = 0
): string {
  // Используем доступные поля из ContentStructure
  if (structure.id) {
    return structure.id;
  }

  if (structure.order) {
    return `order-${structure.order}`;
  }

  // Fallback к составному ID на основе классификации и позиции
  const baseId = structure.classification || "content";
  return `${baseId}-${depth}-${index}`;
}

/**
 * Generates display name for tree node
 */
function generateNodeName(structure: ContentStructure, index: number): string {
  // Приоритет: tag -> classification -> generic name
  return structure.tag || structure.classification || `content-${index}`;
}

/**
 * ✅ ИСПРАВЛЕННАЯ ВЕРСИЯ: Использует корневые поля ContentStructure
 * Transforms ContentStructure array to TreeNode array for TOC component
 */
export function fileTreeDataTransformer(
  contentStructures: ContentStructure[]
): TreeNode[] {
  function transformContentStructure(
    structure: ContentStructure,
    index: number,
    depth: number = 0
  ): TreeNode {
    // ✅ ИСПРАВЛЕНО: Используем корневые поля вместо additionalData.position
    const nodeId = generateNodeId(structure, index, depth);
    const nodeName = generateNodeName(structure, index);

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

    const hasChildren = children.length > 0;

    const treeNode: TreeNode = {
      id: nodeId,
      name: nodeName,
      // Листовые узлы делаем селектируемыми
      ...(hasChildren ? {} : { isSelectable: true }),
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
 * ✅ Улучшенная версия с расширенной логикой ID генерации
 */
export function fileTreeDataTransformerEnhanced(
  contentStructures: ContentStructure[]
): TreeNode[] {
  function transformEnhanced(
    structure: ContentStructure,
    index: number,
    depth: number = 0,
    parentId?: string
  ): TreeNode {
    // Генерируем уникальный ID с учётом иерархии
    let nodeId: string;

    if (structure.id) {
      nodeId = structure.id;
    } else if (structure.order) {
      nodeId = parentId
        ? `${parentId}-order-${structure.order}`
        : `order-${structure.order}`;
    } else {
      const baseId = structure.classification || structure.tag || "content";
      nodeId = parentId
        ? `${parentId}-${baseId}-${index}`
        : `${baseId}-${depth}-${index}`;
    }

    // Генерируем читаемое имя
    const nodeName = generateNodeName(structure, index);

    // Transform children recursively
    const children: TreeNode[] = [];
    if (
      structure.realContentStructure &&
      structure.realContentStructure.length > 0
    ) {
      children.push(
        ...structure.realContentStructure.map((child, childIndex) =>
          transformEnhanced(child, childIndex, depth + 1, nodeId)
        )
      );
    }

    const hasChildren = children.length > 0;
    const isLeafNode = !hasChildren;

    const treeNode: TreeNode = {
      id: nodeId,
      name: nodeName,
    };

    // Только листовые узлы селектируемые
    if (isLeafNode) {
      treeNode.isSelectable = true;
    }

    if (hasChildren) {
      treeNode.children = children;
    }

    return treeNode;
  }

  return contentStructures.map((structure, index) =>
    transformEnhanced(structure, index)
  );
}

/**
 * ✅ Версия с детальной информацией для отладки
 */
export function fileTreeDataTransformerDebug(
  contentStructures: ContentStructure[]
): TreeNode[] {
  function transformDebug(
    structure: ContentStructure,
    index: number,
    depth: number = 0
  ): TreeNode {
    const nodeId = generateNodeId(structure, index, depth);

    // Детальная информация для отладки
    const baseTag =
      structure.tag || structure.classification || `content-${index}`;
    const debugInfo = `[D${depth}]`;
    const idInfo = structure.id
      ? `[ID:${structure.id}]`
      : structure.order
        ? `[O:${structure.order}]`
        : "";
    const childrenInfo = structure.realContentStructure?.length
      ? ` (${structure.realContentStructure.length} children)`
      : " (leaf)";

    const nodeName = `${debugInfo}${idInfo} ${baseTag}${childrenInfo}`;

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
      ...(children.length > 0 ? { children } : { isSelectable: true }),
    };
  }

  return contentStructures.map((structure, index) =>
    transformDebug(structure, index)
  );
}

/**
 * ✅ Универсальная версия с поддержкой различных стратегий ID
 */
export type IdGenerationStrategy =
  | "id-first"
  | "order-first"
  | "hierarchical"
  | "classification-based";

export function fileTreeDataTransformerFlexible(
  contentStructures: ContentStructure[],
  strategy: IdGenerationStrategy = "id-first"
): TreeNode[] {
  function generateFlexibleId(
    structure: ContentStructure,
    index: number,
    depth: number,
    strategy: IdGenerationStrategy,
    parentId?: string
  ): string {
    switch (strategy) {
      case "id-first":
        return (
          structure.id ||
          (structure.order
            ? `order-${structure.order}`
            : `content-${depth}-${index}`)
        );

      case "order-first":
        return structure.order
          ? `order-${structure.order}`
          : structure.id || `content-${depth}-${index}`;

      case "hierarchical":
        const baseId = structure.id || structure.order || `${index}`;
        return parentId ? `${parentId}.${baseId}` : `${baseId}`;

      case "classification-based":
        const classification =
          structure.classification || structure.tag || "content";
        return structure.id || `${classification}-${depth}-${index}`;

      default:
        return structure.id || `content-${depth}-${index}`;
    }
  }

  function transformFlexible(
    structure: ContentStructure,
    index: number,
    depth: number = 0,
    parentId?: string
  ): TreeNode {
    const nodeId = generateFlexibleId(
      structure,
      index,
      depth,
      strategy,
      parentId
    );
    const nodeName = generateNodeName(structure, index);

    const children: TreeNode[] = [];
    if (
      structure.realContentStructure &&
      structure.realContentStructure.length > 0
    ) {
      children.push(
        ...structure.realContentStructure.map((child, childIndex) =>
          transformFlexible(child, childIndex, depth + 1, nodeId)
        )
      );
    }

    const hasChildren = children.length > 0;

    return {
      id: nodeId,
      name: nodeName,
      ...(hasChildren ? { children } : { isSelectable: true }),
    };
  }

  return contentStructures.map((structure, index) =>
    transformFlexible(structure, index)
  );
}
