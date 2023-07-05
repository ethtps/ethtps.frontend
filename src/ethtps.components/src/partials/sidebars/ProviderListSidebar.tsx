import { ProviderResponseModel } from "@/api-client"
import { groupBy } from "@/data"
import { Image, Box, Button, Link, Heading, useTheme, HStack, Text, Flex, Spacer, useBreakpointValue, useBoolean, SimpleGrid, Tag, Center, GridItem } from "@chakra-ui/react"
import { ChevronLeftIcon, ChevronRightIcon, ChevronDownIcon, ChevronUpIcon } from '@chakra-ui/icons'
import { Link as NextLink } from "@chakra-ui/next-js"
import { useState } from "react"
import { Sidebar, SidebarVariant } from ".."
// eslint-disable-next-line import/no-internal-modules
import { FiChevronDown, FiChevronUp } from "react-icons/fi"
import { useToggle } from "@mantine/hooks"
import { Theme, useColors } from "@/services"
import { motion } from "framer-motion"

const createProviderButton = (provider: ProviderResponseModel, key: string, colors: Theme, hasLeftIcon: boolean = false, hasRightIcon: boolean = false, width?: string, pad?: boolean) => <Button
    flex={3}
    key={key}
    variant={'ghost'}
    as={NextLink}
    href={`/providers/${provider.name}`}
    width={width}
    paddingLeft={pad ? "5px" : undefined}
    paddingRight={pad ? "5px" : undefined}
    justifyContent={'flex-start'}
    rightIcon={hasRightIcon ? <ChevronRightIcon color={colors.text} /> : undefined}
    leftIcon={hasLeftIcon ? <ChevronLeftIcon color={colors.text} /> : undefined} >
    <Image alt={`${provider.name}-image`} src={`/provider-icons/${provider.name}.png`} sx={{
        width: "20px",
        height: "20px",
        marginRight: "0.5rem"
    }}
    />
    <Text color={colors.text}>
        {provider.name}
    </Text>
</Button>

const createTypeTag = (type: string, colors: Theme) => <>
    <Tag
        fontWeight={'bold'}
        fontSize={'15px'}
        color={colors.text}
        bgColor={colors.background}
        sx={{
            marginTop: "0.5rem",
            marginBottom: "0.5rem"
        }}
        textAlign={'center'}>
        {addSEnding(type)}
    </Tag>
</>

interface SidePanelProps {
    allProviders?: ProviderResponseModel[]
    currentProvider?: string
    variant: SidebarVariant
}

export const ProviderListSidebar: React.FC<SidePanelProps> = ({ allProviders, currentProvider, variant = SidebarVariant.DRAWER }) => {
    const colors = useColors()
    const [showMore, setMore] = useBoolean()
    const groupedProviders = groupBy(allProviders, (provider) => provider.type ?? "")
    const currentProviderIndex = allProviders?.findIndex(provider => provider.name === currentProvider) ?? 0
    const [isSidebarOpen, setSidebarOpen] = useState(false)


    const toggleSidebar = () => setSidebarOpen(!isSidebarOpen)

    if (!groupedProviders || !allProviders) return (<></>)

    const nextProvider = allProviders[(currentProviderIndex + 1) % allProviders.length]
    const prevProvider = allProviders[(currentProviderIndex - 1 + allProviders.length) % allProviders.length]

    return <>
        <Sidebar
            variant={variant}
            isOpen={isSidebarOpen}
            onClose={toggleSidebar}
            drawerContent={<>
                <Flex backgroundColor={colors.backgroundLight} >
                    <Box>
                        {createProviderButton(prevProvider, 'prev-provider', colors, true, false)}
                    </Box>
                    <Spacer />
                    <Box sx={{
                        overflow: 'hidden',
                    }}>
                        <Button onClick={() => setMore.toggle()} variant={'ghost'} leftIcon={showMore ? <FiChevronUp /> : <FiChevronDown color={colors.text} />}>
                            {showMore ? 'Less' : 'More'}
                        </Button>
                    </Box>
                    <Spacer />
                    <Box>
                        {createProviderButton(nextProvider, 'next-provider', colors, false, true)}
                    </Box>
                </Flex>
                <Box
                    maxH={'50vh'}
                    overflow={showMore ? 'scroll' : 'hidden'}
                    sx={{ scrollbarWidth: showMore ? '5px' : 0 }}>
                    <motion.div initial={{
                        height: '0px'
                    }}
                        animate={{
                            height: showMore ? 'auto' : '0px'
                        }}
                        transition={{
                            type: 'tween',
                        }}>

                        <SimpleGrid columns={[2, 1]} spacing={10}>
                            {Object.entries(groupedProviders).map(([type, providers], q) => (<GridItem key={q}>
                                {createTypeTag(type, colors)}
                                {providers.map((x, l) => createProviderButton(x, l.toString(), colors, false, false, "100%", false))}
                            </GridItem>))}
                        </SimpleGrid>
                    </motion.div>
                </Box>
            </>}
            sidebarContent={<>
                <Box overflowY="auto" maxHeight="100vh">
                    {Object.entries(groupedProviders).map(([type, providers]) => (
                        <Box key={type}>
                            {createTypeTag(type, colors)}
                            {providers.map((provider) => <Box
                                key={provider.name}>
                                {createProviderButton(provider, provider.name ?? "", colors, false, true, "100%", true)}
                            </Box>)}
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
