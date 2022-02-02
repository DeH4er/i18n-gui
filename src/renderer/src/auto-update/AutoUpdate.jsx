import { useEffect, useState } from 'react';

import { useStyletron } from 'baseui';
import { Button, SIZE } from 'baseui/button';
import { Label2 } from 'baseui/typography';

const { ipcRenderer } = window;

export default function AutoUpdate({ children }) {
  const [updateEvent, setUpdateEvent] = useState(null);
  const [, theme] = useStyletron();

  function checkForUpdates() {
    ipcRenderer.on('update', (_, event, payload) => {
      setUpdateEvent({
        event,
        payload: payload ? JSON.parse(payload) : undefined,
      });
    });

    ipcRenderer.send('check-for-updates');
  }

  function installUpdate() {
    ipcRenderer.send('update-install');
  }

  useEffect(() => {
    checkForUpdates();
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ flex: 1, overflow: 'auto' }}>{children}</div>

      {(updateEvent?.event === 'download-progress' ||
        updateEvent?.event === 'update-downloaded') && (
        <div
          style={{
            background: theme.colors.backgroundAccent,
            boxSizing: 'border-box',
            height: '48px',
            padding: '10px',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          {updateEvent?.event === 'download-progress' && (
            <Label2>
              Downloading new app version...{' '}
              {Math.floor(updateEvent.payload.percent)}%
            </Label2>
          )}

          {updateEvent?.event === 'update-downloaded' && (
            <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
              <Label2>New app version is ready to be installed</Label2>
              <Button size={SIZE.mini} onClick={() => installUpdate()}>
                Install
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
