// eslint-disable-next-line import/no-internal-modules
import styles from '../../../../../../styles/app.module.scss'
import { ProviderResponseModel } from "@/api-client"
import { Heatmap } from "../../"
import { Text, Group, Modal, Paper, Space, Title, Container, Center } from "@mantine/core"
import { ChartActions, SocialButtons, useSizeRef, useViewportRatio } from "@/components"
import { range, useDisclosure } from "@mantine/hooks"
import { createHandlerFromCallback, useHandler } from "@/data"
import { useCallback, useState } from "react"
import { LogLevel } from "react-signalr"

interface ITransactionTypeTabProps {
    provider: ProviderResponseModel
}

enum Breakdowns {
    tps = "Transactions per second", gps = "Gas per second", gtps = "Gas-adjusted transactions per second"
}

enum BreakdownPeriods {
    year = "Year", month = "Month", day = "Day", hourOfDay = "Hour of day", dayOfWeek = "Day of week"
}

const availableYears = [2021, 2022, 2023, 2024, 2025, 2026, 2027, 2028, 2029, 2030]
const availableMonths = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
const availableDays = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31]
const plusYearsShown = 1
const minusYearsShown = 1

export function TransactionTypeTab(props: Partial<ITransactionTypeTabProps>) {
    const [modelOpened, { open, close }] = useDisclosure(false);
    const ratio = useViewportRatio()
    const maximize = createHandlerFromCallback(() => open())
    const [year, setYear] = useState<number>((new Date()).getFullYear())
    const [breakdown, setBreakdown] = useState<Breakdowns>(Breakdowns.tps)
    const [breakdownPeriod, setBreakdownPeriod] = useState<BreakdownPeriods>(BreakdownPeriods.year)

    const getHeatmap = useCallback(() => {
        return <>
            <Paper sx={{
                padding: '1rem',
            }}>
                <Heatmap
                    from={`${year - minusYearsShown}-01-01`}
                    to={`${year + plusYearsShown}-12-31`}
                    provider={props.provider}
                    interactive={true} />
            </Paper>
        </>
    }, [props.provider, year])
    const modalSize = useSizeRef()
    return <>
        <Modal
            fullScreen={ratio < 1.5}
            opened={modelOpened} size="calc(100vw - 1rem)" onClose={close} title={
                <Text className={styles.logoish}>ETHTPS.info</Text>
            } centered >
            <Group position='center'>
                <Title order={3}>Average TPS by day </Title>
                <SocialButtons />
            </Group>
            <Center>
                {getHeatmap()}
            </Center>
        </Modal >
        <Title sx={{ marginLeft: '1rem' }} order={3}>Average TPS by day </Title>
        <div>
            <ChartActions
                showDownload
                showMaximize
                onMaximize={() => open()} />
        </div>
        <Space h="xl" />
        {getHeatmap()}
    </>
}