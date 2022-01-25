import {
  openRecentProject,
  removeProject,
  selectRecentProjects
} from "@/editor/editorSlice";
import { useStyletron } from "baseui";
import { Button, KIND, SIZE } from "baseui/button";
import { H4, H6 } from "baseui/typography";
import React from "react";
import { connect } from "react-redux";
import { useNavigate } from "react-router-dom";

function formatDate(date) {
  const d = new Date(date);
  return d.toLocaleDateString();
}

function RecentProjects({ recentProjects, openRecentProject, removeProject }) {
  const [css, theme] = useStyletron();
  const navigate = useNavigate();

  function onRemoveProject(id) {
    removeProject(id);
  }

  async function onOpenRecentProject(id) {
    await openRecentProject(id);
    navigate("/editor");
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        maxWidth: "350px",
        width: "100%",
        background: theme.colors.backgroundSecondary,
        boxSizing: "border-box",
        height: "100%",
        overflow: "hidden",
      }}
    >
      <H4 margin="20px 0 0 0" padding="20px">
        Recent projects
      </H4>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          height: "100%",
          overflow: "auto",
        }}
      >
        {Object.keys(recentProjects).map((projectId) => (
          <div
            key={projectId}
            className={css({
              padding: "20px",
              cursor: "pointer",
              ":hover": {
                background: theme.colors.backgroundPrimary,
              },
            })}
            onClick={() => onOpenRecentProject(projectId)}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "10px",
              }}
            >
              <div
                className={css({
                  display: "flex",
                  alignItems: "baseline",
                  justifyContent: "space-between",
                })}
              >
                <H6 margin={0}>{recentProjects[projectId].name}</H6>
                <div
                  style={{
                    ...theme.typography.font150,
                    color: theme.colors.primary400,
                  }}
                >
                  <div>{formatDate(recentProjects[projectId].timestamp)}</div>
                </div>
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div
                  style={{
                    ...theme.typography.font150,
                    color: theme.colors.primary300,
                  }}
                >
                  {recentProjects[projectId].languages.length} languages
                </div>
                <Button
                  kind={KIND.secondary}
                  size={SIZE.mini}
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemoveProject(projectId);
                  }}
                >
                  Delete
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const mapDispatchToProps = {
  openRecentProject,
  removeProject,
};

export default connect(
  (state, props) => ({
    recentProjects: selectRecentProjects(state),
    ...props,
  }),
  mapDispatchToProps
)(RecentProjects);
