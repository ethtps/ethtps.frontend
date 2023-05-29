import { ProviderResponseModel } from "@/api-client"
import { ColorMode, useColorModeValue, Flex, Stack, Popover, PopoverTrigger, PopoverContent, Spacer, Box } from "@chakra-ui/react"
import { Link } from "@chakra-ui/layout"
import { DesktopSubNav } from "./DesktopSubNav"
import { NAV_ITEMS } from "./Types"

export const DesktopNav = (allProviders?: ProviderResponseModel[], colorMode?: ColorMode) => {
    const linkColor = useColorModeValue('white', 'pink.50')
    const linkHoverColor = useColorModeValue('gray.800', 'white')
    const popoverContentBgColor = useColorModeValue('white', 'gray.800')

    return (
        <Flex>
            <Stack direction={'row'} spacing={4}>
                {NAV_ITEMS(allProviders).map((navItem) => (
                    <Box key={navItem.label}>
                        <Popover trigger={'hover'} placement={'bottom-start'}>
                            <PopoverTrigger>
                                <Link
                                    p={2}
                                    href={navItem.href ?? '#'}
                                    fontSize={'sm'}
                                    fontWeight={500}
                                    color={linkColor}
                                    _hover={{
                                        textDecoration: 'none',
                                        color: linkHoverColor,
                                    }}>
                                    {navItem.label}
                                </Link>
                            </PopoverTrigger>

                            {navItem.children && (
                                <PopoverContent
                                    border={0}
                                    boxShadow={'xl'}
                                    bg={popoverContentBgColor}
                                    p={4}
                                    rounded={'xl'}
                                    minW={'sm'}>
                                    <Stack>
                                        {navItem.children.map((child) => (
                                            <DesktopSubNav key={child.label} {...child} />
                                        ))}
                                    </Stack>
                                </PopoverContent>
                            )}
                        </Popover>
                    </Box>
                ))}
            </Stack>
            <Spacer />
        </Flex>
    )
}

