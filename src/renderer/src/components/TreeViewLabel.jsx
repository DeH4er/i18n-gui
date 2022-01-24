import { useStyletron } from "baseui";
import { ChevronDown, ChevronRight } from "baseui/icon";
import React from "react";

export default function TreeViewLabel({ node, onClick }) {
  const [, theme] = useStyletron();

  return (
    <div
      style={{
        ...theme.typography.font300,
        color: theme.colors.primary,
        userSelect: "none",
        padding: node.children ? "3px 5px" : "3px 5px 3px 30px",
        cursor: "pointer",
        background: node.isSelected ? theme.colors.mono300 : "",
        ":hover": {
          background: theme.colors.mono300,
        },
      }}
      onClick={() => onClick(node)}
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

        {typeof node.label === "function" ? node.label() : node.label}
      </div>
    </div>
  );
}
