// eslint-disable-next-line import/no-internal-modules
import { ProviderResponseModel } from '@/api-client'
import { getAsync } from '@/services'
import { Box, Divider, Flex } from '@chakra-ui/react'
import { GetServerSideProps } from 'next'
import Navbar from './Navbar'


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
      <Divider />
      <Flex direction={'column'}
        flex={{ base: '0', 'md': '1' }}
        display={{ base: 'flex', 'md': 'flex' }}
        justifyContent={{ md: 'center' }}
        px={{ base: 0, md: 2 }}
        w={'100%'}>
        <Box
          alignSelf={{ md: 'center' }}
          w={{ base: '100%', 'md': '80%' }}
          maxW={950}
          sx={{
            paddingTop: '1rem',
            paddingBottom: '1rem'
          }}>
          <Box>
            {props.component}
          </Box>
        </Box >
      </Flex >
    </>
  )
}
