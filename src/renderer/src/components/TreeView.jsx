import React from 'react';
import TreeViewLabel from './TreeViewLabel';

const MemoizedTreeView = React.memo(TreeView);

function TreeView({ data, onClick, keyMode }) {
  return (
    <div>
      {data.map((node) => (
        <div key={node.id}>
          <TreeViewLabel node={node} onClick={onClick} keyMode={keyMode} />
          {node.children && node.isExpanded && (
            <div style={{ marginLeft: '20px' }}>
              <MemoizedTreeView
                data={node.children}
                onClick={onClick}
                keyMode={keyMode}
              ></MemoizedTreeView>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default MemoizedTreeView;
