import { memo, useCallback } from 'react';

import { useStyletron } from 'baseui';
import { ChevronDown, ChevronRight } from 'baseui/icon';

function TreeViewLabel({
  data: { node, nestingLevel, keyMode, onClick },
  style,
}) {
  const [, theme] = useStyletron();

  const onNodeClick = useCallback(() => {
    onClick(node);
  }, [node]);

  return (
    <div
      style={{
        ...style,
        ...theme.typography.font300,
        boxSizing: 'border-box',
        paddingLeft:
          keyMode === 'tree' ? nestingLevel * 20 + (node.children ? 0 : 25) : 0,
      }}
      data-testid="tree-node"
      data-testpath={node.path.join('.')}
      data-testexpanded={node.isExpanded}
      data-testselected={node.isSelected}
      data-testhaschildren={!!node.children}
      onClick={onNodeClick}
    >
      <div
        style={{
          background: node.isSelected ? theme.colors.mono300 : '',
          color: theme.colors.primary,
          userSelect: 'none',
          cursor: 'pointer',
          width: '100%',
          height: '100%',
          paddingLeft: '10px',
          alignItems: 'center',
          display: 'flex',
          boxSizing: 'border-box',
        }}
      >
        {node.children && (
          <span
            style={{
              marginRight: '10px',
            }}
          >
            {node.isExpanded ? <ChevronDown /> : <ChevronRight />}
          </span>
        )}

        {keyMode === 'tree' ? node.label : node.path.join('.')}
      </div>
    </div>
  );
}

export default memo(TreeViewLabel);
