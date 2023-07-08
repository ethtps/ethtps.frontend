import { AdminAPI } from '@/services'
import { CacheProvider } from '@chakra-ui/next-js'
import { ChakraProvider, ColorModeScript, theme } from '@chakra-ui/react'
import { MDXProvider } from '@mdx-js/react/lib'
import { createContext } from 'react'
import { Provider as ReduxProvider } from 'react-redux'
import { AppPropsWithLayout, RecaptchaTokenLoader, useQueryStringAndLocalStorageBoundState } from '../ethtps.components'
import { createHandlerFromCallback, wrapper } from '../ethtps.data'
import '../styles/cells.styles.scss'
import '../styles/globals.css'
import MainLayout from './components/Layout/MainLayout'
import { components } from './markdown'

export default function App({ Component, pageProps }: AppPropsWithLayout) {
  const { store } = wrapper.useWrappedStore({})
  const [key, setKey] = useQueryStringAndLocalStorageBoundState<string | undefined>(undefined, 'apiKey')
  const keyHandler = createHandlerFromCallback((key?: string) => {
    setKey(key)
  })
  const humanHandler /* */ = createHandlerFromCallback((isHuman?: boolean) => {
    setKey(key)
  })
  //  <MainLayout component={<Component {...pageProps} />} />
  return (
    <>
      <ReduxProvider store={store}>
        <MDXProvider components={components}>
          <CacheProvider>
            <ChakraProvider theme={theme}>
              <ColorModeScript initialColorMode={theme.config.initialColorMode} />
              <RecaptchaTokenLoader onKeyLoaded={keyHandler} onIsHuman={humanHandler} />
              {key === undefined ? <>
                Get key
              </> : <MainLayout component={<Component {...pageProps} />} />}
            </ChakraProvider>
          </CacheProvider>
        </MDXProvider>
      </ReduxProvider>
    </>
  )
}
