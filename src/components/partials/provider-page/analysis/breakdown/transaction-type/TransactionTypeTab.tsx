import { ProviderResponseModel } from "@/api-client"
import { YearlyHeatmap } from "../../"
import { Paper, Title } from "@mantine/core"
import { ChartActions } from "@/components"

interface ITransactionTypeTabProps {
    provider: ProviderResponseModel
}



export function TransactionTypeTab(props: Partial<ITransactionTypeTabProps>) {
    return <>
        <Title sx={{ marginLeft: '1rem' }} order={3}>Average TPS by day </Title>

        <Paper sx={{
            padding: '1rem',
        }}>
            <ChartActions showDownload showMaximize />
            <YearlyHeatmap provider={props.provider} year={2022} interactive={true} />
        </Paper>
    </>
}