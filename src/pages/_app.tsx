import { CacheProvider } from '@chakra-ui/next-js'
import { ChakraProvider, ColorModeScript, theme } from '@chakra-ui/react'
import { MDXProvider } from '@mdx-js/react/lib'
import { Provider as ReduxProvider } from 'react-redux'
import { AppPropsWithLayout } from '../ethtps.components'
import { wrapper } from '../ethtps.data'
import '../styles/cells.styles.scss'
import '../styles/globals.css'
import MainLayout from './components/Layout/MainLayout'
import { components } from './markdown'

export default function App({ Component, pageProps }: AppPropsWithLayout) {
  const { store, props } = wrapper.useWrappedStore({})
  return (
    <>
      <ReduxProvider store={store}>
        <MDXProvider components={components}>
          <CacheProvider>
            <ChakraProvider theme={theme}>
              <ColorModeScript
                initialColorMode={theme.config.initialColorMode}
              />
              <MainLayout component={<Component {...pageProps} />} />
            </ChakraProvider>
          </CacheProvider>
        </MDXProvider>
      </ReduxProvider>
    </>
  )
}
