import { useStyletron } from "baseui";
import { H4 } from "baseui/typography";
import React from "react";
import CreateProject from "./CreateProject";

function RecentProjects() {
  const [, theme] = useStyletron();
  return (
    <div
      style={{
        maxWidth: "350px",
        width: "100%",
        background: theme.colors.backgroundSecondary,
        padding: "20px",
        boxSizing: "border-box",
      }}
    >
      <H4>Recent projects</H4>
    </div>
  );
}

export default function Welcome() {
  return (
    <div
      style={{
        display: "flex",
        height: "100%",
        overflow: "hidden",
      }}
    >
      <CreateProject />
      <RecentProjects />
    </div>
  );
}
