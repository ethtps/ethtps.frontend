import "@mantine/core/styles.css";
import { CSSVariablesResolver, MantineProvider } from "@mantine/core";
import { StrictMode, useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { App } from "./App";
import { StatusPage } from "./pages/StatusPage";
import { store } from "./store";

const cssVariablesResolver: CSSVariablesResolver = () => ({
  variables: {},
  light: {},
  dark: { "--mantine-color-body": "#000000" },
});

function Router() {
  const [hash, setHash] = useState(() => window.location.hash);
  useEffect(() => {
    const handler = () => setHash(window.location.hash);
    window.addEventListener("hashchange", handler);
    return () => window.removeEventListener("hashchange", handler);
  }, []);
  return hash.startsWith("#/status") ? <StatusPage /> : <App />;
}

const root = document.getElementById("root");
if (!root) throw new Error("No #root element found");

createRoot(root).render(
  <StrictMode>
    <Provider store={store}>
      <MantineProvider defaultColorScheme="dark" cssVariablesResolver={cssVariablesResolver}>
        <Router />
      </MantineProvider>
    </Provider>
  </StrictMode>
);
