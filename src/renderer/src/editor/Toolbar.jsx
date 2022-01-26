import { useStyletron } from "baseui";
import { Button, KIND, SIZE } from "baseui/button";
import { StatefulPopover, TRIGGER_TYPE } from "baseui/popover";
import React from "react";
import {
  FiBox,
  FiChevronLeft,
  FiDownload,
  FiKey,
  FiSettings,
  FiUpload,
} from "react-icons/fi";
import { connect } from "react-redux";
import { useNavigate } from "react-router-dom";
import { pull, push } from "./editorSlice";

function ToolbarTooltip({ tooltip, children }) {
  const [, theme] = useStyletron();
  return (
    <StatefulPopover
      content={() => (
        <div style={{ ...theme.typography.font200, padding: "10px 20px" }}>
          {tooltip}
        </div>
      )}
      triggerType={TRIGGER_TYPE.hover}
    >
      {children}
    </StatefulPopover>
  );
}

function Toolbar({ openSettings, pull, push, addGroup, addKey }) {
  const [, theme] = useStyletron();
  const navigate = useNavigate();

  function navigateWelcome() {
    navigate("/");
  }

  return (
    <div
      style={{
        ...theme.typography.font300,
        display: "flex",
        alignItems: "center",
        padding: "10px",
        color: theme.colors.primary,
        boxShadow: `0px 0px 10px ${theme.colors.backgroundOverlayDark}`,
        gap: "10px",
        flexWrap: "wrap",
      }}
    >
      <ToolbarTooltip tooltip="Go to projects">
        <Button
          kind={KIND.secondary}
          size={SIZE.compact}
          onClick={navigateWelcome}
        >
          <FiChevronLeft />
        </Button>
      </ToolbarTooltip>

      <ToolbarTooltip tooltip="Reload files">
        <Button kind={KIND.secondary} size={SIZE.compact} onClick={pull}>
          <FiDownload />
        </Button>
      </ToolbarTooltip>

      <ToolbarTooltip tooltip="Save to files">
        <Button kind={KIND.secondary} size={SIZE.compact} onClick={push}>
          <FiUpload />
        </Button>
      </ToolbarTooltip>

      <ToolbarTooltip tooltip="Settings">
        <Button
          kind={KIND.secondary}
          size={SIZE.compact}
          onClick={openSettings}
        >
          <FiSettings />
        </Button>
      </ToolbarTooltip>

      <ToolbarTooltip tooltip="Add group">
        <Button size={SIZE.compact} onClick={addGroup}>
          <FiBox />
        </Button>
      </ToolbarTooltip>

      <ToolbarTooltip tooltip="Add key">
        <Button size={SIZE.compact} onClick={addKey}>
          <FiKey />
        </Button>
      </ToolbarTooltip>
    </div>
  );
}

export default connect(null, {
  pull,
  push,
})(Toolbar);
