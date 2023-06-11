import { LineChart } from "@/components"
import { AllData } from "@/data"
import { Stack, Text } from "@chakra-ui/react"

export interface IProviderChartSectionProps {
    provider?: string
}

export function ProviderChartSection(props: IProviderChartSectionProps) {
    return <>
        <Stack>
            <Stack>
                <Text order={3}>Historical chart</Text>
                <LineChart provider={props.provider} width={500} height={300} />
            </Stack>
            <Stack>
                <Text order={3}>Gas per transaction</Text>
                <LineChart provider={props.provider} width={500} height={300} />
            </Stack>
            <Stack>
                <Text order={3}>Comparison by transaction type</Text>
                <LineChart provider={props.provider} width={500} height={300} />
            </Stack>
        </Stack>
    </>
}