import { Button, KIND } from "baseui/button";

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
    <Button onClick={toggle} kind={KIND.secondary}>
      {connectAllMode ? "Connect all" : "Disconnect all"}
    </Button>
  );
}
