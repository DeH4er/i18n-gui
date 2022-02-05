/* eslint-disable react/no-danger */
import { useEffect, useState } from 'react';

import { useStyletron } from 'baseui';
import { Button, KIND, SIZE } from 'baseui/button';
import {
  Modal,
  ModalBody,
  ModalButton,
  ModalFooter,
  ModalHeader,
} from 'baseui/modal';
import { Label2 } from 'baseui/typography';
import xss from 'xss';

const { ipcRenderer } = window;

export default function AutoUpdate({ children }) {
  const [updateEvent, setUpdateEvent] = useState(null);
  const [isDismissed, setIsDismissed] = useState(false);
  const [isChangelogOpen, setIsChangelogOpen] = useState(false);
  const [updateInfo, setUpdateInfo] = useState(null);
  const [, theme] = useStyletron();

  useEffect(() => {
    checkForUpdates();
  }, []);

  function checkForUpdates() {
    ipcRenderer.on('update', (_, event, payload) => {
      const parsedPayload = payload ? JSON.parse(payload) : undefined;

      if (event === 'update-available') {
        setUpdateInfo(parsedPayload);
      }

      setUpdateEvent({
        event,
        payload: parsedPayload,
      });
    });

    ipcRenderer.send('check-for-updates');
  }

  function isUpdateBarOpen() {
    return (
      !isDismissed &&
      (updateEvent?.event === 'download-progress' ||
        updateEvent?.event === 'update-downloaded')
    );
  }

  function openChangelog() {
    setIsChangelogOpen(true);
  }

  function closeChangelog() {
    setIsChangelogOpen(false);
  }

  function installUpdate() {
    ipcRenderer.send('update-install');
  }

  function dismiss() {
    setIsDismissed(true);
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ flex: 1, overflow: 'auto' }}>{children}</div>

      {isUpdateBarOpen() && (
        <div
          style={{
            background: theme.colors.backgroundAccent,
            boxSizing: 'border-box',
            height: '48px',
            padding: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          {updateEvent?.event === 'download-progress' && (
            <Label2>
              Downloading new app version...{' '}
              {Math.floor(updateEvent.payload.percent)}%
            </Label2>
          )}

          {updateEvent?.event === 'update-downloaded' && (
            <>
              <div
                style={{ display: 'flex', gap: '20px', alignItems: 'center' }}
              >
                <Label2>New app version is ready to be installed</Label2>
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <Button size={SIZE.mini} onClick={openChangelog}>
                  Install
                </Button>
                <Button size={SIZE.mini} onClick={dismiss}>
                  Dismiss
                </Button>
              </div>
            </>
          )}
        </div>
      )}
      <Modal
        isOpen={isChangelogOpen}
        onClose={closeChangelog}
        closeable
        unstable_ModalBackdropScroll
        overrides={{
          Dialog: {
            style: {
              maxHeight: '500px',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
            },
          },
        }}
      >
        <ModalHeader>Changelog {updateInfo?.releaseName}</ModalHeader>
        <ModalBody style={{ height: '100%', overflow: 'auto' }}>
          <div
            dangerouslySetInnerHTML={{
              __html: updateInfo?.releaseNotes
                ? xss(updateInfo.releaseNotes)
                : '',
            }}
          />
        </ModalBody>
        <ModalFooter>
          <ModalButton kind={KIND.tertiary} onClick={closeChangelog}>
            Cancel
          </ModalButton>
          <ModalButton onClick={installUpdate}>Update</ModalButton>
        </ModalFooter>
      </Modal>
    </div>
  );
}
