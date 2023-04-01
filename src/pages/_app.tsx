import styles from "../styles/app.module.scss";

import { ReactElement, ReactNode, useState } from "react";
import {
  AppShell,
  Navbar,
  Header,
  Footer,
  Aside,
  Text,
  MediaQuery,
  Burger,
  useMantineTheme,
  ColorScheme,
  ColorSchemeProvider,
  MantineProvider,
  Container,
} from "@mantine/core";
import { useWindowScroll, useHotkeys, useLocalStorage } from "@mantine/hooks";
import { AppProps } from "next/app";
import { NextPage } from "next";
import Link from "next/link";
import { ThemeToggle } from "@/components/buttons";

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

export default function AppShellDemo({
  Component,
  pageProps,
}: AppPropsWithLayout) {
  const theme = useMantineTheme();
  const [opened, setOpened] = useState(false);
  const [scroll, scrollTo] = useWindowScroll();
  const [colorScheme, setColorScheme] = useLocalStorage<ColorScheme>({
    key: "mantine-color-scheme",
    defaultValue: "light",
    getInitialValueInEffect: true,
  });

  const toggleColorScheme = (value?: ColorScheme) =>
    setColorScheme(value || (colorScheme === "dark" ? "light" : "dark"));

  useHotkeys([["mod+J", () => toggleColorScheme()]]);
  return (
    <ColorSchemeProvider
      colorScheme={colorScheme}
      toggleColorScheme={toggleColorScheme}
    >
      <MantineProvider
        theme={{ colorScheme }}
        withGlobalStyles
        withNormalizeCSS
      >
        <AppShell
          styles={{
            main: {
              background:
                theme.colorScheme === "dark"
                  ? theme.colors.dark[8]
                  : theme.colors.gray[0],
            },
          }}
          navbarOffsetBreakpoint="sm"
          asideOffsetBreakpoint="sm"
          footer={
            <Footer height={60} p="md">
              <div className={"inline"}>
                Brought to you by
                <div style={{ marginLeft: "5px" }} className={styles.trick}>
                  <span>Mister_Eth</span>
                </div>
              </div>
            </Footer>
          }
          header={
            <Header height={{ base: 50, md: 70 }} p="md">
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  height: "100%",
                }}
              >
                <div>
                  <Link href="/">
                    <Text className={styles.logoish}>ETHTPS.info</Text>
                  </Link>
                </div>
                <Container style={{ float: "right", marginRight: 0 }}>
                  <ThemeToggle />
                </Container>
              </div>
            </Header>
          }
        >
          {<Component {...pageProps} />}
        </AppShell>
      </MantineProvider>
    </ColorSchemeProvider>
  );
}
