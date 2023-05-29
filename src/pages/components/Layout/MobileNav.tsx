import { ProviderResponseModel } from "@/api-client"
import { ColorMode, VStack, useColorModeValue, Center } from "@chakra-ui/react"
import { MobileNavItem } from "./MobileNavItem"
import { ThreeLinks } from "./ThreeLinks"
import { NAV_ITEMS } from "./Types"
import { useColors } from "@/services"

export const MobileNav = (allProviders?: ProviderResponseModel[]) => {
    const colors = useColors()
    return (
        <VStack
            bg={colors.background}
            p={4}
            display={{ md: 'none' }}>
            {NAV_ITEMS(allProviders).map((navItem) => (
                <MobileNavItem key={navItem.label} {...navItem} />
            ))}
            <Center>
                <ThreeLinks />
            </Center>
        </VStack>
    )
}