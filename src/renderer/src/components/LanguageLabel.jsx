import React, { memo } from 'react';

import { useStyletron } from 'baseui';

import { translateLanguage } from 'src/core/utils';

function LanguageLabel({ language }) {
  const translated = translateLanguage(language);
  const [, theme] = useStyletron();

  if (translated !== language) {
    return (
      <div
        style={{
          ...theme.typography.font300,
          display: 'flex',
          gap: '10px',
          alignItems: 'baseline',
        }}
      >
        <div>{translated}</div>
        <div
          style={{
            ...theme.typography.font150,
            color: theme.colors.primary400,
            marignLeft: '20px',
          }}
        >
          {language}
        </div>
      </div>
    );
  }

  return translated;
}

export default memo(LanguageLabel);
