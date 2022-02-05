import { useCallback } from 'react';

import { Button, KIND } from 'baseui/button';
import { FiClipboard } from 'react-icons/fi';

import Tooltip from './Tooltip';

export default function CopyPathButton({ path }) {
  const copyPath = useCallback(() => {
    navigator.clipboard.writeText(path.join('.'));
  }, [path]);

  return (
    <Tooltip tooltip="Copy path">
      <Button kind={KIND.secondary} onClick={copyPath}>
        <FiClipboard />
      </Button>
    </Tooltip>
  );
}
