import { ChevronDownIcon } from "@chakra-ui/icons"
import { ColorMode, useDisclosure, Stack, Flex, useColorModeValue, Icon, Collapse, Text } from "@chakra-ui/react"
import { Link } from "@chakra-ui/react"
import { NavItem } from "."
import { useColors } from "@/services"

export const MobileNavItem = ({ label, children, href }: NavItem) => {
    const { isOpen, onToggle } = useDisclosure()
    const colors = useColors()
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
                    color={colors.text}>
                    {label}
                </Text>
                {children && (
                    <Icon
                        as={ChevronDownIcon}
                        color={colors.primary}
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
                    borderColor={colors.primary}
                    color={colors.text}
                    align={'start'}>
                    {children &&
                        children.map((child: NavItem) => (
                            <Link key={child.label} py={2} href={child.href}>
                                <Text color={colors.text}>
                                    {child.label}
                                </Text>
                            </Link>
                        ))}
                </Stack>
            </Collapse>
        </Stack>
    )
}