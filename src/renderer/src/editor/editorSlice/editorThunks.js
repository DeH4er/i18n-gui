import { createAsyncThunk } from "@reduxjs/toolkit";
import { readTranslationFile, writeJson } from "src/core/file";
import { jsonsToTree } from "src/core/tree";
import { v4 as uuidv4 } from "uuid";
import {
  selectLanguages,
  selectProject,
  selectProjectId,
  selectRecentProjects,
  selectTranslations
} from ".";
import { treeToJsons } from "../../core/tree";
import { offlineStorage } from "../../offline-storage/offline-storage";

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

    await offlineStorage.set("recent-projects", newRecentProjects);
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
