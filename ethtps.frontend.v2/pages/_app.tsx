import 'index.css'
import Layout from '../components/Layout'
import { MantineProvider } from '@mantine/core'
import ETHTPSShell from '../components/ETHTPSShell'
import MainPage from '../pages/MainPage'
import { IWithRouter } from '../interfaces/IWithRouter'
import { withRouter } from 'next/router'

const IndexPage = (props: IWithRouter) => {
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
        <ETHTPSShell>
          <MainPage />
        </ETHTPSShell>
      </MantineProvider>
    </Layout>
  )
}

export default withRouter(IndexPage)
