import { Provider as ReduxProvider } from 'react-redux';

import { BaseProvider, DarkTheme } from 'baseui';
import { Client as Styletron } from 'styletron-engine-atomic';
import { Provider as StyletronProvider } from 'styletron-react';

import AutoUpdate from './auto-update/AutoUpdate';
import RootRouter from './RootRouter';
import ScreenWrapper from './ScreenWrapper';
import createStore from './store';

const store = createStore();
const engine = new Styletron();

export default function App() {
  return (
    <StyletronProvider value={engine}>
      <BaseProvider theme={DarkTheme}>
        <ReduxProvider store={store}>
          <ScreenWrapper>
            <AutoUpdate>
              <RootRouter />
            </AutoUpdate>
          </ScreenWrapper>
        </ReduxProvider>
      </BaseProvider>
    </StyletronProvider>
  );
}
