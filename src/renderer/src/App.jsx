import { BaseProvider, DarkTheme } from 'baseui';
import React from 'react';
import { Provider as ReduxProvider } from 'react-redux';
import { Client as Styletron } from 'styletron-engine-atomic';
import { Provider as StyletronProvider } from 'styletron-react';
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
            <RootRouter></RootRouter>
          </ScreenWrapper>
        </ReduxProvider>
      </BaseProvider>
    </StyletronProvider>
  );
}
