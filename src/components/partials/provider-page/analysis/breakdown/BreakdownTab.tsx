import { ProviderResponseModel } from "@/api-client"
import { conditionalRender } from "@/services"
import { Paper, SegmentedControl } from "@mantine/core"
import { useState } from "react"
import { PeriodTab } from "./volume"
import { HeatmapTab } from ".."

export enum Breakdowns {
    transactionType = 'txtype',
    period = 'period'
}

interface IBreakdownTabProps {
    provider: ProviderResponseModel
    selectedSection: string
}

export function BreakdownTab({
    provider,
    selectedSection = "txtype"
}: Partial<IBreakdownTabProps>) {
    return <>
        <HeatmapTab{... { provider }} />
    </>
}