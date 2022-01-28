import React, { useCallback, useMemo, useState } from 'react';
import { connect } from 'react-redux';

import { createNode } from 'src/core/tree';
import Settings from 'src/settings/Settings';

import {
  addTranslation,
  clickTranslation,
  removeTranslation,
  renameTranslation,
  selectLanguages,
  selectSelectedTranslation,
  selectTranslation,
  selectTranslations,
  updateTranslation,
} from './editorSlice';
import Sidebar from './Sidebar';
import TranslationEdit from './TranslationEdit';
import TranslationGroup from './TranslationGroup';
import TranslationPathModal from './TranslationPathModal';

function Editor({
  translations,
  languages,
  clickTranslation,
  selectedTranslation,
  updateTranslation,
  removeTranslation,
  selectTranslation,
  addTranslation,
  renameTranslation,
}) {
  const [isPathModalOpen, setIsPathModalOpen] = useState(false);
  const [newTranslation, setNewTranslation] = useState(null);
  const [isSettingsPageOpen, setIsSettingsPageOpen] = useState(false);
  const [pathAction, setPathAction] = useState(null);

  const viewMode = useMemo(() => {
    if (newTranslation) {
      return 'add-key';
    }
    if (selectedTranslation && !selectedTranslation.children) {
      return 'select-translation';
    }
    if (selectedTranslation && selectedTranslation.children) {
      return 'select-group';
    }

    return '';
  }, [newTranslation, selectedTranslation]);

  const startPathAction = useCallback((action) => {
    setPathAction(action);
    setIsPathModalOpen(true);
  }, []);

  const stopPathAction = useCallback(() => {
    setPathAction(null);
    setIsPathModalOpen(false);
  }, []);

  const addKeyAction = useCallback(() => {
    startPathAction('add-key');
  }, []);

  const addGroupAction = useCallback(() => {
    startPathAction('add-group');
  }, []);

  const renameAction = useCallback(() => {
    startPathAction('rename');
  }, []);

  const confirmPathAction = useCallback(
    (path) => {
      if (pathAction === 'add-group') {
        addTranslation(
          createNode({
            path,
            children: [],
          })
        );
      }

      if (pathAction === 'add-key') {
        setNewTranslation(
          createNode({
            translations: languages.reduce(
              (acc, language) => ({ ...acc, [language]: '' }),
              {}
            ),
            path,
          })
        );
      }

      if (pathAction === 'rename') {
        renameTranslation({
          oldPath: selectedTranslation.path,
          newPath: path,
        });
      }

      stopPathAction();
    },
    [languages, selectedTranslation?.path, pathAction]
  );

  const openSettings = useCallback(() => {
    setIsSettingsPageOpen(true);
  }, []);

  const saveTranslation = useCallback((translation) => {
    setNewTranslation(null);
    addTranslation(translation);
  }, []);

  const onSelectTranslation = useCallback((path) => {
    setNewTranslation(null);
    selectTranslation(path);
  }, []);

  const onTranslationClick = useCallback((translation) => {
    setNewTranslation(null);
    clickTranslation(translation);
  }, []);

  return (
    <main
      style={{
        height: '100%',
        display: 'flex',
      }}
    >
      <Sidebar
        openSettings={openSettings}
        addKey={addKeyAction}
        addGroup={addGroupAction}
        onTranslationClick={onTranslationClick}
      />

      <section
        style={{
          boxSizing: 'border-box',
          overflow: 'auto',
          height: '100%',
          width: '100%',
          maxWidth: '1000px',
        }}
      >
        {viewMode === 'select-translation' && (
          <TranslationEdit
            isUpdating
            translation={selectedTranslation}
            save={updateTranslation}
            remove={removeTranslation}
            select={onSelectTranslation}
            rename={renameAction}
          />
        )}
        {viewMode === 'add-key' && (
          <TranslationEdit
            isUpdating={false}
            translation={newTranslation}
            save={saveTranslation}
            select={onSelectTranslation}
          />
        )}
        {viewMode === 'select-group' && (
          <TranslationGroup
            translation={selectedTranslation}
            select={onSelectTranslation}
            remove={removeTranslation}
            rename={renameAction}
          />
        )}
      </section>
      <TranslationPathModal
        pathExistError
        path={selectedTranslation?.path ?? []}
        tree={translations}
        isOpen={isPathModalOpen}
        onCancel={stopPathAction}
        onConfirm={confirmPathAction}
      />
      <Settings
        isOpen={isSettingsPageOpen}
        onClose={() => setIsSettingsPageOpen(false)}
      />
    </main>
  );
}

export default connect(
  (state, componentProps) => ({
    translations: selectTranslations(state),
    languages: selectLanguages(state),
    selectedTranslation: selectSelectedTranslation(state),
    ...componentProps,
  }),
  {
    clickTranslation,
    updateTranslation,
    removeTranslation,
    selectTranslation,
    addTranslation,
    renameTranslation,
  }
)(Editor);
