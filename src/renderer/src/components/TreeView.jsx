import React from "react";
import TreeViewLabel from "./TreeViewLabel";

export default function TreeView({ data, onClick }) {
  return (
    <div>
      {data.map((node) => (
        <div key={node.id}>
          <TreeViewLabel node={node} onClick={() => onClick(node)} />
          {node.children && node.isExpanded && (
            <div style={{ marginLeft: "20px" }}>
              <TreeView data={node.children} onClick={onClick}></TreeView>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
