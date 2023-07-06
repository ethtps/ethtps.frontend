
import { Link } from "@chakra-ui/layout"
import { Box, Flex, Popover, PopoverContent, PopoverTrigger, Stack, Text } from "@chakra-ui/react"
import { ETHTPSDataCoreModelsResponseModelsProviderResponseModel } from 'ethtps.api'
import { useColors } from '../../../ethtps.components'
import { DesktopSubNav } from "./DesktopSubNav"
import { NAV_ITEMS } from "./Types"

export const DesktopNav = (allProviders?: ETHTPSDataCoreModelsResponseModelsProviderResponseModel[]) => {
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

