/* eslint-disable import/no-internal-modules */
//import { api } from '@/services'

import { ProviderResponseModel } from "@/api-client"
import { ProviderListSidebar, ProviderOverview, SidebarWithHeader, SocialButtons, StatusIndicator, useAutoHideSidebar } from "@/components"
import { groupBy, loadProvidersAsync } from "@/data"
import { conditionalRender, queryClient } from "@/services"
import { Text, Container, Image, Box, Stack, HStack, Flex, Spacer, Button, Link, VStack, Wrap, Drawer, DrawerBody, DrawerContent, DrawerHeader, DrawerOverlay, Heading, List, ListItem, useDisclosure, useTheme } from "@chakra-ui/react"
import { InferGetStaticPropsType } from "next"
import { ReactElement, useState } from "react"
import { useRouter } from "next/router"

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
  const grouped = groupBy(allProviders, x => x?.type ?? "none")
  const [buttons, setButtons] = useState<ReactElement[]>()

  return <>
    <Wrap alignItems={'flex-start'} flexDirection={'row'} flexGrow={'initial'} flexWrap={'wrap'} >
      <Box flex={1}>
        <ProviderListSidebar allProviders={allProviders} />
      </Box>
      <Box flex={2}>
        <ProviderOverview provider={allProviders?.find(x => x.name === currentProvider as string)} />
      </Box>
      <Spacer />
    </Wrap>
  </>
}

