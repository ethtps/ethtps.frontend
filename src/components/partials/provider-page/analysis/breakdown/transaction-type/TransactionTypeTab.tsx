import { ProviderResponseModel } from "@/api-client"
import { YearlyHeatmap } from "../../"
import { Title } from "@mantine/core"

interface ITransactionTypeTabProps {
    provider: ProviderResponseModel
}



export function TransactionTypeTab(props: Partial<ITransactionTypeTabProps>) {
    return <>
        <Title sx={{ marginLeft: '1rem' }} order={3}>Average TPS by day </Title>
        <YearlyHeatmap {...props} />
    </>
}