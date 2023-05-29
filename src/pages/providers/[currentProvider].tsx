/* eslint-disable import/no-internal-modules */
//import { api } from '@/services'

import { ProviderResponseModel } from "@/api-client"
import { ProviderListSidebar, ProviderOverview } from "@/components"
import { generatePath } from "@/data"
import { getAsync, queryClient } from "@/services"
import { getProviders } from "@/services/DataLoader"
import { Container, Box, Flex, Spacer } from "@chakra-ui/react"
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
  return <>
    <Flex
      alignItems={'flex-start'}
      flexDirection={'row'}
      flexGrow={'initial'}
      flexWrap={'wrap'}>
      <Box>
        <ProviderListSidebar currentProvider={currentProvider} allProviders={allProviders} />
      </Box>
      <Spacer />
      <Container>
        <ProviderOverview provider={allProviders?.find(x => x.name === currentProvider as string)} />
      </Container>
      <Spacer />
    </Flex>
  </>
}

