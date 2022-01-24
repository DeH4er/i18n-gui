import { readParseJson } from "@/core/file";
import { translateLanguage } from "@/core/utils";
import { loadTranslations } from "@/editor/editorSlice";
import { Button, SHAPE } from "baseui/button";
import { FileUploader } from "baseui/file-uploader";
import { Tag } from "baseui/tag";
import { H1 } from "baseui/typography";
import React, { useState } from "react";
import { connect } from "react-redux";
import { useNavigate } from "react-router-dom";

function CreateProject({ loadTranslations }) {
  const navigate = useNavigate();
  const [files, setFiles] = useState([]);

  async function onFilesLoaded(filesToRead) {
    const parsedFiles = await Promise.all(filesToRead.map(readParseJson));
    setFiles([...files, ...parsedFiles]);
  }

  function onRemoveFile(file) {
    setFiles(files.filter((f) => f.id !== file.id));
  }

  function start() {
    loadTranslations(files);
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
          }}
        >
          <H1 marginTop={0}>
            {files.length === 0 ? "Create new project" : "Want to load more?"}
          </H1>
          {files.length > 0 && (
            <Button shape={SHAPE.pill} onClick={start}>
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
              key={file.id}
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
  loadTranslations,
};

export default connect(null, mapDispatchToProps)(CreateProject);
