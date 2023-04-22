import { MyResponsiveLine, NonSSRWrapper, useSizeRef } from "@/components";
import { Paper, Text, Title } from "@mantine/core";

interface IProviderChartSectionProps {
}

export default function ProviderChartSection(props: IProviderChartSectionProps) {
    const size = useSizeRef()
    return <>
        <Paper ref={size.ref}>
            <Title order={3}>Historical chart</Title>
            <NonSSRWrapper>
                <MyResponsiveLine />
            </NonSSRWrapper>
        </Paper>
    </>
}