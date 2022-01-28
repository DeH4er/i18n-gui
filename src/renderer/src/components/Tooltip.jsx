import { useStyletron } from 'baseui';
import { PLACEMENT, StatefulPopover, TRIGGER_TYPE } from 'baseui/popover';
import React from 'react';

function Tooltip({ tooltip, children, ...rest }) {
  const [, theme] = useStyletron();

  return (
    <StatefulPopover
      placement={PLACEMENT.bottom}
      content={() => (
        <div style={{ ...theme.typography.font200, padding: '10px 20px' }}>
          {tooltip}
        </div>
      )}
      triggerType={TRIGGER_TYPE.hover}
      returnFocus={false}
      {...rest}
    >
      {children}
    </StatefulPopover>
  );
}

export default React.memo(Tooltip);
