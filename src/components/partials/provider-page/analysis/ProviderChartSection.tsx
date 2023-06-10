import { LineChart } from "@/components"
import { Stack, Text } from "@chakra-ui/react"

export interface IProviderChartSectionProps {
    provider?: string
}

export function ProviderChartSection(props: IProviderChartSectionProps) {
    return <>
        <Stack>
            <Stack>
                <Text order={3}>Historical chart</Text>
                <LineChart width={500} height={300} />
            </Stack>
            <Stack>
                <Text order={3}>Gas per transaction</Text>
                <LineChart width={500} height={300} />
            </Stack>
            <Stack>
                <Text order={3}>Comparison by transaction type</Text>
                <LineChart width={500} height={300} />
            </Stack>
        </Stack>
    </>
}