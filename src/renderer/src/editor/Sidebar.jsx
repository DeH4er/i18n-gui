import { useStyletron } from "baseui";
import { Button, KIND, SIZE } from "baseui/button";
import { Input, SIZE as INPUT_SIZE } from "baseui/input";
import React, { useCallback, useEffect, useState } from "react";
import { VscCollapseAll, VscExpandAll } from "react-icons/vsc";
import { connect } from "react-redux";
import Tooltip from "src/components/Tooltip";
import TreeView from "src/components/TreeView";
import {
  collapseAll,
  expandAll,
  pull,
  push,
  selectFilteredTranslations,
  selectSearch,
  setSearch
} from "./editorSlice";
import Toolbar from "./Toolbar";

function Sidebar({
  setSearch,
  search,
  onTranslationClick,
  translations,
  expandAll,
  collapseAll,
  ...toolbarProps
}) {
  const minWidth = 300;
  const [barWidth, setBarWidth] = useState(minWidth);
  const [css, theme] = useStyletron();

  function handleMouseDown() {
    document.addEventListener("mouseup", handleMouseUp, true);
    document.addEventListener("mousemove", handleMouseMove, true);
  }

  function handleMouseUp() {
    document.removeEventListener("mouseup", handleMouseUp, true);
    document.removeEventListener("mousemove", handleMouseMove, true);
  }

  useEffect(() => {
    return () => {
      handleMouseDown();
    };
  }, []);

  const handleMouseMove = useCallback((e) => {
    e.preventDefault();
    setBarWidth(Math.max(minWidth, e.clientX - 10));
  });

  return (
    <div
      style={{
        display: "flex",
        height: "100%",
      }}
    >
      <section
        style={{
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          minWidth: `${barWidth}px`,
          maxWidth: `${barWidth}px`,
        }}
      >
        <Toolbar {...toolbarProps} />
        <div
          style={{
            margin: "10px 0",
            display: "flex",
          }}
        >
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            size={INPUT_SIZE.compact}
            placeholder="Search..."
          />

          <Tooltip tooltip="Expand all">
            <Button
              size={SIZE.compact}
              kind={KIND.secondary}
              onClick={() => expandAll()}
            >
              <VscExpandAll />
            </Button>
          </Tooltip>

          <Tooltip tooltip="Collapse all">
            <Button
              size={SIZE.compact}
              kind={KIND.secondary}
              onClick={() => collapseAll()}
            >
              <VscCollapseAll />
            </Button>
          </Tooltip>
        </div>
        <div
          style={{
            height: "100%",
            overflow: "auto",
          }}
        >
          <TreeView data={translations} onClick={onTranslationClick} />
        </div>
      </section>
      <div
        onMouseDown={(e) => handleMouseDown(e)}
        className={css({
          height: "100%",
          width: "20px",
          cursor: "col-resize",
          transition: `background ${theme.animation.timing200}`,
          ":hover": {
            background: theme.colors.backgroundSecondary,
          },
        })}
      ></div>
    </div>
  );
}

export default connect(
  (state, props) => ({
    translations: selectFilteredTranslations(state),
    search: selectSearch(state),
    ...props,
  }),
  {
    push,
    pull,
    setSearch,
    expandAll,
    collapseAll,
  }
)(Sidebar);
