import { Box } from "@chakra-ui/react"
import { SidebarVariant } from ".."
import { useColors } from "../../.."

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
    const colors = useColors()
    return variant === SidebarVariant.SIDEBAR ? (
        <Box
            bgColor={colors.backgroundLight}
            position='fixed'
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