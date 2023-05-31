import { IComponentSize } from "@/components"
import { L2DataUpdateModel } from "@/data"
import { useColors } from "@/services"
import { Box } from "@chakra-ui/react"
import { Dictionary } from "@reduxjs/toolkit"

interface ISimpleBarStatProps extends IComponentSize {
    newestData?: Dictionary<L2DataUpdateModel>
}

export function SimpleBarStat(props: ISimpleBarStatProps) {
    const colors = useColors()
    return <>
        <Box w={props.width} h={props.height} bg={colors.secondary} borderRadius="lg" overflow="hidden">

        </Box>
    </>
}