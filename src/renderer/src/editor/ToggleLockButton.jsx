import { KIND } from 'baseui/button';

import Tooltip from 'src/components/Tooltip';

import LockButton from './LockButton';

export default function ToggleLockButton({ locked, setLocked }) {
  return (
    <Tooltip tooltip={`${locked ? 'Unlock' : 'Lock'} generation`}>
      <LockButton
        data-testvalue={locked}
        onClick={() => setLocked(!locked)}
        kind={KIND.tertiary}
        isLocked={locked}
      />
    </Tooltip>
  );
}
