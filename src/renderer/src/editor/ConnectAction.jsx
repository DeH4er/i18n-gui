import Action from "../components/Action";

export default function ConnectToggle({
  connectedLanguages,
  setConnectedLanguages,
  onClick,
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
    onClick();
  }

  return (
    <Action
      onClick={toggle}
      label={connectAllMode ? "Connect all" : "Disconnect all"}
    />
  );
}
