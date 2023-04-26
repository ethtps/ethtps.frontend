import { MyResponsiveLine, useSizeRef } from "@/components";
import { Paper, Text, Title } from "@mantine/core";

export interface IProviderChartSectionProps {
}

export function ProviderChartSection(props: IProviderChartSectionProps) {
    const size = useSizeRef()
    return <>
        <Paper ref={size.ref}>
            <Paper>
                <Title order={3}>Historical chart</Title>
                <MyResponsiveLine />
            </Paper>
            <Paper>
                <Title order={3}>Gas per transaction</Title>
                <MyResponsiveLine />
            </Paper>
            <Paper>
                <Title order={3}>Comparison by transaction type</Title>
                <MyResponsiveLine />
            </Paper>
        </Paper>
    </>
}