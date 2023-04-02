import styles from '../styles/app.module.scss'

import { ReactElement, ReactNode, useEffect, useState } from 'react'
import {
  AppShell,
  Footer,
  useMantineTheme,
  ColorScheme,
  ColorSchemeProvider,
  MantineProvider
} from '@mantine/core'
import { useWindowScroll, useHotkeys, useLocalStorage } from '@mantine/hooks'
import { AppProps } from 'next/app'
import { NextPage } from 'next'
import { HeaderWithTabs } from '@/components/headers'
import { QueryClientProvider } from 'react-query'
import { conditionalRender, queryClient, useAppState } from '@/services'
import { wrapper } from '@/data/src'
import HumanityProofPartial from '@/components/partials/humanity-proof/HumanityProofPartial'
import { getAPIKey, setAPIKey } from '@/services/DependenciesIOC'
import { useDispatch } from 'react-redux'
import { setApplicationDataLoaded } from '@/data/src/slices/ApplicationStateSlice'
export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode
}

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout
}

function AppShellDemo({ Component, pageProps }: AppPropsWithLayout) {
  const theme = useMantineTheme()
  const [opened, setOpened] = useState(false)
  const [scroll, scrollTo] = useWindowScroll()
  const [colorScheme, setColorScheme] = useLocalStorage<ColorScheme>({
    key: 'mantine-color-scheme',
    defaultValue: 'light',
    getInitialValueInEffect: true
  })

  const toggleColorScheme = (value?: ColorScheme) =>
    setColorScheme(value || (colorScheme === 'dark' ? 'light' : 'dark'))
  const [pendingReset, setPendingReset] = useState(false)
  const dispatch = useDispatch()
  useEffect(() => {
    if (pendingReset) {
      const key = getAPIKey()
      localStorage.clear()
      sessionStorage.clear()
      console.log('Cleared storage')
      setAPIKey(key as string)
      dispatch(setApplicationDataLoaded(false))
      window.location.reload()
    }
  }, [pendingReset, dispatch])
  useHotkeys([['mod+J', () => toggleColorScheme()]])
  useHotkeys([['mod+Z', () => setPendingReset(true)]])
  const dataLoaded = useAppState().applicationState.applicationDataLoaded
  const [showChild, setShowChild] = useState(false)
  useEffect(() => {
    setShowChild(true)
  }, [])
  if (!showChild) {
    return null
  }

  if (typeof window === 'undefined') {
    return <></>
  } else
    return (
      <QueryClientProvider client={queryClient}>
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
                    theme.colorScheme === 'dark'
                      ? theme.colors.dark[8]
                      : theme.colors.gray[0]
                }
              }}
              navbarOffsetBreakpoint="sm"
              asideOffsetBreakpoint="sm"
              footer={
                <Footer height={60} p="md">
                  <div className={'inline'}>
                    Brought to you by
                    <div style={{ marginLeft: '5px' }} className={styles.trick}>
                      <span>Mister_Eth</span>
                    </div>
                  </div>
                </Footer>
              }
              header={
                <HeaderWithTabs
                  links={[
                    {
                      link: '',
                      label: 'something'
                    }
                  ]}
                />
              }
            >
              {conditionalRender(
                <HumanityProofPartial
                  dataLoaded={dataLoaded}
                  element={<Component {...pageProps} />}
                />,
                !dataLoaded
              )}
              {conditionalRender(<Component {...pageProps} />, dataLoaded)}
            </AppShell>
          </MantineProvider>
        </ColorSchemeProvider>
      </QueryClientProvider>
    )
}
export default wrapper.withRedux(AppShellDemo)
