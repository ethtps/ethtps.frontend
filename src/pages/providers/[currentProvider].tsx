/* eslint-disable import/no-internal-modules */
//import { api } from '@/services'

import { ProviderResponseModel } from "@/api-client"
import { ProviderListSidebar, ProviderOverview, SidebarWithHeader, SocialButtons, StatusIndicator } from "@/components"
import { groupBy, loadProvidersAsync } from "@/data"
import { conditionalRender, queryClient } from "@/services"
import { Text, Container, Image, Box, Stack, HStack, Flex, Spacer, Button, Link, VStack, Wrap, Drawer, DrawerBody, DrawerContent, DrawerHeader, DrawerOverlay, Heading, List, ListItem, useDisclosure, useTheme, useDimensions, WrapItem } from "@chakra-ui/react"
import { InferGetStaticPropsType } from "next"
import { ReactElement, useEffect, useRef, useState } from "react"
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
  return <>
    <Flex
      alignItems={'flex-start'}
      flexDirection={'row'}
      flexGrow={'initial'}
      flexWrap={'wrap'} >
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

