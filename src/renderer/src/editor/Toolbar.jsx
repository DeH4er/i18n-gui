import { useStyletron } from "baseui";
import { Button, SIZE } from "baseui/button";
import React from "react";

export default function Toolbar({ openSettings }) {
  const [, theme] = useStyletron();

  return (
    <div
      style={{
        ...theme.typography.font300,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "10px",
        color: theme.colors.primary,
        boxShadow: `0px 0px 10px ${theme.colors.backgroundOverlayDark}`,
      }}
    >
      <div
        style={{
          ...theme.typography.font550,
        }}
      >
        i18n Editor
      </div>

      <div>
        <Button size={SIZE.compact} onClick={openSettings}>
          Settings
        </Button>
      </div>
    </div>
  );
}
