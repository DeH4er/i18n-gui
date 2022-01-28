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
import React, { useEffect, useState } from 'react';
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
      onClose={onCancel}
      closeable
      isOpen={isOpen}
      animate
      autoFocus
      size={ModalSize.default}
      role={ROLE.dialog}
      unstable_ModalBackdropScroll={true}
    >
      <ModalHeader>Enter the translation key </ModalHeader>
      <ModalBody>
        <FormControl error={pathExists ? 'Path already exists' : ''}>
          <Input
            error={pathExists}
            value={pathStr}
            onChange={(e) => setPathStr(e.target.value)}
          />
        </FormControl>
      </ModalBody>
      <ModalFooter>
        <ModalButton kind={KIND.tertiary} onClick={onCancel}>
          Cancel
        </ModalButton>
        <ModalButton
          onClick={() => onConfirm(pathStr.split('.'))}
          disabled={pathExists}
        >
          Confirm
        </ModalButton>
      </ModalFooter>
    </Modal>
  );
}
