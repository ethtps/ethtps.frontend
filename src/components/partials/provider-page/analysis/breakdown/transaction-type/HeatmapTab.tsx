// eslint-disable-next-line import/no-internal-modules
import styles from '../../../../../../styles/app.module.scss'
import { ProviderResponseModel } from "@/api-client"
import { Heatmap } from "../.."
import { Text, Group, Modal, Paper, Space, Title, Center, Select } from "@mantine/core"
import { ChartActions, SocialButtons, useViewportRatio } from "@/components"
import { useDisclosure } from "@mantine/hooks"
import { useCallback, useState } from "react"

interface IHeatmapTabProps {
    provider: ProviderResponseModel
}

enum Breakdowns {
    tps = "transactions per second", gps = "gas per second", gtps = "gas-adjusted transactions per second"
}

enum BreakdownPeriods {
    year = "year", month = "month", day = "day", hourOfDay = "hour of day", dayOfWeek = "day of week"
}

const plusYearsShown = 1
const minusYearsShown = 1

export function HeatmapTab(props: Partial<IHeatmapTabProps>) {
    const [modelOpened, { open, close }] = useDisclosure(false);
    const ratio = useViewportRatio()
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
        </Modal>
        <Group>
            <Text className={'inline'} sx={{
                marginRight: '0.1rem',
                marginLeft: '0.1rem'
            }}>Average</Text>
            <Select
                className={'inline'}
                defaultValue={Breakdowns.tps}
                data={Object.values(Breakdowns).map(x => {
                    return { label: x, value: x }
                })}
            />
            <Text className={'inline'} sx={{
                marginRight: '0.1rem',
                marginLeft: '0.1rem'
            }}>grouped by</Text>
            <Select className={'inline'}
                defaultValue={BreakdownPeriods.year}
                data={Object.values(BreakdownPeriods).map(x => {
                    return { label: x, value: x }
                })}
            />
        </Group>
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