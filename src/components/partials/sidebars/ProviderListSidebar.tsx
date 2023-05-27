import { ProviderResponseModel } from "@/api-client"
import { groupBy } from "@/data"
import { Image, Box, Button, Link, Heading, useTheme } from "@chakra-ui/react"
// eslint-disable-next-line import/no-internal-modules
import { useRouter } from "next/router"

import { Link as NextLink } from "@chakra-ui/next-js"

interface SidePanelProps {
    allProviders?: ProviderResponseModel[]
    currentProvider?: string
}

export const ProviderListSidebar: React.FC<SidePanelProps> = ({ allProviders, currentProvider }) => {
    const { colors } = useTheme()
    const router = useRouter()
    const groupedProviders = groupBy(allProviders, (provider) => provider.type ?? "")

    if (!groupedProviders) return (<></>)

    return (
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
                                backgroundColor={router.asPath === `/providers/${provider.name}` ? 'pink.100' : undefined}
                                colorScheme={router.asPath === `/providers/${provider.name}` ? 'blackAlpha.100' : undefined}
                            >
                                {provider.name}
                            </Button>
                        </Link>
                    ))}
                </Box>
            ))
            }
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
