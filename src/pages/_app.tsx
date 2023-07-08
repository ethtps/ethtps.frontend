
import NonSSRWrapper from '@/ethtps.components/src/NonSSRWrapper'
import { api, apiURL } from '@/services/DependenciesIOC'
import { CacheProvider } from '@chakra-ui/next-js'
import { ChakraProvider, ColorModeScript, theme } from '@chakra-ui/react'
import { MDXProvider } from '@mdx-js/react/lib'
import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { Provider as ReduxProvider } from 'react-redux'
import { AppPropsWithLayout, RecaptchaTokenLoader, VisitType, conditionalRender, useVisitType } from '../ethtps.components'
import { wrapper } from '../ethtps.data'
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
                <MainLayout component={<Component {...pageProps} />} />
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
                </NonSSRWrapper>
              </motion.div>
            </ChakraProvider>
          </CacheProvider>
        </MDXProvider>
      </ReduxProvider >
    </>
  )
}
