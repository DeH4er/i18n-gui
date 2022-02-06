import { useEffect } from 'react';

import { useStyletron } from 'baseui';
import { Textarea } from 'baseui/textarea';

import LanguageLabel from 'src/components/LanguageLabel';
import { replaceTags } from 'src/core/generation';

import ToggleLockButton from './ToggleLockButton';

export default function TranslationControl({
  language,
  translation,
  translations,
  setTranslation,
  rule,
  locked,
  setLocked,
}) {
  const [, theme] = useStyletron();
  useEffect(() => {
    if (rule && locked) {
      const replacedTags = replaceTags(rule, translations);
      if (replacedTags !== translation) {
        setTranslation(replacedTags);
      }
    }
  }, [rule, translations, locked]);

  return (
    <div data-testid="translation-control" data-testlanguage={language}>
      <div
        style={{
          ...theme.typography.font350,
          display: 'flex',
          alignItems: 'baseline',
          justifyContent: 'space-between',
          color: theme.colors.primary,
          marginBottom: '5px',
        }}
      >
        <LanguageLabel language={language} />
        {rule && <ToggleLockButton locked={locked} setLocked={setLocked} />}
      </div>

      <span data-testid="translation-input">
        <Textarea
          value={translation}
          onChange={(e) => setTranslation(e.target.value)}
        />
      </span>
    </div>
  );
}
