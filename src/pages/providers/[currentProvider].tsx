/* eslint-disable import/no-internal-modules */
//import { api } from '@/services'

import { ProviderResponseModel } from "@/api-client"
import { ProviderListSidebar, ProviderOverview, SidebarVariant } from "@/components"
import { generatePath } from "@/data"
import { conditionalRender, getAsync, queryClient } from "@/services"
import { Container, Box, Flex, Spacer, useBreakpointValue } from "@chakra-ui/react"
import { GetServerSideProps, InferGetStaticPropsType } from "next"

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
const hiddenSize = 750

export default function ProviderPage({ currentProvider, allProviders }: IProviderPageParams) {
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
    <Flex
      alignItems={'flex-start'}
      flexDirection={'row'}
      flexGrow={'initial'}
      flexWrap={'wrap'}>
      <Box w={variants?.navigation === SidebarVariant.SIDEBAR ? 'xl' : '100%'}>
        <ProviderListSidebar variant={variants?.navigation ?? SidebarVariant.DRAWER} currentProvider={currentProvider} allProviders={allProviders} />
      </Box>
      <Box sx={{
        marginLeft: variants?.navigation === SidebarVariant.SIDEBAR ? '350px' : '0px',
        marginRight: variants?.navigation === SidebarVariant.SIDEBAR ? '50px' : '0px'
      }} w={'container.xl'} overflow={'scroll'}>
        <ProviderOverview provider={allProviders?.find(x => x.name === currentProvider as string)} />
      </Box>
      <Spacer />
    </Flex>
  </>
}

