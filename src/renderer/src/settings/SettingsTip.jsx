import { useStyletron } from "baseui";
import { StatefulTooltip } from "baseui/tooltip";

export default function SettingsTip({ children }) {
  const [, theme] = useStyletron();
  return (
    <StatefulTooltip
      content={
        <div
          style={{
            maxWidth: "250px",
          }}
        >
          {children}
        </div>
      }
    >
      <div
        style={{
          ...theme.typography.font150,
          transition: `color ${theme.animation.timing300}`,
          color: theme.colors.primary400,
          cursor: "pointer",
          ":hover": {
            color: theme.colors.primary,
          },
        }}
      >
        What is this?
      </div>
    </StatefulTooltip>
  );
}
