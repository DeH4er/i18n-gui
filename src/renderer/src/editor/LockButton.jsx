import { forwardRef } from 'react';

import { useStyletron } from 'baseui';
import { Button } from 'baseui/button';
import { FiUnlock, FiLock } from 'react-icons/fi';

function LockButton({ forwardedRef, isLocked, onClick, ...props }) {
  const [, theme] = useStyletron();
  return (
    <Button onClick={onClick} {...props} ref={forwardedRef}>
      <div
        style={{ lineHeight: 0, color: isLocked ? theme.colors.accent : '' }}
      >
        {isLocked ? <FiLock /> : <FiUnlock />}
      </div>
    </Button>
  );
}

export default forwardRef((props, ref) => (
  <LockButton {...props} forwardedRef={ref} />
));
