import { Button, KIND } from "baseui/button";
import { Paragraph1 } from "baseui/typography";
import React, { useMemo, useState } from "react";
import { FiEdit, FiTrash } from "react-icons/fi";
import Tooltip from "src/components/Tooltip";
import { countLeafs } from "src/core/tree";
import TranslationPath from "./TranslationPath";
import TranslationRemoveModal from "./TranslationRemoveModal";

export default function TranslationGroup({
  translation,
  select,
  remove,
  rename,
}) {
  const [removeModalOpen, setRemoveModalOpen] = useState(false);
  const count = useMemo(() => countLeafs(translation), [translation]);

  function confirmRemove() {
    setRemoveModalOpen(false);
    remove(translation);
  }

  return (
    <div>
      <section
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "20px",
          flexWrap: "wrap",
          rowGap: "20px",
        }}
      >
        <TranslationPath translation={translation} select={select} />
        <div
          style={{
            display: "flex",
            gap: "10px",
          }}
        >
          <Tooltip tooltip="Rename">
            <Button kind={KIND.secondary} onClick={rename}>
              <FiEdit />
            </Button>
          </Tooltip>

          <Tooltip tooltip="Delete">
            <Button
              kind={KIND.secondary}
              onClick={() => setRemoveModalOpen(true)}
            >
              <FiTrash />
            </Button>
          </Tooltip>
        </div>
      </section>

      <section style={{ padding: "20px" }}>
        <Paragraph1>Has {count} translations.</Paragraph1>
      </section>

      <TranslationRemoveModal
        translation={translation}
        count={count}
        onCancel={() => setRemoveModalOpen(false)}
        onConfirm={confirmRemove}
        isOpen={removeModalOpen}
      />
    </div>
  );
}
