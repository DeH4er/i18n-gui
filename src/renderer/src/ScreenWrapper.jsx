import { useStyletron } from "baseui";
import React from "react";

export default function ScreenWrapper({ children }) {
  const [, theme] = useStyletron();
  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        background: theme.colors.backgroundPrimary,
        overflow: 'auto',
      }}
    >
      {children}
    </div>
  );
}
