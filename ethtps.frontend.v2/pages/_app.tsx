// _app.tsx
import { AppProps } from "next/app";
import { MantineProvider } from "@mantine/core";
import { rtlCache } from "../rtl-cache";
import { TestPage } from "../../ethtps.pages/src/TestPage";

export default function App(props: AppProps) {
  const { Component, pageProps } = props;
  return (
    <div dir="rtl">
      <MantineProvider
        theme={{ dir: "rtl" }}
        withGlobalStyles
        withNormalizeCSS
        emotionCache={rtlCache}
      >
        <Component {...pageProps} />
        <TestPage />
      </MantineProvider>
    </div>
  );
}
