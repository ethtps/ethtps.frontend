/* eslint-disable import/no-internal-modules */
/*
import '../styles/app.module.scss'
import '../styles/cells.styles.scss'
import '../styles/Home.module.css'
import '../styles/globals.css'
*/
import { ReactElement, ReactNode, useEffect, useState } from 'react'
import {
  AppShell,
  Footer,
  useMantineTheme,
  ColorScheme,
  ColorSchemeProvider,
  MantineProvider,
  Group,
  Text
} from '@mantine/core'
import { useWindowScroll, useHotkeys, useLocalStorage } from '@mantine/hooks'
import { HeaderWithTabs } from '@/components'
import HumanityProofPartial from '@/components/partials/humanity-proof/HumanityProofPartial'
import { setApplicationDataLoaded, useAppSelector, wrapper } from '@/data'
import {
  getAPIKey,
  setAPIKey,
  queryClient,
  binaryConditionalRender
} from '@/services'
import {
  IconBrandGithub,
  IconBrandTwitter,
  IconBrandDiscord
} from '@tabler/icons-react'
import { NextPage } from 'next'
import { AppProps } from 'next/app'
import Link from 'next/link'
import { QueryClientProvider } from 'react-query'
import { useDispatch } from 'react-redux'
import { ErrorBoundary } from './components/ErrorBoundary'
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
  const dataLoaded = useAppSelector(
    (x) => x.applicationState.applicationDataLoaded
  )
  const completeApplicationDataAvailableInLocalStorage = useAppSelector(
    (x) => x.applicationState.completeApplicationDataAvailableInLocalStorage
  )
  const [showChild, setShowChild] = useState(false)
  useEffect(() => {
    setShowChild(true)
  }, [])
  if (!showChild) {
    return null
  }

  return (
    <QueryClientProvider client={queryClient}>
      <ColorSchemeProvider
        colorScheme={colorScheme}
        toggleColorScheme={toggleColorScheme}>
        <MantineProvider
          theme={{ colorScheme }}
          withGlobalStyles
          withNormalizeCSS>
          <AppShell
            styles={{
              main: {
                background:
                  theme.colorScheme === 'dark'
                    ? theme.colors.dark[8]
                    : theme.colors.gray[0]
              }
            }}
            navbarOffsetBreakpoint='sm'
            asideOffsetBreakpoint='sm'
            footer={
              <Footer height={50} p='sm'>
                <Group sx={{ marginTop: 0 }} position='apart'>
                  <div>
                    <Text className={'inline'} size={'sm'}>
                      Brought to you by
                    </Text>
                    <Text className={'inline'} size={'sm'}>
                      <div style={{ marginLeft: '5px' }} className={'trick'}>
                        <span className='animated-cell'>Mister_Eth</span>
                      </div>
                    </Text>
                  </div>
                  <div style={{ float: 'right' }}>
                    <Group>
                      <Link href={'/about'}>
                        <Text size={'sm'}>About</Text>
                      </Link>{' '}
                      <Link href={'/privacy-policy'}>
                        <Text size={'sm'}>Privacy policy</Text>
                      </Link>{' '}
                      <Link href={'https://ethtps.info?ref=v2_alpha'}>
                        <Text size={'sm'}>Old version</Text>
                      </Link>
                    </Group>
                  </div>
                </Group>
              </Footer>
            }
            header={
              <HeaderWithTabs
                links={[
                  {
                    link: 'https://github.com/orgs/ethtps/repositories',
                    label: 'GitHub',
                    icon: <IconBrandGithub size={'1.2rem'} />
                  },
                  {
                    link: 'https://twitter.com/ethtps',
                    label: 'Follow us on Twitter',
                    icon: <IconBrandTwitter size={'1.2rem'} />
                  },
                  {
                    link: 'https://discord.gg/jWPcsTzpCT',
                    label: 'Join our Discord channel',
                    icon: <IconBrandDiscord size={'1.2rem'} />
                  }
                ]}
              />
            }>
            <ErrorBoundary fallback>
              {binaryConditionalRender(
                <HumanityProofPartial dataLoaded={dataLoaded} />,
                <Component {...pageProps} />,
                !completeApplicationDataAvailableInLocalStorage
              )}
            </ErrorBoundary>
          </AppShell>
        </MantineProvider>
      </ColorSchemeProvider>
    </QueryClientProvider>
  )
}
export default wrapper.withRedux(AppShellDemo)

export const config = {
  runtime: 'experimental-edge'
}
