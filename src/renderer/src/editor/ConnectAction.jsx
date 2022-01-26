import { Button, KIND } from "baseui/button";
import { FiLock, FiUnlock } from "react-icons/fi";

export default function ConnectToggle({
  connectedLanguages,
  setConnectedLanguages,
}) {
  const connectAllMode = isConnectAllMode();

  function isConnectAllMode() {
    const someDisconnected = Object.keys(connectedLanguages).some(
      (language) => !connectedLanguages[language]
    );
    return someDisconnected;
  }

  function toggle() {
    setConnectedLanguages(
      Object.keys(connectedLanguages).reduce(
        (acc, language) => ({ ...acc, [language]: connectAllMode }),
        {}
      )
    );
  }

  return (
    <Button kind={KIND.secondary} onClick={toggle}>
      {connectAllMode ? <FiUnlock /> : <FiLock />}
    </Button>
  );
}
