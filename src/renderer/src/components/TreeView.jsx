import { memo } from 'react';
import AutoSizer from 'react-virtualized-auto-sizer';
import { FixedSizeTree } from 'react-vtree';

import { useStyletron } from 'baseui';

import TreeViewLabel from './TreeViewLabel';

function TreeView({ data, onClick, keyMode }) {
  const [, theme] = useStyletron();
  const getNodeData = (node, nestingLevel) => ({
    data: {
      id: node.id,
      isOpenByDefault: node.isExpanded,
      node,
      nestingLevel,
      keyMode,
      onClick,
    },
    nestingLevel,
    node,
  });

  function* treeWalker() {
    for (let i = 0; i < data.length; i++) {
      yield getNodeData(data[i], 0);
    }

    while (true) {
      const parent = yield;

      for (let i = 0; i < parent.node.children?.length ?? 0; i++) {
        yield getNodeData(parent.node.children[i], parent.nestingLevel + 1);
      }
    }
  }

  if (!data.length) {
    return (
      <div
        style={{
          ...theme.typography.font300,
          width: '100%',
          height: '100%',
          boxSizing: 'border-box',
          padding: '10px',
          color: theme.colors.primary,
          userSelect: 'none',
        }}
      >
        Nothing there...
      </div>
    );
  }

  return (
    <AutoSizer disableWidth>
      {({ height }) => (
        <FixedSizeTree
          treeWalker={treeWalker}
          itemSize={30}
          height={height}
          width="100%"
        >
          {TreeViewLabel}
        </FixedSizeTree>
      )}
    </AutoSizer>
  );
}

export default memo(TreeView);
