import { ProviderResponseModel } from "@/api-client"
import { conditionalRender } from "@/services"
import { Navbar, ScrollArea, ThemeIcon, Text, Group, Badge, Box, Image } from "@mantine/core"
import { IconDatabase } from "@tabler/icons-react"
// eslint-disable-next-line import/no-internal-modules
import Link from "next/link"
import { useState } from "react"

const sidebarWidth = 200

interface IProviderListSidebarProps {
    currentProvider?: string,
    allProviders?: ProviderResponseModel[]
}

export default function ProviderListSidebar({ currentProvider, allProviders }: IProviderListSidebarProps) {
    const [hideSidebar, setHideSidebar] = useState(false)
    return <>
        {conditionalRender(<Navbar p="xs" width={{ base: sidebarWidth }}>
            <Navbar.Section mt="xs">
                <>
                    <center>
                        <Badge sx={{
                            fontSize: 16,
                            marginBottom: '2rem',
                            fontWeight: 'bold',
                            cursor: 'default'
                        }}
                            color={'violet'}>
                            Providers
                        </Badge>
                    </center>
                </>
            </Navbar.Section>
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
                                            <Image
                                                alt={`${x.name} icon`}
                                                src={`/provider-icons/${x.name}.png`}
                                                width={'20px'}
                                                height={'20px'}
                                            />
                                        </ThemeIcon>
                                        <Text size="sm" style={{ overflow: "hidden" }}>{x.name}</Text>
                                    </Group>
                                </Link>
                            </Group>
                        </div>
                    )}
                </Group>
            </Navbar.Section>
        </Navbar >, !hideSidebar)
        }
    </>
}