import { useStyletron } from 'baseui';

import Titlebar from './components/Titlebar';

export default function ScreenWrapper({ children }) {
  const [, theme] = useStyletron();
  return (
    <div
      style={{
        width: '100vw',
        height: '100vh',
        background: theme.colors.backgroundPrimary,
        overflow: 'auto',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Titlebar />
      <div
        style={{
          flex: '1',
          overflow: 'auto',
        }}
      >
        {children}
      </div>
    </div>
  );
}
