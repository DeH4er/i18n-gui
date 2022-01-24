import { useStyletron } from "baseui";
import { Button, KIND, SIZE } from "baseui/button";
import { ChevronLeft } from "baseui/icon";
import React from "react";

export default function Toolbar({ openSettings, pull, push, navigateWelcome }) {
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
          display: "flex",
          gap: "10px",
        }}
      >
        <Button
          kind={KIND.tertiary}
          size={SIZE.compact}
          onClick={navigateWelcome}
        >
          <ChevronLeft />
        </Button>

        <Button kind={KIND.secondary} size={SIZE.compact} onClick={pull}>
          Pull
        </Button>

        <Button kind={KIND.secondary} size={SIZE.compact} onClick={push}>
          Push
        </Button>
      </div>

      <div>
        <Button size={SIZE.compact} onClick={openSettings}>
          Settings
        </Button>
      </div>
    </div>
  );
}
