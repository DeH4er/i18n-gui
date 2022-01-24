import { Button, KIND } from "baseui/button";
import { useEffect, useState } from "react";
import { connect } from "react-redux";
import ConnectToggle from "./ConnectToggle";
import { selectGenerationRules, selectLanguages } from "./editorSlice";
import TranslationControl from "./TranslationControl";
import TranslationPath from "./TranslationPath";
import TranslationRemoveModal from "./TranslationRemoveModal";

function useEdited(translation) {
  const [edited, setEdited] = useState(translation);

  useEffect(() => {
    setEdited(translation);
  }, [translation]);

  return [edited, setEdited];
}

function TranslationEdit({
  translation,
  save,
  remove,
  select,
  isUpdating,
  rename,
  languages,
  generationRules,
}) {
  const [edited, setEdited] = useEdited(translation);
  const [removeModalOpen, setRemoveModalOpen] = useState(false);
  const [connectedLanguages, setConnectedLanguages] = useState({});

  useEffect(() => {
    setConnectedLanguages(
      languages
        .filter((l) => generationRules[l])
        .reduce((acc, language) => ({ ...acc, [language]: !isUpdating }), {})
    );
  }, [languages, isUpdating, translation, generationRules]);

  function updateTranslation(newTranslation, language) {
    setEdited({
      ...edited,
      translations: { ...edited.translations, [language]: newTranslation },
    });
  }

  function confirmRemove() {
    setRemoveModalOpen(false);
    remove(translation);
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "20px",
      }}
    >
      <section
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "baseline",
        }}
      >
        <TranslationPath translation={translation} select={select} />
        <div
          style={{
            display: "flex",
            gap: "10px",
          }}
        >
          {isUpdating && (
            <>
              <Button
                onClick={() => setRemoveModalOpen(true)}
                kind={KIND.secondary}
              >
                Delete
              </Button>
              <Button onClick={rename} kind={KIND.secondary}>
                Rename
              </Button>
            </>
          )}
          {Object.keys(connectedLanguages).length > 0 && (
            <ConnectToggle
              connectedLanguages={connectedLanguages}
              setConnectedLanguages={setConnectedLanguages}
            />
          )}
          <Button
            onClick={() => {
              save(edited);
            }}
          >
            Save
          </Button>
        </div>
      </section>
      <section>
        {languages.map((language) => (
          <div
            key={language}
            style={{
              marginBottom: "40px",
            }}
          >
            <TranslationControl
              language={language}
              translation={edited.translations[language]}
              connected={connectedLanguages[language]}
              setConnected={(isConnected) =>
                setConnectedLanguages({
                  ...connectedLanguages,
                  [language]: isConnected,
                })
              }
              setTranslation={(translation) =>
                updateTranslation(translation, language)
              }
              translations={edited.translations}
              rule={generationRules[language]}
            />
          </div>
        ))}
      </section>

      <TranslationRemoveModal
        translation={translation}
        onCancel={() => setRemoveModalOpen(false)}
        onConfirm={confirmRemove}
        isOpen={removeModalOpen}
      />
    </div>
  );
}

export default connect((state, componentProps) => ({
  languages: selectLanguages(state),
  generationRules: selectGenerationRules(state),
  ...componentProps,
}))(TranslationEdit);
