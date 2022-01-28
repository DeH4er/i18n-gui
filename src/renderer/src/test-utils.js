import { render } from "@testing-library/react";
import { BaseProvider, DarkTheme } from "baseui";
import React from "react";
import { Provider } from "react-redux";
import createStore from "src/store";
import { Client as Styletron } from "styletron-engine-atomic";
import { Provider as StyletronProvider } from "styletron-react";

const Providers = ({ children }) => {
  const store = createStore();
  const engine = new Styletron();
  return (
    <StyletronProvider value={engine}>
      <BaseProvider theme={DarkTheme}>
        <Provider store={store}>{children}</Provider>
      </BaseProvider>
    </StyletronProvider>
  );
};

const customRender = (ui, options) =>
  render(ui, { wrapper: Providers, ...options });

export * from "@testing-library/react";
export { customRender as render };

