import { Drawer, DrawerOverlay, DrawerContent, DrawerCloseButton, DrawerHeader, DrawerBody, Box } from "@chakra-ui/react"
import { SidebarVariant } from ".."

interface Props {
    onClose: () => void
    isOpen: boolean
    variant: SidebarVariant
    sidebarContent?: React.ReactNode,
    drawerContent?: React.ReactNode | null
}

export const Sidebar = ({
    isOpen,
    variant,
    onClose,
    sidebarContent,
    drawerContent
}: Props) => {
    return variant === SidebarVariant.SIDEBAR ? (
        <Box
            position="fixed"
            left={0}
            p={5}
            w="250px"
            top={50}
            bottom={50}
        >
            {sidebarContent}
        </Box>
    ) : (<>
        {drawerContent}
    </>)
}