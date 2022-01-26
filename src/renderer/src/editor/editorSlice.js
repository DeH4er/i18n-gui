import {
    createAsyncThunk,
    createSelector,
    createSlice
} from "@reduxjs/toolkit";
import { readTranslationFile, writeJson } from "src/core/file";
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
} from "src/core/tree";
import { v4 as uuidv4 } from "uuid";
import { treeToJsons } from "../core/tree";
import { offlineStorage } from "../offline-storage/offline-storage";

export const loadRecentProjects = createAsyncThunk(
  "editor/loadRecentProjects",
  async () => {
    return await offlineStorage.get("recent-projects");
  }
);

export const changeProject = createAsyncThunk(
  "editor/changeProject",
  async (projectChanges, thunk) => {
    const state = thunk.getState();
    const recentProjects = selectRecentProjects(state);
    const projectId = selectProjectId(state);
    const newProject = { ...recentProjects[projectId], ...projectChanges };
    const newRecentProjects = { ...recentProjects, [projectId]: newProject };
    await offlineStorage.set("recent-projects", newRecentProjects);
    return newRecentProjects;
  }
);

export const createProject = createAsyncThunk(
  "editor/createProject",
  async ({ paths, projectName }, thunk) => {
    const state = thunk.getState();
    const files = await Promise.all(paths.map(readTranslationFile));
    const languages = files.map((f) => f.name);
    const generationRules = languages.reduce(
      (acc, language) => ({
        ...acc,
        [language]: "",
      }),
      {}
    );

    const project = {
      id: uuidv4(),
      timestamp: Date.now(),
      name: projectName,
      paths: files.map((f) => ({ path: f.path, language: f.name })),
      languages,
      generationRules,
    };

    const recentProjects = selectRecentProjects(state);
    const newRecentProjects = { ...recentProjects, [project.id]: project };
    const translations = jsonsToTree(
      files.map((f) => f.content),
      files.map((f) => f.name)
    );

    await offlineStorage.set("recent-projects", newRecentProjects);
    return { id: project.id, recentProjects: newRecentProjects, translations };
  }
);

export const openRecentProject = createAsyncThunk(
  "editor/openRecentProject",
  async (id, thunk) => {
    const state = thunk.getState();
    const recentProjects = selectRecentProjects(state);
    const project = recentProjects[id];
    const files = await Promise.all(
      project.paths.map((p) => readTranslationFile(p.path))
    );
    const newRecentProjects = {
      ...recentProjects,
      [id]: { ...project, timestamp: Date.now() },
    };

    const translations = jsonsToTree(
      files.map((f) => f.content),
      files.map((f) => f.name)
    );

    await offlineStorage.set("recent-project", newRecentProjects);
    return { id, recentProjects: newRecentProjects, translations };
  }
);

export const removeProject = createAsyncThunk(
  "editor/removeProject",
  async (id, thunk) => {
    const state = thunk.getState();
    const recentProjects = selectRecentProjects(state);
    const { [id]: removedProject, ...newRecentProjects } = recentProjects;
    await offlineStorage.set("recent-project", newRecentProjects);
    return newRecentProjects;
  }
);

export const pull = createAsyncThunk("editor/pull", async (_, thunk) => {
  const state = thunk.getState();
  const project = selectProject(state);
  const files = await Promise.all(
    project.paths.map((p) => readTranslationFile(p.path))
  );
  const translations = jsonsToTree(
    files.map((f) => f.content),
    files.map((f) => f.name)
  );
  return translations;
});

export const push = createAsyncThunk("editor/push", async (_, thunk) => {
  const state = thunk.getState();
  const translations = selectTranslations(state);
  const project = selectProject(state);
  const languages = selectLanguages(state);
  const jsons = treeToJsons(translations, languages);
  await Promise.all(
    project.paths.map((p) =>
      writeJson(jsons[p.language], p.path, { tabSize: 2 })
    )
  );
});

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
    projectId: null,
    recentProjects: {},
    translations: [],
    selectedTranslation: null,
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
    },
    [openRecentProject.fulfilled]: (state, action) => {
      const { id, recentProjects, translations } = action.payload;
      state.projectId = id;
      state.recentProjects = recentProjects;
      state.translations = translations;
      state.selectedTranslation = null;
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

export const selectTranslations = (state) => state.editor.translations;
export const selectRecentProjects = (state) => state.editor.recentProjects;
export const selectProjectId = (state) => state.editor.projectId;
export const selectProject = createSelector(
  selectRecentProjects,
  selectProjectId,
  (recentProjects, projectId) => recentProjects[projectId]
);
export const selectSelectedTranslation = (state) =>
  state.editor.selectedTranslation;
export const selectLanguages = createSelector(
  selectProject,
  (project) => project.languages
);
export const selectGenerationRules = createSelector(
  selectProject,
  (project) => project.generationRules
);

export const {
  clickTranslation,
  updateTranslation,
  removeTranslation,
  selectTranslation,
  addTranslation,
  renameTranslation,
} = editorSlice.actions;

export default editorSlice.reducer;
