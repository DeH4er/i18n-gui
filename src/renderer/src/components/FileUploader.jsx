import { useStyletron } from "baseui";
import { useRef, useState } from "react";

export default function FileUploader({ onDropAccepted, multiple, accept }) {
  const ref = useRef();
  const [isDraggingOver, setIsDraggingOver] = useState(false);

  function onFilesSelected(e) {
    onDropAccepted(Array.from(e.target.files));
    ref.current.value = "";
  }

  function onFilesDropped(e) {
    e.stopPropagation();
    e.preventDefault();
    setIsDraggingOver(false);
    const files = Array.from(e.dataTransfer.files).filter(
      (f) => f.type === accept
    );
    onDropAccepted(files);
  }

  function onDragOver(e) {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingOver(true);
  }

  function onDragLeave(e) {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingOver(false);
  }

  const [css, theme] = useStyletron();
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: "10px",
        padding: "40px",
        background: isDraggingOver
          ? theme.colors.backgroundLightAccent
          : theme.colors.fileUploaderBackgroundColor,
        border: `${theme.sizing.scale0} dashed ${
          isDraggingOver
            ? theme.colors.borderAccent
            : theme.colors.fileUploaderBorderColorDefault
        }`,
      }}
      onDrop={onFilesDropped}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
    >
      <label
        className={css({
          ...theme.typography.font250,
          padding: "10px",
          borderRadius: "2em",
          background: theme.colors.backgroundTertiary,
          color: theme.colors.primary,
          cursor: "pointer",
          transition: `background ${theme.animation.timing200}`,
          ":hover": {
            background: theme.colors.buttonSecondaryHover,
          },
        })}
      >
        Browse files
        <input
          type="file"
          style={{ display: "none" }}
          ref={ref}
          onChange={onFilesSelected}
          multiple={multiple}
          accept={accept}
        />
      </label>
    </div>
  );
}
