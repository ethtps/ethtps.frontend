/* eslint-disable import/no-internal-modules */
import '../styles/app.module.scss'
import '../styles/cells.styles.scss'
import '../styles/Home.module.css'
import '../styles/globals.css'
import { AppPropsWithLayout } from '@/components'
import MainLayout from './components/Layout/MainLayout'
import { ChakraProvider } from '@chakra-ui/react'
import { CacheProvider } from '@chakra-ui/next-js'
import { Provider as ReduxProvider } from 'react-redux'
import { wrapper } from '@/data'

export default function App({ Component, pageProps }: AppPropsWithLayout) {
  const { store, props } = wrapper.useWrappedStore({})
  return (
    <>
      <ReduxProvider store={store}>
        <CacheProvider>
          <ChakraProvider>
            <MainLayout component={<Component {...pageProps} />} />
          </ChakraProvider>
        </CacheProvider>
      </ReduxProvider>
    </>
  )
}
