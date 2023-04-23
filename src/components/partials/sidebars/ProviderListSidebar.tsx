import { ProviderResponseModel } from "@/api-client"
import { api, binaryConditionalRender, conditionalRender, queryClient } from "@/services"
import { Navbar, ScrollArea, ThemeIcon, Text, Group, Badge, Box, Image, Checkbox, Notification, Loader, Skeleton, Tooltip, Button, NavLink } from "@mantine/core"
import { useViewportSize } from "@mantine/hooks"
import { IconDatabase, IconGauge, IconX } from "@tabler/icons-react"
// eslint-disable-next-line import/no-internal-modules
import Link from "next/link"
import { useEffect, useState, useCallback } from "react"

const sidebarWidth = 200

interface IProviderListSidebarProps {
    currentProvider?: string,
    allProviders?: ProviderResponseModel[]
}

export default function ProviderListSidebar({ currentProvider, allProviders }: IProviderListSidebarProps) {

    const [filteredProviders, setFilteredProviders] = useState(allProviders)
    const hideSidechainsChanged = (e: any) => {
        if (e.target.checked) {
            setFilteredProviders(allProviders?.filter(x => x.type !== 'Sidechain'))
        } else {
            setFilteredProviders(allProviders)
        }
    }
    return <>
        <Box>
            <Navbar p="xs" width={{ base: sidebarWidth }}>
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
                                Rollups
                            </Badge>
                        </center>
                    </>
                </Navbar.Section>
                <Navbar.Section grow component={ScrollArea} mx="-xs" px="xs">
                    <Group dir="row">
                        {filteredProviders?.map((x, i) =>
                            <div key={x.name}
                                style={{
                                    backgroundColor: currentProvider === x.name ? "#f8f8f8" : undefined,
                                    fontWeight: currentProvider === x.name ? "bold" : undefined,
                                }}>
                                <NavLink
                                    active={currentProvider === x.name}
                                    sx={{ width: sidebarWidth }}
                                    component={Link}
                                    href={`/providers/${x.name}`}
                                    label={x.name}
                                    icon={<Image
                                        alt={`${x.name} icon`}
                                        src={`/provider-icons/${x.name}.png`}
                                        width={'20px'}
                                        height={'20px'}
                                    />}
                                ></NavLink>
                            </div>
                        )}
                        {conditionalRender(<>
                            <Skeleton height={8} radius="xl" style={{ marginBottom: '1rem' }} />
                            <Skeleton height={8} radius="xl" style={{ marginBottom: '1rem' }} />
                            <Skeleton height={8} radius="xl" style={{ marginBottom: '1rem' }} />
                        </>, !filteredProviders || filteredProviders?.length === 0)}
                    </Group>
                </Navbar.Section>
                <Navbar.Section>
                    <Checkbox onChange={hideSidechainsChanged} size="sm" className={'unselectable'} label={'Hide sidechains'} />
                </Navbar.Section>
            </Navbar>
        </Box >
    </>
}