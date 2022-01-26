import { Button, KIND } from "baseui/button";
import { FiLock, FiUnlock } from "react-icons/fi";

export default function ConnectButton({ connected, setConnected }) {
  return (
    <Button
      kind={KIND.tertiary}
      onClick={() => setConnected(!connected)}
    >
      {connected ? <FiLock /> : <FiUnlock />}
    </Button>
  );
}
