import { Button, KIND } from "baseui/button";
import React from "react";
import { FiEdit, FiSave, FiTrash } from "react-icons/fi";
import Tooltip from "src/components/Tooltip";
import ConnectAction from "./ConnectAction";
import TranslationHeader from "./TranslationHeader";

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
  return (
    <TranslationHeader path={translation.path} select={select}>
      {isUpdating && (
        <>
          <Tooltip tooltip="Remove">
            <Button
              kind={KIND.secondary}
              onClick={() => setRemoveModalOpen(true)}
            >
              <FiTrash />
            </Button>
          </Tooltip>
          <Tooltip tooltip="Rename">
            <Button kind={KIND.secondary} onClick={rename}>
              <FiEdit />
            </Button>
          </Tooltip>
          {Object.keys(connectedLanguages).length > 0 && (
            <ConnectAction
              connectedLanguages={connectedLanguages}
              setConnectedLanguages={setConnectedLanguages}
            />
          )}
        </>
      )}
      <Tooltip tooltip="Confirm changes">
        <Button
          onClick={() => {
            save(edited);
          }}
        >
          <FiSave />
        </Button>
      </Tooltip>
    </TranslationHeader>
  );
}
