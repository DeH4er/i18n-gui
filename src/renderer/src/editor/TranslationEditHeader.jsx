import { Button, KIND } from 'baseui/button';
import { FiCheck, FiEdit, FiTrash } from 'react-icons/fi';

import CopyPathButton from 'src/components/CopyPathButton';
import Tooltip from 'src/components/Tooltip';

import ConnectAction from './ConnectAction';
import TranslationHeader from './TranslationHeader';

export default function TranslationEditHeader({
  translation,
  connectedLanguages,
  isUpdating,
  edited,
  setConnectedLanguages,
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
      {Object.keys(connectedLanguages).length > 0 && (
        <ConnectAction
          connectedLanguages={connectedLanguages}
          setConnectedLanguages={setConnectedLanguages}
        />
      )}
      {isUpdating && <CopyPathButton path={translation.path} />}
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
