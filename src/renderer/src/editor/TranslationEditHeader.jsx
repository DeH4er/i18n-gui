import { Button, KIND } from "baseui/button";
import { FiEdit, FiSave, FiTrash } from "react-icons/fi";
import Tooltip from "src/components/Tooltip";
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
  return (
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
          alignSelf: "center",
        }}
      >
        {Object.keys(connectedLanguages).length > 0 && (
          <ConnectAction
            connectedLanguages={connectedLanguages}
            setConnectedLanguages={setConnectedLanguages}
          />
        )}
        {isUpdating && (
          <>
            <Tooltip tooltip="Rename">
              <Button kind={KIND.secondary} onClick={rename}>
                <FiEdit />
              </Button>
            </Tooltip>

            <Tooltip tooltip="Remove">
              <Button
                kind={KIND.secondary}
                onClick={() => setRemoveModalOpen(true)}
              >
                <FiTrash />
              </Button>
            </Tooltip>
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
      </div>
    </section>
  );
}
