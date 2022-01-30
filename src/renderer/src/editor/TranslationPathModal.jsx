import { useEffect, useState } from 'react';

import { KIND } from 'baseui/button';
import { FormControl } from 'baseui/form-control';
import { Input } from 'baseui/input';
import {
  Modal,
  ModalBody,
  ModalButton,
  ModalFooter,
  ModalHeader,
  ROLE,
  SIZE as ModalSize,
} from 'baseui/modal';

import { isPathExist } from 'src/core/tree';

export default function TranslationPathModal({
  tree,
  onCancel,
  isOpen,
  onConfirm,
  path,
  pathExistError,
}) {
  const [pathStr, setPathStr] = useState('');
  const [pathExists, setPathExists] = useState(false);

  function isValid() {
    return !pathExists && pathExistError;
  }

  function confirm() {
    if (isValid()) {
      onConfirm(pathStr.split('.'));
    }
  }

  function cancel() {
    onCancel();
  }

  useEffect(() => {
    if (pathExistError) {
      const path = pathStr.split('.');
      setPathExists(isPathExist(tree, path));
    }
  }, [tree, pathStr, pathExistError]);

  useEffect(() => {
    setPathStr(path.join('.'));
  }, [isOpen]);

  return (
    <Modal
      onClose={cancel}
      closeable
      isOpen={isOpen}
      animate
      autoFocus
      size={ModalSize.default}
      role={ROLE.dialog}
      unstable_ModalBackdropScroll
    >
      <ModalHeader>Enter the translation key </ModalHeader>
      <ModalBody>
        <FormControl error={!isValid() ? 'Path already exists' : ''}>
          <Input
            error={pathExists}
            value={pathStr}
            onChange={(e) => setPathStr(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                confirm();
              }
            }}
          />
        </FormControl>
      </ModalBody>
      <ModalFooter>
        <ModalButton kind={KIND.tertiary} onClick={cancel}>
          Cancel
        </ModalButton>
        <ModalButton onClick={confirm} disabled={!isValid()}>
          Confirm
        </ModalButton>
      </ModalFooter>
    </Modal>
  );
}
