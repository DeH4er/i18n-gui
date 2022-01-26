import { useStyletron } from "baseui";
import { Input, SIZE } from "baseui/input";
import React, { useCallback, useEffect, useState } from "react";
import { connect } from "react-redux";
import TreeView from "src/components/TreeView";
import {
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
          }}
        >
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            size={SIZE.compact}
            placeholder="Search..."
          />
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
  }
)(Sidebar);
