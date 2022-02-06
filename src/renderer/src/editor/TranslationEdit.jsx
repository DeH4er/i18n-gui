import { useEffect, useState } from 'react';
import { connect } from 'react-redux';

import { selectGenerationRules, selectLanguages } from './editorSlice';
import TranslationControl from './TranslationControl';
import TranslationEditHeader from './TranslationEditHeader';
import TranslationRemoveModal from './TranslationRemoveModal';

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
  const [lockedLanguages, setLockedLanguages] = useState({});

  useEffect(() => {
    setLockedLanguages(
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
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        overflow: 'hidden',
      }}
    >
      <TranslationEditHeader
        translation={translation}
        select={select}
        lockedLanguages={lockedLanguages}
        setLockedLanguages={setLockedLanguages}
        setRemoveModalOpen={setRemoveModalOpen}
        rename={rename}
        isUpdating={isUpdating}
        edited={edited}
        save={save}
      />
      <section
        style={{
          height: '100%',
          overflow: 'auto',
          padding: '20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
        }}
      >
        {languages.map((language) => (
          <div key={language} style={{}}>
            <TranslationControl
              language={language}
              translation={edited.translations[language]}
              locked={lockedLanguages[language]}
              setLocked={(isLocked) =>
                setLockedLanguages({
                  ...lockedLanguages,
                  [language]: isLocked,
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
