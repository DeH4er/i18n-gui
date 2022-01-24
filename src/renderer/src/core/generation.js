export function getLanguages(rule) {
  if (!rule) {
    return [];
  }

  return Array.from(rule.matchAll(/{(\S+)}/g)).map((m) => m[1]);
}

export function replaceTags(translation, languages) {
  return (
    translation?.replace(/{(\S+)}/g, (match, language) => {
      if (!languages.hasOwnProperty(language)) {
        return "";
      }

      return languages[language];
    }) ?? ""
  );
}
