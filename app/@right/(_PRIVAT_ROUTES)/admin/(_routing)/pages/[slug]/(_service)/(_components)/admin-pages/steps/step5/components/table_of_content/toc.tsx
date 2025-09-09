import {
  Tree,
  type TreeViewElement,
  CollapseButton,
} from "@/components/extension/toc/tree-view-api";
import { TreeItem } from "./tree-item"; // Corrected import path

type TOCProps = {
  toc: TreeViewElement[];
};

export const TOC = ({ toc }: TOCProps) => {
  return (
    <Tree
      className="w-full h-60 bg-gray-900 p-2 rounded-md border border-gray-800"
      indicator={true}
    >
      {toc.map((element, _) => (
        <TreeItem key={element.id} elements={[element]} />
      ))}
      <CollapseButton elements={toc} expandAll={true} />
    </Tree>
  );
};
