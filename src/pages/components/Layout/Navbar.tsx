// eslint-disable-next-line import/no-internal-modules
import styles from '../../../styles/app.module.scss'
import {
    Box,
    Flex,
    Text,
    IconButton,
    Button,
    Collapse,
    Link,
    useDisclosure,
    useColorMode,
    HStack,
    Spacer,
} from '@chakra-ui/react'
import {
    HamburgerIcon,
    CloseIcon,
    MoonIcon,
    SunIcon,
} from '@chakra-ui/icons'
import { ThreeLinks } from './ThreeLinks'
import { DesktopNav } from './DesktopNav'
import { MobileNav } from './MobileNav'
import { useColors } from '@/services'

export interface INavbarProps {
    allProviders?: any[]
}

export default function Navbar({ allProviders }: INavbarProps) {
    const { colorMode, toggleColorMode } = useColorMode()
    const { isOpen, onOpen, onClose, onToggle } = useDisclosure()
    const colors = useColors()
    return (
        <Box >
            <Flex
                top={0}
                color={colors.text}
                h={'60px'}
                py={{ base: 2 }}
                px={{ base: 4 }}
                borderBottom={1}
                borderStyle={'solid'}
                borderColor={colors.background}
                sx={{
                    background: colors.background
                }}
                alignContent={'center'}
                w={'100%'}
            >
                <Box>
                    <Link href="/">
                        <Text className={styles.logoish}>ETHTPS.info</Text>
                    </Link>
                </Box>
                <Spacer />
                <HStack
                    flex={{ base: 2, md: 0 }}
                    justify={'space-between'} // Changed this from 'flex-start' to 'space-between'
                    direction={'row'}
                    spacing={6}
                >
                    <Flex
                        flex={{ base: 2 }}
                        justify={{ base: 'start', md: 'start' }}>
                        <Flex display={{ base: 'none', md: 'flex' }} ml={10}>
                            <Box>
                                {DesktopNav(allProviders)}
                            </Box>
                            <Spacer />
                            <ThreeLinks />
                        </Flex>
                    </Flex>
                    <Button onClick={toggleColorMode}>
                        {colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
                    </Button>
                    <Flex
                        flex={{ base: 1, md: 'auto' }}
                        ml={{ base: -2 }}
                        display={{ base: 'flex', md: 'none' }}
                    >
                        <IconButton
                            onClick={onToggle}
                            icon={
                                isOpen ? <CloseIcon w={3} h={3} /> : <HamburgerIcon w={5} h={5} />
                            }
                            variant={'ghost'}
                            aria-label={'Toggle Navigation'}
                        />
                    </Flex>
                </HStack>
            </Flex>


            <Collapse in={isOpen} animateOpacity>
                {MobileNav(allProviders)}
            </Collapse>
        </Box>
    )
}

