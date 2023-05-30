import { StatGroup, Stat, StatLabel, StatNumber, StatHelpText, StatArrow } from "@chakra-ui/react"
import { useState } from "react"
import { SimpleStat, useLiveDataWithDelta } from "."

export function SimpleLiveDataStat() {
    const data = useLiveDataWithDelta()
    return <>
        <StatGroup>
            <SimpleStat data={data.tps} />
            <SimpleStat data={data.gps} />
            <SimpleStat data={data.gtps} />
        </StatGroup>
    </>
}