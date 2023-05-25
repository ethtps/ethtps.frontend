// eslint-disable-next-line import/no-internal-modules
import styles from '../../../styles/app.module.scss'
import { ReactNode } from 'react'
import {
    Box,
    Flex,
    Avatar,
    Link,
    Button,
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    MenuDivider,
    useDisclosure,
    useColorModeValue,
    Stack,
    useColorMode,
    Text,
    Center,
    Tooltip,
} from '@chakra-ui/react'
import { MoonIcon, SunIcon } from '@chakra-ui/icons'
import { IconBrandDiscord, IconBrandGithub, IconBrandTwitter, IconMenu } from '@tabler/icons-react'

const NavLink = ({ children }: { children: ReactNode }) => (
    <Link
        px={2}
        py={1}
        rounded={'md'}
        _hover={{
            textDecoration: 'none',
            bg: useColorModeValue('gray.200', 'gray.700'),
        }}
        href={'#'}>
        {children}
    </Link>
)

export default function Navbar() {
    const { colorMode, toggleColorMode } = useColorMode()
    const { isOpen, onOpen, onClose } = useDisclosure()
    return (
        <>
            <Box bg={useColorModeValue('gray.100', 'gray.900')} px={4}>
                <Flex h={16} alignItems={'center'} justifyContent={'space-between'}>
                    <Box>
                        <Link href="/">
                            <Text className={styles.logoish}>ETHTPS.info</Text>
                        </Link>
                    </Box>

                    <Flex alignItems={'center'}>
                        <Stack direction={'row'} spacing={7} alignItems={'center'}>
                            <Stack direction={'row'} spacing={7} alignItems={'center'}>
                                <Link href={'https://twitter.com/ethtps'}>
                                    <Tooltip label="Follow us on Twitter" aria-label="twitter-button">
                                        <IconBrandTwitter style={{ stroke: colorMode === 'light' ? 'black' : 'white' }} />
                                    </Tooltip>
                                </Link>
                                <Link href={'https://discord.gg/jWPcsTzpCT'}>
                                    <Tooltip label="Join our Discord channel" aria-label="discord-button">
                                        <IconBrandDiscord style={{ stroke: colorMode === 'light' ? 'black' : 'white' }} />
                                    </Tooltip>
                                </Link>
                                <Link href={'https://github.com/orgs/ethtps/repositories'}>
                                    <Tooltip label="GitHub repo" aria-label="twitter-button">
                                        <IconBrandGithub style={{ stroke: colorMode === 'light' ? 'black' : 'white' }} />
                                    </Tooltip>
                                </Link>
                            </Stack>
                            <Button onClick={toggleColorMode}>
                                {colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
                            </Button>
                            <Menu>
                                <MenuButton as={Button} rounded={'full'} variant={'link'} cursor={'pointer'} minW={0}>
                                    <IconMenu />
                                </MenuButton>
                                <MenuList alignItems={'center'}>
                                    <br />
                                    <Center>
                                        <IconMenu />
                                    </Center>
                                    <br />
                                    <Center>
                                        <p>Username</p>
                                    </Center>
                                    <br />
                                    <MenuDivider />
                                    <MenuItem>Your Servers</MenuItem>
                                    <MenuItem>Account Settings</MenuItem>
                                    <MenuItem>Logout</MenuItem>
                                </MenuList>
                            </Menu>
                        </Stack>
                    </Flex>

                </Flex>
            </Box>
        </>
    )
}
