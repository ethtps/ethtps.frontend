
import { Center, VStack } from "@chakra-ui/react"
import { ETHTPSDataCoreModelsResponseModelsProviderResponseModel } from 'ethtps.api'
import { useColors } from '../../../ethtps.components'
import { MobileNavItem } from "./MobileNavItem"
import { ThreeLinks } from "./ThreeLinks"
import { NAV_ITEMS } from "./Types"

export const MobileNav = (allProviders?: ETHTPSDataCoreModelsResponseModelsProviderResponseModel[]) => {
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