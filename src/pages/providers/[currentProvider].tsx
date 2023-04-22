//import { api } from '@/services'

import { ProviderResponseModel } from "@/api-client"
import { useSizeRef } from "@/components"
import { SocialButtons } from "@/components"
import { loadProvidersAsync } from "@/data"
import { conditionalRender, queryClient } from "@/services"
import { AppShell, Navbar, Header, ScrollArea, Text, Button, Group, ThemeIcon, Container, Image, Box, Paper } from "@mantine/core"
import { IconDatabase } from "@tabler/icons-react"
import { range } from "d3-array"
import { color, motion } from "framer-motion"
import { InferGetStaticPropsType } from "next"
// eslint-disable-next-line import/no-internal-modules
import Link from "next/link"
import { useEffect, useState } from "react"

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
const iconSize = 50
const hiddenSize = 750

export default function ProviderPage({ currentProvider, allProviders }: InferGetStaticPropsType<typeof getStaticProps>) {
  const [hideSidebar, setHideSidebar] = useState(false)
  return <>
    <Container style={{ width: "90%" }}>
      {conditionalRender(<Navbar p="xs" width={{ base: sidebarWidth }}>
        <Navbar.Section mt="xs">{/* Header with logo */}</Navbar.Section>

        <Navbar.Section hidden={hideSidebar} grow component={ScrollArea} mx="-xs" px="xs">
          <Group dir="row">
            {allProviders?.map((x, i) =>
              <div key={x.name}
                style={{
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
            )}
          </Group>
        </Navbar.Section>
      </Navbar >, !hideSidebar)}
      <Container>
        <Paper sx={{
          borderRadius: "20px",
          width: "100%",
          minHeight: "90vh",
        }}>
          <Group
            dir="col"
            position="apart"
            align={'self-end'}
            grow
            sx={{
              padding: "1rem",
            }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: "1rem" }}>
              <Image
                alt={`${currentProvider} icon`}
                src={`/provider-icons/${currentProvider}.png`}
                width={iconSize}
                height={iconSize}
              />
              <Box>
                <Text
                  variant="heading"
                  sx={{
                    fontSize: "3xl",
                    fontWeight: "bold",
                    textTransform: "uppercase",
                    letterSpacing: "wider",
                    cursor: "default",
                  }}
                >
                  {currentProvider}
                </Text>
                <Text
                  variant="subheading"
                  color="gray"
                  sx={{
                    fontSize: "md",
                    fontWeight: "bold",
                    cursor: "default",
                  }}
                >
                  0 TPS
                </Text>
              </Box>
            </Box>
            <Box sx={{
              display: "flex",
              justifyContent: "flex-end",
            }}>
              <SocialButtons />
            </Box>
          </Group>
        </Paper>
      </Container>
    </Container >
  </>
}
