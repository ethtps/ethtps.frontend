import { ProviderResponseModel } from "@/api-client"
import { YearlyHeatmap } from "../../"
import { Modal, Paper, Title } from "@mantine/core"
import { ChartActions, SocialButtons } from "@/components"
import { useDisclosure } from "@mantine/hooks"
import { createHandlerFromCallback, useHandler } from "@/data"

interface ITransactionTypeTabProps {
    provider: ProviderResponseModel
}

const availableYears = [2021, 2022, 2023, 2024, 2025, 2026, 2027, 2028, 2029, 2030]
const availableMonths = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
const availableDays = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31]

export function TransactionTypeTab(props: Partial<ITransactionTypeTabProps>) {
    const [modelOpened, { open, close }] = useDisclosure(false);
    const maximize = createHandlerFromCallback(() => open())
    return <>
        <Modal opened={modelOpened} size="calc(100vw - 1rem)" onClose={close} title={
            <SocialButtons />} centered>
            <>
                <YearlyHeatmap provider={props.provider} year={2022} interactive={true} />
            </>
        </Modal>
        <Title sx={{ marginLeft: '1rem' }} order={3}>Average TPS by day </Title>
        <div>
            <ChartActions
                showDownload
                showMaximize
                onMaximize={() => open()} />
        </div>
        <Paper sx={{
            padding: '1rem',
        }}>
            <YearlyHeatmap provider={props.provider} year={2022} interactive={true} />
        </Paper>
    </>
}