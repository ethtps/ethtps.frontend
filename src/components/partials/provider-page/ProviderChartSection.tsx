import { MyResponsiveLine, NonSSRWrapper, useSizeRef } from "@/components";
import { Paper, Text, Title } from "@mantine/core";

interface IProviderChartSectionProps {
}

export default function ProviderChartSection(props: IProviderChartSectionProps) {
    const size = useSizeRef()
    return <>
        <Paper ref={size.ref}>
            <Paper>
                <Title order={3}>Historical chart</Title>
                <MyResponsiveLine />
            </Paper>
            <Paper>
                <Title order={3}>Cumulative [mode] chart</Title>
                <MyResponsiveLine />
            </Paper>
        </Paper>
    </>
}