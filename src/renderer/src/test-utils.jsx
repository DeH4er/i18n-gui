import { Provider } from 'react-redux';
import { HashRouter } from 'react-router-dom';

import { queries, render } from '@testing-library/react';
import { BaseProvider, DarkTheme } from 'baseui';
import { Client as Styletron } from 'styletron-engine-atomic';
import { Provider as StyletronProvider } from 'styletron-react';

import createStore from 'src/store';

import * as customQueries from './test-queries';

function Providers({ children, storeOptions }) {
  const store = createStore(storeOptions);
  const engine = new Styletron();
  return (
    <StyletronProvider value={engine}>
      <BaseProvider theme={DarkTheme}>
        <HashRouter>
          <Provider store={store}>{children}</Provider>
        </HashRouter>
      </BaseProvider>
    </StyletronProvider>
  );
}

const customRender = (ui, options = {}) =>
  render(ui, {
    queries: { ...queries, ...customQueries },
    wrapper: ({ children }) => (
      <Providers storeOptions={options.storeOptions}>{children}</Providers>
    ),
    ...options,
  });

export * from '@testing-library/react';
export { customRender as render };
