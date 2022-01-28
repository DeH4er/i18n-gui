import { useStyletron } from 'baseui';
import { Button, KIND, SIZE } from 'baseui/button';
import { FiMinus, FiX } from 'react-icons/fi';

function TitlebarButton({ children, ...props }) {
  return (
    <Button
      overrides={{
        BaseButton: {
          style: {
            paddingTop: '10px',
            paddingBottom: '10px',
            paddingLeft: '20px',
            paddingRight: '20px',
          },
        },
      }}
      size={SIZE.compact}
      kind={KIND.tertiary}
      {...props}
    >
      {children}
    </Button>
  );
}

export default function Titlebar() {
  const [, theme] = useStyletron();

  function minimize() {
    window.ipcRenderer.send('minimize');
  }

  function close() {
    window.ipcRenderer.send('close');
  }

  return (
    <div
      style={{
        height: '35px',
        ...theme.typography.font200,
        color: theme.colors.primary,
        display: 'flex',
      }}
    >
      <div
        style={{
          WebkitUserSelect: 'none',
          WebkitAppRegion: 'drag',
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          paddingLeft: '10px',
        }}
      >
        i18n Editor
      </div>
      <div
        style={{
          WebkitAppRegion: 'no-drag',
          display: 'flex',
        }}
      >
        <TitlebarButton onClick={minimize}>
          <FiMinus />
        </TitlebarButton>

        <TitlebarButton onClick={close}>
          <FiX />
        </TitlebarButton>
      </div>
    </div>
  );
}
