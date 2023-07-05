import { LineChart } from "@/components"
import { Stack } from "@chakra-ui/react"

export interface IProviderChartSectionProps {
    provider?: string
}

export function ProviderChartSection(props: IProviderChartSectionProps) {
    return <>
        <Stack>
            <Stack>
                <LineChart title={'Historical data'} provider={props.provider} width={500} height={300} />
            </Stack>
            <Stack>
                <LineChart title={'Gas per transaction'} provider={props.provider} width={500} height={300} />
            </Stack>
        </Stack>
    </>
}