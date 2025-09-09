// @/components/toc/tree-item.tsx
import {
  File,
  Folder,
  type TreeViewElement,
} from "@/components/extension/toc/tree-view-api";

type TreeItemProps = {
  elements: TreeViewElement[];
  onSelect?: (id: string) => void;
};

export const TreeItem = ({ elements, onSelect }: TreeItemProps) => {
  console.log(
    "🌳 TreeItem rendering with onSelect:",
    !!onSelect,
    "elements:",
    elements.length
  );

  return (
    <ul className="w-full space-y-1">
      {elements.map((element) => (
        <li key={element.id} className="w-full space-y-2">
          {element.children && element.children?.length > 0 ? (
            <Folder
              element={element.name}
              value={element.id}
              isSelectable={element.isSelectable}
              className="px-px pr-1"
            >
              <TreeItem
                key={element.id}
                aria-label={`folder ${element.name}`}
                elements={element.children}
                onSelect={onSelect}
              />
            </Folder>
          ) : (
            <File
              key={element.id}
              value={element.id}
              isSelectable={element.isSelectable}
              className={"px-1"}
              handleSelect={(id: string) => {
                console.log("📁 File clicked:", id, element.name);
                onSelect?.(id);
              }}
            >
              <span className="ml-1">{element?.name}</span>
            </File>
          )}
        </li>
      ))}
    </ul>
  );
};
