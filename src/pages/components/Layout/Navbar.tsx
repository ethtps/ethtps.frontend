'use client'
// eslint-disable-next-line import/no-internal-modules
import styles from '../../../styles/app.module.scss'
import {
    Box,
    Flex,
    Text,
    IconButton,
    Button,
    Stack,
    Collapse,
    Icon,
    Link,
    Popover,
    PopoverTrigger,
    PopoverContent,
    useColorModeValue,
    useDisclosure,
    Center,
    useColorMode,
    HStack,
    Spacer,
    VStack,
    ColorMode,
} from '@chakra-ui/react'
import {
    HamburgerIcon,
    CloseIcon,
    ChevronDownIcon,
    ChevronRightIcon,
    MoonIcon,
    SunIcon,
} from '@chakra-ui/icons'
import { ThreeLinks } from './ThreeLinks'
import { ProviderResponseModel } from '@/api-client'

export interface INavbarProps {
    allProviders?: any[]
}

export default function Navbar({ allProviders }: INavbarProps) {
    const { colorMode, toggleColorMode } = useColorMode()
    const { isOpen, onOpen, onClose, onToggle } = useDisclosure()
    return (
        <Box>
            <Flex
                bg={useColorModeValue('white', 'gray.800')}
                color={useColorModeValue('gray.600', 'white')}
                minH={'60px'}
                py={{ base: 2 }}
                px={{ base: 4 }}
                borderBottom={1}
                borderStyle={'solid'}
                borderColor={useColorModeValue('gray.200', 'gray.900')}>
                <Flex
                    flex={{ base: 1, md: 'auto' }}
                    ml={{ base: -2 }}
                    display={{ base: 'flex', md: 'none' }}>
                    <IconButton
                        onClick={onToggle}
                        icon={
                            isOpen ? <CloseIcon w={3} h={3} /> : <HamburgerIcon w={5} h={5} />
                        }
                        variant={'ghost'}
                        aria-label={'Toggle Navigation'}
                    />
                </Flex>
                <Link href="/">
                    <Text className={styles.logoish}>ETHTPS.info</Text>
                </Link>
                <HStack
                    flex={{ base: 1, md: 0 }}
                    justify={'flex-start'}
                    direction={'row'}
                    spacing={6}>
                    <Flex flex={{ base: 1 }} justify={{ base: 'flex-start', md: 'start' }}>
                        <Flex display={{ base: 'none', md: 'flex' }} ml={10}>
                            {DesktopNav(allProviders, colorMode)}
                            <ThreeLinks />
                        </Flex>
                    </Flex>
                    <Button onClick={toggleColorMode}>
                        {colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
                    </Button>
                </HStack>
            </Flex>

            <Collapse in={isOpen} animateOpacity>
                {MobileNav(allProviders, colorMode)}
            </Collapse>
        </Box>
    )
}

const DesktopNav = (allProviders?: ProviderResponseModel[], colorMode?: ColorMode) => {
    const linkColor = useColorModeValue('gray.600', 'gray.200')
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

const DesktopSubNav = ({ label, href, subLabel, children, colorMode }: NavItem & {
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
                    bg={colorMode === 'light' ? 'white' : 'gray.800'}
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

const MobileNav = (allProviders?: ProviderResponseModel[], colorMode?: ColorMode) => {
    return (
        <VStack
            bg={useColorModeValue('gray.50', 'gray.800')}
            p={4}
            display={{ md: 'none' }}>
            {NAV_ITEMS(allProviders).map((navItem) => (
                <MobileNavItem colorMode={colorMode} key={navItem.label} {...navItem} />
            ))}
            <Center>
                <ThreeLinks colorMode={colorMode} />
            </Center>
        </VStack>
    )
}

const MobileNavItem = ({ label, children, href, colorMode }: NavItem & {
    colorMode?: ColorMode
}) => {
    const { isOpen, onToggle } = useDisclosure()

    return (
        <Stack spacing={4} onClick={children && onToggle}>
            <Flex
                py={2}
                as={Link}
                href={href ?? '#'}
                justify={'space-between'}
                align={'center'}
                _hover={{
                    textDecoration: 'none',
                }}>
                <Text
                    fontWeight={600}
                    color={useColorModeValue('gray.600', 'gray.200')}>
                    {label}
                </Text>
                {children && (
                    <Icon
                        as={ChevronDownIcon}
                        transition={'all .25s ease-in-out'}
                        transform={isOpen ? 'rotate(180deg)' : ''}
                        w={6}
                        h={6}
                    />
                )}
            </Flex>

            <Collapse in={isOpen} animateOpacity style={{ marginTop: '0!important' }}>
                <Stack
                    mt={2}
                    pl={4}
                    borderLeft={1}
                    borderStyle={'solid'}
                    borderColor={useColorModeValue('gray.200', 'gray.700')}
                    align={'start'}>
                    {children &&
                        children.map((child) => (
                            <Link key={child.label} py={2} href={child.href}>
                                {child.label}
                            </Link>
                        ))}
                </Stack>
            </Collapse>
        </Stack>
    )
}

interface NavItem {
    label: string
    subLabel?: string
    children?: Array<NavItem>
    href?: string
}

const NAV_ITEMS = (allProviders?: ProviderResponseModel[]): Array<NavItem> => [
    {
        label: 'Networks',
        children: [
            {
                label: 'All networks',
                subLabel: 'Ethereum L2s, sidechains, and more',
                href: '/networks',
                children: allProviders?.map((provider) => ({
                    label: provider.name ?? "",
                    subLabel: "",
                    href: `/networks/${provider.name}`,
                })),
            },
            {
                label: 'How Ethereum scales',
                subLabel: 'Current Ethereum model and the future of Ethereum scaling',
                href: '/how-ethereum-scales',
            },
        ],
    },
    {
        label: 'API',
        href: '#',
    },
    {
        label: 'About',
        href: '#',
    },
]
