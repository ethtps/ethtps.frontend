/* eslint-disable import/no-internal-modules */

import { CacheProvider } from "@chakra-ui/next-js"
import { ChakraProvider } from "@chakra-ui/react"
import { MDXProvider } from "@mdx-js/react/lib"
import { Provider as ReduxProvider } from "react-redux"
import { AppPropsWithLayout, RecaptchaTokenLoader } from "../ethtps.components"
import { wrapper } from "../ethtps.data/src"
import MainLayout from "./components/Layout/MainLayout"
import { components } from "./markdown"



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
