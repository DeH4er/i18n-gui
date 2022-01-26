import { useStyletron } from "baseui";
import { Textarea } from "baseui/textarea";
import { useEffect } from "react";
import LanguageLabel from "src/components/LanguageLabel";
import { replaceTags } from "src/core/generation";
import ConnectButton from "./ConnectButton";

export default function TranslationControl({
  language,
  translation,
  translations,
  setTranslation,
  rule,
  connected,
  setConnected,
}) {
  const [, theme] = useStyletron();
  useEffect(() => {
    if (rule && connected) {
      const replacedTags = replaceTags(rule, translations);
      if (replacedTags !== translation) {
        setTranslation(replacedTags);
      }
    }
  }, [rule, translations, connected]);

  return (
    <div>
      <div
        style={{
          ...theme.typography.font350,
          display: "flex",
          alignItems: "baseline",
          justifyContent: "space-between",
          color: theme.colors.primary,
          marginBottom: "5px",
        }}
      >
        <LanguageLabel language={language} />
        {rule && (
          <ConnectButton connected={connected} setConnected={setConnected} />
        )}
      </div>

      <Textarea
        value={translation}
        onChange={(e) => setTranslation(e.target.value)}
      />
    </div>
  );
}
