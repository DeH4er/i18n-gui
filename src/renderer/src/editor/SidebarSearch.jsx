import { Button, KIND, SIZE } from 'baseui/button';
import { Input, SIZE as INPUT_SIZE } from 'baseui/input';
import { PLACEMENT } from 'baseui/popover';
import React, { memo } from 'react';
import { BsListNested, BsListUl } from 'react-icons/bs';
import { VscCollapseAll, VscExpandAll } from 'react-icons/vsc';
import { connect } from 'react-redux';
import Tooltip from 'src/components/Tooltip';
import {
  collapseAll,
  expandAll,
  selectKeyMode,
  selectSearch,
  setKeyMode,
  setSearch,
} from './editorSlice';

function SidebarSearch({
  search,
  setSearch,
  keyMode,
  collapseAll,
  setKeyMode,
  expandAll,
}) {
  return (
    <div
      style={{
        margin: '10px 0',
        display: 'flex',
      }}
    >
      <Tooltip
        tooltip="Search keys by translations or key name"
        placement={PLACEMENT.right}
      >
        <div style={{ flex: '1' }}>
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            size={INPUT_SIZE.compact}
            placeholder="Search..."
            type="search"
            clearable
          />
        </div>
      </Tooltip>

      {keyMode === 'tree' && (
        <>
          <Tooltip tooltip="Expand all" placement={PLACEMENT.right}>
            <Button
              data-testid="expand-all"
              size={SIZE.compact}
              kind={KIND.secondary}
              onClick={() => expandAll()}
            >
              <VscExpandAll />
            </Button>
          </Tooltip>

          <Tooltip tooltip="Collapse all" placement={PLACEMENT.right}>
            <Button
              data-testid="collapse-all"
              size={SIZE.compact}
              kind={KIND.secondary}
              onClick={() => collapseAll()}
            >
              <VscCollapseAll />
            </Button>
          </Tooltip>

          <Tooltip tooltip="List view" placement={PLACEMENT.right}>
            <Button
              size={SIZE.compact}
              kind={KIND.secondary}
              onClick={() => setKeyMode('list')}
            >
              <BsListUl />
            </Button>
          </Tooltip>
        </>
      )}

      {keyMode === 'list' && (
        <Tooltip tooltip="Tree view" placement={PLACEMENT.right}>
          <Button
            size={SIZE.compact}
            kind={KIND.secondary}
            onClick={() => setKeyMode('tree')}
          >
            <BsListNested />
          </Button>
        </Tooltip>
      )}
    </div>
  );
}

export default memo(
  connect(
    (state, props) => ({
      search: selectSearch(state),
      keyMode: selectKeyMode(state),
      ...props,
    }),
    {
      setSearch,
      collapseAll,
      expandAll,
      setKeyMode,
    }
  )(SidebarSearch)
);
