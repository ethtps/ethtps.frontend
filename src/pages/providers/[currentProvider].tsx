/* eslint-disable import/no-internal-modules */
//import { api } from '@/services'

import { ProviderResponseModel } from "@/api-client"
import { ProviderListSidebar, ProviderOverview, SidebarVariant } from "@/components"
import { generatePath } from "@/data"
import { conditionalRender, getAsync, queryClient } from "@/services"
import { Container, Box, Flex, Spacer, useBreakpointValue } from "@chakra-ui/react"
import { GetServerSideProps, InferGetStaticPropsType } from "next"
import { useRef } from "react"
import { useDimensions } from "@chakra-ui/react"

interface IProviderPageParams {
  currentProvider?: string,
  allProviders?: ProviderResponseModel[]
}

type Path = {
  params: {
    currentProvider: string
  }
}



export async function getStaticPaths() {
  const providers = await getAsync<ProviderResponseModel[]>(`${process.env.REACT_APP_API_DEV_GENERAL_ENDPOINT}/api/v2/Providers?includeSidechains=true&XAPIKey=${process.env.REACT_APP_FRONTEND_API_KEY}`)
  const paths = providers.parsedBody?.filter(x => x && x.name)?.map(generatePath)
  return {
    paths: paths,
    fallback: true, // can also be true or 'blocking'
  }
}
export const getStaticProps: GetServerSideProps = async (context) => {
  const providers = await getAsync<ProviderResponseModel[]>(`${process.env.REACT_APP_API_DEV_GENERAL_ENDPOINT}/api/v2/Providers?includeSidechains=true&XAPIKey=${process.env.REACT_APP_FRONTEND_API_KEY}`)
  return {
    props: {
      currentProvider: context.params?.currentProvider as string,
      allProviders: providers.parsedBody
    } as IProviderPageParams
  }
}

export default function ProviderPage({ currentProvider, allProviders }: IProviderPageParams) {
  const containerRef = useRef<any>(null)
  const containerSize = useDimensions(containerRef)
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
        flexWrap={'wrap'}>
        <Box>
          <ProviderListSidebar
            variant={variants?.navigation ?? SidebarVariant.DRAWER}
            currentProvider={currentProvider}
            allProviders={allProviders} />
        </Box>
        <Box sx={{
          marginLeft: variants?.navigation === SidebarVariant.SIDEBAR ? '350px' : '0px',
          marginRight: variants?.navigation === SidebarVariant.SIDEBAR ? '50px' : '0px'
        }} overflow={'scroll'}>
          <ProviderOverview
            width={containerRef?.current?.offsetWidth}
            provider={allProviders?.find(x => x.name === currentProvider as string)} />
        </Box>
        <Spacer />
      </Flex>
    </Box>
  </>
}

