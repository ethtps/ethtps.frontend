
// eslint-disable-next-line import/no-internal-modules
import { CacheProvider } from '@chakra-ui/next-js'
import { ChakraProvider, ColorModeScript, theme } from '@chakra-ui/react'
// eslint-disable-next-line import/no-internal-modules
import Document, { Head, Html, Main, NextScript } from 'next/document'
export default class _Document extends Document {

  render() {
    return (
      <Html>
        <Head />
        <body>
          <ColorModeScript initialColorMode={theme.config.initialColorMode} />
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}
