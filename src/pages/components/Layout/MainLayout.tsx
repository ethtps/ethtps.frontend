import 'react-data-grid/lib/styles.css'
import { Box, Divider, Flex } from '@chakra-ui/react'
import { ETHTPSDataCoreModelsResponseModelsProviderResponseModel } from 'ethtps.api/dist/models'
import { GetServerSideProps } from 'next'
import React from 'react'
import { AppStore } from '../../../ethtps.data'
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

export default function MainLayout(
  props: Partial<{
    children?: React.ReactNode
    store: AppStore
    providerData: ETHTPSDataCoreModelsResponseModelsProviderResponseModel[]
  }>

) {
  return (
    <>
      <Navbar store={props.store} allProviders={props.providerData} />
      <Divider />
      <Flex
        direction={'column'}
        flex={{ base: '0', md: '1' }}
        display={{ base: 'flex', md: 'flex' }}
        justifyContent={{ md: 'center' }}
        px={{ base: 0, md: 2 }}
        w={'100%'}>
        <Box
          alignSelf={{ md: 'center' }}
          w={{ base: '100%', md: '80%' }}
          maxW={950}
          sx={{
            paddingTop: '1rem',
            paddingBottom: '1rem'
          }}>
          <Box>{props.children}</Box>
        </Box>
      </Flex>
    </>
  )
}
