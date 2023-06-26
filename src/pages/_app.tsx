/* eslint-disable import/no-internal-modules */
import { AppPropsWithLayout, RecaptchaTokenLoader } from '@/components'
import { wrapper } from '@/data'
import { CacheProvider } from '@chakra-ui/next-js'
import { ChakraProvider } from '@chakra-ui/react'
import { MDXProvider } from '@mdx-js/react'
import { Provider as ReduxProvider } from 'react-redux'
import '../styles/Home.module.css'
import '../styles/app.module.scss'
import '../styles/cells.styles.scss'
import '../styles/globals.css'
import MainLayout from './components/Layout/MainLayout'
import { components } from './markdown'

export default function App({ Component, pageProps }: AppPropsWithLayout) {
  const { store, props } = wrapper.useWrappedStore({})
  return (
    <>
      <MDXProvider components={components}>
        <ReduxProvider store={store}>
          <CacheProvider>
            <ChakraProvider>
              <RecaptchaTokenLoader />
              <MainLayout component={<Component {...pageProps} />} />
            </ChakraProvider>
          </CacheProvider>
        </ReduxProvider>
      </MDXProvider>
    </>
  )
}
