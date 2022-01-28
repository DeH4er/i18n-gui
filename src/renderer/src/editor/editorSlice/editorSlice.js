import { createSlice } from '@reduxjs/toolkit';

import {
  createNestedPath,
  expandPath,
  getNode,
  getParentNode,
  isParentOrSamePath,
  isPathExist,
  isRootNode,
  modifyEveryChildNode,
  modifyNode,
  rebuildChildrenPath,
  removeNode,
  replaceNodeOrPush,
  sortTreeArray,
} from 'src/core/tree';

import {
  changeProject,
  createProject,
  loadRecentProjects,
  openRecentProject,
  pull,
  removeProject,
} from './editorThunks';

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
  name: 'editor',
  initialState: {
    projectId: null,
    recentProjects: {},
    translations: null,
    selectedTranslation: null,
    search: '',
    keyMode: 'tree',
  },
  reducers: {
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
    setSearch: (state, action) => {
      state.search = action.payload;
    },
    expandAll: (state) => {
      state.translations.forEach((node) =>
        modifyEveryChildNode(node, (node) => {
          node.isExpanded = true;
        })
      );
    },
    collapseAll: (state) => {
      state.translations.forEach((node) =>
        modifyEveryChildNode(node, (node) => {
          node.isExpanded = false;
        })
      );
    },
    setKeyMode: (state, action) => {
      state.keyMode = action.payload;
    },
  },
  extraReducers: {
    [changeProject.fulfilled]: (state, action) => {
      state.recentProjects = action.payload;
    },
    [createProject.fulfilled]: (state, action) => {
      const { id, recentProjects, translations } = action.payload;
      state.projectId = id;
      state.recentProjects = recentProjects;
      state.translations = translations;
      state.selectedTranslation = null;
      state.keyMode = 'tree';
      state.search = '';
    },
    [openRecentProject.fulfilled]: (state, action) => {
      const { id, recentProjects, translations } = action.payload;
      state.projectId = id;
      state.recentProjects = recentProjects;
      state.translations = translations;
      state.selectedTranslation = null;
      state.keyMode = 'tree';
      state.search = '';
    },
    [removeProject.fulfilled]: (state, action) => {
      state.recentProjects = action.payload;
    },
    [loadRecentProjects.fulfilled]: (state, action) => {
      state.recentProjects = action.payload;
    },
    [pull.fulfilled]: (state, action) => {
      state.translations = action.payload;

      if (state.selectedTranslation) {
        const node = getNode(
          state.translations,
          state.selectedTranslation.path
        );

        state.selectedTranslation = node;

        if (node) {
          expandPath(state.translations, node.path);
          node.isSelected = true;
        }
      }
    },
  },
});

export const {
  clickTranslation,
  updateTranslation,
  removeTranslation,
  selectTranslation,
  addTranslation,
  renameTranslation,
  setSearch,
  setSearchType,
  expandAll,
  collapseAll,
  setKeyMode,
} = editorSlice.actions;

export default editorSlice.reducer;
