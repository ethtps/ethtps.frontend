import { MyResponsiveLine, useSizeRef } from "@/components"
import { Stack, Text } from "@chakra-ui/react"

export interface IProviderChartSectionProps {
}

export function ProviderChartSection(props: IProviderChartSectionProps) {
    const size = useSizeRef()
    return <>
        <Stack ref={size.ref}>
            <Stack>
                <Text order={3}>Historical chart</Text>
                <MyResponsiveLine />
            </Stack>
            <Stack>
                <Text order={3}>Gas per transaction</Text>
                <MyResponsiveLine />
            </Stack>
            <Stack>
                <Text order={3}>Comparison by transaction type</Text>
                <MyResponsiveLine />
            </Stack>
        </Stack>
    </>
}