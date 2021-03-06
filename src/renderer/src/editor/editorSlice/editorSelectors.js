import { createSelector } from '@reduxjs/toolkit';

import { filterTree, getChildArray } from 'src/core/tree';

export const selectTranslations = (state) => state.editor.translations;

export const selectRecentProjects = (state) => state.editor.recentProjects;

export const selectOrderedRecentProjects = createSelector(
  selectRecentProjects,
  (recentProjects) => {
    const res = Object.keys(recentProjects)
      .map((projectId) => recentProjects[projectId])
      .sort((p1, p2) => p2.timestamp - p1.timestamp);
    return res;
  }
);

export const selectProjectId = (state) => state.editor.projectId;

export const selectProject = createSelector(
  selectRecentProjects,
  selectProjectId,
  (recentProjects, projectId) => recentProjects?.[projectId]
);

export const selectSelectedTranslation = (state) =>
  state.editor.selectedTranslation;

export const selectLanguages = createSelector(
  selectProject,
  (project) => project?.languages
);

export const selectGenerationRules = createSelector(
  selectProject,
  (project) => project?.generationRules
);

export const selectSearch = (state) => state.editor.search;

export const selectKeyMode = (state) => state.editor.keyMode;

export const selectFilteredTranslations = createSelector(
  selectSearch,
  selectTranslations,
  selectKeyMode,
  (search, translations, keyMode) => {
    let filteredTranslations;

    if (!search) {
      filteredTranslations = translations;
    } else {
      filteredTranslations = translations
        .map((node) =>
          filterTree(node, (node) => {
            const searchLower = search.toLowerCase();
            const searchParts = searchLower.split('.');
            let partsMatched = 0;

            node.path.forEach((p) => {
              if (p.toLowerCase().includes(searchParts[partsMatched])) {
                partsMatched += 1;
              }
            });

            const pathMatches = partsMatched === searchParts.length;

            if (node.children) {
              return pathMatches;
            }

            return (
              pathMatches ||
              Object.keys(node.translations).some((language) =>
                node.translations[language]
                  ?.toLowerCase?.()
                  ?.includes?.(searchLower)
              )
            );
          })
        )
        .filter(Boolean);
    }

    if (keyMode === 'list') {
      const list = filteredTranslations
        .map((node) => getChildArray(node))
        .reduce((total, arr) => [...total, ...arr], []);

      return list;
    }

    return filteredTranslations;
  }
);
