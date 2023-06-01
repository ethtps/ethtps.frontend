// eslint-disable-next-line import/no-internal-modules
import { GetServerSideProps } from 'next'
import Navbar from './Navbar'
import { ProviderResponseModel } from '@/api-client'
import { getAsync } from '@/services'
import { Box, Container } from '@chakra-ui/react'


export const getStaticProps: GetServerSideProps = async (context) => {
  const providers = await getAsync<ProviderResponseModel[]>(`${process.env.REACT_APP_API_DEV_GENERAL_ENDPOINT}/api/v2/Providers?includeSidechains=true&XAPIKey=${process.env.REACT_APP_FRONTEND_API_KEY}`)
  return {
    props: {
      providerData: providers.parsedBody
    }
  }
}

export default function MainLayout(props: Partial<{
  component: JSX.Element,
  providerData: ProviderResponseModel[]
}>) {
  return (
    <>
      <Navbar allProviders={props.providerData} />
      <Container sx={{
        maxWidth: '75%',
        minW: '450px'
      }}  >
        {props.component}
      </Container>
    </>
  )
}
