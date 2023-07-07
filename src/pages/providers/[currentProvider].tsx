/* eslint-disable import/no-internal-modules */

import { Box, Flex, Spacer, useBreakpointValue } from '@chakra-ui/react'
import { useSize } from '@chakra-ui/react-use-size'
import {
  ETHTPSDataCoreModelsResponseModelsProviderResponseModel,
  ETHTPSDataCoreTimeInterval,
  ETHTPSDataIntegrationsMSSQLProviderLink
} from 'ethtps.api/dist/models'
import { GetServerSideProps } from 'next'
import { useRef } from 'react'
import {
  ProviderListSidebar,
  ProviderOverview,
  SidebarVariant
} from '../../ethtps.components'
import { api } from '../../services'

interface IProviderPageParams {
  currentProvider?: string
  allProviders?: ETHTPSDataCoreModelsResponseModelsProviderResponseModel[]
  providerLinks?: ETHTPSDataIntegrationsMSSQLProviderLink[]
}

type Path = {
  params: {
    currentProvider: string
  }
}

/*
export async function getStaticPaths() {
  const providers = await getAsync<ETHTPSDataCoreModelsResponseModelsProviderResponseModel[]>(`${process.env.REACT_APP_API_DEV_GENERAL_ENDPOINT}/api/v2/Providers?includeSidechains=true&XAPIKey=${process.env.REACT_APP_FRONTEND_API_KEY}`)
  const paths = providers.parsedBody?.filter(x => x && x.name)?.map(generatePath)
  return {
    paths: paths,
    fallback: true, // can also be true or 'blocking'
  }
}*/
export const getServerSideProps: GetServerSideProps = async (context) => {
  const providers = await api.getProvidersAsync()
  const currentProvider = context.params?.currentProvider as string
  const defaultInterval = ETHTPSDataCoreTimeInterval.ONE_MINUTE
  const providerLinks = await api.getProviderLinks(currentProvider)
  return {
    props: {
      currentProvider: currentProvider,
      allProviders: providers,
      providerLinks: providerLinks
    } as IProviderPageParams
  }
}

export default function ProviderPage({
  currentProvider,
  allProviders,
  providerLinks
}: IProviderPageParams) {
  const containerRef = useRef<any>(null)
  const containerSize = useSize(containerRef)
  const variants = useBreakpointValue({
    base: {
      navigation: SidebarVariant.DRAWER,
      navigationButton: true
    },
    xl: {
      navigation: SidebarVariant.SIDEBAR,
      navigationButton: false
    }
  })

  return (
    <>
      <Box>
        <Flex
          ref={containerRef}
          alignItems={'flex-start'}
          flexDirection={'row'}
          flexGrow={'initial'}
          flexWrap={'wrap'}
          maxW={1000}>
          <Box>
            <ProviderListSidebar
              variant={variants?.navigation ?? SidebarVariant.DRAWER}
              currentProvider={currentProvider}
              allProviders={allProviders}
            />
          </Box>
          <Box
            width={containerSize?.width}
            sx={{
              marginLeft:
                variants?.navigation === SidebarVariant.SIDEBAR
                  ? '350px'
                  : '0px',
              marginRight:
                variants?.navigation === SidebarVariant.SIDEBAR ? '50px' : '0px'
            }}
            overflow={'scroll'}>
            <ProviderOverview
              api={api}
              providerLinks={providerLinks}
              width={containerSize?.width}
              provider={allProviders?.find(
                (x) => x.name === (currentProvider as string)
              )}
            />
          </Box>
          <Spacer />
        </Flex>
      </Box>
    </>
  )
}
