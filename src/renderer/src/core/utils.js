import langmap from 'langmap';

// eslint-disable-next-line import/prefer-default-export
export function translateLanguage(language) {
  return langmap[language]?.englishName ?? language;
}
