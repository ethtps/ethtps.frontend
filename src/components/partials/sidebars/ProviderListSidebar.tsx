import { ProviderResponseModel } from "@/api-client"
import { groupBy } from "@/data"
import { Image, Box, Button, Link, Heading, useTheme, HStack, Flex, Spacer } from "@chakra-ui/react"
import { ChevronLeftIcon, ChevronRightIcon, ChevronDownIcon, ChevronUpIcon } from '@chakra-ui/icons'
import { Link as NextLink } from "@chakra-ui/next-js"
import { useState } from "react"

interface SidePanelProps {
    allProviders?: ProviderResponseModel[]
    currentProvider?: string
    collapsed: boolean
}

export const ProviderListSidebar: React.FC<SidePanelProps> = ({ allProviders, currentProvider, collapsed }) => {
    const [isCollapsed, setIsCollapsed] = useState(collapsed)
    const { colors } = useTheme()
    const groupedProviders = groupBy(allProviders, (provider) => provider.type ?? "")
    const currentProviderIndex = allProviders?.findIndex(provider => provider.name === currentProvider)

    if (!groupedProviders || !allProviders) return (<></>)

    const nextProvider = allProviders[(currentProviderIndex + 1) % allProviders.length]
    const prevProvider = allProviders[(currentProviderIndex - 1 + allProviders.length) % allProviders.length]

    if (isCollapsed) {
        return (
            <Flex>
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
                <Button variant={'ghost'} onClick={() => setIsCollapsed(false)}>{<ChevronDownIcon />}
                    More
                </Button>
                <Spacer />
                <Button variant={'ghost'} as={NextLink} href={`/providers/${nextProvider.name}`} rightIcon={<ChevronRightIcon />} >
                    <Image alt={`${nextProvider.name}-image`} src={`/provider-icons/${nextProvider.name}.png`} sx={{
                        width: "1.5rem",
                        height: "1.5rem",
                        marginRight: "0.5rem"
                    }}
                    />
                    {nextProvider.name}
                </Button>
            </Flex>
        )
    }

    return (
        <Box overflowY="auto" maxHeight="100vh">
            <Button width={'100%'} leftIcon={<ChevronUpIcon />} onClick={() => setIsCollapsed(true)}>Hide</Button>
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
    )
}

function addSEnding(input: string): string {
    if (input.endsWith('s') || input === 'Mainnet') {
        return input
    } else {
        return input + 's'
    }
}
