import LogRocket from 'logrocket'
import Document, { Head, Html, Main, NextScript } from 'next/document'
LogRocket.init('7eb3rc/ethtps')
export default class _Document extends Document {
  render() {
    return (
      <Html>
        <Head />
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}
