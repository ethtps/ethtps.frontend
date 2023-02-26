import 'index.css'
import Link from 'next/link'
import Layout from '../components/Layout'
import { TestPage } from 'ethtps.pages'
import { store } from 'ethtps.data'
import { MantineProvider, ThemeIcon } from '@mantine/core'
import ETHTPSShell from '../components/ETHTPSShell'
import { CustomTheme } from '../theming/CustomTheme'

const IndexPage = () => {
  return (
    <Layout title="ethtps.info">
      <MantineProvider
        withGlobalStyles
        withNormalizeCSS
        theme={{
          colorScheme: 'light',
          primaryColor: 'violet'
        }}
      >
        <ETHTPSShell />
      </MantineProvider>
    </Layout>
  )
}

export default IndexPage
