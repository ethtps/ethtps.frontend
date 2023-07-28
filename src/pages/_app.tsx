
import NonSSRWrapper from '@/ethtps.components/src/NonSSRWrapper'
import { binaryConditionalRender } from '@/services'
import { api, apiURL } from '@/services/DependenciesIOC'
import { CacheProvider } from '@chakra-ui/next-js'
import { Box, ChakraProvider, ColorModeScript, theme } from '@chakra-ui/react'
import { MDXProvider } from '@mdx-js/react/lib'
import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import ReactDOM from 'react-dom'
import { Provider as ReduxProvider } from 'react-redux'
import { AppPropsWithLayout, DebugOverlay, RecaptchaTokenLoader, VisitType, conditionalRender, useVisitType } from '../ethtps.components'
import { DEBUG, wrapper } from '../ethtps.data'
import '../styles/cells.styles.scss'
import '../styles/globals.css'
import MainLayout from './components/Layout/MainLayout'
import { components } from './markdown'

export default function App({ Component, pageProps }: AppPropsWithLayout) {
  const { store } = wrapper.useWrappedStore({})
  const [opacity, setOpacity] = useState(0)
  const [isHuman, setIsHuman] = useState(false)
  const visitType = useVisitType()
  useEffect(() => {
    if (visitType === VisitType.ReturningOrNavigating) {
      setIsHuman(true) // assumption
      setOpacity(1)
    }
    console.log(`visitType: ${visitType}`)
  }, [])
  const apiKeyHandler = (key: string) => {
    api.apiKey = key
    api.resetConfig()
  }
  const humanHandler = (isHuman?: boolean) => {
    setOpacity(isHuman ? 1 : 0)
    setIsHuman(isHuman ?? false)
  }
  let hasDoc = false
  try {
    if (!!document) {
      hasDoc = true
    }
  }
  catch {
    hasDoc = false
  }
  return (
    <>
      <ReduxProvider store={store}>
        <MDXProvider components={components}>
          <CacheProvider>
            <ChakraProvider theme={theme}>
              <ColorModeScript initialColorMode={theme.config.initialColorMode} />
              {conditionalRender(<motion.div initial={{
                opacity: 0
              }}
                animate={{
                  opacity: opacity,
                }}
                transition={{
                  duration: 1
                }}>
                {binaryConditionalRender(Component.getLayout?.(<Component {...pageProps} />), <>
                  <MainLayout store={store}>
                    <Component {...pageProps} />
                  </MainLayout>
                </>, !!Component.getLayout)}
              </motion.div>, isHuman)}
              <motion.div initial={{
                opacity: 1
              }}
                animate={{
                  opacity: 1 - opacity
                }}
                transition={{
                  duration: 1
                }}>
                <NonSSRWrapper>
                  {conditionalRender(<RecaptchaTokenLoader
                    apiEndpoint={apiURL}
                    onKeyLoaded={apiKeyHandler}
                    onIsHuman={humanHandler} />, visitType === VisitType.InitialOrOld)}
                  {hasDoc && (ReactDOM.createPortal(<>
                    {conditionalRender(<Box sx={{
                    }}>
                      <DebugOverlay show />
                    </Box>, DEBUG)}
                  </>, document.getElementById('aliens')!))}
                </NonSSRWrapper>
              </motion.div>
            </ChakraProvider>
          </CacheProvider>
        </MDXProvider>
      </ReduxProvider >
    </>
  )
}
