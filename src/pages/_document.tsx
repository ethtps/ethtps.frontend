import Document, { Head, Html, Main, NextScript } from 'next/document'
import { StrictMode } from 'react'
export default class _Document extends Document {
  render() {
    return (
      <Html>
        <Head />
        <body>
          <StrictMode>
            <Main />
            <div id="aliens" />
          </StrictMode>
          <NextScript />
        </body>
      </Html>
    )
  }
}
