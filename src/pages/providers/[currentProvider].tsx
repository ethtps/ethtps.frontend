//import { api } from '@/services'

import { ProviderResponseModel } from "@/api-client"
import { loadProvidersAsync } from "@/data"
import { queryClient } from "@/services"
import { AppShell, Navbar, Header, ScrollArea, Text, Button, Group, ThemeIcon } from "@mantine/core"
import { IconDatabase } from "@tabler/icons-react"
import { range } from "d3-array"
import { color, motion } from "framer-motion"
import { InferGetStaticPropsType } from "next"
import Link from "next/link"

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

const sidebarWidth = 200

export default function ProviderPage({ currentProvider, allProviders }: InferGetStaticPropsType<typeof getStaticProps>) {
  return <>
    <Navbar p="xs" width={{ base: sidebarWidth }}>
      <Navbar.Section mt="xs">{/* Header with logo */}</Navbar.Section>

      <Navbar.Section grow component={ScrollArea} mx="-xs" px="xs">
        <Group dir="row">
          {allProviders?.map((x, i) => <>
            <div style={{
              backgroundColor: currentProvider === x.name ? "#f8f8f8" : undefined,
            }}
              className="grayOnHover">
              <Group dir="col" sx={{
                width: sidebarWidth
              }} >
                <Link href={`/providers/${x.name}`}>
                  <Group>
                    <ThemeIcon variant="light">
                      <IconDatabase size="1rem" />
                    </ThemeIcon>
                    <Text size="sm" style={{ overflow: "hidden" }}>{x.name}</Text>
                  </Group>
                </Link>
              </Group>
            </div>
          </>
          )}
        </Group>
      </Navbar.Section>

      <Navbar.Section>{/* Footer with user */}</Navbar.Section>
    </Navbar >
  </>
}
