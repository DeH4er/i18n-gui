import { KIND } from 'baseui/button';

import Tooltip from 'src/components/Tooltip';

import LockButton from './LockButton';

export default function ToggleLockAllButton({
  lockedLanguages,
  setLockedLanguages,
}) {
  const lockAllMode = isLockAllMode();

  function isLockAllMode() {
    const someUnlocked = Object.keys(lockedLanguages).some(
      (language) => !lockedLanguages[language]
    );
    return someUnlocked;
  }

  function toggle() {
    setLockedLanguages(
      Object.keys(lockedLanguages).reduce(
        (acc, language) => ({ ...acc, [language]: lockAllMode }),
        {}
      )
    );
  }

  return (
    <Tooltip tooltip={`${lockAllMode ? 'Lock' : 'Unlock'} all`}>
      <LockButton
        kind={KIND.secondary}
        isLocked={!lockAllMode}
        onClick={toggle}
      />
    </Tooltip>
  );
}
