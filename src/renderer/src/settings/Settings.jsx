import LanguageLabel from "@/components/LanguageLabel";
import {
  changeSettings,
  selectGenerationRules,
  selectLanguages
} from "@/editor/editorSlice";
import { KIND } from "baseui/button";
import { arrayMove, List } from "baseui/dnd-list";
import { FormControl } from "baseui/form-control";
import {
  Modal,
  ModalBody,
  ModalButton,
  ModalFooter,
  ModalHeader,
  ROLE,
  SIZE as ModalSize
} from "baseui/modal";
import { Textarea } from "baseui/textarea";
import { useEffect, useState } from "react";
import { connect } from "react-redux";
import SettingsHeader from "./SettingsHeader";
import SettingsSection from "./SettingsSection";
import SettingsTip from "./SettingsTip";

function Settings({
  isOpen,
  onClose,
  languages,
  generationRules,
  changeSettings,
}) {
  const [newLanguages, setNewLanguages] = useState([]);
  const [newGenerationRules, setNewGenerationRules] = useState({});

  useEffect(() => {
    setNewLanguages(languages);
  }, [languages]);

  useEffect(() => {
    setNewGenerationRules(generationRules);
  }, [generationRules]);

  function changeLanguageOrder({ oldIndex, newIndex }) {
    const changedOrder =
      newIndex === -1
        ? newLanguages
        : arrayMove(newLanguages, oldIndex, newIndex);
    setNewLanguages(changedOrder);
  }

  function changeGenerationRule(language, rule) {
    setNewGenerationRules({ ...newGenerationRules, [language]: rule });
  }

  function onConfirm() {
    changeSettings({
      languages: newLanguages,
      generationRules: newGenerationRules,
    });
    onClose();
  }

  return (
    <Modal
      overrides={{
        Dialog: {
          style: {
            width: "60vw",
            display: "flex",
            flexDirection: "column",
            height: "90vh",
            overflow: "hidden",
          },
        },
      }}
      onClose={onClose}
      closeable
      isOpen={isOpen}
      animate
      autoFocus
      size={ModalSize.default}
      role={ROLE.dialog}
      unstable_ModalBackdropScroll={true}
    >
      <ModalHeader>Settings</ModalHeader>
      <ModalBody
        style={{
          flex: "1 1 0",
          height: "100%",
          overflow: "auto",
          boxSizing: "border-box",
          paddingRight: "20px",
        }}
      >
        <SettingsSection>
          <SettingsHeader>Language order</SettingsHeader>
          <List
            overrides={{
              List: {
                style: {
                  margin: "0",
                },
              },
              Item: {
                style: {
                  paddingLeft: "5px",
                  paddingTop: "5px",
                  paddingRight: "5px",
                  paddingBottom: "5px",
                },
              },
              Label: {
                component: ({ $value }) => (
                  <div style={{ width: "100%" }}>
                    <LanguageLabel language={$value} />
                  </div>
                ),
              },
            }}
            items={newLanguages}
            onChange={changeLanguageOrder}
          />
        </SettingsSection>

        <SettingsSection>
          <SettingsHeader>
            <div
              style={{
                display: "flex",
                alignItems: "baseline",
              }}
            >
              <span style={{ marginRight: "20px" }}>Generation rules</span>
              <SettingsTip>
                <h4>Example</h4>
                !!! TRANSLATE ME !!! {"{en-US}"}
                <h4>General info</h4>
                Generation rules let you use translations from one language to
                generate another. Leave empty to not use generation for that
                language.
                <h4>Syntaxis</h4>
                <b>{"{language-id}"}</b> to use that language in place when
                editing translations. Example <b>{"{en-US}"}</b>
                <br />
                <b>Regular string</b> when used will remain the same in
                translation.
              </SettingsTip>
            </div>
          </SettingsHeader>

          {newLanguages.map((language) => (
            <div style={{ marginBottom: "20px" }} key={language}>
              <FormControl label={() => <LanguageLabel language={language} />}>
                <Textarea
                  value={newGenerationRules[language]}
                  onChange={(e) =>
                    changeGenerationRule(language, e.target.value)
                  }
                />
              </FormControl>
            </div>
          ))}
        </SettingsSection>
      </ModalBody>
      <ModalFooter>
        <ModalButton kind={KIND.tertiary} onClick={onClose}>
          Cancel
        </ModalButton>
        <ModalButton onClick={onConfirm}>Confirm</ModalButton>
      </ModalFooter>
    </Modal>
  );
}

export default connect(
  (state, componentProps) => ({
    languages: selectLanguages(state),
    generationRules: selectGenerationRules(state),
    ...componentProps,
  }),
  { changeSettings }
)(Settings);
