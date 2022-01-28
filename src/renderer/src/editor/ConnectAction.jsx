import React from 'react';

import { Button, KIND } from 'baseui/button';
import { FiLock, FiUnlock } from 'react-icons/fi';

import Tooltip from 'src/components/Tooltip';

export default React.forwardRef(
  ({ connectedLanguages, setConnectedLanguages }, ref) => {
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
      <Tooltip tooltip={`${connectAllMode ? 'Lock' : 'Unlock'} all`}>
        <Button ref={ref} kind={KIND.secondary} onClick={toggle}>
          {connectAllMode ? <FiUnlock /> : <FiLock />}
        </Button>
      </Tooltip>
    );
  }
);
