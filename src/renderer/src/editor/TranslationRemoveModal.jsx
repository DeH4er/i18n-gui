import { KIND } from 'baseui/button';
import {
  Modal,
  ModalBody,
  ModalButton,
  ModalFooter,
  ModalHeader,
  ROLE,
  SIZE as ModalSize,
} from 'baseui/modal';
import React from 'react';

export default function TranslationRemoveModal({
  translation,
  onConfirm,
  onCancel,
  isOpen,
  count,
}) {
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
      <ModalHeader>
        Confirm deletion{count > 0 ? ` of ${count} translations` : ''}
      </ModalHeader>
      <ModalBody>
        Are you sure you want to delete {translation.path.join('.')}?
        {count > 0 ? ` It contains ${count} translations.` : ''}
      </ModalBody>
      <ModalFooter>
        <ModalButton kind={KIND.tertiary} onClick={onCancel}>
          Cancel
        </ModalButton>
        <ModalButton onClick={onConfirm}>Confirm</ModalButton>
      </ModalFooter>
    </Modal>
  );
}
