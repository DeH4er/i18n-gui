import { useStyletron } from "baseui";
import { ChevronDown, ChevronRight } from "baseui/icon";
import React, { useCallback } from "react";

function TreeViewLabel({ node, onClick, keyMode }) {
  const [, theme] = useStyletron();

  const onNodeClick = useCallback(() => {
    onClick(node);
  }, [node]);

  return (
    <div
      style={{
        ...theme.typography.font300,
        color: theme.colors.primary,
        userSelect: "none",
        padding: node.children ? "3px 5px" : "3px 5px 3px 30px",
        cursor: "pointer",
        background: node.isSelected ? theme.colors.mono300 : "",
      }}
      onClick={onNodeClick}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
        }}
      >
        {node.children && (
          <span
            style={{
              marginRight: "10px",
            }}
          >
            {node.isExpanded ? <ChevronDown /> : <ChevronRight />}
          </span>
        )}

        {keyMode === "tree" ? node.label : node.path.join(".")}
      </div>
    </div>
  );
}

export default React.memo(TreeViewLabel);
