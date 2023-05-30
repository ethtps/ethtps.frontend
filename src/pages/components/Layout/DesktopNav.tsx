import { ProviderResponseModel } from "@/api-client"
import { ColorMode, Text, Flex, Stack, Popover, PopoverTrigger, PopoverContent, Spacer, Box } from "@chakra-ui/react"
import { Link } from "@chakra-ui/layout"
import { DesktopSubNav } from "./DesktopSubNav"
import { NAV_ITEMS } from "./Types"
import { useColors } from "@/services"

export const DesktopNav = (allProviders?: ProviderResponseModel[]) => {
    const colors = useColors()
    return (
        <Flex>
            <Stack direction={'row'} spacing={4}>
                {NAV_ITEMS(allProviders).map((navItem) => (
                    <Box key={navItem.label}>
                        <Popover trigger={'hover'} placement={'auto'}>
                            <PopoverTrigger>
                                <Link
                                    p={2}
                                    href={navItem.href ?? '#'}
                                    fontSize={'sm'}
                                    fontWeight={500}
                                    color={colors.text}
                                    _hover={{
                                        textDecoration: 'none',
                                        color: colors.primary,
                                    }}>
                                    <Text color={colors.text}>{navItem.label}</Text>
                                </Link>
                            </PopoverTrigger>
                            {navItem.children && (
                                <PopoverContent
                                    border={0}
                                    boxShadow={'xl'}
                                    bg={colors.background}
                                    p={4}
                                    rounded={'xl'}
                                    minW={'md'}>
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
            <div style={{ width: '2rem' }} />
        </Flex>
    )
}

