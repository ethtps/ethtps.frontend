import { ProviderResponseModel } from "@/api-client"
import { SegmentedControl } from "@mantine/core"

interface IBreakdownTabProps {
    provider: ProviderResponseModel
}

export function BreakdownTab(props: Partial<IBreakdownTabProps>) {
    return <>
        <SegmentedControl
            data={[
                { label: 'By transaction type', value: 'txtype' },
                { label: 'By period', value: 'period' },
            ]}
        />
    </>
}