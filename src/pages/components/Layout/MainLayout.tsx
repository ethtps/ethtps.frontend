// eslint-disable-next-line import/no-internal-modules
import { Box, Divider, Flex } from '@chakra-ui/react'
import { ETHTPSDataCoreModelsResponseModelsProviderResponseModel } from 'ethtps.api/dist/models'
import { GetServerSideProps } from 'next'
import { api } from '../../../services/'
import Navbar from './Navbar'

export const getStaticProps: GetServerSideProps = async (context) => {
  const providers = await api.getProvidersAsync()
  return {
    props: {
      providerData: providers
    }
  }
}

export default function MainLayout(props: Partial<{
  component: JSX.Element,
  providerData: ETHTPSDataCoreModelsResponseModelsProviderResponseModel[]
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
