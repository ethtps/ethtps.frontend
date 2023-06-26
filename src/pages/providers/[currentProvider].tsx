/* eslint-disable import/no-internal-modules */
//import { api } from '@/services'

import { ProviderLink, ProviderResponseModel, TimeInterval } from "@/api-client"
import { ProviderListSidebar, ProviderOverview, SidebarVariant } from "@/components"
import { api, getAsync } from "@/services"
import { Box, Flex, Spacer, useBreakpointValue } from "@chakra-ui/react"
import { useSize } from "@chakra-ui/react-use-size"
import { GetServerSideProps } from "next"
import { useRef } from "react"

interface IProviderPageParams {
  currentProvider?: string,
  allProviders?: ProviderResponseModel[]
  providerLinks?: ProviderLink[]
}

type Path = {
  params: {
    currentProvider: string
  }
}


/*
export async function getStaticPaths() {
  const providers = await getAsync<ProviderResponseModel[]>(`${process.env.REACT_APP_API_DEV_GENERAL_ENDPOINT}/api/v2/Providers?includeSidechains=true&XAPIKey=${process.env.REACT_APP_FRONTEND_API_KEY}`)
  const paths = providers.parsedBody?.filter(x => x && x.name)?.map(generatePath)
  return {
    paths: paths,
    fallback: true, // can also be true or 'blocking'
  }
}*/
export const getServerSideProps: GetServerSideProps = async (context) => {
  const providers = await getAsync<ProviderResponseModel[]>(`${process.env.REACT_APP_API_DEV_GENERAL_ENDPOINT}/api/v2/Providers?includeSidechains=true&XAPIKey=${process.env.REACT_APP_FRONTEND_API_KEY}`)
  const currentProvider = context.params?.currentProvider as string
  const defaultInterval = TimeInterval.OneMinute
  const providerLinks = await api.getProviderLinks(currentProvider)
  return {
    props: {
      currentProvider: currentProvider,
      allProviders: providers.parsedBody,
      providerLinks: providerLinks,
    } as IProviderPageParams
  }
}

export default function ProviderPage({ currentProvider, allProviders, providerLinks }: IProviderPageParams) {
  const containerRef = useRef<any>(null)
  const containerSize = useSize(containerRef)
  const variants = useBreakpointValue(
    {
      base: {
        navigation: SidebarVariant.DRAWER,
        navigationButton: true
      },
      xl: {
        navigation: SidebarVariant.SIDEBAR,
        navigationButton: false
      }
    })
  return <>
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
            allProviders={allProviders} />
        </Box>
        <Box
          width={containerSize?.width}
          sx={{
            marginLeft: variants?.navigation === SidebarVariant.SIDEBAR ? '350px' : '0px',
            marginRight: variants?.navigation === SidebarVariant.SIDEBAR ? '50px' : '0px'
          }} overflow={'scroll'}>
          <ProviderOverview
            providerLinks={providerLinks}
            width={containerSize?.width}
            provider={allProviders?.find(x => x.name === currentProvider as string)} />
        </Box>
        <Spacer />
      </Flex>
    </Box>
  </>
}

