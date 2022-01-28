import React, { useCallback } from 'react';

import { useStyletron } from 'baseui';
import { PLACEMENT, StatefulPopover, TRIGGER_TYPE } from 'baseui/popover';

function Tooltip({ tooltip, children, ...rest }) {
  const [, theme] = useStyletron();

  const tooltipContent = useCallback(
    () => (
      <div style={{ ...theme.typography.font200, padding: '10px 20px' }}>
        {tooltip}
      </div>
    ),
    [tooltip]
  );

  return (
    <StatefulPopover
      placement={PLACEMENT.bottom}
      content={tooltipContent}
      triggerType={TRIGGER_TYPE.hover}
      returnFocus={false}
      {...rest}
    >
      {children}
    </StatefulPopover>
  );
}

export default React.memo(Tooltip);
