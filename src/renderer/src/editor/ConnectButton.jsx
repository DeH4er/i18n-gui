import { Button, KIND, SIZE } from "baseui/button";

export default function ConnectButton({ connected, setConnected }) {
  return (
    <Button
      size={SIZE.mini}
      kind={KIND.tertiary}
      onClick={() => setConnected(!connected)}
    >
      {connected ? "Disconnect" : "Connect"}
    </Button>
  );
}
