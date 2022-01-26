import { Button, KIND } from "baseui/button";
import { FiEdit, FiSave, FiTrash } from "react-icons/fi";
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
            isVisible={Object.keys(connectedLanguages).length > 0}
          />
        )}
        {isUpdating && (
          <>
            <Button kind={KIND.secondary} onClick={rename}>
              <FiEdit />
            </Button>

            <Button
              kind={KIND.secondary}
              onClick={() => setRemoveModalOpen(true)}
            >
              <FiTrash />
            </Button>
          </>
        )}
        <Button
          onClick={() => {
            save(edited);
          }}
        >
          <FiSave />
        </Button>
      </div>
    </section>
  );
}
