import { ProviderResponseModel } from "@/api-client"
import { conditionalRender } from "@/services"
import { Paper, SegmentedControl } from "@mantine/core"
import { useState } from "react"
import { PeriodTab } from "./volume"
import { TransactionTypeTab } from ".."

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
    const [section, setSection] = useState<string | undefined>(selectedSection)
    return <>
        <SegmentedControl
            onChange={setSection}
            data={[
                { label: 'By transaction type', value: Breakdowns.transactionType },
                { label: 'By period', value: Breakdowns.period },
            ]}
        />
        <Paper
            sx={{
                paddingTop: '1rem',
            }}>
            {conditionalRender(<>
                <TransactionTypeTab{... { provider }} />
            </>, section === Breakdowns.transactionType)}
            {conditionalRender(<>
                <PeriodTab{... { provider }} />
            </>, section === Breakdowns.period)}
        </Paper>
    </>
}