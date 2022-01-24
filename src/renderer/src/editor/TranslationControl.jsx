import LanguageLabel from "@/components/LanguageLabel";
import { replaceTags } from "@/core/generation";
import { FormControl } from "baseui/form-control";
import { Textarea } from "baseui/textarea";
import { useEffect } from "react";
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
  useEffect(() => {
    if (rule && connected) {
      const replacedTags = replaceTags(rule, translations);
      if (replacedTags !== translation) {
        setTranslation(replacedTags);
      }
    }
  }, [rule, translations, connected, setTranslation, translation]);

  return (
    <FormControl
      label={() => (
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            justifyContent: "space-between",
          }}
        >
          <LanguageLabel language={language} />
          {rule && (
            <ConnectButton connected={connected} setConnected={setConnected} />
          )}
        </div>
      )}
    >
      <Textarea
        value={translation}
        onChange={(e) => setTranslation(e.target.value)}
      />
    </FormControl>
  );
}
