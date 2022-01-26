import { Button } from "baseui/button";
import { Paragraph1 } from "baseui/typography";
import React, { useMemo, useState } from "react";
import { countLeafs } from "src/core/tree";
import Action from "../components/Action";
import Actions from "../components/Actions";
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
  const [isActionsOpen, setIsActionsOpen] = useState(false);

  function onActionClick(fn) {
    return () => {
      setIsActionsOpen(false);
      if (typeof fn === "function") {
        fn();
      }
    };
  }

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
          <Actions
            isOpen={isActionsOpen}
            setIsOpen={setIsActionsOpen}
            maxVisible={2}
          >
            <Action label="Add group" onClick={onActionClick(addGroup)} />
            <Action label="Rename" onClick={onActionClick(rename)} />
            <Action
              label="Delete"
              onClick={onActionClick(() => setRemoveModalOpen(true))}
            />
          </Actions>

          <Button onClick={addTranslation}>Add translation</Button>
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
