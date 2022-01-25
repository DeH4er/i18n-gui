import { translateLanguage } from "@/core/utils";
import { useStyletron } from "baseui";
import { Button, SHAPE } from "baseui/button";
import { FileUploader } from "baseui/file-uploader";
import { Input } from "baseui/input";
import { Tag } from "baseui/tag";
import { H1 } from "baseui/typography";
import React, { useState } from "react";
import { connect } from "react-redux";
import { useNavigate } from "react-router-dom";
import { createProject } from "../editor/editorSlice";
import css from "./CreateProject.module.css";

function BlinkingCursor() {
  const [, theme] = useStyletron();
  return (
    <div
      className={css.cursor}
      style={{ background: theme.colors.primary100, marginRight: "10px" }}
    >
      <div></div>
    </div>
  );
}

function ProjectNameInput({ projectName, setProjectName }) {
  const [css, theme] = useStyletron();
  const [isEditing, setIsEditing] = useState(false);

  if (isEditing) {
    return (
      <div style={{ flex: "1", height: "52px" }}>
        <Input
          margin={0}
          onBlur={() => setIsEditing(false)}
          autoFocus
          value={projectName}
          onChange={(e) => setProjectName(e.target.value)}
        />
      </div>
    );
  }

  return (
    <H1
      margin={0}
      className={css({
        cursor: "pointer",
        ":hover": { background: theme.colors.backgroundSecondary },
        flex: "1",
        paddingLeft: "10px",
        color: projectName ? theme.colors.primary : theme.colors.primary400,
      })}
      onClick={() => setIsEditing(true)}
    >
      <BlinkingCursor />
      {!projectName ? "New project name" : projectName}
    </H1>
  );
}

function CreateProject({ createProject }) {
  const navigate = useNavigate();
  const [files, setFiles] = useState([]);
  const [projectName, setProjectName] = useState("");

  function onFilesLoaded(filesToRead) {
    setFiles([...files, ...filesToRead]);
  }

  function onRemoveFile(file) {
    setFiles(files.filter((f) => f.id !== file.id));
  }

  async function startNewProject() {
    await createProject({ paths: files.map((f) => f.path), projectName });
    navigate("/editor");
  }

  return (
    <div
      style={{
        flex: "1",
        padding: "20px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          maxWidth: "700px",
          width: "100%",
        }}
      >
        <section
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "20px",
            gap: "20px",
          }}
        >
          <ProjectNameInput
            projectName={projectName}
            setProjectName={setProjectName}
          />
          {files.length > 0 && (
            <Button
              shape={SHAPE.pill}
              onClick={startNewProject}
              disabled={!projectName}
            >
              Lets start
            </Button>
          )}
        </section>

        <section
          style={{
            marginBottom: "20px",
          }}
        >
          {files.map((file) => (
            <Tag
              key={file.name}
              onActionClick={() => onRemoveFile(file)}
              overrides={{
                Text: {
                  style: {
                    maxWidth: "unset",
                  },
                },
              }}
            >
              {translateLanguage(file.name)}
            </Tag>
          ))}
        </section>

        <FileUploader
          onDropAccepted={onFilesLoaded}
          multiple
          accept="application/json"
          overrides={{ ContentMessage: () => "" }}
        ></FileUploader>
      </div>
    </div>
  );
}

const mapDispatchToProps = {
  createProject,
};

export default connect(null, mapDispatchToProps)(CreateProject);
