import { useStyletron } from 'baseui';
import { Button } from 'baseui/button';
import { FiUnlock, FiLock } from 'react-icons/fi';

export default function LockButton({ isLocked, onClick, ...props }) {
  const [, theme] = useStyletron();
  return (
    <Button onClick={onClick} {...props}>
      <div
        style={{ lineHeight: 0, color: isLocked ? theme.colors.accent : '' }}
      >
        {isLocked ? <FiLock /> : <FiUnlock />}
      </div>
    </Button>
  );
}
