import { translateLanguage } from "@/core/utils";
import { loadTranslations } from "@/editor/editorSlice";
import { Button } from "baseui/button";
import { FileUploader } from "baseui/file-uploader";
import { Tag } from "baseui/tag";
import { H1 } from "baseui/typography";
import React, { useState } from "react";
import { connect } from "react-redux";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";

function Welcome({ loadTranslations }) {
  const navigate = useNavigate();
  const [files, setFiles] = useState([]);

  async function onFilesLoaded(filesToRead) {
    const parsedFiles = await Promise.all(filesToRead.map(readFile));
    setFiles([...files, ...parsedFiles]);
  }

  function onRemoveFile(file) {
    setFiles(files.filter((f) => f.id !== file.id));
  }

  function readFile(file) {
    return new Promise((res, rej) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const json = JSON.parse(e.target.result);
          const parts = file.path.split(".");
          res({
            content: json,
            name: parts.slice(0, -1).join("."),
            fullname: file.path,
            extension: parts[parts.length - 1],
            id: uuidv4(),
          });
        } catch (e) {
          rej(e);
        }
      };
      reader.onerror = (error) => rej(error);
      reader.readAsText(file, "UTF-8");
    });
  }

  function start() {
    loadTranslations(files);
    navigate("/editor");
  }

  return (
    <div
      style={{
        maxWidth: "800px",
        padding: "20px",
        margin: "25vh auto 0 auto",
      }}
    >
      <section
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <H1>
          {files.length === 0 ? "Load language files" : "Want to load more?"}
        </H1>
        {files.length > 0 && (
          <Button shape="pill" onClick={start}>
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
  );
}

const mapDispatchToProps = {
  loadTranslations,
};

export default connect(null, mapDispatchToProps)(Welcome);
