import { countLeafs } from "@/core/tree";
import { Button, KIND } from "baseui/button";
import { Paragraph1 } from "baseui/typography";
import React, { useMemo, useState } from "react";
import TranslationPath from "./TranslationPath";
import TranslationRemoveModal from "./TranslationRemoveModal";

export default function TranslationGroup({
  translation,
  select,
  remove,
  addTranslation,
  addGroup,
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
          alignItems: "baseline",
          marginBottom: "20px",
        }}
      >
        <TranslationPath translation={translation} select={select} />
        <div
          style={{
            display: "flex",
            gap: "10px",
          }}
        >
          <Button
            onClick={() => setRemoveModalOpen(true)}
            kind={KIND.secondary}
          >
            Delete
          </Button>
          <Button onClick={rename} kind={KIND.secondary}>
            Rename
          </Button>
          <Button onClick={addGroup} kind={KIND.secondary}>
            Add group
          </Button>
          <Button onClick={addTranslation}>Add translation</Button>
        </div>
      </section>

      <section>
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
