import { Paper, Text } from "@mantine/core";

interface IProviderChartSectionProps {
}

export default function ProviderChartSection(props: IProviderChartSectionProps) {
    return <>
        <Paper sx={{ padding: '1rem' }}>
            <Text>
                Chart
            </Text>
        </Paper>
    </>
}