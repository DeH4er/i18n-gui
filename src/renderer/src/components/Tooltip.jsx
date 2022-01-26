import { useStyletron } from "baseui";
import { PLACEMENT, StatefulPopover, TRIGGER_TYPE } from "baseui/popover";

export default function Tooltip({ tooltip, children }) {
  const [, theme] = useStyletron();

  return (
    <StatefulPopover
      placement={PLACEMENT.bottom}
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
