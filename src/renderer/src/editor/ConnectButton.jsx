import React from 'react';

import { Button, KIND } from 'baseui/button';
import { FiLock, FiUnlock } from 'react-icons/fi';

import Tooltip from 'src/components/Tooltip';

export default function ConnectButton({ connected, setConnected }) {
  return (
    <Tooltip tooltip={`${connected ? 'Unlock' : 'Lock'} generation`}>
      <Button
        data-testvalue={connected}
        kind={KIND.tertiary}
        onClick={() => setConnected(!connected)}
      >
        {connected ? <FiLock /> : <FiUnlock />}
      </Button>
    </Tooltip>
  );
}
