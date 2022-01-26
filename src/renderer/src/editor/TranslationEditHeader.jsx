import { Button } from "baseui/button";
import { useState } from "react";
import Action from "../components/Action";
import Actions from "../components/Actions";
import ConnectAction from "./ConnectAction";
import TranslationPath from "./TranslationPath";

export default function TranslationEditHeader({
  translation,
  connectedLanguages,
  isUpdating,
  edited,
  setConnectedLanguages,
  rename,
  save,
  select,
  setRemoveModalOpen,
}) {
  const [isActionsOpen, setIsActionsOpen] = useState(false);

  function onActionClick(fn) {
    return () => {
      setIsActionsOpen(false);
      if (typeof fn === "function") {
        fn();
      }
    };
  }

  return (
    <section
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "20px",
        flexWrap: "wrap",
        rowGap: "20px"
      }}
    >
      <TranslationPath translation={translation} select={select} />
      <div
        style={{
          display: "flex",
          gap: "10px",
          alignSelf: "center"
        }}
      >
        <Actions
          isOpen={isActionsOpen}
          setIsOpen={setIsActionsOpen}
          maxVisible={2}
        >
          <ConnectAction
            connectedLanguages={connectedLanguages}
            setConnectedLanguages={setConnectedLanguages}
            onClick={onActionClick()}
            isVisible={Object.keys(connectedLanguages).length > 0}
          />
          <Action
            label="Rename"
            onClick={onActionClick(rename)}
            isVisible={isUpdating}
          />
          <Action
            label="Delete"
            onClick={onActionClick(() => setRemoveModalOpen(true))}
            isVisible={isUpdating}
          />
        </Actions>
        <Button
          onClick={() => {
            save(edited);
          }}
        >
          Save
        </Button>
      </div>
    </section>
  );
}
