import { ProviderResponseModel } from "@/api-client"
import { groupBy } from "@/data"
import { Image, Box, Button, Link, Heading, useTheme, HStack, Flex, Spacer, useBreakpointValue } from "@chakra-ui/react"
import { ChevronLeftIcon, ChevronRightIcon, ChevronDownIcon, ChevronUpIcon } from '@chakra-ui/icons'
import { Link as NextLink } from "@chakra-ui/next-js"
import { useState } from "react"
import { Sidebar, SidebarVariant } from ".."
// eslint-disable-next-line import/no-internal-modules
import { FiChevronDown } from "react-icons/fi"

interface SidePanelProps {
    allProviders?: ProviderResponseModel[]
    currentProvider?: string
}

export const ProviderListSidebar: React.FC<SidePanelProps> = ({ allProviders, currentProvider }) => {
    const { colors } = useTheme()
    const groupedProviders = groupBy(allProviders, (provider) => provider.type ?? "")
    const currentProviderIndex = allProviders?.findIndex(provider => provider.name === currentProvider) ?? 0
    const [isSidebarOpen, setSidebarOpen] = useState(false)
    const variants = useBreakpointValue(
        {
            base: {
                navigation: SidebarVariant.DRAWER,
                navigationButton: true
            },
            md: {
                navigation: SidebarVariant.SIDEBAR,
                navigationButton: false
            }
        })

    const toggleSidebar = () => setSidebarOpen(!isSidebarOpen)

    if (!groupedProviders || !allProviders) return (<></>)

    const nextProvider = allProviders[(currentProviderIndex + 1) % allProviders.length]
    const prevProvider = allProviders[(currentProviderIndex - 1 + allProviders.length) % allProviders.length]

    return <>
        <Sidebar
            variant={variants?.navigation ?? SidebarVariant.DRAWER}
            isOpen={isSidebarOpen}
            onClose={toggleSidebar}
            drawerContent={<>
                <Flex backgroundColor={'whiteAlpha.100'} alignItems='center' gap={'2'} >
                    <Button variant={'ghost'} as={NextLink} href={`/providers/${prevProvider.name}`} leftIcon={<ChevronLeftIcon />} >
                        <Image alt={`${prevProvider.name}-image`} src={`/provider-icons/${prevProvider.name}.png`} sx={{
                            width: "1.5rem",
                            height: "1.5rem",
                            marginRight: "0.5rem"
                        }}
                        />
                        {prevProvider.name}
                    </Button>
                    <Spacer />
                    <Button variant={'ghost'} as={NextLink} href={`/providers/${nextProvider.name}`} leftIcon={<FiChevronDown />}>
                        More
                    </Button>
                    <Spacer />
                    <Button flex={3} variant={'ghost'} as={NextLink} href={`/providers/${nextProvider.name}`} rightIcon={<ChevronRightIcon />} >
                        <Image alt={`${nextProvider.name}-image`} src={`/provider-icons/${nextProvider.name}.png`} sx={{
                            width: "1.5rem",
                            height: "1.5rem",
                            marginRight: "0.5rem"
                        }}
                        />
                        {nextProvider.name}
                    </Button>
                </Flex>
            </>}
            sidebarContent={<>
                <Box overflowY="auto" maxHeight="100vh">
                    {Object.entries(groupedProviders).map(([type, providers]) => (
                        <Box key={type}>
                            <Heading sx={{ marginLeft: '1rem', cursor: 'default' }} className={'unselectable'} size="sm" mb={2} mt={2} color={colors.gray[500]}>{addSEnding(type)}</Heading>
                            {providers.map((provider) => (
                                <Link as={NextLink} href={`/providers/${provider.name}`} key={provider.name}>
                                    <Button
                                        variant="ghost"
                                        paddingLeft={'5px'}
                                        paddingRight={'5px'}
                                        width={'95%'}
                                        justifyContent="flex-start"
                                        leftIcon={<Image alt={`${provider.name}-image`} src={`/provider-icons/${provider.name}.png`} sx={{
                                            width: "1.5rem",
                                            height: "1.5rem",
                                        }}
                                        />}
                                        textAlign="left"
                                        mb={2}
                                        backgroundColor={currentProvider === provider.name ? 'pink.100' : undefined}
                                        colorScheme={currentProvider === provider.name ? 'blackAlpha.100' : undefined}
                                    >
                                        {provider.name}
                                    </Button>
                                </Link>
                            ))}
                        </Box>
                    ))}
                </Box >
            </>} />
    </>
}
function addSEnding(input: string): string {
    if (input.endsWith('s') || input === 'Mainnet') {
        return input
    } else {
        return input + 's'
    }
}
