import { useEffect, useState } from 'react';

import { useStyletron } from 'baseui';
import { Button, SIZE } from 'baseui/button';
import { Label2 } from 'baseui/typography';

const { ipcRenderer } = window;

export default function AutoUpdate({ children }) {
  const [updateEvent, setUpdateEvent] = useState(null);
  const [isDismissed, setIsDismissed] = useState(false);
  const [, theme] = useStyletron();

  useEffect(() => {
    checkForUpdates();
  }, []);

  function checkForUpdates() {
    ipcRenderer.on('update', (_, event, payload) => {
      setUpdateEvent({
        event,
        payload: payload ? JSON.parse(payload) : undefined,
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
                <Button size={SIZE.mini} onClick={installUpdate}>
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
    </div>
  );
}
