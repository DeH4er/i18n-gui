import { useStyletron } from "baseui";
import { StatefulPopover, TRIGGER_TYPE } from "baseui/popover";

export default function Tooltip({ tooltip, children }) {
  const [, theme] = useStyletron();

  return (
    <StatefulPopover
      content={() => (
        <div style={{ ...theme.typography.font200, padding: "10px 20px" }}>
          {tooltip}
        </div>
      )}
      triggerType={TRIGGER_TYPE.hover}
    >
      {children}
    </StatefulPopover>
  );
}
