import "@mantine/core/styles.css";
import { CSSVariablesResolver, MantineProvider } from "@mantine/core";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { App } from "./App";
import { store } from "./store";

const cssVariablesResolver: CSSVariablesResolver = () => ({
  variables: {},
  light: {},
  dark: { "--mantine-color-body": "#000000" },
});

const root = document.getElementById("root");
if (!root) throw new Error("No #root element found");

createRoot(root).render(
  <StrictMode>
    <Provider store={store}>
      <MantineProvider defaultColorScheme="dark" cssVariablesResolver={cssVariablesResolver}>
        <App />
      </MantineProvider>
    </Provider>
  </StrictMode>
);
