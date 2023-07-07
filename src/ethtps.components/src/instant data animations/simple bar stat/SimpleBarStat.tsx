
import { Box, Container } from "@chakra-ui/react"
import { Dictionary } from "@reduxjs/toolkit"
import { IComponentSize, useColors } from "../../.."
import { L2DataUpdateModel } from "../../../../ethtps.data/src"
import { LiveDataWithDelta, SimpleLiveDataStat } from "../simple stat"

interface ISimpleBarStatProps extends IComponentSize {
    newestData?: Dictionary<L2DataUpdateModel>
    liveData: LiveDataWithDelta
    connected: boolean
}

export function SimpleBarStat(props: ISimpleBarStatProps): JSX.Element {
    const colors = useColors()
    return <>
        <Container
            w={props.width}
            sx={{
                margin: 0,
                padding: 0,
            }}>
            <SimpleLiveDataStat
                absolute
                fillWidth
                connected={props.connected}
                data={props.liveData}
                w={props.width} />
            <Box w={props.width} h={props.height} bg={colors.tertiary} borderRadius="lg" overflow="hidden">

            </Box>
        </Container>
    </>
}