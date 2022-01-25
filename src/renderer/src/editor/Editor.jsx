import TreeView from "@/components/TreeView";
import { createNode } from "@/core/tree";
import Settings from "@/settings/Settings";
import React, { useMemo, useState } from "react";
import { connect } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  addTranslation,
  clickTranslation,
  removeTranslation,
  renameTranslation,
  selectLanguages,
  selectSelectedTranslation,
  selectTranslation,
  selectTranslations,
  updateTranslation
} from "./editorSlice";
import Toolbar from "./Toolbar";
import TranslationEdit from "./TranslationEdit";
import TranslationGroup from "./TranslationGroup";
import TranslationPathModal from "./TranslationPathModal";

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
  const navigate = useNavigate();
  const [isPathModalOpen, setIsPathModalOpen] = useState(false);
  const [newTranslation, setNewTranslation] = useState(null);
  const [isSettingsPageOpen, setIsSettingsPageOpen] = useState(false);
  const [pathAction, setPathAction] = useState(null);

  const viewMode = useMemo(() => {
    if (newTranslation) {
      return "add-translation";
    } else if (selectedTranslation && !selectedTranslation.children) {
      return "select-translation";
    } else if (selectedTranslation && selectedTranslation.children) {
      return "select-group";
    }

    return "";
  }, [newTranslation, selectedTranslation]);

  function startPathAction(action) {
    setPathAction(action);
    setIsPathModalOpen(true);
  }

  function stopPathAction() {
    setPathAction(null);
    setIsPathModalOpen(false);
  }

  function addTranslationAction() {
    startPathAction("add-translation");
  }

  function addGroupAction() {
    startPathAction("add-group");
  }

  function renameAction() {
    startPathAction("rename");
  }

  function confirmPathAction(path) {
    if (pathAction === "add-group") {
      addTranslation(
        createNode({
          path,
          children: [],
        })
      );
    }

    if (pathAction === "add-translation") {
      setNewTranslation(
        createNode({
          translations: languages.reduce(
            (acc, language) => ({ ...acc, [language]: "" }),
            {}
          ),
          path: path,
        })
      );
    }

    if (pathAction === "rename") {
      renameTranslation({
        oldPath: selectedTranslation.path,
        newPath: path,
      });
    }

    stopPathAction();
  }

  function openSettings() {
    setIsSettingsPageOpen(true);
  }

  function pull() {}

  function push() {}

  function navigateWelcome() {
    navigate("/");
  }

  function saveTranslation(translation) {
    setNewTranslation(null);
    addTranslation(translation);
  }

  function onSelectTranslation(path) {
    setNewTranslation(null);
    selectTranslation(path);
  }

  return (
    <main
      style={{
        display: "flex",
        height: "100vh",
      }}
    >
      <section
        style={{
          boxSizing: "border-box",
          height: "100%",
          maxWidth: "500px",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        <Toolbar
          openSettings={openSettings}
          pull={pull}
          push={push}
          navigateWelcome={navigateWelcome}
        />
        <div
          style={{
            height: "100%",
            overflow: "auto",
          }}
        >
          <TreeView
            data={translations}
            onClick={(translation) => {
              setNewTranslation(null);
              clickTranslation(translation);
            }}
          />
        </div>
      </section>

      <section
        style={{
          boxSizing: "border-box",
          overflow: "auto",
          height: "100%",
          width: "100%",
        }}
      >
        {viewMode === "select-translation" && (
          <TranslationEdit
            isUpdating={true}
            translation={selectedTranslation}
            save={updateTranslation}
            remove={removeTranslation}
            select={onSelectTranslation}
            rename={renameAction}
          ></TranslationEdit>
        )}
        {viewMode === "add-translation" && (
          <TranslationEdit
            isUpdating={false}
            translation={newTranslation}
            save={saveTranslation}
            select={onSelectTranslation}
          />
        )}
        {viewMode === "select-group" && (
          <TranslationGroup
            translation={selectedTranslation}
            select={onSelectTranslation}
            remove={removeTranslation}
            addTranslation={addTranslationAction}
            addGroup={addGroupAction}
            rename={renameAction}
          />
        )}
      </section>
      {selectedTranslation && (
        <TranslationPathModal
          pathExistError={true}
          path={selectedTranslation.path}
          tree={translations}
          isOpen={isPathModalOpen}
          onCancel={stopPathAction}
          onConfirm={confirmPathAction}
        />
      )}
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
