import { ChevronRightIcon } from "@chakra-ui/icons"
import { ColorMode, Popover, PopoverTrigger, useColorModeValue, Stack, Flex, Icon, PopoverContent, Box, Text } from "@chakra-ui/react"
import { NavItem } from "./Types"
import { Link } from "@chakra-ui/react"

export const DesktopSubNav = ({ label, href, subLabel, children, colorMode }: NavItem & {
    colorMode?: ColorMode
}) => {
    return (
        <Popover trigger="hover" placement="right-start">
            <PopoverTrigger>
                <Link
                    href={href}
                    role={'group'}
                    display={'block'}
                    p={2}
                    rounded={'md'}
                    _hover={{ bg: useColorModeValue('pink.50', 'gray.900') }}>
                    <Stack direction={'row'} align={'center'}>
                        <Box>
                            <Text
                                transition={'all .3s ease'}
                                _groupHover={{ color: 'pink.400' }}
                                fontWeight={500}>
                                {label}
                            </Text>
                            <Text fontSize={'sm'}>{subLabel}</Text>
                        </Box>
                        <Flex
                            transition={'all .3s ease'}
                            transform={'translateX(-10px)'}
                            opacity={0}
                            _groupHover={{ opacity: '100%', transform: 'translateX(0)' }}
                            justify={'flex-end'}
                            align={'center'}
                            flex={1}>
                            <Icon color={'pink.400'} w={5} h={5} as={ChevronRightIcon} />
                        </Flex>
                    </Stack>
                </Link>
            </PopoverTrigger>
            {children && (
                <PopoverContent
                    border={0}
                    boxShadow={'xl'}
                    bg={colorMode === 'light' ? 'white' : 'pink.50'}
                    p={4}
                    rounded={'md'}
                    maxW={'sm'}
                    w={'max-content'}>
                    <Stack>
                        {children.map((child, index) => (
                            <DesktopSubNav colorMode={colorMode} key={index} {...child} />
                        ))}
                    </Stack>
                </PopoverContent>
            )}
        </Popover>
    )
}