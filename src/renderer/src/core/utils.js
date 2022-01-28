// eslint-disable-next-line import/prefer-default-export
export function translateLanguage(language) {
  const map = {
    de: 'German',
    'en-us': 'English (United States)',
    'en-gb': 'English (Great Britain)',
    fr: 'French',
  };

  return map[language.toLowerCase()] ?? language;
}
