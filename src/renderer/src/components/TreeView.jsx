import React from "react";
import TreeViewLabel from "./TreeViewLabel";

export default function TreeView({ data, onClick, keyMode }) {
  return (
    <div>
      {data.map((node) => (
        <div key={node.id}>
          <TreeViewLabel
            node={node}
            onClick={() => onClick(node)}
            keyMode={keyMode}
          />
          {node.children && node.isExpanded && (
            <div style={{ marginLeft: "20px" }}>
              <TreeView
                data={node.children}
                onClick={onClick}
                keyMode={keyMode}
              ></TreeView>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
