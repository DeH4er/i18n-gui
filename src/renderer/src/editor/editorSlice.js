import {
  createNestedPath,
  expandPath,
  getNode,
  getParentNode,
  isParentOrSamePath,
  isPathExist,
  isRootNode,
  jsonsToTree,
  modifyNode,
  rebuildChildrenPath,
  removeNode,
  replaceNodeOrPush,
  sortTreeArray
} from "@/core/tree";
import { createSelector, createSlice } from "@reduxjs/toolkit";

function unselectTranslation(state) {
  if (state.selectedTranslation) {
    modifyNode(
      state.translations,
      state.selectedTranslation.path,
      (treeNode) => {
        treeNode.isSelected = false;
      }
    );
    state.selectedTranslation = null;
  }
}

function selectTranslationByPath(state, path) {
  const node = getNode(state.translations, path);

  unselectTranslation(state);

  modifyNode(state.translations, path, (treeNode) => {
    treeNode.isSelected = true;
  });

  state.selectedTranslation = node;
}

export const editorSlice = createSlice({
  name: "editor",
  initialState: {
    files: [],
    translations: [],
    selectedTranslation: null,
    settings: {
      languages: [],
      generationRules: [],
    },
  },
  reducers: {
    loadTranslations: (state, action) => {
      const files = action.payload;
      const languages = files.map((f) => f.name);
      state.files = files;
      state.translations = jsonsToTree(
        files.map((f) => f.content),
        languages
      );

      state.settings.languages = languages;
      state.settings.generationRules = languages.reduce((acc, language) => ({
        ...acc,
        [language]: "",
      }), {});
    },
    changeSettings: (state, action) => {
      Object.keys(action.payload).forEach((key) => {
        state.settings[key] = action.payload[key];
      });
    },
    clickTranslation: (state, action) => {
      const node = action.payload;

      selectTranslationByPath(state, node.path);

      if (node.children) {
        modifyNode(state.translations, node.path, (treeNode) => {
          treeNode.isExpanded = !treeNode.isExpanded;
        });
      }
    },
    updateTranslation: (state, action) => {
      const node = action.payload;

      modifyNode(state.translations, node.path, (treeNode) => {
        treeNode.translations = node.translations;
      });
    },
    renameTranslation: (state, action) => {
      const { oldPath, newPath } = action.payload;
      if (isPathExist(state.translations, newPath)) {
        return;
      }

      const node = getNode(state.translations, oldPath);
      removeNode(state.translations, oldPath);

      node.label = newPath[newPath.length - 1];
      node.path = newPath;

      createNestedPath(state.translations, newPath);

      const parentNode = getParentNode(state.translations, newPath);
      const parentNodeContainer = parentNode?.children ?? state.translations;
      replaceNodeOrPush(parentNodeContainer, node);
      sortTreeArray(parentNodeContainer);
      rebuildChildrenPath(node, newPath);
      selectTranslationByPath(state, newPath);
      expandPath(state.translations, newPath);
    },
    removeTranslation: (state, action) => {
      const node = action.payload;
      const parentNode = getParentNode(state.translations, node.path);

      if (isParentOrSamePath(node.path, state.selectedTranslation.path)) {
        if (parentNode) {
          selectTranslationByPath(state, parentNode.path);
        } else {
          unselectTranslation(state);
        }
      }

      removeNode(state.translations, node.path);
    },
    selectTranslation: (state, action) => {
      const path = action.payload;
      selectTranslationByPath(state, path);
    },
    addTranslation: (state, action) => {
      const node = action.payload;
      if (isPathExist(state.translations, node.path)) {
        return;
      }

      createNestedPath(state.translations, node.path);
      const parentNodeContainer = isRootNode(node.path)
        ? state.translations
        : getParentNode(state.translations, node.path).children;
      replaceNodeOrPush(parentNodeContainer, node);
      sortTreeArray(parentNodeContainer);
      selectTranslationByPath(state, node.path);
      expandPath(state.translations, node.path);
    },
  },
});

export const selectFiles = (state) => state.editor.files;
export const selectTranslations = (state) => state.editor.translations;
export const selectSettings = (state) => state.editor.settings;
export const selectSelectedTranslation = (state) =>
  state.editor.selectedTranslation;
export const selectLanguages = createSelector(
  selectSettings,
  (settings) => settings.languages
);
export const selectGenerationRules = createSelector(
  selectSettings,
  (settings) => settings.generationRules
);

export const {
  clickTranslation,
  loadTranslations,
  updateTranslation,
  removeTranslation,
  selectTranslation,
  addTranslation,
  renameTranslation,
  changeSettings,
} = editorSlice.actions;

export default editorSlice.reducer;
