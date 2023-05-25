/* eslint-disable import/no-internal-modules */
//import { api } from '@/services'

import { ProviderResponseModel } from "@/api-client"
import { ProviderOverview, SocialButtons, useAutoHideSidebar } from "@/components"
import { loadProvidersAsync } from "@/data"
import { conditionalRender, queryClient } from "@/services"
import { Text, Container, Image, Box, Stack } from "@chakra-ui/react"
import { InferGetStaticPropsType } from "next"

interface IProviderPageParams {
  currentProvider?: string,
  allProviders?: ProviderResponseModel[]
}

type Path = {
  params: {
    currentProvider: string
  }
}

const generatePath = (provider?: ProviderResponseModel): Path => { return { params: { currentProvider: provider?.name ?? "" } } }

export async function getStaticPaths() {
  const providers = await loadProvidersAsync(queryClient)
  const paths = providers?.filter(x => x && x.name)?.map(generatePath)
  return {
    paths: paths,
    fallback: true, // can also be true or 'blocking'
  }
}

export async function getStaticProps(context: any) {
  return {
    props: {
      currentProvider: context.params.currentProvider as string,
      allProviders: await loadProvidersAsync(queryClient)
    } as IProviderPageParams
  }
}

const hiddenSize = 750

export default function ProviderPage({ currentProvider, allProviders }: InferGetStaticPropsType<typeof getStaticProps>) {
  const hideSidebar = useAutoHideSidebar()
  return <>
    <Container
      size={'xl'}
      style={{
        ...(hideSidebar ? {
          paddingLeft: 0,
          paddingRight: 0,
        } : {})
      }}>
      <Container>
        <Stack sx={{
          borderRadius: "20px",
          width: "100%",
          minHeight: "90vh",
        }}>
          <ProviderOverview provider={allProviders?.find(x => x.name === currentProvider as string)} />
        </Stack>
      </Container>
    </Container >
  </>
}
