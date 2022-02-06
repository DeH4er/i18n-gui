import { Button, KIND } from 'baseui/button';
import { FiCheck, FiEdit, FiTrash } from 'react-icons/fi';

import CopyPathButton from 'src/components/CopyPathButton';
import Tooltip from 'src/components/Tooltip';

import ToggleLockAllButton from './ToggleLockAllButton';
import TranslationHeader from './TranslationHeader';

export default function TranslationEditHeader({
  translation,
  lockedLanguages,
  isUpdating,
  edited,
  setLockedLanguages,
  rename,
  save,
  select,
  setRemoveModalOpen,
}) {
  return (
    <TranslationHeader path={translation.path} select={select}>
      {isUpdating && (
        <>
          <Tooltip tooltip="Delete">
            <Button
              data-testid="remove-node"
              kind={KIND.secondary}
              onClick={() => setRemoveModalOpen(true)}
            >
              <FiTrash />
            </Button>
          </Tooltip>
          <Tooltip tooltip="Rename">
            <Button
              data-testid="rename-node"
              kind={KIND.secondary}
              onClick={rename}
            >
              <FiEdit />
            </Button>
          </Tooltip>
        </>
      )}
      {isUpdating && <CopyPathButton path={translation.path} />}
      {Object.keys(lockedLanguages).length > 0 && (
        <ToggleLockAllButton
          lockedLanguages={lockedLanguages}
          setLockedLanguages={setLockedLanguages}
        />
      )}
      <Tooltip tooltip="Confirm changes">
        <Button
          data-testid="save-node"
          onClick={() => {
            save(edited);
          }}
        >
          <FiCheck />
        </Button>
      </Tooltip>
    </TranslationHeader>
  );
}
