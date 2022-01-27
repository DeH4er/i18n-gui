import { useStyletron } from "baseui";
import Tooltip from "src/components/Tooltip";

export default function SettingsTip({ children }) {
  const [css, theme] = useStyletron();
  return (
    <Tooltip tooltip={<div style={{ maxWidth: "250px" }}>{children}</div>}>
      <div
        className={css({
          ...theme.typography.font150,
          transition: `color ${theme.animation.timing300}`,
          color: theme.colors.primary400,
          cursor: "pointer",
          ":hover": {
            color: theme.colors.primary,
          },
        })}
      >
        What is this?
      </div>
    </Tooltip>
  );
}
