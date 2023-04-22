/* eslint-disable import/no-internal-modules */
//import { api } from '@/services'

import { ProviderResponseModel } from "@/api-client"
import { ProviderListSidebar, ProviderOverview, SocialButtons } from "@/components"
import { loadProvidersAsync } from "@/data"
import { conditionalRender, queryClient } from "@/services"
import { Text, Group, Container, Image, Box, Paper } from "@mantine/core"
import { InferGetStaticPropsType } from "next"

interface IProviderPageParams {
  currentProvider?: string,
  allProviders?: ProviderResponseModel[]
}

export async function getStaticPaths() {
  console.log('Calling GET slugs')
  return {
    paths: [{ params: { currentProvider: 'Ethereum' } }, { params: { currentProvider: 'Arbitrum One' } }],
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

  return <>
    <Container style={{ width: "90%", minWidth: '600px' }}>
      {conditionalRender(<ProviderListSidebar currentProvider={currentProvider} allProviders={allProviders} />, allProviders !== undefined && allProviders?.length > 0)}
      <Container>
        <Paper sx={{
          borderRadius: "20px",
          width: "100%",
          minHeight: "90vh",
        }}>
          <ProviderOverview provider={allProviders?.find(x => x.name === currentProvider as string)} />
        </Paper>
      </Container>
    </Container >
  </>
}
